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
  if (classificacao?.estado === "revisar") {
    return `revisar: ${classificacao.categoria} (${classificacao.confianca})`;
  }
  const motivo = classificacao?.motivo ? `: ${classificacao.motivo}` : "";
  return `sem classificação${motivo}`;
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

export function montarRelatorio({
  coletadoEm,
  geradoEm = new Date().toISOString(),
  porFonte = {},
  erros = [],
  classificados = [],
  resultado,
}) {
  const totais = {
    candidatos: classificados.length,
    novos: resultado.novos.length,
    alterados: resultado.alterados.length,
    conflitos: resultado.conflitos.length,
    iguais: resultado.iguais.length,
    descartados: resultado.descartados.length,
  };
  const contabilizados =
    totais.novos + totais.alterados + totais.conflitos + totais.iguais + totais.descartados;

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
    erros: [...erros],
    termos: {
      novos: resultado.novos,
      alterados: resultado.alterados,
      conflitos: resultado.conflitos,
    },
  };
}

export function temMudancas(relatorio) {
  return (relatorio?.totais?.mudancas ?? 0) > 0;
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
    "### Classificação",
    "",
    `- Para revisar: ${classificacao.revisar}`,
    `- Sem classificação: ${classificacao.sem_classificacao}`,
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

  linhas.push(
    "",
    "> O robô atualiza `frontend/data/termos.json` com o significado das alterações e com termos novos " +
      "que tenham classificação revisável. A definição e o exemplo dos termos novos são rascunhos do LLM " +
      "e precisam ser conferidos na revisão humana. O robô nunca faz merge.",
  );
  return `${linhas.join("\n")}\n`;
}
