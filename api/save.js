import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { code } = req.body;
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Código inválido' });

  const client = await connectToDatabase();
  const db = client.db('jrizzDB'); // nome do banco, pode mudar se quiser
  const collection = db.collection('scripts');

  const result = await collection.insertOne({ code });

  res.status(200).json({ id: result.insertedId.toString(), url: `/api/raw?id=${result.insertedId}` });
}
