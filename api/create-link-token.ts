import { PlaidApi, PlaidEnvironments, Configuration, Products, CountryCode } from 'plaid';

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
    const response = await plaid.linkTokenCreate({
      user: { client_user_id: 'delt-user-' + Date.now() },
      client_name: 'Delt Capital',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (err: any) {
    console.error('Plaid create-link-token error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Failed to create link token' });
  }
}
