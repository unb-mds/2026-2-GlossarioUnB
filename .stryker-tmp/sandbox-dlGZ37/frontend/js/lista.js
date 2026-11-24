// Regras da página "Todas as siglas" (todas-siglas.html): filtros por tipo (RF02) e campus, grupos por letra,
// índice e cartões. Sem DOM, para serem testadas no Node (tests/lista.test.js); o app.js só monta os elementos.
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
import { CAMPI, CAMPUS_GERAL, TIPOS, agruparPorLetra, filtrarTermos } from "./termos.js";
export const opcoesDeTipo = stryMutAct_9fa48("1571") ? () => undefined : (stryCov_9fa48("1571"), (() => {
  const opcoesDeTipo = () => Object.entries(TIPOS);
  return opcoesDeTipo;
})());
export const opcoesDeCampus = stryMutAct_9fa48("1572") ? () => undefined : (stryCov_9fa48("1572"), (() => {
  const opcoesDeCampus = () => CAMPI.map(stryMutAct_9fa48("1573") ? () => undefined : (stryCov_9fa48("1573"), campus => stryMutAct_9fa48("1574") ? [] : (stryCov_9fa48("1574"), [campus, campus])));
  return opcoesDeCampus;
})());
export const idDaLetra = stryMutAct_9fa48("1575") ? () => undefined : (stryCov_9fa48("1575"), (() => {
  const idDaLetra = letra => (stryMutAct_9fa48("1578") ? letra !== "#" : stryMutAct_9fa48("1577") ? false : stryMutAct_9fa48("1576") ? true : (stryCov_9fa48("1576", "1577", "1578"), letra === (stryMutAct_9fa48("1579") ? "" : (stryCov_9fa48("1579"), "#")))) ? stryMutAct_9fa48("1580") ? "" : (stryCov_9fa48("1580"), "letra-outros") : stryMutAct_9fa48("1581") ? `` : (stryCov_9fa48("1581"), `letra-${letra}`);
  return idDaLetra;
})());
export const rotuloDaLetra = stryMutAct_9fa48("1582") ? () => undefined : (stryCov_9fa48("1582"), (() => {
  const rotuloDaLetra = letra => (stryMutAct_9fa48("1585") ? letra !== "#" : stryMutAct_9fa48("1584") ? false : stryMutAct_9fa48("1583") ? true : (stryCov_9fa48("1583", "1584", "1585"), letra === (stryMutAct_9fa48("1586") ? "" : (stryCov_9fa48("1586"), "#")))) ? stryMutAct_9fa48("1587") ? "" : (stryCov_9fa48("1587"), "Outros símbolos") : stryMutAct_9fa48("1588") ? `` : (stryCov_9fa48("1588"), `Letra ${letra}`);
  return rotuloDaLetra;
})());
export const textoDaContagem = stryMutAct_9fa48("1589") ? () => undefined : (stryCov_9fa48("1589"), (() => {
  const textoDaContagem = total => (stryMutAct_9fa48("1592") ? total !== 1 : stryMutAct_9fa48("1591") ? false : stryMutAct_9fa48("1590") ? true : (stryCov_9fa48("1590", "1591", "1592"), total === 1)) ? stryMutAct_9fa48("1593") ? "" : (stryCov_9fa48("1593"), "1 termo") : stryMutAct_9fa48("1594") ? `` : (stryCov_9fa48("1594"), `${total} termos`);
  return textoDaContagem;
})());

// Os filtros voltam para o endereço, para o link poder ser compartilhado; sem filtro, só o caminho da página.
export function enderecoDosFiltros({
  tipo,
  campus
}, caminho) {
  if (stryMutAct_9fa48("1595")) {
    {}
  } else {
    stryCov_9fa48("1595");
    const parametros = new URLSearchParams();
    if (stryMutAct_9fa48("1597") ? false : stryMutAct_9fa48("1596") ? true : (stryCov_9fa48("1596", "1597"), tipo)) parametros.set(stryMutAct_9fa48("1599") ? "" : (stryCov_9fa48("1599"), "tipo"), tipo);
    if (stryMutAct_9fa48("1601") ? false : stryMutAct_9fa48("1600") ? true : (stryCov_9fa48("1600", "1601"), campus)) parametros.set(stryMutAct_9fa48("1603") ? "" : (stryCov_9fa48("1603"), "campus"), campus);
    const busca = parametros.toString();
    return busca ? stryMutAct_9fa48("1604") ? `` : (stryCov_9fa48("1604"), `?${busca}`) : caminho;
  }
}

// Os termos que passam nos filtros (seletor vazio = sem filtro), agrupados por letra, com o id e o rótulo do índice.
export function montarLista(termos, {
  tipo,
  campus
}) {
  if (stryMutAct_9fa48("1605")) {
    {}
  } else {
    stryCov_9fa48("1605");
    const filtrados = filtrarTermos(termos, stryMutAct_9fa48("1606") ? {} : (stryCov_9fa48("1606"), {
      campus: stryMutAct_9fa48("1609") ? campus && null : stryMutAct_9fa48("1608") ? false : stryMutAct_9fa48("1607") ? true : (stryCov_9fa48("1607", "1608", "1609"), campus || null),
      tipo: stryMutAct_9fa48("1612") ? tipo && null : stryMutAct_9fa48("1611") ? false : stryMutAct_9fa48("1610") ? true : (stryCov_9fa48("1610", "1611", "1612"), tipo || null)
    }));
    return stryMutAct_9fa48("1613") ? {} : (stryCov_9fa48("1613"), {
      total: filtrados.length,
      grupos: agruparPorLetra(filtrados).map(stryMutAct_9fa48("1614") ? () => undefined : (stryCov_9fa48("1614"), ([letra, doGrupo]) => stryMutAct_9fa48("1615") ? {} : (stryCov_9fa48("1615"), {
        letra,
        id: idDaLetra(letra),
        rotulo: rotuloDaLetra(letra),
        termos: doGrupo
      })))
    });
  }
}

// "Geral" vale para todos: repetir a etiqueta em todo cartão só gera ruído.
export function etiquetasDoCartao(termo) {
  if (stryMutAct_9fa48("1616")) {
    {}
  } else {
    stryCov_9fa48("1616");
    const etiquetas = stryMutAct_9fa48("1617") ? [] : (stryCov_9fa48("1617"), [stryMutAct_9fa48("1618") ? {} : (stryCov_9fa48("1618"), {
      texto: TIPOS[termo.tipo],
      contorno: stryMutAct_9fa48("1619") ? true : (stryCov_9fa48("1619"), false)
    })]);
    if (stryMutAct_9fa48("1622") ? termo.campus === CAMPUS_GERAL : stryMutAct_9fa48("1621") ? false : stryMutAct_9fa48("1620") ? true : (stryCov_9fa48("1620", "1621", "1622"), termo.campus !== CAMPUS_GERAL)) etiquetas.push(stryMutAct_9fa48("1624") ? {} : (stryCov_9fa48("1624"), {
      texto: termo.campus,
      contorno: stryMutAct_9fa48("1625") ? false : (stryCov_9fa48("1625"), true)
    }));
    return etiquetas;
  }
}