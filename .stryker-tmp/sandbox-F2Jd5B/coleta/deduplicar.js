// Normalização, deduplicação e merge com o termos.json (#57, ADR 0009).
// Funções puras: recebem os candidatos do coletor e os termos atuais e separam novos, alterados e conflitos,
// cada um com o motivo. O robô só propõe: definicao e exemplo_uso são sempre escritos por uma pessoa.
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
const PALAVRAS_VAZIAS = new Set(stryMutAct_9fa48("584") ? [] : (stryCov_9fa48("584"), [stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), "a"), stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), "o"), stryMutAct_9fa48("587") ? "" : (stryCov_9fa48("587"), "as"), stryMutAct_9fa48("588") ? "" : (stryCov_9fa48("588"), "os"), stryMutAct_9fa48("589") ? "" : (stryCov_9fa48("589"), "de"), stryMutAct_9fa48("590") ? "" : (stryCov_9fa48("590"), "da"), stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), "do"), stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), "das"), stryMutAct_9fa48("593") ? "" : (stryCov_9fa48("593"), "dos"), stryMutAct_9fa48("594") ? "" : (stryCov_9fa48("594"), "e"), stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), "em"), stryMutAct_9fa48("596") ? "" : (stryCov_9fa48("596"), "na"), stryMutAct_9fa48("597") ? "" : (stryCov_9fa48("597"), "no"), stryMutAct_9fa48("598") ? "" : (stryCov_9fa48("598"), "para")]));

// A partir de quantas palavras em comum dois significados da mesma sigla são "o mesmo, atualizado" (alterado)
// e não "outra coisa com a mesma sigla" (conflito).
export const PARECIDO_A_PARTIR_DE = 0.6;
export const CAMPOS_QUE_O_ROBO_PODE_MUDAR = stryMutAct_9fa48("599") ? [] : (stryCov_9fa48("599"), [stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), "significado")]);

// Sem acento, em minúsculas, pontuação vira espaço e os espaços se juntam.
export function normalizar(texto) {
  if (stryMutAct_9fa48("601")) {
    {}
  } else {
    stryCov_9fa48("601");
    return stryMutAct_9fa48("603") ? String(texto ?? "").normalize("NFD").replace(/\p{M}/gu, "").toUpperCase().replace(/[^a-z0-9]+/g, " ").trim() : stryMutAct_9fa48("602") ? String(texto ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ") : (stryCov_9fa48("602", "603"), String(stryMutAct_9fa48("604") ? texto && "" : (stryCov_9fa48("604"), texto ?? (stryMutAct_9fa48("605") ? "Stryker was here!" : (stryCov_9fa48("605"), "")))).normalize(stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), "NFD")).replace(stryMutAct_9fa48("607") ? /\P{M}/gu : (stryCov_9fa48("607"), /\p{M}/gu), stryMutAct_9fa48("608") ? "Stryker was here!" : (stryCov_9fa48("608"), "")).toLowerCase().replace(stryMutAct_9fa48("610") ? /[a-z0-9]+/g : stryMutAct_9fa48("609") ? /[^a-z0-9]/g : (stryCov_9fa48("609", "610"), /[^a-z0-9]+/g), stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), " ")).trim());
  }
}

// A chave de um termo para comparar: "U.n.B", "UnB" e "unb" viram "unb".
export function chave(termo) {
  if (stryMutAct_9fa48("612")) {
    {}
  } else {
    stryCov_9fa48("612");
    return normalizar(termo).replaceAll(stryMutAct_9fa48("613") ? "" : (stryCov_9fa48("613"), " "), stryMutAct_9fa48("614") ? "Stryker was here!" : (stryCov_9fa48("614"), ""));
  }
}
function palavras(texto) {
  if (stryMutAct_9fa48("615")) {
    {}
  } else {
    stryCov_9fa48("615");
    return new Set(stryMutAct_9fa48("616") ? normalizar(texto).split(" ") : (stryCov_9fa48("616"), normalizar(texto).split(stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), " ")).filter(stryMutAct_9fa48("618") ? () => undefined : (stryCov_9fa48("618"), palavra => stryMutAct_9fa48("621") ? palavra || !PALAVRAS_VAZIAS.has(palavra) : stryMutAct_9fa48("620") ? false : stryMutAct_9fa48("619") ? true : (stryCov_9fa48("619", "620", "621"), palavra && (stryMutAct_9fa48("622") ? PALAVRAS_VAZIAS.has(palavra) : (stryCov_9fa48("622"), !PALAVRAS_VAZIAS.has(palavra))))))));
  }
}

