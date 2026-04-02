import { PlaidApi, PlaidEnvironments, Configuration, Products, CountryCode } from 'plaid';
import type { LinkTokenCreateRequest } from 'plaid';

const env = (process.env.PLAID_ENV ?? 'sandbox') as keyof typeof PlaidEnvironments;

const plaid = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[env],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const request: LinkTokenCreateRequest = {
      user: { client_user_id: 'delt-user-' + Date.now() },
      client_name: 'Delt Capital',
      products: [Products.Auth, Products.Identity],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    // Production and development require a redirect_uri for OAuth flows
    if (env !== 'sandbox' && process.env.PLAID_REDIRECT_URI) {
      request.redirect_uri = process.env.PLAID_REDIRECT_URI;
    }

    // Add webhook URL if configured
    if (process.env.PLAID_WEBHOOK_URL) {
      request.webhook = process.env.PLAID_WEBHOOK_URL;
    }

    const response = await plaid.linkTokenCreate(request);
    res.json({ link_token: response.data.link_token });
  } catch (err: any) {
    const plaidError = err.response?.data;
    console.error('Plaid create-link-token error:', JSON.stringify(plaidError ?? err.message));
    res.status(500).json({
      error: 'Failed to create link token',
      plaid_error_type: plaidError?.error_type,
      plaid_error_code: plaidError?.error_code,
      plaid_error_message: plaidError?.error_message,
    });
  }
}
