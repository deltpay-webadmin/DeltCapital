import http from 'node:http';
import createLinkToken from './create-link-token.ts';
import exchangeToken from './exchange-token.ts';

const PORT = 3001;

function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const body = req.method === 'POST' ? await parseBody(req) : {};
  const reqAdapter: any = { method: req.method, body };
  const resAdapter: any = {
    _status: 200,
    status(code: number) { this._status = code; return this; },
    json(data: unknown) {
      res.writeHead(this._status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    },
  };

  if (req.url === '/api/create-link-token') return createLinkToken(reqAdapter, resAdapter);
  if (req.url === '/api/exchange-token') return exchangeToken(reqAdapter, resAdapter);

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => console.log(`Dev API running on http://localhost:${PORT}`));
