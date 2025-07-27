import { put } from '@vercel/blob';

export async function saveCode(id, code) {
  const blob = await put(`scriptraw/${id}.lua`, code, {
    access: 'public',
    token: 'vercel_blob_rw_aikp0KgvaLA8Per9_mWWVFqsPB3mJVNMJIcAs72eIhKd5VK'
  });
  return blob.url;
}

export async function getCode(id) {
  const url = `https://api.vercel.com/v2/blobs/get?path=scriptraw/${id}.lua`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer vercel_blob_rw_aikp0KgvaLA8Per9_mWWVFqsPB3mJVNMJIcAs72eIhKd5VK`
    }
  });

  if (!res.ok) {
    throw new Error('Script não encontrado');
  }

  return await res.text();
}
