// Regras da página "Todas as siglas" (frontend/js/lista.js): filtros, grupos por letra, índice e cartões, sem o DOM.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  OPCAO_COM_LOCALIZACAO, enderecoDosFiltros, etiquetasDoCartao, filtroLocalizacaoDaUrl, idDaLetra, idsComPlanta, montarLista, opcoesDeCampus, opcoesDeCategoria, opcoesDeLocalizacao, opcoesDeTipo, rotuloDaLetra, temLocalizacao, textoDaContagem,
} from "../frontend/js/lista.js";

const termos = [
  { id: "deg", termo: "DEG", tipo: "sigla", campus: "Geral" },
  { id: "fcte", termo: "FCTE", tipo: "sigla", campus: "Gama" },
  { id: "ceubinho", termo: "Ceubinho", tipo: "giria", campus: "Darcy Ribeiro" },
  { id: "10-de-maio", termo: "10 de maio", tipo: "expressao", campus: "Geral" },
];
const ids = (lista) => lista.grupos.flatMap((g) => g.termos.map((t) => t.id));

test("a lista agrupa por letra, com o id e o rótulo de cada letra no índice", () => {
  const lista = montarLista(termos, { tipo: "", campus: "" });
  assert.equal(lista.total, 4);
  assert.deepEqual(lista.grupos.map((g) => [g.letra, g.id, g.rotulo, g.termos.map((t) => t.id)]), [
    ["#", "letra-outros", "Outros símbolos", ["10-de-maio"]],
    ["C", "letra-C", "Letra C", ["ceubinho"]],
    ["D", "letra-D", "Letra D", ["deg"]],
    ["F", "letra-F", "Letra F", ["fcte"]],
  ]);
});

test("os filtros de tipo e de campus chegam ao domínio (campus inclui os termos Geral)", () => {
  assert.deepEqual(ids(montarLista(termos, { tipo: "giria" })), ["ceubinho"]);
  assert.deepEqual(ids(montarLista(termos, { campus: "Gama" })), ["10-de-maio", "deg", "fcte"]);
  assert.deepEqual(ids(montarLista(termos, { tipo: "sigla", campus: "Gama" })), ["deg", "fcte"]);
  assert.equal(montarLista(termos, { tipo: "sigla", campus: "Planaltina" }).total, 1);
});

test("filtro sem nenhum termo devolve a lista vazia", () => {
  assert.deepEqual(montarLista([termos[0]], { tipo: "giria" }), { total: 0, grupos: [] });
});

test("símbolos e números ficam na letra #, com rótulo próprio", () => {
  assert.equal(idDaLetra("#"), "letra-outros");
  assert.equal(rotuloDaLetra("#"), "Outros símbolos");
  assert.equal(idDaLetra("A"), "letra-A");
  assert.equal(rotuloDaLetra("A"), "Letra A");
});

test("a contagem fala no singular e no plural", () => {
  assert.equal(textoDaContagem(1), "1 termo");
  assert.equal(textoDaContagem(0), "0 termos");
  assert.equal(textoDaContagem(41), "41 termos");
});

test("o endereço guarda os filtros escolhidos, para o link poder ser compartilhado", () => {
  assert.equal(enderecoDosFiltros({ tipo: "sigla", campus: "Gama" }, "/frontend/todas-siglas.html"), "?tipo=sigla&campus=Gama");
  assert.equal(enderecoDosFiltros({ tipo: "", campus: "Darcy Ribeiro" }, "/frontend/todas-siglas.html"), "?campus=Darcy+Ribeiro");
  assert.equal(enderecoDosFiltros({ tipo: "", campus: "" }, "/frontend/todas-siglas.html"), "/frontend/todas-siglas.html");
});

test("a categoria vai para o endereço e combina com os outros filtros", () => {
  assert.equal(enderecoDosFiltros({ tipo: "", campus: "", categoria: "sistemas" }, "/x.html"), "?categoria=sistemas");
  assert.equal(enderecoDosFiltros({ tipo: "sigla", campus: "Gama", categoria: "sistemas" }, "/x.html"), "?tipo=sigla&campus=Gama&categoria=sistemas");
});

