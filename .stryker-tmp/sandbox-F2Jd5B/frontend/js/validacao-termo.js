// Validação do schema do termo (ADR 0004). Única fonte dessa regra:
// usada pelo app (descarta termo inválido) e pelos testes/CI (bloqueia PR inválido).
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
import { CAMPI, CAMPUS_GERAL, CATEGORIAS, TIPOS } from "./termos.js";
const PADRAO_ID = stryMutAct_9fa48("1858") ? /^[a-z0-9]+(-[^a-z0-9]+)*$/ : stryMutAct_9fa48("1857") ? /^[a-z0-9]+(-[a-z0-9])*$/ : stryMutAct_9fa48("1856") ? /^[a-z0-9]+(-[a-z0-9]+)$/ : stryMutAct_9fa48("1855") ? /^[^a-z0-9]+(-[a-z0-9]+)*$/ : stryMutAct_9fa48("1854") ? /^[a-z0-9](-[a-z0-9]+)*$/ : stryMutAct_9fa48("1853") ? /^[a-z0-9]+(-[a-z0-9]+)*/ : stryMutAct_9fa48("1852") ? /[a-z0-9]+(-[a-z0-9]+)*$/ : (stryCov_9fa48("1852", "1853", "1854", "1855", "1856", "1857", "1858"), /^[a-z0-9]+(-[a-z0-9]+)*$/);
const CAMPOS_TEXTO_OBRIGATORIOS = stryMutAct_9fa48("1859") ? [] : (stryCov_9fa48("1859"), [stryMutAct_9fa48("1860") ? "" : (stryCov_9fa48("1860"), "id"), stryMutAct_9fa48("1861") ? "" : (stryCov_9fa48("1861"), "termo"), stryMutAct_9fa48("1862") ? "" : (stryCov_9fa48("1862"), "tipo"), stryMutAct_9fa48("1863") ? "" : (stryCov_9fa48("1863"), "categoria"), stryMutAct_9fa48("1864") ? "" : (stryCov_9fa48("1864"), "definicao"), stryMutAct_9fa48("1865") ? "" : (stryCov_9fa48("1865"), "exemplo_uso"), stryMutAct_9fa48("1866") ? "" : (stryCov_9fa48("1866"), "fonte"), stryMutAct_9fa48("1867") ? "" : (stryCov_9fa48("1867"), "campus")]);
function textoPreenchido(valor) {
  if (stryMutAct_9fa48("1868")) {
    {}
  } else {
    stryCov_9fa48("1868");
    return stryMutAct_9fa48("1871") ? typeof valor === "string" || valor.trim() !== "" : stryMutAct_9fa48("1870") ? false : stryMutAct_9fa48("1869") ? true : (stryCov_9fa48("1869", "1870", "1871"), (stryMutAct_9fa48("1873") ? typeof valor !== "string" : stryMutAct_9fa48("1872") ? true : (stryCov_9fa48("1872", "1873"), typeof valor === (stryMutAct_9fa48("1874") ? "" : (stryCov_9fa48("1874"), "string")))) && (stryMutAct_9fa48("1876") ? valor.trim() === "" : stryMutAct_9fa48("1875") ? true : (stryCov_9fa48("1875", "1876"), (stryMutAct_9fa48("1877") ? valor : (stryCov_9fa48("1877"), valor.trim())) !== (stryMutAct_9fa48("1878") ? "Stryker was here!" : (stryCov_9fa48("1878"), "")))));
  }
}

