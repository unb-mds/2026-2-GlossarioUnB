// Categorização e redação assistidas por LLM (#58, ADR 0009). Para cada candidato do coletor, pede ao LLM a
// categoria, o tipo e rascunhos da definição e do exemplo, valida a resposta por schema e marca o candidato
// como "revisar". O LLM só propõe: as sugestões ficam em `classificacao` e nunca viram `definicao` nem
// `exemplo_uso`, que quem escreve é o revisor do PR. Função pura: sem rede, sem arquivo e sem SDK. O cliente
// chega pronto por parâmetro (coleta/cliente-gemini.js), o que deixa trocar de provedor e testar sem a API.
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
export const SEM_CLASSIFICACAO = stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), "sem classificação");
export const REVISAR = stryMutAct_9fa48("110") ? "" : (stryCov_9fa48("110"), "revisar");
export const FORA_DO_ESCOPO = stryMutAct_9fa48("111") ? "" : (stryCov_9fa48("111"), "fora do escopo");
export const CONFIANCAS = stryMutAct_9fa48("112") ? [] : (stryCov_9fa48("112"), [stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), "alta"), stryMutAct_9fa48("114") ? "" : (stryCov_9fa48("114"), "media"), stryMutAct_9fa48("115") ? "" : (stryCov_9fa48("115"), "baixa")]);
export const MAX_TEXTO = 300;
export const INTERVALO_PADRAO_MS = 4000; // 15 pedidos por minuto, dentro do limite gratuito da API
export const LIMITE_PADRAO = 100; // chamadas por execução

const MARCADORES = stryMutAct_9fa48("116") ? [] : (stryCov_9fa48("116"), [stryMutAct_9fa48("117") ? "" : (stryCov_9fa48("117"), "CATEGORIAS"), stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), "TIPOS"), stryMutAct_9fa48("119") ? "" : (stryCov_9fa48("119"), "TERMO"), stryMutAct_9fa48("120") ? "" : (stryCov_9fa48("120"), "SIGNIFICADO"), stryMutAct_9fa48("121") ? "" : (stryCov_9fa48("121"), "FONTE"), stryMutAct_9fa48("122") ? "" : (stryCov_9fa48("122"), "TRECHO")]);
const TAMANHO_DO_TRECHO = 1000;
const TAMANHO_DO_MOTIVO = 200; // o erro da API pode ser um JSON enorme
const CAMPOS = stryMutAct_9fa48("123") ? [] : (stryCov_9fa48("123"), [stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), "categoria"), stryMutAct_9fa48("125") ? "" : (stryCov_9fa48("125"), "tipo"), stryMutAct_9fa48("126") ? "" : (stryCov_9fa48("126"), "definicao"), stryMutAct_9fa48("127") ? "" : (stryCov_9fa48("127"), "exemplo_uso"), stryMutAct_9fa48("128") ? "" : (stryCov_9fa48("128"), "confianca")]);
const LINK_OU_HTML = stryMutAct_9fa48("130") ? /[<>]|https:/i : stryMutAct_9fa48("129") ? /[^<>]|https?:/i : (stryCov_9fa48("129", "130"), /[<>]|https?:/i);
const esperarDeVerdade = stryMutAct_9fa48("131") ? () => undefined : (stryCov_9fa48("131"), (() => {
  const esperarDeVerdade = ms => new Promise(stryMutAct_9fa48("132") ? () => undefined : (stryCov_9fa48("132"), resolve => setTimeout(resolve, ms)));
  return esperarDeVerdade;
})());

