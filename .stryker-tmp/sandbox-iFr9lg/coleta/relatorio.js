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
import { resumirClassificacao } from "./classificador.js";
export const LIMITE_DE_LINHAS_NO_PR = 100;
const juntarEspacos = stryMutAct_9fa48("1173") ? () => undefined : (stryCov_9fa48("1173"), (() => {
  const juntarEspacos = texto => stryMutAct_9fa48("1174") ? String(texto ?? "").replace(/\s+/g, " ") : (stryCov_9fa48("1174"), String(stryMutAct_9fa48("1175") ? texto && "" : (stryCov_9fa48("1175"), texto ?? (stryMutAct_9fa48("1176") ? "Stryker was here!" : (stryCov_9fa48("1176"), "")))).replace(stryMutAct_9fa48("1178") ? /\S+/g : stryMutAct_9fa48("1177") ? /\s/g : (stryCov_9fa48("1177", "1178"), /\s+/g), stryMutAct_9fa48("1179") ? "" : (stryCov_9fa48("1179"), " ")).trim());
  return juntarEspacos;
})());
const celula = stryMutAct_9fa48("1180") ? () => undefined : (stryCov_9fa48("1180"), (() => {
  const celula = texto => juntarEspacos(texto).replaceAll(stryMutAct_9fa48("1181") ? "" : (stryCov_9fa48("1181"), "|"), stryMutAct_9fa48("1182") ? "" : (stryCov_9fa48("1182"), "\\|"));
  return celula;
})());
function linkDaFonte(candidato, tambemEm = stryMutAct_9fa48("1183") ? ["Stryker was here"] : (stryCov_9fa48("1183"), [])) {
  if (stryMutAct_9fa48("1184")) {
    {}
  } else {
    stryCov_9fa48("1184");
    const rotulo = stryMutAct_9fa48("1187") ? candidato.fonte_id && "fonte" : stryMutAct_9fa48("1186") ? false : stryMutAct_9fa48("1185") ? true : (stryCov_9fa48("1185", "1186", "1187"), candidato.fonte_id || (stryMutAct_9fa48("1188") ? "" : (stryCov_9fa48("1188"), "fonte")));
    const principal = candidato.fonte ? stryMutAct_9fa48("1189") ? `` : (stryCov_9fa48("1189"), `[${celula(rotulo)}](${candidato.fonte})`) : celula(rotulo);
    const outras = tambemEm.map(stryMutAct_9fa48("1190") ? () => undefined : (stryCov_9fa48("1190"), url => stryMutAct_9fa48("1191") ? `` : (stryCov_9fa48("1191"), `<${url}>`)));
    return (stryMutAct_9fa48("1192") ? [] : (stryCov_9fa48("1192"), [principal, ...outras])).join(stryMutAct_9fa48("1193") ? "" : (stryCov_9fa48("1193"), "<br>"));
  }
}
function classificacaoDoCandidato(candidato) {
  if (stryMutAct_9fa48("1194")) {
    {}
  } else {
    stryCov_9fa48("1194");
    const classificacao = candidato.classificacao;
    // Na #59, só os termos novos passam pelo LLM: alterados e conflitos não são classificados.
    if (stryMutAct_9fa48("1197") ? false : stryMutAct_9fa48("1196") ? true : stryMutAct_9fa48("1195") ? classificacao : (stryCov_9fa48("1195", "1196", "1197"), !classificacao)) return stryMutAct_9fa48("1198") ? "" : (stryCov_9fa48("1198"), "não classificada nesta execução");
    if (stryMutAct_9fa48("1201") ? classificacao.estado !== "revisar" : stryMutAct_9fa48("1200") ? false : stryMutAct_9fa48("1199") ? true : (stryCov_9fa48("1199", "1200", "1201"), classificacao.estado === (stryMutAct_9fa48("1202") ? "" : (stryCov_9fa48("1202"), "revisar")))) {
      if (stryMutAct_9fa48("1203")) {
        {}
      } else {
        stryCov_9fa48("1203");
        return stryMutAct_9fa48("1204") ? `` : (stryCov_9fa48("1204"), `revisar: ${classificacao.categoria} (${classificacao.confianca})`);
      }
    }
    const motivo = classificacao.motivo ? stryMutAct_9fa48("1205") ? `` : (stryCov_9fa48("1205"), `: ${classificacao.motivo}`) : stryMutAct_9fa48("1206") ? "Stryker was here!" : (stryCov_9fa48("1206"), "");
    return stryMutAct_9fa48("1207") ? `` : (stryCov_9fa48("1207"), `sem classificação${motivo}`);
  }
}
function tabelaDeBarrados(barrados) {
  if (stryMutAct_9fa48("1208")) {
    {}
  } else {
    stryCov_9fa48("1208");
    return stryMutAct_9fa48("1209") ? [] : (stryCov_9fa48("1209"), [stryMutAct_9fa48("1210") ? "" : (stryCov_9fa48("1210"), "| Termo | Significado | Por quê | Fonte |"), stryMutAct_9fa48("1211") ? "" : (stryCov_9fa48("1211"), "|---|---|---|---|"), ...barrados.map(stryMutAct_9fa48("1212") ? () => undefined : (stryCov_9fa48("1212"), ({
      candidato,
      motivo
    }) => stryMutAct_9fa48("1213") ? `` : (stryCov_9fa48("1213"), `| ${celula(candidato.termo)} | ${celula(candidato.significado)} | ${celula(motivo)} | ${linkDaFonte(candidato)} |`)))]);
  }
}

