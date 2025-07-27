import { saveCode } from '../../lib/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { code } = req.body;
  if (!code) return res.status(400).send('Código ausente');

  const id = Math.random().toString(36).slice(2, 12);
  try {
    const url = await saveCode(id, code);
    res.status(200).json({ id, url });
  } catch (err) {
    res.status(500).send('Erro ao salvar');
  }
}
