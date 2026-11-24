// Filtro de termos do robô (ADR 0014): a lista fixa barra o que não é da universidade antes do LLM, o LLM barra o
// que a lista não conhece, e tudo o que foi barrado fica visível no PR para uma pessoa conferir.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { FORA_DO_ESCOPO, REVISAR } from "../coleta/classificador.js";
import { chave } from "../coleta/deduplicar.js";
import { aplicarFiltro, separarForaDoEscopo, validarFiltro } from "../coleta/filtro-de-termos.js";

const lerJson = async (caminho) => JSON.parse(await readFile(new URL(caminho, import.meta.url), "utf-8"));

const filtro = {
  versao: 1,
  fora_do_escopo: { covid19: "Saúde em geral", ipca: "Economia e orçamento público" },
  liberados: { libras: "Curso e serviço presentes na UnB" },
  alteracoes_recusadas: { fav: "O PDF traz o nome com erro" },
};

const novo = (termo, significado = `Significado de ${termo}`, classificacao) => ({
  candidato: { termo, significado, fonte: "https://planejamento.unb.br/", ...(classificacao ? { classificacao } : {}) },
  motivo: "nenhum termo igual",
  proposta_id: chave(termo),
});
const alterado = (id) => ({ id, candidato: { termo: id.toUpperCase() }, mudancas: { significado: { de: "a", para: "b" } } });
const resultado = (novos = [], alterados = []) => ({ novos, alterados, conflitos: [], iguais: [], descartados: [] });

test("a lista fixa barra o termo antes do LLM, com o motivo e a origem", () => {
  const saida = aplicarFiltro(resultado([novo("Covid-19"), novo("CAPES")]), filtro);
  assert.deepEqual(saida.novos.map((r) => r.candidato.termo), ["CAPES"]);
  assert.equal(saida.barrados.length, 1);
  assert.equal(saida.barrados[0].candidato.termo, "Covid-19");
  assert.equal(saida.barrados[0].motivo, "Saúde em geral");
  assert.equal(saida.barrados[0].origem, "lista");
});

test("a lista compara pela chave: caixa, acento e hífen não escapam do filtro", () => {
  const saida = aplicarFiltro(resultado([novo("COVID 19"), novo("Ipca")]), filtro);
  assert.equal(saida.novos.length, 0);
  assert.equal(saida.barrados.length, 2);
});

test("aplicarFiltro não altera o resultado recebido", () => {
  const entrada = resultado([novo("Covid-19")], [alterado("fav")]);
  const antes = structuredClone(entrada);
  aplicarFiltro(entrada, filtro);
  assert.deepEqual(entrada, antes);
});

test("alteração recusada não muda o termo e fica registrada com o motivo", () => {
  const saida = aplicarFiltro(resultado([], [alterado("fav"), alterado("dpo")]), filtro);
  assert.deepEqual(saida.alterados.map((r) => r.id), ["dpo"]);
  assert.equal(saida.alteracoes_recusadas[0].id, "fav");
  assert.equal(saida.alteracoes_recusadas[0].motivo_recusa, "O PDF traz o nome com erro");
});

test("termo que o LLM já barrou não gasta outra chamada, se o significado é o mesmo", () => {
  const barradosAntes = [{ candidato: { termo: "PIB", significado: "Produto Interno Bruto" }, motivo: "Índice econômico", origem: "gemini" }];
  const saida = aplicarFiltro(resultado([novo("PIB", "Produto Interno Bruto")]), filtro, { barradosAntes });
  assert.equal(saida.novos.length, 0);
  assert.equal(saida.barrados[0].origem, "gemini");
  assert.equal(saida.barrados[0].motivo, "Índice econômico");
});

test("se o significado mudou na fonte, o LLM avalia o termo de novo", () => {
  const barradosAntes = [{ candidato: { termo: "PIB", significado: "Produto Interno Bruto" }, motivo: "Índice econômico", origem: "gemini" }];
  const saida = aplicarFiltro(resultado([novo("PIB", "Programa Interno de Bolsas")]), filtro, { barradosAntes });
  assert.equal(saida.novos.length, 1);
  assert.equal(saida.barrados.length, 0);
});

test("termo liberado por uma pessoa não fica preso numa recusa antiga do LLM", () => {
  const barradosAntes = [{ candidato: { termo: "Libras", significado: "Língua Brasileira de Sinais" }, motivo: "Geral", origem: "gemini" }];
  const saida = aplicarFiltro(resultado([novo("Libras", "Língua Brasileira de Sinais")]), filtro, { barradosAntes });
  assert.equal(saida.novos.length, 1);
});

test("separarForaDoEscopo tira do caminho o que o LLM recusou", () => {
  const recusado = novo("PIB", "Produto Interno Bruto", { estado: FORA_DO_ESCOPO, motivo: "Índice econômico" });
  const aceito = novo("DEG", "Decanato de Ensino de Graduação", { estado: REVISAR });
  const saida = separarForaDoEscopo({ ...resultado([recusado, aceito]), barrados: [] }, filtro);
  assert.deepEqual(saida.novos.map((r) => r.candidato.termo), ["DEG"]);
  assert.equal(saida.barrados[0].origem, "gemini");
  assert.equal(saida.barrados[0].motivo, "Índice econômico");
});

test("a decisão de uma pessoa vale mais que a do LLM: termo liberado volta para a revisão", () => {
  const recusado = novo("Libras", "Língua Brasileira de Sinais", { estado: FORA_DO_ESCOPO, motivo: "Geral" });
  const saida = separarForaDoEscopo({ ...resultado([recusado]), barrados: [] }, filtro);
  assert.equal(saida.barrados.length, 0);
  assert.equal(saida.novos[0].candidato.classificacao.estado, REVISAR);
});

test("validarFiltro aceita o formato certo", () => {
  assert.deepEqual(validarFiltro(filtro), []);
});

test("validarFiltro acusa seção faltando, motivo vazio e chave fora do formato", () => {
  assert.match(validarFiltro({ versao: 1 })[0], /fora_do_escopo/);
  assert.match(validarFiltro({ ...filtro, fora_do_escopo: { covid19: " " } })[0], /motivo/);
  assert.match(validarFiltro({ ...filtro, fora_do_escopo: { "Covid-19": "Saúde" } })[0], /chave/);
});

test("validarFiltro acusa o mesmo termo proibido e liberado", () => {
  const erros = validarFiltro({ ...filtro, liberados: { covid19: "Engano" } });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /covid19/);
});

test("o arquivo real do filtro é válido e não barra nenhum termo publicado nem da trilha", async () => {
  const real = await lerJson("../coleta/filtro-de-termos.json");
  assert.deepEqual(validarFiltro(real), []);
  assert.ok(Object.hasOwn(real.fora_do_escopo, "covid19"));
  const termos = await lerJson("../frontend/data/termos.json");
  const trilha = await lerJson("../frontend/data/trilha-calouro.json");
  const protegidos = new Set([...termos.map((t) => chave(t.termo)), ...trilha.grupos.flatMap((g) => g.termos)]);
  assert.deepEqual(Object.keys(real.fora_do_escopo).filter((id) => protegidos.has(id)), []);
});
