// Trilha do calouro, "Primeiros passos na UnB" (#70, ADR 0011).
// A lista fica em data/trilha-calouro.json e cita os termos pelo id; os dados de cada termo
// continuam só no termos.json. Funções puras, sem DOM, para rodarem no Node (testes) e no navegador.
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
const SUFIXO_UNB = stryMutAct_9fa48("1759") ? "" : (stryCov_9fa48("1759"), ".unb.br");

// Fonte oficial = endereço https de um site da UnB (unb.br ou *.unb.br).
export function fonteOficial(fonte) {
  if (stryMutAct_9fa48("1760")) {
    {}
  } else {
    stryCov_9fa48("1760");
    try {
      if (stryMutAct_9fa48("1761")) {
        {}
      } else {
        stryCov_9fa48("1761");
        const {
          protocol,
          hostname
        } = new URL(fonte);
        return stryMutAct_9fa48("1764") ? protocol === "https:" || hostname === "unb.br" || hostname.endsWith(SUFIXO_UNB) : stryMutAct_9fa48("1763") ? false : stryMutAct_9fa48("1762") ? true : (stryCov_9fa48("1762", "1763", "1764"), (stryMutAct_9fa48("1766") ? protocol !== "https:" : stryMutAct_9fa48("1765") ? true : (stryCov_9fa48("1765", "1766"), protocol === (stryMutAct_9fa48("1767") ? "" : (stryCov_9fa48("1767"), "https:")))) && (stryMutAct_9fa48("1769") ? hostname === "unb.br" && hostname.endsWith(SUFIXO_UNB) : stryMutAct_9fa48("1768") ? true : (stryCov_9fa48("1768", "1769"), (stryMutAct_9fa48("1771") ? hostname !== "unb.br" : stryMutAct_9fa48("1770") ? false : (stryCov_9fa48("1770", "1771"), hostname === (stryMutAct_9fa48("1772") ? "" : (stryCov_9fa48("1772"), "unb.br")))) || (stryMutAct_9fa48("1773") ? hostname.startsWith(SUFIXO_UNB) : (stryCov_9fa48("1773"), hostname.endsWith(SUFIXO_UNB))))));
      }
    } catch {
      if (stryMutAct_9fa48("1774")) {
        {}
      } else {
        stryCov_9fa48("1774");
        return stryMutAct_9fa48("1775") ? true : (stryCov_9fa48("1775"), false);
      }
    }
  }
}
const textoPreenchido = stryMutAct_9fa48("1776") ? () => undefined : (stryCov_9fa48("1776"), (() => {
  const textoPreenchido = valor => stryMutAct_9fa48("1779") ? typeof valor === "string" || valor.trim() !== "" : stryMutAct_9fa48("1778") ? false : stryMutAct_9fa48("1777") ? true : (stryCov_9fa48("1777", "1778", "1779"), (stryMutAct_9fa48("1781") ? typeof valor !== "string" : stryMutAct_9fa48("1780") ? true : (stryCov_9fa48("1780", "1781"), typeof valor === (stryMutAct_9fa48("1782") ? "" : (stryCov_9fa48("1782"), "string")))) && (stryMutAct_9fa48("1784") ? valor.trim() === "" : stryMutAct_9fa48("1783") ? true : (stryCov_9fa48("1783", "1784"), (stryMutAct_9fa48("1785") ? valor : (stryCov_9fa48("1785"), valor.trim())) !== (stryMutAct_9fa48("1786") ? "Stryker was here!" : (stryCov_9fa48("1786"), "")))));
  return textoPreenchido;
})());
export function termosDaTrilha(trilha) {
  if (stryMutAct_9fa48("1787")) {
    {}
  } else {
    stryCov_9fa48("1787");
    return (stryMutAct_9fa48("1788") ? trilha?.grupos && [] : (stryCov_9fa48("1788"), (stryMutAct_9fa48("1789") ? trilha.grupos : (stryCov_9fa48("1789"), trilha?.grupos)) ?? (stryMutAct_9fa48("1790") ? ["Stryker was here"] : (stryCov_9fa48("1790"), [])))).flatMap(stryMutAct_9fa48("1791") ? () => undefined : (stryCov_9fa48("1791"), grupo => stryMutAct_9fa48("1792") ? grupo.termos && [] : (stryCov_9fa48("1792"), grupo.termos ?? (stryMutAct_9fa48("1793") ? ["Stryker was here"] : (stryCov_9fa48("1793"), [])))));
  }
}

