// Trilha do calouro (#70, ADR 0011): a lista de grupos fica em frontend/data/trilha-calouro.json
// e cita os termos pelo id. Estes testes garantem a integridade referencial: todo id citado
// existe no termos.json. Sem isso, um termo renomeado sumiria da página inicial sem ninguém ver.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { fonteOficial, montarTrilha, termosDaTrilha, validarTrilha } from "../frontend/js/trilha.js";

const lerJson = async (caminho) => JSON.parse(await readFile(new URL(caminho, import.meta.url), "utf-8"));
const termosReais = await lerJson("../frontend/data/termos.json");
const trilhaReal = await lerJson("../frontend/data/trilha-calouro.json");

const termo = (id, extras = {}) => ({ id, termo: id.toUpperCase(), fonte: `https://${id}.unb.br/`, categoria: "sistemas", ...extras });
const trilha = (...grupos) => ({ grupos });
const grupo = (id, termos) => ({ id, nome: `Grupo ${id}`, termos });

// ===== Os arquivos reais =====

test("trilha-calouro.json: todo id citado existe no termos.json (integridade referencial)", () => {
  assert.deepEqual(validarTrilha(trilhaReal, termosReais), []);
});

test("trilha-calouro.json: tem pelo menos 15 termos (critério da #70)", () => {
  assert.ok(termosDaTrilha(trilhaReal).length >= 15, `só ${termosDaTrilha(trilhaReal).length} termos`);
});

test("trilha-calouro.json: todo termo da trilha tem categoria e fonte oficial da UnB", () => {
  for (const item of montarTrilha(trilhaReal, termosReais).flatMap((g) => g.termos)) {
    assert.ok(item.categoria, `${item.id} sem categoria`);
    assert.ok(fonteOficial(item.fonte), `${item.id} sem fonte oficial: ${item.fonte}`);
  }
});

// ===== validarTrilha =====

test("validarTrilha acusa o id que não existe no termos.json", () => {
  const erros = validarTrilha(trilha(grupo("notas", ["ira", "nao-existe"])), [termo("ira")]);
  assert.equal(erros.length, 1);
  assert.match(erros[0], /nao-existe/);
});

test("validarTrilha acusa o termo repetido em dois grupos", () => {
  const erros = validarTrilha(trilha(grupo("a", ["ira"]), grupo("b", ["ira"])), [termo("ira")]);
  assert.equal(erros.length, 1);
  assert.match(erros[0], /ira.*mais de uma vez/);
});

test("validarTrilha acusa grupo sem termos, sem nome ou com id repetido", () => {
  const erros = validarTrilha(
    trilha(grupo("a", []), { id: "b", nome: " ", termos: ["ira"] }, grupo("b", ["ru"])),
    [termo("ira"), termo("ru")],
  );
  assert.equal(erros.length, 3);
});

test("validarTrilha recusa um arquivo sem a lista de grupos", () => {
  assert.equal(validarTrilha({}, []).length, 1);
  assert.equal(validarTrilha(null, []).length, 1);
});

// ===== montarTrilha =====

test("montarTrilha mantém a ordem dos grupos e dos termos do arquivo", () => {
  const termos = [termo("ru"), termo("bce"), termo("ira")];
  const montada = montarTrilha(trilha(grupo("notas", ["ira"]), grupo("lugares", ["bce", "ru"])), termos);
  assert.deepEqual(montada.map((g) => g.id), ["notas", "lugares"]);
  assert.deepEqual(montada[1].termos.map((t) => t.id), ["bce", "ru"]);
});

test("montarTrilha pula o id que não existe e o grupo que fica vazio", () => {
  const montada = montarTrilha(trilha(grupo("a", ["ru", "sumiu"]), grupo("b", ["sumiu"])), [termo("ru")]);
  assert.deepEqual(montada.map((g) => g.id), ["a"]);
  assert.deepEqual(montada[0].termos.map((t) => t.id), ["ru"]);
});

// ===== fonteOficial =====

test("fonteOficial aceita só endereço https da UnB", () => {
  assert.ok(fonteOficial("https://deg.unb.br/manual.pdf#page=46"));
  assert.ok(fonteOficial("https://unb.br/"));
  assert.ok(!fonteOficial("http://deg.unb.br/"));
  assert.ok(!fonteOficial("https://unb.br.exemplo.com/"));
  assert.ok(!fonteOficial("https://www.correiobraziliense.com.br/"));
  assert.ok(!fonteOficial("Conhecimento comum e vivência prática"));
});

// ===== Mutantes sobreviventes (#82): mensagens exatas e entradas ausentes =====

test("validarTrilha: mensagens exatas, grupo sem nome só com espaços e grupo repetido", () => {
  assert.deepEqual(validarTrilha({}, []), ['a trilha precisa de uma lista "grupos"']);
  assert.deepEqual(
    validarTrilha(trilha({ id: "a", nome: "  ", termos: ["x"] }, { id: "a", nome: "A", termos: [] }), [termo("x")]),
    ['grupo "a" sem nome', 'grupo "a" aparece mais de uma vez', 'grupo "a" sem termos'],
  );
});

test("termosDaTrilha e montarTrilha toleram trilha ausente e grupo sem lista de termos", () => {
  assert.deepEqual(termosDaTrilha(undefined), []);
  assert.deepEqual(termosDaTrilha({}), []);
  assert.deepEqual(termosDaTrilha(trilha({ id: "a" }, grupo("b", ["x"]))), ["x"]);
  assert.deepEqual(montarTrilha(undefined, []), []);
  assert.deepEqual(montarTrilha(trilha({ id: "a", nome: "A" }), []), []);
});

test("fonteOficial recusa texto que não é endereço", () => {
  assert.equal(fonteOficial("conhecimento comum"), false);
});

test("validarTrilha: grupo sem o campo nome (ausente ou de outro tipo) é acusado sem quebrar", () => {
  assert.deepEqual(validarTrilha(trilha({ id: "a", termos: ["x"] }), [termo("x")]), ['grupo "a" sem nome']);
  assert.deepEqual(validarTrilha(trilha({ id: "a", nome: 7, termos: ["x"] }), [termo("x")]), ['grupo "a" sem nome']);
});
