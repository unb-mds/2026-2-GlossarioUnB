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
  assert.deepEqual(filtrosDaUrl(new URLSearchParams("tipo=sigla&campus=Gama")), { tipo: "sigla", campus: "Gama", categoria: null });
  assert.deepEqual(filtrosDaUrl(new URLSearchParams("tipo=toString&campus=Asa%20Norte")), { tipo: null, campus: null, categoria: null });
  assert.deepEqual(filtrosDaUrl(new URLSearchParams("")), { tipo: null, campus: null, categoria: null });
});

test("filtrosDaUrl aceita só categorias da taxonomia", () => {
  assert.equal(filtrosDaUrl(new URLSearchParams("categoria=sistemas")).categoria, "sistemas");
  assert.equal(filtrosDaUrl(new URLSearchParams("categoria=toString")).categoria, null);
  assert.equal(filtrosDaUrl(new URLSearchParams("categoria=inventada")).categoria, null);
});

test("filtrarTermos filtra por categoria e combina com tipo e campus", () => {
  const termos = [
    termo("sigaa", "SIGAA", { categoria: "sistemas" }),
    termo("fcte", "FCTE", { categoria: "unidades-academicas", campus: "Gama" }),
    termo("ceubinho", "Ceubinho", { categoria: "locais-campus", tipo: "giria", campus: "Darcy Ribeiro" }),
  ];
  assert.deepEqual(filtrarTermos(termos, { categoria: "sistemas" }).map((t) => t.id), ["sigaa"]);
  assert.deepEqual(filtrarTermos(termos, { categoria: "locais-campus", tipo: "sigla" }), []);
  assert.deepEqual(filtrarTermos(termos, { categoria: "unidades-academicas", campus: "Gama" }).map((t) => t.id), ["fcte"]);
  assert.equal(filtrarTermos(termos, { categoria: null }).length, 3);
});

test("buscarTermos encontra termo pelos sinônimos, sem diferenciar acento e caixa", () => {
  const termos = [
    termo("auxilio", "Auxílio Socioeconômico", { sinonimos: ["assistência econômica"] }),
    termo("fcts", "FCTS", { sinonimos: ["FCE"] }),
    termo("ru", "RU"),
  ];
  assert.deepEqual(buscarTermos(termos, "assistencia economica").map((t) => t.id), ["auxilio"]);
  assert.deepEqual(buscarTermos(termos, "ASSISTÊNCIA").map((t) => t.id), ["auxilio"]);
  assert.deepEqual(buscarTermos(termos, "fce").map((t) => t.id), ["fcts"]);
});

test("buscarTermos prioriza nome que começa com a busca, seguido por sinônimo que começa", () => {
  const termos = [
    termo("outra-sigla", "XPTO", { sinonimos: ["Gama Faculdade"] }),
    termo("fcte", "FCTE", { sinonimos: ["FGA"] }),
    termo("gama-termo", "GAMA", {}),
  ];
  // "ga": GAMA começa com "ga", "Gama Faculdade" começa com "ga" e "FGA" só contém "ga".
  assert.deepEqual(buscarTermos(termos, "ga").map((t) => t.id), ["gama-termo", "outra-sigla", "fcte"]);
});

test("buscarTermos não quebra com sinonimos que não é lista", () => {
  assert.deepEqual(buscarTermos([termo("ru", "RU", { sinonimos: "bandejão" })], "bandejao"), []);
});

test("contarPorTipo segue a ordem dos tipos e omite os vazios", () => {
  const termos = [termo("bandejao", "Bandejão", { tipo: "giria" }), termo("ru", "RU"), termo("fce", "FCE")];
  assert.deepEqual(contarPorTipo(termos), [["sigla", 2], ["giria", 1]]);
});

test("resumoDoTermo usa o significado da sigla ou, sem ele, a definição", () => {
  assert.equal(resumoDoTermo(termo("ru", "RU", { significado: "Restaurante Universitário", definicao: "Onde se almoça." })), "Restaurante Universitário");
  assert.equal(resumoDoTermo(termo("bandejao", "Bandejão", { tipo: "giria", definicao: "Apelido do RU." })), "Apelido do RU.");
});

// ===== Mutantes sobreviventes (#82) =====

test("buscarTermos: quem começa com a consulta vem antes de quem só a contém no fim", () => {
  const termos = [termo("a", "Casapa"), termo("b", "Pasta")];
  assert.deepEqual(buscarTermos(termos, "pa").map((t) => t.id), ["b", "a"]);
});

test("agruparPorLetra ordena os termos de cada letra pelo nome sem acento", () => {
  const termos = [termo("b", "Bola"), termo("a2", "Ágora"), termo("a1", "Abacate")];
  const [[letra, doGrupo]] = agruparPorLetra(termos);
  assert.equal(letra, "A");
  assert.deepEqual(doGrupo.map((t) => t.id), ["a1", "a2"]);
});