// Quanto dois significados se parecem, de 0 a 1: palavras em comum ÷ palavras no total (sem "de", "e", "da"…).
export function semelhanca(a, b) {
  if (stryMutAct_9fa48("623")) {
    {}
  } else {
    stryCov_9fa48("623");
    const pa = palavras(a);
    const pb = palavras(b);
    if (stryMutAct_9fa48("626") ? pa.size === 0 || pb.size === 0 : stryMutAct_9fa48("625") ? false : stryMutAct_9fa48("624") ? true : (stryCov_9fa48("624", "625", "626"), (stryMutAct_9fa48("628") ? pa.size !== 0 : stryMutAct_9fa48("627") ? true : (stryCov_9fa48("627", "628"), pa.size === 0)) && (stryMutAct_9fa48("630") ? pb.size !== 0 : stryMutAct_9fa48("629") ? true : (stryCov_9fa48("629", "630"), pb.size === 0)))) return 1;
    const comuns = stryMutAct_9fa48("631") ? [...pa].length : (stryCov_9fa48("631"), (stryMutAct_9fa48("632") ? [] : (stryCov_9fa48("632"), [...pa])).filter(stryMutAct_9fa48("633") ? () => undefined : (stryCov_9fa48("633"), palavra => pb.has(palavra))).length);
    return stryMutAct_9fa48("634") ? comuns * (pa.size + pb.size - comuns) : (stryCov_9fa48("634"), comuns / (stryMutAct_9fa48("635") ? pa.size + pb.size + comuns : (stryCov_9fa48("635"), (stryMutAct_9fa48("636") ? pa.size - pb.size : (stryCov_9fa48("636"), pa.size + pb.size)) - comuns)));
  }
}

// Cada termo existente pela chave do termo e de cada sinônimo (o campo `sinonimos`, quando existe).
function indexar(termos) {
  if (stryMutAct_9fa48("637")) {
    {}
  } else {
    stryCov_9fa48("637");
    const porChave = new Map();
    for (const termo of termos) {
      if (stryMutAct_9fa48("638")) {
        {}
      } else {
        stryCov_9fa48("638");
        const nomes = stryMutAct_9fa48("639") ? [] : (stryCov_9fa48("639"), [termo.termo, ...(Array.isArray(termo.sinonimos) ? termo.sinonimos : stryMutAct_9fa48("640") ? ["Stryker was here"] : (stryCov_9fa48("640"), []))]);
        for (const nome of nomes) {
          if (stryMutAct_9fa48("641")) {
            {}
          } else {
            stryCov_9fa48("641");
            const k = chave(nome);
            if (stryMutAct_9fa48("644") ? k || !porChave.has(k) : stryMutAct_9fa48("643") ? false : stryMutAct_9fa48("642") ? true : (stryCov_9fa48("642", "643", "644"), k && (stryMutAct_9fa48("645") ? porChave.has(k) : (stryCov_9fa48("645"), !porChave.has(k))))) porChave.set(k, stryMutAct_9fa48("647") ? {} : (stryCov_9fa48("647"), {
              termo,
              peloSinonimo: stryMutAct_9fa48("650") ? nome === termo.termo : stryMutAct_9fa48("649") ? false : stryMutAct_9fa48("648") ? true : (stryCov_9fa48("648", "649", "650"), nome !== termo.termo)
            }));
          }
        }
      }
    }
    return porChave;
  }
}

