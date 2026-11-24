// Regras de domínio sobre a lista de termos: busca, filtros e agrupamento.
// Sem acesso a DOM, para rodar tanto no navegador quanto nos testes (Node).
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
export const CAMPI = stryMutAct_9fa48("1648") ? [] : (stryCov_9fa48("1648"), [stryMutAct_9fa48("1649") ? "" : (stryCov_9fa48("1649"), "Darcy Ribeiro"), stryMutAct_9fa48("1650") ? "" : (stryCov_9fa48("1650"), "Ceilândia"), stryMutAct_9fa48("1651") ? "" : (stryCov_9fa48("1651"), "Gama"), stryMutAct_9fa48("1652") ? "" : (stryCov_9fa48("1652"), "Planaltina")]);
export const CAMPUS_GERAL = stryMutAct_9fa48("1653") ? "" : (stryCov_9fa48("1653"), "Geral");

// Valores aceitos em `tipo` (ADR 0004) e o rótulo exibido ao usuário.
export const TIPOS = stryMutAct_9fa48("1654") ? {} : (stryCov_9fa48("1654"), {
  sigla: stryMutAct_9fa48("1655") ? "" : (stryCov_9fa48("1655"), "Sigla"),
  giria: stryMutAct_9fa48("1656") ? "" : (stryCov_9fa48("1656"), "Gíria"),
  expressao: stryMutAct_9fa48("1657") ? "" : (stryCov_9fa48("1657"), "Expressão")
});

// Valores aceitos em `categoria` (ADR 0004) e o rótulo exibido ao usuário.
export const CATEGORIAS = stryMutAct_9fa48("1658") ? {} : (stryCov_9fa48("1658"), {
  "vida-academica": stryMutAct_9fa48("1659") ? "" : (stryCov_9fa48("1659"), "Vida acadêmica"),
  "unidades-academicas": stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), "Unidades acadêmicas"),
  administracao: stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), "Administração"),
  colegiados: stryMutAct_9fa48("1662") ? "" : (stryCov_9fa48("1662"), "Colegiados"),
  "locais-campus": stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), "Locais do campus"),
  sistemas: stryMutAct_9fa48("1664") ? "" : (stryCov_9fa48("1664"), "Sistemas"),
  "assistencia-estudantil": stryMutAct_9fa48("1665") ? "" : (stryCov_9fa48("1665"), "Assistência estudantil"),
  "representacao-estudantil": stryMutAct_9fa48("1666") ? "" : (stryCov_9fa48("1666"), "Representação estudantil"),
  girias: stryMutAct_9fa48("1667") ? "" : (stryCov_9fa48("1667"), "Gírias")
});
export function normalizar(texto) {
  if (stryMutAct_9fa48("1668")) {
    {}
  } else {
    stryCov_9fa48("1668");
    return stryMutAct_9fa48("1670") ? texto.toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().trim() : stryMutAct_9fa48("1669") ? texto.toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase() : (stryCov_9fa48("1669", "1670"), texto.toString().normalize(stryMutAct_9fa48("1671") ? "" : (stryCov_9fa48("1671"), "NFD")).replace(stryMutAct_9fa48("1672") ? /[^̀-ͯ]/g : (stryCov_9fa48("1672"), /[̀-ͯ]/g), stryMutAct_9fa48("1673") ? "Stryker was here!" : (stryCov_9fa48("1673"), "")).toLowerCase().trim());
  }
}

// Termos cujo nome contém a consulta; os que começam com ela vêm primeiro.
export function buscarTermos(termos, consulta, limite = 8) {
  if (stryMutAct_9fa48("1674")) {
    {}
  } else {
    stryCov_9fa48("1674");
    const q = normalizar(consulta);
    if (stryMutAct_9fa48("1677") ? false : stryMutAct_9fa48("1676") ? true : stryMutAct_9fa48("1675") ? q : (stryCov_9fa48("1675", "1676", "1677"), !q)) return stryMutAct_9fa48("1678") ? ["Stryker was here"] : (stryCov_9fa48("1678"), []);
    const naoComecaCom = stryMutAct_9fa48("1679") ? () => undefined : (stryCov_9fa48("1679"), (() => {
      const naoComecaCom = termo => Number(stryMutAct_9fa48("1680") ? normalizar(termo.termo).startsWith(q) : (stryCov_9fa48("1680"), !(stryMutAct_9fa48("1681") ? normalizar(termo.termo).endsWith(q) : (stryCov_9fa48("1681"), normalizar(termo.termo).startsWith(q)))));
      return naoComecaCom;
    })());
    return stryMutAct_9fa48("1684") ? termos.sort((a, b) => naoComecaCom(a) - naoComecaCom(b)).slice(0, limite) : stryMutAct_9fa48("1683") ? termos.filter(termo => normalizar(termo.termo).includes(q)).slice(0, limite) : stryMutAct_9fa48("1682") ? termos.filter(termo => normalizar(termo.termo).includes(q)).sort((a, b) => naoComecaCom(a) - naoComecaCom(b)) : (stryCov_9fa48("1682", "1683", "1684"), termos.filter(stryMutAct_9fa48("1685") ? () => undefined : (stryCov_9fa48("1685"), termo => normalizar(termo.termo).includes(q))).sort(stryMutAct_9fa48("1686") ? () => undefined : (stryCov_9fa48("1686"), (a, b) => stryMutAct_9fa48("1687") ? naoComecaCom(a) + naoComecaCom(b) : (stryCov_9fa48("1687"), naoComecaCom(a) - naoComecaCom(b)))).slice(0, limite));
  }
}

