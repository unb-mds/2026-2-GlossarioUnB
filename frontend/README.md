# Glossário UnB — aplicação (frontend)

PWA de consulta a siglas, gírias e expressões da UnB, no estilo do glossario-ufcg:
- busca com autocomplete, que mostra o significado de cada sugestão;
- lista completa em cartões, com índice alfabético e filtros por tipo e por campus. Os filtros ficam na URL, por exemplo `todas-siglas.html?tipo=sigla`;
- página de cada termo com definição, exemplo de uso, fonte e, quando for um lugar físico, mapa;
- link para sugerir um termo pelo GitHub no rodapé, e na busca quando nada é encontrado.

Decisões de arquitetura registradas em [`docs/adr/`](../docs/adr/).

## Como rodar localmente

Service workers e módulos ES não funcionam abrindo o arquivo direto (`file://`); é preciso um servidor. Na raiz do repositório:

```bash
npm run dev      # servidor local sem dependências (scripts/servidor-local.mjs)
```

E acesse `http://localhost:8080/frontend/`. O servidor usa o mesmo layout do GitHub Pages, que é o das pastas do repositório: o glossário em `/frontend/` e a página "Sobre o projeto" em `/sobre/`. Também funciona abrir pelo Live Server do VS Code a partir da raiz do repositório. Para rodar os testes de domínio (Node 22 ou mais novo):

```bash
npm test
```

Os fluxos no navegador e a auditoria de acessibilidade ficam na raiz, em `e2e/`:

```bash
npm ci
npx playwright install chromium   # só na primeira vez
npm run test:e2e
```

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Tela inicial com a busca (autocomplete acessível, padrão ARIA *combobox*) |
| `todas-siglas.html` | Lista completa agrupada por letra, com filtro por campus e por tipo (RF02) |
| `termo.html` | Página de um termo (`?id=...`), com mapa quando o termo tem `localizacao` |
| `data/termos.json` | Os dados, no schema da [ADR 0004](../docs/adr/0004-schema-unico-do-termo.md) |
| `data/trilha-calouro.json` | A trilha "Primeiros passos na UnB" da página inicial: grupos com os ids dos termos ([ADR 0011](../docs/adr/0011-trilha-do-calouro-em-arquivo-proprio.md)) |
| `js/termos.js` | Regras de busca, filtro e agrupamento (sem DOM, testadas em `tests/`) |
| `js/trilha.js` | Monta e valida a trilha do calouro (sem DOM, testada em `tests/trilha.test.js`) |
| `js/validacao-termo.js` | Validação do schema, usada pelo app e pelo CI |
| `js/busca.js` | Regras da página inicial: sugestões da busca, setas e Enter, atalhos por tipo e a trilha pronta para a tela (sem DOM, testadas em `tests/busca.test.js`) |
| `js/lista.js` | Regras de "Todas as siglas": filtros, grupos por letra, índice, contagem e etiquetas do cartão (sem DOM, testadas em `tests/lista.test.js`) |
| `js/ficha.js` | Regras da página do termo: título da aba, campus, fonte (link ou texto) e endereço do termo (sem DOM, testadas em `tests/ficha.test.js`) |
| `js/tema.js` | Tema claro/escuro: qual vale, o próximo e salvar a escolha mesmo sem `localStorage` (sem DOM, testadas em `tests/tema.test.js`) |
| `js/app.js` | Liga as regras ao DOM das 3 páginas |
| `styles.css` | Estilo compartilhado; cores só como tokens, temas claro/escuro ([ADR 0008](../docs/adr/0008-interface-com-css-puro-e-tokens.md)) |
| `manifest.json` / `sw.js` | PWA e cache offline ([ADR 0003](../docs/adr/0003-pwa-com-service-worker-proprio.md)) |
| `icons/`, `favicon.png` | Ícone do app: logotipo da UnB (desde 28/09; ver abaixo) |
| `icon-source.svg` | Monograma "UnB" usado como ícone até 28/09 (não é mais usado) |

## Linguagem do domínio

- **Termo:** um item do glossário (sigla, gíria ou expressão), com definição, exemplo de uso e fonte. É uma entrada de `data/termos.json`. Evite chamar todo termo de "sigla": "Minhocão" é um apelido.
- **Tipo:** `sigla`, `giria` ou `expressao`. É o filtro do RF02.
- **Campus:** um dos 4 campi (Darcy Ribeiro, Ceilândia, Gama, Planaltina) ou `Geral`, quando vale para todos. Ao filtrar por um campus, os termos `Geral` aparecem junto.
- **Localização:** sub-objeto opcional (`lat`, `lng`, `link_como_chegar`). Quando existe, a página do termo mostra o mapa.

## Design (ADR 0008)

- **Cores:** mudam só nos blocos `:root` do topo de `styles.css`. O tema escuro troca os mesmos tokens. Não use cor "solta" nas regras.
- **Contraste e toque:** toda combinação de texto e fundo precisa de contraste WCAG AA (4,5:1 para texto normal). Botões e links clicáveis devem ter pelo menos 44 px de altura.
- **Fontes e ícones:** sem fonte web nem biblioteca de ícones. Fontes do sistema e SVG inline mantêm o app offline e sem dependências.
- **Movimento:** animações só dentro de `@media (prefers-reduced-motion: no-preference)`.
- **Antes de abrir um PR visual,** confira no tema claro e no escuro, no celular (≈390 px) e navegando só pelo teclado.

## Escopo offline

- **Funciona sem internet:** busca, lista e páginas de termo. O app shell, `data/termos.json` e `data/trilha-calouro.json` ficam em cache desde a primeira visita.
- **Precisa de internet:** o mapa (Leaflet via CDN e tiles do OpenStreetMap). Offline, aparece um aviso no lugar do mapa.
- **Ao mudar qualquer arquivo do app shell**, incremente `VERSAO_CACHE` em `sw.js`. Sem isso, quem já instalou continua vendo a versão antiga.

## Publicação

É um site estático sem build. O workflow `.github/workflows/pages.yml` publica esta pasta em `/frontend/` e a página "Sobre o projeto" em `/sobre/`, com as mesmas pastas do repositório. Por isso o link "Sobre" (`../sobre/index.html`) funciona em qualquer forma de abrir. Detalhes na [ADR 0007](../docs/adr/0007-github-pages-e-ci-com-actions.md).

- **Origem compartilhada:** `unb-mds.github.io` é o mesmo endereço de todos os projetos da organização. Por isso o cache do service worker e a preferência de tema usam o prefixo `glossario-unb`, e o service worker só apaga os próprios caches.
- **Escopo do service worker:** `/frontend/`. Ele não controla a página "Sobre".
