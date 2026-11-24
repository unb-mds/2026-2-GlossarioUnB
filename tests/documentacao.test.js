// Verificações automáticas da integridade da documentação (issue #85).
// Mantém a garantia da ADR 0010 usando apenas módulos nativos do Node.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const PASTAS_IGNORADAS = new Set([".git", "node_modules", "2026-2-GlossarioUnB"]);
const PADRAO_LINK_MD = /!?\[[^\]]*\]\(([^)]+)\)/g;
const PADRAO_ESQUEMA_EXTERNO = /^[a-z][a-z0-9+.-]*:/i;

async function coletarArquivosMarkdown(pasta) {
  const lista = [];
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    if (PASTAS_IGNORADAS.has(item.name)) continue;
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) {
      lista.push(...(await coletarArquivosMarkdown(caminho)));
      continue;
    }
    if (item.name.endsWith(".md")) lista.push(caminho);
  }
  return lista;
}

function removerBlocosDeCodigo(markdown) {
  return markdown
    .replace(/^```[\s\S]*?^```/gm, "")
    .replace(/^~~~[\s\S]*?^~~~/gm, "")
    .replace(/`[^`\r\n]+`/g, "");
}

function extrairCaminhoLocal(destinoBruto) {
  let destino = destinoBruto.trim().replace(/\s+"[^"]*"\s*$/, "").replace(/\s+'[^']*'\s*$/, "");
  if (destino.startsWith("<") && destino.endsWith(">")) {
    destino = destino.slice(1, -1).trim();
  }
  if (!destino || destino.startsWith("#") || PADRAO_ESQUEMA_EXTERNO.test(destino)) {
    return null;
  }
  const semAncora = destino.split("#")[0].split("?")[0];
  if (!semAncora || /^<[^>]+>$/.test(semAncora)) return null;
  try {
    return decodeURIComponent(semAncora);
  } catch {
    return semAncora;
  }
}

async function existeCaminho(caminho) {
  try {
    await access(caminho);
    return true;
  } catch {
    return false;
  }
}

test("documentos Markdown não têm links locais quebrados", async () => {
  const quebrados = [];
  for (const arquivo of await coletarArquivosMarkdown(RAIZ)) {
    const conteudo = removerBlocosDeCodigo(await readFile(arquivo, "utf8"));
    for (const [, destinoBruto] of conteudo.matchAll(PADRAO_LINK_MD)) {
      const local = extrairCaminhoLocal(destinoBruto);
      if (!local) continue;
      const destinoResolvido = local.startsWith("/")
        ? resolve(RAIZ, local.slice(1))
        : resolve(dirname(arquivo), local);
      if (!(await existeCaminho(destinoResolvido))) {
        quebrados.push(`${relative(RAIZ, arquivo)} -> ${destinoBruto}`);
      }
    }
  }
  assert.deepEqual(quebrados, [], `links locais quebrados encontrados:\n${quebrados.join("\n")}`);
});

test("todas as ADRs declaram a seção ## Status", async () => {
  const pastaAdr = join(RAIZ, "docs", "adr");
  const semStatus = [];
  for (const nome of await readdir(pastaAdr)) {
    if (!/^\d{4}-.*\.md$/.test(nome)) continue;
    const conteudo = await readFile(join(pastaAdr, nome), "utf8");
    if (!/^## Status\b/m.test(conteudo)) semStatus.push(nome);
  }
  assert.deepEqual(semStatus, [], `ADRs sem seção ## Status: ${semStatus.join(", ")}`);
});

test("documentação em docs/ não mantém marcadores pendentes de validação", async () => {
  const pendentes = [];
  for (const arquivo of await coletarArquivosMarkdown(join(RAIZ, "docs"))) {
    const conteudo = await readFile(arquivo, "utf8");
    if (/PRECISA VALIDAÇÃO|\[FALTA/i.test(conteudo)) {
      pendentes.push(relative(RAIZ, arquivo));
    }
  }
  assert.deepEqual(pendentes, [], `marcadores pendentes em docs/: ${pendentes.join(", ")}`);
});

test("configuração de templates de issue não usa URL de exemplo", async () => {
  const config = await readFile(join(RAIZ, ".github", "ISSUE_TEMPLATE", "config.yml"), "utf8");
  assert.doesNotMatch(config, /exemplo\.com/i);
  assert.doesNotMatch(config, /\bTODO:/i);
});
