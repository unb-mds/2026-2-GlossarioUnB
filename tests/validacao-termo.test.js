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

// ===== Testes de Particionamento de Equivalência e Valores-Limite (Issue #64) =====

test("sinonimos: particionamento de equivalência e valores-limite", () => {
  // Partições válidas: ausente, array vazio, array com 1 ou mais strings
  assert.deepEqual(validarTermo({ ...termoValido(), sinonimos: [] }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), sinonimos: ["FGA"] }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), sinonimos: ["FGA", "Faculdade do Gama"] }), []);

  // Partições inválidas: não-array (string, número, objeto, boolean, null)
  assert.ok(validarTermo({ ...termoValido(), sinonimos: "FGA" }).some((e) => e.includes("sinonimos deve ser uma lista")));
  assert.ok(validarTermo({ ...termoValido(), sinonimos: 123 }).some((e) => e.includes("sinonimos deve ser uma lista")));
  assert.ok(validarTermo({ ...termoValido(), sinonimos: {} }).some((e) => e.includes("sinonimos deve ser uma lista")));
  assert.ok(validarTermo({ ...termoValido(), sinonimos: null }).some((e) => e.includes("sinonimos deve ser uma lista")));

  // Partições inválidas / valores-limite dentro do array: string vazia, só espaços, tipos inválidos
  assert.ok(validarTermo({ ...termoValido(), sinonimos: [""] }).some((e) => e.includes("texto não vazio")));
  assert.ok(validarTermo({ ...termoValido(), sinonimos: ["   "] }).some((e) => e.includes("texto não vazio")));
  assert.ok(validarTermo({ ...termoValido(), sinonimos: [null] }).some((e) => e.includes("texto não vazio")));
  assert.ok(validarTermo({ ...termoValido(), sinonimos: [123] }).some((e) => e.includes("texto não vazio")));

  // Partição inválida: sinônimos duplicados no mesmo termo (insensível a maiúsculas)
  assert.ok(validarTermo({ ...termoValido(), sinonimos: ["FGA", "fga"] }).some((e) => e.includes("duplicado")));
});

test("relacionados: particionamento de equivalência e valores-limite no termo", () => {
  // Partições válidas: ausente, array vazio, array com ids válidos
  assert.deepEqual(validarTermo({ ...termoValido(), relacionados: [] }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), relacionados: ["bce", "fcte"] }), []);

  // Partições inválidas: não-array
  assert.ok(validarTermo({ ...termoValido(), relacionados: "bce" }).some((e) => e.includes("relacionados deve ser uma lista")));
  assert.ok(validarTermo({ ...termoValido(), relacionados: { id: "bce" } }).some((e) => e.includes("relacionados deve ser uma lista")));

  // Partições inválidas / valores-limite dentro do array: id inválido, maiúsculo, espaços, acento, vazio
  assert.ok(validarTermo({ ...termoValido(), relacionados: ["BCE"] }).some((e) => e.includes("letras minúsculas")));
  assert.ok(validarTermo({ ...termoValido(), relacionados: ["bce com espaco"] }).some((e) => e.includes("letras minúsculas")));
  assert.ok(validarTermo({ ...termoValido(), relacionados: [""] }).some((e) => e.includes("letras minúsculas")));
  assert.ok(validarTermo({ ...termoValido(), relacionados: [123] }).some((e) => e.includes("letras minúsculas")));

  // Partição inválida: auto-referência
  assert.ok(validarTermo({ ...termoValido(), id: "ru", relacionados: ["ru"] }).some((e) => e.includes("próprio termo")));

  // Partição inválida: ids duplicados
  assert.ok(validarTermo({ ...termoValido(), relacionados: ["bce", "bce"] }).some((e) => e.includes("duplicado")));
});

test("relacionados: validarGlossario rejeita ids inexistentes no CI", () => {
  const termoA = { ...termoValido(), id: "termo-a", relacionados: ["termo-b"] };
  const termoB = { ...termoValido(), id: "termo-b", termo: "Termo B" };
  assert.deepEqual(validarGlossario([termoA, termoB]), []);

  const termoInvalido = { ...termoValido(), id: "termo-c", termo: "Termo C", relacionados: ["fantasma"] };
  const erros = validarGlossario([termoA, termoB, termoInvalido]);
  assert.ok(erros.some((e) => e.includes('id relacionado "fantasma" não existe no glossário')));
});