// Um id que ainda não existe: "saa", ou "saa-2" se "saa" já é de outro termo.
function idLivre(base, idsUsados) {
  if (stryMutAct_9fa48("651")) {
    {}
  } else {
    stryCov_9fa48("651");
    let id = base;
    let n = 2;
    while (stryMutAct_9fa48("652") ? false : (stryCov_9fa48("652"), idsUsados.has(id))) {
      if (stryMutAct_9fa48("653")) {
        {}
      } else {
        stryCov_9fa48("653");
        id = stryMutAct_9fa48("654") ? `` : (stryCov_9fa48("654"), `${base}-${n}`);
        stryMutAct_9fa48("655") ? n -= 1 : (stryCov_9fa48("655"), n += 1);
      }
    }
    if (stryMutAct_9fa48("656")) {
      ;
    } else {
      stryCov_9fa48("656");
      idsUsados.add(id);
    }
    return id;
  }
}

// Para a mesma sigla com outro significado: a primeira palavra que diferencia os dois ("ip-internet").
function idDeDesambiguacao(candidato, existente, idsUsados) {
  if (stryMutAct_9fa48("657")) {
    {}
  } else {
    stryCov_9fa48("657");
    const doExistente = palavras(existente.significado);
    const diferente = (stryMutAct_9fa48("658") ? [] : (stryCov_9fa48("658"), [...palavras(candidato.significado)])).find(stryMutAct_9fa48("659") ? () => undefined : (stryCov_9fa48("659"), palavra => stryMutAct_9fa48("660") ? doExistente.has(palavra) : (stryCov_9fa48("660"), !doExistente.has(palavra))));
    return idLivre(diferente ? stryMutAct_9fa48("661") ? `` : (stryCov_9fa48("661"), `${chave(candidato.termo)}-${diferente}`) : chave(candidato.termo), idsUsados);
  }
}
function porcentagem(valor) {
  if (stryMutAct_9fa48("662")) {
    {}
  } else {
    stryCov_9fa48("662");
    return stryMutAct_9fa48("663") ? `` : (stryCov_9fa48("663"), `${Math.round(stryMutAct_9fa48("664") ? valor / 100 : (stryCov_9fa48("664"), valor * 100))}%`);
  }
}
function classificarPelaSigla(candidato, {
  termo,
  peloSinonimo
}, idsUsados) {
  if (stryMutAct_9fa48("665")) {
    {}
  } else {
    stryCov_9fa48("665");
    const como = peloSinonimo ? stryMutAct_9fa48("666") ? `` : (stryCov_9fa48("666"), `"${candidato.termo}" é sinônimo de ${termo.termo} (${termo.id})`) : stryMutAct_9fa48("667") ? `` : (stryCov_9fa48("667"), `mesmo termo de ${termo.id}`);
    if (stryMutAct_9fa48("670") ? normalizar(candidato.significado) !== normalizar(termo.significado) : stryMutAct_9fa48("669") ? false : stryMutAct_9fa48("668") ? true : (stryCov_9fa48("668", "669", "670"), normalizar(candidato.significado) === normalizar(termo.significado))) {
      if (stryMutAct_9fa48("671")) {
        {}
      } else {
        stryCov_9fa48("671");
        return stryMutAct_9fa48("672") ? {} : (stryCov_9fa48("672"), {
          lista: stryMutAct_9fa48("673") ? "" : (stryCov_9fa48("673"), "iguais"),
          registro: stryMutAct_9fa48("674") ? {} : (stryCov_9fa48("674"), {
            id: termo.id,
            candidato,
            motivo: stryMutAct_9fa48("675") ? `` : (stryCov_9fa48("675"), `${como}, com o mesmo significado`)
          })
        });
      }
    }
    const mudancas = stryMutAct_9fa48("676") ? {} : (stryCov_9fa48("676"), {
      significado: stryMutAct_9fa48("677") ? {} : (stryCov_9fa48("677"), {
        de: stryMutAct_9fa48("678") ? termo.significado && "" : (stryCov_9fa48("678"), termo.significado ?? (stryMutAct_9fa48("679") ? "Stryker was here!" : (stryCov_9fa48("679"), ""))),
        para: candidato.significado
      })
    });
    if (stryMutAct_9fa48("682") ? false : stryMutAct_9fa48("681") ? true : stryMutAct_9fa48("680") ? normalizar(termo.significado) : (stryCov_9fa48("680", "681", "682"), !normalizar(termo.significado))) {
      if (stryMutAct_9fa48("683")) {
        {}
      } else {
        stryCov_9fa48("683");
        return stryMutAct_9fa48("684") ? {} : (stryCov_9fa48("684"), {
          lista: stryMutAct_9fa48("685") ? "" : (stryCov_9fa48("685"), "alterados"),
          registro: stryMutAct_9fa48("686") ? {} : (stryCov_9fa48("686"), {
            id: termo.id,
            candidato,
            mudancas,
            motivo: stryMutAct_9fa48("687") ? `` : (stryCov_9fa48("687"), `${como}, que estava sem significado`)
          })
        });
      }
    }
    const s = semelhanca(candidato.significado, termo.significado);
    if (stryMutAct_9fa48("691") ? s < PARECIDO_A_PARTIR_DE : stryMutAct_9fa48("690") ? s > PARECIDO_A_PARTIR_DE : stryMutAct_9fa48("689") ? false : stryMutAct_9fa48("688") ? true : (stryCov_9fa48("688", "689", "690", "691"), s >= PARECIDO_A_PARTIR_DE)) {
      if (stryMutAct_9fa48("692")) {
        {}
      } else {
        stryCov_9fa48("692");
        const motivo = stryMutAct_9fa48("693") ? `` : (stryCov_9fa48("693"), `${como}, com significado parecido (${porcentagem(s)} das palavras em comum): proposta de atualizar o significado`);
        return stryMutAct_9fa48("694") ? {} : (stryCov_9fa48("694"), {
          lista: stryMutAct_9fa48("695") ? "" : (stryCov_9fa48("695"), "alterados"),
          registro: stryMutAct_9fa48("696") ? {} : (stryCov_9fa48("696"), {
            id: termo.id,
            candidato,
            mudancas,
            motivo
          })
        });
      }
    }
    const motivo = (stryMutAct_9fa48("697") ? `` : (stryCov_9fa48("697"), `${como} com outro significado ("${termo.significado}" × "${candidato.significado}", ${porcentagem(s)} das palavras `)) + (stryMutAct_9fa48("698") ? "" : (stryCov_9fa48("698"), "em comum): proposta de desambiguação, nada foi sobrescrito"));
    return stryMutAct_9fa48("699") ? {} : (stryCov_9fa48("699"), {
      lista: stryMutAct_9fa48("700") ? "" : (stryCov_9fa48("700"), "conflitos"),
      registro: stryMutAct_9fa48("701") ? {} : (stryCov_9fa48("701"), {
        id_existente: termo.id,
        candidato,
        motivo,
        proposta_id: idDeDesambiguacao(candidato, termo, idsUsados)
      })
    });
  }
}
function classificarUm(candidato, porChave, termos, idsUsados) {
  if (stryMutAct_9fa48("702")) {
    {}
  } else {
    stryCov_9fa48("702");
    const achado = porChave.get(chave(candidato.termo));
    if (stryMutAct_9fa48("704") ? false : stryMutAct_9fa48("703") ? true : (stryCov_9fa48("703", "704"), achado)) return classificarPelaSigla(candidato, achado, idsUsados);

    // Outra sigla com o mesmo significado de um termo que já existe: é o mesmo termo, repetido com outro id.
    const significado = normalizar(candidato.significado);
    const repetido = termos.find(stryMutAct_9fa48("705") ? () => undefined : (stryCov_9fa48("705"), termo => stryMutAct_9fa48("708") ? normalizar(termo.significado) !== significado : stryMutAct_9fa48("707") ? false : stryMutAct_9fa48("706") ? true : (stryCov_9fa48("706", "707", "708"), normalizar(termo.significado) === significado)));
    if (stryMutAct_9fa48("710") ? false : stryMutAct_9fa48("709") ? true : (stryCov_9fa48("709", "710"), repetido)) {
      if (stryMutAct_9fa48("711")) {
        {}
      } else {
        stryCov_9fa48("711");
        const motivo = (stryMutAct_9fa48("712") ? `` : (stryCov_9fa48("712"), `repetido: mesmo significado de ${repetido.termo} (${repetido.id}) com outra sigla. `)) + (stryMutAct_9fa48("713") ? "" : (stryCov_9fa48("713"), "Se for um nome antigo, vira sinônimo; se não, alguém decide"));
        return stryMutAct_9fa48("714") ? {} : (stryCov_9fa48("714"), {
          lista: stryMutAct_9fa48("715") ? "" : (stryCov_9fa48("715"), "conflitos"),
          registro: stryMutAct_9fa48("716") ? {} : (stryCov_9fa48("716"), {
            id_existente: repetido.id,
            candidato,
            motivo,
            proposta_id: null
          })
        });
      }
    }
    const motivo = stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), "nenhum termo com essa sigla, sinônimo ou significado");
    return stryMutAct_9fa48("718") ? {} : (stryCov_9fa48("718"), {
      lista: stryMutAct_9fa48("719") ? "" : (stryCov_9fa48("719"), "novos"),
      registro: stryMutAct_9fa48("720") ? {} : (stryCov_9fa48("720"), {
        candidato,
        motivo,
        proposta_id: idLivre(chave(candidato.termo), idsUsados)
      })
    });
  }
}

