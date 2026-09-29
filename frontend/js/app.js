// Camada de DOM das 3 páginas. Regras de busca/filtro ficam em termos.js e
// o schema em validacao-termo.js (ADR 0002), para poderem ser testados no Node.
// Todo dado de termo entra na página via textContent, nunca via innerHTML:
// termos chegam por PR de terceiros (RF04) e não podem injetar HTML.

import {
  CAMPI, CAMPUS_GERAL, TIPOS, agruparPorLetra, buscarTermos, contarPorTipo, encontrarTermo,
  filtrarTermos, filtrosDaUrl, normalizar, resumoDoTermo,
} from "./termos.js";
import { urlSegura, validarTermo } from "./validacao-termo.js";

const URL_DADOS = "data/termos.json";
const URL_REPOSITORIO = "https://github.com/unb-mds/2026-2-GlossarioUnB";
const MENSAGEM_ERRO_CARGA = "Não foi possível carregar os termos. Verifique sua conexão e tente de novo.";
const TIPOS_NO_PLURAL = { sigla: "Siglas", giria: "Gírias", expressao: "Expressões" };
// Com prefixo: unb-mds.github.io é uma origem compartilhada por todos os projetos da organização.
const CHAVE_TEMA = "glossario-unb:tema";

// Modelos de issue "Adicionar termo" e "Corrigir definição" (ADR 0006), já com o termo no título.
function urlModeloIssue(modelo, prefixoTitulo, termo = "") {
  const base = `${URL_REPOSITORIO}/issues/new?template=${modelo}`;
  return termo ? `${base}&title=${encodeURIComponent(`${prefixoTitulo} ${termo}`)}` : base;
}

const urlAdicionarTermo = (termo) => urlModeloIssue("adicionar-termo.md", "[Adicionar Termo]", termo);
const urlCorrigirDefinicao = (termo) => urlModeloIssue("corrigir-definicao.md", "[Corrigir Definição]", termo);

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

function rotuloCampus(campus) {
  return campus === CAMPUS_GERAL ? "Todos os campi" : `Campus ${campus}`;
}

