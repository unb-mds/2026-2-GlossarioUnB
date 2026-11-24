// Regras da planta da FCTE (frontend/js/planta.js): achar o lugar de um termo, desenhar o andar e o campus em SVG,
// conferir as ligações e montar os endereços, sem o DOM.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  acharLugar,
  conferirLigacoes,
  descreverLugar,
  enderecoAndar,
  enderecoCampus,
  lerEnderecoAndar,
  listaDeAndares,
  montarSvgAndar,
  montarSvgCampus,
  paginaDaPlanta,
  svgDoLugar,
} from "../frontend/js/planta.js";

const planta = JSON.parse(readFileSync(new URL("./fixtures/planta-mini.json", import.meta.url), "utf8"));
const copia = () => structuredClone(planta);

// Confere, sem DOM, que as tags do SVG abrem e fecham na ordem certa (o navegador lê como XML).
function tagsBalanceadas(svg) {
  const pilha = [];
  for (const [, fecha, nome, auto] of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (auto) continue;
    if (!fecha) pilha.push(nome);
    else if (pilha.pop() !== nome) return false;
  }
  return pilha.length === 0;
}

// ===== acharLugar =====

test("acharLugar devolve o prédio, o andar e a sala do termo ligado", () => {
  assert.deepEqual(acharLugar(planta, "sala-teste"), { predio: "pt", andar: "terreo", item: "s1" });
});

test("numa sala com várias siglas, cada sigla leva à mesma sala", () => {
  assert.deepEqual(acharLugar(planta, "sala-colega"), acharLugar(planta, "sala-teste"));
});

test("acharLugar de um termo ligado ao prédio devolve o primeiro andar e nenhuma sala", () => {
  assert.deepEqual(acharLugar(planta, "predio-teste"), { predio: "pt", andar: "terreo", item: null });
});

test("acharLugar de um termo ligado ao campus devolve só o campus", () => {
  assert.deepEqual(acharLugar(planta, "campus-teste"), { campus: true });
});

test("acharLugar devolve null para termo sem ligação, id vazio e planta inválida", () => {
  assert.equal(acharLugar(planta, "outro-termo"), null);
  assert.equal(acharLugar(planta, ""), null);
  assert.equal(acharLugar(planta, null), null);
  assert.equal(acharLugar(null, "sala-teste"), null);
  assert.equal(acharLugar({}, "sala-teste"), null);
  assert.equal(acharLugar({ predios: "x" }, "sala-teste"), null);
});

test("acharLugar não quebra com prédio sem andares", () => {
  const sem = { predios: [{ id: "a", termo: "t", andares: [] }] };
  assert.deepEqual(acharLugar(sem, "t"), { predio: "a", andar: null, item: null });
});

// ===== montarSvgAndar =====

test("o SVG do andar tem viewBox com 4 números, papel de imagem e título com o nome do andar", () => {
  const svg = montarSvgAndar(planta, "pt", "terreo", {});
  assert.ok(svg.startsWith("<svg"));
  assert.match(svg, /viewBox="-?\d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?"/);
  assert.match(svg, /role="img"/);
  assert.match(svg, /<title[^>]*>Prédio de teste \(PT\) · térreo<\/title>/);
  assert.ok(tagsBalanceadas(svg));
});

test("só a sala em destaque ganha planta-destaque", () => {
  const svg = montarSvgAndar(planta, "pt", "terreo", { destaque: "s1" });
  assert.equal(svg.match(/class="planta-item planta-destaque"/g).length, 1);
  assert.equal(svg.match(/class="planta-item"/g).length, 2);
  assert.match(svg, /data-id="s1"/);
  assert.match(svg, /<desc[^>]*>Em destaque: Sala 1<\/desc>/);
});

test("o rótulo e o nome saem escapados", () => {
  const svg = montarSvgAndar(planta, "pt", "terreo", {});
  assert.match(svg, /A&lt;&amp;&gt;&quot;B/);
  assert.match(svg, /Laboratório &lt;A&gt;/);
  assert.doesNotMatch(svg, /<A>|A<&>/);
});

