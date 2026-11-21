import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  FONTE_ID,
  PAGINAS_DA_LISTA,
  PDF_URL,
  baixarPdf,
  coletarDpo,
  extrairSiglasDoPdf,
  salvarDpo,
} from "../coleta/coletores/dpo.js";

const fixture = new Uint8Array(await readFile(new URL("./coleta/fixtures/dpo-paginas-5-8.pdf", import.meta.url)));
const paginasDaFixture = [1, 2, 3, 4];
const candidatos = await extrairSiglasDoPdf(fixture, { paginas: paginasDaFixture, coletadoEm: "2026-11-18" });
const porSigla = (sigla) => candidatos.filter((candidato) => candidato.termo === sigla);

const amostra = [
  ["A3M", "Programa Aprendizagem 3° Milênio"],
  ["ABED", "Associação Brasileira de Educação a Distância"],
  ["ABTU", "Associação Brasileira de Televisão Universitária"],
  ["ACE", "Arquivo Central"],
  ["ADM-BCE", "Coordenadoria de Administração e Orçamento da BCE"],
  ["Andifes", "Associação Nacional dos Dirigentes das Instituições Federais de Ensino Superior"],
  ["APCNs", "Avaliação das Propostas de Cursos Novos"],
  ["AUGM", "Associação de Universidades do Grupo Montevidéu"],
  ["BDCE", "Biblioteca Digital de Coleções Especiais"],
  ["BEPA", "Banca Examinadora de Professor Associado"],
  ["BSAN", "Bloco de Salas de Aula Norte"],
  ["CAPES", "Coordenação de Aperfeiçoamento de Pessoal de Nível Superior"],
  ["CAREL-UnB", "Centro de Relações Internacionais UnB"],
  ["CBMDF", "Corpo de Bombeiros Militar do Distrito Federal"],
  ["CDG-UnB", "Comitê de Governança Digital"],
  ["CGRIFES", "Colégio de Gestores de Relações Internacionais das Instituições Federais de Educação Superior"],
  ["CNPq", "Conselho Nacional de Desenvolvimento Científico e Tecnológico"],
  ["CoAC", "Coordenação de Arte e Cultura"],
  ["Consuni", "Conselho Universitário"],
  ["Copei", "Comitê de Pesquisa, Inovação e Extensão de combate à Covid-19"],
  ["DPO", "Decanato de Planejamento, Orçamento e Avaliação Institucional"],
  ["EaD", "Educação a Distância"],
  ["eMAG", "Modelo de Acessibilidade em Governo Eletrônico"],
  ["Enade", "Exame Nacional de Desempenhos dos Estudantes"],
  ["FACE", "Faculdade de Administração, Contabilidade, Economia e Gestão Pública"],
  ["FGA", "Faculdade do Gama"],
  ["HIV", "Human Immunodeficiency Virus"],
  ["IBICT", "Instituto Brasileiro de Informação em Ciência e Tecnologia"],
  ["LEDOC", "Licenciatura em Educação do Campo"],
  ["PIBIC-EM", "Programa Institucional de Bolsas de Iniciação Científica Ensino Médio"],
];

function respostaPdf(dados = fixture) {
  return {
    ok: true,
    headers: new Headers({ "content-type": "application/pdf" }),
    arrayBuffer: async () => new Uint8Array(dados).buffer,
  };
}

function respostaRobots(texto = "User-agent: *\nAllow: /\n", status = 200) {
  return { ok: status < 400, status, text: async () => texto };
}

// Responde o robots.txt liberado (ou o que o teste definir) e o PDF pelo caminho normal.
function buscarComRobots({ robots = respostaRobots(), pdf = () => respostaPdf() } = {}) {
  return async (url) => (String(url).endsWith("/robots.txt") ? robots : pdf());
}

test("a fixture é uma cópia das páginas 5 a 8 do PDF da DPO", () => {
  assert.deepEqual(PAGINAS_DA_LISTA, [5, 6, 7, 8]);
  assert.equal(PDF_URL, "https://planejamento.unb.br/images/Central_de_Conte%C3%BAdos/PDI_UnB__2023_2028.pdf");
  assert.ok(fixture.byteLength > 0);
});