function urlDoTermo(termo) {
  return `termo.html?id=${encodeURIComponent(termo.id)}`;
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

function salvarTema(tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch (erro) {
    console.warn("Não foi possível salvar a preferência de tema:", erro);
  }
}

function iniciarTema() {
  const botao = document.getElementById("botao-tema");
  if (!botao) return;

  const escuroAtivo = () => {
    const atual = document.documentElement.getAttribute("data-tema");
    return atual === "escuro" || (!atual && window.matchMedia("(prefers-color-scheme: dark)").matches);
  };
  const atualizarBotao = () => botao.setAttribute("aria-pressed", String(escuroAtivo()));

  botao.addEventListener("click", () => {
    const novo = escuroAtivo() ? "claro" : "escuro";
    document.documentElement.setAttribute("data-tema", novo);
    salvarTema(novo);
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
    avisoVazio.replaceChildren(`Nenhum termo encontrado para “${consulta.trim()}”. `, link);
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
    if (!normalizar(input.value)) {
      status.textContent = "";
      return;
    }

    sugestoesAtuais = buscarTermos(termos, input.value);
    if (sugestoesAtuais.length === 0) {
      status.textContent = "Nenhum termo encontrado.";
      mostrarAvisoVazio(input.value);
      return;
    }

    sugestoesAtuais.forEach((termo, i) => {
      const opcao = criarElemento("li", {
        classe: "sugestao",
        atributos: { id: `sugestao-${i}`, role: "option", "aria-selected": "false" },
      });
      opcao.append(
        criarElemento("span", { classe: "sugestao-termo", texto: termo.termo }),
        criarElemento("span", { classe: "sugestao-resumo", texto: resumoDoTermo(termo) }),
      );
      opcao.addEventListener("click", () => irParaTermo(termo));
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
      irParaTermo(sugestoesAtuais[indiceAtivo]);
      return;
    }
    const [primeiro] = buscarTermos(termos, input.value);
    if (primeiro) irParaTermo(primeiro);
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

  for (const [tipo, quantidade] of contarPorTipo(termos)) {
    const link = criarElemento("a", { classe: "atalho", atributos: { href: `todas-siglas.html?tipo=${tipo}` } });
    link.append(TIPOS_NO_PLURAL[tipo], criarElemento("span", { classe: "atalho-total", texto: String(quantidade) }));
    const item = criarElemento("li");
    item.append(link);
    atalhos.append(item);
  }
}

// ===== Todas as siglas: índice, filtros por tipo (RF02) e campus =====

function idDaLetra(letra) {
  return letra === "#" ? "letra-outros" : `letra-${letra}`;
}

function criarCartaoTermo(termo) {
  const etiquetas = criarElemento("span", { classe: "etiquetas" });
  etiquetas.append(criarElemento("span", { classe: "etiqueta", texto: TIPOS[termo.tipo] }));
  // "Geral" vale para todos: repetir a etiqueta em todo cartão só gera ruído.
  if (termo.campus !== CAMPUS_GERAL) {
    etiquetas.append(criarElemento("span", { classe: "etiqueta etiqueta-contorno", texto: termo.campus }));
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
  const indice = document.getElementById("indice-letras");
  const status = document.getElementById("filtro-status");
  if (!container || !seletorCampus || !seletorTipo) return;

  preencherOpcoes(seletorTipo, Object.entries(TIPOS));
  preencherOpcoes(seletorCampus, CAMPI.map((campus) => [campus, campus]));

  // Filtros vêm da URL (atalhos da página inicial) e voltam para ela: o link pode ser compartilhado.
  const inicial = filtrosDaUrl(new URLSearchParams(window.location.search));
  seletorTipo.value = inicial.tipo ?? "";
  seletorCampus.value = inicial.campus ?? "";

  function atualizarUrl() {
    const parametros = new URLSearchParams();
    if (seletorTipo.value) parametros.set("tipo", seletorTipo.value);
    if (seletorCampus.value) parametros.set("campus", seletorCampus.value);
    const busca = parametros.toString();
    history.replaceState(null, "", busca ? `?${busca}` : window.location.pathname);
  }

  function renderizar() {
    const filtrados = filtrarTermos(termos, { campus: seletorCampus.value || null, tipo: seletorTipo.value || null });
    const grupos = agruparPorLetra(filtrados);
    container.replaceChildren();
    indice?.replaceChildren();
    if (status) status.textContent = filtrados.length === 1 ? "1 termo" : `${filtrados.length} termos`;

    if (filtrados.length === 0) {
      container.append(criarElemento("p", { classe: "aviso-vazio", texto: "Nenhum termo encontrado para esse filtro." }));
      return;
    }

    for (const [letra, doGrupo] of grupos) {
      indice?.append(criarElemento("a", {
        texto: letra,
        atributos: { href: `#${idDaLetra(letra)}`, "aria-label": letra === "#" ? "Outros símbolos" : `Letra ${letra}` },
      }));

      const secao = criarElemento("section", { classe: "grupo-letra", atributos: { id: idDaLetra(letra) } });
      const grade = criarElemento("div", { classe: "grade" });
      grade.append(...doGrupo.map(criarCartaoTermo));
      secao.append(criarElemento("h2", { texto: letra }), grade);
      container.append(secao);
    }
  }

  for (const seletor of [seletorTipo, seletorCampus]) {
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

// Fonte pode ser um link ou um texto ("conhecimento comum verificado pelo grupo").
// Links aparecem sem "https://" e sem a barra final, que só atrapalham a leitura.
function criarFonte(fonte) {
  const url = urlSegura(fonte);
  if (!url) return criarElemento("p", { texto: fonte });

  const { hostname, pathname } = new URL(url);
  const texto = `${hostname}${pathname === "/" ? "" : pathname}`;
  const paragrafo = criarElemento("p");
  paragrafo.append(criarElemento("a", { texto, atributos: { href: url, target: "_blank", rel: "noopener" } }));
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

  document.title = `${termo.termo} — Glossário UnB`;
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
  iniciarListaCompleta(termos);
  iniciarPaginaTermo(termos);
} catch (erro) {
  console.error(erro);
  mostrarErroDeCarga();
}
