import { saveCode } from '../../lib/blob.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Código ausente' });
    }

    const id = Math.random().toString(36).substring(2, 10);
    const url = await saveCode(id, code);

    return res.status(200).json({ id, url });
  } catch (err) {
    console.error('Erro ao salvar o script:', err);
    return res.status(500).json({
      error: 'Erro interno ao salvar o script',
      detail: err.message || String(err)
    });
  }
}
