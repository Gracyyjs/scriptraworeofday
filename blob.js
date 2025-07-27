import { put, get } from '@vercel/blob';

const token = 'EZKaEGLzFoBdJxpAuur3DT6A';

export async function saveCode(id, code) {
  const blob = await put(`scriptraw/${id}.lua`, code, {
    access: 'public',
    token
  });
  return blob.url;
}

export async function getCode(id) {
  const res = await fetch(`https://blob.vercel-storage.com/scriptraw/${id}.lua`);
  if (!res.ok) throw new Error('Script não encontrado');
  return await res.text();
}
