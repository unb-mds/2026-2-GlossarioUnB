// Coletor genérico (#56): as páginas reais salvas como fixture (11/11/2026), o que acontece quando a estrutura
// muda, o robots.txt, a espera entre pedidos e o formato do coleta/fontes.json. O HTML é lido pelo cheerio e o
// robots.txt pelo robots-parser (ADR 0010); estes testes são os mesmos da versão sem bibliotecas, mais os casos
// que só um parser de verdade resolve.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  INTERVALO_MINIMO_MS,
  USER_AGENT,
  coletar,
  extrairCandidatos,
  lerElementos,
  permitidoPeloRobots,
  textoDoHtml,
} from "../coleta/coletor-html.js";
import { validarFontes } from "../coleta/fontes.js";

const lerArquivo = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");
const config = JSON.parse(await lerArquivo("../coleta/fontes.json"));
const decanatos = config.fontes.find((f) => f.id === "unb-decanatos");
const secretarias = config.fontes.find((f) => f.id === "unb-secretarias");
const htmlDecanatos = await lerArquivo("./fixtures/unb-decanatos.html");
const htmlSecretarias = await lerArquivo("./fixtures/unb-secretarias.html");

const siglas = (candidatos) => candidatos.map((c) => c.termo);

test("coleta/fontes.json segue o formato das fontes", () => {
  assert.deepEqual(validarFontes(config), []);
});

test("decanatos: acha os 8 decanatos, com significado e proveniência", () => {
  const candidatos = extrairCandidatos(htmlDecanatos, decanatos, "2026-11-11");
  assert.deepEqual(siglas(candidatos), ["DAF", "DAC", "DEG", "DEX", "DPG", "DPI", "DGP", "DPO"]);

  const deg = candidatos.find((c) => c.termo === "DEG");
  assert.equal(deg.significado, "Decanato de Ensino de Graduação");
  assert.equal(deg.tipo, "sigla");
  assert.equal(deg.fonte, decanatos.url);
  assert.equal(deg.fonte_id, "unb-decanatos");
  assert.equal(deg.trecho, "Decanato de Ensino de Graduação (DEG)");
  assert.equal(deg.coletado_em, "2026-11-11");
});

test("decanatos: o link do menu fora do trecho (LGPD) não vira candidato", () => {
  assert.ok(htmlDecanatos.includes("Proteção de Dados Pessoais (LGPD)"));
  assert.ok(!siglas(extrairCandidatos(htmlDecanatos, decanatos, "2026-11-11")).includes("LGPD"));
});

test("secretarias: acha as 9 siglas, inclusive as com minúsculas (Ceri, Secom, Sema)", () => {
  const candidatos = extrairCandidatos(htmlSecretarias, secretarias, "2026-11-11");
  assert.deepEqual(siglas(candidatos), ["Ceri", "SOC", "SDH", "SAA", "Secom", "INT", "SPI", "Sema", "STI"]);
});

test("link relativo vira absoluto a partir da URL da fonte", () => {
  const soc = extrairCandidatos(htmlSecretarias, secretarias, "2026-11-11").find((c) => c.termo === "SOC");
  assert.equal(soc.link, "https://unb.br/administrativo/assessorias-e-secretarias/secretaria-dos-orgaos-colegiados");
});

test("página sem o bloco do trecho: erro claro de estrutura", () => {
  const semBloco = htmlDecanatos.replace('itemprop="articleBody"', 'itemprop="outro"');
  assert.throws(() => extrairCandidatos(semBloco, decanatos, "2026-11-11"), /unb-decanatos.*não achei o trecho.*estrutura da página mudou/);
});

test("HTML com tag sem fechar ainda é lido", () => {
  const fonte = { ...decanatos, extracao: { ...decanatos.extracao, minimo: 1 } };
  const html = '<div itemprop="articleBody"><ul><li><a href="/dex">Decanato de Extensão (DEX)</a><li><a href="/deg">Decanato de Ensino de Graduação (DEG)</a></ul>';
  assert.deepEqual(siglas(extrairCandidatos(html, fonte, "2026-11-11")), ["DEX", "DEG"]);
});

test("marcação dentro do item não atrapalha a leitura", () => {
  const fonte = { ...decanatos, extracao: { elemento: "a", padrao: "nome-sigla", minimo: 1 } };
  const [candidato] = extrairCandidatos("<a href=\"/deg\"><strong>Decanato de Ensino</strong> de <em>Graduação</em> (DEG)</a>", fonte, "2026-11-11");
  assert.equal(candidato.termo, "DEG");
  assert.equal(candidato.significado, "Decanato de Ensino de Graduação");
});

