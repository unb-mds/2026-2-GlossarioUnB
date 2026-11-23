// Regras da planta da FCTE (ADR 0012), sem DOM e sem fetch: achar o lugar de um termo, desenhar o andar e o campus
// em SVG (uma string), conferir as ligações entre a planta e os termos e montar os endereços da página planta.html.
// O desenho não leva cor: só classes (planta-*), e a cor vem dos tokens --planta-* do styles.css.
// Todo texto que vem do JSON sai escapado, porque a planta, como os termos, chega por PR de terceiros.

const PAGINA = "planta.html";
const PADRAO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/; // o mesmo formato de id do validacao-termo.js
const TIPOS_SEM_ROTULO = new Set(["escada", "elevador", "bebedouro"]);
const CARACTERES_ESCAPADOS = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// ===== Texto e números =====

const escapar = (texto) => String(texto ?? "").replace(/[&<>"']/g, (c) => CARACTERES_ESCAPADOS[c]);
const dois = (n) => n.toFixed(2);
const maiuscula = (texto) => (texto ? texto[0].toUpperCase() + texto.slice(1) : "");
const nomeDoPredio = (predio) => (predio.sigla ? `${predio.nome} (${predio.sigla})` : predio.nome);
const listaDe = (valor) => (Array.isArray(valor) ? valor : []);
const temLink = (item) => !TIPOS_SEM_ROTULO.has(item.tipo);

function prediosDa(planta) {
  return Array.isArray(planta?.predios) ? planta.predios : [];
}

function acharPredio(planta, idPredio) {
  return prediosDa(planta).find((predio) => predio.id === idPredio) ?? null;
}

function acharAndar(predio, idAndar) {
  return listaDe(predio?.andares).find((andar) => andar.id === idAndar) ?? null;
}

// ===== Onde um termo fica =====

// { predio, andar, item } com os ids, { campus: true } ou null. Termo ligado a um prédio vai para o primeiro andar.
export function acharLugar(planta, idTermo) {
  if (!idTermo || typeof idTermo !== "string") return null;
  if (planta?.campus?.termo === idTermo) return { campus: true };
  for (const predio of prediosDa(planta)) {
    const primeiroAndar = listaDe(predio.andares)[0]?.id ?? null;
    if (predio.termo === idTermo) return { predio: predio.id, andar: primeiroAndar, item: null };
    for (const andar of listaDe(predio.andares)) {
      const item = listaDe(andar.itens).find((candidato) => listaDe(candidato.termos).includes(idTermo));
      if (item) return { predio: predio.id, andar: andar.id, item: item.id };
    }
  }
  return null;
}

// ===== Endereços (um só lugar monta e lê o link: ADR 0012) =====

export function enderecoAndar(idPredio, idAndar, idItem = null) {
  const base = `${PAGINA}?predio=${encodeURIComponent(idPredio)}&andar=${encodeURIComponent(idAndar)}`;
  return idItem ? `${base}&sala=${encodeURIComponent(idItem)}` : base;
}

export const enderecoCampus = () => PAGINA;

export function lerEnderecoAndar(busca) {
  const parametros = new URLSearchParams(busca ?? "");
  const ler = (nome) => parametros.get(nome)?.trim() || null;
  return { predio: ler("predio"), andar: ler("andar"), sala: ler("sala") };
}

// ===== Ligações entre a planta e os termos =====

// Cada ligação com o lugar onde está, na ordem do arquivo: campus, depois cada prédio e as salas dele.
function ligacoesDaPlanta(planta) {
  const ligacoes = [];
  const somar = (termo, onde) => {
    if (termo !== undefined) ligacoes.push({ termo, onde });
  };
  somar(planta?.campus?.termo, "o campus");
  for (const predio of prediosDa(planta)) {
    somar(predio.termo, `o prédio ${predio.id}`);
    for (const andar of listaDe(predio.andares)) {
      for (const item of listaDe(andar.itens)) {
        for (const termo of listaDe(item.termos)) somar(termo, `a sala ${predio.id}/${andar.id}/${item.id}`);
      }
    }
  }
  return ligacoes;
}

function idsRepetidos(planta) {
  const problemas = [];
  const prediosVistos = new Set();
  for (const predio of prediosDa(planta)) {
    if (prediosVistos.has(predio.id)) problemas.push(`o prédio "${predio.id}" aparece mais de uma vez`);
    prediosVistos.add(predio.id);
    const salasVistas = new Set();
    for (const item of listaDe(predio.andares).flatMap((andar) => listaDe(andar.itens))) {
      if (salasVistas.has(item.id)) problemas.push(`a sala "${item.id}" aparece mais de uma vez no prédio ${predio.id}`);
      salasVistas.add(item.id);
    }
  }
  return problemas;
}

// Sala com `termos` precisa de uma lista com pelo menos uma sigla (uma sala pode abrigar vários laboratórios).
function listasInvalidas(planta) {
  const problemas = [];
  for (const predio of prediosDa(planta)) {
    for (const andar of listaDe(predio.andares)) {
      for (const item of listaDe(andar.itens)) {
        if (item.termos === undefined || (Array.isArray(item.termos) && item.termos.length > 0)) continue;
        problemas.push(`a sala ${predio.id}/${andar.id}/${item.id} precisa de uma lista com pelo menos um termo`);
      }
    }
  }
  return problemas;
}

// Lista de problemas; vazia quando tudo está certo. Termo que ainda não existe no glossário é aceito
// (o robô vai criar; ver termosPendentes). O que vale é o formato do id e cada termo ter um lugar só.
export function conferirLigacoes(planta) {
  if (!prediosDa(planta).length) return ["a planta não tem prédios"];
  const problemas = [...idsRepetidos(planta), ...listasInvalidas(planta)];
  const lugaresDoTermo = new Map();
  for (const { termo, onde } of ligacoesDaPlanta(planta)) {
    if (typeof termo !== "string" || !PADRAO_ID.test(termo)) {
      problemas.push(`o id de termo "${termo}" em ${onde} não segue o formato (letras minúsculas sem acento, números e hífens)`);
      continue;
    }
    lugaresDoTermo.set(termo, [...(lugaresDoTermo.get(termo) ?? []), onde]);
  }
  for (const [termo, onde] of lugaresDoTermo) {
    if (onde.length > 1) problemas.push(`o termo "${termo}" aparece em mais de um lugar: ${onde.join(", ")}`);
  }
  return problemas;
}

// Os termos que a planta já cita e que ainda não existem no glossário.
export function termosPendentes(planta, idsTermos) {
  const existentes = new Set(idsTermos);
  return ligacoesDaPlanta(planta)
    .map(({ termo }) => termo)
    .filter((termo) => !existentes.has(termo));
}

// ===== Geometria =====

const pontosEm = (lista, T) => lista.map((ponto) => T(ponto).map(dois).join(",")).join(" ");
const centroDe = (pontos) => [pontos.reduce((s, p) => s + p[0], 0) / pontos.length, pontos.reduce((s, p) => s + p[1], 0) / pontos.length];
const distancia = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const entre = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

function caixaDe(pontos, margem) {
  const xs = pontos.map((p) => p[0]);
  const ys = pontos.map((p) => p[1]);
  const [x, y] = [Math.min(...xs) - margem, Math.min(...ys) - margem];
  return [x, y, Math.max(...xs) + margem - x, Math.max(...ys) + margem - y];
}

const viewBoxDe = (caixa) => caixa.map((n) => n.toFixed(1)).join(" ");

// Gira o prédio para os braços ficarem na horizontal ou na vertical (como no protótipo) e vira o y (o da tela cresce
// para baixo). Devolve T, que leva um ponto do levantamento para a tela, e a caixa do desenho.
function vistaDoPredio(predio) {
  const eixo = predio.andares?.[0]?.corredores?.[0]?.eixo;
  let giro = 0;
  if (eixo) {
    giro = -Math.atan2(eixo[1][1] - eixo[0][1], eixo[1][0] - eixo[0][0]);
    while (giro <= -Math.PI / 4) giro += Math.PI / 2;
    while (giro > Math.PI / 4) giro -= Math.PI / 2;
  }
  const [cx, cy] = centroDe(predio.contorno);
  const vistaCom = (angulo) => {
    const [cos, sen] = [Math.cos(angulo), Math.sin(angulo)];
    const T = ([x, y]) => [(x - cx) * cos - (y - cy) * sen, -((x - cx) * sen + (y - cy) * cos)];
    return { T, caixa: caixaDe(predio.contorno.map(T), 9) };
  };
  const vista = vistaCom(giro);
  // Prédio comprido em pé ficaria minúsculo na tela do celular: deitado, as salas ganham largura.
  return vista.caixa[3] > vista.caixa[2] ? vistaCom(giro + Math.PI / 2) : vista;
}

// O ângulo (−90 a 90 graus) que deixa o texto de pé ao longo do lado maior da sala.
function anguloDoTexto(cantos) {
  const [a, b] = [distancia(cantos[0], cantos[1]), distancia(cantos[1], cantos[2])];
  const [de, para] = a >= b ? [cantos[0], cantos[1]] : [cantos[1], cantos[2]];
  let graus = (Math.atan2(para[1] - de[1], para[0] - de[0]) * 180) / Math.PI;
  if (graus > 90) graus -= 180;
  if (graus <= -90) graus += 180;
  return graus;
}

// O rótulo do levantamento vem às vezes cortado ("Auditório da…"): com o nome, vale o nome sem o "Sala " repetido.
function textoDaSala(item) {
  const rotulo = (item.rotulo ?? "").trim();
  const nome = (item.nome ?? "").replace(/^Sala (?=[A-Z]-?\d)/, "").trim();
  return rotulo.endsWith("…") && nome ? nome : rotulo || nome;
}

function rotuloEm(texto, centro, graus, comprimento, classe = "planta-rotulo") {
  if (!texto) return "";
  const tamanho = Math.max(0.9, Math.min(1.7, comprimento / Math.max(3, texto.length * 0.62)));
  const cabem = Math.max(2, Math.floor((comprimento * 0.92) / (tamanho * 0.56)));
  const curto = texto.length > cabem ? `${texto.slice(0, Math.max(1, cabem - 1)).replace(/[\s.…]+$/, "")}…` : texto;
  const [x, y] = [dois(centro[0]), dois(centro[1])];
  return `<text class="${classe}" x="${x}" y="${y}" font-size="${dois(tamanho)}" text-anchor="middle" dominant-baseline="central" transform="rotate(${dois(graus)} ${x} ${y})">${escapar(curto)}</text>`;
}

const linha = (p, q, classe) => `<line class="${classe}" x1="${dois(p[0])}" y1="${dois(p[1])}" x2="${dois(q[0])}" y2="${dois(q[1])}"/>`;

// Degraus da escada: linhas atravessando o lado maior.
function degrausDaEscada(k) {
  const compridoNoPrimeiro = distancia(k[0], k[1]) >= distancia(k[1], k[2]);
  const [a, b, c, d] = compridoNoPrimeiro ? [k[0], k[1], k[3], k[2]] : [k[1], k[2], k[0], k[3]];
  const passos = 8;
  return Array.from({ length: passos - 1 }, (_, i) => linha(entre(a, b, (i + 1) / passos), entre(c, d, (i + 1) / passos), "planta-degrau")).join("");
}

function simboloDoItem(item, k) {
  if (item.tipo === "escada") return degrausDaEscada(k);
  if (item.tipo === "elevador") return linha(k[0], k[2], "planta-simbolo") + linha(k[1], k[3], "planta-simbolo");
  if (item.tipo === "bebedouro") {
    const centro = centroDe(k);
    return `<circle class="planta-simbolo" cx="${dois(centro[0])}" cy="${dois(centro[1])}" r="0.7"/>`;
  }
  return "";
}

function rotuloDoItem(item, k) {
  if (TIPOS_SEM_ROTULO.has(item.tipo)) return "";
  const comprimento = Math.max(distancia(k[0], k[1]), distancia(k[1], k[2]));
  const sigla = { "banheiro-feminino": "WC F", "banheiro-masculino": "WC M" }[item.tipo];
  return rotuloEm(sigla ?? textoDaSala(item), centroDe(k), anguloDoTexto(k), comprimento);
}

// Com link, o <title> vai para o <a> e dá o nome do link (o rótulo visível é curto, "Lab. …"; aria-label sem o texto
// visível quebraria a regra label-content-name-mismatch do axe). Sem link, o <title> fica no grupo, como dica.
function itemEmSvg(item, T, emDestaque, href = null) {
  const k = item.cantos.map(T);
  const classe = emDestaque ? "planta-item planta-destaque" : "planta-item";
  const comLink = Boolean(href) && temLink(item);
  const titulo = `<title>${escapar(item.nome || item.rotulo)}</title>`;
  const corpo = (
    `<g class="${classe}" data-id="${escapar(item.id)}">${comLink ? "" : titulo}` +
    `<polygon class="planta-tipo-${escapar(item.tipo)}" points="${pontosEm(item.cantos, T)}"/>` +
    simboloDoItem(item, k) +
    rotuloDoItem(item, k) +
    "</g>"
  );
  if (!comLink) return corpo;
  return `<a href="${escapar(href)}">${titulo}${corpo}</a>`;
}

const area = (cantos) => Math.abs(cantos.reduce((s, p, i) => s + p[0] * cantos[(i + 1) % cantos.length][1] - cantos[(i + 1) % cantos.length][0] * p[1], 0)) / 2;
const temCantos = (item) => Array.isArray(item?.cantos) && item.cantos.length >= 3;

// ===== O SVG do andar =====

// Com links dentro, o desenho é um grupo com nome; sem links, uma imagem. Link dentro de role="img" some para o
// leitor de tela (regra nested-interactive do axe).
const papelDoSvg = (links, nome) => (links ? `role="group" aria-label="${escapar(nome)}"` : `role="img"`);

// O andar de um prédio com a sala `destaque` marcada (por classe e por contorno mais grosso no CSS). null se não existir.
export function montarSvgAndar(planta, idPredio, idAndar, { destaque = null, links = false } = {}) {
  const predio = acharPredio(planta, idPredio);
  const andar = acharAndar(predio, idAndar);
  if (!andar) return null;
  const { T, caixa } = vistaDoPredio(predio);
  const titulo = `${nomeDoPredio(predio)} · ${andar.nome}`;
  const itens = listaDe(andar.itens).filter(temCantos).sort((a, b) => area(b.cantos) - area(a.cantos));
  const emDestaque = itens.find((item) => item.id === destaque);
  // Os maiores vão primeiro e a sala em destaque por último, para nenhuma ficar por baixo de outra.
  const ordem = emDestaque ? [...itens.filter((item) => item !== emDestaque), emDestaque] : itens;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" class="planta" viewBox="${viewBoxDe(caixa)}" ${papelDoSvg(links, titulo)} preserveAspectRatio="xMidYMid meet">`,
    `<title>${escapar(titulo)}</title>`,
    emDestaque ? `<desc>Em destaque: ${escapar(emDestaque.nome || emDestaque.rotulo)}</desc>` : "",
    `<polygon class="planta-predio" points="${pontosEm(predio.contorno, T)}"/>`,
    ...listaDe(predio.patios).map((patio) => `<polygon class="planta-patio" points="${pontosEm(patio, T)}"/>`),
    ...listaDe(andar.corredores).map((c) => `<polyline class="planta-corredor" points="${pontosEm(c.eixo, T)}" stroke-width="${dois(c.largura)}"/>`),
    ...ordem.map((item) => itemEmSvg(item, T, item === emDestaque, links ? enderecoAndar(predio.id, andar.id, item.id) : null)),
    "</svg>",
  ].join("");
}

// ===== O SVG do campus =====

function predioDoCampus(predio, T, { links, emDestaque }) {
  const [cx, cy] = T(centroDe(predio.contorno));
  const andarInicial = predio.andares?.[0]?.id;
  const comLink = Boolean(links && andarInicial);
  const titulo = `<title>${escapar(nomeDoPredio(predio))}</title>`;
  const corpo =
    `<g class="${emDestaque ? "planta-predio-grupo planta-destaque" : "planta-predio-grupo"}">${comLink ? "" : titulo}` +
    `<polygon class="planta-predio" points="${pontosEm(predio.contorno, T)}"/>` +
    listaDe(predio.patios).map((patio) => `<polygon class="planta-patio" points="${pontosEm(patio, T)}"/>`).join("") +
    `<text class="planta-rotulo-predio" x="${dois(cx)}" y="${dois(cy)}" font-size="7" text-anchor="middle" dominant-baseline="central">${escapar(predio.sigla || predio.id)}</text>` +
    "</g>";
  if (!comLink) return corpo;
  return `<a href="${escapar(enderecoAndar(predio.id, andarInicial))}">${titulo}${corpo}</a>`;
}

// Os prédios do campus no mesmo desenho, com o norte para cima. `links` põe um link em cada prédio (página planta.html).
export function montarSvgCampus(planta, { links = false, destaque = null } = {}) {
  const predios = prediosDa(planta).filter((predio) => listaDe(predio.contorno).length >= 3);
  if (!predios.length) return null;
  const T = ([x, y]) => [x, -y];
  const caixa = caixaDe(predios.flatMap((predio) => predio.contorno.map(T)), 12);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" class="planta" viewBox="${viewBoxDe(caixa)}" ${papelDoSvg(links, planta.campus?.nome || "Campus")} preserveAspectRatio="xMidYMid meet">`,
    `<title>${escapar(planta.campus?.nome || "Campus")}</title>`,
    ...predios.map((predio) => predioDoCampus(predio, T, { links, emDestaque: predio.id === destaque })),
    "</svg>",
  ].join("");
}

