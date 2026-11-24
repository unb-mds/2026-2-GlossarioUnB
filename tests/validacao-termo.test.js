import { test } from "node:test";
import assert from "node:assert/strict";

import { idValido, urlSegura, validarGlossario, validarTermo } from "../frontend/js/validacao-termo.js";

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

test("verificado_em é opcional e, quando existe, precisa ser uma data real aaaa-mm-dd", () => {
  assert.deepEqual(validarTermo({ ...termoValido(), verificado_em: "2026-11-24" }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), verificado_em: "2024-02-29" }), []);
  for (const invalida of ["24/11/2026", "2026-13-01", "2026-02-30", 20261124, ""]) {
    assert.ok(
      validarTermo({ ...termoValido(), verificado_em: invalida }).some((erro) => erro.includes("verificado_em")),
      `esperava erro para verificado_em=${invalida}`,
    );
  }
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

// ===== relacionados ("Veja também", decisão 57 = C1): cada ligação foi conferida por uma pessoa =====

test("relacionados: lista de ids no formato do glossário, sem repetir e sem apontar para o próprio termo", () => {
  assert.deepEqual(validarTermo({ ...termoValido(), relacionados: [] }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), relacionados: ["dac", "sigaa"] }), []);
  for (const invalido of ["dac", null, 3, { id: "dac" }]) {
    assert.ok(validarTermo({ ...termoValido(), relacionados: invalido }).some((e) => e.includes("relacionados deve ser uma lista")));
  }
  for (const invalido of ["DAC", "", "a b", 7, null]) {
    assert.ok(validarTermo({ ...termoValido(), relacionados: [invalido] }).some((e) => e.includes("relacionados[0]")));
  }
  assert.ok(validarTermo({ ...termoValido(), relacionados: ["ru"] }).some((e) => e.includes("próprio termo")));
  assert.ok(validarTermo({ ...termoValido(), relacionados: ["dac", "dac"] }).some((e) => e.includes("duplicado")));
});

test("relacionados: o CI recusa a ligação para um id que não existe no glossário", () => {
  const ru = { ...termoValido(), relacionados: ["dac"] };
  const dac = { ...termoValido(), id: "dac", termo: "DAC", significado: "Decanato de Assuntos Comunitários" };
  assert.deepEqual(validarGlossario([ru, dac]), []);
  assert.ok(validarGlossario([{ ...ru, relacionados: ["dac", "inexistente"] }, dac]).some((e) => e.includes('"inexistente" não existe')));
});

// ===== Mutantes sobreviventes (#82): limites, mensagens exatas e rótulos =====

const comLocalizacao = (extras) => ({
  ...termoValido(),
  localizacao: { lat: -15.76, lng: -47.87, link_como_chegar: "https://maps.example/x", ...extras },
});

test("latitude e longitude aceitam os extremos e recusam logo além deles", () => {
  for (const [campo, limite] of [["lat", 90], ["lng", 180]]) {
    assert.deepEqual(validarTermo(comLocalizacao({ [campo]: limite })), [], `${campo} = ${limite}`);
    assert.deepEqual(validarTermo(comLocalizacao({ [campo]: -limite })), [], `${campo} = -${limite}`);
    assert.equal(validarTermo(comLocalizacao({ [campo]: limite + 0.01 })).length, 1, `${campo} acima`);
    assert.equal(validarTermo(comLocalizacao({ [campo]: -limite - 0.01 })).length, 1, `${campo} abaixo`);
    assert.equal(validarTermo(comLocalizacao({ [campo]: "0" })).length, 1, `${campo} texto`);
  }
});

test("as mensagens de erro do termo são exatas", () => {
  assert.deepEqual(validarTermo(null), ["termo deve ser um objeto"]);
  assert.deepEqual(validarTermo("RU"), ["termo deve ser um objeto"]);
  assert.deepEqual(validarTermo({ ...termoValido(), localizacao: null }), ["localizacao deve ser um objeto"]);
  assert.deepEqual(validarTermo({ ...termoValido(), localizacao: 5 }), ["localizacao deve ser um objeto"]);
  assert.deepEqual(validarTermo(comLocalizacao({ lat: 91 })), ["localizacao.lat deve ser um número entre -90 e 90"]);
  assert.deepEqual(validarTermo(comLocalizacao({ lng: 181 })), ["localizacao.lng deve ser um número entre -180 e 180"]);
  assert.deepEqual(
    validarTermo({ ...termoValido(), tipo: "meme" }),
    ['tipo "meme" inválido (use: sigla, giria, expressao)'],
  );
  assert.deepEqual(
    validarTermo({ ...termoValido(), campus: "Marte" }),
    ['campus "Marte" inválido (use: Darcy Ribeiro, Ceilândia, Gama, Planaltina, Geral)'],
  );
});

test("o id não pode ter nada depois de um trecho válido", () => {
  assert.equal(validarTermo({ ...termoValido(), id: "ru Ru" }).length, 1);
  assert.equal(validarTermo({ ...termoValido(), id: "ru!" }).length, 1);
});

test("urlSegura recusa esquemas que não são http(s) e devolve o endereço normalizado", () => {
  assert.equal(urlSegura("ftp://unb.br/x"), null);
  assert.equal(urlSegura("https://unb.br"), "https://unb.br/");
  assert.equal(urlSegura("http://unb.br/a"), "http://unb.br/a");
});

test("validarGlossario rotula cada erro com a posição e o id do termo", () => {
  assert.deepEqual(validarGlossario("não é lista"), ["o arquivo de termos deve conter uma lista (array)"]);
  const erros = validarGlossario([{ ...termoValido(), id: "ok" }, { ...termoValido(), tipo: "meme" }]);
  assert.deepEqual(erros, ['termo #1 (ru): tipo "meme" inválido (use: sigla, giria, expressao)']);
  assert.deepEqual(validarGlossario([null]), ["termo #0 (sem id): termo deve ser um objeto"]);
  assert.deepEqual(validarGlossario([{ ...termoValido(), id: undefined }]), ["termo #0 (sem id): campo obrigatório ausente ou vazio: id"]);
});

test("validarGlossario não acusa id duplicado em termo sem id, nem quando o id só repete depois de um termo inválido", () => {
  const semId = { ...termoValido(), id: "" };
  assert.equal(validarGlossario([semId, semId]).filter((e) => e.includes("duplicado")).length, 0);
  const dup = validarGlossario([termoValido(), termoValido()]);
  assert.deepEqual(dup, ["termo #1 (ru): id duplicado"]);
});

test("idValido: a regra única do formato de id, usada também pela planta", () => {
  for (const id of ["ru", "aprender-3", "ldtea-ter-101"]) assert.equal(idValido(id), true, id);
  for (const id of ["", "RU", "ru ", "-ru", "ru-", "ru--bce", "ação", 7, null, undefined]) assert.equal(idValido(id), false, String(id));
});