// Separa os candidatos em novos, alterados e conflitos (e iguais e descartados, para o relatório).
// O mesmo termo vindo de duas fontes vira um registro só, com a outra fonte em `tambem_em`.
export function classificar(candidatos, termos) {
  if (stryMutAct_9fa48("721")) {
    {}
  } else {
    stryCov_9fa48("721");
    const saida = stryMutAct_9fa48("722") ? {} : (stryCov_9fa48("722"), {
      novos: stryMutAct_9fa48("723") ? ["Stryker was here"] : (stryCov_9fa48("723"), []),
      alterados: stryMutAct_9fa48("724") ? ["Stryker was here"] : (stryCov_9fa48("724"), []),
      conflitos: stryMutAct_9fa48("725") ? ["Stryker was here"] : (stryCov_9fa48("725"), []),
      iguais: stryMutAct_9fa48("726") ? ["Stryker was here"] : (stryCov_9fa48("726"), []),
      descartados: stryMutAct_9fa48("727") ? ["Stryker was here"] : (stryCov_9fa48("727"), [])
    });
    const porChave = indexar(termos);
    const idsUsados = new Set(termos.map(stryMutAct_9fa48("728") ? () => undefined : (stryCov_9fa48("728"), termo => termo.id)));
    const jaVistos = new Map();
    for (const candidato of candidatos) {
      if (stryMutAct_9fa48("729")) {
        {}
      } else {
        stryCov_9fa48("729");
        const termo = chave(stryMutAct_9fa48("730") ? candidato.termo : (stryCov_9fa48("730"), candidato?.termo));
        const significado = normalizar(stryMutAct_9fa48("731") ? candidato.significado : (stryCov_9fa48("731"), candidato?.significado));
        if (stryMutAct_9fa48("734") ? !termo && !significado : stryMutAct_9fa48("733") ? false : stryMutAct_9fa48("732") ? true : (stryCov_9fa48("732", "733", "734"), (stryMutAct_9fa48("735") ? termo : (stryCov_9fa48("735"), !termo)) || (stryMutAct_9fa48("736") ? significado : (stryCov_9fa48("736"), !significado)))) {
          if (stryMutAct_9fa48("737")) {
            {}
          } else {
            stryCov_9fa48("737");
            saida.descartados.push(stryMutAct_9fa48("739") ? {} : (stryCov_9fa48("739"), {
              candidato,
              motivo: stryMutAct_9fa48("740") ? "" : (stryCov_9fa48("740"), "candidato sem termo ou sem significado")
            }));
            continue;
          }
        }
        const k = stryMutAct_9fa48("741") ? `` : (stryCov_9fa48("741"), `${termo}\u0000${significado}`);
        if (stryMutAct_9fa48("743") ? false : stryMutAct_9fa48("742") ? true : (stryCov_9fa48("742", "743"), jaVistos.has(k))) {
          if (stryMutAct_9fa48("744")) {
            {}
          } else {
            stryCov_9fa48("744");
            const registro = jaVistos.get(k);
            if (stryMutAct_9fa48("747") ? candidato.fonte || !registro.tambem_em.includes(candidato.fonte) : stryMutAct_9fa48("746") ? false : stryMutAct_9fa48("745") ? true : (stryCov_9fa48("745", "746", "747"), candidato.fonte && (stryMutAct_9fa48("748") ? registro.tambem_em.includes(candidato.fonte) : (stryCov_9fa48("748"), !registro.tambem_em.includes(candidato.fonte))))) if (stryMutAct_9fa48("749")) {
              ;
            } else {
              stryCov_9fa48("749");
              registro.tambem_em.push(candidato.fonte);
            }
            continue;
          }
        }
        const {
          lista,
          registro
        } = classificarUm(candidato, porChave, termos, idsUsados);
        registro.tambem_em = stryMutAct_9fa48("750") ? ["Stryker was here"] : (stryCov_9fa48("750"), []);
        if (stryMutAct_9fa48("751")) {
          ;
        } else {
          stryCov_9fa48("751");
          jaVistos.set(k, registro);
        }
        if (stryMutAct_9fa48("752")) {
          ;
        } else {
          stryCov_9fa48("752");
          saida[lista].push(registro);
        }
      }
    }
    return saida;
  }
}

