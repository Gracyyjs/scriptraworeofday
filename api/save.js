import { put } from '@vercel/blob';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { code } = req.body;
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  const id = crypto.randomBytes(6).toString('hex');
  const filename = `scripts/${id}.lua`;

  const blob = await put(filename, code, { access: 'public' });

  res.status(200).json({ id, url: blob.url });
}
