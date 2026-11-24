// A planta da FCTE de verdade (frontend/data/planta-fcte.json, ADR 0012) contra o glossário:
// formato, ligações com os termos e o tamanho do arquivo (que vai no cache do aplicativo).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

import { acharLugar, conferirLigacoes, montarSvgAndar, montarSvgCampus, termosPendentes } from "../frontend/js/planta.js";
import { idValido } from "../frontend/js/validacao-termo.js";

const URL_PLANTA = new URL("../frontend/data/planta-fcte.json", import.meta.url);
const planta = JSON.parse(await readFile(URL_PLANTA, "utf8"));
const termos = JSON.parse(await readFile(new URL("../frontend/data/termos.json", import.meta.url), "utf8"));
const idsTermos = termos.map((termo) => termo.id);

test("a planta é a versão 2, tem o campus e cada prédio tem pelo menos um andar", () => {
  assert.equal(planta.versao, 2);
  assert.ok(planta.campus.nome);
  assert.ok(planta.predios.length >= 3);
  for (const predio of planta.predios) assert.ok(predio.andares.length >= 1, `o prédio ${predio.id} não tem andar`);
});

test("as ligações da planta com os termos estão certas", () => {
  assert.deepEqual(conferirLigacoes(planta), []);
});

test("o termo fcte, que já existe, mostra o campus", () => {
  assert.ok(idsTermos.includes("fcte"));
  assert.deepEqual(acharLugar(planta, "fcte"), { campus: true });
});

// Sem sigla fixa: quando o robô trouxer um termo, ele sai da lista de pendentes, e o teste continua valendo.
test("os termos que a planta cita e o glossário ainda não tem são só os que o robô vai criar", () => {
  const pendentes = termosPendentes(planta, idsTermos);
  assert.ok(!pendentes.includes("fcte"));
  for (const id of pendentes) {
    assert.ok(idValido(id), `id fora do formato: ${id}`);
    assert.ok(!idsTermos.includes(id), `${id} já existe e não devia estar pendente`);
  }
});

test("as salas de várias siglas levam cada sigla ao mesmo lugar", () => {
  for (const grupo of [["lappis", "lated", "list"], ["bioenglab", "magpie", "larsis"], ["lasee", "lmpie"], ["arc", "lacem"]]) {
    const lugar = acharLugar(planta, grupo[0]);
    assert.ok(lugar?.item, grupo[0]);
    for (const sigla of grupo) assert.deepEqual(acharLugar(planta, sigla), lugar, sigla);
  }
});

test("todo andar e o campus da planta viram um SVG", () => {
  assert.ok(montarSvgCampus(planta, { links: true }).startsWith("<svg"));
  for (const predio of planta.predios) {
    for (const andar of predio.andares) assert.ok(montarSvgAndar(planta, predio.id, andar.id, {}).startsWith("<svg"), `${predio.id}/${andar.id}`);
  }
});

test("o arquivo da planta fica abaixo de 150 KB (ele entra no cache do aplicativo na primeira visita)", async () => {
  assert.ok((await stat(URL_PLANTA)).size < 150 * 1024);
});

test("os números da planta têm no máximo 2 casas decimais", async () => {
  const texto = await readFile(URL_PLANTA, "utf8");
  assert.doesNotMatch(texto, /\d\.\d{3,}/);
});

test("as 22 salas do LDTEA que vieram do site da FCTE aparecem como posição aproximada (decisão 54)", () => {
  const ldtea = planta.predios.find((predio) => predio.id === "uep");
  const itens = ldtea.andares.flatMap((andar) => andar.itens);
  assert.equal(itens.length, 22);
  assert.ok(itens.every((item) => item.posicao === "aproximada"));
  const outros = planta.predios.filter((predio) => predio.id !== "uep").flatMap((predio) => predio.andares.flatMap((andar) => andar.itens));
  assert.ok(outros.every((item) => item.posicao === undefined));
});
