import { getCode } from '../../lib/blob.js';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    // Validações do ID
    if (!id) {
      return res.status(400).send('ID ausente na URL');
    }
    
    if (typeof id !== 'string') {
      return res.status(400).send('ID deve ser uma string');
    }

    if (id.trim().length === 0) {
      return res.status(400).send('ID não pode estar vazio');
    }

    // Sanitiza o ID para evitar problemas de segurança
    const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedId !== id) {
      return res.status(400).send('ID contém caracteres inválidos');
    }

    const userAgent = req.headers['user-agent'] || '';
    const isRoblox = userAgent.includes('Roblox/WinHttp') || 
                     userAgent.toLowerCase().includes('roblox') ||
                     userAgent.includes('RobloxStudio');

    console.log(`Tentativa de acesso - ID: ${id}, User-Agent: ${userAgent}, IsRoblox: ${isRoblox}`);

    if (!isRoblox) {
      return res.status(403).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Acesso Negado - TuxProtector</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen flex items-center justify-center p-4">
  <div class="bg-red-800 p-8 rounded-2xl shadow-2xl max-w-md text-center">
    <h1 class="text-3xl font-bold mb-4">🚫 Acesso Negado</h1>
    <p class="text-lg mb-3">Este script só pode ser acessado pelo Roblox.</p>
    <p class="text-sm text-gray-300 mb-4">ID solicitado: ${id}</p>
    <div class="bg-gray-800 p-3 rounded-lg text-xs">
      <p class="text-gray-400">User-Agent detectado:</p>
      <p class="text-white break-all">${userAgent}</p>
    </div>
    <div class="mt-4 text-sm text-gray-400">TuxProtector &copy; 2025</div>
  </div>
</body>
</html>
      `);
    }

    console.log(`Buscando código para ID: ${id}`);
    
    const code = await getCode(id);
    
    if (!code) {
      console.log(`Código não encontrado para ID: ${id}`);
      return res.status(404).send('Script não encontrado');
    }

    console.log(`Código encontrado para ID: ${id}, tamanho: ${code.length} caracteres`);

    // Define headers apropriados
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).send(code);

  } catch (err) {
    console.error('Erro detalhado ao buscar script:', err);
    console.error('Stack trace:', err.stack);
    console.error('Query params:', req.query);
    
    if (err.message === 'Script não encontrado') {
      return res.status(404).send('Script não encontrado no sistema');
    }
    
    return res.status(500).send(`Erro interno do servidor: ${err.message}`);
  }
}
