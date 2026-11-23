// Regras da página inicial (frontend/js/busca.js): a busca com autocomplete, os atalhos por tipo e a trilha
// do calouro, sem o DOM.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  atalhosPorTipo, gruposDaTrilha, proximoIndice, sugestoesPara, termoDoEnvio, textoDoStatus, textoSemResultado,
} from "../frontend/js/busca.js";

const termos = [
  { id: "deg", termo: "DEG", tipo: "sigla", campus: "Geral", significado: "Decanato de Ensino de Graduação" },
  { id: "dex", termo: "DEX", tipo: "sigla", campus: "Geral", significado: "Decanato de Extensão" },
  { id: "ceubinho", termo: "Ceubinho", tipo: "giria", campus: "Darcy Ribeiro", definicao: "Prédio do ICC." },
];

test("consulta vazia (ou só espaços) não mostra sugestão nem status", () => {
  assert.equal(sugestoesPara(termos, "   "), null);
  assert.equal(textoDoStatus(null), "");
});

test("o status diz quantas sugestões há, no singular e no plural", () => {
  assert.equal(textoDoStatus([]), "Nenhum termo encontrado.");
  assert.equal(textoDoStatus([termos[0]]), "1 sugestão disponível.");
  assert.equal(textoDoStatus(termos.slice(0, 2)), "2 sugestões disponíveis.");
});

test("as sugestões vêm da busca do domínio", () => {
  assert.deepEqual(sugestoesPara(termos, "de").map((t) => t.id), ["deg", "dex"]);
  assert.deepEqual(sugestoesPara(termos, "xyz"), []);
});

test("as setas andam na lista sem passar das pontas; outra tecla ou lista vazia não mexe", () => {
  assert.equal(proximoIndice(-1, "ArrowDown", 3), 0);
  assert.equal(proximoIndice(2, "ArrowDown", 3), 2);
  assert.equal(proximoIndice(0, "ArrowUp", 3), 0);
  assert.equal(proximoIndice(2, "ArrowUp", 3), 1);
  assert.equal(proximoIndice(0, "Enter", 3), null);
  assert.equal(proximoIndice(-1, "ArrowDown", 0), null);
});

test("o Enter abre a sugestão marcada; sem marcação, a primeira da busca; sem nada, nenhum", () => {
  const sugestoes = sugestoesPara(termos, "de");
  assert.equal(termoDoEnvio(sugestoes, 1, termos, "de").id, "dex");
  assert.equal(termoDoEnvio(sugestoes, -1, termos, "de").id, "deg");
  assert.equal(termoDoEnvio([], -1, termos, "xyz"), null);
});

test("sem resultado, o aviso repete o que foi digitado, sem os espaços das pontas", () => {
  assert.equal(textoSemResultado("  bandejão "), "Nenhum termo encontrado para “bandejão”. ");
});

test("os atalhos contam os termos por tipo e levam à lista já filtrada", () => {
  assert.deepEqual(atalhosPorTipo(termos), [
    { tipo: "sigla", rotulo: "Siglas", quantidade: 2, href: "todas-siglas.html?tipo=sigla" },
    { tipo: "giria", rotulo: "Gírias", quantidade: 1, href: "todas-siglas.html?tipo=giria" },
  ]);
});

test("a trilha chega pronta para a tela: id do título, e por termo o id, o nome, o resumo e o endereço", () => {
  const trilha = { grupos: [{ id: "notas", nome: "Notas", termos: ["deg", "ceubinho"] }] };
  assert.deepEqual(gruposDaTrilha(trilha, termos), [{
    nome: "Notas",
    idDoTitulo: "trilha-notas",
    termos: [
      { id: "deg", nome: "DEG", resumo: "Decanato de Ensino de Graduação", href: "termo.html?id=deg" },
      { id: "ceubinho", nome: "Ceubinho", resumo: "Prédio do ICC.", href: "termo.html?id=ceubinho" },
    ],
  }]);
});

test("na trilha, id que não existe é pulado e grupo que fica vazio some (a seção continua escondida)", () => {
  const trilha = { grupos: [{ id: "a", nome: "A", termos: ["deg", "nao-existe"] }, { id: "b", nome: "B", termos: ["sumiu"] }] };
  assert.deepEqual(gruposDaTrilha(trilha, termos).map((g) => [g.idDoTitulo, g.termos.map((t) => t.nome)]), [["trilha-a", ["DEG"]]]);
  assert.deepEqual(gruposDaTrilha({}, termos), []);
});
