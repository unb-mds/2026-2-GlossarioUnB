import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

import { INTERVALO_MINIMO_MS, USER_AGENT, permitidoPeloRobots } from "../coletor-html.js";

export const PDF_URL = "https://planejamento.unb.br/images/Central_de_Conte%C3%BAdos/PDI_UnB__2023_2028.pdf";
export const FONTE_ID = "dpo-siglas";
export const PAGINAS_DA_LISTA = [5, 6, 7, 8];
export const LIMITES_DE_COLUNA = [250, 490, 710];

const CABECALHO = /^(XX|\+|LISTA DE SIGLAS E ABREVIAÇÕES|Para acessar a lista.*|gráficos e figuras,?|clique aqui\.?|\d+)$/i;

const juntarEspacos = (texto) => texto.replace(/\s+/g, " ").trim();
const DISTANCIA_DE_ESPACO = 0.1; // em relação à altura da letra
const hojeEmBrasilia = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
const esperarDeVerdade = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// O robots.txt do site do PDF: o texto (vazio quando não existe) ou o erro, quando o servidor falha
// (5xx bloqueia o site). Mesma regra do coletor de HTML (RNF09).
async function lerRobots(pedir, origem) {
  const resposta = await pedir(`${origem}/robots.txt`);
  if (resposta.ok) return { texto: await resposta.text(), erro: null };
  if (resposta.status >= 500) return { texto: "", erro: `o robots.txt de ${origem} respondeu ${resposta.status}` };
  return { texto: "", erro: null };
}

function colunaDe(x) {
  if (x < LIMITES_DE_COLUNA[0]) return 0;
  if (x < LIMITES_DE_COLUNA[1]) return 1;
  if (x < LIMITES_DE_COLUNA[2]) return 2;
  return 3;
}

function linhasPorColuna(itens) {
  const colunas = [[], [], [], []];
  for (const item of itens) {
    if (!item.str?.trim()) continue;
    const x = Math.round(item.transform[4] * 10) / 10;
    const y = Math.round(item.transform[5] * 10) / 10;
    colunas[colunaDe(x)].push({ x, y, fim: item.transform[4] + item.width, altura: item.height, texto: item.str, fonte: item.fontName });
  }

  return colunas.map((itensDaColuna) => {
    const porY = new Map();
    for (const item of itensDaColuna) {
      const linha = porY.get(item.y) ?? [];
      linha.push(item);
      porY.set(item.y, linha);
    }
    return [...porY.entries()]
      .sort(([a], [b]) => b - a)
      .map(([, linha]) => linha.sort((a, b) => a.x - b.x));
  });
}

// O PDF guarda letras acentuadas em pedaços separados ("N", "ú", "cleo"): só há espaço quando há distância entre eles.
function textoDaLinha(linha) {
  return linha.reduce((texto, item, indice) => {
    if (indice === 0) return item.texto;
    const anterior = linha[indice - 1];
    const distancia = item.x - anterior.fim;
    const colado = distancia < Math.max(anterior.altura, item.altura, 1) * DISTANCIA_DE_ESPACO;
    return `${texto}${colado ? "" : " "}${item.texto}`;
  }, "");
}

function ehInicioDeEntrada(linha) {
  if (linha.length < 2) return false;
  const primeiro = linha[0].texto.trim();
  return !/\s/.test(primeiro) && /[A-Za-zÀ-ÿ0-9]/.test(primeiro) && linha[0].fonte !== linha[1].fonte;
}

function candidatoDe(sigla, significado, pagina, coletadoEm) {
  return {
    termo: sigla,
    significado,
    tipo: "sigla",
    campus: "Geral",
    orgao_superior: null,
    fonte: PDF_URL,
    fonte_url: PDF_URL,
    fonte_id: FONTE_ID,
    pagina,
    trecho: juntarEspacos(`${sigla} ${significado}`),
    coletado_em: coletadoEm,
  };
}

