// api/raw.js
import { head } from '@vercel/blob';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).send('ID não fornecido');
  }

  // Verificar User-Agent
  const userAgent = req.headers['user-agent'] || '';
  const isRobloxAgent = userAgent.includes('Roblox/WinHttp') || 
                       userAgent.includes('roblox') ||
                       userAgent.includes('Roblox');

  if (!isRobloxAgent) {
    return res.status(403).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Acesso Negado - ScriptOreofday</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white h-full flex items-center justify-center">
  <div class="max-w-md w-full p-8 bg-red-800 rounded-2xl shadow-lg text-center">
    <h1 class="text-2xl font-bold mb-4">🚫 Acesso Negado</h1>
    <p class="mb-4">Este script só pode ser acessado pelo Roblox.</p>
    <p class="text-sm text-gray-300">User-Agent detectado: ${userAgent}</p>
  </div>
</body>
</html>
    `);
  }

  try {
    // Verificar se o arquivo existe no blob
    const blobUrl = `https://vercel-blob.vercel.app/scripts/${id}.lua`;
    
    // Fazer fetch do conteúdo do blob
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      return res.status(404).send('Script não encontrado');
    }

    const scriptContent = await response.text();
    
    // Retornar apenas o script puro
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(scriptContent);

  } catch (error) {
    console.error('Erro ao buscar script:', error);
    res.status(500).send('Erro interno do servidor');
  }
}