test("o id de destaque também sai escapado e um destaque que não existe não marca nada", () => {
  const svg = montarSvgAndar(planta, "pt", "terreo", { destaque: 'x"><script>' });
  assert.doesNotMatch(svg, /planta-destaque"/);
  assert.doesNotMatch(svg, /<script/);
  assert.doesNotMatch(montarSvgAndar(planta, "pt", "terreo", {}), /planta-destaque/);
  assert.doesNotMatch(montarSvgAndar(planta, "pt", "terreo"), /planta-destaque/);
});

test("prédio ou andar que não existe devolve null", () => {
  assert.equal(montarSvgAndar(planta, "xyz", "terreo", {}), null);
  assert.equal(montarSvgAndar(planta, "pt", "xyz", {}), null);
  assert.equal(montarSvgAndar(null, "pt", "terreo", {}), null);
});

test("o SVG não leva cor escrita no desenho: a cor vem das classes do CSS", () => {
  const svg = montarSvgAndar(planta, "pt", "superior", { destaque: "esc" });
  assert.doesNotMatch(svg, /fill="#|stroke="#|style=/);
  assert.match(svg, /planta-tipo-escada/);
  assert.match(svg, /planta-tipo-elevador/);
  assert.match(svg, /planta-tipo-banheiro-feminino/);
  assert.match(svg, /planta-tipo-bebedouro/);
  assert.ok(tagsBalanceadas(svg));
});

test("o item sem cantos é ignorado e o rótulo longo é cortado", () => {
  const svg = montarSvgAndar(planta, "pt", "superior", {});
  assert.doesNotMatch(svg, /data-id="sem-cantos"/);
  assert.match(svg, /data-id="sala-comprida"/);
  assert.doesNotMatch(svg, />Sala muito comprida e com nome longo</);
});

test("o rótulo do levantamento terminado em reticências cede lugar ao nome inteiro", () => {
  const p = copia();
  p.predios[0].andares[0].itens[0].rotulo = "Auditório da…";
  p.predios[0].andares[0].itens[0].nome = "Sala A1";
  assert.match(montarSvgAndar(p, "pt", "terreo", {}), />A1</);
});

test("o desenho aceita prédio na diagonal e andar sem corredor", () => {
  const p = copia();
  p.predios[0].andares[0].corredores = [{ eixo: [[1, 1], [19, 9]], largura: 2 }];
  assert.ok(montarSvgAndar(p, "pt", "terreo", {}).startsWith("<svg"));
  p.predios[0].andares[0].corredores = [];
  assert.ok(montarSvgAndar(p, "pt", "terreo", {}).startsWith("<svg"));
});

// ===== montarSvgCampus =====

test("o SVG do campus desenha cada prédio com o contorno, os pátios e a sigla", () => {
  const svg = montarSvgCampus(planta, {});
  assert.ok(svg.startsWith("<svg"));
  assert.match(svg, /viewBox="-?\d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?"/);
  assert.match(svg, /<title[^>]*>Campus de teste<\/title>/);
  assert.equal(svg.match(/class="planta-predio-grupo/g).length, 2);
  assert.match(svg, /class="planta-patio"/);
  assert.match(svg, />PT</);
  assert.match(svg, />PU</);
  assert.ok(tagsBalanceadas(svg));
});

test("o campus põe link no prédio só quando pedido e destaca o prédio escolhido", () => {
  assert.doesNotMatch(montarSvgCampus(planta, {}), /<a /);
  const com = montarSvgCampus(planta, { links: true, destaque: "pu" });
  assert.match(com, /<a href="planta\.html\?predio=pu&amp;andar=terreo"/);
  assert.equal(com.match(/planta-predio-grupo planta-destaque/g).length, 1);
  assert.ok(tagsBalanceadas(com));
});

test("campus sem prédios devolve null", () => {
  assert.equal(montarSvgCampus({ predios: [] }, {}), null);
  assert.equal(montarSvgCampus(null, {}), null);
  assert.equal(montarSvgCampus({}, {}), null);
});

test("o campus sem nome usa um título padrão", () => {
  const p = copia();
  delete p.campus;
  assert.match(montarSvgCampus(p, {}), /<title[^>]*>Campus<\/title>/);
});

// ===== conferirLigacoes =====

test("a planta de teste não tem problema de ligação", () => {
  assert.deepEqual(conferirLigacoes(planta), []);
});

test("id de termo fora do formato é problema", () => {
  const p = copia();
  p.predios[0].andares[0].itens[1].termos = ["Sala Dois!"];
  const problemas = conferirLigacoes(p);
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /Sala Dois!/);
  assert.match(problemas[0], /formato/);
});

test("o mesmo termo em dois lugares é problema", () => {
  const p = copia();
  p.predios[0].andares[0].itens[1].termos = ["sala-teste"];
  const problemas = conferirLigacoes(p);
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /sala-teste/);
  assert.match(problemas[0], /mais de um lugar/);
});

test("a mesma sigla em duas salas é problema, mesmo sendo a segunda da lista", () => {
  const p = copia();
  p.predios[0].andares[0].itens[1].termos = ["outra", "sala-colega"];
  const problemas = conferirLigacoes(p);
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /sala-colega/);
});

test("a lista de siglas da sala não pode ser vazia nem deixar de ser lista", () => {
  for (const valor of [[], "sala-dois"]) {
    const p = copia();
    p.predios[0].andares[0].itens[1].termos = valor;
    const problemas = conferirLigacoes(p);
    assert.equal(problemas.length, 1, JSON.stringify(valor));
    assert.match(problemas[0], /lista/);
  }
});

test("termo repetido entre o campus e um prédio também é problema", () => {
  const p = copia();
  p.predios[1].termo = "campus-teste";
  assert.equal(conferirLigacoes(p).length, 1);
});

test("termo que ainda não existe no glossário é aceito (o robô vai criar)", () => {
  assert.deepEqual(conferirLigacoes(planta), []);
});

test("termo que existe no glossário mas com outro formato de id não passa despercebido", () => {
  const p = copia();
  p.predios[0].termo = "";
  assert.equal(conferirLigacoes(p).length, 1);
});

test("conferirLigacoes avisa de planta sem prédios", () => {
  assert.equal(conferirLigacoes(null).length, 1);
  assert.equal(conferirLigacoes({}, []).length, 1);
});

test("id de sala repetido no mesmo andar ou prédio repetido é problema", () => {
  const p = copia();
  p.predios[0].andares[0].itens[1].id = "s1";
  assert.equal(conferirLigacoes(p).length, 1);
  const q = copia();
  q.predios[1].id = "pt";
  assert.equal(conferirLigacoes(q).length, 1);
});

// ===== endereços =====

test("enderecoAndar monta o link com o andar e a sala", () => {
  assert.equal(enderecoAndar("uac", "terreo", "s1"), "planta.html?predio=uac&andar=terreo&sala=s1");
  assert.equal(enderecoAndar("uac", "terreo", null), "planta.html?predio=uac&andar=terreo");
  assert.equal(enderecoAndar("uac", "terreo"), "planta.html?predio=uac&andar=terreo");
  assert.equal(enderecoAndar("a b", "1&2", "x/y"), "planta.html?predio=a%20b&andar=1%262&sala=x%2Fy");
});

test("enderecoCampus é a página da planta sem parâmetros", () => {
  assert.equal(enderecoCampus(), "planta.html");
});

test("lerEnderecoAndar devolve null no que faltar", () => {
  assert.deepEqual(lerEnderecoAndar("?predio=uac&andar=terreo&sala=s1"), { predio: "uac", andar: "terreo", sala: "s1" });
  assert.deepEqual(lerEnderecoAndar("?predio=uac"), { predio: "uac", andar: null, sala: null });
  assert.deepEqual(lerEnderecoAndar(""), { predio: null, andar: null, sala: null });
  assert.deepEqual(lerEnderecoAndar(undefined), { predio: null, andar: null, sala: null });
  assert.deepEqual(lerEnderecoAndar("?predio=&andar=%20"), { predio: null, andar: null, sala: null });
});

test("o endereço que se monta é o que se lê", () => {
  const busca = enderecoAndar("a b", "1&2", "x/y").split("?")[1];
  assert.deepEqual(lerEnderecoAndar(`?${busca}`), { predio: "a b", andar: "1&2", sala: "x/y" });
});

// ===== página do andar, lista e bloco "Onde fica" =====

test("sem parâmetros, a página mostra o campus", () => {
  assert.deepEqual(paginaDaPlanta(planta, ""), { modo: "campus", aviso: null });
});

test("com prédio, andar e sala certos, mostra o andar com a sala em destaque e o termo dela", () => {
  assert.deepEqual(paginaDaPlanta(planta, "?predio=pt&andar=terreo&sala=s1"), {
    modo: "andar", predio: "pt", andar: "terreo", destaque: "s1", termos: ["sala-teste", "sala-colega"], nomeDaSala: "Sala 1", aviso: null, aproximada: false, andarComAproximadas: false,
  });
});

test("sem andar, mostra o primeiro andar do prédio", () => {
  const pagina = paginaDaPlanta(planta, "?predio=pt");
  assert.equal(pagina.andar, "terreo");
  assert.equal(pagina.aviso, null);
  assert.equal(pagina.destaque, null);
});

test("prédio que não existe mostra o primeiro andar do primeiro prédio e avisa", () => {
  const pagina = paginaDaPlanta(planta, "?predio=xyz");
  assert.equal(pagina.predio, "pt");
  assert.equal(pagina.andar, "terreo");
  assert.match(pagina.aviso, /não achei/i);
});

test("andar ou sala que não existem mostram o andar certo sem destaque e avisam", () => {
  const semAndar = paginaDaPlanta(planta, "?predio=pt&andar=xyz&sala=s1");
  assert.equal(semAndar.andar, "terreo");
  assert.match(semAndar.aviso, /andar/);
  const semSala = paginaDaPlanta(planta, "?predio=pt&andar=terreo&sala=xyz");
  assert.equal(semSala.destaque, null);
  assert.deepEqual(semSala.termos, []);
  assert.equal(semSala.nomeDaSala, null);
  assert.match(semSala.aviso, /sala/);
});

test("com links, cada sala do andar abre o endereço dela; escada e elevador não viram link", () => {
  const svg = montarSvgAndar(planta, "pt", "terreo", { links: true });
  // O nome do link vem do <title> dele, não de aria-label: o rótulo visível é curto ("Lab."), e aria-label sem o texto
  // visível quebra a regra label-content-name-mismatch do axe (WCAG 2.5.3).
  assert.match(svg, /<a href="planta\.html\?predio=pt&amp;andar=terreo&amp;sala=s1"><title>Sala 1<\/title>/);
  assert.doesNotMatch(svg, /<a [^>]*aria-label/);
  assert.doesNotMatch(montarSvgCampus(planta, { links: true }), /<a [^>]*aria-label/);
  const semLink = copia();
  semLink.predios[0].andares[0].itens[0].tipo = "escada";
  assert.doesNotMatch(montarSvgAndar(semLink, "pt", "terreo", { links: true }), /sala=s1/);
});

test("prédio mais alto que largo fica deitado, para as salas caberem na tela do celular", () => {
  const p = copia();
  p.predios[0].contorno = [[0, 0], [10, 0], [10, 40], [0, 40]];
  p.predios[0].andares[0].corredores = [{ eixo: [[5, 0], [5, 40]], largura: 2 }];
  const [, , largura, altura] = montarSvgAndar(p, "pt", "terreo", {}).match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  assert.ok(largura > altura, `${largura} x ${altura}`);
});

test("sem pedir links, o andar não tem nenhum", () => {
  assert.doesNotMatch(montarSvgAndar(planta, "pt", "terreo", {}), /<a /);
});

test("planta inválida não tem página", () => {
  assert.equal(paginaDaPlanta(null, ""), null);
  assert.equal(paginaDaPlanta({ predios: [] }, ""), null);
});

test("listaDeAndares dá o link de cada andar de cada prédio", () => {
  const lista = listaDeAndares(planta);
  assert.equal(lista.length, 2);
  assert.deepEqual(lista[0].andares[1], { id: "superior", nome: "Superior", href: "planta.html?predio=pt&andar=superior" });
  assert.equal(lista[0].sigla, "PT");
  assert.deepEqual(listaDeAndares(null), []);
});

test("descreverLugar diz o que mostrar no bloco Onde fica", () => {
  assert.deepEqual(descreverLugar(planta, { predio: "pt", andar: "terreo", item: "s1" }), {
    titulo: "Sala 1",
    local: "Prédio de teste (PT) · Térreo",
    href: "planta.html?predio=pt&andar=terreo&sala=s1",
    rotuloLink: "Ver o andar inteiro",
    aproximada: false,
  });
  assert.deepEqual(descreverLugar(planta, { predio: "pt", andar: "terreo", item: null }), {
    titulo: "Prédio de teste (PT)",
    local: "Térreo",
    href: "planta.html?predio=pt&andar=terreo",
    rotuloLink: "Ver o andar inteiro",
  });
  assert.deepEqual(descreverLugar(planta, { campus: true }), {
    titulo: "Campus de teste",
    local: "Prédios do campus",
    href: "planta.html",
    rotuloLink: "Ver o campus",
  });
  assert.equal(descreverLugar(planta, null), null);
  assert.equal(descreverLugar(planta, { predio: "xyz", andar: "terreo", item: null }), null);
});

test("svgDoLugar desenha o andar com a sala ou o campus", () => {
  assert.match(svgDoLugar(planta, { predio: "pt", andar: "terreo", item: "s1" }), /planta-destaque/);
  assert.match(svgDoLugar(planta, { campus: true }), /Campus de teste/);
  assert.equal(svgDoLugar(planta, null), null);
  assert.equal(svgDoLugar(planta, { predio: "xyz", andar: "terreo", item: null }), null);
});

test("com links, o desenho é um grupo com nome, não uma imagem: link dentro de imagem some para o leitor de tela (axe nested-interactive)", () => {
  const andar = montarSvgAndar(planta, "pt", "terreo", { links: true });
  assert.match(andar, /^<svg [^>]*role="group" aria-label="Prédio de teste \(PT\) · térreo"/);
  assert.doesNotMatch(andar, /role="img"/);
  const campus = montarSvgCampus(planta, { links: true });
  assert.match(campus, /^<svg [^>]*role="group" aria-label="Campus de teste"/);
  assert.doesNotMatch(campus, /role="img"/);
  assert.match(montarSvgAndar(planta, "pt", "terreo", {}), /^<svg [^>]*role="img"/);
  assert.match(montarSvgCampus(planta, {}), /^<svg [^>]*role="img"/);
});

// ===== Posição aproximada (decisão 54): sala que veio do site da FCTE e ninguém conferiu no local =====

function plantaComAproximada() {
  const p = copia();
  p.predios[0].andares[0].itens[0].posicao = "aproximada";
  return p;
}

test("descreverLugar avisa quando a posição da sala é aproximada", () => {
  const p = plantaComAproximada();
  assert.equal(descreverLugar(p, { predio: "pt", andar: "terreo", item: "s1" }).aproximada, true);
  assert.equal(descreverLugar(p, { predio: "pt", andar: "terreo", item: "s2" }).aproximada, false);
});

test("o desenho marca a sala aproximada com classe própria e diz isso no título", () => {
  const svg = montarSvgAndar(plantaComAproximada(), "pt", "terreo", { links: true });
  assert.match(svg, /class="planta-item planta-aproximada" data-id="s1"/);
  assert.match(svg, /<title>Sala 1 \(posição aproximada\)<\/title>/);
  assert.doesNotMatch(svg, /class="planta-item planta-aproximada" data-id="s2"/);
  assert.ok(tagsBalanceadas(svg));
});

test("paginaDaPlanta diz se a sala pedida e o andar têm posição aproximada", () => {
  const p = plantaComAproximada();
  const naSala = paginaDaPlanta(p, "?predio=pt&andar=terreo&sala=s1");
  assert.equal(naSala.aproximada, true);
  assert.equal(naSala.andarComAproximadas, true);
  const outraSala = paginaDaPlanta(p, "?predio=pt&andar=terreo&sala=s2");
  assert.equal(outraSala.aproximada, false);
  assert.equal(outraSala.andarComAproximadas, true);
  assert.equal(paginaDaPlanta(p, "?predio=pt&andar=superior").andarComAproximadas, false);
});

test("conferirLigacoes recusa um valor desconhecido em posicao", () => {
  const p = copia();
  p.predios[0].andares[0].itens[1].posicao = "exata";
  assert.ok(conferirLigacoes(p).some((problema) => problema.includes("posicao")));
  assert.deepEqual(conferirLigacoes(plantaComAproximada()), []);
});
