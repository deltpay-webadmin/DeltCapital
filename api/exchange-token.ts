import { PlaidApi, PlaidEnvironments, Configuration } from 'plaid';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { public_token } = req.body ?? {};
  if (!public_token) {
    return res.status(400).json({ error: 'Missing public_token' });
  }
  try {
    const response = await plaid.itemPublicTokenExchange({ public_token });
    // access_token is stored here in production; for sandbox we just confirm success
    res.json({ success: true, item_id: response.data.item_id });
  } catch (err: any) {
    console.error('Plaid exchange-token error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
}
