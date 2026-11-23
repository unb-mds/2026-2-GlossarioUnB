// Gírias do campus (decisões 20a e 20b): cada gíria da trilha tem uma página da UnB como fonte, e o robô lê essa
// mesma página para confirmar o termo na coleta real (#62). As páginas reais estão salvas como fixture (18/11/2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { coletar, extrairCandidatos } from "../coleta/coletor-html.js";
import { classificar } from "../coleta/deduplicar.js";

const lerArquivo = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");
const { fontes } = JSON.parse(await lerArquivo("../coleta/fontes.json"));
const termos = JSON.parse(await lerArquivo("../frontend/data/termos.json"));
const fonte = (id) => fontes.find((f) => f.id === id);
const ceplan = await lerArquivo("./fixtures/ceplan-campus-darcy-ribeiro.html");
const noticia = await lerArquivo("./fixtures/noticias-ceubinho.html");

const casos = [
  { id: "ceplan-minhocao", html: ceplan, termo: "Minhocão", significado: "Instituto Central de Ciências (ICC)" },
  { id: "ceplan-beijodromo", html: ceplan, termo: "Beijódromo", significado: "Memorial Darcy Ribeiro" },
  { id: "noticias-ceubinho", html: noticia, termo: "Ceubinho", significado: "ala norte do Instituto Central de Ciências (ICC)" },
];

for (const caso of casos) {
  test(`${caso.id}: acha ${caso.termo} como gíria, com o trecho e a página de origem`, () => {
    const candidatos = extrairCandidatos(caso.html, fonte(caso.id), "2026-11-18");
    assert.equal(candidatos.length, 1);
    const [c] = candidatos;
    assert.equal(c.termo, caso.termo);
    assert.equal(c.significado, caso.significado);
    assert.equal(c.tipo, "giria");
    assert.equal(c.fonte, fonte(caso.id).url);
    assert.match(c.trecho, new RegExp(caso.termo));
  });
}

test("o parágrafo fora do corpo da notícia não vira candidato", () => {
  assert.ok(noticia.indexOf("Menu fora do texto") < noticia.indexOf('itemprop="articleBody"'));
  assert.equal(extrairCandidatos(noticia, fonte("noticias-ceubinho"), "2026-11-18").length, 1);
});

test("a coleta das 3 páginas confirma as gírias que já estão na base, sem propor mudança", () => {
  const candidatos = casos.flatMap((caso) => extrairCandidatos(caso.html, fonte(caso.id), "2026-11-18"));
  const { iguais, novos, alterados, conflitos } = classificar(candidatos, termos);
  assert.deepEqual(iguais.map((r) => r.id).sort(), ["beijodromo", "ceubinho", "minhocao"]);
  assert.deepEqual([novos.length, alterados.length, conflitos.length], [0, 0, 0]);
});

test("cada gíria da base que vem de uma dessas páginas cita a página como fonte", () => {
  for (const caso of casos) {
    const termo = termos.find((t) => t.termo === caso.termo);
    assert.equal(termo.tipo, "giria");
    assert.equal(termo.fonte, fonte(caso.id).url);
  }
});

test("coletar: as duas fontes do CEPLAN usam o mesmo robots.txt, e cada página rende a sua gíria", async () => {
  const robots = "User-agent: *\nDisallow: /wp-admin/\n";
  const resposta = (corpo) => ({ ok: true, status: 200, text: async () => corpo });
  const paginas = {
    "https://ceplan.unb.br/robots.txt": resposta(robots),
    [fonte("ceplan-minhocao").url]: resposta(ceplan),
    "https://noticias.unb.br/robots.txt": resposta("User-agent: *\nDisallow: /administrator/\n"),
    [fonte("noticias-ceubinho").url]: resposta(noticia),
  };
  const pedidos = [];
  const resultado = await coletar(casos.map((caso) => fonte(caso.id)), {
    buscar: async (url) => {
      pedidos.push(url);
      return paginas[url];
    },
    esperar: async () => {},
    hoje: () => "2026-11-18",
    intervaloMs: 10,
  });
  assert.equal(pedidos.filter((url) => url === "https://ceplan.unb.br/robots.txt").length, 1);
  assert.deepEqual(resultado.por_fonte, { "ceplan-minhocao": 1, "ceplan-beijodromo": 1, "noticias-ceubinho": 1 });
  assert.deepEqual(resultado.erros, []);
});
