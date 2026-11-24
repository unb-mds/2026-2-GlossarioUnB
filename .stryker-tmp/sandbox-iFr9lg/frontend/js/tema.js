// Regras do tema claro e escuro. O tema salvo é aplicado por um script curto no <head> de cada página (evita
// piscar); o app.js só trata o botão. Sem DOM, para serem testadas no Node (tests/tema.test.js).

// Com prefixo: unb-mds.github.io é uma origem compartilhada por todos os projetos da organização.
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
export const CHAVE_TEMA = stryMutAct_9fa48("1626") ? "" : (stryCov_9fa48("1626"), "glossario-unb:tema");

// O tema escolhido vale mais que o do sistema; sem escolha, vale o do sistema.
export function escuroAtivo(temaEscolhido, sistemaPrefereEscuro) {
  if (stryMutAct_9fa48("1627")) {
    {}
  } else {
    stryCov_9fa48("1627");
    return stryMutAct_9fa48("1630") ? temaEscolhido === "escuro" && !temaEscolhido && sistemaPrefereEscuro : stryMutAct_9fa48("1629") ? false : stryMutAct_9fa48("1628") ? true : (stryCov_9fa48("1628", "1629", "1630"), (stryMutAct_9fa48("1632") ? temaEscolhido !== "escuro" : stryMutAct_9fa48("1631") ? false : (stryCov_9fa48("1631", "1632"), temaEscolhido === (stryMutAct_9fa48("1633") ? "" : (stryCov_9fa48("1633"), "escuro")))) || (stryMutAct_9fa48("1635") ? !temaEscolhido || sistemaPrefereEscuro : stryMutAct_9fa48("1634") ? false : (stryCov_9fa48("1634", "1635"), (stryMutAct_9fa48("1636") ? temaEscolhido : (stryCov_9fa48("1636"), !temaEscolhido)) && sistemaPrefereEscuro)));
  }
}
export const proximoTema = stryMutAct_9fa48("1637") ? () => undefined : (stryCov_9fa48("1637"), (() => {
  const proximoTema = escuro => escuro ? stryMutAct_9fa48("1638") ? "" : (stryCov_9fa48("1638"), "claro") : stryMutAct_9fa48("1639") ? "" : (stryCov_9fa48("1639"), "escuro");
  return proximoTema;
})());

// Sem localStorage (modo privado, bloqueio do navegador), o tema funciona na página e só não fica salvo.
// O armazenamento vem por uma função porque até ler window.localStorage pode falhar.
export function salvarTema(obterArmazenamento, tema, avisar = console.warn) {
  if (stryMutAct_9fa48("1640")) {
    {}
  } else {
    stryCov_9fa48("1640");
    try {
      if (stryMutAct_9fa48("1641")) {
        {}
      } else {
        stryCov_9fa48("1641");
        if (stryMutAct_9fa48("1642")) {
          ;
        } else {
          stryCov_9fa48("1642");
          obterArmazenamento().setItem(CHAVE_TEMA, tema);
        }
        return stryMutAct_9fa48("1643") ? false : (stryCov_9fa48("1643"), true);
      }
    } catch (erro) {
      if (stryMutAct_9fa48("1644")) {
        {}
      } else {
        stryCov_9fa48("1644");
        avisar(stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), "Não foi possível salvar a preferência de tema:"), erro);
        return stryMutAct_9fa48("1647") ? true : (stryCov_9fa48("1647"), false);
      }
    }
  }
}