// O texto da página é dado, não instrução: tira os delimitadores do bloco de dados, para ele não conseguir
// fechar o bloco e escrever fora dele (prompt injection).
function comoDado(valor, tamanho = TAMANHO_DO_TRECHO) {
  if (stryMutAct_9fa48("133")) {
    {}
  } else {
    stryCov_9fa48("133");
    return stryMutAct_9fa48("135") ? String(valor ?? "").replace(/<<<|>>>/g, "").replace(/\s+/g, " ").slice(0, tamanho) : stryMutAct_9fa48("134") ? String(valor ?? "").replace(/<<<|>>>/g, "").replace(/\s+/g, " ").trim() : (stryCov_9fa48("134", "135"), String(stryMutAct_9fa48("136") ? valor && "" : (stryCov_9fa48("136"), valor ?? (stryMutAct_9fa48("137") ? "Stryker was here!" : (stryCov_9fa48("137"), "")))).replace(/<<<|>>>/g, stryMutAct_9fa48("138") ? "Stryker was here!" : (stryCov_9fa48("138"), "")).replace(stryMutAct_9fa48("140") ? /\S+/g : stryMutAct_9fa48("139") ? /\s/g : (stryCov_9fa48("139", "140"), /\s+/g), stryMutAct_9fa48("141") ? "" : (stryCov_9fa48("141"), " ")).trim().slice(0, tamanho));
  }
}
export function montarPrompt(molde, candidato, categorias, tipos) {
  if (stryMutAct_9fa48("142")) {
    {}
  } else {
    stryCov_9fa48("142");
    for (const marcador of MARCADORES) {
      if (stryMutAct_9fa48("143")) {
        {}
      } else {
        stryCov_9fa48("143");
        if (stryMutAct_9fa48("146") ? false : stryMutAct_9fa48("145") ? true : stryMutAct_9fa48("144") ? molde.includes(`{{${marcador}}}`) : (stryCov_9fa48("144", "145", "146"), !molde.includes(stryMutAct_9fa48("147") ? `` : (stryCov_9fa48("147"), `{{${marcador}}}`)))) throw new Error(stryMutAct_9fa48("149") ? `` : (stryCov_9fa48("149"), `o prompt não tem o marcador {{${marcador}}}`));
      }
    }
    const valores = stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
      CATEGORIAS: categorias.map(stryMutAct_9fa48("151") ? () => undefined : (stryCov_9fa48("151"), c => stryMutAct_9fa48("152") ? `` : (stryCov_9fa48("152"), `- ${c.id}: ${c.nome}. ${c.descricao}`))).join(stryMutAct_9fa48("153") ? "" : (stryCov_9fa48("153"), "\n")),
      TIPOS: tipos.map(stryMutAct_9fa48("154") ? () => undefined : (stryCov_9fa48("154"), tipo => stryMutAct_9fa48("155") ? `` : (stryCov_9fa48("155"), `- ${tipo}`))).join(stryMutAct_9fa48("156") ? "" : (stryCov_9fa48("156"), "\n")),
      TERMO: comoDado(candidato.termo, 60),
      SIGNIFICADO: comoDado(candidato.significado, 300),
      FONTE: comoDado(candidato.fonte, 300),
      TRECHO: comoDado(candidato.trecho)
    });
    return molde.replace(stryMutAct_9fa48("158") ? /\{\{([^A-Z]+)\}\}/g : stryMutAct_9fa48("157") ? /\{\{([A-Z])\}\}/g : (stryCov_9fa48("157", "158"), /\{\{([A-Z]+)\}\}/g), stryMutAct_9fa48("159") ? () => undefined : (stryCov_9fa48("159"), (marca, nome) => stryMutAct_9fa48("160") ? valores[nome] && marca : (stryCov_9fa48("160"), valores[nome] ?? marca)));
  }
}

