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
