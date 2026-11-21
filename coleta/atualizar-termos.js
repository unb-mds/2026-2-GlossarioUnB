import { CAMPI, CAMPUS_GERAL, TIPOS } from "../frontend/js/termos.js";
import { mesclar } from "./deduplicar.js";

const textoPreenchido = (valor) => typeof valor === "string" && valor.trim() !== "";
const categoriaValida = (categoria, categorias) => categorias.some((item) => item.id === categoria);
const campusValido = (campus) => campus === CAMPUS_GERAL || CAMPI.includes(campus);
const tipoValido = (tipo) => Object.hasOwn(TIPOS, tipo);

function motivoParaNaoAdicionar(registro, categorias) {
  const candidato = registro.candidato ?? {};
  const classificacao = candidato.classificacao;

  if (classificacao?.estado !== "revisar") return classificacao?.motivo ?? "sem classificação revisável";
  if (!categoriaValida(classificacao.categoria, categorias)) return "categoria fora da taxonomia";
  if (!textoPreenchido(registro.proposta_id)) return "candidato sem id proposto";
  if (!textoPreenchido(candidato.termo)) return "candidato sem termo";
  if (!textoPreenchido(candidato.significado)) return "candidato sem significado";
  if (!textoPreenchido(candidato.fonte)) return "candidato sem fonte";
  if (!textoPreenchido(classificacao.definicao_sugerida)) return "classificação sem definição";
  if (!textoPreenchido(classificacao.exemplo_sugerido)) return "classificação sem exemplo de uso";
  if (!tipoValido(classificacao.tipo_sugerido ?? candidato.tipo)) return "tipo sugerido inválido";
  if (candidato.campus !== undefined && !campusValido(candidato.campus)) return "campus inválido";
  return null;
}

function novoTermo(registro) {
  const candidato = registro.candidato;
  const classificacao = candidato.classificacao;
  const tipo = classificacao.tipo_sugerido ?? candidato.tipo;
  const termo = {
    id: registro.proposta_id,
    termo: candidato.termo,
    tipo,
    significado: candidato.significado,
    definicao: classificacao.definicao_sugerida,
    exemplo_uso: classificacao.exemplo_sugerido,
    fonte: candidato.fonte,
    campus: candidato.campus ?? CAMPUS_GERAL,
    categoria: classificacao.categoria,
  };
  return termo;
}

export function atualizarTermos(termos, resultado, { categorias = [] } = {}) {
  const atualizados = mesclar(termos, resultado.alterados);
  const adicionados = [];
  const naoAdicionados = [];
  const idsUsados = new Set(atualizados.map((termo) => termo.id));

  for (const registro of resultado.novos) {
    const motivo = motivoParaNaoAdicionar(registro, categorias);
    if (motivo) {
      naoAdicionados.push({ id: registro.proposta_id, motivo });
      continue;
    }
    const termo = novoTermo(registro);
    if (idsUsados.has(termo.id)) {
      naoAdicionados.push({ id: termo.id, motivo: "id proposto já existe no glossário" });
      continue;
    }
    idsUsados.add(termo.id);
    adicionados.push(termo);
    atualizados.push(termo);
  }

  return { termos: atualizados, adicionados: adicionados.map((termo) => termo.id), naoAdicionados };
}
