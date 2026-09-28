// Validação do schema do termo (ADR 0004). Única fonte dessa regra:
// usada pelo app (descarta termo inválido) e pelos testes/CI (bloqueia PR inválido).

import { CAMPI, CAMPUS_GERAL, TIPOS } from "./termos.js";

const PADRAO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CAMPOS_TEXTO_OBRIGATORIOS = ["id", "termo", "tipo", "definicao", "exemplo_uso", "fonte", "campus"];

function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

// Só aceita links absolutos http(s); qualquer outro esquema (ex.: javascript:) vira null.
export function urlSegura(url) {
  try {
    const endereco = new URL(url);
    return endereco.protocol === "https:" || endereco.protocol === "http:" ? endereco.href : null;
  } catch {
    return null;
  }
}

function validarLocalizacao(localizacao) {
  if (typeof localizacao !== "object" || localizacao === null) return ["localizacao deve ser um objeto"];

  const erros = [];
  const { lat, lng, link_como_chegar } = localizacao;
  if (typeof lat !== "number" || lat < -90 || lat > 90) erros.push("localizacao.lat deve ser um número entre -90 e 90");
  if (typeof lng !== "number" || lng < -180 || lng > 180) erros.push("localizacao.lng deve ser um número entre -180 e 180");
  if (!urlSegura(link_como_chegar)) erros.push("localizacao.link_como_chegar deve ser um link http(s)");
  return erros;
}

// Retorna a lista de problemas do termo; lista vazia = termo válido.
export function validarTermo(termo) {
  if (typeof termo !== "object" || termo === null) return ["termo deve ser um objeto"];

  const erros = CAMPOS_TEXTO_OBRIGATORIOS
    .filter((campo) => !textoPreenchido(termo[campo]))
    .map((campo) => `campo obrigatório ausente ou vazio: ${campo}`);

  if (textoPreenchido(termo.id) && !PADRAO_ID.test(termo.id)) {
    erros.push(`id "${termo.id}" deve usar só letras minúsculas sem acento, números e hífens`);
  }
  if (textoPreenchido(termo.tipo) && !(termo.tipo in TIPOS)) {
    erros.push(`tipo "${termo.tipo}" inválido (use: ${Object.keys(TIPOS).join(", ")})`);
  }
  if (termo.tipo === "sigla" && !textoPreenchido(termo.significado)) {
    erros.push("sigla precisa de significado (forma por extenso)");
  }
  if (textoPreenchido(termo.campus) && ![...CAMPI, CAMPUS_GERAL].includes(termo.campus)) {
    erros.push(`campus "${termo.campus}" inválido (use: ${[...CAMPI, CAMPUS_GERAL].join(", ")})`);
  }
  if (termo.localizacao !== undefined) erros.push(...validarLocalizacao(termo.localizacao));

  return erros;
}

// Valida o arquivo inteiro: cada termo + ids únicos. Mensagens indicam qual termo falhou.
export function validarGlossario(termos) {
  if (!Array.isArray(termos)) return ["o arquivo de termos deve conter uma lista (array)"];

  const erros = [];
  const idsVistos = new Set();
  termos.forEach((termo, indice) => {
    const rotulo = `termo #${indice} (${termo?.id ?? "sem id"})`;
    erros.push(...validarTermo(termo).map((erro) => `${rotulo}: ${erro}`));

    if (!textoPreenchido(termo?.id)) return;
    if (idsVistos.has(termo.id)) erros.push(`${rotulo}: id duplicado`);
    idsVistos.add(termo.id);
  });
  return erros;
}
