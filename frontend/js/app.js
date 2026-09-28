// Camada de DOM das 3 páginas. Regras de busca/filtro ficam em termos.js e
// o schema em validacao-termo.js (ADR 0002), para poderem ser testados no Node.
// Todo dado de termo entra na página via textContent, nunca via innerHTML:
// termos chegam por PR de terceiros (RF04) e não podem injetar HTML.

import { CAMPI, TIPOS, agruparPorLetra, buscarTermos, encontrarTermo, filtrarTermos, normalizar } from "./termos.js";
import { urlSegura, validarTermo } from "./validacao-termo.js";

const URL_DADOS = "data/termos.json";
const MENSAGEM_ERRO_CARGA = "Não foi possível carregar os termos. Verifique sua conexão e tente de novo.";

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

function lerTemaSalvo() {
  try {
    return localStorage.getItem("tema");
  } catch (erro) {
    console.warn("Preferência de tema indisponível:", erro);
    return null;
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem("tema", tema);
  } catch (erro) {
    console.warn("Não foi possível salvar a preferência de tema:", erro);
  }
}

function iniciarTema() {
  const salvo = lerTemaSalvo();
  if (salvo) document.documentElement.setAttribute("data-tema", salvo);

  const botao = document.getElementById("botao-tema");
  if (!botao) return;

  const escuroAtivo = () => {
    const atual = document.documentElement.getAttribute("data-tema");
    return atual === "escuro" || (!atual && window.matchMedia("(prefers-color-scheme: dark)").matches);
  };
  const atualizarIcone = () => {
    botao.textContent = escuroAtivo() ? "☀️" : "🌙";
  };

  botao.addEventListener("click", () => {
    const novo = escuroAtivo() ? "claro" : "escuro";
    document.documentElement.setAttribute("data-tema", novo);
    salvarTema(novo);
    atualizarIcone();
  });

  atualizarIcone();
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

// ===== Tela inicial: busca com autocomplete (padrão ARIA combobox) =====

function iniciarBusca(termos) {
  const input = document.getElementById("campo-busca");
  const form = document.getElementById("form-busca");
  const lista = document.getElementById("sugestoes");
  const status = document.getElementById("busca-status");
  if (!input || !form || !lista || !status) return;

  let sugestoesAtuais = [];
  let indiceAtivo = -1;

  function irParaTermo(id) {
    window.location.href = `termo.html?id=${encodeURIComponent(id)}`;
  }

  function fecharSugestoes() {
    lista.replaceChildren();
    sugestoesAtuais = [];
    indiceAtivo = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
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
    if (!normalizar(input.value)) {
      status.textContent = "";
      return;
    }

    sugestoesAtuais = buscarTermos(termos, input.value);
    if (sugestoesAtuais.length === 0) {
      lista.append(criarElemento("li", { classe: "sugestao-vazia", texto: "Nenhum termo encontrado.", atributos: { "aria-hidden": "true" } }));
      status.textContent = "Nenhum termo encontrado.";
      return;
    }

    sugestoesAtuais.forEach((termo, i) => {
      const opcao = criarElemento("li", {
        classe: "sugestao",
        atributos: { id: `sugestao-${i}`, role: "option", "aria-selected": "false" },
      });
      opcao.append(criarElemento("strong", { texto: termo.termo }));
      opcao.addEventListener("click", () => irParaTermo(termo.id));
      lista.append(opcao);
    });
    input.setAttribute("aria-expanded", "true");
    status.textContent = sugestoesAtuais.length === 1 ? "1 sugestão disponível." : `${sugestoesAtuais.length} sugestões disponíveis.`;
  }

  input.addEventListener("input", renderizarSugestoes);

  input.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharSugestoes();
      return;
    }
    if (evento.key !== "ArrowDown" && evento.key !== "ArrowUp") return;
    if (sugestoesAtuais.length === 0) return;

    evento.preventDefault();
    const proximo = evento.key === "ArrowDown"
      ? Math.min(indiceAtivo + 1, sugestoesAtuais.length - 1)
      : Math.max(indiceAtivo - 1, 0);
    marcarAtiva(proximo);
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (indiceAtivo >= 0 && sugestoesAtuais[indiceAtivo]) {
      irParaTermo(sugestoesAtuais[indiceAtivo].id);
      return;
    }
    const [primeiro] = buscarTermos(termos, input.value);
    if (primeiro) irParaTermo(primeiro.id);
  });

  document.addEventListener("click", (evento) => {
    if (!form.contains(evento.target)) fecharSugestoes();
  });
}

