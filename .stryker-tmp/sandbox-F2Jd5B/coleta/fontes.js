// Formato do coleta/fontes.json (#56, ADR 0009): de onde o robô coleta e como ler cada página.
// Separa o que extrair (o termo) de onde ele está (o trecho e o elemento de cada página), para que
// uma fonte nova seja só uma entrada a mais no fontes.json, sem mexer no coletor.
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
import { load } from "cheerio";
import { CAMPI, CAMPUS_GERAL, TIPOS } from "../frontend/js/termos.js";
export const PADROES = stryMutAct_9fa48("938") ? [] : (stryCov_9fa48("938"), [stryMutAct_9fa48("939") ? "" : (stryCov_9fa48("939"), "nome-sigla"), stryMutAct_9fa48("940") ? "" : (stryCov_9fa48("940"), "sigla-nome"), stryMutAct_9fa48("941") ? "" : (stryCov_9fa48("941"), "regex")]);
export const FREQUENCIAS = stryMutAct_9fa48("942") ? [] : (stryCov_9fa48("942"), [stryMutAct_9fa48("943") ? "" : (stryCov_9fa48("943"), "diaria"), stryMutAct_9fa48("944") ? "" : (stryCov_9fa48("944"), "semanal"), stryMutAct_9fa48("945") ? "" : (stryCov_9fa48("945"), "mensal")]);
const PADRAO_ID = stryMutAct_9fa48("952") ? /^[a-z0-9]+(-[^a-z0-9]+)*$/ : stryMutAct_9fa48("951") ? /^[a-z0-9]+(-[a-z0-9])*$/ : stryMutAct_9fa48("950") ? /^[a-z0-9]+(-[a-z0-9]+)$/ : stryMutAct_9fa48("949") ? /^[^a-z0-9]+(-[a-z0-9]+)*$/ : stryMutAct_9fa48("948") ? /^[a-z0-9](-[a-z0-9]+)*$/ : stryMutAct_9fa48("947") ? /^[a-z0-9]+(-[a-z0-9]+)*/ : stryMutAct_9fa48("946") ? /[a-z0-9]+(-[a-z0-9]+)*$/ : (stryCov_9fa48("946", "947", "948", "949", "950", "951", "952"), /^[a-z0-9]+(-[a-z0-9]+)*$/);
const PADRAO_ELEMENTO = stryMutAct_9fa48("957") ? /^[a-z][^a-z0-9]*$/ : stryMutAct_9fa48("956") ? /^[a-z][a-z0-9]$/ : stryMutAct_9fa48("955") ? /^[^a-z][a-z0-9]*$/ : stryMutAct_9fa48("954") ? /^[a-z][a-z0-9]*/ : stryMutAct_9fa48("953") ? /[a-z][a-z0-9]*$/ : (stryCov_9fa48("953", "954", "955", "956", "957"), /^[a-z][a-z0-9]*$/);
function textoPreenchido(valor) {
  if (stryMutAct_9fa48("958")) {
    {}
  } else {
    stryCov_9fa48("958");
    return stryMutAct_9fa48("961") ? typeof valor === "string" || valor.trim() !== "" : stryMutAct_9fa48("960") ? false : stryMutAct_9fa48("959") ? true : (stryCov_9fa48("959", "960", "961"), (stryMutAct_9fa48("963") ? typeof valor !== "string" : stryMutAct_9fa48("962") ? true : (stryCov_9fa48("962", "963"), typeof valor === (stryMutAct_9fa48("964") ? "" : (stryCov_9fa48("964"), "string")))) && (stryMutAct_9fa48("966") ? valor.trim() === "" : stryMutAct_9fa48("965") ? true : (stryCov_9fa48("965", "966"), (stryMutAct_9fa48("967") ? valor : (stryCov_9fa48("967"), valor.trim())) !== (stryMutAct_9fa48("968") ? "Stryker was here!" : (stryCov_9fa48("968"), "")))));
  }
}
function urlHttps(url) {
  if (stryMutAct_9fa48("969")) {
    {}
  } else {
    stryCov_9fa48("969");
    try {
      if (stryMutAct_9fa48("970")) {
        {}
      } else {
        stryCov_9fa48("970");
        return stryMutAct_9fa48("973") ? new URL(url).protocol !== "https:" : stryMutAct_9fa48("972") ? false : stryMutAct_9fa48("971") ? true : (stryCov_9fa48("971", "972", "973"), new URL(url).protocol === (stryMutAct_9fa48("974") ? "" : (stryCov_9fa48("974"), "https:")));
      }
    } catch {
      if (stryMutAct_9fa48("975")) {
        {}
      } else {
        stryCov_9fa48("975");
        return stryMutAct_9fa48("976") ? true : (stryCov_9fa48("976"), false);
      }
    }
  }
}

