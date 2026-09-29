// Estratégias de cache: ver docs/adr/0003-pwa-com-service-worker-proprio.md.
// Ao mudar qualquer arquivo do app shell, incremente VERSAO_CACHE.
const PREFIXO_CACHE = "glossario-unb-";
const VERSAO_CACHE = `${PREFIXO_CACHE}v13`;

const ARQUIVO_DADOS = "data/termos.json";

const ARQUIVOS_APP_SHELL = [
  "index.html",
  "todas-siglas.html",
  "termo.html",
  "styles.css",
  "js/app.js",
  "js/termos.js",
  "js/validacao-termo.js",
  "manifest.json",
  "favicon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  // Pré-cacheado também: sem isso, a primeira visita não deixava os termos disponíveis offline.
  ARQUIVO_DADOS,
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(VERSAO_CACHE)
      .then((cache) => cache.addAll(ARQUIVOS_APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            // Só caches deste app: em unb-mds.github.io outros projetos da organização
            // dividem a mesma origem, e apagar os caches deles quebraria o offline alheio.
            .filter((chave) => chave.startsWith(PREFIXO_CACHE) && chave !== VERSAO_CACHE)
            .map((chave) => caches.delete(chave))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const url = new URL(evento.request.url);

  // Só cuidamos de pedidos de mesma origem (app shell + dados).
  // Tiles de mapa e bibliotecas externas seguem direto pra rede.
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith(ARQUIVO_DADOS)) {
    // Stale-while-revalidate: responde rápido do cache, atualiza em segundo plano.
    const respostaCache = caches.open(VERSAO_CACHE).then((cache) => cache.match(evento.request));
    const buscaRede = fetch(evento.request).then(async (respostaRede) => {
      // Só guarda resposta de sucesso: um 404/500 não pode substituir os termos em cache.
      if (respostaRede.ok) {
        const cache = await caches.open(VERSAO_CACHE);
        await cache.put(evento.request, respostaRede.clone());
      }
      return respostaRede;
    });
    // Sem rede, quem responde é o cache (quando existe); a falha fica só registrada.
    evento.waitUntil(buscaRede.catch((erro) => console.info("Termos servidos do cache, sem rede:", erro.message)));
    evento.respondWith(
      respostaCache.then((emCache) => emCache || buscaRede)
    );
    return;
  }

  // Navegação entre páginas (clicar num link, digitar a URL, etc.):
  // tenta a rede primeiro, pra sempre pegar a página certa (inclusive com
  // "?id=..." na URL, que não bate exatamente com o que foi guardado no
  // cache). Só cai pro cache quando estiver offline de verdade.
  if (evento.request.mode === "navigate") {
    evento.respondWith(
      fetch(evento.request).catch(async () => {
        const cache = await caches.open(VERSAO_CACHE);

        if (url.pathname === "/" || url.pathname.endsWith("/")) {
          return (await cache.match("index.html")) || Response.error();
        }

        // ignoreSearch: acha "termo.html" no cache mesmo o pedido sendo
        // "termo.html?id=minhocao".
        const porPagina = await cache.match(evento.request, { ignoreSearch: true });
        if (porPagina) return porPagina;

        return (await cache.match("index.html")) || Response.error();
      })
    );
    return;
  }

  // Demais arquivos do app shell (CSS, JS, ícones, manifest): cache-first.
  evento.respondWith(
    caches.match(evento.request, { ignoreSearch: true }).then((respostaCache) => {
      return respostaCache || fetch(evento.request);
    })
  );
});
