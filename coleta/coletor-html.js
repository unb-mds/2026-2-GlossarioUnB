// Coletor genérico de páginas HTML (#56, ADR 0009). Cada fonte do coleta/fontes.json diz onde está o
// conteúdo (trecho, um seletor CSS, e elemento) e como ler cada item (padrão). O HTML é lido pelo cheerio e o
// robots.txt pelo robots-parser, as bibliotecas que a ADR 0010 libera nos scripts do robô. As expressões
// regulares que sobram leem o TEXTO de cada item ("Nome (SIGLA)"), que é o trabalho certo para elas.
import { load } from "cheerio";
import robotsParser from "robots-parser";

export const USER_AGENT = "GlossarioUnB-coletor/0.1 (+https://github.com/unb-mds/2026-2-GlossarioUnB)";
export const INTERVALO_MINIMO_MS = 1000;

const juntarEspacos = (texto) => texto.replace(/\s+/g, " ").trim();

// O texto que a pessoa vê: sem tags, com as entidades (&amp;, &#233;…) decodificadas pelo parser e espaços juntos.
export function textoDoHtml(fragmento) {
  return juntarEspacos(load(String(fragmento), null, false).root().text());
}

function elementosDe($, raiz, elemento) {
  return raiz
    .find(elemento)
    .toArray()
    .map((no) => ({ texto: juntarEspacos($(no).text()), href: $(no).attr("href") ?? null }));
}

// Cada <elemento> do HTML, com o texto e o href (quando existe).
export function lerElementos(html, elemento) {
  const $ = load(String(html), null, false);
  return elementosDe($, $.root(), elemento);
}

// Os elementos de dentro do trecho, para que menu e rodapé não virem termo. Sem trecho, a página inteira.
function elementosDoTrecho(html, extracao, idFonte) {
  const $ = load(String(html));
  if (!extracao.trecho) return elementosDe($, $.root(), extracao.elemento);

  const trecho = $(extracao.trecho);
  if (trecho.length === 0) {
    throw new Error(`fonte "${idFonte}": não achei o trecho (${extracao.trecho}). A estrutura da página mudou?`);
  }
  return elementosDe($, trecho, extracao.elemento);
}

const LEITORES = {
  // "Decanato de Ensino de Graduação (DEG)". A sigla pode ter minúsculas (Sema, Secom), mas começa com maiúscula.
  // A sigla é procurada só no fim do texto, e o nome é o que vem antes: sem regex com partes que disputam os mesmos
  // espaços, que o SonarQube aponta como lenta em texto grande (backtracking).
  "nome-sigla": (texto) => {
    const fim = /\((\p{Lu}[\p{L}\d]{1,11})\)$/u.exec(texto);
    if (!fim) return null;
    const significado = texto.slice(0, fim.index).trimEnd();
    if (!significado || significado.includes("\n")) return null;
    return { termo: fim[1], significado };
  },
  // "DEG – Decanato de Ensino de Graduação" (hífen, travessão ou dois-pontos). Aqui a sigla é toda maiúscula,
  // senão qualquer frase com hífen viraria termo.
  "sigla-nome": (texto) => {
    const achado = /^([\p{Lu}\d]{2,12})\s*[-–—:]\s*(\S.*)$/u.exec(texto);
    return achado && { termo: achado[1], significado: achado[2] };
  },
};

function lerItem(texto, extracao) {
  if (extracao.padrao !== "regex") return LEITORES[extracao.padrao](texto);

  const grupos = new RegExp(extracao.expressao, "u").exec(texto)?.groups;
  if (!grupos?.termo || !grupos?.significado) return null;
  return { termo: grupos.termo, significado: grupos.significado };
}

function linkAbsoluto(href, base) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

