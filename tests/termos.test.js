import { test } from "node:test";
import assert from "node:assert/strict";

import {
  agruparPorLetra, buscarTermos, contarPorTipo, encontrarTermo, filtrarTermos, filtrosDaUrl, letraInicial, normalizar, resumoDoTermo,
} from "../frontend/js/termos.js";

const termo = (id, nome, extras = {}) => ({ id, termo: nome, tipo: "sigla", campus: "Geral", ...extras });

test("normalizar ignora acento, caixa e espaços nas pontas", () => {
  assert.equal(normalizar("  Minhocão "), "minhocao");
  assert.equal(normalizar("ÉTICA"), "etica");
});

test("buscarTermos devolve vazio para consulta vazia ou só com espaços", () => {
  assert.deepEqual(buscarTermos([termo("ru", "RU")], "   "), []);
});

test("buscarTermos encontra sem acento e sem diferenciar maiúsculas", () => {
  const resultado = buscarTermos([termo("minhocao", "Minhocão"), termo("ru", "RU")], "minhocao");
  assert.deepEqual(resultado.map((t) => t.id), ["minhocao"]);
});

test("buscarTermos coloca primeiro quem começa com a consulta", () => {
  const termos = [termo("dpo", "DPO"), termo("ppaes", "PPAES"), termo("pa", "PA")];
  assert.deepEqual(buscarTermos(termos, "pa").map((t) => t.id), ["pa", "ppaes"]);
});

test("buscarTermos respeita o limite de sugestões", () => {
  const termos = Array.from({ length: 12 }, (_, i) => termo(`t${i}`, `Termo ${i}`));
  assert.equal(buscarTermos(termos, "termo").length, 8);
  assert.equal(buscarTermos(termos, "termo", 3).length, 3);
});

test("filtrarTermos por campus inclui os termos Geral", () => {
  const termos = [
    termo("fce", "FCE", { campus: "Ceilândia" }),
    termo("ru", "RU", { campus: "Geral" }),
    termo("fga", "FGA", { campus: "Gama" }),
  ];
  assert.deepEqual(filtrarTermos(termos, { campus: "Ceilândia" }).map((t) => t.id), ["fce", "ru"]);
});

test("filtrarTermos por tipo (RF02) e combinado com campus", () => {
  const termos = [
    termo("ru", "RU"),
    termo("bandejao", "Bandejão", { tipo: "giria", campus: "Gama" }),
    termo("minhocao", "Minhocão", { tipo: "giria", campus: "Darcy Ribeiro" }),
  ];
  assert.deepEqual(filtrarTermos(termos, { tipo: "giria" }).map((t) => t.id), ["bandejao", "minhocao"]);
  assert.deepEqual(filtrarTermos(termos, { tipo: "giria", campus: "Gama" }).map((t) => t.id), ["bandejao"]);
  assert.equal(filtrarTermos(termos).length, 3);
});

test("letraInicial agrupa acentuadas pela letra base e símbolos em #", () => {
  assert.equal(letraInicial(termo("etica", "Ética")), "E");
  assert.equal(letraInicial(termo("x", "2º semestre")), "#");
});

test("agruparPorLetra ordena grupos e termos dentro de cada grupo", () => {
  const grupos = agruparPorLetra([termo("reuni", "REUNI"), termo("fce", "FCE"), termo("ru", "RU")]);
  assert.deepEqual(grupos.map(([letra, doGrupo]) => [letra, doGrupo.map((t) => t.id)]), [
    ["F", ["fce"]],
    ["R", ["reuni", "ru"]],
  ]);
});

test("encontrarTermo busca pelo id e devolve undefined quando não existe", () => {
  const termos = [termo("ru", "RU")];
  assert.equal(encontrarTermo(termos, "ru").termo, "RU");
  assert.equal(encontrarTermo(termos, "nao-existe"), undefined);
});

test("filtrosDaUrl aceita só tipos e campi conhecidos", () => {
  assert.deepEqual(filtrosDaUrl(new URLSearchParams("tipo=sigla&campus=Gama")), { tipo: "sigla", campus: "Gama" });
  assert.deepEqual(filtrosDaUrl(new URLSearchParams("tipo=toString&campus=Asa%20Norte")), { tipo: null, campus: null });
  assert.deepEqual(filtrosDaUrl(new URLSearchParams("")), { tipo: null, campus: null });
});

test("contarPorTipo segue a ordem dos tipos e omite os vazios", () => {
  const termos = [termo("bandejao", "Bandejão", { tipo: "giria" }), termo("ru", "RU"), termo("fce", "FCE")];
  assert.deepEqual(contarPorTipo(termos), [["sigla", 2], ["giria", 1]]);
});

test("resumoDoTermo usa o significado da sigla ou, sem ele, a definição", () => {
  assert.equal(resumoDoTermo(termo("ru", "RU", { significado: "Restaurante Universitário", definicao: "Onde se almoça." })), "Restaurante Universitário");
  assert.equal(resumoDoTermo(termo("bandejao", "Bandejão", { tipo: "giria", definicao: "Apelido do RU." })), "Apelido do RU.");
});
