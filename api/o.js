// Email open-tracking pixel. Lead emails embed
//   <img src="https://deltcapital.com/api/o?l=<leadId>&c=<campaign>&v=<variant>&m=<b64url email>">
// and each fetch records an `opened` row in outreach_events (Delt
// Backend database) so the Outreach page can show open counts.
//
// Always answers with a 1×1 transparent GIF, no matter what — a broken
// image in a lead's inbox is never acceptable, so the recording is
// fire-and-forget and errors are swallowed.
//
// Accuracy caveat (documented for the operator): Apple Mail Privacy
// Protection and Gmail image proxies pre-fetch images, so opens are an
// upper bound, not gospel. Clicks (utm-tagged) are the reliable signal.

const { recordOutreach, b64urlDecode } = require('./_outreach');

// Smallest valid transparent GIF (43 bytes).
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url || '/', 'http://x');
    const leadId   = (url.searchParams.get('l') || '').trim() || null;
    const campaign = (url.searchParams.get('c') || '').trim() || 'unknown';
    const variant  = (url.searchParams.get('v') || '').trim() || null;
    const email    = b64urlDecode(url.searchParams.get('m') || '') || null;

    // Record without blocking the image response longer than needed.
    await recordOutreach({
      leadId,
      leadEmail: email,
      campaign,
      event: 'opened',
      variant,
      meta: { ua: req.headers['user-agent'] || null },
    });
  } catch (_) { /* pixel must always render */ }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Length', String(PIXEL.length));
  // no-store so repeat opens re-fetch instead of hitting a cache.
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.end(PIXEL);
};
