// O cliente do Gemini que o classificador usa (#58). Não importa o SDK: recebe a classe GoogleGenAI por
// parâmetro. Só o scripts/classificar.mjs carrega o SDK, e só quando existe chave; nos testes entra uma classe
// falsa. Assim nenhum teste toca a rede, e trocar de provedor é escrever outro arquivo com o mesmo `gerar`.
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
export const MODELO_PADRAO = stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), "gemini-3.8-flash");
// Usado só quando o principal está sobrecarregado ou sem cota (decisões 48 e 49). Em 21/11/2026, com as mesmas
// 30 siglas do teste, ele barrou as 12 de fora da UnB e aceitou as 12 da UnB.
export const MODELO_RESERVA = stryMutAct_9fa48("346") ? "" : (stryCov_9fa48("346"), "gemini-3.5-flash-lite");

// Sobrecarga (503) e cota esgotada (429) são do modelo: no Gemini gratuito, cada modelo tem a sua cota, então a
// reserva continua respondendo (em 21/11/2026, o principal deu 429 e o reserva seguiu). Chave inválida (400) ou
// modelo inexistente (404) não pedem a reserva: ela falharia do mesmo jeito.
const INDISPONIVEL = stryMutAct_9fa48("348") ? /"code":\S*(503|429)|\b(503|429)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|exceeded your current quota/i : stryMutAct_9fa48("347") ? /"code":\s(503|429)|\b(503|429)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|exceeded your current quota/i : (stryCov_9fa48("347", "348"), /"code":\s*(503|429)|\b(503|429)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|exceeded your current quota/i);
export function deveUsarReserva(erro) {
  if (stryMutAct_9fa48("349")) {
    {}
  } else {
    stryCov_9fa48("349");
    if (stryMutAct_9fa48("352") ? erro === undefined && erro === null : stryMutAct_9fa48("351") ? false : stryMutAct_9fa48("350") ? true : (stryCov_9fa48("350", "351", "352"), (stryMutAct_9fa48("354") ? erro !== undefined : stryMutAct_9fa48("353") ? false : (stryCov_9fa48("353", "354"), erro === undefined)) || (stryMutAct_9fa48("356") ? erro !== null : stryMutAct_9fa48("355") ? false : (stryCov_9fa48("355", "356"), erro === null)))) return stryMutAct_9fa48("357") ? true : (stryCov_9fa48("357"), false);
    return INDISPONIVEL.test(String(stryMutAct_9fa48("358") ? erro?.message && erro : (stryCov_9fa48("358"), (stryMutAct_9fa48("359") ? erro.message : (stryCov_9fa48("359"), erro?.message)) ?? erro)));
  }
}
export function criarClienteGemini({
  chave,
  GoogleGenAI,
  modelo = MODELO_PADRAO
} = {}) {
  if (stryMutAct_9fa48("360")) {
    {}
  } else {
    stryCov_9fa48("360");
    if (stryMutAct_9fa48("363") ? false : stryMutAct_9fa48("362") ? true : stryMutAct_9fa48("361") ? chave : (stryCov_9fa48("361", "362", "363"), !chave)) return null;
    if (stryMutAct_9fa48("366") ? typeof GoogleGenAI === "function" : stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : (stryCov_9fa48("364", "365", "366"), typeof GoogleGenAI !== (stryMutAct_9fa48("367") ? "" : (stryCov_9fa48("367"), "function")))) {
      if (stryMutAct_9fa48("368")) {
        {}
      } else {
        stryCov_9fa48("368");
        throw new Error(stryMutAct_9fa48("370") ? "" : (stryCov_9fa48("370"), "criarClienteGemini precisa da classe GoogleGenAI do SDK do Gemini"));
      }
    }
    const ia = new GoogleGenAI(stryMutAct_9fa48("371") ? {} : (stryCov_9fa48("371"), {
      apiKey: chave
    }));
    return stryMutAct_9fa48("372") ? {} : (stryCov_9fa48("372"), {
      modelo,
      // Pede a resposta em JSON, presa ao schema. O Gemini 3.8 não aceita mais `temperature`.
      async gerar(prompt, esquema) {
        if (stryMutAct_9fa48("373")) {
          {}
        } else {
          stryCov_9fa48("373");
          const resposta = await ia.models.generateContent(stryMutAct_9fa48("374") ? {} : (stryCov_9fa48("374"), {
            model: modelo,
            contents: prompt,
            config: stryMutAct_9fa48("375") ? {} : (stryCov_9fa48("375"), {
              responseMimeType: stryMutAct_9fa48("376") ? "" : (stryCov_9fa48("376"), "application/json"),
              responseJsonSchema: esquema
            })
          }));
          if (stryMutAct_9fa48("379") ? typeof resposta?.text === "string" : stryMutAct_9fa48("378") ? false : stryMutAct_9fa48("377") ? true : (stryCov_9fa48("377", "378", "379"), typeof (stryMutAct_9fa48("380") ? resposta.text : (stryCov_9fa48("380"), resposta?.text)) !== (stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), "string")))) throw new Error(stryMutAct_9fa48("383") ? "" : (stryCov_9fa48("383"), "a API não devolveu texto"));
          return resposta.text;
        }
      }
    });
  }
}

