// Regras do tema claro e escuro (frontend/js/tema.js), sem o DOM.
import { test } from "node:test";
import assert from "node:assert/strict";

import { CHAVE_TEMA, escuroAtivo, proximoTema, salvarTema } from "../frontend/js/tema.js";

test("o tema escolhido vale mais que o do sistema; sem escolha, vale o do sistema", () => {
  assert.equal(escuroAtivo("escuro", false), true);
  assert.equal(escuroAtivo("claro", true), false);
  assert.equal(escuroAtivo(null, true), true);
  assert.equal(escuroAtivo(null, false), false);
});

test("o botão alterna entre claro e escuro", () => {
  assert.equal(proximoTema(true), "claro");
  assert.equal(proximoTema(false), "escuro");
});

test("a escolha é salva com o prefixo do projeto (a origem do GitHub Pages é compartilhada)", () => {
  const salvo = {};
  assert.equal(salvarTema(() => ({ setItem: (chave, valor) => { salvo[chave] = valor; } }), "escuro"), true);
  assert.deepEqual(salvo, { [CHAVE_TEMA]: "escuro" });
  assert.equal(CHAVE_TEMA, "glossario-unb:tema");
});

test("sem localStorage (modo privado, bloqueio), o tema continua funcionando e só avisa", () => {
  const avisos = [];
  const semArmazenamento = () => { throw new Error("SecurityError"); };
  assert.equal(salvarTema(semArmazenamento, "claro", (...aviso) => avisos.push(aviso)), false);
  assert.equal(avisos.length, 1);
  assert.equal(avisos[0][0], "Não foi possível salvar a preferência de tema:");
});
