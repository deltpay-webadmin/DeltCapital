/**
 * Meta Pixel helper for DeltCapital (Pixel ID 3142121879304554).
 *
 * DeltCapital is a Babel-in-the-browser JSX app with no build step,
 * so this file is a plain <script> that attaches its API to
 * `window.DeltPixel` for the JSX modules to consume.
 *
 * The base pixel is injected in index.html and fires PageView on
 * hard-load. Since this app is a single-page experience navigated
 * via internal state (see variation-1.jsx navTo/openApp) there's no
 * URL change to hook — most conversions happen via modal open/close,
 * which we track with named helpers at the exact event boundaries.
 *
 * All calls are guarded so they no-op if the pixel script hasn't
 * loaded (e.g. ad-blockers). Analytics must never throw into the UI.
 */
(function (window) {
  'use strict';

  function safeTrack(command, eventName, params) {
    try {
      if (typeof window === 'undefined') return;
      if (typeof window.fbq !== 'function') return;
      window.fbq(command, eventName, params);
    } catch (_) {
      /* analytics must never throw */
    }
  }

  var DeltPixel = {
    /** Fire a Meta standard event. Prefer this over `custom`. */
    track: function (eventName, params) {
      safeTrack('track', eventName, params);
    },

    /** Fire a custom event (only when no standard event fits). */
    custom: function (eventName, params) {
      safeTrack('trackCustom', eventName, params);
    },

    // ─── Named helpers, one per funnel milestone ──────────────────

    /**
     * Estimate/lead-gate submitted from the calculator. Uses the
     * user's high-end estimate as value so Meta can run Value
     * Optimization on prospecting campaigns.
     */
    calculatorLead: function (estimateHigh) {
      safeTrack('track', 'Lead', {
        value: Number(estimateHigh) || 0,
        currency: 'USD',
        content_category: 'capital_estimate',
      });
    },

    /**
     * Apply modal opened — user is starting the capital application.
     * Meta's canonical mid-funnel signal.
     */
    applyStarted: function (amount, fromEmail) {
      safeTrack('track', 'InitiateCheckout', {
        value: Number(amount) || 0,
        currency: 'USD',
        content_category: 'capital_application',
        content_name: fromEmail ? 'email_deeplink' : 'web',
      });
    },

    /**
     * Bank connected via Plaid inside the apply flow. Uses
     * AddPaymentInfo (Meta's standard event for "user handed over
     * payment/bank info") — no exact match for "bank connected".
     */
    bankConnected: function (amount, institution) {
      safeTrack('track', 'AddPaymentInfo', {
        value: Number(amount) || 0,
        currency: 'USD',
        content_category: 'capital_application',
        content_name: institution || null,
      });
    },

    /**
     * Application submitted — user cleared every step and clicked
     * Accept offer. This is the primary DeltCapital conversion
     * until real "funded" events flow in via CAPI.
     */
    applicationSubmitted: function (amount) {
      safeTrack('track', 'SubmitApplication', {
        value: Number(amount) || 0,
        currency: 'USD',
        content_category: 'capital_application',
      });
    },

    /**
     * Booking / specialist call requested (talk-to-us flow).
     */
    contactBooked: function () {
      safeTrack('track', 'Contact', {
        content_category: 'capital_booking',
      });
    },
  };

  window.DeltPixel = DeltPixel;
})(typeof window !== 'undefined' ? window : this);
