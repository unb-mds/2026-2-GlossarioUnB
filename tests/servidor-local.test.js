// O servidor local do `npm run dev` (scripts/servidor-local.mjs): o mesmo layout do GitHub Pages e a segurança de
// quem roda o site na própria máquina. O redirecionamento de "/frontend" para "/frontend/" nunca pode levar o destino
// do endereço pedido (redirecionamento aberto, regra S5146 do SonarQube), e nada fora das pastas publicadas é servido.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";

import { criarServidor } from "../scripts/servidor-local.mjs";

let servidor;
let base;
before(async () => {
  servidor = criarServidor();
  await new Promise((pronto) => servidor.listen(0, "127.0.0.1", pronto));
  base = `http://127.0.0.1:${servidor.address().port}`;
});
after(() => new Promise((fechado) => servidor.close(fechado)));

const pedir = (caminho) => fetch(base + caminho, { redirect: "manual" });

test("pasta sem a barra no fim redireciona para a mesma pasta, com a barra", async () => {
  const glossario = await pedir("/frontend");
  assert.equal(glossario.status, 301);
  assert.equal(glossario.headers.get("location"), "/frontend/");
  const sobre = await pedir("/sobre");
  assert.equal(sobre.headers.get("location"), "/sobre/");
});

test("o destino do redirecionamento sai da lista de pastas, nunca do endereço pedido", async () => {
  for (const caminho of ["//exemplo.com/frontend", "/%2F%2Fexemplo.com", "/frontendx", "/frontend%2F..%2F..", "/sobre?ir=//exemplo.com"]) {
    const resposta = await pedir(caminho);
    const destino = resposta.headers.get("location");
    if (destino !== null) assert.ok(["/frontend/", "/sobre/"].includes(destino), `${caminho} redirecionou para ${destino}`);
  }
});

test("serve o glossário, a página Sobre e a raiz", async () => {
  for (const caminho of ["/", "/frontend/", "/sobre/"]) {
    const resposta = await pedir(caminho);
    assert.equal(resposta.status, 200, caminho);
    assert.match(resposta.headers.get("content-type"), /text\/html/);
  }
  const dados = await pedir("/frontend/data/termos.json");
  assert.match(dados.headers.get("content-type"), /application\/json/);
});

test("nada fora das pastas publicadas é servido, nem com ../ escondido", async () => {
  for (const caminho of ["/tests/dados.test.js", "/package.json", "/frontend/%2e%2e/package.json", "/frontend/..%2Fpackage.json", "/.env"]) {
    const resposta = await pedir(caminho);
    assert.equal(resposta.status, 404, caminho);
  }
});

test("endereço que não decodifica responde 400", async () => {
  const resposta = await pedir("/%E0%A4%A");
  assert.equal(resposta.status, 400);
});
