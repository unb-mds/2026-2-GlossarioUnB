// Coletor genérico de páginas HTML (#56, ADR 0009). Cada fonte do coleta/fontes.json diz onde está o
// conteúdo (trecho, um seletor CSS, e elemento) e como ler cada item (padrão). O HTML é lido pelo cheerio e o
// robots.txt pelo robots-parser, as bibliotecas que a ADR 0010 libera nos scripts do robô. As expressões
// regulares que sobram leem o TEXTO de cada item ("Nome (SIGLA)"), que é o trabalho certo para elas.
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
import robotsParser from "robots-parser";
export const USER_AGENT = stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), "GlossarioUnB-coletor/0.1 (+https://github.com/unb-mds/2026-2-GlossarioUnB)");
export const INTERVALO_MINIMO_MS = 1000;
const juntarEspacos = stryMutAct_9fa48("408") ? () => undefined : (stryCov_9fa48("408"), (() => {
  const juntarEspacos = texto => stryMutAct_9fa48("409") ? texto.replace(/\s+/g, " ") : (stryCov_9fa48("409"), texto.replace(stryMutAct_9fa48("411") ? /\S+/g : stryMutAct_9fa48("410") ? /\s/g : (stryCov_9fa48("410", "411"), /\s+/g), stryMutAct_9fa48("412") ? "" : (stryCov_9fa48("412"), " ")).trim());
  return juntarEspacos;
})());

// O texto que a pessoa vê: sem tags, com as entidades (&amp;, &#233;…) decodificadas pelo parser e espaços juntos.
export function textoDoHtml(fragmento) {
  if (stryMutAct_9fa48("413")) {
    {}
  } else {
    stryCov_9fa48("413");
    return juntarEspacos(load(String(fragmento), null, stryMutAct_9fa48("414") ? true : (stryCov_9fa48("414"), false)).root().text());
  }
}
function elementosDe($, raiz, elemento) {
  if (stryMutAct_9fa48("415")) {
    {}
  } else {
    stryCov_9fa48("415");
    return raiz.find(elemento).toArray().map(stryMutAct_9fa48("416") ? () => undefined : (stryCov_9fa48("416"), no => stryMutAct_9fa48("417") ? {} : (stryCov_9fa48("417"), {
      texto: juntarEspacos($(no).text()),
      href: stryMutAct_9fa48("418") ? $(no).attr("href") && null : (stryCov_9fa48("418"), $(no).attr(stryMutAct_9fa48("419") ? "" : (stryCov_9fa48("419"), "href")) ?? null)
    })));
  }
}

// Cada <elemento> do HTML, com o texto e o href (quando existe).
export function lerElementos(html, elemento) {
  if (stryMutAct_9fa48("420")) {
    {}
  } else {
    stryCov_9fa48("420");
    const $ = load(String(html), null, stryMutAct_9fa48("421") ? true : (stryCov_9fa48("421"), false));
    return elementosDe($, $.root(), elemento);
  }
}

