import { put } from '@vercel/blob';

const token = 'vercel_blob_rw_aikp0KgvaLA8Per9_mWWVFqsPB3mJVNMJIcAs72eIhKd5VK';

export async function saveCode(id, code) {
  const blob = await put(`scriptraw/${id}.lua`, code, {
    access: 'public',
    token
  });
  return blob.url;
}

export async function getCode(id) {
  const url = `https://api.vercel.com/v2/blobs/get?path=scriptraw/${id}.lua`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Script não encontrado');
  }

  return await res.text();
}

export async function deleteCode(id) {
  const url = `https://api.vercel.com/v2/blobs/delete?path=scriptraw/${id}.lua`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Erro ao deletar blob');
  }

  return true;
}
