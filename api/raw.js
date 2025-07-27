import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).send('ID não fornecido');

  const userAgent = req.headers['user-agent'] || '';
  const isRobloxAgent = userAgent.includes('Roblox/WinHttp') || 
                        userAgent.toLowerCase().includes('roblox');

  if (!isRobloxAgent) {
    return res.status(403).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Acesso Negado - ScriptOreofday</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen flex items-center justify-center p-4">
  <div class="bg-red-800 p-8 rounded-2xl shadow-2xl max-w-md text-center">
    <h1 class="text-3xl font-bold mb-4">🚫 Acesso Negado</h1>
    <p class="text-lg mb-3">Este script só pode ser acessado pelo Roblox Executor.</p>
    <p class="text-sm text-gray-300 break-words">
      <strong>User-Agent detectado:</strong><br>${userAgent}
    </p>
    <div class="mt-4 text-sm text-gray-400">ScriptOreofday &copy; 2025</div>
  </div>
</body>
</html>
    `);
  }

  try {
    const filePath = path.join(os.tmpdir(), `${id}.lua`);
    const content = await fs.readFile(filePath, 'utf-8');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(content);
  } catch (err) {
    res.status(404).send('Script não encontrado');
  }
}
