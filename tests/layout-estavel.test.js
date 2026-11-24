// Regras de layout estável (RNF02, CLS <= 0,1): o espaço do que o JavaScript preenche depois
// (trilha, atalhos e lista de termos) é reservado no HTML e no CSS, para o rodapé e as seções
// de baixo não descerem quando os dados chegam. A medida em si (Lighthouse) é feita no navegador.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (caminho) => readFileSync(new URL(`../frontend/${caminho}`, import.meta.url), "utf8");
const html = { inicio: ler("index.html"), lista: ler("todas-siglas.html"), termo: ler("termo.html") };
const css = ler("styles.css").replace(/\/\*[\s\S]*?\*\//g, ""); // sem comentários
const app = ler("js/app.js");

// O corpo de todas as regras CSS que começam com o seletor (inclusive dentro de @media).
const regras = (seletor) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, cabecalho]) => cabecalho.trim().split(",").map((s) => s.trim()).includes(seletor))
    .map(([, , corpo]) => corpo);
const reserva = (seletor) => regras(seletor).filter((corpo) => /min-height:\s*\S+/.test(corpo));

test("a seção da trilha já vem visível no HTML: esconder e mostrar depois empurra a página", () => {
  const abertura = html.inicio.match(/<section[^>]*id="trilha-calouro"[^>]*>/)?.[0];
  assert.ok(abertura, "section#trilha-calouro existe");
  assert.doesNotMatch(abertura, /\bhidden\b/);
});

test("se a trilha não carregar, o JavaScript esconde a seção em vez de deixar um título vazio", () => {
  const funcao = app.slice(app.indexOf("async function iniciarTrilha"), app.indexOf("// ===== Todas as siglas"));
  assert.match(funcao, /secao\.hidden = true/);
  assert.doesNotMatch(funcao, /secao\.hidden = false/);
});

test("a trilha reserva altura para 1, 2 e 3 colunas, na medida dos 25 termos", () => {
  const alturas = reserva(".trilha-grupos").map((corpo) => corpo.match(/min-height:\s*(\S+?);/)[1]);
  assert.deepEqual(alturas, ["152rem", "92rem", "71rem"]);
});

test("o progresso da trilha já vem no HTML e reserva a linha do botão, para não empurrar os grupos", () => {
  const trilha = html.inicio.slice(html.inicio.indexOf('id="trilha-calouro"'), html.inicio.indexOf('id="trilha-grupos"'));
  assert.match(trilha, /id="trilha-progresso"/);
  assert.match(trilha, /id="trilha-contagem"/);
  assert.match(trilha, /<progress[^>]*id="trilha-barra"/);
  assert.equal(reserva(".trilha-progresso-topo").length, 1);
});

test("a marca de visto fica por cima do cartão: aparecer ou sumir não muda a altura do termo", () => {
  const marca = regras(".trilha-termo-marca").join(" ");
  assert.match(marca, /position:\s*absolute/);
  assert.match(regras(".trilha-termo").join(" "), /position:\s*relative/);
});

test("sem armazenamento, a barra some sem tirar o espaço dela", () => {
  assert.match(regras(".trilha-progresso[data-sem-armazenamento] .trilha-barra").join(" "), /visibility:\s*hidden/);
});

test("a lista de atalhos e a lista de termos reservam altura", () => {
  assert.ok(reserva(".atalhos-lista").length >= 1);
  assert.ok(reserva(".lista-termos").length >= 1);
});

test("a lista de termos reserva ao menos a altura da tela, para o rodapé nascer fora dela", () => {
  const corpo = reserva(".lista-termos").join(" ");
  assert.match(corpo, /min-height:\s*100(s|d)?vh/);
});

test("as duas páginas usam os elementos que recebem a reserva", () => {
  assert.match(html.inicio, /id="trilha-grupos"[^>]*class="trilha-grupos"|class="trilha-grupos"[^>]*id="trilha-grupos"/);
  assert.match(html.inicio, /id="atalhos-tipo"[^>]*class="atalhos-lista"/);
  assert.match(html.lista, /id="lista-termos"[^>]*class="lista-termos"/);
});

test("a lista pede os dados cedo (preload), para os cartões chegarem mais rápido que o rodapé", () => {
  assert.match(html.lista, /<link rel="preload" href="data\/termos\.json" as="fetch" crossorigin>/);
});

test("a ficha do termo reserva ao menos a altura da tela: o bloco \"Onde fica\" e o texto chegam sem empurrar o rodapé", () => {
  assert.match(html.termo, /id="conteudo-termo"[^>]*class="ficha"/);
  const corpo = reserva(".ficha").join(" ");
  assert.match(corpo, /min-height:\s*100(s|d)?vh/);
});
