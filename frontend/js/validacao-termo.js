// Validação do schema do termo (ADR 0004). Única fonte dessa regra:
// usada pelo app (descarta termo inválido) e pelos testes/CI (bloqueia PR inválido).

import { CAMPI, CAMPUS_GERAL, ORIGENS, TIPOS } from "./termos.js";

const PADRAO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PADRAO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const CAMPOS_TEXTO_OBRIGATORIOS = ["id", "termo", "tipo", "definicao", "exemplo_uso", "fonte", "campus"];

function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function dataValida(dataStr) {
  if (typeof dataStr !== "string" || !PADRAO_DATA.test(dataStr)) return false;
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia
  );
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

function validarSinonimos(sinonimos) {
  if (!Array.isArray(sinonimos)) {
    return ["sinonimos deve ser uma lista de textos"];
  }
  const erros = [];
  const vistos = new Set();
  sinonimos.forEach((sinonimo, i) => {
    if (!textoPreenchido(sinonimo)) {
      erros.push(`sinonimos[${i}] deve ser um texto não vazio`);
    } else {
      const normalizado = sinonimo.trim().toLowerCase();
      if (vistos.has(normalizado)) {
        erros.push(`sinonimos[${i}] sinônimo duplicado "${sinonimo.trim()}"`);
      }
      vistos.add(normalizado);
    }
  });
  return erros;
}

function validarRelacionados(relacionados, idTermo) {
  if (!Array.isArray(relacionados)) {
    return ["relacionados deve ser uma lista de ids"];
  }
  const erros = [];
  const vistos = new Set();
  relacionados.forEach((idRel, i) => {
    if (typeof idRel !== "string" || !PADRAO_ID.test(idRel)) {
      erros.push(`relacionados[${i}] "${idRel}" deve usar só letras minúsculas sem acento, números e hífens`);
    } else {
      if (idRel === idTermo) {
        erros.push(`relacionados[${i}] não pode apontar para o próprio termo ("${idRel}")`);
      }
      if (vistos.has(idRel)) {
        erros.push(`relacionados[${i}] id duplicado "${idRel}"`);
      }
      vistos.add(idRel);
    }
  });
  return erros;
}

function validarSaibaMais(saibaMais) {
  if (typeof saibaMais !== "string" || !urlSegura(saibaMais)) {
    return ["saiba_mais deve ser um link absoluto http(s)"];
  }
  return [];
}

function validarOrigem(termo) {
  const erros = [];
  const { origem, coletado_em } = termo;

  if (origem !== undefined) {
    if (!ORIGENS.includes(origem)) {
      erros.push(`origem "${origem}" inválida (use: ${ORIGENS.join(", ")})`);
    }
  }

  if (coletado_em !== undefined) {
    if (!dataValida(coletado_em)) {
      erros.push("coletado_em deve ser uma data válida no formato AAAA-MM-DD");
    }
    if (origem !== "coleta") {
      erros.push('coletado_em só deve ser informado quando origem for "coleta"');
    }
  }

  if (origem === "coleta" && coletado_em === undefined) {
    erros.push('termo com origem "coleta" precisa de coletado_em');
  }

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
  // Object.hasOwn e não `in`: `in` aceitaria chaves herdadas como "toString".
  if (textoPreenchido(termo.tipo) && !Object.hasOwn(TIPOS, termo.tipo)) {
    erros.push(`tipo "${termo.tipo}" inválido (use: ${Object.keys(TIPOS).join(", ")})`);
  }
  if (termo.tipo === "sigla" && !textoPreenchido(termo.significado)) {
    erros.push("sigla precisa de significado (forma por extenso)");
  }
  if (textoPreenchido(termo.campus) && ![...CAMPI, CAMPUS_GERAL].includes(termo.campus)) {
    erros.push(`campus "${termo.campus}" inválido (use: ${[...CAMPI, CAMPUS_GERAL].join(", ")})`);
  }
  if (termo.localizacao !== undefined) erros.push(...validarLocalizacao(termo.localizacao));
  if (termo.sinonimos !== undefined) erros.push(...validarSinonimos(termo.sinonimos));
  if (termo.relacionados !== undefined) erros.push(...validarRelacionados(termo.relacionados, termo.id));
  if (termo.saiba_mais !== undefined) erros.push(...validarSaibaMais(termo.saiba_mais));
  if (termo.origem !== undefined || termo.coletado_em !== undefined) {
    erros.push(...validarOrigem(termo));
  }

  return erros;
}

// Valida o arquivo inteiro: cada termo + ids únicos + integridade dos relacionados. Mensagens indicam qual termo falhou.
export function validarGlossario(termos) {
  if (!Array.isArray(termos)) return ["o arquivo de termos deve conter uma lista (array)"];

  const erros = [];
  const idsVistos = new Set();
  const todosIds = new Set(termos.map((t) => t?.id).filter(textoPreenchido));

  termos.forEach((termo, indice) => {
    const rotulo = `termo #${indice} (${termo?.id ?? "sem id"})`;
    erros.push(...validarTermo(termo).map((erro) => `${rotulo}: ${erro}`));

    if (!textoPreenchido(termo?.id)) return;
    if (idsVistos.has(termo.id)) erros.push(`${rotulo}: id duplicado`);
    idsVistos.add(termo.id);

    if (Array.isArray(termo?.relacionados)) {
      termo.relacionados.forEach((idRel) => {
        if (typeof idRel === "string" && !todosIds.has(idRel)) {
          erros.push(`${rotulo}: id relacionado "${idRel}" não existe no glossário`);
        }
      });
    }
  });
  return erros;
}
