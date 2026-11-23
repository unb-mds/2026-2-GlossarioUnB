// Camada de DOM das 3 páginas: só cria elementos e ouve eventos. As regras ficam em módulos testados no Node
// (ADR 0002): termos.js (busca e filtros), trilha.js, validacao-termo.js (schema) e um módulo por página:
// busca.js (início), lista.js (todas as siglas), ficha.js (termo) e tema.js (todas).
// Todo dado de termo entra na página via textContent, nunca via innerHTML:
// termos chegam por PR de terceiros (RF04) e não podem injetar HTML.

import { TIPOS, encontrarTermo, filtrosDaUrl, resumoDoTermo } from "./termos.js";
import { validarTermo } from "./validacao-termo.js";
import { atalhosPorTipo, gruposDaTrilha, proximoIndice, rotuloDaSugestao, sugestoesPara, termoDoEnvio, textoDoStatus, textoSemResultado } from "./busca.js";
import { enderecoDosFiltros, etiquetasDoCartao, montarLista, opcoesDeCampus, opcoesDeCategoria, opcoesDeTipo, textoDaContagem } from "./lista.js";
import { rotuloCampus, textoDaFonte, textoDosSinonimos, tituloDaFicha, urlDoTermo } from "./ficha.js";
import { escuroAtivo, proximoTema, salvarTema } from "./tema.js";

const URL_DADOS = "data/termos.json";
const URL_TRILHA = "data/trilha-calouro.json";
const URL_REPOSITORIO = "https://github.com/unb-mds/2026-2-GlossarioUnB";
const MENSAGEM_ERRO_CARGA = "Não foi possível carregar os termos. Verifique sua conexão e tente de novo.";

// Modelos de issue "Adicionar termo" e "Corrigir definição" (ADR 0006), já com o termo no título.
function urlModeloIssue(modelo, prefixoTitulo, termo = "") {
  const base = `${URL_REPOSITORIO}/issues/new?template=${modelo}`;
  return termo ? `${base}&title=${encodeURIComponent(`${prefixoTitulo} ${termo}`)}` : base;
}

const urlAdicionarTermo = (termo) => urlModeloIssue("adicionar-termo.yml", "[Adicionar Termo]", termo);
const urlCorrigirDefinicao = (termo) => urlModeloIssue("corrigir-definicao.yml", "[Corrigir Definição]", termo);

// ===== Utilidades de DOM =====

function criarElemento(tag, { classe, texto, atributos = {} } = {}) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  for (const [nome, valor] of Object.entries(atributos)) elemento.setAttribute(nome, valor);
  return elemento;
}

function preencherOpcoes(seletor, opcoes) {
  if (!seletor) return;
  for (const [valor, rotulo] of opcoes) seletor.append(criarElemento("option", { texto: rotulo, atributos: { value: valor } }));
}

async function carregarTermos() {
  const resposta = await fetch(URL_DADOS);
  if (!resposta.ok) throw new Error(`Não foi possível carregar ${URL_DADOS} (HTTP ${resposta.status})`);

  const termos = await resposta.json();
  return termos.filter((termo) => {
    const erros = validarTermo(termo);
    if (erros.length === 0) return true;
    console.warn(`Termo "${termo?.id}" ignorado por não seguir o schema (ADR 0004):`, erros);
    return false;
  });
}

// ===== Tema claro/escuro =====
// O tema salvo é aplicado por um script curto no <head> de cada página (evita piscar);
// aqui só tratamos o botão. O ícone (lua/sol) é trocado pelo CSS.

function iniciarTema() {
  const botao = document.getElementById("botao-tema");
  if (!botao) return;

  const escuro = () => escuroAtivo(document.documentElement.getAttribute("data-tema"), window.matchMedia("(prefers-color-scheme: dark)").matches);
  const atualizarBotao = () => botao.setAttribute("aria-pressed", String(escuro()));

  botao.addEventListener("click", () => {
    const novo = proximoTema(escuro());
    document.documentElement.setAttribute("data-tema", novo);
    salvarTema(() => localStorage, novo);
    atualizarBotao();
  });

  atualizarBotao();
}

// ===== Service worker =====

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((erro) => {
      console.warn("Service worker não registrado; o modo offline fica indisponível:", erro);
    });
  });
}

// ===== Início: busca com autocomplete (padrão ARIA combobox) =====

