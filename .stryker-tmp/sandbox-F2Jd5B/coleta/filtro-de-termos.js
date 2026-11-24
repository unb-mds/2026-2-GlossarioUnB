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
import { FORA_DO_ESCOPO, REVISAR } from "./classificador.js";
import { chave } from "./deduplicar.js";

// Filtro de pertinência do robô (ADR 0014), em três camadas: a lista fixa barra o que já se sabe que não é da
// universidade, o LLM avalia o resto e uma pessoa confere tudo no PR. Funções puras: quem lê o arquivo é o script.

const FORMATO_DA_CHAVE = stryMutAct_9fa48("800") ? /^[^a-z0-9]+$/ : stryMutAct_9fa48("799") ? /^[a-z0-9]$/ : stryMutAct_9fa48("798") ? /^[a-z0-9]+/ : stryMutAct_9fa48("797") ? /[a-z0-9]+$/ : (stryCov_9fa48("797", "798", "799", "800"), /^[a-z0-9]+$/);
const FORMATO_DO_ID = stryMutAct_9fa48("807") ? /^[a-z0-9]+(-[^a-z0-9]+)*$/ : stryMutAct_9fa48("806") ? /^[a-z0-9]+(-[a-z0-9])*$/ : stryMutAct_9fa48("805") ? /^[a-z0-9]+(-[a-z0-9]+)$/ : stryMutAct_9fa48("804") ? /^[^a-z0-9]+(-[a-z0-9]+)*$/ : stryMutAct_9fa48("803") ? /^[a-z0-9](-[a-z0-9]+)*$/ : stryMutAct_9fa48("802") ? /^[a-z0-9]+(-[a-z0-9]+)*/ : stryMutAct_9fa48("801") ? /[a-z0-9]+(-[a-z0-9]+)*$/ : (stryCov_9fa48("801", "802", "803", "804", "805", "806", "807"), /^[a-z0-9]+(-[a-z0-9]+)*$/);
const SECOES = stryMutAct_9fa48("808") ? [] : (stryCov_9fa48("808"), [stryMutAct_9fa48("809") ? [] : (stryCov_9fa48("809"), [stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), "fora_do_escopo"), FORMATO_DA_CHAVE]), stryMutAct_9fa48("811") ? [] : (stryCov_9fa48("811"), [stryMutAct_9fa48("812") ? "" : (stryCov_9fa48("812"), "liberados"), FORMATO_DA_CHAVE]), stryMutAct_9fa48("813") ? [] : (stryCov_9fa48("813"), [stryMutAct_9fa48("814") ? "" : (stryCov_9fa48("814"), "alteracoes_recusadas"), FORMATO_DO_ID])]);
const ehObjeto = stryMutAct_9fa48("815") ? () => undefined : (stryCov_9fa48("815"), (() => {
  const ehObjeto = valor => stryMutAct_9fa48("818") ? valor !== null && typeof valor === "object" || !Array.isArray(valor) : stryMutAct_9fa48("817") ? false : stryMutAct_9fa48("816") ? true : (stryCov_9fa48("816", "817", "818"), (stryMutAct_9fa48("820") ? valor !== null || typeof valor === "object" : stryMutAct_9fa48("819") ? true : (stryCov_9fa48("819", "820"), (stryMutAct_9fa48("822") ? valor === null : stryMutAct_9fa48("821") ? true : (stryCov_9fa48("821", "822"), valor !== null)) && (stryMutAct_9fa48("824") ? typeof valor !== "object" : stryMutAct_9fa48("823") ? true : (stryCov_9fa48("823", "824"), typeof valor === (stryMutAct_9fa48("825") ? "" : (stryCov_9fa48("825"), "object")))))) && (stryMutAct_9fa48("826") ? Array.isArray(valor) : (stryCov_9fa48("826"), !Array.isArray(valor))));
  return ehObjeto;
})());
export function validarFiltro(filtro) {
  if (stryMutAct_9fa48("827")) {
    {}
  } else {
    stryCov_9fa48("827");
    const erros = stryMutAct_9fa48("828") ? ["Stryker was here"] : (stryCov_9fa48("828"), []);
    for (const [secao, formato] of SECOES) {
      if (stryMutAct_9fa48("829")) {
        {}
      } else {
        stryCov_9fa48("829");
        if (stryMutAct_9fa48("832") ? false : stryMutAct_9fa48("831") ? true : stryMutAct_9fa48("830") ? ehObjeto(filtro?.[secao]) : (stryCov_9fa48("830", "831", "832"), !ehObjeto(stryMutAct_9fa48("833") ? filtro[secao] : (stryCov_9fa48("833"), filtro?.[secao])))) {
          if (stryMutAct_9fa48("834")) {
            {}
          } else {
            stryCov_9fa48("834");
            erros.push(stryMutAct_9fa48("836") ? `` : (stryCov_9fa48("836"), `o filtro precisa da seção ${secao}`));
            continue;
          }
        }
        for (const [id, motivo] of Object.entries(filtro[secao])) {
          if (stryMutAct_9fa48("837")) {
            {}
          } else {
            stryCov_9fa48("837");
            if (stryMutAct_9fa48("840") ? false : stryMutAct_9fa48("839") ? true : stryMutAct_9fa48("838") ? formato.test(id) : (stryCov_9fa48("838", "839", "840"), !formato.test(id))) erros.push(stryMutAct_9fa48("842") ? `` : (stryCov_9fa48("842"), `${secao}: a chave "${id}" está fora do formato`));
            if (stryMutAct_9fa48("845") ? typeof motivo !== "string" && motivo.trim() === "" : stryMutAct_9fa48("844") ? false : stryMutAct_9fa48("843") ? true : (stryCov_9fa48("843", "844", "845"), (stryMutAct_9fa48("847") ? typeof motivo === "string" : stryMutAct_9fa48("846") ? false : (stryCov_9fa48("846", "847"), typeof motivo !== (stryMutAct_9fa48("848") ? "" : (stryCov_9fa48("848"), "string")))) || (stryMutAct_9fa48("850") ? motivo.trim() !== "" : stryMutAct_9fa48("849") ? false : (stryCov_9fa48("849", "850"), (stryMutAct_9fa48("851") ? motivo : (stryCov_9fa48("851"), motivo.trim())) === (stryMutAct_9fa48("852") ? "Stryker was here!" : (stryCov_9fa48("852"), "")))))) erros.push(stryMutAct_9fa48("854") ? `` : (stryCov_9fa48("854"), `${secao}: "${id}" está sem motivo`));
          }
        }
      }
    }
    if (stryMutAct_9fa48("858") ? erros.length <= 0 : stryMutAct_9fa48("857") ? erros.length >= 0 : stryMutAct_9fa48("856") ? false : stryMutAct_9fa48("855") ? true : (stryCov_9fa48("855", "856", "857", "858"), erros.length > 0)) return erros;
    for (const id of Object.keys(filtro.liberados)) {
      if (stryMutAct_9fa48("859")) {
        {}
      } else {
        stryCov_9fa48("859");
        if (stryMutAct_9fa48("861") ? false : stryMutAct_9fa48("860") ? true : (stryCov_9fa48("860", "861"), Object.hasOwn(filtro.fora_do_escopo, id))) erros.push(stryMutAct_9fa48("863") ? `` : (stryCov_9fa48("863"), `"${id}" está ao mesmo tempo em fora_do_escopo e em liberados`));
      }
    }
    return erros;
  }
}
const barrado = stryMutAct_9fa48("864") ? () => undefined : (stryCov_9fa48("864"), (() => {
  const barrado = (registro, motivo, origem) => stryMutAct_9fa48("865") ? {} : (stryCov_9fa48("865"), {
    candidato: registro.candidato,
    proposta_id: registro.proposta_id,
    motivo,
    origem
  });
  return barrado;
})());