test("href com &amp; vira o link certo", () => {
  const fonte = { ...decanatos, extracao: { elemento: "a", padrao: "nome-sigla", minimo: 1 } };
  const [candidato] = extrairCandidatos('<a href="/busca?tipo=sigla&amp;id=7">Decanato de Extensão (DEX)</a>', fonte, "2026-11-11");
  assert.equal(candidato.link, "https://unb.br/busca?tipo=sigla&id=7");
});

test("página que mudou o jeito de escrever as siglas: erro com o mínimo esperado", () => {
  const semParenteses = htmlDecanatos.replace(/\s*\((D[A-Z]{2})\)\s*<\/a>/g, " - $1</a>");
  assert.throws(
    () => extrairCandidatos(semParenteses, decanatos, "2026-11-11"),
    /unb-decanatos.*achei 0 candidato\(s\) em <a> com o padrão nome-sigla, e o mínimo é 6/,
  );
});

test("sem trecho configurado, lê a página inteira", () => {
  const fonte = { ...decanatos, extracao: { elemento: "li", padrao: "nome-sigla", minimo: 1 } };
  const candidatos = extrairCandidatos("<ul><li>Faculdade de Direito (FD)</li><li>sem sigla</li></ul>", fonte, "2026-11-11");
  assert.deepEqual(siglas(candidatos), ["FD"]);
  assert.equal(candidatos[0].link, null);
});

test("padrão sigla-nome: hífen, travessão e dois-pontos; sigla só em maiúsculas", () => {
  const fonte = { ...decanatos, extracao: { elemento: "li", padrao: "sigla-nome", minimo: 1 } };
  const html = "<li>IRA - Índice de Rendimento Acadêmico</li><li>SR – Sem Rendimento</li><li>MM: Média</li><li>Fale – conosco</li>";
  assert.deepEqual(siglas(extrairCandidatos(html, fonte, "2026-11-11")), ["IRA", "SR", "MM"]);
});

test("padrão regex: os grupos termo e significado vêm da configuração", () => {
  const fonte = {
    ...decanatos,
    tipo_termo: "expressao",
    extracao: { elemento: "dt", padrao: "regex", expressao: "^O que é (?<termo>.+?)\\? (?<significado>.+)$", minimo: 1 },
  };
  const [candidato] = extrairCandidatos("<dl><dt>O que é trancamento? Suspender a matrícula</dt><dt>Outra coisa</dt></dl>", fonte, "2026-11-11");
  assert.equal(candidato.termo, "trancamento");
  assert.equal(candidato.significado, "Suspender a matrícula");
  assert.equal(candidato.tipo, "expressao");
});

test("a mesma sigla repetida na página entra uma vez só", () => {
  const fonte = { ...decanatos, extracao: { elemento: "a", padrao: "nome-sigla", minimo: 1 } };
  const html = "<a>Decanato de Extensão (DEX)</a><a>Decanato de Extensão (DEX)</a>";
  assert.equal(extrairCandidatos(html, fonte, "2026-11-11").length, 1);
});

test("textoDoHtml tira as tags e decodifica as entidades", () => {
  assert.equal(textoDoHtml("<b>Pr&oacute;-Reitoria</b> &amp; Ci&#234;ncia &#x41;&nbsp;B"), "Pró-Reitoria & Ciência A B");
  assert.equal(textoDoHtml("&Aacute;rea de Gest&atilde;o"), "Área de Gestão");
  // O padrão HTML: código fora do Unicode vira o caractere de substituição; entidade que não existe fica como está.
  assert.equal(textoDoHtml("&#9999999999; &naoexiste;"), "\uFFFD &naoexiste;");
});

test("lerElementos devolve texto e href de cada elemento", () => {
  assert.deepEqual(lerElementos('<a href="/x" class="y">Um</a><a>Dois</a>', "a"), [
    { texto: "Um", href: "/x" },
    { texto: "Dois", href: null },
  ]);
});

test("robots.txt da UnB: /administrativo-rodape/ pode, /administrator/ não", () => {
  const robots = "User-agent: *\nDisallow: /administrator/\nDisallow: /cache/\n";
  assert.equal(permitidoPeloRobots(robots, "https://unb.br/administrativo-rodape/decanatos"), true);
  assert.equal(permitidoPeloRobots(robots, "https://unb.br/administrator/index.php"), false);
});

