// A página "De onde vêm os dados" (#74): os números vêm do boletim do robô (coleta/relatorio.json) e do termos.json,
// nunca de valor fixo no HTML. Aqui ficam as contas, sem o DOM, e o caminho do boletim até o site publicado.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { boletimDaColeta, dataBrasileira, termosPorCategoria, termosPorFonte } from "../frontend/js/origem.js";

const ler = (caminho) => readFileSync(new URL(`../${caminho}`, import.meta.url), "utf8");

const PDI = "https://planejamento.unb.br/images/Central_de_Conte%C3%BAdos/PDI_UnB__2023_2028.pdf#page=167";
const termos = [
  { id: "a", fonte: PDI, categoria: "administracao" },
  { id: "b", fonte: PDI, categoria: "administracao" },
  { id: "c", fonte: PDI, categoria: "sistemas" },
  { id: "d", fonte: "https://deg.unb.br/", categoria: "vida-academica" },
  { id: "e", fonte: "https://deg.unb.br/calendario", categoria: "vida-academica" },
  { id: "f", fonte: "https://bce.unb.br/" },
  { id: "g", fonte: "https://www.gov.br/capes", categoria: "categoria-nova" },
];
const relatorio = { coletado_em: "2026-11-22", totais: { candidatos: 343, barrados: 77 } };

test("a data do boletim sai no formato brasileiro, sem passar por fuso horário", () => {
  assert.equal(dataBrasileira("2026-11-22"), "22/11/2026");
  assert.equal(dataBrasileira("2026-01-01"), "01/01/2026");
});

test("data que não existe ou fora do formato não vira texto na página", () => {
  for (const valor of ["2026-13-01", "2026-02-30", "22/11/2026", "", null, undefined, 20261122]) {
    assert.equal(dataBrasileira(valor), null, String(valor));
  }
});

test("os termos por fonte separam o PDI, os sites da UnB e o que vem de fora", () => {
  assert.deepEqual(termosPorFonte(termos), [
    { id: "pdi", rotulo: "Plano de Desenvolvimento Institucional (PDI)", total: 3 },
    { id: "unb", rotulo: "Sites oficiais da UnB (2 sites)", total: 3 },
    { id: "fora", rotulo: "Outras fontes", total: 1 },
  ]);
});

test("um site só aparece no singular e grupo vazio não aparece", () => {
  assert.deepEqual(termosPorFonte([{ fonte: "https://unb.br/" }]), [{ id: "unb", rotulo: "Sites oficiais da UnB (1 site)", total: 1 }]);
  assert.deepEqual(termosPorFonte([]), []);
});

test("endereço parecido com o da UnB não conta como site da UnB", () => {
  for (const fonte of ["https://unb.br.exemplo.com/", "https://falsounb.br/", "não é endereço"]) {
    assert.equal(termosPorFonte([{ fonte }])[0].id, "fora", fonte);
  }
});

test("os termos por categoria vêm do maior para o menor, com o nome legível", () => {
  const categorias = termosPorCategoria(termos);
  assert.deepEqual(categorias.slice(0, 2), [
    { id: "administracao", rotulo: "Administração", total: 2 },
    { id: "vida-academica", rotulo: "Vida acadêmica", total: 2 },
  ]);
  assert.deepEqual(categorias.find((c) => c.id === "sistemas"), { id: "sistemas", rotulo: "Sistemas", total: 1 });
});

test("categoria desconhecida mostra o próprio id, e termo sem categoria fica por último", () => {
  const categorias = termosPorCategoria(termos);
  assert.ok(categorias.some((c) => c.id === "categoria-nova" && c.rotulo === "categoria-nova"));
  assert.deepEqual(categorias.at(-1), { id: "sem-categoria", rotulo: "Ainda sem categoria", total: 1 });
});

test("o boletim junta os números da coleta com os termos publicados", () => {
  const boletim = boletimDaColeta(relatorio, termos);
  assert.equal(boletim.temRelatorio, true);
  assert.equal(boletim.textoDaData, "Última coleta com novidades: 22/11/2026");
  assert.deepEqual(boletim.numeros, { lidas: 343, barradas: 77, publicados: 7 });
  assert.equal(boletim.fontes.length, 3);
  assert.equal(boletim.categorias.at(-1).id, "sem-categoria");
});

test("nunca chama a data de 'última coleta' sem dizer que é a última com novidades", () => {
  assert.doesNotMatch(boletimDaColeta(relatorio, termos).textoDaData, /Última coleta:/);
});

test("sem boletim, a página ainda mostra o que vem dos termos e não inventa número", () => {
  for (const quebrado of [null, undefined, {}, { totais: {} }, { coletado_em: "2026-11-22", totais: { candidatos: "343", barrados: 77 } }, { coletado_em: "ontem", totais: { candidatos: 343, barrados: 77 } }]) {
    const boletim = boletimDaColeta(quebrado, termos);
    assert.equal(boletim.temRelatorio, false);
    assert.equal(boletim.textoDaData, null);
    assert.deepEqual(boletim.numeros, { lidas: null, barradas: null, publicados: 7 });
    assert.equal(boletim.fontes.length, 3);
  }
});

test("a publicação copia só o boletim da pasta coleta/, no mesmo caminho do npm run dev", () => {
  const workflow = ler(".github/workflows/pages.yml");
  assert.match(workflow, /mkdir -p _site\/coleta/);
  assert.match(workflow, /cp coleta\/relatorio\.json _site\/coleta\//);
  assert.doesNotMatch(workflow, /cp -R[^\n]*\bcoleta\b/);
});

test("o modo sem internet guarda a página, o módulo e o boletim", () => {
  const sw = ler("frontend/sw.js");
  assert.match(sw, /"origem-dos-dados\.html"/);
  assert.match(sw, /"js\/origem\.js"/);
  assert.match(sw, /"\.\.\/coleta\/relatorio\.json"/);
});

test("se o boletim falhar, o aplicativo instala do mesmo jeito: ele fica fora do addAll", () => {
  const sw = ler("frontend/sw.js");
  const shell = sw.slice(sw.indexOf("const ARQUIVOS_APP_SHELL"), sw.indexOf('self.addEventListener("install"'));
  assert.doesNotMatch(shell, /relatorio/);
  assert.match(sw, /cache\.add\(URL_BOLETIM\)\.catch/);
});

test("todas as páginas do glossário têm o link no menu", () => {
  for (const pagina of ["index", "todas-siglas", "termo", "origem-dos-dados"]) {
    assert.match(ler(`frontend/${pagina}.html`), /<nav class="barra-nav"[\s\S]*?href="origem-dos-dados\.html"/, pagina);
  }
});

test("o HTML da página não traz número fixo: os valores chegam do boletim e dos termos", () => {
  const html = ler("frontend/origem-dos-dados.html");
  const principal = html.slice(html.indexOf("<main"), html.indexOf("</main>")).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(principal, /\d/);
});

test("a página liga para as execuções do robô e reserva o espaço do que chega depois", () => {
  const html = ler("frontend/origem-dos-dados.html");
  assert.match(html, /actions\/workflows\/coleta\.yml/);
  const css = ler("frontend/styles.css");
  for (const seletor of [".dados-numero", ".dados-fontes", ".dados-categorias"]) {
    const regra = css.match(new RegExp(`${seletor.replace(".", "\\.")}\\s*\\{[^}]*min-height`));
    assert.ok(regra, `${seletor} precisa reservar altura`);
  }
});
