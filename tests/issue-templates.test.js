// Valida os Issue Forms YAML (#71): menus alinhados ao schema, campos obrigatórios e links do app.
import { test } from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

import { CAMPI, CAMPUS_GERAL, TIPOS } from "../frontend/js/termos.js";

const lerArquivo = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");

// Extrai o bloco de um campo do formulário YAML pelo seu `id:`.
function blocoDoCampo(yaml, id) {
  const partes = yaml.split(/\r?\n {2}- type:/);
  return partes.find((p) => new RegExp(`\\bid:\\s*${id}\\b`).test(p)) ?? "";
}

function opcoesDoDropdown(bloco) {
  const inicio = bloco.indexOf("options:");
  if (inicio === -1) return [];
  const linhas = bloco.slice(inicio).split(/\r?\n/).slice(1);
  const opcoes = [];
  for (const linha of linhas) {
    const match = /^\s+-\s+(.+)$/.exec(linha);
    if (match) opcoes.push(match[1].trim());
    else if (linha.trim() !== "") break;
  }
  return opcoes;
}

const { categorias } = JSON.parse(await lerArquivo("../coleta/categorias.json"));
const adicionar = await lerArquivo("../.github/ISSUE_TEMPLATE/adicionar-termo.yml");
const corrigir = await lerArquivo("../.github/ISSUE_TEMPLATE/corrigir-definicao.yml");
const config = await lerArquivo("../.github/ISSUE_TEMPLATE/config.yml");

test("adicionar-termo.yml tem menus de tipo, campus e categoria iguais aos do schema", () => {
  assert.deepEqual(opcoesDoDropdown(blocoDoCampo(adicionar, "tipo")), Object.keys(TIPOS));
  assert.deepEqual(opcoesDoDropdown(blocoDoCampo(adicionar, "campus")), [CAMPUS_GERAL, ...CAMPI]);
  assert.deepEqual(
    opcoesDoDropdown(blocoDoCampo(adicionar, "categoria")),
    categorias.map((c) => c.id),
  );
});

test("corrigir-definicao.yml tem menus de tipo, campus e categoria iguais aos do schema", () => {
  assert.deepEqual(opcoesDoDropdown(blocoDoCampo(corrigir, "tipo")), Object.keys(TIPOS));
  assert.deepEqual(opcoesDoDropdown(blocoDoCampo(corrigir, "campus")), [CAMPUS_GERAL, ...CAMPI]);
  assert.deepEqual(
    opcoesDoDropdown(blocoDoCampo(corrigir, "categoria")),
    categorias.map((c) => c.id),
  );
});

test("adicionar-termo.yml e corrigir-definicao.yml exigem definicao e fonte", () => {
  for (const [nome, yaml] of [["adicionar-termo.yml", adicionar], ["corrigir-definicao.yml", corrigir]]) {
    assert.match(blocoDoCampo(yaml, "definicao"), /required:\s*true/, `${nome}: definicao precisa ser obrigatória`);
    assert.match(blocoDoCampo(yaml, "fonte"), /required:\s*true/, `${nome}: fonte precisa ser obrigatória`);
  }
});

test("config.yml não contém o link placeholder de exemplo", () => {
  assert.doesNotMatch(config, /exemplo\.com/);
});

test("todos os links de template de issue no site apontam para arquivos existentes", async () => {
  const arquivos = [
    "../frontend/index.html",
    "../frontend/termo.html",
    "../frontend/todas-siglas.html",
    "../frontend/js/app.js",
    "../sobre/index.html",
  ];
  const encontrados = new Set();

  for (const caminho of arquivos) {
    const texto = await lerArquivo(caminho);
    for (const match of texto.matchAll(/template=([a-z0-9_.-]+)/g)) {
      encontrados.add(match[1]);
    }
    for (const match of texto.matchAll(/urlModeloIssue\("([a-z0-9_.-]+)"/g)) {
      encontrados.add(match[1]);
    }
  }

  assert.ok(encontrados.has("adicionar-termo.yml"), "app precisa apontar para adicionar-termo.yml");
  assert.ok(encontrados.has("corrigir-definicao.yml"), "app precisa apontar para corrigir-definicao.yml");

  for (const modelo of encontrados) {
    await assert.doesNotReject(
      access(new URL(`../.github/ISSUE_TEMPLATE/${modelo}`, import.meta.url)),
      `template citado no site não existe: ${modelo}`,
    );
  }
});
