import { NextResponse } from 'next/server';

let storage = {};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Método não permitido');
  }

  const id = req.query.id;
  if (!id || typeof id !== 'string' || !/^[a-f0-9]{12}$/.test(id)) {
    return res.status(404).send('ID inválido');
  }

  const ua = req.headers['user-agent'] || '';
  if (!ua.includes('Roblox/WinHttp')) {
    // Tela Acesso Restrito
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
          <p class="text-lg">Este conteúdo só pode ser acessado pelo dono</p>
        </div>
      </body>
      </html>
    `);
  }

  const code = storage[id];
  if (!code) {
    return res.status(404).send('Código não encontrado');
  }

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(code);
}
