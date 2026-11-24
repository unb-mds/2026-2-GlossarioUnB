// Servidor local sem dependências com o mesmo layout do GitHub Pages
// (ver .github/workflows/pages.yml e ADR 0007). O site publicado tem as mesmas
// pastas do repositório, então os links entre as páginas funcionam igual em todo lugar:
//   /            → index.html (redireciona para a página Sobre)
//   /frontend/   → frontend/  (o glossário, PWA)
//   /sobre/      → sobre/     (página de apresentação do projeto)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const PASTAS_PUBLICADAS = ["frontend", "sobre"];
// Da pasta coleta/, só o boletim do robô vai para o site (#74).
const ARQUIVOS_AVULSOS = ["/coleta/relatorio.json"];
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

// Caminho do arquivo pedido, ou null se estiver fora do que é publicado (ex.: /../, /tests/).
async function localizarArquivo(caminhoUrl) {
  if (caminhoUrl === "/" || caminhoUrl === "/index.html") return join(RAIZ, "index.html");

  const avulso = ARQUIVOS_AVULSOS.find((arquivo) => arquivo === caminhoUrl);
  if (avulso) return join(RAIZ, ...avulso.split("/"));

  const pasta = PASTAS_PUBLICADAS.find((nome) => caminhoUrl.startsWith(`/${nome}/`));
  if (!pasta) return null;
  const base = join(RAIZ, pasta);
  const arquivo = normalize(join(base, caminhoUrl.slice(pasta.length + 2)));
  if (arquivo !== base && !arquivo.startsWith(base + sep)) return null;

  const info = await stat(arquivo).catch(() => null);
  if (!info) return null;
  return info.isDirectory() ? join(arquivo, "index.html") : arquivo;
}

function responder(resposta, status, texto) {
  resposta.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  resposta.end(texto);
}

// Atende um pedido. Exportada para os testes (tests/servidor-local.test.js).
export async function atender(pedido, resposta) {
  let caminho;
  try {
    caminho = decodeURIComponent(new URL(pedido.url, "http://localhost").pathname);
  } catch {
    responder(resposta, 400, "Endereço inválido");
    return;
  }
  // "/frontend" vira "/frontend/". O destino sai da lista fixa de pastas, nunca do endereço pedido
  // (redirecionamento aberto, regra S5146 do SonarQube).
  const pastaSemBarra = PASTAS_PUBLICADAS.find((nome) => caminho === `/${nome}`);
  if (pastaSemBarra) {
    resposta.writeHead(301, { Location: `/${pastaSemBarra}/` });
    resposta.end();
    return;
  }

  const arquivo = await localizarArquivo(caminho);
  if (!arquivo) {
    responder(resposta, 404, "Não encontrado");
    return;
  }
  try {
    let corpo = await readFile(arquivo);
    const cabecalhos = { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream", "Cache-Control": "no-cache" };
    // O GitHub Pages comprime texto com gzip; o servidor local faz o mesmo para a medição de desempenho
    // (Lighthouse CI, RNF02) refletir o site publicado. Imagens já vêm comprimidas.
    if (/\bgzip\b/.test(pedido.headers?.["accept-encoding"] ?? "") && extname(arquivo) !== ".png") {
      corpo = gzipSync(corpo);
      cabecalhos["Content-Encoding"] = "gzip";
      cabecalhos.Vary = "Accept-Encoding";
    }
    resposta.writeHead(200, cabecalhos);
    resposta.end(corpo);
  } catch (erro) {
    if (erro.code === "ENOENT") {
      responder(resposta, 404, "Não encontrado");
      return;
    }
    console.error(erro);
    responder(resposta, 500, "Erro interno");
  }
}

export function criarServidor() {
  return createServer(atender);
}

// Só sobe o servidor quando o arquivo é executado (npm run dev), e não quando um teste o importa.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const porta = Number(process.env.PORT) || 8080;
  criarServidor().listen(porta, () => {
    console.log(`Glossário:       http://localhost:${porta}/frontend/`);
    console.log(`Sobre o projeto: http://localhost:${porta}/sobre/`);
  });
}
