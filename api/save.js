import { put } from '@vercel/blob';

const token = 'EZKaEGLzFoBdJxpAuur3DT6A';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { code } = req.body;
  if (!code) return res.status(400).send('Código ausente');

  const id = Math.random().toString(36).slice(2, 12);

  try {
    const blob = await put(`scriptraw/${id}.lua`, code, {
      access: 'public',
      token
    });

    res.status(200).json({ id, url: blob.url });
  } catch (err) {
    console.error('Erro no save.js:', err);
    res.status(500).json({ error: 'Erro interno ao salvar o script', detail: err.message });
  }
}