test("extrai a lista da fixture com proveniência completa", () => {
  assert.ok(candidatos.length >= 300);

  const a3m = porSigla("A3M")[0];
  assert.equal(a3m.significado, "Programa Aprendizagem 3° Milênio");
  assert.equal(a3m.tipo, "sigla");
  assert.equal(a3m.campus, "Geral");
  assert.equal(a3m.orgao_superior, null);
  assert.equal(a3m.fonte, PDF_URL);
  assert.equal(a3m.fonte_url, PDF_URL);
  assert.equal(a3m.fonte_id, FONTE_ID);
  assert.equal(a3m.pagina, 1);
  assert.equal(a3m.trecho, "A3M Programa Aprendizagem 3° Milênio");
  assert.equal(a3m.coletado_em, "2026-11-18");
});

test("confere a amostra de 30 siglas contra o PDF", () => {
  assert.ok(amostra.length >= 30);
  for (const [sigla, significado] of amostra) {
    const achado = porSigla(sigla).find((candidato) => candidato.significado.includes(significado));
    assert.ok(achado, `não achei ${sigla} com o significado "${significado}"`);
  }
});

test("não emenda o rodapé 'clique aqui.' na sigla anterior", () => {
  assert.deepEqual(porSigla("VRT").map((candidato) => candidato.significado), ["Vice-Reitoria"]);
  assert.equal(candidatos.length, 323);
});

test("junta palavra hifenizada sem espaço depois do hífen", () => {
  assert.equal(
    porSigla("PCCTAE")[0].significado,
    "Plano de Carreira dos Cargos de Técnicos-Administrativos em Educação",
  );
  assert.equal(
    porSigla("QRSTAE")[0].significado,
    "Quadro de Referência do Servidor Técnico-Administrativo em Educação",
  );
});

test("junta descrições quebradas em várias linhas", () => {
  assert.equal(
    porSigla("Andifes")[0].significado,
    "Associação Nacional dos Dirigentes das Instituições Federais de Ensino Superior",
  );
  assert.equal(
    porSigla("CGRIFES")[0].significado,
    "Colégio de Gestores de Relações Internacionais das Instituições Federais de Educação Superior",
  );
  assert.equal(
    porSigla("CNPq")[0].significado,
    "Conselho Nacional de Desenvolvimento Científico e Tecnológico",
  );
});

test("preserva as siglas com dois significados", () => {
  assert.deepEqual(
    porSigla("CPP").map((candidato) => candidato.significado),
    ["Câmara de Pesquisa e Pós-Graduação", "Comissão Permanente de Projetos"],
  );
  assert.deepEqual(
    porSigla("SIC").map((candidato) => candidato.significado),
    ["Serviço de Informação ao Cidadão", "Segurança da Informação e Comunicação"],
  );
});

test("não transforma cabeçalhos, rodapés ou linhas quebradas em siglas", () => {
  const termos = new Set(candidatos.map((candidato) => candidato.termo));
  for (const proibido of ["XX", "+", "LISTA", "Para", "Instituições", "Internacionais", "Científico"]) {
    assert.ok(!termos.has(proibido), `"${proibido}" não deveria ser sigla`);
  }
  assert.equal(new Set(candidatos.map((candidato) => `${candidato.termo}\u0000${candidato.significado}`)).size, candidatos.length);
});

test("baixarPdf aceita uma resposta com a assinatura %PDF", async () => {
  const dados = await baixarPdf(PDF_URL, { buscar: async () => respostaPdf() });
  assert.equal(String.fromCharCode(...dados.subarray(0, 5)), "%PDF-");
});

test("baixarPdf recusa status de erro", async () => {
  await assert.rejects(
    () => baixarPdf(PDF_URL, { buscar: async () => ({ ok: false, status: 404 }) }),
    /a DPO respondeu 404/,
  );
});

test("baixarPdf recusa HTML mesmo com status 200", async () => {
  const html = new TextEncoder().encode("<html><body>manutenção</body></html>");
  await assert.rejects(
    () =>
      baixarPdf(PDF_URL, {
        buscar: async () => ({
          ok: true,
          headers: new Headers({ "content-type": "text/html" }),
          arrayBuffer: async () => html.buffer,
        }),
      }),
    /a resposta não é um PDF \(content-type: text\/html\)/,
  );
});

test("coletarDpo devolve os candidatos e o resumo por fonte", async () => {
  const resultado = await coletarDpo({
    buscar: buscarComRobots(),
    paginas: paginasDaFixture,
    coletadoEm: "2026-11-18",
  });

  assert.deepEqual(resultado.erros, []);
  assert.equal(resultado.fonte_url, PDF_URL);
  assert.equal(resultado.coletado_em, "2026-11-18");
  assert.equal(resultado.por_fonte[FONTE_ID], candidatos.length);
  assert.equal(resultado.candidatos.length, candidatos.length);
});

