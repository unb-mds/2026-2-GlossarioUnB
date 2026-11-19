// Deduplicação (#57): normalização, os três casos (novo, alterado, conflito), termo repetido com outro id,
// os valores-limite da semelhança e a regra de nunca sobrescrever o que uma pessoa escreveu.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  PARECIDO_A_PARTIR_DE,
  chave,
  classificar,
  mesclar,
  normalizar,
  repetidosNoGlossario,
  semelhanca,
} from "../coleta/deduplicar.js";

const termosReais = JSON.parse(await readFile(new URL("../frontend/data/termos.json", import.meta.url), "utf-8"));
// A SAA entrou na base com a trilha do calouro (#70). Os testes do caso novo tiram ela da base
// para continuar testando uma sigla real que ainda não existe.
const semASaa = termosReais.filter((t) => t.id !== "saa");

function termo(id, nome, significado, extra = {}) {
  return { id, termo: nome, tipo: "sigla", significado, definicao: `Definição de ${nome} escrita por uma pessoa.`,
    exemplo_uso: `Exemplo de ${nome}.`, fonte: "https://unb.br/", campus: "Geral", ...extra };
}

function candidato(nome, significado, fonte = "https://unb.br/administrativo-rodape/decanatos") {
  return { termo: nome, significado, tipo: "sigla", fonte, coletado_em: "2026-11-11" };
}

test("normalizar tira acento, caixa, pontuação e espaços sobrando", () => {
  assert.equal(normalizar("  Decanato   de Ensino, de Graduação! "), "decanato de ensino de graduacao");
  assert.equal(normalizar("Ação/Inovação—Ciência"), "acao inovacao ciencia");
  assert.equal(normalizar(""), "");
  assert.equal(normalizar(null), "");
  assert.equal(normalizar(undefined), "");
});

test("chave junta as variações da mesma sigla", () => {
  assert.equal(chave("U.n.B"), "unb");
  assert.equal(chave("UnB"), "unb");
  assert.equal(chave(" Sema "), "sema");
  assert.equal(chave(""), "");
});

test("semelhanca conta palavras em comum sem as palavras vazias", () => {
  assert.equal(semelhanca("Decanato de Extensão", "decanato extensao"), 1);
  assert.equal(semelhanca("", "de e da"), 1);
  assert.equal(semelhanca("Instituto de Psicologia", "Internet Protocol"), 0);
});

test("caso novo: sigla, sinônimo e significado que não existem", () => {
  const { novos, alterados, conflitos } = classificar([candidato("SAA", "Secretaria de Administração Acadêmica")], semASaa);
  assert.equal(novos.length, 1);
  assert.equal(novos[0].proposta_id, "saa");
  assert.match(novos[0].motivo, /nenhum termo com essa sigla/);
  assert.equal(alterados.length + conflitos.length, 0);
});

test("caso igual: mesma sigla e mesmo significado, mesmo com acento ou caixa diferente", () => {
  // No termos.json está "Decanato de Assuntos Comunitarios" (sem acento); a página da UnB tem o acento.
  const { iguais, alterados } = classificar([candidato("DAC", "Decanato de Assuntos Comunitários"), candidato("Sema", "Secretaria de Meio Ambiente")], termosReais);
  assert.deepEqual(iguais.map((i) => i.id), ["dac", "sema"]);
  assert.equal(alterados.length, 0);
});

test("caso alterado: o nome ganhou uma palavra (DPO), proposta de atualizar só o significado", () => {
  const { alterados } = classificar([candidato("DPO", "Decanato de Planejamento, Orçamento e Avaliação Institucional")], termosReais);
  assert.equal(alterados.length, 1);
  assert.equal(alterados[0].id, "dpo");
  assert.deepEqual(alterados[0].mudancas, {
    significado: { de: "Decanato de Planejamento, Orçamento e Avaliação", para: "Decanato de Planejamento, Orçamento e Avaliação Institucional" },
  });
  assert.match(alterados[0].motivo, /80% das palavras em comum/);
});

test("caso alterado: termo existente sem significado recebe o da coleta", () => {
  const { alterados } = classificar([candidato("BCE", "Biblioteca Central")], [termo("bce", "BCE", "")]);
  assert.equal(alterados.length, 1);
  assert.match(alterados[0].motivo, /estava sem significado/);
});

test("caso conflito: mesma sigla com outro significado propõe desambiguação e não sobrescreve", () => {
  const existentes = [termo("ip", "IP", "Instituto de Psicologia")];
  const { conflitos, alterados } = classificar([candidato("IP", "Internet Protocol")], existentes);
  assert.equal(conflitos.length, 1);
  assert.equal(conflitos[0].id_existente, "ip");
  assert.equal(conflitos[0].proposta_id, "ip-internet");
  assert.match(conflitos[0].motivo, /nada foi sobrescrito/);
  assert.equal(alterados.length, 0);
  assert.equal(existentes[0].significado, "Instituto de Psicologia");
});

