import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const storagePath = path.resolve('./api/storage.json');

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

  // Ler e salvar no JSON
  try {
    const file = await fs.readFile(storagePath, 'utf-8');
    const json = JSON.parse(file);
    json[id] = code.trim();
    await fs.writeFile(storagePath, JSON.stringify(json, null, 2));
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao salvar no JSON' });
  }

  res.status(200).json({ id });
}