// O que o filtro tirou fica no PR para uma pessoa conferir (ADR 0014).
function secoesDoFiltro(relatorio) {
  if (stryMutAct_9fa48("1214")) {
    {}
  } else {
    stryCov_9fa48("1214");
    const barrados = stryMutAct_9fa48("1215") ? relatorio.termos.barrados && [] : (stryCov_9fa48("1215"), relatorio.termos.barrados ?? (stryMutAct_9fa48("1216") ? ["Stryker was here"] : (stryCov_9fa48("1216"), [])));
    const recusadas = stryMutAct_9fa48("1217") ? relatorio.termos.alteracoes_recusadas && [] : (stryCov_9fa48("1217"), relatorio.termos.alteracoes_recusadas ?? (stryMutAct_9fa48("1218") ? ["Stryker was here"] : (stryCov_9fa48("1218"), [])));
    const peloLlm = stryMutAct_9fa48("1219") ? barrados : (stryCov_9fa48("1219"), barrados.filter(stryMutAct_9fa48("1220") ? () => undefined : (stryCov_9fa48("1220"), item => stryMutAct_9fa48("1223") ? item.origem !== "gemini" : stryMutAct_9fa48("1222") ? false : stryMutAct_9fa48("1221") ? true : (stryCov_9fa48("1221", "1222", "1223"), item.origem === (stryMutAct_9fa48("1224") ? "" : (stryCov_9fa48("1224"), "gemini"))))));
    const pelaLista = stryMutAct_9fa48("1225") ? barrados : (stryCov_9fa48("1225"), barrados.filter(stryMutAct_9fa48("1226") ? () => undefined : (stryCov_9fa48("1226"), item => stryMutAct_9fa48("1229") ? item.origem !== "lista" : stryMutAct_9fa48("1228") ? false : stryMutAct_9fa48("1227") ? true : (stryCov_9fa48("1227", "1228", "1229"), item.origem === (stryMutAct_9fa48("1230") ? "" : (stryCov_9fa48("1230"), "lista"))))));
    const linhas = stryMutAct_9fa48("1231") ? ["Stryker was here"] : (stryCov_9fa48("1231"), []);
    if (stryMutAct_9fa48("1235") ? peloLlm.length <= 0 : stryMutAct_9fa48("1234") ? peloLlm.length >= 0 : stryMutAct_9fa48("1233") ? false : stryMutAct_9fa48("1232") ? true : (stryCov_9fa48("1232", "1233", "1234", "1235"), peloLlm.length > 0)) {
      if (stryMutAct_9fa48("1236")) {
        {}
      } else {
        stryCov_9fa48("1236");
        linhas.push(stryMutAct_9fa48("1238") ? "Stryker was here!" : (stryCov_9fa48("1238"), ""), stryMutAct_9fa48("1239") ? `` : (stryCov_9fa48("1239"), `### Barrados pelo Gemini: confira cada um (${peloLlm.length})`), stryMutAct_9fa48("1240") ? "Stryker was here!" : (stryCov_9fa48("1240"), ""), stryMutAct_9fa48("1241") ? "" : (stryCov_9fa48("1241"), "Se algum for da universidade, ponha em `liberados` no `coleta/filtro-de-termos.json`. Se o Gemini acertou, ponha em `fora_do_escopo`."), stryMutAct_9fa48("1242") ? "Stryker was here!" : (stryCov_9fa48("1242"), ""), ...tabelaDeBarrados(peloLlm));
      }
    }
    if (stryMutAct_9fa48("1246") ? pelaLista.length <= 0 : stryMutAct_9fa48("1245") ? pelaLista.length >= 0 : stryMutAct_9fa48("1244") ? false : stryMutAct_9fa48("1243") ? true : (stryCov_9fa48("1243", "1244", "1245", "1246"), pelaLista.length > 0)) {
      if (stryMutAct_9fa48("1247")) {
        {}
      } else {
        stryCov_9fa48("1247");
        linhas.push(stryMutAct_9fa48("1249") ? "Stryker was here!" : (stryCov_9fa48("1249"), ""), stryMutAct_9fa48("1250") ? `` : (stryCov_9fa48("1250"), `### Barrados pela lista fixa (${pelaLista.length})`), stryMutAct_9fa48("1251") ? "Stryker was here!" : (stryCov_9fa48("1251"), ""), stryMutAct_9fa48("1252") ? "" : (stryCov_9fa48("1252"), "<details><summary>Ver a lista (regra em <code>coleta/filtro-de-termos.json</code>)</summary>"), stryMutAct_9fa48("1253") ? "Stryker was here!" : (stryCov_9fa48("1253"), ""), ...tabelaDeBarrados(pelaLista), stryMutAct_9fa48("1254") ? "Stryker was here!" : (stryCov_9fa48("1254"), ""), stryMutAct_9fa48("1255") ? "" : (stryCov_9fa48("1255"), "</details>"));
      }
    }
    if (stryMutAct_9fa48("1259") ? recusadas.length <= 0 : stryMutAct_9fa48("1258") ? recusadas.length >= 0 : stryMutAct_9fa48("1257") ? false : stryMutAct_9fa48("1256") ? true : (stryCov_9fa48("1256", "1257", "1258", "1259"), recusadas.length > 0)) {
      if (stryMutAct_9fa48("1260")) {
        {}
      } else {
        stryCov_9fa48("1260");
        linhas.push(stryMutAct_9fa48("1262") ? "Stryker was here!" : (stryCov_9fa48("1262"), ""), stryMutAct_9fa48("1263") ? `` : (stryCov_9fa48("1263"), `### Alterações recusadas (${recusadas.length})`), stryMutAct_9fa48("1264") ? "Stryker was here!" : (stryCov_9fa48("1264"), ""), stryMutAct_9fa48("1265") ? "" : (stryCov_9fa48("1265"), "A fonte propôs um texto, mas o termo publicado foi mantido."), stryMutAct_9fa48("1266") ? "Stryker was here!" : (stryCov_9fa48("1266"), ""), stryMutAct_9fa48("1267") ? "" : (stryCov_9fa48("1267"), "| Termo | A fonte propôs | Por que foi recusado |"), stryMutAct_9fa48("1268") ? "" : (stryCov_9fa48("1268"), "|---|---|---|"), ...recusadas.map(stryMutAct_9fa48("1269") ? () => undefined : (stryCov_9fa48("1269"), item => stryMutAct_9fa48("1270") ? `` : (stryCov_9fa48("1270"), `| ${celula(stryMutAct_9fa48("1271") ? item.candidato.termo : (stryCov_9fa48("1271"), item.candidato?.termo))} | ${celula(stryMutAct_9fa48("1273") ? item.mudancas.significado?.para : stryMutAct_9fa48("1272") ? item.mudancas?.significado.para : (stryCov_9fa48("1272", "1273"), item.mudancas?.significado?.para))} | ${celula(item.motivo_recusa)} |`))));
      }
    }
    return linhas;
  }
}
function significadoDoRegistro(situacao, registro) {
  if (stryMutAct_9fa48("1274")) {
    {}
  } else {
    stryCov_9fa48("1274");
    if (stryMutAct_9fa48("1277") ? situacao !== "Alterado" : stryMutAct_9fa48("1276") ? false : stryMutAct_9fa48("1275") ? true : (stryCov_9fa48("1275", "1276", "1277"), situacao === (stryMutAct_9fa48("1278") ? "" : (stryCov_9fa48("1278"), "Alterado")))) {
      if (stryMutAct_9fa48("1279")) {
        {}
      } else {
        stryCov_9fa48("1279");
        const mudanca = stryMutAct_9fa48("1280") ? registro.mudancas.significado : (stryCov_9fa48("1280"), registro.mudancas?.significado);
        if (stryMutAct_9fa48("1282") ? false : stryMutAct_9fa48("1281") ? true : (stryCov_9fa48("1281", "1282"), mudanca)) return stryMutAct_9fa48("1283") ? `` : (stryCov_9fa48("1283"), `${mudanca.de} → ${mudanca.para}`);
      }
    }
    return stryMutAct_9fa48("1284") ? registro.candidato?.significado && "" : (stryCov_9fa48("1284"), (stryMutAct_9fa48("1285") ? registro.candidato.significado : (stryCov_9fa48("1285"), registro.candidato?.significado)) ?? (stryMutAct_9fa48("1286") ? "Stryker was here!" : (stryCov_9fa48("1286"), "")));
  }
}
function detalheDoRegistro(situacao, registro) {
  if (stryMutAct_9fa48("1287")) {
    {}
  } else {
    stryCov_9fa48("1287");
    const partes = stryMutAct_9fa48("1288") ? ["Stryker was here"] : (stryCov_9fa48("1288"), []);
    if (stryMutAct_9fa48("1291") ? situacao === "Alterado" || registro.id : stryMutAct_9fa48("1290") ? false : stryMutAct_9fa48("1289") ? true : (stryCov_9fa48("1289", "1290", "1291"), (stryMutAct_9fa48("1293") ? situacao !== "Alterado" : stryMutAct_9fa48("1292") ? true : (stryCov_9fa48("1292", "1293"), situacao === (stryMutAct_9fa48("1294") ? "" : (stryCov_9fa48("1294"), "Alterado")))) && registro.id)) partes.push(stryMutAct_9fa48("1296") ? `` : (stryCov_9fa48("1296"), `id: ${registro.id}`));
    if (stryMutAct_9fa48("1299") ? situacao === "Conflito" || registro.id_existente : stryMutAct_9fa48("1298") ? false : stryMutAct_9fa48("1297") ? true : (stryCov_9fa48("1297", "1298", "1299"), (stryMutAct_9fa48("1301") ? situacao !== "Conflito" : stryMutAct_9fa48("1300") ? true : (stryCov_9fa48("1300", "1301"), situacao === (stryMutAct_9fa48("1302") ? "" : (stryCov_9fa48("1302"), "Conflito")))) && registro.id_existente)) partes.push(stryMutAct_9fa48("1304") ? `` : (stryCov_9fa48("1304"), `existente: ${registro.id_existente}`));
    if (stryMutAct_9fa48("1307") ? situacao !== "Novo" : stryMutAct_9fa48("1306") ? false : stryMutAct_9fa48("1305") ? true : (stryCov_9fa48("1305", "1306", "1307"), situacao === (stryMutAct_9fa48("1308") ? "" : (stryCov_9fa48("1308"), "Novo")))) {
      if (stryMutAct_9fa48("1309")) {
        {}
      } else {
        stryCov_9fa48("1309");
        partes.push(registro.adicionado ? stryMutAct_9fa48("1311") ? "" : (stryCov_9fa48("1311"), "incluído no termos.json") : stryMutAct_9fa48("1312") ? `` : (stryCov_9fa48("1312"), `não incluído no termos.json: ${stryMutAct_9fa48("1313") ? registro.motivo_adicao && "sem classificação revisável" : (stryCov_9fa48("1313"), registro.motivo_adicao ?? (stryMutAct_9fa48("1314") ? "" : (stryCov_9fa48("1314"), "sem classificação revisável")))}`));
      }
    }
    if (stryMutAct_9fa48("1316") ? false : stryMutAct_9fa48("1315") ? true : (stryCov_9fa48("1315", "1316"), registro.proposta_id)) partes.push(stryMutAct_9fa48("1318") ? `` : (stryCov_9fa48("1318"), `proposta: ${registro.proposta_id}`));
    if (stryMutAct_9fa48("1321") ? registro.tambem_em.length : stryMutAct_9fa48("1320") ? false : stryMutAct_9fa48("1319") ? true : (stryCov_9fa48("1319", "1320", "1321"), registro.tambem_em?.length)) partes.push(stryMutAct_9fa48("1323") ? `` : (stryCov_9fa48("1323"), `também em: ${registro.tambem_em.join(stryMutAct_9fa48("1324") ? "" : (stryCov_9fa48("1324"), ", "))}`));
    if (stryMutAct_9fa48("1325")) {
      ;
    } else {
      stryCov_9fa48("1325");
      partes.push(registro.motivo);
    }
    return partes.join(stryMutAct_9fa48("1326") ? "" : (stryCov_9fa48("1326"), "; "));
  }
}