test("robots.txt: o grupo com o nosso nome vale mais que o *, e Allow mais longo vence", () => {
  const robots = [
    "User-agent: *",
    "Disallow: /",
    "",
    "User-agent: GlossarioUnB-coletor",
    "Disallow: /privado/",
    "Allow: /privado/siglas/",
  ].join("\n");
  assert.equal(permitidoPeloRobots(robots, "https://exemplo.br/publico"), true);
  assert.equal(permitidoPeloRobots(robots, "https://exemplo.br/privado/x"), false);
  assert.equal(permitidoPeloRobots(robots, "https://exemplo.br/privado/siglas/lista"), true);
  assert.equal(permitidoPeloRobots("User-agent: *\nDisallow: /\n", "https://exemplo.br/x"), false);
});

test("robots.txt vazio, sem grupo para nós ou com Disallow vazio: pode coletar", () => {
  assert.equal(permitidoPeloRobots("", "https://exemplo.br/x"), true);
  assert.equal(permitidoPeloRobots("User-agent: OutroBot\nDisallow: /\n", "https://exemplo.br/x"), true);
  assert.equal(permitidoPeloRobots("# comentário\nUser-agent: *\nDisallow:\n", "https://exemplo.br/x"), true);
});

test("robots.txt com curinga: Disallow /*.pdf$ bloqueia o PDF e libera a página", () => {
  const robots = "User-agent: *\nDisallow: /*.pdf$\n";
  assert.equal(permitidoPeloRobots(robots, "https://exemplo.br/a/lista.pdf"), false);
  assert.equal(permitidoPeloRobots(robots, "https://exemplo.br/a/lista.pdf.html"), true);
});

function respostaFalsa(status, corpo = "") {
  return { ok: status >= 200 && status < 300, status, text: async () => corpo };
}

test("coletar: um robots.txt por site, 1 s entre pedidos e o user-agent do projeto", async () => {
  const pedidos = [];
  const esperas = [];
  const paginas = {
    "https://unb.br/robots.txt": respostaFalsa(200, "User-agent: *\nDisallow: /administrator/\n"),
    [decanatos.url]: respostaFalsa(200, htmlDecanatos),
    [secretarias.url]: respostaFalsa(200, htmlSecretarias),
  };
  const resultado = await coletar([decanatos, secretarias], {
    buscar: async (url, opcoes) => {
      pedidos.push({ url, agente: opcoes.headers["User-Agent"] });
      return paginas[url];
    },
    esperar: async (ms) => esperas.push(ms),
    hoje: () => "2026-11-11",
    intervaloMs: 10,
  });

  assert.deepEqual(pedidos.map((p) => p.url), ["https://unb.br/robots.txt", decanatos.url, secretarias.url]);
  assert.ok(pedidos.every((p) => p.agente === USER_AGENT));
  assert.deepEqual(esperas, [INTERVALO_MINIMO_MS, INTERVALO_MINIMO_MS]);
  assert.deepEqual(resultado.por_fonte, { "unb-decanatos": 8, "unb-secretarias": 9 });
  assert.equal(resultado.candidatos.length, 17);
  assert.deepEqual(resultado.erros, []);
});

test("coletar: fonte bloqueada pelo robots.txt ou com erro não para as outras", async () => {
  const bloqueada = { ...decanatos, id: "bloqueada", url: "https://outro.br/administrator/x", prioridade: 2 };
  const fora = { ...secretarias, id: "fora-do-ar", url: "https://unb.br/sumiu", prioridade: 3 };
  const caiu = { ...secretarias, id: "sem-rede", url: "https://sem-rede.br/x", prioridade: 4 };
  const resultado = await coletar([caiu, fora, bloqueada, decanatos], {
    buscar: async (url) => {
      if (url.startsWith("https://sem-rede.br")) throw new Error("fetch failed");
      if (url === "https://outro.br/robots.txt") return respostaFalsa(200, "User-agent: *\nDisallow: /administrator/\n");
      if (url === "https://unb.br/robots.txt") return respostaFalsa(404);
      if (url === decanatos.url) return respostaFalsa(200, htmlDecanatos);
      return respostaFalsa(500);
    },
    esperar: async () => {},
    hoje: () => "2026-11-11",
  });

  assert.deepEqual(resultado.por_fonte, { "unb-decanatos": 8, bloqueada: 0, "fora-do-ar": 0, "sem-rede": 0 });
  assert.deepEqual(resultado.erros, [
    'fonte "bloqueada": o robots.txt de https://outro.br não permite coletar https://outro.br/administrator/x',
    'fonte "fora-do-ar": a página respondeu 500',
    'fonte "sem-rede": fetch failed',
  ]);
});

