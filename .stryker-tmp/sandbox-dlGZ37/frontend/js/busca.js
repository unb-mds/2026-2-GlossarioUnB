// Regras da página inicial (index.html): a busca com autocomplete (padrão ARIA combobox), os atalhos por tipo e
// a trilha do calouro. Sem DOM, para serem testadas no Node (tests/busca.test.js); o app.js só monta os
// elementos e ouve as teclas.
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { buscarTermos, contarPorTipo, normalizar, resumoDoTermo } from "./termos.js";
import { montarTrilha } from "./trilha.js";
import { urlDoTermo } from "./ficha.js";
const TIPOS_NO_PLURAL = stryMutAct_9fa48("1492") ? {} : (stryCov_9fa48("1492"), {
  sigla: stryMutAct_9fa48("1493") ? "" : (stryCov_9fa48("1493"), "Siglas"),
  giria: stryMutAct_9fa48("1494") ? "" : (stryCov_9fa48("1494"), "Gírias"),
  expressao: stryMutAct_9fa48("1495") ? "" : (stryCov_9fa48("1495"), "Expressões")
});

// As sugestões para o que foi digitado, ou null quando a consulta está vazia (não há o que mostrar).
export function sugestoesPara(termos, consulta) {
  if (stryMutAct_9fa48("1496")) {
    {}
  } else {
    stryCov_9fa48("1496");
    return normalizar(consulta) ? buscarTermos(termos, consulta) : null;
  }
}

// O texto que o leitor de tela anuncia (região aria-live).
export function textoDoStatus(sugestoes) {
  if (stryMutAct_9fa48("1497")) {
    {}
  } else {
    stryCov_9fa48("1497");
    if (stryMutAct_9fa48("1500") ? sugestoes !== null : stryMutAct_9fa48("1499") ? false : stryMutAct_9fa48("1498") ? true : (stryCov_9fa48("1498", "1499", "1500"), sugestoes === null)) return stryMutAct_9fa48("1501") ? "Stryker was here!" : (stryCov_9fa48("1501"), "");
    if (stryMutAct_9fa48("1504") ? sugestoes.length !== 0 : stryMutAct_9fa48("1503") ? false : stryMutAct_9fa48("1502") ? true : (stryCov_9fa48("1502", "1503", "1504"), sugestoes.length === 0)) return stryMutAct_9fa48("1505") ? "" : (stryCov_9fa48("1505"), "Nenhum termo encontrado.");
    return (stryMutAct_9fa48("1508") ? sugestoes.length !== 1 : stryMutAct_9fa48("1507") ? false : stryMutAct_9fa48("1506") ? true : (stryCov_9fa48("1506", "1507", "1508"), sugestoes.length === 1)) ? stryMutAct_9fa48("1509") ? "" : (stryCov_9fa48("1509"), "1 sugestão disponível.") : stryMutAct_9fa48("1510") ? `` : (stryCov_9fa48("1510"), `${sugestoes.length} sugestões disponíveis.`);
  }
}

// O aviso fica fora da lista de sugestões, para o link "Sugerir este termo" ser alcançável pelo teclado.
export const textoSemResultado = stryMutAct_9fa48("1511") ? () => undefined : (stryCov_9fa48("1511"), (() => {
  const textoSemResultado = consulta => stryMutAct_9fa48("1512") ? `` : (stryCov_9fa48("1512"), `Nenhum termo encontrado para “${stryMutAct_9fa48("1513") ? consulta : (stryCov_9fa48("1513"), consulta.trim())}”. `);
  return textoSemResultado;
})());

