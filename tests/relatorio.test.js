import { test } from "node:test";
import assert from "node:assert/strict";

import { gerarCorpoDoPr, montarRelatorio, temMudancas } from "../coleta/relatorio.js";

const novo = {
  candidato: {
    termo: "SAA",
    significado: "Secretaria de Administração Acadêmica",
    fonte: "https://unb.br/administrativo-rodape/secretarias",
    fonte_id: "unb-secretarias",
    classificacao: { estado: "revisar", categoria: "administracao", confianca: "alta" },
  },
  motivo: "nenhum termo com essa sigla, sinônimo ou significado",
  proposta_id: "saa",
  tambem_em: [],
  adicionado: true,
};

const alterado = {
  id: "dpo",
  candidato: {
    termo: "DPO",
    significado: "Decanato de Planejamento, Orçamento e Avaliação Institucional",
    fonte: "https://exemplo.unb.br/dpo",
    fonte_id: "dpo-siglas",
    classificacao: { estado: "sem classificação", motivo: "sem chave da API" },
  },
  mudancas: {
    significado: {
      de: "Decanato de Planejamento, Orçamento e Avaliação",
      para: "Decanato de Planejamento, Orçamento e Avaliação Institucional",
    },
  },
  motivo: "mesmo termo de dpo, com significado parecido",
  tambem_em: ["https://outra-fonte.unb.br/"],
};

const conflito = {
  id_existente: "ip",
  candidato: {
    termo: "IP",
    significado: "Internet Protocol | Protocolo de Internet",
    fonte: "https://exemplo.unb.br/ip",
    fonte_id: "fonte-exemplo",
    classificacao: { estado: "revisar", categoria: "sistemas", confianca: "baixa" },
  },
  motivo: "mesmo termo de ip com outro significado",
  proposta_id: "ip-internet",
  tambem_em: [],
};

const descartado = {
  candidato: {
    ...novo.candidato,
    termo: "XYZ",
    significado: "Sem uso",
    classificacao: { estado: "sem classificação", motivo: "sem chave da API" },
  },
  motivo: "candidato sem termo ou sem significado",
};

const resultado = {
  novos: [novo],
  alterados: [alterado],
  conflitos: [conflito],
  iguais: [{ candidato: novo.candidato }],
  descartados: [descartado],
};

const classificados = [
  novo.candidato,
  alterado.candidato,
  conflito.candidato,
  novo.candidato,
  descartado.candidato,
];

const relatorio = montarRelatorio({
  coletadoEm: "2026-11-19",
  geradoEm: "2026-11-19T12:00:00.000Z",
  porFonte: { "unb-secretarias": 10, "dpo-siglas": 5 },
  erros: ["fonte \"dpo-siglas\": rede fora"],
  classificados,
  resultado,
});

test("montarRelatorio guarda a data, os totais por fonte e a classificação", () => {
  assert.equal(relatorio.coletado_em, "2026-11-19");
  assert.equal(relatorio.gerado_em, "2026-11-19T12:00:00.000Z");
  assert.deepEqual(relatorio.totais, {
    candidatos: 5,
    novos: 1,
    alterados: 1,
    conflitos: 1,
    iguais: 1,
    descartados: 1,
    duplicados: 0,
    mudancas: 3,
  });
  assert.deepEqual(relatorio.por_fonte, { "unb-secretarias": 10, "dpo-siglas": 5 });
  assert.deepEqual(relatorio.classificacao, { revisar: 3, sem_classificacao: 2, motivos: { "sem chave da API": 2 } });
  assert.deepEqual(relatorio.erros, ["fonte \"dpo-siglas\": rede fora"]);
  assert.equal(relatorio.termos.novos.length, 1);
});

test("temMudancas só é verdadeiro quando há termo novo, alterado ou conflito", () => {
  assert.equal(temMudancas(relatorio), true);
  assert.equal(
    temMudancas({ totais: { mudancas: 0 } }),
    false,
  );
});

test("gerarCorpoDoPr monta a tabela com fonte, LLM, detalhe e avisos", () => {
  const corpo = gerarCorpoDoPr(relatorio);
  assert.match(corpo, /## Coleta automática de termos — 2026-11-19/);
  assert.match(corpo, /\*\*Resumo:\*\* 5 candidato\(s\), 1 novo\(s\), 1 alterado\(s\), 1 conflito\(s\)/);
  assert.match(corpo, /0 duplicado\(s\)/);
  assert.match(corpo, /\| dpo-siglas \| 5 \|/);
  assert.match(corpo, /\| Novo \| SAA \| Secretaria de Administração Acadêmica \|/);
  assert.match(corpo, /\[unb-secretarias\]\(https:\/\/unb\.br\/administrativo-rodape\/secretarias\)/);
  assert.match(corpo, /revisar: administracao \(alta\)/);
  assert.match(corpo, /proposta: saa; nenhum termo com essa sigla/);
  assert.match(corpo, /Decanato de Planejamento, Orçamento e Avaliação → Decanato de Planejamento, Orçamento e Avaliação Institucional/);
  assert.match(corpo, /também em: https:\/\/outra-fonte\.unb\.br\//);
  assert.match(corpo, /Internet Protocol \\\| Protocolo de Internet/);
  assert.match(corpo, /sem classificação: sem chave da API/);
  assert.match(corpo, /incluído no termos\.json/);
  assert.match(corpo, /### Avisos/);
  assert.match(corpo, /atualiza `frontend\/data\/termos\.json`/);
  assert.match(corpo, /rascunhos do LLM/);
  assert.match(corpo, /nunca faz merge/);
});

test("gerarCorpoDoPr explica quando um termo novo não entrou no termos.json", () => {
  const corpo = gerarCorpoDoPr(
    montarRelatorio({
      coletadoEm: "2026-11-19",
      resultado: {
        novos: [{ ...novo, adicionado: false, motivo_adicao: "classificação sem definição" }],
        alterados: [],
        conflitos: [],
        iguais: [],
        descartados: [],
      },
    }),
  );
  assert.match(corpo, /não incluído no termos\.json: classificação sem definição/);
});

test("gerarCorpoDoPr limita a tabela e aponta o relatório completo", () => {
  const corpo = gerarCorpoDoPr(relatorio, { limite: 1 });
  assert.match(corpo, /Mostrando 1 de 3 termo\(s\); o restante está em `coleta\/relatorio\.json`/);
});

test("gerarCorpoDoPr sem mudanças não abre tabela de termos", () => {
  const vazio = montarRelatorio({
    coletadoEm: "2026-11-19",
    geradoEm: "2026-11-19T12:00:00.000Z",
    resultado: { novos: [], alterados: [], conflitos: [], iguais: [], descartados: [] },
  });
  assert.equal(temMudancas(vazio), false);
  assert.match(gerarCorpoDoPr(vazio), /Nenhuma mudança de termo/);
});
