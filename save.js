let storage = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { code } = req.body;
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  const id = [...crypto.getRandomValues(new Uint8Array(6))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  storage[id] = code.trim();

  res.status(200).json({ id });
}
