import { getCode } from '../../lib/blob';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('ID ausente');

  const userAgent = req.headers['user-agent'] || '';
  const isRoblox = userAgent.includes('Roblox/WinHttp') || userAgent.toLowerCase().includes('roblox');
  
  if (!isRoblox) {
    return res.status(403).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Acesso Negado</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen flex items-center justify-center p-4">
  <div class="bg-red-800 p-8 rounded-2xl shadow-2xl max-w-md text-center">
    <h1 class="text-3xl font-bold mb-4">🚫 Acesso Negado</h1>
    <p class="text-lg mb-3">Este script só pode ser acessado pelo Roblox.</p>
    <div class="mt-4 text-sm text-gray-400">TuxProtector &copy; 2025</div>
  </div>
</body>
</html>`);
  }

  try {
    const code = await getCode(id);
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(code);
  } catch {
    res.status(404).send('Script não encontrado');
  }
}
