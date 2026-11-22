// Regras da página do termo (frontend/js/ficha.js): o título da aba, o campus, a fonte e o endereço, sem o DOM.
import { test } from "node:test";
import assert from "node:assert/strict";

import { rotuloCampus, textoDaFonte, tituloDaFicha, urlDoTermo } from "../frontend/js/ficha.js";

test("o endereço do termo usa o id, com os caracteres especiais codificados", () => {
  assert.equal(urlDoTermo({ id: "deg" }), "termo.html?id=deg");
  assert.equal(urlDoTermo({ id: "a b&c" }), "termo.html?id=a%20b%26c");
});

test("a aba do navegador mostra o nome do termo e o do site", () => {
  assert.equal(tituloDaFicha({ termo: "DEG" }), "DEG — Glossário UnB");
});

test("o campus Geral aparece como todos os campi", () => {
  assert.equal(rotuloCampus("Geral"), "Todos os campi");
  assert.equal(rotuloCampus("Gama"), "Campus Gama");
});

test("fonte com link aparece sem https:// e sem a barra final", () => {
  assert.deepEqual(textoDaFonte("https://deg.unb.br/"), { texto: "deg.unb.br", href: "https://deg.unb.br/" });
  assert.deepEqual(textoDaFonte("https://unb.br/administrativo-rodape/decanatos"), {
    texto: "unb.br/administrativo-rodape/decanatos", href: "https://unb.br/administrativo-rodape/decanatos",
  });
});

test("fonte em texto fica como está, e javascript: não vira link", () => {
  assert.deepEqual(textoDaFonte("Conhecimento comum verificado pelo grupo"), { texto: "Conhecimento comum verificado pelo grupo" });
  assert.deepEqual(textoDaFonte("javascript:alert(1)"), { texto: "javascript:alert(1)" });
});
