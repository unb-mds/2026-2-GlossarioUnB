import { test } from "node:test";
import assert from "node:assert/strict";

import { urlSegura, validarGlossario, validarTermo } from "../frontend/js/validacao-termo.js";

const termoValido = () => ({
  id: "ru",
  termo: "RU",
  tipo: "sigla",
  significado: "Restaurante Universitário",
  definicao: "Onde os estudantes almoçam.",
  exemplo_uso: "Bora almoçar no RU?",
  fonte: "https://www.unb.br",
  campus: "Geral",
});

test("termo completo é válido", () => {
  assert.deepEqual(validarTermo(termoValido()), []);
});

test("fonte é obrigatória (regra do CONTRIBUTING)", () => {
  const erros = validarTermo({ ...termoValido(), fonte: "  " });
  assert.ok(erros.some((erro) => erro.includes("fonte")));
});

test("tipo precisa ser sigla, giria ou expressao", () => {
  const erros = validarTermo({ ...termoValido(), tipo: "local" });
  assert.ok(erros.some((erro) => erro.includes('tipo "local" inválido')));
});

test("tipo não aceita chaves herdadas do objeto (ex.: toString)", () => {
  assert.ok(validarTermo({ ...termoValido(), tipo: "toString" }).some((erro) => erro.includes('tipo "toString" inválido')));
});

test("sigla sem significado por extenso é inválida", () => {
  const { significado, ...semSignificado } = termoValido();
  assert.ok(validarTermo(semSignificado).some((erro) => erro.includes("significado")));
});

test("gíria não precisa de significado", () => {
  const { significado, ...giria } = { ...termoValido(), tipo: "giria" };
  assert.deepEqual(validarTermo(giria), []);
});

test("campus fora da lista é inválido", () => {
  assert.ok(validarTermo({ ...termoValido(), campus: "Asa Norte" }).some((erro) => erro.includes("campus")));
});

test("id só aceita minúsculas sem acento, números e hífens", () => {
  assert.ok(validarTermo({ ...termoValido(), id: "Minhocão" }).some((erro) => erro.includes("id")));
  assert.deepEqual(validarTermo({ ...termoValido(), id: "trancamento-geral" }), []);
});

test("localizacao exige coordenadas válidas e link http(s)", () => {
  const erros = validarTermo({
    ...termoValido(),
    localizacao: { lat: -200, lng: -47.87, link_como_chegar: "javascript:alert(1)" },
  });
  assert.ok(erros.some((erro) => erro.includes("lat")));
  assert.ok(erros.some((erro) => erro.includes("link_como_chegar")));
});

test("validarGlossario aponta ids duplicados", () => {
  const erros = validarGlossario([termoValido(), termoValido()]);
  assert.deepEqual(erros, ["termo #1 (ru): id duplicado"]);
});

test("validarGlossario rejeita arquivo que não é lista", () => {
  assert.equal(validarGlossario({}).length, 1);
});

test("urlSegura aceita só links absolutos http(s)", () => {
  assert.equal(urlSegura("https://www.unb.br/"), "https://www.unb.br/");
  assert.equal(urlSegura("javascript:alert(1)"), null);
  assert.equal(urlSegura("conhecimento comum verificado pelo grupo"), null);
});