// ===== Textos e escolhas da tela (a tela só desenha o que estas funções decidem) =====

// O bloco "Onde fica" do termo: o título, o lugar em palavras e o link. null se o lugar não está na planta.
export function descreverLugar(planta, lugar) {
  if (lugar?.campus) {
    return { titulo: planta?.campus?.nome || "Campus", local: "Prédios do campus", href: enderecoCampus(), rotuloLink: "Ver o campus" };
  }
  const predio = acharPredio(planta, lugar?.predio);
  const andar = acharAndar(predio, lugar?.andar);
  if (!andar) return null;
  const sala = listaDe(andar.itens).find((item) => item.id === lugar.item);
  const href = enderecoAndar(predio.id, andar.id, sala?.id ?? null);
  if (sala) return { titulo: sala.nome, local: `${nomeDoPredio(predio)} · ${maiuscula(andar.nome)}`, href, rotuloLink: "Ver o andar inteiro" };
  return { titulo: nomeDoPredio(predio), local: maiuscula(andar.nome), href, rotuloLink: "Ver o andar inteiro" };
}

export function svgDoLugar(planta, lugar) {
  if (lugar?.campus) return montarSvgCampus(planta, {});
  return montarSvgAndar(planta, lugar?.predio, lugar?.andar, { destaque: lugar?.item });
}