function iniciarBusca(termos) {
  const input = document.getElementById("campo-busca");
  const form = document.getElementById("form-busca");
  const lista = document.getElementById("sugestoes");
  const status = document.getElementById("busca-status");
  const avisoVazio = document.getElementById("busca-vazia");
  if (!input || !form || !lista || !status || !avisoVazio) return;

  let sugestoesAtuais = [];
  let indiceAtivo = -1;

  function irParaTermo(termo) {
    window.location.href = urlDoTermo(termo);
  }

  function fecharSugestoes() {
    lista.replaceChildren();
    sugestoesAtuais = [];
    indiceAtivo = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  // Fora da listbox, para o link "Sugerir" ser alcançável pelo teclado.
  function mostrarAvisoVazio(consulta) {
    const link = criarElemento("a", { texto: "Sugerir este termo", atributos: { href: urlAdicionarTermo(consulta.trim()) } });
    avisoVazio.replaceChildren(textoSemResultado(consulta), link);
    avisoVazio.hidden = false;
  }

  function marcarAtiva(novoIndice) {
    indiceAtivo = novoIndice;
    const opcoes = lista.querySelectorAll('[role="option"]');
    opcoes.forEach((opcao, i) => {
      opcao.classList.toggle("ativa", i === indiceAtivo);
      opcao.setAttribute("aria-selected", String(i === indiceAtivo));
    });

    const opcaoAtiva = opcoes[indiceAtivo];
    if (!opcaoAtiva) return;
    input.setAttribute("aria-activedescendant", opcaoAtiva.id);
    opcaoAtiva.scrollIntoView({ block: "nearest" });
  }

  function renderizarSugestoes() {
    fecharSugestoes();
    avisoVazio.hidden = true;
    const sugestoes = sugestoesPara(termos, input.value);
    status.textContent = textoDoStatus(sugestoes);
    if (sugestoes === null) return;

    sugestoesAtuais = sugestoes;
    if (sugestoesAtuais.length === 0) {
      mostrarAvisoVazio(input.value);
      return;
    }

    sugestoesAtuais.forEach((termo, i) => {
      const opcao = criarElemento("li", {
        classe: "sugestao",
        atributos: { id: `sugestao-${i}`, role: "option", "aria-selected": "false" },
      });
      opcao.append(
        criarElemento("span", { classe: "sugestao-termo", texto: rotuloDaSugestao(termo, input.value) }),
        criarElemento("span", { classe: "sugestao-resumo", texto: resumoDoTermo(termo) }),
      );
      opcao.addEventListener("click", () => irParaTermo(termo));
      lista.append(opcao);
    });
    input.setAttribute("aria-expanded", "true");
  }

  input.addEventListener("input", renderizarSugestoes);

  input.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharSugestoes();
      return;
    }
    const proximo = proximoIndice(indiceAtivo, evento.key, sugestoesAtuais.length);
    if (proximo === null) return;

    evento.preventDefault();
    marcarAtiva(proximo);
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const termo = termoDoEnvio(sugestoesAtuais, indiceAtivo, termos, input.value);
    if (termo) irParaTermo(termo);
  });

  document.addEventListener("click", (evento) => {
    if (!form.contains(evento.target)) fecharSugestoes();
  });
}

// ===== Início: total de termos e atalhos por tipo =====

function iniciarAtalhos(termos) {
  const total = document.getElementById("total-termos");
  const atalhos = document.getElementById("atalhos-tipo");
  if (!total || !atalhos) return;

  total.textContent = String(termos.length);

  for (const { rotulo, quantidade, href } of atalhosPorTipo(termos)) {
    const link = criarElemento("a", { classe: "atalho", atributos: { href } });
    link.append(rotulo, criarElemento("span", { classe: "atalho-total", texto: String(quantidade) }));
    const item = criarElemento("li");
    item.append(link);
    atalhos.append(item);
  }
}

// ===== Início: trilha do calouro (#70, ADR 0011) =====
// A lista vem de data/trilha-calouro.json (ids), e os dados de cada termo do termos.json.
// A seção já vem visível no HTML, com altura reservada no CSS (sem deslocamento de layout, RNF02);
// se o arquivo não carregar ou vier vazio, ela é escondida e o resto da página funciona.

