// O próprio teste de sabotagem (scripts/sabotagem.mjs): a lista é conferida, o defeito cai no lugar certo, o
// arquivo sempre volta ao original e o relatório só passa quando todos os defeitos quebram a suíte.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { aplicarTrocas, lerSabotagens, principal, relatorio, rodarSabotagens, validarSabotagem } from "../scripts/sabotagem.mjs";

const SOMA = "export const soma = (a, b) => a + b; // soma dois números\n";
const TESTE_DA_SOMA = 'import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport { soma } from "./soma.mjs";\ntest("soma", () => assert.equal(soma(2, 3), 5));\n';

function projetoDeMentira(sabotagens) {
  const raiz = mkdtempSync(path.join(tmpdir(), "sabotagem-"));
  writeFileSync(path.join(raiz, "soma.mjs"), SOMA);
  writeFileSync(path.join(raiz, "soma.test.mjs"), TESTE_DA_SOMA);
  mkdirSync(path.join(raiz, "tests", "sabotagens"), { recursive: true });
  writeFileSync(path.join(raiz, "tests", "sabotagens", "lista.json"), JSON.stringify(sabotagens));
  return raiz;
}

const quebra = { modulo: "soma.mjs", defeito: "soma vira subtração", arquivo: "soma.mjs", trocas: [{ de: "a + b", para: "a - b" }] };
const naoQuebra = { modulo: "soma.mjs", defeito: "só o comentário muda", arquivo: "soma.mjs", trocas: [{ de: "soma dois números", para: "outra coisa" }] };
const velha = { modulo: "soma.mjs", defeito: "trecho que não existe mais", arquivo: "soma.mjs", trocas: [{ de: "a * b", para: "a / b" }] };

test("a lista é conferida antes de sabotar (os itens chegam por PR)", () => {
  assert.deepEqual(validarSabotagem(quebra), []);
  assert.deepEqual(validarSabotagem(null), ["cada sabotagem deve ser um objeto"]);
  assert.deepEqual(validarSabotagem({ ...quebra, defeito: " " }), ["campo obrigatório ausente ou vazio: defeito"]);
  assert.match(validarSabotagem({ ...quebra, trocas: [] })[0], /pelo menos uma troca/);
  assert.match(validarSabotagem({ ...quebra, trocas: [{ de: "x" }] })[0], /precisa de "de"/);
  assert.match(validarSabotagem({ ...quebra, trocas: [{ de: "x", para: "x" }] })[0], /são iguais/);
});

test("o defeito só cai num trecho que aparece exatamente uma vez", () => {
  assert.equal(aplicarTrocas("a + b", [{ de: "+", para: "-" }]), "a - b");
  assert.equal(aplicarTrocas("x", [{ de: "x", para: "$&$&" }]), "$&$&");
  assert.throws(() => aplicarTrocas("a + b + c", [{ de: "+", para: "-" }]), /aparece 2 vezes/);
  assert.throws(() => aplicarTrocas("a + b", [{ de: "*", para: "/" }]), /aparece 0 vezes/);
});

test("arquivo fora do repositório e item inválido não são sabotados", () => {
  const raiz = projetoDeMentira([]);
  try {
    const [fora, invalido] = rodarSabotagens({
      raiz,
      sabotagens: [{ ...quebra, arquivo: "../fora.mjs" }, { ...quebra, trocas: [] }],
      rodarSuite: () => assert.fail("não deveria rodar a suíte"),
    });
    assert.equal(fora.situacao, "nao-aplicada");
    assert.match(fora.detalhe, /fora do repositório/);
    assert.equal(invalido.situacao, "invalida");
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});

test("o relatório só passa quando todos os defeitos quebram a suíte", () => {
  const r = (situacao) => ({ lista: "l.json", modulo: "m", defeito: "d", situacao, detalhe: "" });
  assert.equal(relatorio([r("quebrou"), r("quebrou")]).ok, true);
  assert.equal(relatorio([r("quebrou"), r("passou")]).ok, false);
  assert.equal(relatorio([r("nao-aplicada")]).ok, false);
  assert.equal(relatorio([]).ok, false);
  assert.match(relatorio([r("quebrou"), r("passou")]).texto, /1 de 2 defeitos quebraram a suíte: corrija/);
});

// Roda a suíte de verdade num projeto de mentira; fica de fora quando o próprio teste de sabotagem está rodando.
test("de ponta a ponta: quebra, passa, lista velha, arquivo restaurado e resumo do CI", { skip: process.env.SABOTAGEM === "1" }, () => {
  const raiz = projetoDeMentira([quebra, naoQuebra, velha]);
  const resumo = path.join(raiz, "resumo.md");
  const saida = [];
  try {
    assert.deepEqual(lerSabotagens(raiz).map((s) => s.lista), ["lista.json", "lista.json", "lista.json"]);
    const codigo = principal({ raiz, escrever: (t) => saida.push(t), resumoDoCi: resumo });
    assert.equal(codigo, 1);
    assert.match(saida[0], /soma vira subtração \| quebrou/);
    assert.match(saida[0], /só o comentário muda \| PASSOU/);
    assert.match(saida[0], /trecho que não existe mais \| NÃO APLICADA/);
    assert.equal(readFileSync(path.join(raiz, "soma.mjs"), "utf8"), SOMA);
    assert.match(readFileSync(resumo, "utf8"), /^## Teste de sabotagem/);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});

test("com todos os defeitos pegos, o código de saída é 0", { skip: process.env.SABOTAGEM === "1" }, () => {
  const raiz = projetoDeMentira([quebra]);
  try {
    assert.equal(principal({ raiz, escrever: () => {}, resumoDoCi: undefined }), 0);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});