// O que a página planta.html mostra para o endereço: sem parâmetros, o campus; com parâmetros que não existem, o
// que existe mais perto, com um aviso curto. null se a planta não tem prédios.
export function paginaDaPlanta(planta, busca) {
  const predios = prediosDa(planta);
  if (!predios.length) return null;
  const { predio: idPredio, andar: idAndar, sala } = lerEnderecoAndar(busca);
  if (!idPredio && !idAndar && !sala) return { modo: "campus", aviso: null };

  const predio = acharPredio(planta, idPredio) ?? predios[0];
  const avisos = [];
  if (predio.id !== idPredio) avisos.push("Não achei esse prédio; mostro o primeiro da planta.");
  const andarPedido = acharAndar(predio, idAndar);
  const andar = andarPedido ?? listaDe(predio.andares)[0];
  if (idAndar && !andarPedido && predio.id === idPredio) avisos.push("Não achei esse andar; mostro o primeiro do prédio.");
  const item = sala && predio.id === idPredio && andarPedido ? listaDe(andar?.itens).find((candidato) => candidato.id === sala) : null;
  if (sala && !item && avisos.length === 0) avisos.push("Não achei essa sala neste andar.");
  return { modo: "andar", predio: predio.id, andar: andar?.id ?? null, destaque: item?.id ?? null, termos: listaDe(item?.termos), nomeDaSala: item?.nome ?? null, aviso: avisos[0] ?? null };
}

// Os prédios e os andares com o link de cada um, para navegar pela página.
export function listaDeAndares(planta) {
  return prediosDa(planta).map((predio) => ({
    id: predio.id,
    sigla: predio.sigla,
    nome: predio.nome,
    andares: listaDe(predio.andares).map((andar) => ({ id: andar.id, nome: maiuscula(andar.nome), href: enderecoAndar(predio.id, andar.id) })),
  }));
}