// Os elementos de dentro do trecho, para que menu e rodapé não virem termo. Sem trecho, a página inteira.
function elementosDoTrecho(html, extracao, idFonte) {
  if (stryMutAct_9fa48("422")) {
    {}
  } else {
    stryCov_9fa48("422");
    const $ = load(String(html));
    if (stryMutAct_9fa48("425") ? false : stryMutAct_9fa48("424") ? true : stryMutAct_9fa48("423") ? extracao.trecho : (stryCov_9fa48("423", "424", "425"), !extracao.trecho)) return elementosDe($, $.root(), extracao.elemento);
    const trecho = $(extracao.trecho);
    if (stryMutAct_9fa48("428") ? trecho.length !== 0 : stryMutAct_9fa48("427") ? false : stryMutAct_9fa48("426") ? true : (stryCov_9fa48("426", "427", "428"), trecho.length === 0)) {
      if (stryMutAct_9fa48("429")) {
        {}
      } else {
        stryCov_9fa48("429");
        throw new Error(stryMutAct_9fa48("431") ? `` : (stryCov_9fa48("431"), `fonte "${idFonte}": não achei o trecho (${extracao.trecho}). A estrutura da página mudou?`));
      }
    }
    return elementosDe($, trecho, extracao.elemento);
  }
}
const LEITORES = stryMutAct_9fa48("432") ? {} : (stryCov_9fa48("432"), {
  // "Decanato de Ensino de Graduação (DEG)". A sigla pode ter minúsculas (Sema, Secom), mas começa com maiúscula.
  // A sigla é procurada só no fim do texto, e o nome é o que vem antes: sem regex com partes que disputam os mesmos
  // espaços, que o SonarQube aponta como lenta em texto grande (backtracking).
  "nome-sigla": texto => {
    if (stryMutAct_9fa48("433")) {
      {}
    } else {
      stryCov_9fa48("433");
      const fim = (stryMutAct_9fa48("439") ? /\((\p{Lu}[\p{L}\D]{1,11})\)$/u : stryMutAct_9fa48("438") ? /\((\p{Lu}[\P{L}\d]{1,11})\)$/u : stryMutAct_9fa48("437") ? /\((\p{Lu}[^\p{L}\d]{1,11})\)$/u : stryMutAct_9fa48("436") ? /\((\p{Lu}[\p{L}\d])\)$/u : stryMutAct_9fa48("435") ? /\((\P{Lu}[\p{L}\d]{1,11})\)$/u : stryMutAct_9fa48("434") ? /\((\p{Lu}[\p{L}\d]{1,11})\)/u : (stryCov_9fa48("434", "435", "436", "437", "438", "439"), /\((\p{Lu}[\p{L}\d]{1,11})\)$/u)).exec(texto);
      if (stryMutAct_9fa48("442") ? false : stryMutAct_9fa48("441") ? true : stryMutAct_9fa48("440") ? fim : (stryCov_9fa48("440", "441", "442"), !fim)) return null;
      const significado = stryMutAct_9fa48("444") ? texto.trimEnd() : stryMutAct_9fa48("443") ? texto.slice(0, fim.index).trimStart() : (stryCov_9fa48("443", "444"), texto.slice(0, fim.index).trimEnd());
      if (stryMutAct_9fa48("447") ? !significado && significado.includes("\n") : stryMutAct_9fa48("446") ? false : stryMutAct_9fa48("445") ? true : (stryCov_9fa48("445", "446", "447"), (stryMutAct_9fa48("448") ? significado : (stryCov_9fa48("448"), !significado)) || significado.includes(stryMutAct_9fa48("449") ? "" : (stryCov_9fa48("449"), "\n")))) return null;
      return stryMutAct_9fa48("450") ? {} : (stryCov_9fa48("450"), {
        termo: fim[1],
        significado
      });
    }
  },
  // "DEG – Decanato de Ensino de Graduação" (hífen, travessão ou dois-pontos). Aqui a sigla é toda maiúscula,
  // senão qualquer frase com hífen viraria termo.
  "sigla-nome": texto => {
    if (stryMutAct_9fa48("451")) {
      {}
    } else {
      stryCov_9fa48("451");
      const achado = (stryMutAct_9fa48("464") ? /^([\p{Lu}\d]{2,12})\s*[-–—:]\s*(\S.)$/u : stryMutAct_9fa48("463") ? /^([\p{Lu}\d]{2,12})\s*[-–—:]\s*(\s.*)$/u : stryMutAct_9fa48("462") ? /^([\p{Lu}\d]{2,12})\s*[-–—:]\S*(\S.*)$/u : stryMutAct_9fa48("461") ? /^([\p{Lu}\d]{2,12})\s*[-–—:]\s(\S.*)$/u : stryMutAct_9fa48("460") ? /^([\p{Lu}\d]{2,12})\s*[^-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("459") ? /^([\p{Lu}\d]{2,12})\S*[-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("458") ? /^([\p{Lu}\d]{2,12})\s[-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("457") ? /^([\p{Lu}\D]{2,12})\s*[-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("456") ? /^([\P{Lu}\d]{2,12})\s*[-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("455") ? /^([^\p{Lu}\d]{2,12})\s*[-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("454") ? /^([\p{Lu}\d])\s*[-–—:]\s*(\S.*)$/u : stryMutAct_9fa48("453") ? /^([\p{Lu}\d]{2,12})\s*[-–—:]\s*(\S.*)/u : stryMutAct_9fa48("452") ? /([\p{Lu}\d]{2,12})\s*[-–—:]\s*(\S.*)$/u : (stryCov_9fa48("452", "453", "454", "455", "456", "457", "458", "459", "460", "461", "462", "463", "464"), /^([\p{Lu}\d]{2,12})\s*[-–—:]\s*(\S.*)$/u)).exec(texto);
      return stryMutAct_9fa48("467") ? achado || {
        termo: achado[1],
        significado: achado[2]
      } : stryMutAct_9fa48("466") ? false : stryMutAct_9fa48("465") ? true : (stryCov_9fa48("465", "466", "467"), achado && (stryMutAct_9fa48("468") ? {} : (stryCov_9fa48("468"), {
        termo: achado[1],
        significado: achado[2]
      })));
    }
  }
});
function lerItem(texto, extracao) {
  if (stryMutAct_9fa48("469")) {
    {}
  } else {
    stryCov_9fa48("469");
    if (stryMutAct_9fa48("472") ? extracao.padrao === "regex" : stryMutAct_9fa48("471") ? false : stryMutAct_9fa48("470") ? true : (stryCov_9fa48("470", "471", "472"), extracao.padrao !== (stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), "regex")))) return LEITORES[extracao.padrao](texto);
    const grupos = stryMutAct_9fa48("474") ? new RegExp(extracao.expressao, "u").exec(texto).groups : (stryCov_9fa48("474"), new RegExp(extracao.expressao, stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), "u")).exec(texto)?.groups);
    if (stryMutAct_9fa48("478") ? !grupos?.termo && !grupos?.significado : stryMutAct_9fa48("477") ? false : stryMutAct_9fa48("476") ? true : (stryCov_9fa48("476", "477", "478"), (stryMutAct_9fa48("479") ? grupos?.termo : (stryCov_9fa48("479"), !(stryMutAct_9fa48("480") ? grupos.termo : (stryCov_9fa48("480"), grupos?.termo)))) || (stryMutAct_9fa48("481") ? grupos?.significado : (stryCov_9fa48("481"), !(stryMutAct_9fa48("482") ? grupos.significado : (stryCov_9fa48("482"), grupos?.significado)))))) return null;
    return stryMutAct_9fa48("483") ? {} : (stryCov_9fa48("483"), {
      termo: grupos.termo,
      significado: grupos.significado
    });
  }
}
function linkAbsoluto(href, base) {
  if (stryMutAct_9fa48("484")) {
    {}
  } else {
    stryCov_9fa48("484");
    try {
      if (stryMutAct_9fa48("485")) {
        {}
      } else {
        stryCov_9fa48("485");
        return new URL(href, base).href;
      }
    } catch {
      if (stryMutAct_9fa48("486")) {
        {}
      } else {
        stryCov_9fa48("486");
        return null;
      }
    }
  }
}

// Os candidatos de uma página, cada um com a proveniência (fonte, trecho e data da coleta).
// Achou menos que o mínimo da fonte? Erro com o porquê: é o sinal de que o layout da página mudou.
export function extrairCandidatos(html, fonte, coletadoEm) {
  if (stryMutAct_9fa48("487")) {
    {}
  } else {
    stryCov_9fa48("487");
    const {
      extracao
    } = fonte;
    const vistos = new Set();
    const candidatos = stryMutAct_9fa48("488") ? ["Stryker was here"] : (stryCov_9fa48("488"), []);
    for (const {
      texto,
      href
    } of elementosDoTrecho(html, extracao, fonte.id)) {
      if (stryMutAct_9fa48("489")) {
        {}
      } else {
        stryCov_9fa48("489");
        const item = lerItem(texto, extracao);
        if (stryMutAct_9fa48("492") ? false : stryMutAct_9fa48("491") ? true : stryMutAct_9fa48("490") ? item : (stryCov_9fa48("490", "491", "492"), !item)) continue;
        const termo = stryMutAct_9fa48("493") ? item.termo : (stryCov_9fa48("493"), item.termo.trim());
        if (stryMutAct_9fa48("495") ? false : stryMutAct_9fa48("494") ? true : (stryCov_9fa48("494", "495"), vistos.has(termo))) continue;
        if (stryMutAct_9fa48("496")) {
          ;
        } else {
          stryCov_9fa48("496");
          vistos.add(termo);
        }
        candidatos.push(stryMutAct_9fa48("498") ? {} : (stryCov_9fa48("498"), {
          termo,
          significado: stryMutAct_9fa48("499") ? item.significado : (stryCov_9fa48("499"), item.significado.trim()),
          tipo: stryMutAct_9fa48("500") ? fonte.tipo_termo && "sigla" : (stryCov_9fa48("500"), fonte.tipo_termo ?? (stryMutAct_9fa48("501") ? "" : (stryCov_9fa48("501"), "sigla"))),
          campus: stryMutAct_9fa48("502") ? fonte.campus && "Geral" : (stryCov_9fa48("502"), fonte.campus ?? (stryMutAct_9fa48("503") ? "" : (stryCov_9fa48("503"), "Geral"))),
          link: href ? linkAbsoluto(href, fonte.url) : null,
          fonte: fonte.url,
          fonte_id: fonte.id,
          trecho: texto,
          coletado_em: coletadoEm
        }));
      }
    }
    if (stryMutAct_9fa48("507") ? candidatos.length >= extracao.minimo : stryMutAct_9fa48("506") ? candidatos.length <= extracao.minimo : stryMutAct_9fa48("505") ? false : stryMutAct_9fa48("504") ? true : (stryCov_9fa48("504", "505", "506", "507"), candidatos.length < extracao.minimo)) {
      if (stryMutAct_9fa48("508")) {
        {}
      } else {
        stryCov_9fa48("508");
        throw new Error((stryMutAct_9fa48("510") ? `` : (stryCov_9fa48("510"), `fonte "${fonte.id}": achei ${candidatos.length} candidato(s) em <${extracao.elemento}> com o padrão `)) + (stryMutAct_9fa48("511") ? `` : (stryCov_9fa48("511"), `${extracao.padrao}, e o mínimo é ${extracao.minimo}. A estrutura da página mudou?`)));
      }
    }
    return candidatos;
  }
}

// O robots.txt deixa coletar essa URL? Quem decide é o robots-parser, que segue a RFC 9309: vale o grupo com o
// nosso nome (se não houver, o "*"), a regra mais longa vence e os curingas * e $ são tratados.
// Resposta indefinida (URL de outro site) conta como permitido, como antes.
export function permitidoPeloRobots(robotsTxt, url, userAgent = USER_AGENT) {
  if (stryMutAct_9fa48("512")) {
    {}
  } else {
    stryCov_9fa48("512");
    const robots = robotsParser(new URL(stryMutAct_9fa48("513") ? "" : (stryCov_9fa48("513"), "/robots.txt"), url).href, String(robotsTxt));
    return stryMutAct_9fa48("516") ? robots.isAllowed(url, userAgent) === false : stryMutAct_9fa48("515") ? false : stryMutAct_9fa48("514") ? true : (stryCov_9fa48("514", "515", "516"), robots.isAllowed(url, userAgent) !== (stryMutAct_9fa48("517") ? true : (stryCov_9fa48("517"), false)));
  }
}
const esperarDeVerdade = stryMutAct_9fa48("518") ? () => undefined : (stryCov_9fa48("518"), (() => {
  const esperarDeVerdade = ms => new Promise(stryMutAct_9fa48("519") ? () => undefined : (stryCov_9fa48("519"), resolve => setTimeout(resolve, ms)));
  return esperarDeVerdade;
})());
const hojeEmBrasilia = stryMutAct_9fa48("520") ? () => undefined : (stryCov_9fa48("520"), (() => {
  const hojeEmBrasilia = () => new Date().toLocaleDateString(stryMutAct_9fa48("521") ? "" : (stryCov_9fa48("521"), "sv-SE"), stryMutAct_9fa48("522") ? {} : (stryCov_9fa48("522"), {
    timeZone: stryMutAct_9fa48("523") ? "" : (stryCov_9fa48("523"), "America/Sao_Paulo")
  }));
  return hojeEmBrasilia;
})());

// O robots.txt de um site: o texto (vazio quando não existe) ou o erro, quando o servidor falha (5xx bloqueia o site).
async function lerRobots(pedir, origem) {
  if (stryMutAct_9fa48("524")) {
    {}
  } else {
    stryCov_9fa48("524");
    const resposta = await pedir(stryMutAct_9fa48("525") ? `` : (stryCov_9fa48("525"), `${origem}/robots.txt`));
    if (stryMutAct_9fa48("527") ? false : stryMutAct_9fa48("526") ? true : (stryCov_9fa48("526", "527"), resposta.ok)) return stryMutAct_9fa48("528") ? {} : (stryCov_9fa48("528"), {
      texto: await resposta.text(),
      erro: null
    });
    if (stryMutAct_9fa48("532") ? resposta.status < 500 : stryMutAct_9fa48("531") ? resposta.status > 500 : stryMutAct_9fa48("530") ? false : stryMutAct_9fa48("529") ? true : (stryCov_9fa48("529", "530", "531", "532"), resposta.status >= 500)) return stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
      texto: stryMutAct_9fa48("534") ? "Stryker was here!" : (stryCov_9fa48("534"), ""),
      erro: stryMutAct_9fa48("535") ? `` : (stryCov_9fa48("535"), `o robots.txt de ${origem} respondeu ${resposta.status}`)
    });
    return stryMutAct_9fa48("536") ? {} : (stryCov_9fa48("536"), {
      texto: stryMutAct_9fa48("537") ? "Stryker was here!" : (stryCov_9fa48("537"), ""),
      erro: null
    });
  }
}

