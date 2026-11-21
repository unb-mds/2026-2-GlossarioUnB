// A fronteira da ADR 0010: biblioteca npm só nos scripts do robô, e só as da lista.
// Ferramentas de teste e de qualidade só como devDependencies, e só as da segunda lista.
// O front (ADR 0002) continua sem nenhuma dependência.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const PERMITIDAS = ["cheerio", "robots-parser", "@google/genai", "pdfjs-dist"];
const PERMITIDAS_DESENVOLVIMENTO = [
  "@playwright/test",
  "@axe-core/playwright",
  "@stryker-mutator/core",
  "eslint",
  "@eslint/js",
  "globals",
];
const IMPORTS = [
  /\bimport\s[^"']*?\bfrom\s*["']([^"']+)["']/g,
  /\bimport\s*["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
];

async function arquivosJs(pasta) {
  const lista = [];
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) {
      lista.push(...(await arquivosJs(caminho)));
      continue;
    }
    if (/\.(m?js)$/.test(item.name)) lista.push(caminho);
  }
  return lista;
}

function ehLocal(especificador) {
  return /^(\.|\/|https?:)/.test(especificador);
}

test("o front não importa pacote npm (ADR 0002 e ADR 0010)", async () => {
  const fora = [];
  for (const arquivo of await arquivosJs(join(RAIZ, "frontend"))) {
    const codigo = await readFile(arquivo, "utf8");
    for (const padrao of IMPORTS) {
      for (const [, especificador] of codigo.matchAll(padrao)) {
        if (!ehLocal(especificador)) fora.push(`${relative(RAIZ, arquivo)} importa "${especificador}"`);
      }
    }
  }
  assert.deepEqual(fora, [], `o front não pode importar pacote npm:\n${fora.join("\n")}`);
});

test("o package.json só tem as bibliotecas da ADR 0010", async () => {
  const pacote = JSON.parse(await readFile(join(RAIZ, "package.json"), "utf8"));
  const fora = Object.keys(pacote.dependencies ?? {}).filter((nome) => !PERMITIDAS.includes(nome));
  assert.deepEqual(fora, [], `fora da lista da ADR 0010: ${fora.join(", ")}`);
  const foraDev = Object.keys(pacote.devDependencies ?? {}).filter(
    (nome) => !PERMITIDAS_DESENVOLVIMENTO.includes(nome),
  );
  assert.deepEqual(foraDev, [], `fora da lista de desenvolvimento da ADR 0010: ${foraDev.join(", ")}`);
});
