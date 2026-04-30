// Auth0 JWT verification for Vercel serverless functions.
//
// Required Vercel env vars (matching the SPA frontend in app/auth.jsx):
//   AUTH0_ISSUER     — token issuer URL, e.g. https://login.deltcapital.com/
//                       NOTE: Auth0 issues tokens with a trailing slash.
//   AUTH0_AUDIENCE   — API audience the SPA requests, e.g. https://api.deltcapital.com
//
// Usage in a handler:
//   const { verifyAuth0Token, AuthError } = require('./_auth');
//   try {
//     const { sub } = await verifyAuth0Token(req);
//     // …trusted user id available as `sub`
//   } catch (err) {
//     if (err instanceof AuthError) {
//       res.status(401).json({ error: err.message });
//       return;
//     }
//     throw err;
//   }

const { jwtVerify, createRemoteJWKSet } = require('jose');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

// Cache the JWKS resolver across invocations on the same warm Lambda — `jose`
// already does in-memory caching of fetched keys so this is essentially free.
let cachedJwks = null;
let cachedJwksIssuer = null;

function getJwks(issuer) {
  if (cachedJwks && cachedJwksIssuer === issuer) return cachedJwks;
  const jwksUrl = new URL('.well-known/jwks.json', issuer);
  cachedJwks = createRemoteJWKSet(jwksUrl);
  cachedJwksIssuer = issuer;
  return cachedJwks;
}

function readBearer(req) {
  const header = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  const m = /^Bearer\s+(.+)$/i.exec(header);
  return m ? m[1].trim() : null;
}

async function verifyAuth0Token(req) {
  const issuer = process.env.AUTH0_ISSUER;
  const audience = process.env.AUTH0_AUDIENCE;
  if (!issuer || !audience) {
    throw new Error('Missing AUTH0_ISSUER or AUTH0_AUDIENCE');
  }

  const token = readBearer(req);
  if (!token) throw new AuthError('Missing bearer token');

  let payload;
  try {
    const result = await jwtVerify(token, getJwks(issuer), {
      issuer,
      audience,
      algorithms: ['RS256'],
    });
    payload = result.payload;
  } catch (err) {
    throw new AuthError('Invalid or expired token');
  }

  if (!payload.sub) throw new AuthError('Token missing sub');
  return { sub: payload.sub, payload };
}

module.exports = { verifyAuth0Token, AuthError };
