const scripts = global.scripts || (global.scripts = new Map());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Código inválido' });
  }

  try {
    const id = crypto.randomUUID();
    scripts.set(id, code);

    res.status(200).json({ id, url: `/api/raw?id=${id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