test("coletar: robots.txt com 5xx bloqueia a fonte e não para as outras", async () => {
  const quebrada = { ...decanatos, id: "robots-500", url: "https://instavel.br/pagina", prioridade: 2 };
  const resultado = await coletar([quebrada, decanatos], {
    buscar: async (url) => {
      if (url === "https://instavel.br/robots.txt") return respostaFalsa(500);
      if (url === decanatos.url) return respostaFalsa(200, htmlDecanatos);
      return respostaFalsa(404);
    },
    esperar: async () => {},
    hoje: () => "2026-11-11",
  });

  assert.deepEqual(resultado.por_fonte, { "unb-decanatos": 8, "robots-500": 0 });
  assert.deepEqual(resultado.erros, ['fonte "robots-500": o robots.txt de https://instavel.br respondeu 500']);
});

test("validarFontes aponta cada problema com a fonte e o campo", () => {
  const ruim = {
    fontes: [
      {
        id: "Fonte Ruim",
        url: "http://unb.br/x",
        tipo: "pdf",
        prioridade: 0,
        frequencia: "sempre",
        campus: "Asa Norte",
        tipo_termo: "apelido",
        extracao: { elemento: "<a>", padrao: "outro", trecho: { inicio: "" }, minimo: 0 },
      },
      { ...decanatos },
      { ...decanatos },
    ],
  };
  const erros = validarFontes(ruim);
  for (const trecho of [
    "fonte #0 (Fonte Ruim): id deve usar",
    "nome é obrigatório",
    "url deve ser um link https",
    'tipo "pdf" inválido',
    "prioridade deve ser",
    'frequencia "sempre" inválida',
    'campus "Asa Norte" inválido',
    'tipo_termo "apelido" inválido',
    "extracao.elemento deve ser",
    'extracao.padrao "outro" inválido',
    "extracao.trecho deve ser um seletor CSS",
    "extracao.minimo deve ser",
    "fonte #2 (unb-decanatos): id duplicado",
  ]) {
    assert.ok(erros.some((erro) => erro.includes(trecho)), `faltou o erro: ${trecho}`);
  }
});

test("validarFontes: o padrão regex precisa compilar e ter os grupos termo e significado", () => {
  const comRegex = (expressao) => ({ fontes: [{ ...decanatos, extracao: { elemento: "li", padrao: "regex", expressao, minimo: 1 } }] });
  assert.match(validarFontes(comRegex(undefined))[0], /expressao é obrigatória/);
  assert.match(validarFontes(comRegex("(?<termo>"))[0], /não é uma expressão regular válida/);
  assert.match(validarFontes(comRegex("(?<termo>\\w+)"))[0], /precisa dos grupos/);
  assert.deepEqual(validarFontes(comRegex("(?<termo>\\w+) (?<significado>.+)")), []);
});

test("validarFontes: o trecho precisa ser um seletor CSS que compila", () => {
  const comTrecho = (trecho) => ({ fontes: [{ ...decanatos, extracao: { ...decanatos.extracao, trecho } }] });
  assert.match(validarFontes(comTrecho('[itemprop="articleBody"'))[0], /extracao\.trecho não é um seletor CSS válido/);
  assert.match(validarFontes(comTrecho(""))[0], /extracao\.trecho deve ser um seletor CSS/);
  assert.deepEqual(validarFontes(comTrecho("main article")), []);
  assert.deepEqual(validarFontes(comTrecho(undefined)), []);
});

test("validarFontes recusa arquivo sem lista e fonte que não é objeto", () => {
  assert.deepEqual(validarFontes(null), ['o arquivo deve ter uma lista "fontes"']);
  assert.deepEqual(validarFontes({ fontes: [null] }), ["fonte #0 (sem id): fonte deve ser um objeto"]);
  assert.match(validarFontes({ fontes: [{ ...decanatos, extracao: null }] })[0], /extracao deve ser um objeto/);
});