// Quantos termos cada modelo respondeu: mostra no PR quando a rodada precisou do modelo reserva (decisão 48).
function contarModelos(classificados) {
  if (stryMutAct_9fa48("1327")) {
    {}
  } else {
    stryCov_9fa48("1327");
    const modelos = {};
    for (const {
      classificacao
    } of classificados) {
      if (stryMutAct_9fa48("1328")) {
        {}
      } else {
        stryCov_9fa48("1328");
        if (stryMutAct_9fa48("1331") ? classificacao?.estado === "revisar" || classificacao.modelo : stryMutAct_9fa48("1330") ? false : stryMutAct_9fa48("1329") ? true : (stryCov_9fa48("1329", "1330", "1331"), (stryMutAct_9fa48("1333") ? classificacao?.estado !== "revisar" : stryMutAct_9fa48("1332") ? true : (stryCov_9fa48("1332", "1333"), (stryMutAct_9fa48("1334") ? classificacao.estado : (stryCov_9fa48("1334"), classificacao?.estado)) === (stryMutAct_9fa48("1335") ? "" : (stryCov_9fa48("1335"), "revisar")))) && classificacao.modelo)) {
          if (stryMutAct_9fa48("1336")) {
            {}
          } else {
            stryCov_9fa48("1336");
            modelos[classificacao.modelo] = stryMutAct_9fa48("1337") ? (modelos[classificacao.modelo] ?? 0) - 1 : (stryCov_9fa48("1337"), (stryMutAct_9fa48("1338") ? modelos[classificacao.modelo] && 0 : (stryCov_9fa48("1338"), modelos[classificacao.modelo] ?? 0)) + 1);
          }
        }
      }
    }
    return modelos;
  }
}
export function montarRelatorio({
  coletadoEm,
  geradoEm = new Date().toISOString(),
  porFonte = {},
  erros = stryMutAct_9fa48("1339") ? ["Stryker was here"] : (stryCov_9fa48("1339"), []),
  classificados = stryMutAct_9fa48("1340") ? ["Stryker was here"] : (stryCov_9fa48("1340"), []),
  resultado,
  totalDeCandidatos = classificados.length
}) {
  if (stryMutAct_9fa48("1341")) {
    {}
  } else {
    stryCov_9fa48("1341");
    const totais = stryMutAct_9fa48("1342") ? {} : (stryCov_9fa48("1342"), {
      candidatos: totalDeCandidatos,
      novos: resultado.novos.length,
      alterados: resultado.alterados.length,
      conflitos: resultado.conflitos.length,
      iguais: resultado.iguais.length,
      descartados: resultado.descartados.length,
      barrados: (stryMutAct_9fa48("1343") ? resultado.barrados && [] : (stryCov_9fa48("1343"), resultado.barrados ?? (stryMutAct_9fa48("1344") ? ["Stryker was here"] : (stryCov_9fa48("1344"), [])))).length,
      alteracoes_recusadas: (stryMutAct_9fa48("1345") ? resultado.alteracoes_recusadas && [] : (stryCov_9fa48("1345"), resultado.alteracoes_recusadas ?? (stryMutAct_9fa48("1346") ? ["Stryker was here"] : (stryCov_9fa48("1346"), [])))).length
    });
    const contabilizados = stryMutAct_9fa48("1347") ? totais.novos + totais.alterados + totais.conflitos + totais.iguais + totais.descartados + totais.barrados - totais.alteracoes_recusadas : (stryCov_9fa48("1347"), (stryMutAct_9fa48("1348") ? totais.novos + totais.alterados + totais.conflitos + totais.iguais + totais.descartados - totais.barrados : (stryCov_9fa48("1348"), (stryMutAct_9fa48("1349") ? totais.novos + totais.alterados + totais.conflitos + totais.iguais - totais.descartados : (stryCov_9fa48("1349"), (stryMutAct_9fa48("1350") ? totais.novos + totais.alterados + totais.conflitos - totais.iguais : (stryCov_9fa48("1350"), (stryMutAct_9fa48("1351") ? totais.novos + totais.alterados - totais.conflitos : (stryCov_9fa48("1351"), (stryMutAct_9fa48("1352") ? totais.novos - totais.alterados : (stryCov_9fa48("1352"), totais.novos + totais.alterados)) + totais.conflitos)) + totais.iguais)) + totais.descartados)) + totais.barrados)) + totais.alteracoes_recusadas);
    return stryMutAct_9fa48("1353") ? {} : (stryCov_9fa48("1353"), {
      coletado_em: coletadoEm,
      gerado_em: geradoEm,
      totais: stryMutAct_9fa48("1354") ? {} : (stryCov_9fa48("1354"), {
        ...totais,
        duplicados: stryMutAct_9fa48("1355") ? Math.min(0, totais.candidatos - contabilizados) : (stryCov_9fa48("1355"), Math.max(0, stryMutAct_9fa48("1356") ? totais.candidatos + contabilizados : (stryCov_9fa48("1356"), totais.candidatos - contabilizados))),
        mudancas: stryMutAct_9fa48("1357") ? totais.novos + totais.alterados - totais.conflitos : (stryCov_9fa48("1357"), (stryMutAct_9fa48("1358") ? totais.novos - totais.alterados : (stryCov_9fa48("1358"), totais.novos + totais.alterados)) + totais.conflitos)
      }),
      por_fonte: stryMutAct_9fa48("1359") ? {} : (stryCov_9fa48("1359"), {
        ...porFonte
      }),
      classificacao: resumirClassificacao(classificados),
      modelos: contarModelos(classificados),
      erros: stryMutAct_9fa48("1360") ? [] : (stryCov_9fa48("1360"), [...erros]),
      termos: stryMutAct_9fa48("1361") ? {} : (stryCov_9fa48("1361"), {
        novos: resultado.novos,
        alterados: resultado.alterados,
        conflitos: resultado.conflitos,
        barrados: stryMutAct_9fa48("1362") ? resultado.barrados && [] : (stryCov_9fa48("1362"), resultado.barrados ?? (stryMutAct_9fa48("1363") ? ["Stryker was here"] : (stryCov_9fa48("1363"), []))),
        alteracoes_recusadas: stryMutAct_9fa48("1364") ? resultado.alteracoes_recusadas && [] : (stryCov_9fa48("1364"), resultado.alteracoes_recusadas ?? (stryMutAct_9fa48("1365") ? ["Stryker was here"] : (stryCov_9fa48("1365"), [])))
      })
    });
  }
}
export function temMudancas(relatorio) {
  if (stryMutAct_9fa48("1366")) {
    {}
  } else {
    stryCov_9fa48("1366");
    return stryMutAct_9fa48("1370") ? (relatorio?.totais?.mudancas ?? 0) <= 0 : stryMutAct_9fa48("1369") ? (relatorio?.totais?.mudancas ?? 0) >= 0 : stryMutAct_9fa48("1368") ? false : stryMutAct_9fa48("1367") ? true : (stryCov_9fa48("1367", "1368", "1369", "1370"), (stryMutAct_9fa48("1371") ? relatorio?.totais?.mudancas && 0 : (stryCov_9fa48("1371"), (stryMutAct_9fa48("1373") ? relatorio.totais?.mudancas : stryMutAct_9fa48("1372") ? relatorio?.totais.mudancas : (stryCov_9fa48("1372", "1373"), relatorio?.totais?.mudancas)) ?? 0)) > 0);
  }
}

