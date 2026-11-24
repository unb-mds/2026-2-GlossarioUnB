// Primeiras fontes reais da vida acadêmica (#61): o FAQ e o "Quem somos" da SAA e as páginas da FCTE (prédios e
// laboratórios, decisão 27). Cada fonte é só configuração no coleta/fontes.json; os trechos das páginas reais
// estão salvos em tests/fixtures/ (20/11/2026), sem nome nem e-mail de pessoa (RNF08).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { extrairCandidatos, permitidoPeloRobots } from "../coleta/coletor-html.js";
import { validarFontes } from "../coleta/fontes.js";

const lerArquivo = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");
const config = JSON.parse(await lerArquivo("../coleta/fontes.json"));
const fonte = (id) => config.fontes.find((f) => f.id === id);
const pagina = (nome) => lerArquivo(`./fixtures/${nome}.html`);
const faq = await pagina("saa-perguntas-frequentes");
const quemSomos = await pagina("saa-quem-somos");
const infraestrutura = await pagina("fcte-infraestrutura");
const memoria = await pagina("fcte-memoria");
const unidade = await pagina("fcte-a-unidade");
const laboratorios = await pagina("fcte-laboratorios");
const DATA = "2026-11-20";
const candidatos = (html, id) => extrairCandidatos(html, fonte(id), DATA);
const pares = (lista) => lista.map((c) => [c.termo, c.significado]);

test("as fontes novas seguem o formato do fontes.json", () => {
  assert.deepEqual(validarFontes(config), []);
});

test("FAQ da SAA: os 4 trancamentos (TGM, TGMJ, TR, TJ) com o significado", () => {
  assert.deepEqual(pares(candidatos(faq, "saa-faq-trancamentos")), [
    ["TGM", "Trancamento Geral de Matrícula Automático"],
    ["TGMJ", "Trancamento Geral de Matrícula Justificado"],
    ["TR", "Trancamento Parcial de Matrícula"],
    ["TJ", "Trancamento Parcial de Matrícula Justificado"],
  ]);
});

test("FAQ da SAA: IRA, MP, EJ, COEST e DAIA, cada um com a página e o trecho de origem", () => {
  const esperado = {
    "saa-faq-ira": ["IRA", "Índice de Rendimento Acadêmico"],
    "saa-faq-mp": ["MP", "Média Ponderada"],
    "saa-faq-ej": ["EJ", "Empresa Júnior"],
    "saa-faq-coest": ["COEST", "Coordenadoria de Estágio"],
    "saa-faq-daia": ["DAIA", "Diretoria de Acompanhamento e Integração Acadêmica"],
  };
  for (const [id, [termo, significado]] of Object.entries(esperado)) {
    const achados = candidatos(faq, id);
    assert.deepEqual(pares(achados), [[termo, significado]], id);
    assert.equal(achados[0].fonte, "https://saa.unb.br/perguntas-frequentes/");
    assert.equal(achados[0].fonte_id, id);
    assert.ok(achados[0].trecho.includes(termo), id);
  }
});

test("FAQ da SAA: a pergunta comprida e o menu fora do trecho não viram termo", () => {
  assert.ok(faq.includes("Registro de Formada(o) em Curso Secundário"));
  assert.ok(faq.includes("Menu (ABC)"));
  const todos = ["saa-faq-trancamentos", "saa-faq-ira", "saa-faq-mp", "saa-faq-ej"].flatMap((id) => candidatos(faq, id));
  assert.ok(!todos.some((c) => ["ABC", "XYZ", "Curso", "Secundário"].includes(c.termo)));
});

test("SAA Quem somos: a assessoria e as 6 coordenações (CRPG tem hífen no nome); cargo sem sigla (Secretário) fica de fora", () => {
  assert.ok(quemSomos.includes("Secretário Adjunto"));
  assert.deepEqual(candidatos(quemSomos, "saa-quem-somos").map((c) => c.termo), ["ASE", "COA", "CCC", "CGR", "CRPG", "CRDC", "CRI"]);
  const coa = candidatos(quemSomos, "saa-quem-somos").find((c) => c.termo === "COA");
  assert.equal(coa.significado, "Coordenação de Atendimento");
});

test("FCTE: os prédios UAC, UED, UEP e o LDTEA saem de texto corrido só com expressão regular", () => {
  assert.deepEqual(pares(candidatos(infraestrutura, "fcte-infra-uac")), [["UAC", "Unidade Acadêmica"]]);
  assert.deepEqual(pares(candidatos(infraestrutura, "fcte-infra-ued")), [["UED", "Unidade de Ensino e Docência"]]);
  assert.deepEqual(pares(candidatos(memoria, "fcte-memoria-uep")), [["UEP", "Unidade de Ensino e Pesquisa"]]);
  assert.deepEqual(pares(candidatos(unidade, "fcte-a-unidade-ldtea")), [
    ["LDTEA", "Laboratório de Desenvolvimento de Tecnologia Aeroespacial"],
  ]);
  for (const id of ["fcte-infra-uac", "fcte-infra-ued", "fcte-memoria-uep", "fcte-a-unidade-ldtea"]) {
    assert.equal(fonte(id).campus, "Gama");
  }
});

test("FCTE laboratórios: acha as siglas e deixa de fora os sem sigla (Física, Química Geral…)", () => {
  const lista = candidatos(laboratorios, "fcte-laboratorios");
  const siglas = lista.map((c) => c.termo);
  assert.ok(lista.length >= 30, `achei só ${lista.length}`);
  for (const sigla of ["CPL", "COSMOS", "LEMA", "LaSE", "LabNVH", "LAPPIS", "AILAB", "LAB SS", "NEI1"]) {
    assert.ok(siglas.includes(sigla), sigla);
  }
  assert.ok(!lista.some((c) => c.significado.startsWith("Laboratório de Física")));
  assert.equal(lista.find((c) => c.termo === "LEMA").significado, "Laboratório de Estruturas e Materiais Aeroespaciais");
  assert.equal(lista.find((c) => c.termo === "COSMOS").significado, "Computational Aerospace Simulations & Modeling Laboratory");
});

test("RNF08: nenhum candidato novo guarda e-mail ou telefone no trecho", () => {
  const paginas = {
    "saa-faq-trancamentos": faq, "saa-faq-ira": faq, "saa-faq-mp": faq, "saa-faq-ej": faq, "saa-faq-coest": faq,
    "saa-faq-daia": faq, "saa-quem-somos": quemSomos, "fcte-infra-uac": infraestrutura, "fcte-infra-ued": infraestrutura,
    "fcte-memoria-uep": memoria, "fcte-a-unidade-ldtea": unidade, "fcte-laboratorios": laboratorios,
  };
  const todos = Object.entries(paginas).flatMap(([id, html]) => candidatos(html, id));
  assert.ok(todos.length >= 15, `são ${todos.length} candidatos, e a issue pede 15`);
  assert.ok(todos.every((c) => c.fonte && c.fonte_id && c.trecho));
  assert.ok(!todos.some((c) => /@|\(\d{2}\)|\d{4}-\d{4}/.test(c.trecho)));
});

test("RNF09: o robots.txt de saa.unb.br e fcte.unb.br (conferido em 20/11/2026) deixa coletar as páginas", () => {
  const robots = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n";
  for (const f of config.fontes.filter((x) => /saa\.unb\.br|fcte\.unb\.br/.test(x.url))) {
    assert.equal(permitidoPeloRobots(robots, f.url), true, f.id);
  }
});