test("coletarDpo avisa quando o PDF não tem a lista", async () => {
  const resultado = await coletarDpo({
    buscar: buscarComRobots(),
    paginas: [],
    coletadoEm: "2026-11-18",
  });

  assert.deepEqual(resultado.candidatos, []);
  assert.equal(resultado.por_fonte[FONTE_ID], 0);
  assert.match(resultado.erros[0], /nenhuma sigla encontrada/);
});

test("coletarDpo não lança quando o download falha", async () => {
  const resultado = await coletarDpo({
    buscar: async () => {
      throw new Error("rede fora");
    },
  });

  assert.deepEqual(resultado.candidatos, []);
  assert.equal(resultado.por_fonte[FONTE_ID], 0);
  assert.match(resultado.erros[0], /fonte "dpo-siglas": rede fora/);
});

test("coletarDpo não lança quando a resposta é HTML", async () => {
  const html = new TextEncoder().encode("<html></html>");
  const respostaHtml = () => ({
    ok: true,
    headers: new Headers({ "content-type": "text/html" }),
    arrayBuffer: async () => html.buffer,
  });
  const resultado = await coletarDpo({ buscar: buscarComRobots({ pdf: respostaHtml }) });

  assert.deepEqual(resultado.candidatos, []);
  assert.match(resultado.erros[0], /a resposta não é um PDF/);
});

test("coletarDpo trata robots.txt ausente (404) como liberado", async () => {
  const resultado = await coletarDpo({
    buscar: buscarComRobots({ robots: respostaRobots("", 404) }),
    paginas: paginasDaFixture,
    coletadoEm: "2026-11-18",
  });

  assert.deepEqual(resultado.erros, []);
  assert.equal(resultado.candidatos.length, candidatos.length);
});

test("coletarDpo não baixa o PDF quando o robots.txt proíbe", async () => {
  const pedidos = [];
  const buscar = async (url) => {
    pedidos.push(String(url));
    return respostaRobots("User-agent: *\nDisallow: /\n");
  };
  const resultado = await coletarDpo({ buscar, paginas: paginasDaFixture });

  assert.deepEqual(resultado.candidatos, []);
  assert.equal(resultado.por_fonte[FONTE_ID], 0);
  assert.match(resultado.erros[0], /o robots\.txt de https:\/\/planejamento\.unb\.br não permite coletar/);
  assert.equal(pedidos.length, 1);
  assert.ok(pedidos[0].endsWith("/robots.txt"));
});

test("coletarDpo bloqueia quando o robots.txt responde 5xx", async () => {
  const resultado = await coletarDpo({ buscar: async () => ({ ok: false, status: 503 }) });

  assert.deepEqual(resultado.candidatos, []);
  assert.match(resultado.erros[0], /o robots\.txt de https:\/\/planejamento\.unb\.br respondeu 503/);
});

test("coletarDpo espera pelo menos 1 s entre o robots.txt e o PDF", async () => {
  const esperas = [];
  const resultado = await coletarDpo({
    buscar: buscarComRobots(),
    esperar: async (ms) => esperas.push(ms),
    paginas: paginasDaFixture,
    coletadoEm: "2026-11-18",
  });

  assert.deepEqual(resultado.erros, []);
  assert.deepEqual(esperas, [1000]);
});

test("extrairSiglasDoPdf recusa página fora do PDF", async () => {
  await assert.rejects(
    () => extrairSiglasDoPdf(fixture, { paginas: [99] }),
    /página 99 não existe no PDF \(1 a 4\)/,
  );
});

test("salvarDpo cria a pasta e grava o JSON", async () => {
  const pasta = await mkdtemp(join(tmpdir(), "dpo-"));
  const caminho = join(pasta, "saida", "dpo.json");
  try {
    await salvarDpo({ fonte_url: PDF_URL, coletado_em: "2026-11-18", candidatos: [candidatos[0]], erros: [] }, caminho);
    const salvo = JSON.parse(await readFile(caminho, "utf8"));
    assert.equal(salvo.candidatos[0].termo, candidatos[0].termo);
    assert.equal(salvo.fonte_url, PDF_URL);
  } finally {
    await rm(pasta, { recursive: true, force: true });
  }
});