test("saiba_mais: particionamento de equivalência e valores-limite", () => {
  // Partições válidas: ausente, url https ou http
  assert.deepEqual(validarTermo({ ...termoValido(), saiba_mais: "https://fcte.unb.br/" }), []);
  assert.deepEqual(validarTermo({ ...termoValido(), saiba_mais: "http://unb.br/pesquisa" }), []);

  // Partições inválidas / valores-limite
  assert.ok(validarTermo({ ...termoValido(), saiba_mais: "" }).some((e) => e.includes("saiba_mais deve ser um link")));
  assert.ok(validarTermo({ ...termoValido(), saiba_mais: "   " }).some((e) => e.includes("saiba_mais deve ser um link")));
  assert.ok(validarTermo({ ...termoValido(), saiba_mais: 123 }).some((e) => e.includes("saiba_mais deve ser um link")));
  assert.ok(validarTermo({ ...termoValido(), saiba_mais: "javascript:alert(1)" }).some((e) => e.includes("saiba_mais deve ser um link")));
  assert.ok(validarTermo({ ...termoValido(), saiba_mais: "/pagina-relativa" }).some((e) => e.includes("saiba_mais deve ser um link")));
  assert.ok(validarTermo({ ...termoValido(), saiba_mais: "apenas um texto explicativo" }).some((e) => e.includes("saiba_mais deve ser um link")));
});

test("origem e coletado_em: particionamento de equivalência e valores-limite", () => {
  // Partições válidas:
  // 1) origem "manual" sem coletado_em
  assert.deepEqual(validarTermo({ ...termoValido(), origem: "manual" }), []);
  // 2) origem "coleta" com coletado_em em data ISO válida (AAAA-MM-DD)
  assert.deepEqual(validarTermo({ ...termoValido(), origem: "coleta", coletado_em: "2026-10-28" }), []);

  // Partições inválidas:
  // 1) origem com valor fora da lista
  assert.ok(validarTermo({ ...termoValido(), origem: "automatica" }).some((e) => e.includes('origem "automatica" inválida')));
  assert.ok(validarTermo({ ...termoValido(), origem: "toString" }).some((e) => e.includes('origem "toString" inválida')));

  // 2) origem "coleta" sem data coletado_em
  assert.ok(validarTermo({ ...termoValido(), origem: "coleta" }).some((e) => e.includes('precisa de coletado_em')));

  // 3) coletado_em informado com origem "manual"
  assert.ok(validarTermo({ ...termoValido(), origem: "manual", coletado_em: "2026-10-28" }).some((e) => e.includes('só deve ser informado quando origem for "coleta"')));

  // 4) coletado_em informado sem campo origem
  assert.ok(validarTermo({ ...termoValido(), coletado_em: "2026-10-28" }).some((e) => e.includes('só deve ser informado quando origem for "coleta"')));

  // 5) valores-limite de data:
  // Formato brasileiro DD/MM/AAAA
  assert.ok(validarTermo({ ...termoValido(), origem: "coleta", coletado_em: "28/10/2026" }).some((e) => e.includes("data válida no formato AAAA-MM-DD")));
  // Data que não existe no calendário (31 de fevereiro)
  assert.ok(validarTermo({ ...termoValido(), origem: "coleta", coletado_em: "2026-02-31" }).some((e) => e.includes("data válida no formato AAAA-MM-DD")));
  // Mês inexistente (mês 13)
  assert.ok(validarTermo({ ...termoValido(), origem: "coleta", coletado_em: "2026-13-10" }).some((e) => e.includes("data válida no formato AAAA-MM-DD")));
  // String vazia ou texto livre
  assert.ok(validarTermo({ ...termoValido(), origem: "coleta", coletado_em: "" }).some((e) => e.includes("data válida no formato AAAA-MM-DD")));
  assert.ok(validarTermo({ ...termoValido(), origem: "coleta", coletado_em: "ontem" }).some((e) => e.includes("data válida no formato AAAA-MM-DD")));
});