// Aplica nos termos só o que o robô pode mudar (o significado) e devolve uma lista nova, sem mexer na de entrada.
// Uma mudança em qualquer outro campo (definicao, exemplo_uso…) é erro: esses campos são de uma pessoa.
export function mesclar(termos, alterados) {
  if (stryMutAct_9fa48("753")) {
    {}
  } else {
    stryCov_9fa48("753");
    const mudancasPorId = new Map(alterados.map(stryMutAct_9fa48("754") ? () => undefined : (stryCov_9fa48("754"), alterado => stryMutAct_9fa48("755") ? [] : (stryCov_9fa48("755"), [alterado.id, alterado.mudancas]))));
    return termos.map(termo => {
      if (stryMutAct_9fa48("756")) {
        {}
      } else {
        stryCov_9fa48("756");
        const mudancas = mudancasPorId.get(termo.id);
        if (stryMutAct_9fa48("759") ? false : stryMutAct_9fa48("758") ? true : stryMutAct_9fa48("757") ? mudancas : (stryCov_9fa48("757", "758", "759"), !mudancas)) return termo;
        const proibidos = stryMutAct_9fa48("760") ? Object.keys(mudancas) : (stryCov_9fa48("760"), Object.keys(mudancas).filter(stryMutAct_9fa48("761") ? () => undefined : (stryCov_9fa48("761"), campo => stryMutAct_9fa48("762") ? CAMPOS_QUE_O_ROBO_PODE_MUDAR.includes(campo) : (stryCov_9fa48("762"), !CAMPOS_QUE_O_ROBO_PODE_MUDAR.includes(campo)))));
        if (stryMutAct_9fa48("766") ? proibidos.length <= 0 : stryMutAct_9fa48("765") ? proibidos.length >= 0 : stryMutAct_9fa48("764") ? false : stryMutAct_9fa48("763") ? true : (stryCov_9fa48("763", "764", "765", "766"), proibidos.length > 0)) {
          if (stryMutAct_9fa48("767")) {
            {}
          } else {
            stryCov_9fa48("767");
            throw new Error(stryMutAct_9fa48("769") ? `` : (stryCov_9fa48("769"), `o robô não pode mudar ${proibidos.join(stryMutAct_9fa48("770") ? "" : (stryCov_9fa48("770"), ", "))} de ${termo.id}: esse campo é escrito por uma pessoa`));
          }
        }
        const novosValores = Object.fromEntries(Object.entries(mudancas).map(stryMutAct_9fa48("771") ? () => undefined : (stryCov_9fa48("771"), ([campo, {
          para
        }]) => stryMutAct_9fa48("772") ? [] : (stryCov_9fa48("772"), [campo, para]))));
        return stryMutAct_9fa48("773") ? {} : (stryCov_9fa48("773"), {
          ...termo,
          ...novosValores
        });
      }
    });
  }
}

