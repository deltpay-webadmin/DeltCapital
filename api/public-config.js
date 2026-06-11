// GET /api/public-config
// Serves the *public* client config (Supabase URL + publishable/anon key) to the
// browser so the front-end never has to hardcode keys in git. These values are
// safe to expose — the publishable key is gated by Row Level Security on the
// database. The service-role key (SUPABASE_SERVICE_ROLE_KEY) is NEVER sent here.

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  }));
};
