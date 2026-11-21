import { resumirClassificacao } from "./classificador.js";

export const LIMITE_DE_LINHAS_NO_PR = 100;

const juntarEspacos = (texto) => String(texto ?? "").replace(/\s+/g, " ").trim();
const celula = (texto) => juntarEspacos(texto).replaceAll("|", "\\|");

function linkDaFonte(candidato, tambemEm = []) {
  const rotulo = candidato.fonte_id || "fonte";
  const principal = candidato.fonte ? `[${celula(rotulo)}](${candidato.fonte})` : celula(rotulo);
  const outras = tambemEm.map((url) => `<${url}>`);
  return [principal, ...outras].join("<br>");
}

function classificacaoDoCandidato(candidato) {
  const classificacao = candidato.classificacao;
  // Na #59, só os termos novos passam pelo LLM: alterados e conflitos não são classificados.
  if (!classificacao) return "não classificada nesta execução";
  if (classificacao.estado === "revisar") {
    return `revisar: ${classificacao.categoria} (${classificacao.confianca})`;
  }
  const motivo = classificacao.motivo ? `: ${classificacao.motivo}` : "";
  return `sem classificação${motivo}`;
}

function tabelaDeBarrados(barrados) {
  return [
    "| Termo | Significado | Por quê | Fonte |",
    "|---|---|---|---|",
    ...barrados.map(({ candidato, motivo }) =>
      `| ${celula(candidato.termo)} | ${celula(candidato.significado)} | ${celula(motivo)} | ${linkDaFonte(candidato)} |`),
  ];
}

// O que o filtro tirou fica no PR para uma pessoa conferir (ADR 0014).
function secoesDoFiltro(relatorio) {
  const barrados = relatorio.termos.barrados ?? [];
  const recusadas = relatorio.termos.alteracoes_recusadas ?? [];
  const peloLlm = barrados.filter((item) => item.origem === "gemini");
  const pelaLista = barrados.filter((item) => item.origem === "lista");
  const linhas = [];
  if (peloLlm.length > 0) {
    linhas.push("", `### Barrados pelo Gemini: confira cada um (${peloLlm.length})`, "",
      "Se algum for da universidade, ponha em `liberados` no `coleta/filtro-de-termos.json`. Se o Gemini acertou, ponha em `fora_do_escopo`.", "",
      ...tabelaDeBarrados(peloLlm));
  }
  if (pelaLista.length > 0) {
    linhas.push("", `### Barrados pela lista fixa (${pelaLista.length})`, "",
      "<details><summary>Ver a lista (regra em <code>coleta/filtro-de-termos.json</code>)</summary>", "",
      ...tabelaDeBarrados(pelaLista), "", "</details>");
  }
  if (recusadas.length > 0) {
    linhas.push("", `### Alterações recusadas (${recusadas.length})`, "",
      "A fonte propôs um texto, mas o termo publicado foi mantido.", "",
      "| Termo | A fonte propôs | Por que foi recusado |", "|---|---|---|",
      ...recusadas.map((item) =>
        `| ${celula(item.candidato?.termo)} | ${celula(item.mudancas?.significado?.para)} | ${celula(item.motivo_recusa)} |`));
  }
  return linhas;
}

function significadoDoRegistro(situacao, registro) {
  if (situacao === "Alterado") {
    const mudanca = registro.mudancas?.significado;
    if (mudanca) return `${mudanca.de} → ${mudanca.para}`;
  }
  return registro.candidato?.significado ?? "";
}

function detalheDoRegistro(situacao, registro) {
  const partes = [];
  if (situacao === "Alterado" && registro.id) partes.push(`id: ${registro.id}`);
  if (situacao === "Conflito" && registro.id_existente) partes.push(`existente: ${registro.id_existente}`);
  if (situacao === "Novo") {
    partes.push(
      registro.adicionado
        ? "incluído no termos.json"
        : `não incluído no termos.json: ${registro.motivo_adicao ?? "sem classificação revisável"}`,
    );
  }
  if (registro.proposta_id) partes.push(`proposta: ${registro.proposta_id}`);
  if (registro.tambem_em?.length) partes.push(`também em: ${registro.tambem_em.join(", ")}`);
  partes.push(registro.motivo);
  return partes.join("; ");
}

// Quantos termos cada modelo respondeu: mostra no PR quando a rodada precisou do modelo reserva (decisão 48).
function contarModelos(classificados) {
  const modelos = {};
  for (const { classificacao } of classificados) {
    if (classificacao?.estado === "revisar" && classificacao.modelo) {
      modelos[classificacao.modelo] = (modelos[classificacao.modelo] ?? 0) + 1;
    }
  }
  return modelos;
}