// Os candidatos de uma fonte, depois de conferir o robots.txt do site dela. Erro sai com o id da fonte.
async function coletarFonte(fonte, robots, pedir, data) {
  if (stryMutAct_9fa48("538")) {
    {}
  } else {
    stryCov_9fa48("538");
    if (stryMutAct_9fa48("540") ? false : stryMutAct_9fa48("539") ? true : (stryCov_9fa48("539", "540"), robots.erro)) throw new Error(stryMutAct_9fa48("542") ? `` : (stryCov_9fa48("542"), `fonte "${fonte.id}": ${robots.erro}`));
    if (stryMutAct_9fa48("545") ? false : stryMutAct_9fa48("544") ? true : stryMutAct_9fa48("543") ? permitidoPeloRobots(robots.texto, fonte.url) : (stryCov_9fa48("543", "544", "545"), !permitidoPeloRobots(robots.texto, fonte.url))) {
      if (stryMutAct_9fa48("546")) {
        {}
      } else {
        stryCov_9fa48("546");
        throw new Error(stryMutAct_9fa48("548") ? `` : (stryCov_9fa48("548"), `fonte "${fonte.id}": o robots.txt de ${new URL(fonte.url).origin} não permite coletar ${fonte.url}`));
      }
    }
    const resposta = await pedir(fonte.url);
    if (stryMutAct_9fa48("551") ? false : stryMutAct_9fa48("550") ? true : stryMutAct_9fa48("549") ? resposta.ok : (stryCov_9fa48("549", "550", "551"), !resposta.ok)) throw new Error(stryMutAct_9fa48("553") ? `` : (stryCov_9fa48("553"), `fonte "${fonte.id}": a página respondeu ${resposta.status}`));
    return extrairCandidatos(await resposta.text(), fonte, data);
  }
}
const comIdDaFonte = stryMutAct_9fa48("554") ? () => undefined : (stryCov_9fa48("554"), (() => {
  const comIdDaFonte = (fonte, mensagem) => (stryMutAct_9fa48("555") ? mensagem.endsWith("fonte ") : (stryCov_9fa48("555"), mensagem.startsWith(stryMutAct_9fa48("556") ? "" : (stryCov_9fa48("556"), "fonte ")))) ? mensagem : stryMutAct_9fa48("557") ? `` : (stryCov_9fa48("557"), `fonte "${fonte.id}": ${mensagem}`);
  return comIdDaFonte;
})());

