// Trilha do calouro (#70, ADR 0011): a lista de grupos fica em frontend/data/trilha-calouro.json
// e cita os termos pelo id. Estes testes garantem a integridade referencial: todo id citado
// existe no termos.json. Sem isso, um termo renomeado sumiria da página inicial sem ninguém ver.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  CHAVE_PROGRESSO,
  armazenamentoDisponivel,
  fonteOficial,
  lerVistos,
  marcarVisto,
  montarTrilha,
  progressoDaTrilha,
  recomecarTrilha,
  termosDaTrilha,
  validarTrilha,
} from "../frontend/js/trilha.js";

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

// ===== A trilha na ordem do semestre (decisão 58) =====

test("trilha-calouro.json: os grupos seguem a ordem em que o calouro precisa de cada termo", () => {
  assert.deepEqual(trilhaReal.grupos.map((g) => g.id), [
    "antes-da-primeira-aula",
    "primeira-semana",
    "durante-o-semestre",
    "proximo-semestre",
    "quando-precisar-de-apoio",
    "girias-do-campus",
  ]);
});

test("trilha-calouro.json: os 25 termos estão todos lá, sem perder nenhum dos 20 anteriores", () => {
  const esperados = [
    "ru", "bce", "icc", "mencao", "sr", "ira", "sigaa", "aprender-3", "email-institucional", "matricula",
    "fluxo", "tgm", "saa", "dac", "dds", "auxilio-socioeconomico", "dasu", "ceubinho", "minhocao", "beijodromo",
    "ceu", "dce", "ca", "sei", "deg",
  ];
  assert.deepEqual([...termosDaTrilha(trilhaReal)].sort(), [...esperados].sort());
});

test("trilha-calouro.json: a matrícula não aparece antes da primeira aula, porque a SAA matricula o calouro (Manual, p. 18)", () => {
  const primeiro = trilhaReal.grupos.find((g) => g.id === "antes-da-primeira-aula");
  assert.ok(!primeiro.termos.includes("matricula"));
  assert.ok(primeiro.termos.includes("saa"));
});

test("trilha-calouro.json: o TGM fica com o apoio, porque o Manual pede para buscar ajuda antes de trancar (p. 58)", () => {
  const apoio = trilhaReal.grupos.find((g) => g.id === "quando-precisar-de-apoio");
  assert.ok(apoio.termos.includes("tgm"));
  assert.equal(apoio.termos.at(-1), "tgm");
});

// ===== Progresso da trilha, guardado só no aparelho (decisão 58) =====

function armazenamentoFalso(inicial = {}) {
  const dados = new Map(Object.entries(inicial));
  return {
    dados,
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, String(valor)),
    removeItem: (chave) => dados.delete(chave),
  };
}
const quebrado = () => { throw new Error("armazenamento bloqueado"); };
const armazenamentoQuebrado = () => ({ getItem: quebrado, setItem: quebrado, removeItem: quebrado });
const salvo = (ids) => ({ [CHAVE_PROGRESSO]: JSON.stringify(ids) });
const IDS = ["ru", "bce", "ira"];

test("a chave do progresso tem o prefixo do site, porque a origem é dividida com outros projetos", () => {
  assert.match(CHAVE_PROGRESSO, /^glossario-unb:/);
});

test("lerVistos devolve os ids salvos que ainda estão na trilha", () => {
  const vistos = lerVistos(() => armazenamentoFalso(salvo(["ru", "saiu-da-trilha", "ira"])), IDS);
  assert.deepEqual([...vistos], ["ru", "ira"]);
});

test("lerVistos ignora conteúdo inválido, repetido ou que não seja texto", () => {
  assert.equal(lerVistos(() => armazenamentoFalso({ [CHAVE_PROGRESSO]: "{quebrado" }), IDS).size, 0);
  assert.equal(lerVistos(() => armazenamentoFalso({ [CHAVE_PROGRESSO]: '{"ru":true}' }), IDS).size, 0);
  assert.deepEqual([...lerVistos(() => armazenamentoFalso(salvo(["ru", "ru", 7, null])), IDS)], ["ru"]);
  assert.equal(lerVistos(() => armazenamentoFalso(), IDS).size, 0);
});

test("lerVistos não quebra sem armazenamento", () => {
  assert.equal(lerVistos(armazenamentoQuebrado, IDS).size, 0);
  assert.equal(lerVistos(quebrado, IDS).size, 0);
});

test("marcarVisto guarda o termo da trilha uma vez só", () => {
  const armazenamento = armazenamentoFalso();
  assert.equal(marcarVisto(() => armazenamento, "ru", IDS), true);
  assert.equal(marcarVisto(() => armazenamento, "ru", IDS), true);
  assert.equal(marcarVisto(() => armazenamento, "ira", IDS), true);
  assert.deepEqual(JSON.parse(armazenamento.getItem(CHAVE_PROGRESSO)), ["ru", "ira"]);
});

test("marcarVisto não guarda termo que não é da trilha", () => {
  const armazenamento = armazenamentoFalso();
  assert.equal(marcarVisto(() => armazenamento, "dpo", IDS), false);
  assert.equal(armazenamento.getItem(CHAVE_PROGRESSO), null);
});

test("marcarVisto limpa o id que saiu da trilha ao salvar de novo", () => {
  const armazenamento = armazenamentoFalso(salvo(["saiu-da-trilha", "ru"]));
  marcarVisto(() => armazenamento, "bce", IDS);
  assert.deepEqual(JSON.parse(armazenamento.getItem(CHAVE_PROGRESSO)), ["ru", "bce"]);
});

test("marcarVisto não quebra sem armazenamento", () => {
  assert.equal(marcarVisto(armazenamentoQuebrado, "ru", IDS), false);
  assert.equal(marcarVisto(quebrado, "ru", IDS), false);
});

test("recomecarTrilha apaga só o progresso", () => {
  const armazenamento = armazenamentoFalso({ ...salvo(["ru"]), "glossario-unb:tema": "escuro" });
  assert.equal(recomecarTrilha(() => armazenamento), true);
  assert.equal(armazenamento.getItem(CHAVE_PROGRESSO), null);
  assert.equal(armazenamento.getItem("glossario-unb:tema"), "escuro");
  assert.equal(recomecarTrilha(armazenamentoQuebrado), false);
});

test("armazenamentoDisponivel testa de verdade e não deixa rastro", () => {
  const armazenamento = armazenamentoFalso();
  assert.equal(armazenamentoDisponivel(() => armazenamento), true);
  assert.equal(armazenamento.dados.size, 0);
  assert.equal(armazenamentoDisponivel(armazenamentoQuebrado), false);
  assert.equal(armazenamentoDisponivel(quebrado), false);
});

test("progressoDaTrilha conta só o que está na trilha e diz x de total", () => {
  assert.deepEqual(progressoDaTrilha(IDS, new Set()), { vistos: 0, total: 3, texto: "Você já viu 0 de 3" });
  assert.deepEqual(progressoDaTrilha(IDS, new Set(["ru", "fora"])), { vistos: 1, total: 3, texto: "Você já viu 1 de 3" });
  assert.deepEqual(progressoDaTrilha(IDS, new Set(IDS)), { vistos: 3, total: 3, texto: "Você já viu 3 de 3" });
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