// Os candidatos de uma página, cada um com a proveniência (fonte, trecho e data da coleta).
// Achou menos que o mínimo da fonte? Erro com o porquê: é o sinal de que o layout da página mudou.
export function extrairCandidatos(html, fonte, coletadoEm) {
  const { extracao } = fonte;
  const vistos = new Set();
  const candidatos = [];

  for (const { texto, href } of elementosDoTrecho(html, extracao, fonte.id)) {
    const item = lerItem(texto, extracao);
    if (!item) continue;
    const termo = item.termo.trim();
    if (vistos.has(termo)) continue;
    vistos.add(termo);
    candidatos.push({
      termo,
      significado: item.significado.trim(),
      tipo: fonte.tipo_termo ?? "sigla",
      campus: fonte.campus ?? "Geral",
      link: href ? linkAbsoluto(href, fonte.url) : null,
      fonte: fonte.url,
      fonte_id: fonte.id,
      trecho: texto,
      coletado_em: coletadoEm,
    });
  }

  if (candidatos.length < extracao.minimo) {
    throw new Error(
      `fonte "${fonte.id}": achei ${candidatos.length} candidato(s) em <${extracao.elemento}> com o padrão ` +
        `${extracao.padrao}, e o mínimo é ${extracao.minimo}. A estrutura da página mudou?`,
    );
  }
  return candidatos;
}

// O robots.txt deixa coletar essa URL? Quem decide é o robots-parser, que segue a RFC 9309: vale o grupo com o
// nosso nome (se não houver, o "*"), a regra mais longa vence e os curingas * e $ são tratados.
// Resposta indefinida (URL de outro site) conta como permitido, como antes.
export function permitidoPeloRobots(robotsTxt, url, userAgent = USER_AGENT) {
  const robots = robotsParser(new URL("/robots.txt", url).href, String(robotsTxt));
  return robots.isAllowed(url, userAgent) !== false;
}

const esperarDeVerdade = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hojeEmBrasilia = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });

// Coleta todas as fontes, da prioridade 1 em diante. Respeita o robots.txt de cada site, espera pelo menos
// 1 s entre pedidos e se identifica pelo user-agent. Uma fonte com erro não para as outras: o erro vai na lista.
export async function coletar(fontes, opcoes = {}) {
  const { buscar = fetch, esperar = esperarDeVerdade, hoje = hojeEmBrasilia, intervaloMs = INTERVALO_MINIMO_MS } = opcoes;
  const pausa = Math.max(intervaloMs, INTERVALO_MINIMO_MS);
  const robotsPorOrigem = new Map();
  const resultado = { candidatos: [], erros: [], por_fonte: {} };
  let primeiroPedido = true;

  const pedir = async (url) => {
    if (!primeiroPedido) await esperar(pausa);
    primeiroPedido = false;
    return buscar(url, { headers: { "User-Agent": USER_AGENT } });
  };

  for (const fonte of [...fontes].sort((a, b) => a.prioridade - b.prioridade)) {
    try {
      const origem = new URL(fonte.url).origin;
      if (!robotsPorOrigem.has(origem)) {
        const resposta = await pedir(`${origem}/robots.txt`);
        const robots = { texto: "", erro: null };
        if (resposta.ok) robots.texto = await resposta.text();
        else if (resposta.status >= 500) robots.erro = `o robots.txt de ${origem} respondeu ${resposta.status}`;
        robotsPorOrigem.set(origem, robots);
      }
      const robots = robotsPorOrigem.get(origem);
      if (robots.erro) throw new Error(`fonte "${fonte.id}": ${robots.erro}`);
      if (!permitidoPeloRobots(robots.texto, fonte.url)) {
        throw new Error(`fonte "${fonte.id}": o robots.txt de ${origem} não permite coletar ${fonte.url}`);
      }
      const resposta = await pedir(fonte.url);
      if (!resposta.ok) throw new Error(`fonte "${fonte.id}": a página respondeu ${resposta.status}`);

      const candidatos = extrairCandidatos(await resposta.text(), fonte, hoje());
      resultado.candidatos.push(...candidatos);
      resultado.por_fonte[fonte.id] = candidatos.length;
    } catch (erro) {
      resultado.erros.push(erro.message.startsWith("fonte ") ? erro.message : `fonte "${fonte.id}": ${erro.message}`);
      resultado.por_fonte[fonte.id] = 0;
    }
  }
  return resultado;
}