test("valor-limite: exatamente 60% de palavras em comum é alterado; 50% já é conflito", () => {
  assert.equal(PARECIDO_A_PARTIR_DE, 0.6);
  const existentes = [termo("dpi", "DPI", "Decanato de Pesquisa e Inovação Ciência")];

  const noLimite = "Decanato de Pesquisa e Inovação Tecnologia"; // 3 em comum de 5 palavras = 0,6
  assert.equal(semelhanca(noLimite, existentes[0].significado), 0.6);
  assert.equal(classificar([candidato("DPI", noLimite)], existentes).alterados.length, 1);

  const abaixo = "Decanato de Pesquisa e Inovação Tecnologia Extensão"; // 3 de 6 = 0,5
  assert.equal(semelhanca(abaixo, existentes[0].significado), 0.5);
  assert.equal(classificar([candidato("DPI", abaixo)], existentes).conflitos.length, 1);
});

test("repetido com outro id: outra sigla com o mesmo significado de um termo que já existe", () => {
  const { conflitos, novos } = classificar([candidato("DEGR", "Decanato de Ensino de Graduação")], termosReais);
  assert.equal(novos.length, 0);
  assert.equal(conflitos.length, 1);
  assert.equal(conflitos[0].id_existente, "deg");
  assert.equal(conflitos[0].proposta_id, null);
  assert.match(conflitos[0].motivo, /^repetido/);
});

test("sinônimo: FGA acha a FCTE pelo campo sinonimos", () => {
  const fcte = termo("fcte", "FCTE", "Faculdade de Ciências e Tecnologias em Engenharia", { sinonimos: ["FGA"] });
  const { iguais, novos } = classificar([candidato("FGA", "Faculdade de Ciências e Tecnologias em Engenharia")], [fcte]);
  assert.equal(novos.length, 0);
  assert.equal(iguais[0].id, "fcte");
  assert.match(iguais[0].motivo, /"FGA" é sinônimo de FCTE/);
});

test("o mesmo termo em duas fontes vira um registro só, com a outra fonte anotada", () => {
  const { novos } = classificar(
    [candidato("SAA", "Secretaria de Administração Acadêmica"), candidato("S.A.A.", "Secretaria de Administração Acadêmica", "https://saa.unb.br/")],
    semASaa,
  );
  assert.equal(novos.length, 1);
  assert.deepEqual(novos[0].tambem_em, ["https://saa.unb.br/"]);
});

test("a mesma sigla com dois significados na mesma coleta vira dois registros", () => {
  const { novos } = classificar(
    [candidato("CPP", "Câmara de Pesquisa e Pós-Graduação"), candidato("CPP", "Comissão Permanente de Projetos")],
    [],
  );
  assert.deepEqual(novos.map((n) => n.proposta_id), ["cpp", "cpp-2"]);
});

test("id proposto não repete um id que já existe", () => {
  const existentes = [termo("saa", "Saa Antiga", "Outra coisa")];
  const { novos } = classificar([candidato("SAA", "Secretaria de Administração Acadêmica"), candidato("SAA2", "Algo novo")], existentes);
  assert.deepEqual(novos.map((n) => n.proposta_id), ["saa-2", "saa2"]);
});

test("valores-limite da entrada: lista vazia, termo vazio e significado vazio", () => {
  assert.deepEqual(classificar([], termosReais), { novos: [], alterados: [], conflitos: [], iguais: [], descartados: [] });
  const { descartados, novos } = classificar([candidato("", "Algo"), candidato("XYZ", "  "), null], termosReais);
  assert.equal(descartados.length, 3);
  assert.equal(novos.length, 0);
});

test("mesclar muda só o significado e nunca a definicao nem o exemplo_uso", () => {
  const antes = structuredClone(termosReais);
  const { alterados } = classificar([candidato("DPO", "Decanato de Planejamento, Orçamento e Avaliação Institucional")], termosReais);
  const depois = mesclar(termosReais, alterados);

  const dpoAntes = termosReais.find((t) => t.id === "dpo");
  const dpoDepois = depois.find((t) => t.id === "dpo");
  assert.equal(dpoDepois.significado, "Decanato de Planejamento, Orçamento e Avaliação Institucional");
  assert.equal(dpoDepois.definicao, dpoAntes.definicao);
  assert.equal(dpoDepois.exemplo_uso, dpoAntes.exemplo_uso);
  assert.deepEqual(termosReais, antes);
  assert.equal(depois.filter((t, i) => t !== termosReais[i]).length, 1);
});

test("mesclar recusa mudança em campo que é de uma pessoa", () => {
  const alterados = [{ id: "deg", mudancas: { definicao: { de: "x", para: "y" } } }];
  assert.throws(() => mesclar(termosReais, alterados), /não pode mudar definicao de deg/);
});

test("repetidosNoGlossario: o glossário de hoje não tem termo repetido com outro id", () => {
  assert.deepEqual(repetidosNoGlossario(termosReais), []);
});

test("repetidosNoGlossario acha a mesma sigla ou o mesmo significado com ids diferentes", () => {
  const termos = [termo("fga", "FGA", "Faculdade do Gama"), termo("fga-2", "F.G.A.", "Outra"), termo("x", "X", "faculdade do gama"), termo("y", "Y", "")];
  assert.deepEqual(repetidosNoGlossario(termos), [
    { motivo: "termo:fga", ids: ["fga", "fga-2"] },
    { motivo: "significado:faculdade do gama", ids: ["fga", "x"] },
  ]);
});