// Só aceita links absolutos http(s); qualquer outro esquema (ex.: javascript:) vira null.
export function urlSegura(url) {
  if (stryMutAct_9fa48("1879")) {
    {}
  } else {
    stryCov_9fa48("1879");
    try {
      if (stryMutAct_9fa48("1880")) {
        {}
      } else {
        stryCov_9fa48("1880");
        const endereco = new URL(url);
        return (stryMutAct_9fa48("1883") ? endereco.protocol === "https:" && endereco.protocol === "http:" : stryMutAct_9fa48("1882") ? false : stryMutAct_9fa48("1881") ? true : (stryCov_9fa48("1881", "1882", "1883"), (stryMutAct_9fa48("1885") ? endereco.protocol !== "https:" : stryMutAct_9fa48("1884") ? false : (stryCov_9fa48("1884", "1885"), endereco.protocol === (stryMutAct_9fa48("1886") ? "" : (stryCov_9fa48("1886"), "https:")))) || (stryMutAct_9fa48("1888") ? endereco.protocol !== "http:" : stryMutAct_9fa48("1887") ? false : (stryCov_9fa48("1887", "1888"), endereco.protocol === (stryMutAct_9fa48("1889") ? "" : (stryCov_9fa48("1889"), "http:")))))) ? endereco.href : null;
      }
    } catch {
      if (stryMutAct_9fa48("1890")) {
        {}
      } else {
        stryCov_9fa48("1890");
        return null;
      }
    }
  }
}
function validarLocalizacao(localizacao) {
  if (stryMutAct_9fa48("1891")) {
    {}
  } else {
    stryCov_9fa48("1891");
    if (stryMutAct_9fa48("1894") ? typeof localizacao !== "object" && localizacao === null : stryMutAct_9fa48("1893") ? false : stryMutAct_9fa48("1892") ? true : (stryCov_9fa48("1892", "1893", "1894"), (stryMutAct_9fa48("1896") ? typeof localizacao === "object" : stryMutAct_9fa48("1895") ? false : (stryCov_9fa48("1895", "1896"), typeof localizacao !== (stryMutAct_9fa48("1897") ? "" : (stryCov_9fa48("1897"), "object")))) || (stryMutAct_9fa48("1899") ? localizacao !== null : stryMutAct_9fa48("1898") ? false : (stryCov_9fa48("1898", "1899"), localizacao === null)))) return stryMutAct_9fa48("1900") ? [] : (stryCov_9fa48("1900"), [stryMutAct_9fa48("1901") ? "" : (stryCov_9fa48("1901"), "localizacao deve ser um objeto")]);
    const erros = stryMutAct_9fa48("1902") ? ["Stryker was here"] : (stryCov_9fa48("1902"), []);
    const {
      lat,
      lng,
      link_como_chegar
    } = localizacao;
    if (stryMutAct_9fa48("1905") ? (typeof lat !== "number" || lat < -90) && lat > 90 : stryMutAct_9fa48("1904") ? false : stryMutAct_9fa48("1903") ? true : (stryCov_9fa48("1903", "1904", "1905"), (stryMutAct_9fa48("1907") ? typeof lat !== "number" && lat < -90 : stryMutAct_9fa48("1906") ? false : (stryCov_9fa48("1906", "1907"), (stryMutAct_9fa48("1909") ? typeof lat === "number" : stryMutAct_9fa48("1908") ? false : (stryCov_9fa48("1908", "1909"), typeof lat !== (stryMutAct_9fa48("1910") ? "" : (stryCov_9fa48("1910"), "number")))) || (stryMutAct_9fa48("1913") ? lat >= -90 : stryMutAct_9fa48("1912") ? lat <= -90 : stryMutAct_9fa48("1911") ? false : (stryCov_9fa48("1911", "1912", "1913"), lat < (stryMutAct_9fa48("1914") ? +90 : (stryCov_9fa48("1914"), -90)))))) || (stryMutAct_9fa48("1917") ? lat <= 90 : stryMutAct_9fa48("1916") ? lat >= 90 : stryMutAct_9fa48("1915") ? false : (stryCov_9fa48("1915", "1916", "1917"), lat > 90)))) erros.push(stryMutAct_9fa48("1919") ? "" : (stryCov_9fa48("1919"), "localizacao.lat deve ser um número entre -90 e 90"));
    if (stryMutAct_9fa48("1922") ? (typeof lng !== "number" || lng < -180) && lng > 180 : stryMutAct_9fa48("1921") ? false : stryMutAct_9fa48("1920") ? true : (stryCov_9fa48("1920", "1921", "1922"), (stryMutAct_9fa48("1924") ? typeof lng !== "number" && lng < -180 : stryMutAct_9fa48("1923") ? false : (stryCov_9fa48("1923", "1924"), (stryMutAct_9fa48("1926") ? typeof lng === "number" : stryMutAct_9fa48("1925") ? false : (stryCov_9fa48("1925", "1926"), typeof lng !== (stryMutAct_9fa48("1927") ? "" : (stryCov_9fa48("1927"), "number")))) || (stryMutAct_9fa48("1930") ? lng >= -180 : stryMutAct_9fa48("1929") ? lng <= -180 : stryMutAct_9fa48("1928") ? false : (stryCov_9fa48("1928", "1929", "1930"), lng < (stryMutAct_9fa48("1931") ? +180 : (stryCov_9fa48("1931"), -180)))))) || (stryMutAct_9fa48("1934") ? lng <= 180 : stryMutAct_9fa48("1933") ? lng >= 180 : stryMutAct_9fa48("1932") ? false : (stryCov_9fa48("1932", "1933", "1934"), lng > 180)))) erros.push(stryMutAct_9fa48("1936") ? "" : (stryCov_9fa48("1936"), "localizacao.lng deve ser um número entre -180 e 180"));
    if (stryMutAct_9fa48("1939") ? false : stryMutAct_9fa48("1938") ? true : stryMutAct_9fa48("1937") ? urlSegura(link_como_chegar) : (stryCov_9fa48("1937", "1938", "1939"), !urlSegura(link_como_chegar))) erros.push(stryMutAct_9fa48("1941") ? "" : (stryCov_9fa48("1941"), "localizacao.link_como_chegar deve ser um link http(s)"));
    return erros;
  }
}