// O schema que vai para a API (JSON Schema) e que a validarResposta confere de novo aqui: a API pode errar.
export function esquemaDaResposta(categorias, tipos) {
  if (stryMutAct_9fa48("161")) {
    {}
  } else {
    stryCov_9fa48("161");
    return stryMutAct_9fa48("162") ? {} : (stryCov_9fa48("162"), {
      type: stryMutAct_9fa48("163") ? "" : (stryCov_9fa48("163"), "object"),
      properties: stryMutAct_9fa48("164") ? {} : (stryCov_9fa48("164"), {
        categoria: stryMutAct_9fa48("165") ? {} : (stryCov_9fa48("165"), {
          type: stryMutAct_9fa48("166") ? "" : (stryCov_9fa48("166"), "string"),
          enum: categorias.map(stryMutAct_9fa48("167") ? () => undefined : (stryCov_9fa48("167"), c => c.id))
        }),
        tipo: stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
          type: stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), "string"),
          enum: tipos
        }),
        definicao: stryMutAct_9fa48("170") ? {} : (stryCov_9fa48("170"), {
          type: stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), "string"),
          description: stryMutAct_9fa48("172") ? `` : (stryCov_9fa48("172"), `Em linguagem simples, até ${MAX_TEXTO} caracteres.`)
        }),
        exemplo_uso: stryMutAct_9fa48("173") ? {} : (stryCov_9fa48("173"), {
          type: stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), "string"),
          description: stryMutAct_9fa48("175") ? `` : (stryCov_9fa48("175"), `Uma frase curta, até ${MAX_TEXTO} caracteres.`)
        }),
        confianca: stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
          type: stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), "string"),
          enum: CONFIANCAS
        }),
        pertinente: stryMutAct_9fa48("178") ? {} : (stryCov_9fa48("178"), {
          type: stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), "boolean"),
          description: stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), "true se o termo pertence à UnB ou à vida universitária.")
        }),
        motivo_pertinencia: stryMutAct_9fa48("181") ? {} : (stryCov_9fa48("181"), {
          type: stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), "string"),
          description: stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), "Uma frase curta explicando a resposta de pertinente.")
        })
      }),
      required: stryMutAct_9fa48("184") ? [] : (stryCov_9fa48("184"), [...CAMPOS, stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), "pertinente"), stryMutAct_9fa48("186") ? "" : (stryCov_9fa48("186"), "motivo_pertinencia")])
    });
  }
}
function erroDeTexto(campo, valor) {
  if (stryMutAct_9fa48("187")) {
    {}
  } else {
    stryCov_9fa48("187");
    const genero = (stryMutAct_9fa48("190") ? campo !== "definicao" : stryMutAct_9fa48("189") ? false : stryMutAct_9fa48("188") ? true : (stryCov_9fa48("188", "189", "190"), campo === (stryMutAct_9fa48("191") ? "" : (stryCov_9fa48("191"), "definicao")))) ? stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), "vazia") : stryMutAct_9fa48("193") ? "" : (stryCov_9fa48("193"), "vazio");
    if (stryMutAct_9fa48("196") ? valor !== "" : stryMutAct_9fa48("195") ? false : stryMutAct_9fa48("194") ? true : (stryCov_9fa48("194", "195", "196"), valor === (stryMutAct_9fa48("197") ? "Stryker was here!" : (stryCov_9fa48("197"), "")))) return stryMutAct_9fa48("198") ? `` : (stryCov_9fa48("198"), `${campo} está ${genero}`);
    if (stryMutAct_9fa48("202") ? valor.length <= MAX_TEXTO : stryMutAct_9fa48("201") ? valor.length >= MAX_TEXTO : stryMutAct_9fa48("200") ? false : stryMutAct_9fa48("199") ? true : (stryCov_9fa48("199", "200", "201", "202"), valor.length > MAX_TEXTO)) return stryMutAct_9fa48("203") ? `` : (stryCov_9fa48("203"), `${campo} passa de ${MAX_TEXTO} caracteres (${valor.length})`);
    if (stryMutAct_9fa48("205") ? false : stryMutAct_9fa48("204") ? true : (stryCov_9fa48("204", "205"), LINK_OU_HTML.test(valor))) return stryMutAct_9fa48("206") ? `` : (stryCov_9fa48("206"), `${campo} tem link ou HTML`);
    return null;
  }
}
export function validarResposta(texto, categorias, tipos) {
  if (stryMutAct_9fa48("207")) {
    {}
  } else {
    stryCov_9fa48("207");
    let dados;
    try {
      if (stryMutAct_9fa48("208")) {
        {}
      } else {
        stryCov_9fa48("208");
        dados = JSON.parse(texto);
      }
    } catch {
      if (stryMutAct_9fa48("209")) {
        {}
      } else {
        stryCov_9fa48("209");
        return stryMutAct_9fa48("210") ? {} : (stryCov_9fa48("210"), {
          ok: stryMutAct_9fa48("211") ? true : (stryCov_9fa48("211"), false),
          erro: stryMutAct_9fa48("212") ? "" : (stryCov_9fa48("212"), "a resposta não é JSON")
        });
      }
    }
    if (stryMutAct_9fa48("215") ? (dados === null || typeof dados !== "object") && Array.isArray(dados) : stryMutAct_9fa48("214") ? false : stryMutAct_9fa48("213") ? true : (stryCov_9fa48("213", "214", "215"), (stryMutAct_9fa48("217") ? dados === null && typeof dados !== "object" : stryMutAct_9fa48("216") ? false : (stryCov_9fa48("216", "217"), (stryMutAct_9fa48("219") ? dados !== null : stryMutAct_9fa48("218") ? false : (stryCov_9fa48("218", "219"), dados === null)) || (stryMutAct_9fa48("221") ? typeof dados === "object" : stryMutAct_9fa48("220") ? false : (stryCov_9fa48("220", "221"), typeof dados !== (stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), "object")))))) || Array.isArray(dados))) {
      if (stryMutAct_9fa48("223")) {
        {}
      } else {
        stryCov_9fa48("223");
        return stryMutAct_9fa48("224") ? {} : (stryCov_9fa48("224"), {
          ok: stryMutAct_9fa48("225") ? true : (stryCov_9fa48("225"), false),
          erro: stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), "a resposta precisa ser um objeto")
        });
      }
    }
    const valor = {};
    for (const campo of CAMPOS) {
      if (stryMutAct_9fa48("227")) {
        {}
      } else {
        stryCov_9fa48("227");
        if (stryMutAct_9fa48("230") ? typeof dados[campo] === "string" : stryMutAct_9fa48("229") ? false : stryMutAct_9fa48("228") ? true : (stryCov_9fa48("228", "229", "230"), typeof dados[campo] !== (stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), "string")))) return stryMutAct_9fa48("232") ? {} : (stryCov_9fa48("232"), {
          ok: stryMutAct_9fa48("233") ? true : (stryCov_9fa48("233"), false),
          erro: stryMutAct_9fa48("234") ? `` : (stryCov_9fa48("234"), `o campo ${campo} precisa ser texto`)
        });
        valor[campo] = stryMutAct_9fa48("235") ? dados[campo] : (stryCov_9fa48("235"), dados[campo].trim());
      }
    }
    if (stryMutAct_9fa48("238") ? dados.pertinente !== undefined || typeof dados.pertinente !== "boolean" : stryMutAct_9fa48("237") ? false : stryMutAct_9fa48("236") ? true : (stryCov_9fa48("236", "237", "238"), (stryMutAct_9fa48("240") ? dados.pertinente === undefined : stryMutAct_9fa48("239") ? true : (stryCov_9fa48("239", "240"), dados.pertinente !== undefined)) && (stryMutAct_9fa48("242") ? typeof dados.pertinente === "boolean" : stryMutAct_9fa48("241") ? true : (stryCov_9fa48("241", "242"), typeof dados.pertinente !== (stryMutAct_9fa48("243") ? "" : (stryCov_9fa48("243"), "boolean")))))) {
      if (stryMutAct_9fa48("244")) {
        {}
      } else {
        stryCov_9fa48("244");
        return stryMutAct_9fa48("245") ? {} : (stryCov_9fa48("245"), {
          ok: stryMutAct_9fa48("246") ? true : (stryCov_9fa48("246"), false),
          erro: stryMutAct_9fa48("247") ? "" : (stryCov_9fa48("247"), "o campo pertinente precisa ser verdadeiro ou falso")
        });
      }
    }
    const listas = stryMutAct_9fa48("248") ? {} : (stryCov_9fa48("248"), {
      categoria: categorias.map(stryMutAct_9fa48("249") ? () => undefined : (stryCov_9fa48("249"), c => c.id)),
      tipo: tipos,
      confianca: CONFIANCAS
    });
    for (const [campo, permitidos] of Object.entries(listas)) {
      if (stryMutAct_9fa48("250")) {
        {}
      } else {
        stryCov_9fa48("250");
        if (stryMutAct_9fa48("253") ? false : stryMutAct_9fa48("252") ? true : stryMutAct_9fa48("251") ? permitidos.includes(valor[campo]) : (stryCov_9fa48("251", "252", "253"), !permitidos.includes(valor[campo]))) return stryMutAct_9fa48("254") ? {} : (stryCov_9fa48("254"), {
          ok: stryMutAct_9fa48("255") ? true : (stryCov_9fa48("255"), false),
          erro: stryMutAct_9fa48("256") ? `` : (stryCov_9fa48("256"), `${campo} "${valor[campo]}" não está na lista`)
        });
      }
    }
    for (const campo of stryMutAct_9fa48("257") ? [] : (stryCov_9fa48("257"), [stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), "definicao"), stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), "exemplo_uso")])) {
      if (stryMutAct_9fa48("260")) {
        {}
      } else {
        stryCov_9fa48("260");
        const erro = erroDeTexto(campo, valor[campo]);
        if (stryMutAct_9fa48("262") ? false : stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261", "262"), erro)) return stryMutAct_9fa48("263") ? {} : (stryCov_9fa48("263"), {
          ok: stryMutAct_9fa48("264") ? true : (stryCov_9fa48("264"), false),
          erro
        });
      }
    }
    // Sem o campo, o termo segue para a revisão humana: o filtro do LLM só barra quando a recusa é explícita.
    if (stryMutAct_9fa48("267") ? dados.pertinente !== false : stryMutAct_9fa48("266") ? false : stryMutAct_9fa48("265") ? true : (stryCov_9fa48("265", "266", "267"), dados.pertinente === (stryMutAct_9fa48("268") ? true : (stryCov_9fa48("268"), false)))) {
      if (stryMutAct_9fa48("269")) {
        {}
      } else {
        stryCov_9fa48("269");
        const motivo = (stryMutAct_9fa48("272") ? typeof dados.motivo_pertinencia !== "string" : stryMutAct_9fa48("271") ? false : stryMutAct_9fa48("270") ? true : (stryCov_9fa48("270", "271", "272"), typeof dados.motivo_pertinencia === (stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), "string")))) ? stryMutAct_9fa48("274") ? dados.motivo_pertinencia : (stryCov_9fa48("274"), dados.motivo_pertinencia.trim()) : stryMutAct_9fa48("275") ? "Stryker was here!" : (stryCov_9fa48("275"), "");
        const erro = motivo ? erroDeTexto(stryMutAct_9fa48("276") ? "" : (stryCov_9fa48("276"), "motivo_pertinencia"), motivo) : null;
        if (stryMutAct_9fa48("278") ? false : stryMutAct_9fa48("277") ? true : (stryCov_9fa48("277", "278"), erro)) return stryMutAct_9fa48("279") ? {} : (stryCov_9fa48("279"), {
          ok: stryMutAct_9fa48("280") ? true : (stryCov_9fa48("280"), false),
          erro
        });
        valor.pertinente = stryMutAct_9fa48("281") ? true : (stryCov_9fa48("281"), false);
        valor.motivo_pertinencia = stryMutAct_9fa48("284") ? motivo && "o LLM indicou que o termo não é da universidade" : stryMutAct_9fa48("283") ? false : stryMutAct_9fa48("282") ? true : (stryCov_9fa48("282", "283", "284"), motivo || (stryMutAct_9fa48("285") ? "" : (stryCov_9fa48("285"), "o LLM indicou que o termo não é da universidade")));
      }
    }
    return stryMutAct_9fa48("286") ? {} : (stryCov_9fa48("286"), {
      ok: stryMutAct_9fa48("287") ? false : (stryCov_9fa48("287"), true),
      valor
    });
  }
}
const semClassificacao = stryMutAct_9fa48("288") ? () => undefined : (stryCov_9fa48("288"), (() => {
  const semClassificacao = motivo => stryMutAct_9fa48("289") ? {} : (stryCov_9fa48("289"), {
    estado: SEM_CLASSIFICACAO,
    motivo
  });
  return semClassificacao;
})());