// O padrão "regex" precisa dos grupos (?<termo>…) e (?<significado>…), e a expressão precisa compilar.
function validarExpressao(expressao) {
  if (stryMutAct_9fa48("977")) {
    {}
  } else {
    stryCov_9fa48("977");
    if (stryMutAct_9fa48("980") ? false : stryMutAct_9fa48("979") ? true : stryMutAct_9fa48("978") ? textoPreenchido(expressao) : (stryCov_9fa48("978", "979", "980"), !textoPreenchido(expressao))) return stryMutAct_9fa48("981") ? [] : (stryCov_9fa48("981"), [stryMutAct_9fa48("982") ? "" : (stryCov_9fa48("982"), "extracao.expressao é obrigatória com o padrão regex")]);
    try {
      if (stryMutAct_9fa48("983")) {
        {}
      } else {
        stryCov_9fa48("983");
        new RegExp(expressao, stryMutAct_9fa48("984") ? "" : (stryCov_9fa48("984"), "u"));
      }
    } catch (erro) {
      if (stryMutAct_9fa48("985")) {
        {}
      } else {
        stryCov_9fa48("985");
        return stryMutAct_9fa48("986") ? [] : (stryCov_9fa48("986"), [stryMutAct_9fa48("987") ? `` : (stryCov_9fa48("987"), `extracao.expressao não é uma expressão regular válida: ${erro.message}`)]);
      }
    }
    if (stryMutAct_9fa48("990") ? !expressao.includes("(?<termo>") && !expressao.includes("(?<significado>") : stryMutAct_9fa48("989") ? false : stryMutAct_9fa48("988") ? true : (stryCov_9fa48("988", "989", "990"), (stryMutAct_9fa48("991") ? expressao.includes("(?<termo>") : (stryCov_9fa48("991"), !expressao.includes(stryMutAct_9fa48("992") ? "" : (stryCov_9fa48("992"), "(?<termo>")))) || (stryMutAct_9fa48("993") ? expressao.includes("(?<significado>") : (stryCov_9fa48("993"), !expressao.includes(stryMutAct_9fa48("994") ? "" : (stryCov_9fa48("994"), "(?<significado>")))))) {
      if (stryMutAct_9fa48("995")) {
        {}
      } else {
        stryCov_9fa48("995");
        return stryMutAct_9fa48("996") ? [] : (stryCov_9fa48("996"), [stryMutAct_9fa48("997") ? "" : (stryCov_9fa48("997"), "extracao.expressao precisa dos grupos (?<termo>…) e (?<significado>…)")]);
      }
    }
    return stryMutAct_9fa48("998") ? ["Stryker was here"] : (stryCov_9fa48("998"), []);
  }
}