// O conteúdo do relatório sem as datas, inclusive a de cada termo: elas mudam em toda execução e não são uma
// mudança de verdade.
export function relatorioSemData(relatorio) {
  if (stryMutAct_9fa48("1374")) {
    {}
  } else {
    stryCov_9fa48("1374");
    const semDatas = stryMutAct_9fa48("1375") ? () => undefined : (stryCov_9fa48("1375"), (() => {
      const semDatas = (campo, valor) => (stryMutAct_9fa48("1378") ? campo === "coletado_em" && campo === "gerado_em" : stryMutAct_9fa48("1377") ? false : stryMutAct_9fa48("1376") ? true : (stryCov_9fa48("1376", "1377", "1378"), (stryMutAct_9fa48("1380") ? campo !== "coletado_em" : stryMutAct_9fa48("1379") ? false : (stryCov_9fa48("1379", "1380"), campo === (stryMutAct_9fa48("1381") ? "" : (stryCov_9fa48("1381"), "coletado_em")))) || (stryMutAct_9fa48("1383") ? campo !== "gerado_em" : stryMutAct_9fa48("1382") ? false : (stryCov_9fa48("1382", "1383"), campo === (stryMutAct_9fa48("1384") ? "" : (stryCov_9fa48("1384"), "gerado_em")))))) ? undefined : valor;
      return semDatas;
    })());
    return JSON.parse(JSON.stringify(stryMutAct_9fa48("1385") ? relatorio && {} : (stryCov_9fa48("1385"), relatorio ?? {}), semDatas));
  }
}