// ===== Todas as siglas: lista + filtros por campus e por tipo (RF02) =====

function criarCartaoTermo(termo) {
  const cartao = criarElemento("a", { classe: "cartao-termo", atributos: { href: `termo.html?id=${encodeURIComponent(termo.id)}` } });
  cartao.append(
    criarElemento("span", { classe: "nome-termo", texto: termo.termo }),
    criarElemento("span", { classe: "etiqueta-cartao", texto: TIPOS[termo.tipo] }),
    criarElemento("span", { classe: "etiqueta-cartao", texto: termo.campus }),
  );
  return cartao;
}

function iniciarListaCompleta(termos) {
  const container = document.getElementById("lista-termos");
  const seletorCampus = document.getElementById("filtro-campus");
  const seletorTipo = document.getElementById("filtro-tipo");
  const status = document.getElementById("filtro-status");
  if (!container) return;

  function renderizar() {
    const filtrados = filtrarTermos(termos, {
      campus: seletorCampus?.value || null,
      tipo: seletorTipo?.value || null,
    });
    container.replaceChildren();
    if (status) status.textContent = filtrados.length === 1 ? "1 termo encontrado." : `${filtrados.length} termos encontrados.`;

    if (filtrados.length === 0) {
      container.append(criarElemento("p", { classe: "aviso-vazio", texto: "Nenhum termo encontrado para esse filtro." }));
      return;
    }

    for (const [letra, doGrupo] of agruparPorLetra(filtrados)) {
      const secao = criarElemento("section", { classe: "letra", atributos: { id: `letra-${letra}` } });
      secao.append(criarElemento("h2", { texto: letra }), ...doGrupo.map(criarCartaoTermo));
      container.append(secao);
    }
  }

  preencherOpcoes(seletorCampus, CAMPI.map((campus) => [campus, campus]));
  preencherOpcoes(seletorTipo, Object.entries(TIPOS));
  seletorCampus?.addEventListener("change", renderizar);
  seletorTipo?.addEventListener("change", renderizar);
  renderizar();
}

// ===== Página de termo =====

function criarBloco(titulo, ...conteudo) {
  const bloco = criarElemento("section", { classe: "bloco" });
  bloco.append(criarElemento("h2", { texto: titulo }), ...conteudo);
  return bloco;
}

// Fonte pode ser um link ou um texto ("conhecimento comum verificado pelo grupo").
function criarFonte(fonte) {
  const url = urlSegura(fonte);
  if (!url) return criarElemento("p", { texto: fonte });

  const paragrafo = criarElemento("p");
  paragrafo.append(criarElemento("a", { texto: fonte, atributos: { href: url, target: "_blank", rel: "noopener" } }));
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
    const aviso = criarElemento("div", { classe: "nao-encontrado" });
    aviso.append(
      criarElemento("h1", { texto: "Termo não encontrado" }),
      criarElemento("p", { texto: "Não achamos esse termo no glossário." }),
      criarElemento("a", { texto: "Ver todas as siglas", atributos: { href: "todas-siglas.html" } }),
    );
    container.append(aviso);
    return;
  }

  document.title = `${termo.termo} — Glossário UnB`;
  const etiquetas = criarElemento("p", { classe: "etiquetas" });
  etiquetas.append(
    criarElemento("span", { classe: "etiqueta", texto: TIPOS[termo.tipo] }),
    criarElemento("span", { classe: "etiqueta", texto: termo.campus }),
  );
  container.append(criarElemento("h1", { texto: termo.termo }), etiquetas);

  if (termo.significado) container.append(criarBloco("Significado", criarElemento("p", { texto: termo.significado })));
  container.append(
    criarBloco("Definição", criarElemento("p", { texto: termo.definicao })),
    criarBloco("Como se usa", criarElemento("p", { classe: "exemplo-frase", texto: termo.exemplo_uso })),
    criarBloco("Fonte", criarFonte(termo.fonte)),
  );

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
  iniciarListaCompleta(termos);
  iniciarPaginaTermo(termos);
} catch (erro) {
  console.error(erro);
  mostrarErroDeCarga();
}