// O trecho é um seletor CSS do bloco de conteúdo (ex.: [itemprop="articleBody"]). O cheerio compila o seletor
// na hora da busca, então um seletor quebrado aparece aqui, e não no meio da coleta.
function validarTrecho(trecho) {
  if (stryMutAct_9fa48("999")) {
    {}
  } else {
    stryCov_9fa48("999");
    if (stryMutAct_9fa48("1002") ? trecho !== undefined : stryMutAct_9fa48("1001") ? false : stryMutAct_9fa48("1000") ? true : (stryCov_9fa48("1000", "1001", "1002"), trecho === undefined)) return stryMutAct_9fa48("1003") ? ["Stryker was here"] : (stryCov_9fa48("1003"), []);
    if (stryMutAct_9fa48("1006") ? false : stryMutAct_9fa48("1005") ? true : stryMutAct_9fa48("1004") ? textoPreenchido(trecho) : (stryCov_9fa48("1004", "1005", "1006"), !textoPreenchido(trecho))) {
      if (stryMutAct_9fa48("1007")) {
        {}
      } else {
        stryCov_9fa48("1007");
        return stryMutAct_9fa48("1008") ? [] : (stryCov_9fa48("1008"), [stryMutAct_9fa48("1009") ? "" : (stryCov_9fa48("1009"), 'extracao.trecho deve ser um seletor CSS do bloco de conteúdo (ex.: [itemprop="articleBody"])')]);
      }
    }
    try {
      if (stryMutAct_9fa48("1010")) {
        {}
      } else {
        stryCov_9fa48("1010");
        load(stryMutAct_9fa48("1012") ? "Stryker was here!" : (stryCov_9fa48("1012"), ""))(trecho);
      }
    } catch (erro) {
      if (stryMutAct_9fa48("1013")) {
        {}
      } else {
        stryCov_9fa48("1013");
        return stryMutAct_9fa48("1014") ? [] : (stryCov_9fa48("1014"), [stryMutAct_9fa48("1015") ? `` : (stryCov_9fa48("1015"), `extracao.trecho não é um seletor CSS válido: ${erro.message}`)]);
      }
    }
    return stryMutAct_9fa48("1016") ? ["Stryker was here"] : (stryCov_9fa48("1016"), []);
  }
}
function validarExtracao(extracao) {
  if (stryMutAct_9fa48("1017")) {
    {}
  } else {
    stryCov_9fa48("1017");
    if (stryMutAct_9fa48("1020") ? typeof extracao !== "object" && extracao === null : stryMutAct_9fa48("1019") ? false : stryMutAct_9fa48("1018") ? true : (stryCov_9fa48("1018", "1019", "1020"), (stryMutAct_9fa48("1022") ? typeof extracao === "object" : stryMutAct_9fa48("1021") ? false : (stryCov_9fa48("1021", "1022"), typeof extracao !== (stryMutAct_9fa48("1023") ? "" : (stryCov_9fa48("1023"), "object")))) || (stryMutAct_9fa48("1025") ? extracao !== null : stryMutAct_9fa48("1024") ? false : (stryCov_9fa48("1024", "1025"), extracao === null)))) return stryMutAct_9fa48("1026") ? [] : (stryCov_9fa48("1026"), [stryMutAct_9fa48("1027") ? "" : (stryCov_9fa48("1027"), "extracao deve ser um objeto")]);
    const erros = stryMutAct_9fa48("1028") ? ["Stryker was here"] : (stryCov_9fa48("1028"), []);
    if (stryMutAct_9fa48("1031") ? false : stryMutAct_9fa48("1030") ? true : stryMutAct_9fa48("1029") ? PADRAO_ELEMENTO.test(extracao.elemento ?? "") : (stryCov_9fa48("1029", "1030", "1031"), !PADRAO_ELEMENTO.test(stryMutAct_9fa48("1032") ? extracao.elemento && "" : (stryCov_9fa48("1032"), extracao.elemento ?? (stryMutAct_9fa48("1033") ? "Stryker was here!" : (stryCov_9fa48("1033"), "")))))) {
      if (stryMutAct_9fa48("1034")) {
        {}
      } else {
        stryCov_9fa48("1034");
        erros.push(stryMutAct_9fa48("1036") ? "" : (stryCov_9fa48("1036"), 'extracao.elemento deve ser o nome de uma tag HTML, como "a" ou "li"'));
      }
    }
    if (stryMutAct_9fa48("1039") ? false : stryMutAct_9fa48("1038") ? true : stryMutAct_9fa48("1037") ? PADROES.includes(extracao.padrao) : (stryCov_9fa48("1037", "1038", "1039"), !PADROES.includes(extracao.padrao))) {
      if (stryMutAct_9fa48("1040")) {
        {}
      } else {
        stryCov_9fa48("1040");
        erros.push(stryMutAct_9fa48("1042") ? `` : (stryCov_9fa48("1042"), `extracao.padrao "${extracao.padrao}" inválido (use: ${PADROES.join(stryMutAct_9fa48("1043") ? "" : (stryCov_9fa48("1043"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("1046") ? extracao.padrao !== "regex" : stryMutAct_9fa48("1045") ? false : stryMutAct_9fa48("1044") ? true : (stryCov_9fa48("1044", "1045", "1046"), extracao.padrao === (stryMutAct_9fa48("1047") ? "" : (stryCov_9fa48("1047"), "regex")))) if (stryMutAct_9fa48("1048")) {
      ;
    } else {
      stryCov_9fa48("1048");
      erros.push(...validarExpressao(extracao.expressao));
    }
    if (stryMutAct_9fa48("1049")) {
      ;
    } else {
      stryCov_9fa48("1049");
      erros.push(...validarTrecho(extracao.trecho));
    }
    if (stryMutAct_9fa48("1052") ? !Number.isInteger(extracao.minimo) && extracao.minimo < 1 : stryMutAct_9fa48("1051") ? false : stryMutAct_9fa48("1050") ? true : (stryCov_9fa48("1050", "1051", "1052"), (stryMutAct_9fa48("1053") ? Number.isInteger(extracao.minimo) : (stryCov_9fa48("1053"), !Number.isInteger(extracao.minimo))) || (stryMutAct_9fa48("1056") ? extracao.minimo >= 1 : stryMutAct_9fa48("1055") ? extracao.minimo <= 1 : stryMutAct_9fa48("1054") ? false : (stryCov_9fa48("1054", "1055", "1056"), extracao.minimo < 1)))) {
      if (stryMutAct_9fa48("1057")) {
        {}
      } else {
        stryCov_9fa48("1057");
        erros.push(stryMutAct_9fa48("1059") ? "" : (stryCov_9fa48("1059"), "extracao.minimo deve ser um inteiro maior ou igual a 1"));
      }
    }
    return erros;
  }
}
function validarFonte(fonte) {
  if (stryMutAct_9fa48("1060")) {
    {}
  } else {
    stryCov_9fa48("1060");
    if (stryMutAct_9fa48("1063") ? typeof fonte !== "object" && fonte === null : stryMutAct_9fa48("1062") ? false : stryMutAct_9fa48("1061") ? true : (stryCov_9fa48("1061", "1062", "1063"), (stryMutAct_9fa48("1065") ? typeof fonte === "object" : stryMutAct_9fa48("1064") ? false : (stryCov_9fa48("1064", "1065"), typeof fonte !== (stryMutAct_9fa48("1066") ? "" : (stryCov_9fa48("1066"), "object")))) || (stryMutAct_9fa48("1068") ? fonte !== null : stryMutAct_9fa48("1067") ? false : (stryCov_9fa48("1067", "1068"), fonte === null)))) return stryMutAct_9fa48("1069") ? [] : (stryCov_9fa48("1069"), [stryMutAct_9fa48("1070") ? "" : (stryCov_9fa48("1070"), "fonte deve ser um objeto")]);
    const erros = stryMutAct_9fa48("1071") ? ["Stryker was here"] : (stryCov_9fa48("1071"), []);
    if (stryMutAct_9fa48("1074") ? false : stryMutAct_9fa48("1073") ? true : stryMutAct_9fa48("1072") ? PADRAO_ID.test(fonte.id ?? "") : (stryCov_9fa48("1072", "1073", "1074"), !PADRAO_ID.test(stryMutAct_9fa48("1075") ? fonte.id && "" : (stryCov_9fa48("1075"), fonte.id ?? (stryMutAct_9fa48("1076") ? "Stryker was here!" : (stryCov_9fa48("1076"), "")))))) erros.push(stryMutAct_9fa48("1078") ? "" : (stryCov_9fa48("1078"), "id deve usar só letras minúsculas sem acento, números e hífens"));
    if (stryMutAct_9fa48("1081") ? false : stryMutAct_9fa48("1080") ? true : stryMutAct_9fa48("1079") ? textoPreenchido(fonte.nome) : (stryCov_9fa48("1079", "1080", "1081"), !textoPreenchido(fonte.nome))) erros.push(stryMutAct_9fa48("1083") ? "" : (stryCov_9fa48("1083"), "nome é obrigatório"));
    if (stryMutAct_9fa48("1086") ? false : stryMutAct_9fa48("1085") ? true : stryMutAct_9fa48("1084") ? urlHttps(fonte.url) : (stryCov_9fa48("1084", "1085", "1086"), !urlHttps(fonte.url))) erros.push(stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), "url deve ser um link https"));
    if (stryMutAct_9fa48("1091") ? fonte.tipo === "html" : stryMutAct_9fa48("1090") ? false : stryMutAct_9fa48("1089") ? true : (stryCov_9fa48("1089", "1090", "1091"), fonte.tipo !== (stryMutAct_9fa48("1092") ? "" : (stryCov_9fa48("1092"), "html")))) erros.push(stryMutAct_9fa48("1094") ? `` : (stryCov_9fa48("1094"), `tipo "${fonte.tipo}" inválido (por enquanto só "html")`));
    if (stryMutAct_9fa48("1097") ? !Number.isInteger(fonte.prioridade) && fonte.prioridade < 1 : stryMutAct_9fa48("1096") ? false : stryMutAct_9fa48("1095") ? true : (stryCov_9fa48("1095", "1096", "1097"), (stryMutAct_9fa48("1098") ? Number.isInteger(fonte.prioridade) : (stryCov_9fa48("1098"), !Number.isInteger(fonte.prioridade))) || (stryMutAct_9fa48("1101") ? fonte.prioridade >= 1 : stryMutAct_9fa48("1100") ? fonte.prioridade <= 1 : stryMutAct_9fa48("1099") ? false : (stryCov_9fa48("1099", "1100", "1101"), fonte.prioridade < 1)))) {
      if (stryMutAct_9fa48("1102")) {
        {}
      } else {
        stryCov_9fa48("1102");
        erros.push(stryMutAct_9fa48("1104") ? "" : (stryCov_9fa48("1104"), "prioridade deve ser um inteiro maior ou igual a 1 (1 é coletada primeiro)"));
      }
    }
    if (stryMutAct_9fa48("1107") ? false : stryMutAct_9fa48("1106") ? true : stryMutAct_9fa48("1105") ? FREQUENCIAS.includes(fonte.frequencia) : (stryCov_9fa48("1105", "1106", "1107"), !FREQUENCIAS.includes(fonte.frequencia))) {
      if (stryMutAct_9fa48("1108")) {
        {}
      } else {
        stryCov_9fa48("1108");
        erros.push(stryMutAct_9fa48("1110") ? `` : (stryCov_9fa48("1110"), `frequencia "${fonte.frequencia}" inválida (use: ${FREQUENCIAS.join(stryMutAct_9fa48("1111") ? "" : (stryCov_9fa48("1111"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("1114") ? fonte.campus !== undefined || ![...CAMPI, CAMPUS_GERAL].includes(fonte.campus) : stryMutAct_9fa48("1113") ? false : stryMutAct_9fa48("1112") ? true : (stryCov_9fa48("1112", "1113", "1114"), (stryMutAct_9fa48("1116") ? fonte.campus === undefined : stryMutAct_9fa48("1115") ? true : (stryCov_9fa48("1115", "1116"), fonte.campus !== undefined)) && (stryMutAct_9fa48("1117") ? [...CAMPI, CAMPUS_GERAL].includes(fonte.campus) : (stryCov_9fa48("1117"), !(stryMutAct_9fa48("1118") ? [] : (stryCov_9fa48("1118"), [...CAMPI, CAMPUS_GERAL])).includes(fonte.campus))))) {
      if (stryMutAct_9fa48("1119")) {
        {}
      } else {
        stryCov_9fa48("1119");
        erros.push(stryMutAct_9fa48("1121") ? `` : (stryCov_9fa48("1121"), `campus "${fonte.campus}" inválido (use: ${(stryMutAct_9fa48("1122") ? [] : (stryCov_9fa48("1122"), [...CAMPI, CAMPUS_GERAL])).join(stryMutAct_9fa48("1123") ? "" : (stryCov_9fa48("1123"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("1126") ? fonte.tipo_termo !== undefined || !Object.hasOwn(TIPOS, fonte.tipo_termo) : stryMutAct_9fa48("1125") ? false : stryMutAct_9fa48("1124") ? true : (stryCov_9fa48("1124", "1125", "1126"), (stryMutAct_9fa48("1128") ? fonte.tipo_termo === undefined : stryMutAct_9fa48("1127") ? true : (stryCov_9fa48("1127", "1128"), fonte.tipo_termo !== undefined)) && (stryMutAct_9fa48("1129") ? Object.hasOwn(TIPOS, fonte.tipo_termo) : (stryCov_9fa48("1129"), !Object.hasOwn(TIPOS, fonte.tipo_termo))))) {
      if (stryMutAct_9fa48("1130")) {
        {}
      } else {
        stryCov_9fa48("1130");
        erros.push(stryMutAct_9fa48("1132") ? `` : (stryCov_9fa48("1132"), `tipo_termo "${fonte.tipo_termo}" inválido (use: ${Object.keys(TIPOS).join(stryMutAct_9fa48("1133") ? "" : (stryCov_9fa48("1133"), ", "))})`));
      }
    }
    if (stryMutAct_9fa48("1134")) {
      ;
    } else {
      stryCov_9fa48("1134");
      erros.push(...validarExtracao(fonte.extracao));
    }
    return erros;
  }
}

// Valida o arquivo inteiro: cada fonte + ids únicos. Lista vazia = arquivo válido.
export function validarFontes(config) {
  if (stryMutAct_9fa48("1135")) {
    {}
  } else {
    stryCov_9fa48("1135");
    if (stryMutAct_9fa48("1138") ? (typeof config !== "object" || config === null) && !Array.isArray(config.fontes) : stryMutAct_9fa48("1137") ? false : stryMutAct_9fa48("1136") ? true : (stryCov_9fa48("1136", "1137", "1138"), (stryMutAct_9fa48("1140") ? typeof config !== "object" && config === null : stryMutAct_9fa48("1139") ? false : (stryCov_9fa48("1139", "1140"), (stryMutAct_9fa48("1142") ? typeof config === "object" : stryMutAct_9fa48("1141") ? false : (stryCov_9fa48("1141", "1142"), typeof config !== (stryMutAct_9fa48("1143") ? "" : (stryCov_9fa48("1143"), "object")))) || (stryMutAct_9fa48("1145") ? config !== null : stryMutAct_9fa48("1144") ? false : (stryCov_9fa48("1144", "1145"), config === null)))) || (stryMutAct_9fa48("1146") ? Array.isArray(config.fontes) : (stryCov_9fa48("1146"), !Array.isArray(config.fontes))))) {
      if (stryMutAct_9fa48("1147")) {
        {}
      } else {
        stryCov_9fa48("1147");
        return stryMutAct_9fa48("1148") ? [] : (stryCov_9fa48("1148"), [stryMutAct_9fa48("1149") ? "" : (stryCov_9fa48("1149"), 'o arquivo deve ter uma lista "fontes"')]);
      }
    }
    const erros = stryMutAct_9fa48("1150") ? ["Stryker was here"] : (stryCov_9fa48("1150"), []);
    const idsVistos = new Set();
    config.fontes.forEach((fonte, indice) => {
      if (stryMutAct_9fa48("1152")) {
        {}
      } else {
        stryCov_9fa48("1152");
        const rotulo = stryMutAct_9fa48("1153") ? `` : (stryCov_9fa48("1153"), `fonte #${indice} (${stryMutAct_9fa48("1154") ? fonte?.id && "sem id" : (stryCov_9fa48("1154"), (stryMutAct_9fa48("1155") ? fonte.id : (stryCov_9fa48("1155"), fonte?.id)) ?? (stryMutAct_9fa48("1156") ? "" : (stryCov_9fa48("1156"), "sem id")))})`);
        erros.push(...validarFonte(fonte).map(stryMutAct_9fa48("1158") ? () => undefined : (stryCov_9fa48("1158"), erro => stryMutAct_9fa48("1159") ? `` : (stryCov_9fa48("1159"), `${rotulo}: ${erro}`))));
        if (stryMutAct_9fa48("1162") ? false : stryMutAct_9fa48("1161") ? true : stryMutAct_9fa48("1160") ? textoPreenchido(fonte?.id) : (stryCov_9fa48("1160", "1161", "1162"), !textoPreenchido(stryMutAct_9fa48("1163") ? fonte.id : (stryCov_9fa48("1163"), fonte?.id)))) return;
        if (stryMutAct_9fa48("1165") ? false : stryMutAct_9fa48("1164") ? true : (stryCov_9fa48("1164", "1165"), idsVistos.has(fonte.id))) erros.push(stryMutAct_9fa48("1167") ? `` : (stryCov_9fa48("1167"), `${rotulo}: id duplicado`));
        if (stryMutAct_9fa48("1168")) {
          ;
        } else {
          stryCov_9fa48("1168");
          idsVistos.add(fonte.id);
        }
      }
    });
    return erros;
  }
}