import fs from 'fs/promises';
import path from 'path';

const storagePath = path.resolve('./api/storage.json');

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || !/^[a-f0-9]{12}$/.test(id)) {
    return res.status(404).send('ID inválido');
  }

  const ua = req.headers['user-agent'] || '';
  if (!ua.includes('Roblox/WinHttp')) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="pt-BR" class="h-full">
      <head>
        <meta charset="UTF-8" />
        <title>Acesso Restrito</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-red-900 text-white flex items-center justify-center h-full">
        <div class="text-center space-y-4">
          <h1 class="text-4xl font-bold text-red-300">🚫 Acesso Restrito!</h1>
          <p class="text-lg">Este conteúdo só pode ser acessado pelo Dono.</p>
        </div>
      </body>
      </html>
    `);
  }

  try {
    const file = await fs.readFile(storagePath, 'utf-8');
    const json = JSON.parse(file);
    const code = json[id];

    if (!code) {
      return res.status(404).send('Código não encontrado');
    }

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(code);
  } catch {
    res.status(500).send('Erro interno ao ler código');
  }
}
