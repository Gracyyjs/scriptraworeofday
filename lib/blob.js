import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = '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'; // seu token aqui
const REPO_OWNER = 'Gracyyjs';
const REPO_NAME = 'tux';
const FILE_PATH = 'code.json';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function saveCode(id, code) {
  const file = await getFile();
  const json = file.content;

  json.push({ id, code });

  await updateFile(json, file.sha);

  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}#${id}`;
}

export async function getCode(id) {
  const file = await getFile();
  const entry = file.content.find(e => e.id === id);

  if (!entry) throw new Error('Script não encontrado');
  return entry.code;
}

async function getFile() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    const content = JSON.parse(Buffer.from(data.content, 'base64').toString());
    return { content, sha: data.sha };
  } catch (err) {
    if (err.status === 404) {
      return { content: [], sha: null }; // novo arquivo
    }
    throw err;
  }
}

async function updateFile(json, sha) {
  const content = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: FILE_PATH,
    message: 'update code.json',
    content,
    sha: sha || undefined,
  });
}