// Termos do próprio glossário que são o mesmo com ids diferentes (mesma chave ou mesmo significado).
export function repetidosNoGlossario(termos) {
  if (stryMutAct_9fa48("774")) {
    {}
  } else {
    stryCov_9fa48("774");
    const grupos = new Map();
    for (const termo of termos) {
      if (stryMutAct_9fa48("775")) {
        {}
      } else {
        stryCov_9fa48("775");
        for (const k of stryMutAct_9fa48("776") ? [] : (stryCov_9fa48("776"), [stryMutAct_9fa48("777") ? `` : (stryCov_9fa48("777"), `termo:${chave(termo.termo)}`), stryMutAct_9fa48("778") ? `` : (stryCov_9fa48("778"), `significado:${normalizar(termo.significado)}`)])) {
          if (stryMutAct_9fa48("779")) {
            {}
          } else {
            stryCov_9fa48("779");
            if (stryMutAct_9fa48("782") ? k.startsWith(":") : stryMutAct_9fa48("781") ? false : stryMutAct_9fa48("780") ? true : (stryCov_9fa48("780", "781", "782"), k.endsWith(stryMutAct_9fa48("783") ? "" : (stryCov_9fa48("783"), ":")))) continue;
            grupos.set(k, stryMutAct_9fa48("785") ? [] : (stryCov_9fa48("785"), [...(stryMutAct_9fa48("786") ? grupos.get(k) && [] : (stryCov_9fa48("786"), grupos.get(k) ?? (stryMutAct_9fa48("787") ? ["Stryker was here"] : (stryCov_9fa48("787"), [])))), termo.id]));
          }
        }
      }
    }
    return stryMutAct_9fa48("788") ? [...grupos].map(([motivo, ids]) => ({
      motivo,
      ids
    })) : (stryCov_9fa48("788"), (stryMutAct_9fa48("789") ? [] : (stryCov_9fa48("789"), [...grupos])).filter(stryMutAct_9fa48("790") ? () => undefined : (stryCov_9fa48("790"), ([, ids]) => stryMutAct_9fa48("794") ? new Set(ids).size <= 1 : stryMutAct_9fa48("793") ? new Set(ids).size >= 1 : stryMutAct_9fa48("792") ? false : stryMutAct_9fa48("791") ? true : (stryCov_9fa48("791", "792", "793", "794"), new Set(ids).size > 1))).map(stryMutAct_9fa48("795") ? () => undefined : (stryCov_9fa48("795"), ([motivo, ids]) => stryMutAct_9fa48("796") ? {} : (stryCov_9fa48("796"), {
      motivo,
      ids
    }))));
  }
}