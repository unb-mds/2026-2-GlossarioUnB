// Valida a configuração do Lighthouse CI (#80): limites da RNF02/RNF03, rotas válidas e workflow seguro.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { atender } from "../scripts/servidor-local.mjs";

const lerArquivo = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");

const config = JSON.parse(await lerArquivo("../lighthouserc.json"));
const workflow = await lerArquivo("../.github/workflows/lighthouse.yml");
const termos = JSON.parse(await lerArquivo("../frontend/data/termos.json"));

async function simularRequisicao(caminho) {
  let status = null;
  let cabecalhos = {};
  const resposta = {
    writeHead(codigo, headers) {
      status = codigo;
      cabecalhos = headers;
    },
    end() {},
  };
  await atender({ url: caminho }, resposta);
  return { status, cabecalhos };
}

test("lighthouserc.json usa servidor local e audita as 4 páginas esperadas", () => {
  const { collect } = config.ci;
  assert.equal(collect.startServerCommand, "node scripts/servidor-local.mjs");
  assert.ok(collect.numberOfRuns >= 1);
  assert.deepEqual(collect.url, [
    "http://localhost:8080/frontend/",
    "http://localhost:8080/frontend/todas-siglas.html",
    "http://localhost:8080/frontend/termo.html?id=deg",
    "http://localhost:8080/sobre/",
  ]);
});

test("lighthouserc.json exige Performance, Acessibilidade e Boas práticas >= 90% e LCP <= 2s na inicial (RNF02/RNF03)", () => {
  const matriz = config.ci.assert.assertMatrix;
  const geral = matriz.find((regra) => regra.matchingUrlPattern === ".*");
  assert.ok(geral, "regra geral (.*) ausente em assertMatrix");

  for (const categoria of ["categories:performance", "categories:accessibility", "categories:best-practices"]) {
    const [nivel, opcoes] = geral.assertions[categoria] ?? [];
    assert.equal(nivel, "error", `${categoria} precisa falhar o CI (error)`);
    assert.ok(opcoes?.minScore >= 0.9, `${categoria} exige minScore >= 0.9`);
  }

  const inicio = matriz.find((regra) => regra.matchingUrlPattern === "^http://localhost:8080/frontend/$");
  assert.ok(inicio, "regra de LCP para /frontend/ ausente em assertMatrix");
  const [nivelLcp, opcoesLcp] = inicio.assertions["largest-contentful-paint"] ?? [];
  assert.equal(nivelLcp, "error", "largest-contentful-paint precisa falhar o CI (error)");
  assert.ok(opcoesLcp?.maxNumericValue <= 2000, "LCP da página inicial deve ser <= 2000 ms (RNF02)");
});

test("todas as URLs auditadas respondem HTTP 200 HTML e citam termo existente", async () => {
  const idsValidos = new Set(termos.map((termo) => termo.id));
  for (const endereco of config.ci.collect.url) {
    const url = new URL(endereco);
    const { status, cabecalhos } = await simularRequisicao(url.pathname + url.search);
    assert.equal(status, 200, `${endereco} respondeu ${status}`);
    assert.match(cabecalhos["Content-Type"], /^text\/html/, `${endereco} precisa retornar text/html`);

    const idTermo = url.searchParams.get("id");
    if (idTermo !== null) {
      assert.ok(idsValidos.has(idTermo), `id "${idTermo}" em ${endereco} não existe em termos.json`);
    }
  }
});

test(".github/workflows/lighthouse.yml roda em PRs e push na main com menor privilégio", () => {
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /permissions:\s*\r?\n\s*contents:\s*read/);
  assert.doesNotMatch(workflow, /:\s*write\b/);
  assert.match(workflow, /uses:\s*treosh\/lighthouse-ci-action@v12/);
  assert.match(workflow, /configPath:\s*\.\/lighthouserc\.json/);
  assert.match(workflow, /uploadArtifacts:\s*true/);
  assert.match(workflow, /temporaryPublicStorage:\s*true/);
});