test("o filtro de categoria chega ao domínio", () => {
  const comCategoria = [
    { id: "sigaa", termo: "SIGAA", tipo: "sigla", campus: "Geral", categoria: "sistemas" },
    { id: "deg", termo: "DEG", tipo: "sigla", campus: "Geral", categoria: "administracao" },
  ];
  assert.deepEqual(ids(montarLista(comCategoria, { tipo: "", campus: "", categoria: "sistemas" })), ["sigaa"]);
  assert.equal(montarLista(comCategoria, { tipo: "", campus: "", categoria: "" }).total, 2);
});

test("as opções de categoria seguem a taxonomia e omitem a categoria sem nenhum termo", () => {
  const comCategoria = [
    { id: "sigaa", termo: "SIGAA", categoria: "sistemas" },
    { id: "deg", termo: "DEG", categoria: "administracao" },
    { id: "dex", termo: "DEX", categoria: "administracao" },
  ];
  assert.deepEqual(opcoesDeCategoria(comCategoria), [["administracao", "Administração"], ["sistemas", "Sistemas"]]);
  assert.deepEqual(opcoesDeCategoria([]), []);
});

test("o cartão mostra o tipo e o campus, menos quando o campus é Geral", () => {
  assert.deepEqual(etiquetasDoCartao(termos[0]), [{ texto: "Sigla", contorno: false }]);
  assert.deepEqual(etiquetasDoCartao(termos[1]), [{ texto: "Sigla", contorno: false }, { texto: "Gama", contorno: true }]);
});

test("as opções dos filtros vêm dos tipos e dos campi do schema", () => {
  assert.deepEqual(opcoesDeTipo(), [["sigla", "Sigla"], ["giria", "Gíria"], ["expressao", "Expressão"]]);
  assert.deepEqual(opcoesDeCampus(), [["Darcy Ribeiro", "Darcy Ribeiro"], ["Ceilândia", "Ceilândia"], ["Gama", "Gama"], ["Planaltina", "Planaltina"]]);
  assert.deepEqual(opcoesDeLocalizacao(), [[OPCAO_COM_LOCALIZACAO, "Só com mapa ou planta"]]);
});

test("idsComPlanta reúne termos ligados ao campus, prédios e salas da planta 2D", () => {
  const planta = {
    campus: { termo: "fcte" },
    predios: [
      {
        termo: "uac",
        andares: [{ itens: [{ id: "lds", termos: ["lds"] }, { id: "S10" }] }],
      },
    ],
  };
  assert.deepEqual([...idsComPlanta(planta)].sort(), ["fcte", "lds", "uac"]);
  assert.equal(idsComPlanta(null).size, 0);
});

test("filtro de localização une termos com mapa OSM e termos ligados à planta da FCTE", () => {
  const comLoc = [
    { id: "bce", termo: "BCE", tipo: "sigla", campus: "Darcy Ribeiro", localizacao: { lat: -15.76, lng: -47.86 } },
    { id: "lds", termo: "LDS", tipo: "sigla", campus: "Gama" },
    { id: "deg", termo: "DEG", tipo: "sigla", campus: "Geral" },
  ];
  const naPlanta = new Set(["lds"]);
  assert.equal(temLocalizacao(comLoc[0], naPlanta), true);
  assert.equal(temLocalizacao(comLoc[1], naPlanta), true);
  assert.equal(temLocalizacao(comLoc[2], naPlanta), false);
  assert.deepEqual(ids(montarLista(comLoc, { tipo: "", campus: "", categoria: "", localizacao: "1" }, naPlanta)), ["bce", "lds"]);
  assert.deepEqual(ids(montarLista(comLoc, { tipo: "", campus: "Gama", categoria: "", localizacao: "1" }, naPlanta)), ["lds"]);
});

test("parâmetro localizacao vai e volta da URL ignorando valores desconhecidos", () => {
  assert.equal(filtroLocalizacaoDaUrl(new URLSearchParams("localizacao=1")), "1");
  assert.equal(filtroLocalizacaoDaUrl(new URLSearchParams("localizacao=sim")), "");
  assert.equal(filtroLocalizacaoDaUrl(new URLSearchParams("")), "");
  assert.equal(enderecoDosFiltros({ tipo: "", campus: "", categoria: "", localizacao: "1" }, "/x.html"), "?localizacao=1");
  assert.equal(enderecoDosFiltros({ tipo: "sigla", campus: "Gama", categoria: "", localizacao: "1" }, "/x.html"), "?tipo=sigla&campus=Gama&localizacao=1");
});