// A recusa do LLM vale enquanto o significado na fonte for o mesmo: assim o termo não gasta chamada toda semana,
// e uma resposta diferente do LLM não abre um PR sem que nada tenha mudado nas fontes.
function recusaAnterior(registro, barradosAntes) {
  if (stryMutAct_9fa48("866")) {
    {}
  } else {
    stryCov_9fa48("866");
    const id = chave(registro.candidato.termo);
    return barradosAntes.find(stryMutAct_9fa48("867") ? () => undefined : (stryCov_9fa48("867"), item => stryMutAct_9fa48("870") ? item.origem === "gemini" && chave(item.candidato?.termo ?? "") === id || item.candidato?.significado === registro.candidato.significado : stryMutAct_9fa48("869") ? false : stryMutAct_9fa48("868") ? true : (stryCov_9fa48("868", "869", "870"), (stryMutAct_9fa48("872") ? item.origem === "gemini" || chave(item.candidato?.termo ?? "") === id : stryMutAct_9fa48("871") ? true : (stryCov_9fa48("871", "872"), (stryMutAct_9fa48("874") ? item.origem !== "gemini" : stryMutAct_9fa48("873") ? true : (stryCov_9fa48("873", "874"), item.origem === (stryMutAct_9fa48("875") ? "" : (stryCov_9fa48("875"), "gemini")))) && (stryMutAct_9fa48("877") ? chave(item.candidato?.termo ?? "") !== id : stryMutAct_9fa48("876") ? true : (stryCov_9fa48("876", "877"), chave(stryMutAct_9fa48("878") ? item.candidato?.termo && "" : (stryCov_9fa48("878"), (stryMutAct_9fa48("879") ? item.candidato.termo : (stryCov_9fa48("879"), item.candidato?.termo)) ?? (stryMutAct_9fa48("880") ? "Stryker was here!" : (stryCov_9fa48("880"), "")))) === id)))) && (stryMutAct_9fa48("882") ? item.candidato?.significado !== registro.candidato.significado : stryMutAct_9fa48("881") ? true : (stryCov_9fa48("881", "882"), (stryMutAct_9fa48("883") ? item.candidato.significado : (stryCov_9fa48("883"), item.candidato?.significado)) === registro.candidato.significado)))));
  }
}