// Coleta todas as fontes, da prioridade 1 em diante. Respeita o robots.txt de cada site, espera pelo menos
// 1 s entre pedidos e se identifica pelo user-agent. Uma fonte com erro não para as outras: o erro vai na lista.
export async function coletar(fontes, opcoes = {}) {
  if (stryMutAct_9fa48("558")) {
    {}
  } else {
    stryCov_9fa48("558");
    const {
      buscar = fetch,
      esperar = esperarDeVerdade,
      hoje = hojeEmBrasilia,
      intervaloMs = INTERVALO_MINIMO_MS
    } = opcoes;
    const pausa = stryMutAct_9fa48("559") ? Math.min(intervaloMs, INTERVALO_MINIMO_MS) : (stryCov_9fa48("559"), Math.max(intervaloMs, INTERVALO_MINIMO_MS));
    const robotsPorOrigem = new Map();
    const resultado = stryMutAct_9fa48("560") ? {} : (stryCov_9fa48("560"), {
      candidatos: stryMutAct_9fa48("561") ? ["Stryker was here"] : (stryCov_9fa48("561"), []),
      erros: stryMutAct_9fa48("562") ? ["Stryker was here"] : (stryCov_9fa48("562"), []),
      por_fonte: {}
    });
    let primeiroPedido = stryMutAct_9fa48("563") ? false : (stryCov_9fa48("563"), true);
    const pedir = async url => {
      if (stryMutAct_9fa48("564")) {
        {}
      } else {
        stryCov_9fa48("564");
        if (stryMutAct_9fa48("567") ? false : stryMutAct_9fa48("566") ? true : stryMutAct_9fa48("565") ? primeiroPedido : (stryCov_9fa48("565", "566", "567"), !primeiroPedido)) await esperar(pausa);
        primeiroPedido = stryMutAct_9fa48("568") ? true : (stryCov_9fa48("568"), false);
        return buscar(url, stryMutAct_9fa48("569") ? {} : (stryCov_9fa48("569"), {
          headers: stryMutAct_9fa48("570") ? {} : (stryCov_9fa48("570"), {
            "User-Agent": USER_AGENT
          })
        }));
      }
    };
    for (const fonte of stryMutAct_9fa48("571") ? [...fontes] : (stryCov_9fa48("571"), (stryMutAct_9fa48("572") ? [] : (stryCov_9fa48("572"), [...fontes])).sort(stryMutAct_9fa48("573") ? () => undefined : (stryCov_9fa48("573"), (a, b) => stryMutAct_9fa48("574") ? a.prioridade + b.prioridade : (stryCov_9fa48("574"), a.prioridade - b.prioridade))))) {
      if (stryMutAct_9fa48("575")) {
        {}
      } else {
        stryCov_9fa48("575");
        try {
          if (stryMutAct_9fa48("576")) {
            {}
          } else {
            stryCov_9fa48("576");
            const origem = new URL(fonte.url).origin;
            if (stryMutAct_9fa48("579") ? false : stryMutAct_9fa48("578") ? true : stryMutAct_9fa48("577") ? robotsPorOrigem.has(origem) : (stryCov_9fa48("577", "578", "579"), !robotsPorOrigem.has(origem))) if (stryMutAct_9fa48("580")) {
              ;
            } else {
              stryCov_9fa48("580");
              robotsPorOrigem.set(origem, await lerRobots(pedir, origem));
            }
            const candidatos = await coletarFonte(fonte, robotsPorOrigem.get(origem), pedir, hoje());
            if (stryMutAct_9fa48("581")) {
              ;
            } else {
              stryCov_9fa48("581");
              resultado.candidatos.push(...candidatos);
            }
            resultado.por_fonte[fonte.id] = candidatos.length;
          }
        } catch (erro) {
          if (stryMutAct_9fa48("582")) {
            {}
          } else {
            stryCov_9fa48("582");
            if (stryMutAct_9fa48("583")) {
              ;
            } else {
              stryCov_9fa48("583");
              resultado.erros.push(comIdDaFonte(fonte, erro.message));
            }
            resultado.por_fonte[fonte.id] = 0;
          }
        }
      }
    }
    return resultado;
  }
}