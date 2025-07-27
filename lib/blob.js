import fetch from 'node-fetch';

const GITHUB_TOKEN = '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'; // token direto
const REPO_OWNER = 'Gracyyjs';
const REPO_NAME = 'tux';
const FILE_PATH = 'code.json';
const BRANCH = 'main';

export async function saveCode(id, code) {
  const file = await getFile();
  const json = file.content;

  json.push({ id, code });

  await updateFile(json, file.sha);

  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${FILE_PATH}#${id}`;
}

export async function getCode(id) {
  const file = await getFile();
  const entry = file.content.find((e) => e.id === id);
  if (!entry) throw new Error('Script não encontrado');
  return entry.code;
}

async function getFile() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (res.status === 404) {
    return { content: [], sha: null };
  }

  if (!res.ok) {
    const errText = await res.text();
    console.error('[getFile] GitHub erro:', res.status, errText);
    throw new Error(`Erro ao obter code.json: ${res.status}`);
  }

  const data = await res.json();
  const contentDecoded = Buffer.from(data.content, 'base64').toString('utf-8');
  return {
    content: JSON.parse(contentDecoded),
    sha: data.sha,
  };
}

async function updateFile(json, sha) {
  const content = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  const body = {
    message: 'update code.json',
    content: content,
    branch: BRANCH,
  };

  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[updateFile] GitHub erro:', res.status, errText);
    throw new Error(`Erro ao atualizar code.json: ${res.status}`);
  }
}
