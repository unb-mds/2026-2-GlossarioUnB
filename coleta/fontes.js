// Formato do coleta/fontes.json (#56, ADR 0009): de onde o robô coleta e como ler cada página.
// Separa o que extrair (o termo) de onde ele está (o trecho e o elemento de cada página), para que
// uma fonte nova seja só uma entrada a mais no fontes.json, sem mexer no coletor.

import { load } from "cheerio";

import { CAMPI, CAMPUS_GERAL, TIPOS } from "../frontend/js/termos.js";

export const PADROES = ["nome-sigla", "sigla-nome", "regex"];
export const FREQUENCIAS = ["diaria", "semanal", "mensal"];
const PADRAO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PADRAO_ELEMENTO = /^[a-z][a-z0-9]*$/;

function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function urlHttps(url) {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

// O padrão "regex" precisa dos grupos (?<termo>…) e (?<significado>…), e a expressão precisa compilar.
function validarExpressao(expressao) {
  if (!textoPreenchido(expressao)) return ["extracao.expressao é obrigatória com o padrão regex"];
  try {
    new RegExp(expressao, "u");
  } catch (erro) {
    return [`extracao.expressao não é uma expressão regular válida: ${erro.message}`];
  }
  if (!expressao.includes("(?<termo>") || !expressao.includes("(?<significado>")) {
    return ["extracao.expressao precisa dos grupos (?<termo>…) e (?<significado>…)"];
  }
  return [];
}

// O trecho é um seletor CSS do bloco de conteúdo (ex.: [itemprop="articleBody"]). O cheerio compila o seletor
// na hora da busca, então um seletor quebrado aparece aqui, e não no meio da coleta.
function validarTrecho(trecho) {
  if (trecho === undefined) return [];
  if (!textoPreenchido(trecho)) {
    return ['extracao.trecho deve ser um seletor CSS do bloco de conteúdo (ex.: [itemprop="articleBody"])'];
  }
  try {
    load("")(trecho);
  } catch (erro) {
    return [`extracao.trecho não é um seletor CSS válido: ${erro.message}`];
  }
  return [];
}

function validarExtracao(extracao) {
  if (typeof extracao !== "object" || extracao === null) return ["extracao deve ser um objeto"];

  const erros = [];
  if (!PADRAO_ELEMENTO.test(extracao.elemento ?? "")) {
    erros.push('extracao.elemento deve ser o nome de uma tag HTML, como "a" ou "li"');
  }
  if (!PADROES.includes(extracao.padrao)) {
    erros.push(`extracao.padrao "${extracao.padrao}" inválido (use: ${PADROES.join(", ")})`);
  }
  if (extracao.padrao === "regex") erros.push(...validarExpressao(extracao.expressao));
  erros.push(...validarTrecho(extracao.trecho));
  if (!Number.isInteger(extracao.minimo) || extracao.minimo < 1) {
    erros.push("extracao.minimo deve ser um inteiro maior ou igual a 1");
  }
  return erros;
}

function validarFonte(fonte) {
  if (typeof fonte !== "object" || fonte === null) return ["fonte deve ser um objeto"];

  const erros = [];
  if (!PADRAO_ID.test(fonte.id ?? "")) erros.push("id deve usar só letras minúsculas sem acento, números e hífens");
  if (!textoPreenchido(fonte.nome)) erros.push("nome é obrigatório");
  if (!urlHttps(fonte.url)) erros.push("url deve ser um link https");
  if (fonte.tipo !== "html") erros.push(`tipo "${fonte.tipo}" inválido (por enquanto só "html")`);
  if (!Number.isInteger(fonte.prioridade) || fonte.prioridade < 1) {
    erros.push("prioridade deve ser um inteiro maior ou igual a 1 (1 é coletada primeiro)");
  }
  if (!FREQUENCIAS.includes(fonte.frequencia)) {
    erros.push(`frequencia "${fonte.frequencia}" inválida (use: ${FREQUENCIAS.join(", ")})`);
  }
  if (fonte.campus !== undefined && ![...CAMPI, CAMPUS_GERAL].includes(fonte.campus)) {
    erros.push(`campus "${fonte.campus}" inválido (use: ${[...CAMPI, CAMPUS_GERAL].join(", ")})`);
  }
  if (fonte.tipo_termo !== undefined && !Object.hasOwn(TIPOS, fonte.tipo_termo)) {
    erros.push(`tipo_termo "${fonte.tipo_termo}" inválido (use: ${Object.keys(TIPOS).join(", ")})`);
  }
  erros.push(...validarExtracao(fonte.extracao));
  return erros;
}

// Valida o arquivo inteiro: cada fonte + ids únicos. Lista vazia = arquivo válido.
export function validarFontes(config) {
  if (typeof config !== "object" || config === null || !Array.isArray(config.fontes)) {
    return ['o arquivo deve ter uma lista "fontes"'];
  }

  const erros = [];
  const idsVistos = new Set();
  config.fontes.forEach((fonte, indice) => {
    const rotulo = `fonte #${indice} (${fonte?.id ?? "sem id"})`;
    erros.push(...validarFonte(fonte).map((erro) => `${rotulo}: ${erro}`));

    if (!textoPreenchido(fonte?.id)) return;
    if (idsVistos.has(fonte.id)) erros.push(`${rotulo}: id duplicado`);
    idsVistos.add(fonte.id);
  });
  return erros;
}