export async function extrairSiglasDoPdf(dados, opcoes = {}) {
  const { paginas = PAGINAS_DA_LISTA, coletadoEm = hojeEmBrasilia() } = opcoes;
  const dadosDoPdf = new Uint8Array(dados);
  const documento = await pdfjs.getDocument({ data: dadosDoPdf }).promise;
  const candidatos = [];
  const vistos = new Set();

  try {
    for (const pagina of paginas) {
      if (!Number.isInteger(pagina) || pagina < 1 || pagina > documento.numPages) {
        throw new Error(`página ${pagina} não existe no PDF (1 a ${documento.numPages})`);
      }

      const conteudo = await (await documento.getPage(pagina)).getTextContent();
      for (const coluna of linhasPorColuna(conteudo.items)) {
        let atual = null;
        for (const linha of coluna) {
          const texto = juntarEspacos(textoDaLinha(linha));
          if (!texto || CABECALHO.test(texto)) continue;

          if (ehInicioDeEntrada(linha)) {
            const achado = /^(\S+)\s+(.+)$/.exec(texto);
            if (!achado) continue;
            const chave = `${achado[1]}\u0000${achado[2]}`;
            if (vistos.has(chave)) {
              atual = null;
              continue;
            }
            vistos.add(chave);
            atual = candidatoDe(achado[1], achado[2], pagina, coletadoEm);
            candidatos.push(atual);
          } else if (atual) {
            atual.significado = juntarEspacos(`${atual.significado}${atual.significado.endsWith("-") ? "" : " "}${texto}`);
            atual.trecho = juntarEspacos(`${atual.termo} ${atual.significado}`);
          }
        }
      }
    }
  } finally {
    await documento.destroy();
  }

  return candidatos;
}

export async function baixarPdf(url = PDF_URL, opcoes = {}) {
  const { buscar = fetch } = opcoes;
  const resposta = await buscar(url, { headers: { "User-Agent": USER_AGENT } });
  if (!resposta.ok) throw new Error(`a DPO respondeu ${resposta.status}`);

  const tipo = resposta.headers?.get?.("content-type") ?? "ausente";
  const dados = new Uint8Array(await resposta.arrayBuffer());
  const assinatura = String.fromCharCode(...dados.subarray(0, 5));
  if (assinatura !== "%PDF-") {
    throw new Error(`a resposta não é um PDF (content-type: ${tipo})`);
  }
  return dados;
}

export async function coletarDpo(opcoes = {}) {
  const {
    buscar = fetch,
    paginas = PAGINAS_DA_LISTA,
    hoje = hojeEmBrasilia,
    coletadoEm = hoje(),
    esperar = esperarDeVerdade,
    intervaloMs = INTERVALO_MINIMO_MS,
  } = opcoes;
  const pausa = Math.max(intervaloMs, INTERVALO_MINIMO_MS);
  const resultado = {
    fonte_url: PDF_URL,
    coletado_em: coletadoEm,
    candidatos: [],
    erros: [],
    por_fonte: { [FONTE_ID]: 0 },
  };

  // O robots.txt vem antes do PDF, com o mesmo intervalo mínimo entre pedidos do RNF09.
  let primeiroPedido = true;
  const pedir = async (url, opcoesDoPedido = {}) => {
    if (!primeiroPedido) await esperar(pausa);
    primeiroPedido = false;
    return buscar(url, { ...opcoesDoPedido, headers: { "User-Agent": USER_AGENT, ...opcoesDoPedido.headers } });
  };

  try {
    const origem = new URL(PDF_URL).origin;
    const robots = await lerRobots(pedir, origem);
    if (robots.erro) throw new Error(robots.erro);
    if (!permitidoPeloRobots(robots.texto, PDF_URL)) {
      throw new Error(`o robots.txt de ${origem} não permite coletar ${PDF_URL}`);
    }

    const dados = await baixarPdf(PDF_URL, { buscar: pedir });
    const candidatos = await extrairSiglasDoPdf(dados, { paginas, coletadoEm });
    if (candidatos.length === 0) throw new Error("nenhuma sigla encontrada; a estrutura do PDF mudou?");
    resultado.candidatos = candidatos;
    resultado.por_fonte[FONTE_ID] = candidatos.length;
  } catch (erro) {
    resultado.erros.push(`fonte "${FONTE_ID}": ${erro.message}`);
  }

  return resultado;
}

export async function salvarDpo(resultado, caminho) {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, `${JSON.stringify(resultado, null, 2)}\n`, "utf8");
}