export function montarRelatorio({
  coletadoEm,
  geradoEm = new Date().toISOString(),
  porFonte = {},
  erros = [],
  classificados = [],
  resultado,
  totalDeCandidatos = classificados.length,
}) {
  const totais = {
    candidatos: totalDeCandidatos,
    novos: resultado.novos.length,
    alterados: resultado.alterados.length,
    conflitos: resultado.conflitos.length,
    iguais: resultado.iguais.length,
    descartados: resultado.descartados.length,
    barrados: (resultado.barrados ?? []).length,
    alteracoes_recusadas: (resultado.alteracoes_recusadas ?? []).length,
  };
  const contabilizados =
    totais.novos + totais.alterados + totais.conflitos + totais.iguais + totais.descartados +
    totais.barrados + totais.alteracoes_recusadas;

  return {
    coletado_em: coletadoEm,
    gerado_em: geradoEm,
    totais: {
      ...totais,
      duplicados: Math.max(0, totais.candidatos - contabilizados),
      mudancas: totais.novos + totais.alterados + totais.conflitos,
    },
    por_fonte: { ...porFonte },
    classificacao: resumirClassificacao(classificados),
    modelos: contarModelos(classificados),
    erros: [...erros],
    termos: {
      novos: resultado.novos,
      alterados: resultado.alterados,
      conflitos: resultado.conflitos,
      barrados: resultado.barrados ?? [],
      alteracoes_recusadas: resultado.alteracoes_recusadas ?? [],
    },
  };
}

export function temMudancas(relatorio) {
  return (relatorio?.totais?.mudancas ?? 0) > 0;
}

// O conteúdo do relatório sem as datas, inclusive a de cada termo: elas mudam em toda execução e não são uma
// mudança de verdade.
export function relatorioSemData(relatorio) {
  const semDatas = (campo, valor) => (campo === "coletado_em" || campo === "gerado_em" ? undefined : valor);
  return JSON.parse(JSON.stringify(relatorio ?? {}, semDatas));
}

// Mudou em relação ao relatório que já está no repositório? Sem relatório anterior, conta como mudança.
export function relatorioMudou(novo, anterior) {
  if (!anterior) return true;
  return JSON.stringify(relatorioSemData(novo)) !== JSON.stringify(relatorioSemData(anterior));
}

export function gerarCorpoDoPr(relatorio, { limite = LIMITE_DE_LINHAS_NO_PR } = {}) {
  const { totais, classificacao, erros } = relatorio;
  const linhas = [
    `## Coleta automática de termos — ${relatorio.coletado_em}`,
    "",
    `**Resumo:** ${totais.candidatos} candidato(s), ${totais.novos} novo(s), ${totais.alterados} ` +
      `alterado(s), ${totais.conflitos} conflito(s), ${totais.iguais} igual(is), ${totais.descartados} ` +
      `descartado(s), ${totais.duplicados} duplicado(s).`,
    "",
    "### Totais por fonte",
    "",
    "| Fonte | Candidatos |",
    "|---|---:|",
    ...Object.entries(relatorio.por_fonte).map(([fonte, total]) => `| ${celula(fonte)} | ${total} |`),
    "",
    "### Classificação dos termos novos",
    "",
    `- Para revisar: ${classificacao.revisar}`,
    `- Sem classificação: ${classificacao.sem_classificacao}`,
    ...(Object.keys(relatorio.modelos ?? {}).length > 0
      ? [`- Modelos que responderam: ${Object.entries(relatorio.modelos).map(([m, n]) => `${celula(m)} (${n})`).join(", ")}`]
      : []),
    ...Object.entries(classificacao.motivos).map(([motivo, total]) => `  - ${celula(motivo)}: ${total}`),
  ];

  if (erros.length > 0) {
    linhas.push("", "### Avisos", "", ...erros.map((erro) => `- ${celula(erro)}`));
  }

  const grupos = [
    ["Novo", relatorio.termos.novos],
    ["Alterado", relatorio.termos.alterados],
    ["Conflito", relatorio.termos.conflitos],
  ];
  const total = grupos.reduce((soma, [, registros]) => soma + registros.length, 0);

  linhas.push("", "### Termos para revisão", "");
  if (total === 0) {
    linhas.push("Nenhuma mudança de termo.");
  } else {
    linhas.push("| Situação | Termo | Significado | Fonte | LLM | Detalhe |", "|---|---|---|---|---|---|");
    let mostrados = 0;
    for (const [situacao, registros] of grupos) {
      for (const registro of registros) {
        if (mostrados >= limite) break;
        const candidato = registro.candidato ?? {};
        linhas.push(
          `| ${situacao} | ${celula(candidato.termo)} | ${celula(significadoDoRegistro(situacao, registro))} | ` +
            `${linkDaFonte(candidato, registro.tambem_em)} | ${celula(classificacaoDoCandidato(candidato))} | ` +
            `${celula(detalheDoRegistro(situacao, registro))} |`,
        );
        mostrados += 1;
      }
      if (mostrados >= limite) break;
    }
    if (mostrados < total) {
      linhas.push("", `Mostrando ${mostrados} de ${total} termo(s); o restante está em \`coleta/relatorio.json\`.`);
    }
  }

  linhas.push(...secoesDoFiltro(relatorio));

  linhas.push(
    "",
    "> O robô atualiza `frontend/data/termos.json` com o significado das alterações e com termos novos " +
      "que tenham classificação revisável. A definição e o exemplo dos termos novos são rascunhos do LLM " +
      "e precisam ser conferidos na revisão humana. O robô nunca faz merge.",
  );
  return `${linhas.join("\n")}\n`;
}
