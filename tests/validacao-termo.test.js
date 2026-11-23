import { test } from "node:test";
import assert from "node:assert/strict";

import { urlSegura, validarGlossario, validarTermo } from "../frontend/js/validacao-termo.js";

const termoValido = () => ({
  id: "ru",
  termo: "RU",
  tipo: "sigla",
  categoria: "locais-campus",
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

test("categoria é obrigatória e aceita só os valores fechados da ADR 0004", () => {
  const { categoria, ...semCategoria } = termoValido();
  assert.ok(validarTermo(semCategoria).some((erro) => erro.includes("categoria")));
  assert.ok(validarTermo({ ...termoValido(), categoria: "esportes" }).some((erro) => erro.includes('categoria "esportes" inválida')));
  assert.ok(validarTermo({ ...termoValido(), categoria: "toString" }).some((erro) => erro.includes('categoria "toString" inválida')));
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

test("sinonimos: particionamento de equivalência e valores-limite", () => {
  // Partições válidas: ausente, lista vazia, lista com 1 ou mais textos.
  assert.deepEqual(validarTermo({ ...termoValido(), sinonimos: [] }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), sinonimos: ["FGA"] }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), sinonimos: ["FGA", "Faculdade do Gama"] }), []);

  // Partições inválidas: o que não é lista.
  for (const invalido of ["FGA", 123, {}, null]) {
    assert.ok(validarTermo({ ...termoValido(), sinonimos: invalido }).some((e) => e.includes("sinonimos deve ser uma lista")));
  }

  // Valores-limite dentro da lista: vazio, só espaços e outros tipos.
  for (const invalido of ["", "   ", null, 123]) {
    assert.ok(validarTermo({ ...termoValido(), sinonimos: [invalido] }).some((e) => e.includes("texto não vazio")));
  }

  // O mesmo sinônimo duas vezes no termo, sem diferenciar maiúsculas.
  assert.ok(validarTermo({ ...termoValido(), sinonimos: ["FGA", "fga"] }).some((e) => e.includes("duplicado")));
});

test("um sinônimo não pode ser o nome de outro termo do glossário (o robô ligaria a sigla ao termo errado)", () => {
  const fcte = { ...termoValido(), id: "fcte", termo: "FCTE", sinonimos: ["FGA"] };
  const fga = { ...termoValido(), id: "fga", termo: "FGA" };
  assert.ok(validarGlossario([fcte, fga]).some((erro) => erro.includes("sinônimo \"FGA\"") && erro.includes("fga")));
  assert.deepEqual(validarGlossario([{ ...fcte, sinonimos: ["Faculdade UnB Gama"] }, fga]), []);
});