// A sugestão que as setas marcam, sem passar das pontas; null quando a tecla não mexe na lista.
export function proximoIndice(atual, tecla, total) {
  if (stryMutAct_9fa48("1514")) {
    {}
  } else {
    stryCov_9fa48("1514");
    if (stryMutAct_9fa48("1517") ? total !== 0 : stryMutAct_9fa48("1516") ? false : stryMutAct_9fa48("1515") ? true : (stryCov_9fa48("1515", "1516", "1517"), total === 0)) return null;
    if (stryMutAct_9fa48("1520") ? tecla !== "ArrowDown" : stryMutAct_9fa48("1519") ? false : stryMutAct_9fa48("1518") ? true : (stryCov_9fa48("1518", "1519", "1520"), tecla === (stryMutAct_9fa48("1521") ? "" : (stryCov_9fa48("1521"), "ArrowDown")))) return stryMutAct_9fa48("1522") ? Math.max(atual + 1, total - 1) : (stryCov_9fa48("1522"), Math.min(stryMutAct_9fa48("1523") ? atual - 1 : (stryCov_9fa48("1523"), atual + 1), stryMutAct_9fa48("1524") ? total + 1 : (stryCov_9fa48("1524"), total - 1)));
    if (stryMutAct_9fa48("1527") ? tecla !== "ArrowUp" : stryMutAct_9fa48("1526") ? false : stryMutAct_9fa48("1525") ? true : (stryCov_9fa48("1525", "1526", "1527"), tecla === (stryMutAct_9fa48("1528") ? "" : (stryCov_9fa48("1528"), "ArrowUp")))) return stryMutAct_9fa48("1529") ? Math.min(atual - 1, 0) : (stryCov_9fa48("1529"), Math.max(stryMutAct_9fa48("1530") ? atual + 1 : (stryCov_9fa48("1530"), atual - 1), 0));
    return null;
  }
}

// O Enter abre a sugestão marcada; sem marcação, a primeira da busca; sem nenhuma, nada.
export function termoDoEnvio(sugestoes, indiceAtivo, termos, consulta) {
  if (stryMutAct_9fa48("1531")) {
    {}
  } else {
    stryCov_9fa48("1531");
    if (stryMutAct_9fa48("1534") ? indiceAtivo >= 0 || sugestoes[indiceAtivo] : stryMutAct_9fa48("1533") ? false : stryMutAct_9fa48("1532") ? true : (stryCov_9fa48("1532", "1533", "1534"), (stryMutAct_9fa48("1537") ? indiceAtivo < 0 : stryMutAct_9fa48("1536") ? indiceAtivo > 0 : stryMutAct_9fa48("1535") ? true : (stryCov_9fa48("1535", "1536", "1537"), indiceAtivo >= 0)) && sugestoes[indiceAtivo])) return sugestoes[indiceAtivo];
    return stryMutAct_9fa48("1538") ? buscarTermos(termos, consulta)[0] && null : (stryCov_9fa48("1538"), buscarTermos(termos, consulta)[0] ?? null);
  }
}
export function atalhosPorTipo(termos) {
  if (stryMutAct_9fa48("1539")) {
    {}
  } else {
    stryCov_9fa48("1539");
    return contarPorTipo(termos).map(stryMutAct_9fa48("1540") ? () => undefined : (stryCov_9fa48("1540"), ([tipo, quantidade]) => stryMutAct_9fa48("1541") ? {} : (stryCov_9fa48("1541"), {
      tipo,
      rotulo: TIPOS_NO_PLURAL[tipo],
      quantidade,
      href: stryMutAct_9fa48("1542") ? `` : (stryCov_9fa48("1542"), `todas-siglas.html?tipo=${tipo}`)
    })));
  }
}

// Trilha do calouro (#70, ADR 0011): os grupos do trilha.js prontos para a tela, com o id do título de cada
// grupo (a lista de termos aponta para ele no aria-labelledby) e, por termo, o nome, o resumo e o endereço.
export function gruposDaTrilha(trilha, termos) {
  if (stryMutAct_9fa48("1543")) {
    {}
  } else {
    stryCov_9fa48("1543");
    return montarTrilha(trilha, termos).map(stryMutAct_9fa48("1544") ? () => undefined : (stryCov_9fa48("1544"), grupo => stryMutAct_9fa48("1545") ? {} : (stryCov_9fa48("1545"), {
      nome: grupo.nome,
      idDoTitulo: stryMutAct_9fa48("1546") ? `` : (stryCov_9fa48("1546"), `trilha-${grupo.id}`),
      termos: grupo.termos.map(stryMutAct_9fa48("1547") ? () => undefined : (stryCov_9fa48("1547"), termo => stryMutAct_9fa48("1548") ? {} : (stryCov_9fa48("1548"), {
        nome: termo.termo,
        resumo: resumoDoTermo(termo),
        href: urlDoTermo(termo)
      })))
    })));
  }
}