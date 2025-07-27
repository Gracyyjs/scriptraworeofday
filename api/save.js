import crypto from 'crypto';

let storage = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  const { code } = data;
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  const id = crypto.randomBytes(6).toString('hex');
  storage[id] = code.trim();

  res.status(200).json({ id });
}