// Retorna a lista de problemas do termo; lista vazia = termo válido.
export function validarTermo(termo) {
  if (stryMutAct_9fa48("1942")) {
    {}
  } else {
    stryCov_9fa48("1942");
    if (stryMutAct_9fa48("1945") ? typeof termo !== "object" && termo === null : stryMutAct_9fa48("1944") ? false : stryMutAct_9fa48("1943") ? true : (stryCov_9fa48("1943", "1944", "1945"), (stryMutAct_9fa48("1947") ? typeof termo === "object" : stryMutAct_9fa48("1946") ? false : (stryCov_9fa48("1946", "1947"), typeof termo !== (stryMutAct_9fa48("1948") ? "" : (stryCov_9fa48("1948"), "object")))) || (stryMutAct_9fa48("1950") ? termo !== null : stryMutAct_9fa48("1949") ? false : (stryCov_9fa48("1949", "1950"), termo === null)))) return stryMutAct_9fa48("1951") ? [] : (stryCov_9fa48("1951"), [stryMutAct_9fa48("1952") ? "" : (stryCov_9fa48("1952"), "termo deve ser um objeto")]);
    const erros = stryMutAct_9fa48("1953") ? CAMPOS_TEXTO_OBRIGATORIOS.map(campo => `campo obrigatório ausente ou vazio: ${campo}`) : (stryCov_9fa48("1953"), CAMPOS_TEXTO_OBRIGATORIOS.filter(stryMutAct_9fa48("1954") ? () => undefined : (stryCov_9fa48("1954"), campo => stryMutAct_9fa48("1955") ? textoPreenchido(termo[campo]) : (stryCov_9fa48("1955"), !textoPreenchido(termo[campo])))).map(stryMutAct_9fa48("1956") ? () => undefined : (stryCov_9fa48("1956"), campo => stryMutAct_9fa48("1957") ? `` : (stryCov_9fa48("1957"), `campo obrigatório ausente ou vazio: ${campo}`))));
    if (stryMutAct_9fa48("1960") ? textoPreenchido(termo.id) || !PADRAO_ID.test(termo.id) : stryMutAct_9fa48("1959") ? false : stryMutAct_9fa48("1958") ? true : (stryCov_9fa48("1958", "1959", "1960"), textoPreenchido(termo.id) && (stryMutAct_9fa48("1961") ? PADRAO_ID.test(termo.id) : (stryCov_9fa48("1961"), !PADRAO_ID.test(termo.id))))) {
      if (stryMutAct_9fa48("1962")) {
        {}
      } else {
        stryCov_9fa48("1962");
        erros.push(stryMutAct_9fa48("1964") ? `` : (stryCov_9fa48("1964"), `id "${termo.id}" deve usar só letras minúsculas sem acento, números e hífens`));
      }
    }
    // Object.hasOwn e não `in`: `in` aceitaria chaves herdadas como "toString".
    if (stryMutAct_9fa48("1967") ? textoPreenchido(termo.tipo) || !Object.hasOwn(TIPOS, termo.tipo) : stryMutAct_9fa48("1966") ? false : stryMutAct_9fa48("1965") ? true : (stryCov_9fa48("1965", "1966", "1967"), textoPreenchido(termo.tipo) && (stryMutAct_9fa48("1968") ? Object.hasOwn(TIPOS, termo.tipo) : (stryCov_9fa48("1968"), !Object.hasOwn(TIPOS, termo.tipo))))) {
      if (stryMutAct_9fa48("1969")) {
        {}
      } else {
        stryCov_9fa48("1969");
        erros.push(stryMutAct_9fa48("1971") ? `` : (stryCov_9fa48("1971"), `tipo "${termo.tipo}" inválido (use: ${Object.keys(TIPOS).join(stryMutAct_9fa48("1972") ? "" : (stryCov_9fa48("1972"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("1975") ? textoPreenchido(termo.categoria) || !Object.hasOwn(CATEGORIAS, termo.categoria) : stryMutAct_9fa48("1974") ? false : stryMutAct_9fa48("1973") ? true : (stryCov_9fa48("1973", "1974", "1975"), textoPreenchido(termo.categoria) && (stryMutAct_9fa48("1976") ? Object.hasOwn(CATEGORIAS, termo.categoria) : (stryCov_9fa48("1976"), !Object.hasOwn(CATEGORIAS, termo.categoria))))) {
      if (stryMutAct_9fa48("1977")) {
        {}
      } else {
        stryCov_9fa48("1977");
        erros.push(stryMutAct_9fa48("1979") ? `` : (stryCov_9fa48("1979"), `categoria "${termo.categoria}" inválida (use: ${Object.keys(CATEGORIAS).join(stryMutAct_9fa48("1980") ? "" : (stryCov_9fa48("1980"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("1983") ? termo.tipo === "sigla" || !textoPreenchido(termo.significado) : stryMutAct_9fa48("1982") ? false : stryMutAct_9fa48("1981") ? true : (stryCov_9fa48("1981", "1982", "1983"), (stryMutAct_9fa48("1985") ? termo.tipo !== "sigla" : stryMutAct_9fa48("1984") ? true : (stryCov_9fa48("1984", "1985"), termo.tipo === (stryMutAct_9fa48("1986") ? "" : (stryCov_9fa48("1986"), "sigla")))) && (stryMutAct_9fa48("1987") ? textoPreenchido(termo.significado) : (stryCov_9fa48("1987"), !textoPreenchido(termo.significado))))) {
      if (stryMutAct_9fa48("1988")) {
        {}
      } else {
        stryCov_9fa48("1988");
        erros.push(stryMutAct_9fa48("1990") ? "" : (stryCov_9fa48("1990"), "sigla precisa de significado (forma por extenso)"));
      }
    }
    if (stryMutAct_9fa48("1993") ? textoPreenchido(termo.campus) || ![...CAMPI, CAMPUS_GERAL].includes(termo.campus) : stryMutAct_9fa48("1992") ? false : stryMutAct_9fa48("1991") ? true : (stryCov_9fa48("1991", "1992", "1993"), textoPreenchido(termo.campus) && (stryMutAct_9fa48("1994") ? [...CAMPI, CAMPUS_GERAL].includes(termo.campus) : (stryCov_9fa48("1994"), !(stryMutAct_9fa48("1995") ? [] : (stryCov_9fa48("1995"), [...CAMPI, CAMPUS_GERAL])).includes(termo.campus))))) {
      if (stryMutAct_9fa48("1996")) {
        {}
      } else {
        stryCov_9fa48("1996");
        erros.push(stryMutAct_9fa48("1998") ? `` : (stryCov_9fa48("1998"), `campus "${termo.campus}" inválido (use: ${(stryMutAct_9fa48("1999") ? [] : (stryCov_9fa48("1999"), [...CAMPI, CAMPUS_GERAL])).join(stryMutAct_9fa48("2000") ? "" : (stryCov_9fa48("2000"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("2003") ? termo.localizacao === undefined : stryMutAct_9fa48("2002") ? false : stryMutAct_9fa48("2001") ? true : (stryCov_9fa48("2001", "2002", "2003"), termo.localizacao !== undefined)) if (stryMutAct_9fa48("2004")) {
      ;
    } else {
      stryCov_9fa48("2004");
      erros.push(...validarLocalizacao(termo.localizacao));
    }
    return erros;
  }
}

// Valida o arquivo inteiro: cada termo + ids únicos. Mensagens indicam qual termo falhou.
export function validarGlossario(termos) {
  if (stryMutAct_9fa48("2005")) {
    {}
  } else {
    stryCov_9fa48("2005");
    if (stryMutAct_9fa48("2008") ? false : stryMutAct_9fa48("2007") ? true : stryMutAct_9fa48("2006") ? Array.isArray(termos) : (stryCov_9fa48("2006", "2007", "2008"), !Array.isArray(termos))) return stryMutAct_9fa48("2009") ? [] : (stryCov_9fa48("2009"), [stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), "o arquivo de termos deve conter uma lista (array)")]);
    const erros = stryMutAct_9fa48("2011") ? ["Stryker was here"] : (stryCov_9fa48("2011"), []);
    const idsVistos = new Set();
    termos.forEach((termo, indice) => {
      if (stryMutAct_9fa48("2013")) {
        {}
      } else {
        stryCov_9fa48("2013");
        const rotulo = stryMutAct_9fa48("2014") ? `` : (stryCov_9fa48("2014"), `termo #${indice} (${stryMutAct_9fa48("2015") ? termo?.id && "sem id" : (stryCov_9fa48("2015"), (stryMutAct_9fa48("2016") ? termo.id : (stryCov_9fa48("2016"), termo?.id)) ?? (stryMutAct_9fa48("2017") ? "" : (stryCov_9fa48("2017"), "sem id")))})`);
        erros.push(...validarTermo(termo).map(stryMutAct_9fa48("2019") ? () => undefined : (stryCov_9fa48("2019"), erro => stryMutAct_9fa48("2020") ? `` : (stryCov_9fa48("2020"), `${rotulo}: ${erro}`))));
        if (stryMutAct_9fa48("2023") ? false : stryMutAct_9fa48("2022") ? true : stryMutAct_9fa48("2021") ? textoPreenchido(termo?.id) : (stryCov_9fa48("2021", "2022", "2023"), !textoPreenchido(stryMutAct_9fa48("2024") ? termo.id : (stryCov_9fa48("2024"), termo?.id)))) return;
        if (stryMutAct_9fa48("2026") ? false : stryMutAct_9fa48("2025") ? true : (stryCov_9fa48("2025", "2026"), idsVistos.has(termo.id))) erros.push(stryMutAct_9fa48("2028") ? `` : (stryCov_9fa48("2028"), `${rotulo}: id duplicado`));
        if (stryMutAct_9fa48("2029")) {
          ;
        } else {
          stryCov_9fa48("2029");
          idsVistos.add(termo.id);
        }
      }
    });
    return erros;
  }
}