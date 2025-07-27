import { put, get } from '@vercel/blob';

const token = 'vercel_blob_rw_aikp0KgvaLA8Per9_mWWVFqsPB3mJVNMJIcAs72eIhKd5VK';

export async function saveCode(id, code) {
  const blob = await put(`scriptraw/${id}.lua`, code, {
    access: 'public',
    token
  });

  return blob.url;
}

export async function getCode(id) {
  const res = await fetch(`https://blob.vercel-storage.com/scriptraw/${id}.lua`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Não encontrado');
  return await res.text();
}
