// Auth0 client + React hook for the Delt Capital SPA.
//
// Loaded after app/shared.jsx and before any page that uses auth. Mirrors
// the window.DELT pattern in shared.jsx — no module system, just attaches
// to the global window so every JSX file can reach it without imports.
//
// Configuration comes from window.DELT_AUTH_CONFIG (set in index.html).
//
// Public API on window.DELT_AUTH:
//   useAuth()                      — React hook → { isLoading, isAuthenticated, user, error, login, logout, getToken }
//   login(connection, opts?)       — opens an Auth0 popup for the given connection
//                                       'Username-Password-Authentication' | 'google-oauth2' |
//                                       'apple' | 'facebook' | 'windowslive' | 'email'
//   logout()                       — clears local session, returns to home
//   getToken()                     — Promise<string> bearer token for /api/* calls
//   onChange(fn) / offChange(fn)   — subscribe to auth-state changes (used by useAuth)
//   ready                          — Promise that resolves when initial state is settled
//
// The "no intermediary screen" UX comes from two pieces working together:
//   1. Auth0 Custom Domain → the popup URL is login.deltcapital.com, not *.auth0.com
//   2. loginWithPopup() → the main page never navigates; the popup is small,
//      branded via New Universal Login, and closes on success.
// Social connections (google-oauth2, apple, facebook, windowslive) skip the
// Auth0 UI entirely — the popup goes straight to the provider's consent screen.

(function setupDeltAuth() {
  const CFG = window.DELT_AUTH_CONFIG || {};
  const FACTORY = window.auth0 && window.auth0.createAuth0Client;

  // ---------------------------------------------------------------------
  // Tiny pub-sub. We re-render hooks on every state change.
  // ---------------------------------------------------------------------
  const listeners = new Set();
  let state = {
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  };
  function setState(patch) {
    state = { ...state, ...patch };
    listeners.forEach((fn) => { try { fn(state); } catch (e) { /* ignore */ } });
  }

  // ---------------------------------------------------------------------
  // Client init — singleton, lazy. The script loads on every page so we
  // don't want to spin up the SDK until something actually asks for it.
  // ---------------------------------------------------------------------
  let clientPromise = null;

  function getClient() {
    if (clientPromise) return clientPromise;
    if (!FACTORY) {
      const err = new Error('auth0-spa-js script not loaded');
      setState({ isLoading: false, error: err });
      clientPromise = Promise.reject(err);
      return clientPromise;
    }
    if (!CFG.domain || !CFG.clientId || /REPLACE_WITH/.test(String(CFG.domain) + CFG.clientId)) {
      const err = new Error('window.DELT_AUTH_CONFIG is missing real values — set domain + clientId in index.html');
      setState({ isLoading: false, error: err });
      clientPromise = Promise.reject(err);
      return clientPromise;
    }
    clientPromise = FACTORY({
      domain: CFG.domain,
      clientId: CFG.clientId,
      authorizationParams: {
        audience: CFG.audience,
        redirect_uri: window.location.origin,
        scope: 'openid profile email',
      },
      // Survive page reloads without forcing a silent renew round-trip on
      // every load. Refresh tokens are stored in localStorage; rotation is
      // on by default in the SDK so a stolen token has a short window.
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    });
    return clientPromise;
  }

  // ---------------------------------------------------------------------
  // Boot: handle the redirect-callback edge case (Safari blocks popups in
  // some contexts → fallback to redirect), then refresh state.
  // ---------------------------------------------------------------------
  const ready = (async () => {
    try {
      const client = await getClient();
      const search = window.location.search;
      if (search.includes('code=') && search.includes('state=')) {
        try {
          await client.handleRedirectCallback();
        } catch (e) {
          // Stale callback (e.g. user pressed back) — ignore, just clean URL.
        }
        // Strip ?code=&state= from the URL so refreshes don't re-run.
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      const isAuthenticated = await client.isAuthenticated();
      const user = isAuthenticated ? await client.getUser() : null;
      setState({ isLoading: false, isAuthenticated, user, error: null });
    } catch (err) {
      setState({ isLoading: false, isAuthenticated: false, user: null, error: err });
    }
  })();

  // ---------------------------------------------------------------------
  // Imperative API.
  // ---------------------------------------------------------------------
  async function login(connection, opts = {}) {
    const client = await getClient();
    const authorizationParams = { ...(opts.authorizationParams || {}) };
    if (connection) authorizationParams.connection = connection;
    if (opts.loginHint) authorizationParams.login_hint = opts.loginHint;
    try {
      await client.loginWithPopup({ authorizationParams });
      const isAuthenticated = await client.isAuthenticated();
      const user = isAuthenticated ? await client.getUser() : null;
      setState({ isAuthenticated, user, error: null });
      return { ok: true, user };
    } catch (err) {
      // PopupCancelledError / PopupTimeoutError / PopupBlockedError fall
      // through here. Surface a stable shape to the caller without
      // tearing the whole UI.
      setState({ error: err });
      return { ok: false, error: err };
    }
  }

  async function logout() {
    const client = await getClient();
    setState({ isAuthenticated: false, user: null });
    return client.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  async function getToken() {
    const client = await getClient();
    return client.getTokenSilently();
  }

  function onChange(fn) { listeners.add(fn); }
  function offChange(fn) { listeners.delete(fn); }

  // ---------------------------------------------------------------------
  // React hook.
  // ---------------------------------------------------------------------
  function useAuth() {
    const [snap, setSnap] = React.useState(state);
    React.useEffect(() => {
      const fn = (next) => setSnap(next);
      onChange(fn);
      // Snap to latest in case state changed before the effect ran.
      setSnap(state);
      return () => offChange(fn);
    }, []);
    return {
      ...snap,
      login,
      logout,
      getToken,
    };
  }

  // ---------------------------------------------------------------------
  // Convenience: a `fetch` wrapper that attaches the bearer token. Use
  // for any /api/* call that requires auth.
  //   await DELT_AUTH.authedFetch('/api/plaid-create-link-token', { method: 'POST', body: ... })
  // ---------------------------------------------------------------------
  async function authedFetch(input, init = {}) {
    const token = await getToken();
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  }

  window.DELT_AUTH = {
    useAuth,
    login,
    logout,
    getToken,
    authedFetch,
    onChange,
    offChange,
    ready,
    getState: () => state,
  };
})();
