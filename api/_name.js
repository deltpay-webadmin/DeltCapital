// Name sanitizer for anything we're about to render back at a lead.
//
// Why this exists: `leads.first_name` is a free-text column fed by three
// different writers, and one of them (api/apply-lead.js) concatenates two
// client-supplied fields into it because the table has no `last_name`
// column. Browser autofill, half-finished forms, and CRM round-trips push
// the literal strings "null" / "undefined" / "N/A" into those fields.
//
// Every consumer downstream guarded with a truthiness check —
//   const name = firstName ? String(firstName).trim() : '';
// — and the string "Null Null" is perfectly truthy. So a real lead received
// an email headlined "Null Null — your offer is ready to claim." and greeted
// "Hey Null Null,". That's the bug this module closes.
//
// Underscore-prefixed so Vercel doesn't expose it as an HTTP endpoint, and
// deliberately dependency-free: the write-path callers (apply-lead, _store,
// _deeplink) must be able to import it without pulling in email chrome.

// Tokens that are never a real name. Matched whole-token only and
// case-insensitively, so "Nullingham" and "Nadia" survive untouched.
//
// Note what is NOT here: "test". It shows up inside real surnames, and
// silently dropping a genuine lead's name costs us more than catching the
// occasional QA row is worth. Operator-facing emails render the raw column
// anyway (see api/sms-nudge.js internalNudgeBody), so David still sees
// exactly what the lead typed.
const JUNK_TOKENS = new Set([
  'null', 'undefined', 'nan', 'nil', 'none', 'na', 'n/a',
  'unknown', 'test123', '-', '--', '.', '_',
]);

// Characters we allow through: letters (any script), combining marks for
// accents, plus the punctuation that appears in real names. Everything else
// — digits, control chars, angle brackets, emoji — is stripped before we
// decide whether anything usable is left.
const ALLOWED = /[^\p{L}\p{M} '.\-]/gu;
const HAS_LETTER = /\p{L}/u;

// Title-case a single token, but only when it's uniformly cased. "maria"
// and "MARIA" both become "Maria"; "McDonald" and "DeVries" are left alone
// because their mixed case is deliberate and we'd only wreck it.
//
// Within a uniform token we case each apostrophe- and hyphen-separated
// part, so "o'brien" → "O'Brien" and "jean-luc" → "Jean-Luc" rather than
// the "O'brien" a naive first-character upper-case would produce.
function titleCaseToken(token) {
  const isUniform = token === token.toLowerCase() || token === token.toUpperCase();
  if (!isUniform) return token;
  return token
    .toLowerCase()
    .replace(/(^|['-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

// Normalize a raw name value into something safe to print, or null.
//
// Returns null (never '') when nothing usable remains, so callers can keep
// using their existing `name ? personalized : generic` branches and fall
// into the already-written no-name copy without any extra handling.
function cleanName(raw, { titleCase = true, maxLen = 60 } = {}) {
  if (raw == null) return null;

  // Junk-test the tokens BEFORE stripping disallowed characters. "N/A" only
  // reads as junk while the slash is still attached — strip it first and
  // you're left with the two "words" N and A, which sail through and render
  // as "Hey N,".
  const tokens = String(raw)
    .normalize('NFC')
    .split(/\s+/)
    .filter(Boolean)
    // Ignore surrounding punctuation for the test so "null." and "(none)"
    // are caught too.
    .filter((t) => !JUNK_TOKENS.has(t.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')))
    .map((t) => t.replace(ALLOWED, ''))
    .filter(Boolean);

  if (!tokens.length) return null;

  const out = (titleCase ? tokens.map(titleCaseToken) : tokens)
    .join(' ')
    .slice(0, maxLen)
    .trim();

  // A "name" of "..." or "--" has no letters in it and is not worth
  // greeting someone by.
  if (!out || !HAS_LETTER.test(out)) return null;
  return out;
}

// The greeting form: first usable token only, so a first_name column
// holding "Maria Rodriguez" (which apply-lead.js writes) still yields
// "Hey Maria," rather than the full legal name.
function firstNameOf(raw, opts) {
  const cleaned = cleanName(raw, opts);
  if (!cleaned) return null;
  return cleaned.split(' ')[0] || null;
}

module.exports = {
  cleanName,
  firstNameOf,
  JUNK_TOKENS,
};