// Junta dois clientes: usa o principal e, na primeira sobrecarga ou cota esgotada, passa para a reserva até o fim da rodada,
// para não insistir num modelo ocupado a cada termo. `ultimoModelo` diz quem respondeu o último pedido.
export function comReserva(principal, reserva) {
  if (stryMutAct_9fa48("384")) {
    {}
  } else {
    stryCov_9fa48("384");
    if (stryMutAct_9fa48("387") ? (!principal || !reserva) && reserva.modelo === principal.modelo : stryMutAct_9fa48("386") ? false : stryMutAct_9fa48("385") ? true : (stryCov_9fa48("385", "386", "387"), (stryMutAct_9fa48("389") ? !principal && !reserva : stryMutAct_9fa48("388") ? false : (stryCov_9fa48("388", "389"), (stryMutAct_9fa48("390") ? principal : (stryCov_9fa48("390"), !principal)) || (stryMutAct_9fa48("391") ? reserva : (stryCov_9fa48("391"), !reserva)))) || (stryMutAct_9fa48("393") ? reserva.modelo !== principal.modelo : stryMutAct_9fa48("392") ? false : (stryCov_9fa48("392", "393"), reserva.modelo === principal.modelo)))) return principal;
    let usarReserva = stryMutAct_9fa48("394") ? true : (stryCov_9fa48("394"), false);
    const cliente = stryMutAct_9fa48("395") ? {} : (stryCov_9fa48("395"), {
      modelo: principal.modelo,
      modeloReserva: reserva.modelo,
      ultimoModelo: null,
      async gerar(prompt, esquema) {
        if (stryMutAct_9fa48("396")) {
          {}
        } else {
          stryCov_9fa48("396");
          if (stryMutAct_9fa48("399") ? false : stryMutAct_9fa48("398") ? true : stryMutAct_9fa48("397") ? usarReserva : (stryCov_9fa48("397", "398", "399"), !usarReserva)) {
            if (stryMutAct_9fa48("400")) {
              {}
            } else {
              stryCov_9fa48("400");
              try {
                if (stryMutAct_9fa48("401")) {
                  {}
                } else {
                  stryCov_9fa48("401");
                  const texto = await principal.gerar(prompt, esquema);
                  cliente.ultimoModelo = principal.modelo;
                  return texto;
                }
              } catch (erro) {
                if (stryMutAct_9fa48("402")) {
                  {}
                } else {
                  stryCov_9fa48("402");
                  if (stryMutAct_9fa48("405") ? false : stryMutAct_9fa48("404") ? true : stryMutAct_9fa48("403") ? deveUsarReserva(erro) : (stryCov_9fa48("403", "404", "405"), !deveUsarReserva(erro))) throw erro;
                  usarReserva = stryMutAct_9fa48("406") ? false : (stryCov_9fa48("406"), true);
                }
              }
            }
          }
          const texto = await reserva.gerar(prompt, esquema);
          cliente.ultimoModelo = reserva.modelo;
          return texto;
        }
      }
    });
    return cliente;
  }
}