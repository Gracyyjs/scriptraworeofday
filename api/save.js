// api/save.js
import { put } from '@vercel/blob';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Código inválido' });
    }

    // Gerar ID único
    const id = crypto.randomUUID();
    
    // Salvar no Vercel Blob
    const blob = await put(`scripts/${id}.lua`, code, {
      access: 'public',
      contentType: 'text/plain'
    });

    res.status(200).json({ 
      id: id,
      url: blob.url 
    });

  } catch (error) {
    console.error('Erro ao salvar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
