// Verificação periódica das fontes (#60, RF07). Uma vez por semana, o robô confere o link de `fonte` de cada termo:
// status HTTP, redirecionamento para outro domínio (ou de https para http) e, quando o servidor informa, se a página
// mudou depois do `verificado_em`. Cada fonte com problema vira uma issue, sem repetir a que já está aberta.
//
// O estado não fica no repositório: o "mudou de conteúdo" sai do Last-Modified da resposta comparado com a data em
// que uma pessoa conferiu o termo. Assim não existe PR semanal só para gravar hashes, e a data continua sendo a da
// última revisão humana (ou da primeira carga feita pelo script com --atualizar).

import { USER_AGENT, permitidoPeloRobots } from "./coletor-html.js";
import { dataValida, urlSegura } from "../frontend/js/validacao-termo.js";

export const TITULO_DO_PROBLEMA = "Termo possivelmente desatualizado";
export const INTERVALO_MINIMO_MS = 1000;
export const TEMPO_LIMITE_MS = 15_000;
// Servidor que devolve Last-Modified igual ao horário do pedido (página dinâmica) não serve para detectar mudança:
// só confiamos no cabeçalho quando ele já tem pelo menos um dia.
export const IDADE_MINIMA_DO_LAST_MODIFIED_MS = 24 * 60 * 60 * 1000;
const SUFIXOS_BR = new Set([
  "adv", "agr", "am", "app", "arq", "art", "ato", "bio", "bmd", "cim", "cng", "cnt", "com", "coop", "des", "det",
  "dev", "ecn", "edu", "emp", "enf", "eng", "esp", "etc", "eti", "far", "flog", "fmd", "fnd", "fot", "fst", "g12",
  "geo", "gov", "imb", "ind", "inf", "jor", "jus", "leg", "leil", "log", "mat", "med", "mil", "mp", "mus", "net",
  "nom", "not", "ntr", "odo", "ong", "org", "ppg", "pro", "psi", "qsl", "radio", "rec", "sci", "seg", "slg", "srv",
  "taxi", "teo", "tmp", "trd", "tur", "tv", "vet", "vlog", "wiki", "zlg",
]);

const textoPreenchido = (valor) => typeof valor === "string" && valor.trim() !== "";
const esperarDeVerdade = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const hojeEmBrasilia = (agora = new Date()) =>
  agora.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });

// A URL sem o #trecho: o pedido HTTP é o mesmo para os vários termos que apontam para páginas do mesmo PDF.
export function chaveDaFonte(url) {
  const endereco = new URL(url);
  endereco.hash = "";
  return endereco.href;
}

// O domínio público, sem o subdomínio: deg.unb.br e unb.br são a mesma organização; golpe.example não é.
export function dominioBase(hostname) {
  const partes = String(hostname).toLowerCase().split(".").filter(Boolean);
  if (partes.length <= 2) return partes.join(".");
  const ultimo = partes.at(-1);
  const penultimo = partes.at(-2);
  if (ultimo === "br" && SUFIXOS_BR.has(penultimo)) return partes.slice(-3).join(".");
  return partes.slice(-2).join(".");
}

// Redirecionamento que merece uma issue: sair da organização da fonte ou cair de https para http.
// Mudar só de subdomínio, de caminho ou de www não conta (é comum nos sites da UnB).
export function redirecionamentoSuspeito(urlOriginal, urlFinal) {
  let original;
  let final;
  try {
    original = new URL(urlOriginal);
    final = new URL(urlFinal);
  } catch {
    return null;
  }

  if (original.protocol === "https:" && final.protocol === "http:") {
    return `o link https foi redirecionado para http (${final.href})`;
  }
  if (dominioBase(original.hostname) !== dominioBase(final.hostname)) {
    return `o link foi redirecionado para outro domínio (${final.href})`;
  }
  return null;
}

// A data em que a fonte foi modificada depois da última verificação do termo. Sem data confiável, não há como saber.
export function mudouDepoisDaVerificacao({ ultimaModificacao, verificadoEm, agora = new Date() }) {
  if (!textoPreenchido(verificadoEm) || !dataValida(verificadoEm)) return null;
  if (!textoPreenchido(ultimaModificacao)) return null;

  const modificadaEm = new Date(ultimaModificacao);
  if (Number.isNaN(modificadaEm.getTime())) return null;
  if (agora.getTime() - modificadaEm.getTime() < IDADE_MINIMA_DO_LAST_MODIFIED_MS) return null;

  const fimDoDiaDaVerificacao = new Date(`${verificadoEm}T23:59:59.999Z`);
  return modificadaEm > fimDoDiaDaVerificacao ? modificadaEm : null;
}

