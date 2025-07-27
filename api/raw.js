import { get } from '@vercel/blob';

export default async function handler(req, res) {
  const id = req.query.id;
  const ua = req.headers['user-agent'] || '';

  if (!id) return res.status(400).send('ID ausente.');

  if (!ua.includes('Roblox/WinHttp')) {
    res.status(403).send(`
      <html>
        <head><title>Acesso Restrito</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px">
          <h1>Acesso restrito!</h1>
          <p>Este recurso só pode ser acessado pelo Dono.</p>
        </body>
      </html>
    `);
    return;
  }

  try {
    const blob = await get(`scripts/${id}.lua`);
    const content = await blob.text();

    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch {
    res.status(404).send('Script não encontrado.');
  }
}
