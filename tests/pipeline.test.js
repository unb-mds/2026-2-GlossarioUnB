import { test } from "node:test";
import assert from "node:assert/strict";

import { classificarNovos } from "../coleta/pipeline.js";

const categorias = [{ id: "vida-academica", nome: "Vida acadêmica", descricao: "Notas, matrícula e calendário." }];
const molde = "{{CATEGORIAS}}\n{{TIPOS}}\n{{TERMO}}\n{{SIGNIFICADO}}\n{{FONTE}}\n{{TRECHO}}";
const tipos = ["sigla"];

function candidato(indice) {
  return {
    termo: `SIGLA${indice}`,
    significado: `Significado ${indice}`,
    fonte: "https://unb.br/",
    fonte_id: "unb",
    trecho: `SIGLA${indice} Significado ${indice}`,
  };
}

function registro(indice) {
  return {
    candidato: candidato(indice),
    motivo: "nenhum termo com essa sigla",
    proposta_id: `sigla${indice}`,
    tambem_em: [],
  };
}

const resultado = (novos, alterados = []) => ({
  novos,
  alterados,
  conflitos: [],
  iguais: [],
  descartados: [],
});

function clienteFalso(chamadas) {
  return {
    modelo: "falso",
    gerar: async (prompt) => {
      chamadas.push(prompt);
      return JSON.stringify({
        categoria: "vida-academica",
        tipo: "sigla",
        definicao: "Definição de teste.",
        exemplo_uso: "Exemplo de teste.",
        confianca: "alta",
      });
    },
  };
}

test("classifica só os termos novos, na ordem, e para no limite de 100 chamadas", async () => {
  const chamadas = [];
  const novos = Array.from({ length: 120 }, (_, indice) => registro(indice));
  const alterado = {
    id: "dpo",
    candidato: candidato(999),
    mudancas: {},
    motivo: "mesmo termo com significado parecido",
  };
  const deduplicado = resultado(novos, [alterado]);

  const classificados = await classificarNovos(deduplicado, {
    cliente: clienteFalso(chamadas),
    molde,
    categorias,
    tipos,
    versaoDoPrompt: "teste",
    esperar: async () => {},
  });

  assert.equal(chamadas.length, 100);
  assert.equal(classificados.length, 120);
  assert.equal(classificados.filter((item) => item.classificacao.estado === "revisar").length, 100);
  assert.equal(classificados.filter((item) => item.classificacao.estado === "sem classificação").length, 20);
  assert.match(classificados[119].classificacao.motivo, /limite de 100 chamadas/);
  assert.equal(deduplicado.novos[0].candidato.classificacao.estado, "revisar");
  assert.equal(deduplicado.novos[119].candidato.classificacao.estado, "sem classificação");
  assert.equal(deduplicado.alterados[0].candidato.classificacao, undefined);
});

test("sem cliente, os termos novos ficam sem classificação e nenhuma chamada é feita", async () => {
  const deduplicado = resultado([registro(0), registro(1)]);
  const classificados = await classificarNovos(deduplicado, {
    cliente: null,
    molde,
    categorias,
    tipos,
    versaoDoPrompt: "teste",
  });

  assert.deepEqual(
    classificados.map((item) => item.classificacao.motivo),
    ["sem chave da API", "sem chave da API"],
  );
  assert.equal(deduplicado.novos[1].candidato.classificacao.estado, "sem classificação");
});