async function iniciarTrilha(termos) {
  const secao = document.getElementById("trilha-calouro");
  const lista = document.getElementById("trilha-grupos");
  if (!secao || !lista) return;

  try {
    const resposta = await fetch(URL_TRILHA);
    if (!resposta.ok) throw new Error(`Não foi possível carregar ${URL_TRILHA} (HTTP ${resposta.status})`);
    const grupos = gruposDaTrilha(await resposta.json(), termos);
    if (grupos.length === 0) {
      secao.hidden = true;
      return;
    }

    for (const grupo of grupos) {
      const itemGrupo = criarElemento("li", { classe: "trilha-grupo" });
      const titulo = criarElemento("h3", { classe: "trilha-grupo-nome", texto: grupo.nome, atributos: { id: grupo.idDoTitulo } });
      const termosDoGrupo = criarElemento("ul", { classe: "trilha-termos", atributos: { "aria-labelledby": grupo.idDoTitulo } });
      for (const termo of grupo.termos) {
        const link = criarElemento("a", { classe: "trilha-termo", atributos: { href: termo.href } });
        link.append(
          criarElemento("span", { classe: "trilha-termo-nome", texto: termo.nome }),
          criarElemento("span", { classe: "trilha-termo-resumo", texto: termo.resumo }),
        );
        const item = criarElemento("li");
        item.append(link);
        termosDoGrupo.append(item);
      }
      itemGrupo.append(titulo, termosDoGrupo);
      lista.append(itemGrupo);
    }
  } catch (erro) {
    secao.hidden = true;
    console.warn("Trilha do calouro não carregada:", erro);
  }
}

// ===== Todas as siglas: índice, filtros por tipo, categoria (RF02) e campus =====

function criarCartaoTermo(termo) {
  const etiquetas = criarElemento("span", { classe: "etiquetas" });
  for (const { texto, contorno } of etiquetasDoCartao(termo)) {
    etiquetas.append(criarElemento("span", { classe: contorno ? "etiqueta etiqueta-contorno" : "etiqueta", texto }));
  }

  const topo = criarElemento("span", { classe: "cartao-topo" });
  topo.append(criarElemento("span", { classe: "cartao-nome", texto: termo.termo }), etiquetas);
  const cartao = criarElemento("a", { classe: "cartao", atributos: { href: urlDoTermo(termo) } });
  cartao.append(topo, criarElemento("span", { classe: "cartao-resumo", texto: resumoDoTermo(termo) }));
  return cartao;
}

function iniciarListaCompleta(termos) {
  const container = document.getElementById("lista-termos");
  const seletorCampus = document.getElementById("filtro-campus");
  const seletorTipo = document.getElementById("filtro-tipo");
  const seletorCategoria = document.getElementById("filtro-categoria");
  const indice = document.getElementById("indice-letras");
  const status = document.getElementById("filtro-status");
  if (!container || !seletorCampus || !seletorTipo || !seletorCategoria) return;

  preencherOpcoes(seletorTipo, opcoesDeTipo());
  preencherOpcoes(seletorCategoria, opcoesDeCategoria(termos));
  preencherOpcoes(seletorCampus, opcoesDeCampus());

  // Filtros vêm da URL (atalhos da página inicial) e voltam para ela: o link pode ser compartilhado.
  const inicial = filtrosDaUrl(new URLSearchParams(window.location.search));
  seletorTipo.value = inicial.tipo ?? "";
  seletorCategoria.value = inicial.categoria ?? "";
  seletorCampus.value = inicial.campus ?? "";

  const filtrosEscolhidos = () => ({ tipo: seletorTipo.value, categoria: seletorCategoria.value, campus: seletorCampus.value });

  function atualizarUrl() {
    history.replaceState(null, "", enderecoDosFiltros(filtrosEscolhidos(), window.location.pathname));
  }

  function renderizar() {
    const { total, grupos } = montarLista(termos, filtrosEscolhidos());
    container.replaceChildren();
    indice?.replaceChildren();
    if (status) status.textContent = textoDaContagem(total);

    if (total === 0) {
      container.append(criarElemento("p", { classe: "aviso-vazio", texto: "Nenhum termo encontrado para esse filtro." }));
      return;
    }

    for (const { letra, id, rotulo, termos: doGrupo } of grupos) {
      indice?.append(criarElemento("a", {
        texto: letra,
        atributos: { href: `#${id}`, "aria-label": rotulo },
      }));

      const secao = criarElemento("section", { classe: "grupo-letra", atributos: { id } });
      const grade = criarElemento("div", { classe: "grade" });
      grade.append(...doGrupo.map(criarCartaoTermo));
      secao.append(criarElemento("h2", { texto: letra }), grade);
      container.append(secao);
    }
  }

  for (const seletor of [seletorTipo, seletorCategoria, seletorCampus]) {
    seletor.addEventListener("change", () => {
      atualizarUrl();
      renderizar();
    });
  }
  renderizar();
}

// ===== Página de termo =====

