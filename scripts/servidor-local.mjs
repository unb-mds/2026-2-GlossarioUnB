// Servidor local sem dependências com o mesmo layout do GitHub Pages
// (ver .github/workflows/pages.yml e ADR 0007). O site publicado tem as mesmas
// pastas do repositório, então os links entre as páginas funcionam igual em todo lugar:
//   /            → index.html (redireciona para a página Sobre)
//   /frontend/   → frontend/  (o glossário, PWA)
//   /sobre/      → sobre/     (página de apresentação do projeto)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const PORTA = Number(process.env.PORT) || 8080;
const PASTAS_PUBLICADAS = ["frontend", "sobre"];
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

createServer(async (pedido, resposta) => {
  let caminho;
  try {
    caminho = decodeURIComponent(new URL(pedido.url, "http://localhost").pathname);
  } catch {
    responder(resposta, 400, "Endereço inválido");
    return;
  }
  if (PASTAS_PUBLICADAS.some((nome) => caminho === `/${nome}`)) {
    resposta.writeHead(301, { Location: `${caminho}/` });
    resposta.end();
    return;
  }

  const arquivo = await localizarArquivo(caminho);
  if (!arquivo) {
    responder(resposta, 404, "Não encontrado");
    return;
  }
  try {
    const corpo = await readFile(arquivo);
    resposta.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream", "Cache-Control": "no-cache" });
    resposta.end(corpo);
  } catch (erro) {
    if (erro.code === "ENOENT") {
      responder(resposta, 404, "Não encontrado");
      return;
    }
    console.error(erro);
    responder(resposta, 500, "Erro interno");
  }
}).listen(PORTA, () => {
  console.log(`Glossário:       http://localhost:${PORTA}/frontend/`);
  console.log(`Sobre o projeto: http://localhost:${PORTA}/sobre/`);
});