export function tituloDaIssue(termos) {
  const nomes = termos.map((termo) => termo.termo || termo.id).filter(textoPreenchido);
  const primeiros = nomes.slice(0, 3).join(", ");
  const restantes = nomes.length - 3;
  return `${TITULO_DO_PROBLEMA}: ${primeiros}${restantes > 0 ? ` e mais ${restantes}` : ""}`;
}

export function marcadorDaFonte(url) {
  return `<!-- fonte: ${url} -->`;
}

export function marcadorDoCorpo(corpo) {
  return /<!-- fonte: ([^\s]+) -->/.exec(String(corpo ?? ""))?.[1] ?? null;
}

function dataEmTexto(dataIso) {
  if (!dataValida(dataIso)) return null;
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function listaDeTermos(termos) {
  return termos.map((termo) => {
    const verificado = dataEmTexto(termo.verificado_em);
    return `- \`${termo.id}\` — ${termo.termo || termo.id}${verificado ? ` (verificado em ${verificado})` : ""}`;
  });
}

export function corpoDaIssue(problema) {
  const linhas = [
    marcadorDaFonte(problema.url),
    "",
    "A verificação periódica das fontes encontrou um problema neste link usado por termos do glossário.",
    "",
    `- **Fonte:** ${problema.url}`,
    ...problema.motivos.map((motivo) => `- **Problema:** ${motivo}`),
    "",
    `**Termos afetados (${problema.termos.length}):**`,
    "",
    ...listaDeTermos(problema.termos),
    "",
    "### O que fazer",
    "",
    "1. Abra a fonte e confira se a página ainda existe e se o termo e a definição continuam valendo.",
    "2. Se a página mudou de endereço, atualize o campo `fonte` de cada termo em `frontend/data/termos.json`.",
    "3. Se a definição ou o exemplo ficaram desatualizados, corrija pelo caminho normal de revisão.",
    "4. Ponha `verificado_em` com a data da conferência no formato `aaaa-mm-dd` e feche esta issue.",
    "",
    "> Issue criada automaticamente pelo workflow \"Verificação das fontes\" (#60). Não é preciso abrir outra issue para esta fonte.",
  ];
  return `${linhas.join("\n")}\n`;
}

// Os grupos de termos que compartilham a mesma fonte (sem o #trecho), mais as fontes que não são URL (texto).
export function agruparPorFonte(termos) {
  const grupos = new Map();
  const ignoradas = [];

  for (const termo of termos) {
    const url = urlSegura(termo?.fonte);
    if (!url) {
      ignoradas.push({ id: termo?.id, fonte: termo?.fonte });
      continue;
    }

    const chave = chaveDaFonte(url);
    if (!grupos.has(chave)) grupos.set(chave, { url: chave, termos: [] });
    grupos.get(chave).termos.push({ id: termo.id, termo: termo.termo, verificado_em: termo.verificado_em });
  }
  return { fontes: [...grupos.values()], ignoradas };
}

function mensagemDoErro(erro, tempoLimiteMs) {
  if (erro?.name === "TimeoutError" || erro?.name === "AbortError") {
    return `a fonte não respondeu em ${Math.round(tempoLimiteMs / 1000)} s`;
  }
  return `não foi possível acessar a fonte: ${erro?.message ?? "erro desconhecido"}`;
}

async function descartarCorpo(resposta) {
  if (!resposta?.body) return;
  await resposta.body.cancel().catch(() => undefined);
}

function ultimaModificacaoDe(resposta) {
  return resposta.headers?.get?.("last-modified") ?? null;
}

// Uma issue por fonte, com todos os termos que dependem dela (o PDI, por exemplo, é fonte de mais de 150 termos:
// uma issue por termo seria ruído). O corpo leva um marcador invisível para a execução seguinte não duplicar a issue.
export function planejarIssues(problemas, issuesAbertas = []) {
  const abertas = new Set(issuesAbertas.map((issue) => marcadorDoCorpo(issue.body)).filter(Boolean));
  return {
    abrir: problemas.filter((problema) => !abertas.has(problema.url)).map((problema) => ({
      titulo: tituloDaIssue(problema.termos),
      corpo: corpoDaIssue(problema),
      url: problema.url,
    })),
    existentes: problemas.filter((problema) => abertas.has(problema.url)).map((problema) => problema.url),
  };
}

// Devolve os termos com a data de verificação atualizada para as fontes que responderam bem e não mudaram.
// A data é a do dia em Brasília, a mesma usada na coleta, e só entra com --atualizar (carga inicial ou revisão manual).
export function atualizarVerificados(termos, resultado) {
  const verificados = new Set(resultado.verificados);
  return termos.map((termo) => (verificados.has(termo.id) ? { ...termo, verificado_em: resultado.data } : termo));
}

// Confere todas as fontes, uma vez cada, respeitando o robots.txt e o intervalo mínimo entre pedidos.
export async function verificarFontes(termos, opcoes = {}) {
  const {
    buscar = fetch,
    esperar = esperarDeVerdade,
    agora = new Date(),
    data = hojeEmBrasilia(agora),
    intervaloMs = INTERVALO_MINIMO_MS,
    tempoLimiteMs = TEMPO_LIMITE_MS,
  } = opcoes;
  const { fontes, ignoradas } = agruparPorFonte(termos);
  const pausa = Math.max(intervaloMs, INTERVALO_MINIMO_MS);
  const robotsPorOrigem = new Map();
  const resultado = { data, fontes: [], problemas: [], verificados: [], ignoradas, erros: [] };
  let primeiroPedido = true;

  const pedir = async (url, { lerCorpo = false } = {}) => {
    if (!primeiroPedido) await esperar(pausa);
    primeiroPedido = false;
    const resposta = await buscar(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(tempoLimiteMs),
    });
    if (!lerCorpo) await descartarCorpo(resposta);
    return resposta;
  };

  const lerRobots = async (origem) => {
    try {
      const resposta = await pedir(`${origem}/robots.txt`, { lerCorpo: true });
      if (resposta.ok) return { texto: await resposta.text(), erro: null };
      if (resposta.status >= 500) return { texto: "", erro: `o robots.txt de ${origem} respondeu ${resposta.status}` };
      return { texto: "", erro: null };
    } catch (erro) {
      return { texto: "", erro: `não foi possível ler o robots.txt de ${origem}: ${erro.message}` };
    }
  };

  for (const fonte of fontes) {
    const origem = new URL(fonte.url).origin;

    if (!robotsPorOrigem.has(origem)) robotsPorOrigem.set(origem, await lerRobots(origem));
    const robots = robotsPorOrigem.get(origem);
    if (robots.erro) {
      resultado.erros.push(robots.erro);
      resultado.fontes.push({ ...fonte, status: null, ok: false, motivo: robots.erro });
      continue;
    }
    if (!permitidoPeloRobots(robots.texto, fonte.url)) {
      const aviso = `o robots.txt de ${origem} não permite verificar ${fonte.url}`;
      resultado.erros.push(aviso);
      resultado.fontes.push({ ...fonte, status: null, ok: false, motivo: aviso });
      continue;
    }

    let resposta;
    try {
      resposta = await pedir(fonte.url);
    } catch (erro) {
      const aviso = `fonte ${fonte.url}: ${mensagemDoErro(erro, tempoLimiteMs)}`;
      resultado.erros.push(aviso);
      resultado.problemas.push({ ...fonte, status: null, final: null, motivos: [mensagemDoErro(erro, tempoLimiteMs)] });
      continue;
    }

    const final = resposta.url || fonte.url;
    const motivos = [];
    if (!resposta.ok) motivos.push(`a fonte respondeu ${resposta.status}`);
    const redirecionamento = redirecionamentoSuspeito(fonte.url, final);
    if (redirecionamento) motivos.push(redirecionamento);

    const modificadaEm = ultimaModificacaoDe(resposta);
    const termosQueMudaram = [];
    if (motivos.length === 0) {
      for (const termo of fonte.termos) {
        if (mudouDepoisDaVerificacao({ ultimaModificacao: modificadaEm, verificadoEm: termo.verificado_em, agora })) {
          termosQueMudaram.push(termo);
        }
      }
    }

    if (motivos.length > 0) {
      resultado.problemas.push({ ...fonte, status: resposta.status, final, motivos });
      resultado.fontes.push({ ...fonte, status: resposta.status, ok: false, final, motivo: motivos.join("; ") });
      continue;
    }
    if (termosQueMudaram.length > 0) {
      const datas = termosQueMudaram
        .map((termo) => termo.verificado_em)
        .filter((valor, indice, lista) => dataValida(valor) && lista.indexOf(valor) === indice);
      const motivo = datas.length === 1
        ? `a fonte foi modificada depois da verificação de ${dataEmTexto(datas[0])}`
        : "a fonte foi modificada depois da última verificação dos termos abaixo";
      resultado.problemas.push({ ...fonte, status: resposta.status, final, motivos: [motivo], termos: termosQueMudaram });
      resultado.fontes.push({ ...fonte, status: resposta.status, ok: false, final, motivo });
      continue;
    }

    resultado.verificados.push(...fonte.termos.map((termo) => termo.id));
    resultado.fontes.push({ ...fonte, status: resposta.status, ok: true, final, motivo: null });
  }

  return resultado;
}