// Mudou em relação ao relatório que já está no repositório? Sem relatório anterior, conta como mudança.
export function relatorioMudou(novo, anterior) {
  if (stryMutAct_9fa48("1386")) {
    {}
  } else {
    stryCov_9fa48("1386");
    if (stryMutAct_9fa48("1389") ? false : stryMutAct_9fa48("1388") ? true : stryMutAct_9fa48("1387") ? anterior : (stryCov_9fa48("1387", "1388", "1389"), !anterior)) return stryMutAct_9fa48("1390") ? false : (stryCov_9fa48("1390"), true);
    return stryMutAct_9fa48("1393") ? JSON.stringify(relatorioSemData(novo)) === JSON.stringify(relatorioSemData(anterior)) : stryMutAct_9fa48("1392") ? false : stryMutAct_9fa48("1391") ? true : (stryCov_9fa48("1391", "1392", "1393"), JSON.stringify(relatorioSemData(novo)) !== JSON.stringify(relatorioSemData(anterior)));
  }
}
export function gerarCorpoDoPr(relatorio, {
  limite = LIMITE_DE_LINHAS_NO_PR
} = {}) {
  if (stryMutAct_9fa48("1394")) {
    {}
  } else {
    stryCov_9fa48("1394");
    const {
      totais,
      classificacao,
      erros
    } = relatorio;
    const linhas = stryMutAct_9fa48("1395") ? [] : (stryCov_9fa48("1395"), [stryMutAct_9fa48("1396") ? `` : (stryCov_9fa48("1396"), `## Coleta automática de termos — ${relatorio.coletado_em}`), stryMutAct_9fa48("1397") ? "Stryker was here!" : (stryCov_9fa48("1397"), ""), (stryMutAct_9fa48("1398") ? `` : (stryCov_9fa48("1398"), `**Resumo:** ${totais.candidatos} candidato(s), ${totais.novos} novo(s), ${totais.alterados} `)) + (stryMutAct_9fa48("1399") ? `` : (stryCov_9fa48("1399"), `alterado(s), ${totais.conflitos} conflito(s), ${totais.iguais} igual(is), ${totais.descartados} `)) + (stryMutAct_9fa48("1400") ? `` : (stryCov_9fa48("1400"), `descartado(s), ${totais.duplicados} duplicado(s).`)), stryMutAct_9fa48("1401") ? "Stryker was here!" : (stryCov_9fa48("1401"), ""), stryMutAct_9fa48("1402") ? "" : (stryCov_9fa48("1402"), "### Totais por fonte"), stryMutAct_9fa48("1403") ? "Stryker was here!" : (stryCov_9fa48("1403"), ""), stryMutAct_9fa48("1404") ? "" : (stryCov_9fa48("1404"), "| Fonte | Candidatos |"), stryMutAct_9fa48("1405") ? "" : (stryCov_9fa48("1405"), "|---|---:|"), ...Object.entries(relatorio.por_fonte).map(stryMutAct_9fa48("1406") ? () => undefined : (stryCov_9fa48("1406"), ([fonte, total]) => stryMutAct_9fa48("1407") ? `` : (stryCov_9fa48("1407"), `| ${celula(fonte)} | ${total} |`))), stryMutAct_9fa48("1408") ? "Stryker was here!" : (stryCov_9fa48("1408"), ""), stryMutAct_9fa48("1409") ? "" : (stryCov_9fa48("1409"), "### Classificação dos termos novos"), stryMutAct_9fa48("1410") ? "Stryker was here!" : (stryCov_9fa48("1410"), ""), stryMutAct_9fa48("1411") ? `` : (stryCov_9fa48("1411"), `- Para revisar: ${classificacao.revisar}`), stryMutAct_9fa48("1412") ? `` : (stryCov_9fa48("1412"), `- Sem classificação: ${classificacao.sem_classificacao}`), ...((stryMutAct_9fa48("1416") ? Object.keys(relatorio.modelos ?? {}).length <= 0 : stryMutAct_9fa48("1415") ? Object.keys(relatorio.modelos ?? {}).length >= 0 : stryMutAct_9fa48("1414") ? false : stryMutAct_9fa48("1413") ? true : (stryCov_9fa48("1413", "1414", "1415", "1416"), Object.keys(stryMutAct_9fa48("1417") ? relatorio.modelos && {} : (stryCov_9fa48("1417"), relatorio.modelos ?? {})).length > 0)) ? stryMutAct_9fa48("1418") ? [] : (stryCov_9fa48("1418"), [stryMutAct_9fa48("1419") ? `` : (stryCov_9fa48("1419"), `- Modelos que responderam: ${Object.entries(relatorio.modelos).map(stryMutAct_9fa48("1420") ? () => undefined : (stryCov_9fa48("1420"), ([m, n]) => stryMutAct_9fa48("1421") ? `` : (stryCov_9fa48("1421"), `${celula(m)} (${n})`))).join(stryMutAct_9fa48("1422") ? "" : (stryCov_9fa48("1422"), ", "))}`)]) : stryMutAct_9fa48("1423") ? ["Stryker was here"] : (stryCov_9fa48("1423"), [])), ...Object.entries(classificacao.motivos).map(stryMutAct_9fa48("1424") ? () => undefined : (stryCov_9fa48("1424"), ([motivo, total]) => stryMutAct_9fa48("1425") ? `` : (stryCov_9fa48("1425"), `  - ${celula(motivo)}: ${total}`)))]);
    if (stryMutAct_9fa48("1429") ? erros.length <= 0 : stryMutAct_9fa48("1428") ? erros.length >= 0 : stryMutAct_9fa48("1427") ? false : stryMutAct_9fa48("1426") ? true : (stryCov_9fa48("1426", "1427", "1428", "1429"), erros.length > 0)) {
      if (stryMutAct_9fa48("1430")) {
        {}
      } else {
        stryCov_9fa48("1430");
        linhas.push(stryMutAct_9fa48("1432") ? "Stryker was here!" : (stryCov_9fa48("1432"), ""), stryMutAct_9fa48("1433") ? "" : (stryCov_9fa48("1433"), "### Avisos"), stryMutAct_9fa48("1434") ? "Stryker was here!" : (stryCov_9fa48("1434"), ""), ...erros.map(stryMutAct_9fa48("1435") ? () => undefined : (stryCov_9fa48("1435"), erro => stryMutAct_9fa48("1436") ? `` : (stryCov_9fa48("1436"), `- ${celula(erro)}`))));
      }
    }
    const grupos = stryMutAct_9fa48("1437") ? [] : (stryCov_9fa48("1437"), [stryMutAct_9fa48("1438") ? [] : (stryCov_9fa48("1438"), [stryMutAct_9fa48("1439") ? "" : (stryCov_9fa48("1439"), "Novo"), relatorio.termos.novos]), stryMutAct_9fa48("1440") ? [] : (stryCov_9fa48("1440"), [stryMutAct_9fa48("1441") ? "" : (stryCov_9fa48("1441"), "Alterado"), relatorio.termos.alterados]), stryMutAct_9fa48("1442") ? [] : (stryCov_9fa48("1442"), [stryMutAct_9fa48("1443") ? "" : (stryCov_9fa48("1443"), "Conflito"), relatorio.termos.conflitos])]);
    const total = grupos.reduce(stryMutAct_9fa48("1444") ? () => undefined : (stryCov_9fa48("1444"), (soma, [, registros]) => stryMutAct_9fa48("1445") ? soma - registros.length : (stryCov_9fa48("1445"), soma + registros.length)), 0);
    linhas.push(stryMutAct_9fa48("1447") ? "Stryker was here!" : (stryCov_9fa48("1447"), ""), stryMutAct_9fa48("1448") ? "" : (stryCov_9fa48("1448"), "### Termos para revisão"), stryMutAct_9fa48("1449") ? "Stryker was here!" : (stryCov_9fa48("1449"), ""));
    if (stryMutAct_9fa48("1452") ? total !== 0 : stryMutAct_9fa48("1451") ? false : stryMutAct_9fa48("1450") ? true : (stryCov_9fa48("1450", "1451", "1452"), total === 0)) {
      if (stryMutAct_9fa48("1453")) {
        {}
      } else {
        stryCov_9fa48("1453");
        linhas.push(stryMutAct_9fa48("1455") ? "" : (stryCov_9fa48("1455"), "Nenhuma mudança de termo."));
      }
    } else {
      if (stryMutAct_9fa48("1456")) {
        {}
      } else {
        stryCov_9fa48("1456");
        linhas.push(stryMutAct_9fa48("1458") ? "" : (stryCov_9fa48("1458"), "| Situação | Termo | Significado | Fonte | LLM | Detalhe |"), stryMutAct_9fa48("1459") ? "" : (stryCov_9fa48("1459"), "|---|---|---|---|---|---|"));
        let mostrados = 0;
        for (const [situacao, registros] of grupos) {
          if (stryMutAct_9fa48("1460")) {
            {}
          } else {
            stryCov_9fa48("1460");
            for (const registro of registros) {
              if (stryMutAct_9fa48("1461")) {
                {}
              } else {
                stryCov_9fa48("1461");
                if (stryMutAct_9fa48("1465") ? mostrados < limite : stryMutAct_9fa48("1464") ? mostrados > limite : stryMutAct_9fa48("1463") ? false : stryMutAct_9fa48("1462") ? true : (stryCov_9fa48("1462", "1463", "1464", "1465"), mostrados >= limite)) break;
                const candidato = stryMutAct_9fa48("1466") ? registro.candidato && {} : (stryCov_9fa48("1466"), registro.candidato ?? {});
                linhas.push((stryMutAct_9fa48("1468") ? `` : (stryCov_9fa48("1468"), `| ${situacao} | ${celula(candidato.termo)} | ${celula(significadoDoRegistro(situacao, registro))} | `)) + (stryMutAct_9fa48("1469") ? `` : (stryCov_9fa48("1469"), `${linkDaFonte(candidato, registro.tambem_em)} | ${celula(classificacaoDoCandidato(candidato))} | `)) + (stryMutAct_9fa48("1470") ? `` : (stryCov_9fa48("1470"), `${celula(detalheDoRegistro(situacao, registro))} |`)));
                stryMutAct_9fa48("1471") ? mostrados -= 1 : (stryCov_9fa48("1471"), mostrados += 1);
              }
            }
            if (stryMutAct_9fa48("1475") ? mostrados < limite : stryMutAct_9fa48("1474") ? mostrados > limite : stryMutAct_9fa48("1473") ? false : stryMutAct_9fa48("1472") ? true : (stryCov_9fa48("1472", "1473", "1474", "1475"), mostrados >= limite)) break;
          }
        }
        if (stryMutAct_9fa48("1479") ? mostrados >= total : stryMutAct_9fa48("1478") ? mostrados <= total : stryMutAct_9fa48("1477") ? false : stryMutAct_9fa48("1476") ? true : (stryCov_9fa48("1476", "1477", "1478", "1479"), mostrados < total)) {
          if (stryMutAct_9fa48("1480")) {
            {}
          } else {
            stryCov_9fa48("1480");
            linhas.push(stryMutAct_9fa48("1482") ? "Stryker was here!" : (stryCov_9fa48("1482"), ""), stryMutAct_9fa48("1483") ? `` : (stryCov_9fa48("1483"), `Mostrando ${mostrados} de ${total} termo(s); o restante está em \`coleta/relatorio.json\`.`));
          }
        }
      }
    }
    if (stryMutAct_9fa48("1484")) {
      ;
    } else {
      stryCov_9fa48("1484");
      linhas.push(...secoesDoFiltro(relatorio));
    }
    linhas.push(stryMutAct_9fa48("1486") ? "Stryker was here!" : (stryCov_9fa48("1486"), ""), (stryMutAct_9fa48("1487") ? "" : (stryCov_9fa48("1487"), "> O robô atualiza `frontend/data/termos.json` com o significado das alterações e com termos novos ")) + (stryMutAct_9fa48("1488") ? "" : (stryCov_9fa48("1488"), "que tenham classificação revisável. A definição e o exemplo dos termos novos são rascunhos do LLM ")) + (stryMutAct_9fa48("1489") ? "" : (stryCov_9fa48("1489"), "e precisam ser conferidos na revisão humana. O robô nunca faz merge.")));
    return stryMutAct_9fa48("1490") ? `` : (stryCov_9fa48("1490"), `${linhas.join(stryMutAct_9fa48("1491") ? "" : (stryCov_9fa48("1491"), "\n"))}\n`);
  }
}