// Filtro por campus inclui os termos "Geral", que valem para os 4 campi.
export function filtrarTermos(termos, {
  campus = null,
  tipo = null
} = {}) {
  if (stryMutAct_9fa48("1688")) {
    {}
  } else {
    stryCov_9fa48("1688");
    return stryMutAct_9fa48("1689") ? termos : (stryCov_9fa48("1689"), termos.filter(termo => {
      if (stryMutAct_9fa48("1690")) {
        {}
      } else {
        stryCov_9fa48("1690");
        if (stryMutAct_9fa48("1693") ? campus && termo.campus !== campus || termo.campus !== CAMPUS_GERAL : stryMutAct_9fa48("1692") ? false : stryMutAct_9fa48("1691") ? true : (stryCov_9fa48("1691", "1692", "1693"), (stryMutAct_9fa48("1695") ? campus || termo.campus !== campus : stryMutAct_9fa48("1694") ? true : (stryCov_9fa48("1694", "1695"), campus && (stryMutAct_9fa48("1697") ? termo.campus === campus : stryMutAct_9fa48("1696") ? true : (stryCov_9fa48("1696", "1697"), termo.campus !== campus)))) && (stryMutAct_9fa48("1699") ? termo.campus === CAMPUS_GERAL : stryMutAct_9fa48("1698") ? true : (stryCov_9fa48("1698", "1699"), termo.campus !== CAMPUS_GERAL)))) return stryMutAct_9fa48("1700") ? true : (stryCov_9fa48("1700"), false);
        if (stryMutAct_9fa48("1703") ? tipo || termo.tipo !== tipo : stryMutAct_9fa48("1702") ? false : stryMutAct_9fa48("1701") ? true : (stryCov_9fa48("1701", "1702", "1703"), tipo && (stryMutAct_9fa48("1705") ? termo.tipo === tipo : stryMutAct_9fa48("1704") ? true : (stryCov_9fa48("1704", "1705"), termo.tipo !== tipo)))) return stryMutAct_9fa48("1706") ? true : (stryCov_9fa48("1706"), false);
        return stryMutAct_9fa48("1707") ? false : (stryCov_9fa48("1707"), true);
      }
    }));
  }
}
export function letraInicial(termo) {
  if (stryMutAct_9fa48("1708")) {
    {}
  } else {
    stryCov_9fa48("1708");
    const letra = stryMutAct_9fa48("1710") ? normalizar(termo.termo).toUpperCase() : stryMutAct_9fa48("1709") ? normalizar(termo.termo).charAt(0).toLowerCase() : (stryCov_9fa48("1709", "1710"), normalizar(termo.termo).charAt(0).toUpperCase());
    return (stryMutAct_9fa48("1711") ? /[^A-Z]/ : (stryCov_9fa48("1711"), /[A-Z]/)).test(letra) ? letra : stryMutAct_9fa48("1712") ? "" : (stryCov_9fa48("1712"), "#");
  }
}

