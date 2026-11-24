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
import { CAMPI, CAMPUS_GERAL, TIPOS } from "../frontend/js/termos.js";
import { mesclar, repetidosNoGlossario } from "./deduplicar.js";
const textoPreenchido = stryMutAct_9fa48("0") ? () => undefined : (stryCov_9fa48("0"), (() => {
  const textoPreenchido = valor => stryMutAct_9fa48("3") ? typeof valor === "string" || valor.trim() !== "" : stryMutAct_9fa48("2") ? false : stryMutAct_9fa48("1") ? true : (stryCov_9fa48("1", "2", "3"), (stryMutAct_9fa48("5") ? typeof valor !== "string" : stryMutAct_9fa48("4") ? true : (stryCov_9fa48("4", "5"), typeof valor === (stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), "string")))) && (stryMutAct_9fa48("8") ? valor.trim() === "" : stryMutAct_9fa48("7") ? true : (stryCov_9fa48("7", "8"), (stryMutAct_9fa48("9") ? valor : (stryCov_9fa48("9"), valor.trim())) !== (stryMutAct_9fa48("10") ? "Stryker was here!" : (stryCov_9fa48("10"), "")))));
  return textoPreenchido;
})());
const categoriaValida = stryMutAct_9fa48("11") ? () => undefined : (stryCov_9fa48("11"), (() => {
  const categoriaValida = (categoria, categorias) => stryMutAct_9fa48("12") ? categorias.every(item => item.id === categoria) : (stryCov_9fa48("12"), categorias.some(stryMutAct_9fa48("13") ? () => undefined : (stryCov_9fa48("13"), item => stryMutAct_9fa48("16") ? item.id !== categoria : stryMutAct_9fa48("15") ? false : stryMutAct_9fa48("14") ? true : (stryCov_9fa48("14", "15", "16"), item.id === categoria))));
  return categoriaValida;
})());
const campusValido = stryMutAct_9fa48("17") ? () => undefined : (stryCov_9fa48("17"), (() => {
  const campusValido = campus => stryMutAct_9fa48("20") ? campus === CAMPUS_GERAL && CAMPI.includes(campus) : stryMutAct_9fa48("19") ? false : stryMutAct_9fa48("18") ? true : (stryCov_9fa48("18", "19", "20"), (stryMutAct_9fa48("22") ? campus !== CAMPUS_GERAL : stryMutAct_9fa48("21") ? false : (stryCov_9fa48("21", "22"), campus === CAMPUS_GERAL)) || CAMPI.includes(campus));
  return campusValido;
})());
const tipoValido = stryMutAct_9fa48("23") ? () => undefined : (stryCov_9fa48("23"), (() => {
  const tipoValido = tipo => Object.hasOwn(TIPOS, tipo);
  return tipoValido;
})());
function motivoParaNaoAdicionar(registro, categorias) {
  if (stryMutAct_9fa48("24")) {
    {}
  } else {
    stryCov_9fa48("24");
    const candidato = stryMutAct_9fa48("25") ? registro.candidato && {} : (stryCov_9fa48("25"), registro.candidato ?? {});
    const classificacao = candidato.classificacao;
    if (stryMutAct_9fa48("28") ? classificacao?.estado === "revisar" : stryMutAct_9fa48("27") ? false : stryMutAct_9fa48("26") ? true : (stryCov_9fa48("26", "27", "28"), (stryMutAct_9fa48("29") ? classificacao.estado : (stryCov_9fa48("29"), classificacao?.estado)) !== (stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), "revisar")))) return stryMutAct_9fa48("31") ? classificacao?.motivo && "sem classificação revisável" : (stryCov_9fa48("31"), (stryMutAct_9fa48("32") ? classificacao.motivo : (stryCov_9fa48("32"), classificacao?.motivo)) ?? (stryMutAct_9fa48("33") ? "" : (stryCov_9fa48("33"), "sem classificação revisável")));
    if (stryMutAct_9fa48("36") ? false : stryMutAct_9fa48("35") ? true : stryMutAct_9fa48("34") ? categoriaValida(classificacao.categoria, categorias) : (stryCov_9fa48("34", "35", "36"), !categoriaValida(classificacao.categoria, categorias))) return stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), "categoria fora da taxonomia");
    if (stryMutAct_9fa48("40") ? false : stryMutAct_9fa48("39") ? true : stryMutAct_9fa48("38") ? textoPreenchido(registro.proposta_id) : (stryCov_9fa48("38", "39", "40"), !textoPreenchido(registro.proposta_id))) return stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), "candidato sem id proposto");
    if (stryMutAct_9fa48("44") ? false : stryMutAct_9fa48("43") ? true : stryMutAct_9fa48("42") ? textoPreenchido(candidato.termo) : (stryCov_9fa48("42", "43", "44"), !textoPreenchido(candidato.termo))) return stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), "candidato sem termo");
    if (stryMutAct_9fa48("48") ? false : stryMutAct_9fa48("47") ? true : stryMutAct_9fa48("46") ? textoPreenchido(candidato.significado) : (stryCov_9fa48("46", "47", "48"), !textoPreenchido(candidato.significado))) return stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), "candidato sem significado");
    if (stryMutAct_9fa48("52") ? false : stryMutAct_9fa48("51") ? true : stryMutAct_9fa48("50") ? textoPreenchido(candidato.fonte) : (stryCov_9fa48("50", "51", "52"), !textoPreenchido(candidato.fonte))) return stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "candidato sem fonte");
    if (stryMutAct_9fa48("56") ? false : stryMutAct_9fa48("55") ? true : stryMutAct_9fa48("54") ? textoPreenchido(classificacao.definicao_sugerida) : (stryCov_9fa48("54", "55", "56"), !textoPreenchido(classificacao.definicao_sugerida))) return stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "classificação sem definição");
    if (stryMutAct_9fa48("60") ? false : stryMutAct_9fa48("59") ? true : stryMutAct_9fa48("58") ? textoPreenchido(classificacao.exemplo_sugerido) : (stryCov_9fa48("58", "59", "60"), !textoPreenchido(classificacao.exemplo_sugerido))) return stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), "classificação sem exemplo de uso");
    if (stryMutAct_9fa48("64") ? false : stryMutAct_9fa48("63") ? true : stryMutAct_9fa48("62") ? tipoValido(classificacao.tipo_sugerido ?? candidato.tipo) : (stryCov_9fa48("62", "63", "64"), !tipoValido(stryMutAct_9fa48("65") ? classificacao.tipo_sugerido && candidato.tipo : (stryCov_9fa48("65"), classificacao.tipo_sugerido ?? candidato.tipo)))) return stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), "tipo sugerido inválido");
    if (stryMutAct_9fa48("69") ? candidato.campus !== undefined || !campusValido(candidato.campus) : stryMutAct_9fa48("68") ? false : stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67", "68", "69"), (stryMutAct_9fa48("71") ? candidato.campus === undefined : stryMutAct_9fa48("70") ? true : (stryCov_9fa48("70", "71"), candidato.campus !== undefined)) && (stryMutAct_9fa48("72") ? campusValido(candidato.campus) : (stryCov_9fa48("72"), !campusValido(candidato.campus))))) return stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), "campus inválido");
    return null;
  }
}
function novoTermo(registro) {
  if (stryMutAct_9fa48("74")) {
    {}
  } else {
    stryCov_9fa48("74");
    const candidato = registro.candidato;
    const classificacao = candidato.classificacao;
    const tipo = stryMutAct_9fa48("75") ? classificacao.tipo_sugerido && candidato.tipo : (stryCov_9fa48("75"), classificacao.tipo_sugerido ?? candidato.tipo);
    const termo = stryMutAct_9fa48("76") ? {} : (stryCov_9fa48("76"), {
      id: registro.proposta_id,
      termo: candidato.termo,
      tipo,
      significado: candidato.significado,
      definicao: classificacao.definicao_sugerida,
      exemplo_uso: classificacao.exemplo_sugerido,
      fonte: candidato.fonte,
      campus: stryMutAct_9fa48("77") ? candidato.campus && CAMPUS_GERAL : (stryCov_9fa48("77"), candidato.campus ?? CAMPUS_GERAL),
      categoria: classificacao.categoria
    });
    return termo;
  }
}
export function atualizarTermos(termos, resultado, {
  categorias = stryMutAct_9fa48("78") ? ["Stryker was here"] : (stryCov_9fa48("78"), [])
} = {}) {
  if (stryMutAct_9fa48("79")) {
    {}
  } else {
    stryCov_9fa48("79");
    const atualizados = mesclar(termos, resultado.alterados);
    const adicionados = stryMutAct_9fa48("80") ? ["Stryker was here"] : (stryCov_9fa48("80"), []);
    const naoAdicionados = stryMutAct_9fa48("81") ? ["Stryker was here"] : (stryCov_9fa48("81"), []);
    const idsUsados = new Set(atualizados.map(stryMutAct_9fa48("82") ? () => undefined : (stryCov_9fa48("82"), termo => termo.id)));
    for (const registro of resultado.novos) {
      if (stryMutAct_9fa48("83")) {
        {}
      } else {
        stryCov_9fa48("83");
        const motivo = motivoParaNaoAdicionar(registro, categorias);
        if (stryMutAct_9fa48("85") ? false : stryMutAct_9fa48("84") ? true : (stryCov_9fa48("84", "85"), motivo)) {
          if (stryMutAct_9fa48("86")) {
            {}
          } else {
            stryCov_9fa48("86");
            naoAdicionados.push(stryMutAct_9fa48("88") ? {} : (stryCov_9fa48("88"), {
              id: registro.proposta_id,
              motivo
            }));
            continue;
          }
        }
        const termo = novoTermo(registro);
        if (stryMutAct_9fa48("92") ? repetidosNoGlossario([...atualizados, termo]).length <= 0 : stryMutAct_9fa48("91") ? repetidosNoGlossario([...atualizados, termo]).length >= 0 : stryMutAct_9fa48("90") ? false : stryMutAct_9fa48("89") ? true : (stryCov_9fa48("89", "90", "91", "92"), repetidosNoGlossario(stryMutAct_9fa48("93") ? [] : (stryCov_9fa48("93"), [...atualizados, termo])).length > 0)) {
          if (stryMutAct_9fa48("94")) {
            {}
          } else {
            stryCov_9fa48("94");
            naoAdicionados.push(stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
              id: termo.id,
              motivo: stryMutAct_9fa48("97") ? "" : (stryCov_9fa48("97"), "já existe termo com a mesma sigla ou o mesmo significado")
            }));
            continue;
          }
        }
        if (stryMutAct_9fa48("99") ? false : stryMutAct_9fa48("98") ? true : (stryCov_9fa48("98", "99"), idsUsados.has(termo.id))) {
          if (stryMutAct_9fa48("100")) {
            {}
          } else {
            stryCov_9fa48("100");
            naoAdicionados.push(stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
              id: termo.id,
              motivo: stryMutAct_9fa48("103") ? "" : (stryCov_9fa48("103"), "id proposto já existe no glossário")
            }));
            continue;
          }
        }
        if (stryMutAct_9fa48("104")) {
          ;
        } else {
          stryCov_9fa48("104");
          idsUsados.add(termo.id);
        }
        if (stryMutAct_9fa48("105")) {
          ;
        } else {
          stryCov_9fa48("105");
          adicionados.push(termo);
        }
        if (stryMutAct_9fa48("106")) {
          ;
        } else {
          stryCov_9fa48("106");
          atualizados.push(termo);
        }
      }
    }
    return stryMutAct_9fa48("107") ? {} : (stryCov_9fa48("107"), {
      termos: atualizados,
      adicionados: adicionados.map(stryMutAct_9fa48("108") ? () => undefined : (stryCov_9fa48("108"), termo => termo.id)),
      naoAdicionados
    });
  }
}