function criarBloco(titulo, ...conteudo) {
  const bloco = criarElemento("section", { classe: "bloco" });
  bloco.append(criarElemento("h2", { texto: titulo }), ...conteudo);
  return bloco;
}

// Fonte pode ser um link ou um texto; o texto e o endereço vêm do ficha.js.
function criarFonte(fonte) {
  const { texto, href } = textoDaFonte(fonte);
  if (!href) return criarElemento("p", { texto });

  const paragrafo = criarElemento("p");
  paragrafo.append(criarElemento("a", { texto, atributos: { href, target: "_blank", rel: "noopener" } }));
  return paragrafo;
}

// Leaflet vem de CDN (ADR 0005): offline ou com o CDN bloqueado, mostra aviso em vez de quebrar.
function criarBlocoMapa(localizacao) {
  const bloco = criarBloco("Localização");
  const linkComoChegar = criarElemento("a", {
    classe: "link-como-chegar",
    texto: "Como chegar",
    atributos: { href: localizacao.link_como_chegar, target: "_blank", rel: "noopener" },
  });

  if (!navigator.onLine || typeof L === "undefined") {
    bloco.append(criarElemento("div", { classe: "mapa-offline", texto: "Mapa indisponível offline. Conecte-se à internet para ver a prévia." }), linkComoChegar);
    return { bloco, montar: () => {} };
  }

  const areaMapa = criarElemento("div", { classe: "mapa", atributos: { "aria-label": "Mapa com a localização do termo" } });
  bloco.append(areaMapa, linkComoChegar);
  const montar = () => {
    const coordenadas = [localizacao.lat, localizacao.lng];
    const mapa = L.map(areaMapa).setView(coordenadas, 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);
    L.marker(coordenadas).addTo(mapa);
  };
  return { bloco, montar };
}

function iniciarPaginaTermo(termos) {
  const container = document.getElementById("conteudo-termo");
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const termo = encontrarTermo(termos, id);
  container.replaceChildren();

  if (!termo) {
    container.classList.add("nao-encontrado");
    container.append(
      criarElemento("h1", { texto: "Termo não encontrado" }),
      criarElemento("p", { texto: "Não achamos esse termo no glossário." }),
      criarElemento("a", { texto: "Ver todas as siglas", atributos: { href: "todas-siglas.html" } }),
    );
    return;
  }

  document.title = tituloDaFicha(termo);
  document.getElementById("link-corrigir")?.setAttribute("href", urlCorrigirDefinicao(termo.termo));
  container.append(criarElemento("h1", { texto: termo.termo }));
  if (termo.significado) container.append(criarElemento("p", { classe: "subtitulo", texto: termo.significado }));

  const etiquetas = criarElemento("p", { classe: "etiquetas" });
  etiquetas.append(
    criarElemento("span", { classe: "etiqueta", texto: TIPOS[termo.tipo] }),
    criarElemento("span", { classe: "etiqueta etiqueta-contorno", texto: rotuloCampus(termo.campus) }),
  );
  container.append(
    etiquetas,
    criarBloco("O que é", criarElemento("p", { texto: termo.definicao })),
    criarBloco("Exemplo de uso", criarElemento("p", { classe: "exemplo-frase", texto: termo.exemplo_uso })),
    criarBloco("Fonte", criarFonte(termo.fonte)),
  );

  const sinonimos = textoDosSinonimos(termo);
  if (sinonimos) container.append(criarBloco("Também conhecido como", criarElemento("p", { texto: sinonimos })));

  if (!termo.localizacao) return;
  const { bloco, montar } = criarBlocoMapa(termo.localizacao);
  container.append(bloco);
  montar();
}

// ===== Erro de carga: mostra aviso no lugar do conteúdo da página atual =====

function mostrarErroDeCarga() {
  const aviso = criarElemento("p", { classe: "aviso-vazio", texto: MENSAGEM_ERRO_CARGA, atributos: { role: "alert" } });
  const alvo = document.getElementById("conteudo-termo") ?? document.getElementById("lista-termos");
  if (alvo) {
    alvo.replaceChildren(aviso);
    return;
  }
  document.getElementById("busca-status")?.replaceWith(aviso);
}

// ===== Inicialização (módulo ES: roda depois de o HTML ser lido) =====

iniciarTema();
registrarServiceWorker();

try {
  const termos = await carregarTermos();
  iniciarBusca(termos);
  iniciarAtalhos(termos);
  await iniciarTrilha(termos);
  iniciarListaCompleta(termos);
  iniciarPaginaTermo(termos);
} catch (erro) {
  console.error(erro);
  mostrarErroDeCarga();
}
