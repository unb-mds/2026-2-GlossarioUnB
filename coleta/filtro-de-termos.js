import { FORA_DO_ESCOPO, REVISAR } from "./classificador.js";
import { chave } from "./deduplicar.js";

// Filtro de pertinência do robô (ADR 0014), em três camadas: a lista fixa barra o que já se sabe que não é da
// universidade, o LLM avalia o resto e uma pessoa confere tudo no PR. Funções puras: quem lê o arquivo é o script.

const FORMATO_DA_CHAVE = /^[a-z0-9]+$/;
const FORMATO_DO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SECOES = [
  ["fora_do_escopo", FORMATO_DA_CHAVE],
  ["liberados", FORMATO_DA_CHAVE],
  ["alteracoes_recusadas", FORMATO_DO_ID],
];

const ehObjeto = (valor) => valor !== null && typeof valor === "object" && !Array.isArray(valor);

export function validarFiltro(filtro) {
  const erros = [];
  for (const [secao, formato] of SECOES) {
    if (!ehObjeto(filtro?.[secao])) {
      erros.push(`o filtro precisa da seção ${secao}`);
      continue;
    }
    for (const [id, motivo] of Object.entries(filtro[secao])) {
      if (!formato.test(id)) erros.push(`${secao}: a chave "${id}" está fora do formato`);
      if (typeof motivo !== "string" || motivo.trim() === "") erros.push(`${secao}: "${id}" está sem motivo`);
    }
  }
  if (erros.length > 0) return erros;
  for (const id of Object.keys(filtro.liberados)) {
    if (Object.hasOwn(filtro.fora_do_escopo, id)) erros.push(`"${id}" está ao mesmo tempo em fora_do_escopo e em liberados`);
  }
  return erros;
}

const barrado = (registro, motivo, origem) => ({
  candidato: registro.candidato,
  proposta_id: registro.proposta_id,
  motivo,
  origem,
});

// A recusa do LLM vale enquanto o significado na fonte for o mesmo: assim o termo não gasta chamada toda semana,
// e uma resposta diferente do LLM não abre um PR sem que nada tenha mudado nas fontes.
function recusaAnterior(registro, barradosAntes) {
  const id = chave(registro.candidato.termo);
  return barradosAntes.find(
    (item) =>
      item.origem === "gemini" &&
      chave(item.candidato?.termo ?? "") === id &&
      item.candidato?.significado === registro.candidato.significado,
  );
}

// Roda antes do LLM. Devolve um resultado novo, com `barrados` e `alteracoes_recusadas`.
export function aplicarFiltro(resultado, filtro, { barradosAntes = [] } = {}) {
  const novos = [];
  const barrados = [];
  for (const registro of resultado.novos) {
    const id = chave(registro.candidato.termo);
    if (Object.hasOwn(filtro.liberados, id)) {
      novos.push(registro);
    } else if (Object.hasOwn(filtro.fora_do_escopo, id)) {
      barrados.push(barrado(registro, filtro.fora_do_escopo[id], "lista"));
    } else {
      const anterior = recusaAnterior(registro, barradosAntes);
      if (anterior) barrados.push(barrado(registro, anterior.motivo, "gemini"));
      else novos.push(registro);
    }
  }

  const alterados = [];
  const alteracoesRecusadas = [];
  for (const registro of resultado.alterados) {
    if (Object.hasOwn(filtro.alteracoes_recusadas, registro.id)) {
      alteracoesRecusadas.push({ ...registro, motivo_recusa: filtro.alteracoes_recusadas[registro.id] });
    } else {
      alterados.push(registro);
    }
  }
  return { ...resultado, novos, alterados, barrados, alteracoes_recusadas: alteracoesRecusadas };
}

// Roda depois do LLM. O que uma pessoa liberou volta para a revisão, mesmo que o LLM tenha recusado.
export function separarForaDoEscopo(resultado, filtro) {
  const novos = [];
  const barrados = [...(resultado.barrados ?? [])];
  for (const registro of resultado.novos) {
    const classificacao = registro.candidato.classificacao;
    if (classificacao?.estado !== FORA_DO_ESCOPO) {
      novos.push(registro);
    } else if (Object.hasOwn(filtro.liberados, chave(registro.candidato.termo))) {
      const { motivo: _motivo, ...resto } = classificacao;
      novos.push({ ...registro, candidato: { ...registro.candidato, classificacao: { ...resto, estado: REVISAR } } });
    } else {
      barrados.push(barrado(registro, classificacao.motivo, "gemini"));
    }
  }
  return { ...resultado, novos, barrados };
}