// Roda antes do LLM. Devolve um resultado novo, com `barrados` e `alteracoes_recusadas`.
export function aplicarFiltro(resultado, filtro, {
  barradosAntes = stryMutAct_9fa48("884") ? ["Stryker was here"] : (stryCov_9fa48("884"), [])
} = {}) {
  if (stryMutAct_9fa48("885")) {
    {}
  } else {
    stryCov_9fa48("885");
    const novos = stryMutAct_9fa48("886") ? ["Stryker was here"] : (stryCov_9fa48("886"), []);
    const barrados = stryMutAct_9fa48("887") ? ["Stryker was here"] : (stryCov_9fa48("887"), []);
    for (const registro of resultado.novos) {
      if (stryMutAct_9fa48("888")) {
        {}
      } else {
        stryCov_9fa48("888");
        const id = chave(registro.candidato.termo);
        if (stryMutAct_9fa48("890") ? false : stryMutAct_9fa48("889") ? true : (stryCov_9fa48("889", "890"), Object.hasOwn(filtro.liberados, id))) {
          if (stryMutAct_9fa48("891")) {
            {}
          } else {
            stryCov_9fa48("891");
            if (stryMutAct_9fa48("892")) {
              ;
            } else {
              stryCov_9fa48("892");
              novos.push(registro);
            }
          }
        } else if (stryMutAct_9fa48("894") ? false : stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893", "894"), Object.hasOwn(filtro.fora_do_escopo, id))) {
          if (stryMutAct_9fa48("895")) {
            {}
          } else {
            stryCov_9fa48("895");
            barrados.push(barrado(registro, filtro.fora_do_escopo[id], stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), "lista")));
          }
        } else {
          if (stryMutAct_9fa48("898")) {
            {}
          } else {
            stryCov_9fa48("898");
            const anterior = recusaAnterior(registro, barradosAntes);
            if (stryMutAct_9fa48("900") ? false : stryMutAct_9fa48("899") ? true : (stryCov_9fa48("899", "900"), anterior)) barrados.push(barrado(registro, anterior.motivo, stryMutAct_9fa48("902") ? "" : (stryCov_9fa48("902"), "gemini")));else if (stryMutAct_9fa48("903")) {
              ;
            } else {
              stryCov_9fa48("903");
              novos.push(registro);
            }
          }
        }
      }
    }
    const alterados = stryMutAct_9fa48("904") ? ["Stryker was here"] : (stryCov_9fa48("904"), []);
    const alteracoesRecusadas = stryMutAct_9fa48("905") ? ["Stryker was here"] : (stryCov_9fa48("905"), []);
    for (const registro of resultado.alterados) {
      if (stryMutAct_9fa48("906")) {
        {}
      } else {
        stryCov_9fa48("906");
        if (stryMutAct_9fa48("908") ? false : stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907", "908"), Object.hasOwn(filtro.alteracoes_recusadas, registro.id))) {
          if (stryMutAct_9fa48("909")) {
            {}
          } else {
            stryCov_9fa48("909");
            alteracoesRecusadas.push(stryMutAct_9fa48("911") ? {} : (stryCov_9fa48("911"), {
              ...registro,
              motivo_recusa: filtro.alteracoes_recusadas[registro.id]
            }));
          }
        } else {
          if (stryMutAct_9fa48("912")) {
            {}
          } else {
            stryCov_9fa48("912");
            if (stryMutAct_9fa48("913")) {
              ;
            } else {
              stryCov_9fa48("913");
              alterados.push(registro);
            }
          }
        }
      }
    }
    return stryMutAct_9fa48("914") ? {} : (stryCov_9fa48("914"), {
      ...resultado,
      novos,
      alterados,
      barrados,
      alteracoes_recusadas: alteracoesRecusadas
    });
  }
}

