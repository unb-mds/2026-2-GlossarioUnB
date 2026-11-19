import { test } from "node:test";
import assert from "node:assert/strict";

import { atualizarTermos } from "../coleta/atualizar-termos.js";
import { validarGlossario } from "../frontend/js/validacao-termo.js";

const termoExistente = {
  id: "dpo",
  termo: "DPO",
  tipo: "sigla",
  significado: "Decanato de Planejamento, Orçamento e Avaliação",
  definicao: "Definição escrita por uma pessoa.",
  exemplo_uso: "A DPO publicou o calendário.",
  fonte: "https://dpo.unb.br/",
  campus: "Darcy Ribeiro",
};

function candidato(alteracoes = {}) {
  return {
    termo: "SAA",
    significado: "Secretaria de Administração Acadêmica",
    fonte: "https://unb.br/administrativo-rodape/secretarias",
    fonte_id: "unb-secretarias",
    campus: "Darcy Ribeiro",
    tipo: "sigla",
    classificacao: {
      estado: "revisar",
      categoria: "administracao",
      confianca: "alta",
      tipo_sugerido: "sigla",
      definicao_sugerida: "Órgão responsável pela administração acadêmica da UnB.",
      exemplo_sugerido: "A SAA divulgou o calendário acadêmico.",
    },
    ...alteracoes,
  };
}

const resultado = (novos = [], alterados = []) => ({
  novos,
  alterados,
  conflitos: [],
  iguais: [],
  descartados: [],
});

const categorias = [{ id: "administracao" }, { id: "ensino" }];

test("adiciona termo novo revisável com os campos sugeridos pelo LLM", () => {
  const novo = { candidato: candidato(), proposta_id: "saa", motivo: "sem termo igual" };
  const atualizacao = atualizarTermos([], resultado([novo]), { categorias });

  assert.deepEqual(atualizacao.adicionados, ["saa"]);
  assert.deepEqual(atualizacao.naoAdicionados, []);
  assert.deepEqual(atualizacao.termos, [
    {
      id: "saa",
      termo: "SAA",
      tipo: "sigla",
      significado: "Secretaria de Administração Acadêmica",
      definicao: "Órgão responsável pela administração acadêmica da UnB.",
      exemplo_uso: "A SAA divulgou o calendário acadêmico.",
      fonte: "https://unb.br/administrativo-rodape/secretarias",
      campus: "Darcy Ribeiro",
      categoria: "administracao",
    },
  ]);
  assert.deepEqual(validarGlossario(atualizacao.termos), []);
});

test("termo sem classificação revisável fica fora do arquivo e explica o motivo", () => {
  const novo = {
    candidato: candidato({ classificacao: { estado: "sem classificação", motivo: "sem chave da API" } }),
    proposta_id: "saa",
    motivo: "sem termo igual",
  };
  const atualizacao = atualizarTermos([], resultado([novo]), { categorias });

  assert.deepEqual(atualizacao.termos, []);
  assert.deepEqual(atualizacao.adicionados, []);
  assert.deepEqual(atualizacao.naoAdicionados, [{ id: "saa", motivo: "sem chave da API" }]);
});

test("não adiciona classificação sem definição ou exemplo", () => {
  const novo = {
    candidato: candidato({
      classificacao: {
        ...candidato().classificacao,
        definicao_sugerida: "  ",
      },
    }),
    proposta_id: "saa",
    motivo: "sem termo igual",
  };
  const atualizacao = atualizarTermos([], resultado([novo]), { categorias });

  assert.deepEqual(atualizacao.adicionados, []);
  assert.deepEqual(atualizacao.naoAdicionados, [{ id: "saa", motivo: "classificação sem definição" }]);
});

test("não adiciona termo com id já usado", () => {
  const novo = { candidato: candidato(), proposta_id: "dpo", motivo: "sem termo igual" };
  const atualizacao = atualizarTermos([structuredClone(termoExistente)], resultado([novo]), { categorias });

  assert.deepEqual(atualizacao.adicionados, []);
  assert.deepEqual(atualizacao.naoAdicionados, [{ id: "dpo", motivo: "id proposto já existe no glossário" }]);
});

test("aplica só o significado de termo alterado e preserva definição e exemplo humanos", () => {
  const original = [structuredClone(termoExistente)];
  const antes = structuredClone(original);
  const alterado = {
    id: "dpo",
    candidato: candidato({ termo: "DPO", significado: "Novo significado" }),
    mudancas: {
      significado: {
        de: "Decanato de Planejamento, Orçamento e Avaliação",
        para: "Novo significado",
      },
    },
    motivo: "mesmo termo com significado parecido",
  };
  const atualizacao = atualizarTermos(original, resultado([], [alterado]), { categorias });

  assert.deepEqual(atualizacao.adicionados, []);
  assert.deepEqual(atualizacao.naoAdicionados, []);
  assert.equal(atualizacao.termos[0].significado, "Novo significado");
  assert.equal(atualizacao.termos[0].definicao, termoExistente.definicao);
  assert.equal(atualizacao.termos[0].exemplo_uso, termoExistente.exemplo_uso);
  assert.deepEqual(original, antes);
});

test("categoria fora da taxonomia não é gravada, mas o termo continua válido", () => {
  const novo = {
    candidato: candidato({
      classificacao: {
        ...candidato().classificacao,
        categoria: "categoria-inexistente",
      },
    }),
    proposta_id: "saa",
    motivo: "sem termo igual",
  };
  const atualizacao = atualizarTermos([], resultado([novo]), { categorias });

  assert.deepEqual(atualizacao.adicionados, ["saa"]);
  assert.equal(atualizacao.termos[0].categoria, undefined);
  assert.deepEqual(validarGlossario(atualizacao.termos), []);
});

test("usa campus Geral quando o candidato não informa campus", () => {
  const novo = {
    candidato: candidato({ campus: undefined }),
    proposta_id: "saa",
    motivo: "sem termo igual",
  };
  const atualizacao = atualizarTermos([], resultado([novo]), { categorias });

  assert.equal(atualizacao.termos[0].campus, "Geral");
});
