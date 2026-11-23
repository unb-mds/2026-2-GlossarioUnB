// Confere a estrutura da página Sobre (sobre/index.html), a página de produto do glossário.
// A página é HTML e CSS puros (ADR 0008): o teste lê o arquivo como texto, sem navegador.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../sobre/index.html", import.meta.url), "utf-8");

const tags = (nome) => html.match(new RegExp(`<${nome}\\b[^>]*>`, "gi")) ?? [];
const atributo = (tag, nome) => tag.match(new RegExp(`(?<![\\w-])${nome}="([^"]*)"`, "i"))?.[1];
const todos = (regex) => [...html.matchAll(regex)].map((m) => m[1]);

test("sobre: idioma pt-BR e um único h1", () => {
  assert.ok(html.includes('<html lang="pt-BR">'), 'falta <html lang="pt-BR">');
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test("sobre: sem JavaScript e sem CSS de fora (ADR 0008)", () => {
  assert.equal((html.match(/<script/gi) ?? []).length, 0);
  const folhas = tags("link").filter((tag) => atributo(tag, "rel") === "stylesheet");
  for (const tag of folhas) {
    const href = atributo(tag, "href") ?? "";
    assert.ok(!/^(http|\/\/)/i.test(href), `CSS de fora: ${href}`);
  }
});

test("sobre: toda imagem tem alt", () => {
  for (const tag of tags("img")) {
    assert.ok(/(?<![\w-])alt=/i.test(tag), `imagem sem alt: ${tag}`);
  }
});

test("sobre: ids únicos, e toda âncora e todo aria-labelledby apontam para um id que existe", () => {
  const ids = todos(/(?<![\w-])id="([^"]*)"/g);
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(repetidos, [], "ids repetidos");

  const existentes = new Set(ids);
  const ancoras = todos(/href="#([^"]+)"/g);
  const rotulos = todos(/aria-labelledby="([^"]*)"/g).flatMap((valor) => valor.split(/\s+/).filter(Boolean));
  const quebrados = [...ancoras, ...rotulos].filter((id) => !existentes.has(id));
  assert.deepEqual(quebrados, [], "apontam para id que não existe");
});

test("sobre: títulos sem pular nível", () => {
  const niveis = todos(/<h([1-6])\b/gi).map(Number);
  let anterior = 0;
  for (const nivel of niveis) {
    assert.ok(nivel <= anterior + 1, `h${nivel} depois de h${anterior}`);
    anterior = nivel;
  }
});

test("sobre: as seções da página de produto, nesta ordem", () => {
  const esperadas = ["como-usar", "de-onde-vem", "sugerir", "quem-faz", "para-devs"];
  const secoes = tags("section").map((tag) => atributo(tag, "id")).filter(Boolean);
  const encontradas = secoes.filter((id) => esperadas.includes(id));
  assert.deepEqual(encontradas, esperadas);
});

test("sobre: o primeiro botão abre o glossário", () => {
  const botao = tags("a").find((tag) => (atributo(tag, "class") ?? "").split(/\s+/).includes("botao"));
  assert.ok(botao, "nenhum link com a classe botao");
  assert.equal(atributo(botao, "href"), "../frontend/index.html");
});

test("sobre: o resumo das ADRs está em dia", () => {
  assert.ok(!html.includes("React ou Vue serão reavaliados na Release 2"), "a ADR 0002 ainda aparece com o texto antigo");
  assert.ok(html.includes("0010"), "falta a ADR 0010");
});