// Devolve a lista de erros; vazia quando a trilha está certa. Usada no teste dos dados reais.
export function validarTrilha(trilha, termos) {
  if (stryMutAct_9fa48("1794")) {
    {}
  } else {
    stryCov_9fa48("1794");
    if (stryMutAct_9fa48("1797") ? false : stryMutAct_9fa48("1796") ? true : stryMutAct_9fa48("1795") ? Array.isArray(trilha?.grupos) : (stryCov_9fa48("1795", "1796", "1797"), !Array.isArray(stryMutAct_9fa48("1798") ? trilha.grupos : (stryCov_9fa48("1798"), trilha?.grupos)))) return stryMutAct_9fa48("1799") ? [] : (stryCov_9fa48("1799"), [stryMutAct_9fa48("1800") ? "" : (stryCov_9fa48("1800"), "a trilha precisa de uma lista \"grupos\"")]);
    const erros = stryMutAct_9fa48("1801") ? ["Stryker was here"] : (stryCov_9fa48("1801"), []);
    const idsDosTermos = new Set(termos.map(stryMutAct_9fa48("1802") ? () => undefined : (stryCov_9fa48("1802"), termo => termo.id)));
    const idsDosGrupos = new Set();
    const jaCitados = new Set();
    for (const grupo of trilha.grupos) {
      if (stryMutAct_9fa48("1803")) {
        {}
      } else {
        stryCov_9fa48("1803");
        if (stryMutAct_9fa48("1805") ? false : stryMutAct_9fa48("1804") ? true : (stryCov_9fa48("1804", "1805"), idsDosGrupos.has(grupo.id))) erros.push(stryMutAct_9fa48("1807") ? `` : (stryCov_9fa48("1807"), `grupo "${grupo.id}" aparece mais de uma vez`));
        if (stryMutAct_9fa48("1808")) {
          ;
        } else {
          stryCov_9fa48("1808");
          idsDosGrupos.add(grupo.id);
        }
        if (stryMutAct_9fa48("1811") ? false : stryMutAct_9fa48("1810") ? true : stryMutAct_9fa48("1809") ? textoPreenchido(grupo.nome) : (stryCov_9fa48("1809", "1810", "1811"), !textoPreenchido(grupo.nome))) erros.push(stryMutAct_9fa48("1813") ? `` : (stryCov_9fa48("1813"), `grupo "${grupo.id}" sem nome`));
        if (stryMutAct_9fa48("1816") ? !Array.isArray(grupo.termos) && grupo.termos.length === 0 : stryMutAct_9fa48("1815") ? false : stryMutAct_9fa48("1814") ? true : (stryCov_9fa48("1814", "1815", "1816"), (stryMutAct_9fa48("1817") ? Array.isArray(grupo.termos) : (stryCov_9fa48("1817"), !Array.isArray(grupo.termos))) || (stryMutAct_9fa48("1819") ? grupo.termos.length !== 0 : stryMutAct_9fa48("1818") ? false : (stryCov_9fa48("1818", "1819"), grupo.termos.length === 0)))) {
          if (stryMutAct_9fa48("1820")) {
            {}
          } else {
            stryCov_9fa48("1820");
            erros.push(stryMutAct_9fa48("1822") ? `` : (stryCov_9fa48("1822"), `grupo "${grupo.id}" sem termos`));
            continue;
          }
        }
        for (const id of grupo.termos) {
          if (stryMutAct_9fa48("1823")) {
            {}
          } else {
            stryCov_9fa48("1823");
            if (stryMutAct_9fa48("1826") ? false : stryMutAct_9fa48("1825") ? true : stryMutAct_9fa48("1824") ? idsDosTermos.has(id) : (stryCov_9fa48("1824", "1825", "1826"), !idsDosTermos.has(id))) erros.push(stryMutAct_9fa48("1828") ? `` : (stryCov_9fa48("1828"), `grupo "${grupo.id}": o termo "${id}" não existe no termos.json`));
            if (stryMutAct_9fa48("1830") ? false : stryMutAct_9fa48("1829") ? true : (stryCov_9fa48("1829", "1830"), jaCitados.has(id))) erros.push(stryMutAct_9fa48("1832") ? `` : (stryCov_9fa48("1832"), `o termo "${id}" aparece mais de uma vez na trilha`));
            if (stryMutAct_9fa48("1833")) {
              ;
            } else {
              stryCov_9fa48("1833");
              jaCitados.add(id);
            }
          }
        }
      }
    }
    return erros;
  }
}

// Troca cada id pelo termo completo, na ordem do arquivo. Na página, um id que não existe
// (ou um termo recusado pelo schema) é pulado em vez de quebrar a seção inteira.
export function montarTrilha(trilha, termos) {
  if (stryMutAct_9fa48("1834")) {
    {}
  } else {
    stryCov_9fa48("1834");
    const porId = new Map(termos.map(stryMutAct_9fa48("1835") ? () => undefined : (stryCov_9fa48("1835"), termo => stryMutAct_9fa48("1836") ? [] : (stryCov_9fa48("1836"), [termo.id, termo]))));
    return stryMutAct_9fa48("1837") ? (trilha?.grupos ?? []).map(grupo => ({
      id: grupo.id,
      nome: grupo.nome,
      termos: (grupo.termos ?? []).map(id => porId.get(id)).filter(Boolean)
    })) : (stryCov_9fa48("1837"), (stryMutAct_9fa48("1838") ? trilha?.grupos && [] : (stryCov_9fa48("1838"), (stryMutAct_9fa48("1839") ? trilha.grupos : (stryCov_9fa48("1839"), trilha?.grupos)) ?? (stryMutAct_9fa48("1840") ? ["Stryker was here"] : (stryCov_9fa48("1840"), [])))).map(stryMutAct_9fa48("1841") ? () => undefined : (stryCov_9fa48("1841"), grupo => stryMutAct_9fa48("1842") ? {} : (stryCov_9fa48("1842"), {
      id: grupo.id,
      nome: grupo.nome,
      termos: stryMutAct_9fa48("1843") ? (grupo.termos ?? []).map(id => porId.get(id)) : (stryCov_9fa48("1843"), (stryMutAct_9fa48("1844") ? grupo.termos && [] : (stryCov_9fa48("1844"), grupo.termos ?? (stryMutAct_9fa48("1845") ? ["Stryker was here"] : (stryCov_9fa48("1845"), [])))).map(stryMutAct_9fa48("1846") ? () => undefined : (stryCov_9fa48("1846"), id => porId.get(id))).filter(Boolean))
    }))).filter(stryMutAct_9fa48("1847") ? () => undefined : (stryCov_9fa48("1847"), grupo => stryMutAct_9fa48("1851") ? grupo.termos.length <= 0 : stryMutAct_9fa48("1850") ? grupo.termos.length >= 0 : stryMutAct_9fa48("1849") ? false : stryMutAct_9fa48("1848") ? true : (stryCov_9fa48("1848", "1849", "1850", "1851"), grupo.termos.length > 0))));
  }
}