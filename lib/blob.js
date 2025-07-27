import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = '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';
const REPO_OWNER = 'Gracyyjs';
const REPO_NAME = 'tux';
const FILE_PATH = 'code.json';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function saveCode(id, code) {
  try {
    const file = await getFile();
    const json = file.content;

    // Verifica se o ID já existe para evitar duplicatas
    const existingIndex = json.findIndex(item => item.id === id);
    if (existingIndex !== -1) {
      json[existingIndex] = { id, code };
    } else {
      json.push({ id, code });
    }

    await updateFile(json, file.sha);

    return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}#${id}`;
  } catch (error) {
    console.error('Erro ao salvar código:', error);
    throw new Error(`Falha ao salvar código: ${error.message}`);
  }
}

export async function getCode(id) {
  try {
    const file = await getFile();
    const entry = file.content.find(e => e.id === id);

    if (!entry) throw new Error('Script não encontrado');
    return entry.code;
  } catch (error) {
    console.error('Erro ao buscar código:', error);
    throw error;
  }
}

async function getFile() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    // Verifica se é um arquivo e não um diretório
    if (Array.isArray(data)) {
      throw new Error('Caminho aponta para um diretório, não um arquivo');
    }

    const content = JSON.parse(Buffer.from(data.content, 'base64').toString());
    
    // Valida se o conteúdo é um array
    if (!Array.isArray(content)) {
      throw new Error('Arquivo JSON inválido - esperado um array');
    }

    return { content, sha: data.sha };
  } catch (err) {
    if (err.status === 404) {
      console.log('Arquivo não encontrado, criando novo');
      return { content: [], sha: null };
    }
    console.error('Erro ao obter arquivo:', err);
    throw new Error(`Erro ao acessar arquivo: ${err.message}`);
  }
}

async function updateFile(json, sha) {
  try {
    // Valida o JSON antes de salvar
    if (!Array.isArray(json)) {
      throw new Error('Dados inválidos - esperado um array');
    }

    const jsonString = JSON.stringify(json, null, 2);
    const content = Buffer.from(jsonString).toString('base64');

    const params = {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: `update code.json - ${new Date().toISOString()}`,
      content,
    };

    // Só adiciona sha se existir (para atualização)
    if (sha) {
      params.sha = sha;
    }

    await octokit.repos.createOrUpdateFileContents(params);
    console.log('Arquivo atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar arquivo:', error);
    throw new Error(`Falha ao atualizar arquivo: ${error.message}`);
  }
}
