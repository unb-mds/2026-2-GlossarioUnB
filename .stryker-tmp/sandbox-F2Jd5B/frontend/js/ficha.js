// Regras da página do termo (termo.html): o título da aba, o rótulo do campus, a fonte e o endereço do termo.
// Sem DOM, para serem testadas no Node (tests/ficha.test.js); o app.js só monta os elementos.
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
import { CAMPUS_GERAL } from "./termos.js";
import { urlSegura } from "./validacao-termo.js";

// Endereço da página de um termo; as sugestões da busca, os cartões e a trilha também levam para ele.
export function urlDoTermo(termo) {
  if (stryMutAct_9fa48("1549")) {
    {}
  } else {
    stryCov_9fa48("1549");
    return stryMutAct_9fa48("1550") ? `` : (stryCov_9fa48("1550"), `termo.html?id=${encodeURIComponent(termo.id)}`);
  }
}
export const tituloDaFicha = stryMutAct_9fa48("1551") ? () => undefined : (stryCov_9fa48("1551"), (() => {
  const tituloDaFicha = termo => stryMutAct_9fa48("1552") ? `` : (stryCov_9fa48("1552"), `${termo.termo} — Glossário UnB`);
  return tituloDaFicha;
})());
export function rotuloCampus(campus) {
  if (stryMutAct_9fa48("1553")) {
    {}
  } else {
    stryCov_9fa48("1553");
    return (stryMutAct_9fa48("1556") ? campus !== CAMPUS_GERAL : stryMutAct_9fa48("1555") ? false : stryMutAct_9fa48("1554") ? true : (stryCov_9fa48("1554", "1555", "1556"), campus === CAMPUS_GERAL)) ? stryMutAct_9fa48("1557") ? "" : (stryCov_9fa48("1557"), "Todos os campi") : stryMutAct_9fa48("1558") ? `` : (stryCov_9fa48("1558"), `Campus ${campus}`);
  }
}

// Fonte pode ser um link ou um texto ("conhecimento comum verificado pelo grupo").
// Links aparecem sem "https://" e sem a barra final, que só atrapalham a leitura.
// Só vira link o que passa pela urlSegura (http ou https): "javascript:" fica como texto.
export function textoDaFonte(fonte) {
  if (stryMutAct_9fa48("1559")) {
    {}
  } else {
    stryCov_9fa48("1559");
    const url = urlSegura(fonte);
    if (stryMutAct_9fa48("1562") ? false : stryMutAct_9fa48("1561") ? true : stryMutAct_9fa48("1560") ? url : (stryCov_9fa48("1560", "1561", "1562"), !url)) return stryMutAct_9fa48("1563") ? {} : (stryCov_9fa48("1563"), {
      texto: fonte
    });
    const {
      hostname,
      pathname
    } = new URL(url);
    return stryMutAct_9fa48("1564") ? {} : (stryCov_9fa48("1564"), {
      texto: stryMutAct_9fa48("1565") ? `` : (stryCov_9fa48("1565"), `${hostname}${(stryMutAct_9fa48("1568") ? pathname !== "/" : stryMutAct_9fa48("1567") ? false : stryMutAct_9fa48("1566") ? true : (stryCov_9fa48("1566", "1567", "1568"), pathname === (stryMutAct_9fa48("1569") ? "" : (stryCov_9fa48("1569"), "/")))) ? stryMutAct_9fa48("1570") ? "Stryker was here!" : (stryCov_9fa48("1570"), "") : pathname}`),
      href: url
    });
  }
}