// Uma lista nova, com `classificacao` em cada candidato. Sem cliente (sem chave), com a API fora do ar ou com
// resposta inválida, o candidato segue "sem classificação" e o pipeline continua.
export async function classificarCandidatos(candidatos, opcoes) {
  if (stryMutAct_9fa48("290")) {
    {}
  } else {
    stryCov_9fa48("290");
    const {
      cliente,
      molde,
      categorias,
      tipos,
      versaoDoPrompt,
      esperar = esperarDeVerdade,
      intervaloMs = INTERVALO_PADRAO_MS,
      limite = LIMITE_PADRAO
    } = opcoes;
    if (stryMutAct_9fa48("293") ? false : stryMutAct_9fa48("292") ? true : stryMutAct_9fa48("291") ? cliente : (stryCov_9fa48("291", "292", "293"), !cliente)) return candidatos.map(stryMutAct_9fa48("294") ? () => undefined : (stryCov_9fa48("294"), c => stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
      ...c,
      classificacao: semClassificacao(stryMutAct_9fa48("296") ? "" : (stryCov_9fa48("296"), "sem chave da API"))
    })));
    const esquema = esquemaDaResposta(categorias, tipos);
    const saida = stryMutAct_9fa48("297") ? ["Stryker was here"] : (stryCov_9fa48("297"), []);
    let chamadas = 0;
    for (const candidato of candidatos) {
      if (stryMutAct_9fa48("298")) {
        {}
      } else {
        stryCov_9fa48("298");
        if (stryMutAct_9fa48("302") ? chamadas < limite : stryMutAct_9fa48("301") ? chamadas > limite : stryMutAct_9fa48("300") ? false : stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299", "300", "301", "302"), chamadas >= limite)) {
          if (stryMutAct_9fa48("303")) {
            {}
          } else {
            stryCov_9fa48("303");
            saida.push(stryMutAct_9fa48("305") ? {} : (stryCov_9fa48("305"), {
              ...candidato,
              classificacao: semClassificacao(stryMutAct_9fa48("306") ? `` : (stryCov_9fa48("306"), `passou do limite de ${limite} chamadas desta execução`))
            }));
            continue;
          }
        }
        if (stryMutAct_9fa48("310") ? chamadas <= 0 : stryMutAct_9fa48("309") ? chamadas >= 0 : stryMutAct_9fa48("308") ? false : stryMutAct_9fa48("307") ? true : (stryCov_9fa48("307", "308", "309", "310"), chamadas > 0)) await esperar(intervaloMs);
        stryMutAct_9fa48("311") ? chamadas -= 1 : (stryCov_9fa48("311"), chamadas += 1);
        saida.push(stryMutAct_9fa48("313") ? {} : (stryCov_9fa48("313"), {
          ...candidato,
          classificacao: await classificarUm(candidato)
        }));
      }
    }
    return saida;
    async function classificarUm(candidato) {
      if (stryMutAct_9fa48("314")) {
        {}
      } else {
        stryCov_9fa48("314");
        let texto;
        try {
          if (stryMutAct_9fa48("315")) {
            {}
          } else {
            stryCov_9fa48("315");
            texto = await cliente.gerar(montarPrompt(molde, candidato, categorias, tipos), esquema);
          }
        } catch (erro) {
          if (stryMutAct_9fa48("316")) {
            {}
          } else {
            stryCov_9fa48("316");
            return semClassificacao(stryMutAct_9fa48("317") ? `` : (stryCov_9fa48("317"), `a API falhou: ${stryMutAct_9fa48("318") ? String(erro.message) : (stryCov_9fa48("318"), String(erro.message).slice(0, TAMANHO_DO_MOTIVO))}`));
          }
        }
        const resposta = validarResposta(texto, categorias, tipos);
        if (stryMutAct_9fa48("321") ? false : stryMutAct_9fa48("320") ? true : stryMutAct_9fa48("319") ? resposta.ok : (stryCov_9fa48("319", "320", "321"), !resposta.ok)) return semClassificacao(stryMutAct_9fa48("322") ? `` : (stryCov_9fa48("322"), `resposta inválida: ${resposta.erro}`));
        const {
          categoria,
          tipo,
          definicao,
          exemplo_uso,
          confianca,
          pertinente,
          motivo_pertinencia
        } = resposta.valor;
        const foraDoEscopo = stryMutAct_9fa48("325") ? pertinente !== false : stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : (stryCov_9fa48("323", "324", "325"), pertinente === (stryMutAct_9fa48("326") ? true : (stryCov_9fa48("326"), false)));
        return stryMutAct_9fa48("327") ? {} : (stryCov_9fa48("327"), {
          estado: foraDoEscopo ? FORA_DO_ESCOPO : REVISAR,
          ...(foraDoEscopo ? stryMutAct_9fa48("328") ? {} : (stryCov_9fa48("328"), {
            motivo: motivo_pertinencia
          }) : {}),
          categoria,
          tipo_sugerido: tipo,
          definicao_sugerida: definicao,
          exemplo_sugerido: exemplo_uso,
          confianca,
          modelo: stryMutAct_9fa48("329") ? cliente.ultimoModelo && cliente.modelo : (stryCov_9fa48("329"), cliente.ultimoModelo ?? cliente.modelo),
          prompt_versao: versaoDoPrompt
        });
      }
    }
  }
}
export function resumirClassificacao(lista) {
  if (stryMutAct_9fa48("330")) {
    {}
  } else {
    stryCov_9fa48("330");
    const resumo = stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
      revisar: 0,
      sem_classificacao: 0,
      motivos: {}
    });
    for (const {
      classificacao
    } of lista) {
      if (stryMutAct_9fa48("332")) {
        {}
      } else {
        stryCov_9fa48("332");
        if (stryMutAct_9fa48("335") ? classificacao?.estado !== REVISAR : stryMutAct_9fa48("334") ? false : stryMutAct_9fa48("333") ? true : (stryCov_9fa48("333", "334", "335"), (stryMutAct_9fa48("336") ? classificacao.estado : (stryCov_9fa48("336"), classificacao?.estado)) === REVISAR)) {
          if (stryMutAct_9fa48("337")) {
            {}
          } else {
            stryCov_9fa48("337");
            stryMutAct_9fa48("338") ? resumo.revisar -= 1 : (stryCov_9fa48("338"), resumo.revisar += 1);
            continue;
          }
        }
        stryMutAct_9fa48("339") ? resumo.sem_classificacao -= 1 : (stryCov_9fa48("339"), resumo.sem_classificacao += 1);
        const motivo = stryMutAct_9fa48("340") ? classificacao?.motivo && "sem motivo" : (stryCov_9fa48("340"), (stryMutAct_9fa48("341") ? classificacao.motivo : (stryCov_9fa48("341"), classificacao?.motivo)) ?? (stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), "sem motivo")));
        resumo.motivos[motivo] = stryMutAct_9fa48("343") ? (resumo.motivos[motivo] ?? 0) - 1 : (stryCov_9fa48("343"), (stryMutAct_9fa48("344") ? resumo.motivos[motivo] && 0 : (stryCov_9fa48("344"), resumo.motivos[motivo] ?? 0)) + 1);
      }
    }
    return resumo;
  }
}