// Roda depois do LLM. O que uma pessoa liberou volta para a revisão, mesmo que o LLM tenha recusado.
export function separarForaDoEscopo(resultado, filtro) {
  if (stryMutAct_9fa48("915")) {
    {}
  } else {
    stryCov_9fa48("915");
    const novos = stryMutAct_9fa48("916") ? ["Stryker was here"] : (stryCov_9fa48("916"), []);
    const barrados = stryMutAct_9fa48("917") ? [] : (stryCov_9fa48("917"), [...(stryMutAct_9fa48("918") ? resultado.barrados && [] : (stryCov_9fa48("918"), resultado.barrados ?? (stryMutAct_9fa48("919") ? ["Stryker was here"] : (stryCov_9fa48("919"), []))))]);
    for (const registro of resultado.novos) {
      if (stryMutAct_9fa48("920")) {
        {}
      } else {
        stryCov_9fa48("920");
        const classificacao = registro.candidato.classificacao;
        if (stryMutAct_9fa48("923") ? classificacao?.estado === FORA_DO_ESCOPO : stryMutAct_9fa48("922") ? false : stryMutAct_9fa48("921") ? true : (stryCov_9fa48("921", "922", "923"), (stryMutAct_9fa48("924") ? classificacao.estado : (stryCov_9fa48("924"), classificacao?.estado)) !== FORA_DO_ESCOPO)) {
          if (stryMutAct_9fa48("925")) {
            {}
          } else {
            stryCov_9fa48("925");
            if (stryMutAct_9fa48("926")) {
              ;
            } else {
              stryCov_9fa48("926");
              novos.push(registro);
            }
          }
        } else if (stryMutAct_9fa48("928") ? false : stryMutAct_9fa48("927") ? true : (stryCov_9fa48("927", "928"), Object.hasOwn(filtro.liberados, chave(registro.candidato.termo)))) {
          if (stryMutAct_9fa48("929")) {
            {}
          } else {
            stryCov_9fa48("929");
            const {
              motivo: _motivo,
              ...resto
            } = classificacao;
            novos.push(stryMutAct_9fa48("931") ? {} : (stryCov_9fa48("931"), {
              ...registro,
              candidato: stryMutAct_9fa48("932") ? {} : (stryCov_9fa48("932"), {
                ...registro.candidato,
                classificacao: stryMutAct_9fa48("933") ? {} : (stryCov_9fa48("933"), {
                  ...resto,
                  estado: REVISAR
                })
              })
            }));
          }
        } else {
          if (stryMutAct_9fa48("934")) {
            {}
          } else {
            stryCov_9fa48("934");
            barrados.push(barrado(registro, classificacao.motivo, stryMutAct_9fa48("936") ? "" : (stryCov_9fa48("936"), "gemini")));
          }
        }
      }
    }
    return stryMutAct_9fa48("937") ? {} : (stryCov_9fa48("937"), {
      ...resultado,
      novos,
      barrados
    });
  }
}