// Retorna [[letra, termos], ...] em ordem alfabética, com os termos de cada letra também ordenados.
export function agruparPorLetra(termos) {
  if (stryMutAct_9fa48("1713")) {
    {}
  } else {
    stryCov_9fa48("1713");
    const grupos = new Map();
    for (const termo of termos) {
      if (stryMutAct_9fa48("1714")) {
        {}
      } else {
        stryCov_9fa48("1714");
        const letra = letraInicial(termo);
        if (stryMutAct_9fa48("1717") ? false : stryMutAct_9fa48("1716") ? true : stryMutAct_9fa48("1715") ? grupos.has(letra) : (stryCov_9fa48("1715", "1716", "1717"), !grupos.has(letra))) grupos.set(letra, stryMutAct_9fa48("1719") ? ["Stryker was here"] : (stryCov_9fa48("1719"), []));
        if (stryMutAct_9fa48("1720")) {
          ;
        } else {
          stryCov_9fa48("1720");
          grupos.get(letra).push(termo);
        }
      }
    }
    return stryMutAct_9fa48("1721") ? [...grupos.entries()].map(([letra, doGrupo]) => [letra, [...doGrupo].sort((a, b) => normalizar(a.termo).localeCompare(normalizar(b.termo)))]) : (stryCov_9fa48("1721"), (stryMutAct_9fa48("1722") ? [] : (stryCov_9fa48("1722"), [...grupos.entries()])).sort(stryMutAct_9fa48("1723") ? () => undefined : (stryCov_9fa48("1723"), ([a], [b]) => a.localeCompare(b))).map(stryMutAct_9fa48("1724") ? () => undefined : (stryCov_9fa48("1724"), ([letra, doGrupo]) => stryMutAct_9fa48("1725") ? [] : (stryCov_9fa48("1725"), [letra, stryMutAct_9fa48("1726") ? [...doGrupo] : (stryCov_9fa48("1726"), (stryMutAct_9fa48("1727") ? [] : (stryCov_9fa48("1727"), [...doGrupo])).sort(stryMutAct_9fa48("1728") ? () => undefined : (stryCov_9fa48("1728"), (a, b) => normalizar(a.termo).localeCompare(normalizar(b.termo)))))]))));
  }
}
export function encontrarTermo(termos, id) {
  if (stryMutAct_9fa48("1729")) {
    {}
  } else {
    stryCov_9fa48("1729");
    return termos.find(stryMutAct_9fa48("1730") ? () => undefined : (stryCov_9fa48("1730"), termo => stryMutAct_9fa48("1733") ? termo.id !== id : stryMutAct_9fa48("1732") ? false : stryMutAct_9fa48("1731") ? true : (stryCov_9fa48("1731", "1732", "1733"), termo.id === id)));
  }
}

// Filtros vindos da URL (ex.: todas-siglas.html?tipo=sigla); valor desconhecido é ignorado.
export function filtrosDaUrl(parametros) {
  if (stryMutAct_9fa48("1734")) {
    {}
  } else {
    stryCov_9fa48("1734");
    const campus = parametros.get(stryMutAct_9fa48("1735") ? "" : (stryCov_9fa48("1735"), "campus"));
    const tipo = parametros.get(stryMutAct_9fa48("1736") ? "" : (stryCov_9fa48("1736"), "tipo"));
    return stryMutAct_9fa48("1737") ? {} : (stryCov_9fa48("1737"), {
      campus: CAMPI.includes(campus) ? campus : null,
      tipo: (stryMutAct_9fa48("1740") ? tipo || Object.hasOwn(TIPOS, tipo) : stryMutAct_9fa48("1739") ? false : stryMutAct_9fa48("1738") ? true : (stryCov_9fa48("1738", "1739", "1740"), tipo && Object.hasOwn(TIPOS, tipo))) ? tipo : null
    });
  }
}

// Quantos termos existem de cada tipo, na ordem de TIPOS; tipos sem termos ficam de fora.
export function contarPorTipo(termos) {
  if (stryMutAct_9fa48("1741")) {
    {}
  } else {
    stryCov_9fa48("1741");
    return stryMutAct_9fa48("1742") ? Object.keys(TIPOS).map(tipo => [tipo, termos.filter(termo => termo.tipo === tipo).length]) : (stryCov_9fa48("1742"), Object.keys(TIPOS).map(stryMutAct_9fa48("1743") ? () => undefined : (stryCov_9fa48("1743"), tipo => stryMutAct_9fa48("1744") ? [] : (stryCov_9fa48("1744"), [tipo, stryMutAct_9fa48("1745") ? termos.length : (stryCov_9fa48("1745"), termos.filter(stryMutAct_9fa48("1746") ? () => undefined : (stryCov_9fa48("1746"), termo => stryMutAct_9fa48("1749") ? termo.tipo !== tipo : stryMutAct_9fa48("1748") ? false : stryMutAct_9fa48("1747") ? true : (stryCov_9fa48("1747", "1748", "1749"), termo.tipo === tipo))).length)]))).filter(stryMutAct_9fa48("1750") ? () => undefined : (stryCov_9fa48("1750"), ([, total]) => stryMutAct_9fa48("1754") ? total <= 0 : stryMutAct_9fa48("1753") ? total >= 0 : stryMutAct_9fa48("1752") ? false : stryMutAct_9fa48("1751") ? true : (stryCov_9fa48("1751", "1752", "1753", "1754"), total > 0))));
  }
}

// Linha curta que resume o termo em listas: a forma por extenso da sigla, ou a definição.
export function resumoDoTermo(termo) {
  if (stryMutAct_9fa48("1755")) {
    {}
  } else {
    stryCov_9fa48("1755");
    return stryMutAct_9fa48("1758") ? termo.significado && termo.definicao : stryMutAct_9fa48("1757") ? false : stryMutAct_9fa48("1756") ? true : (stryCov_9fa48("1756", "1757", "1758"), termo.significado || termo.definicao);
  }
}