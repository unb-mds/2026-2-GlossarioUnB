# Glossário UnB — aplicação (frontend)

PWA de consulta a siglas, gírias e expressões da UnB, no estilo do glossario-ufcg:
- busca com autocomplete;
- lista completa filtrável por campus e por tipo;
- página de cada termo com definição, uso em frase, fonte e, quando for um lugar físico, mapa.

Decisões de arquitetura em [`docs/adr/`](../docs/adr/) (status: propostas).

## Como rodar localmente

Service workers e módulos ES não funcionam abrindo o arquivo direto (`file://`); é preciso um servidor. Na raiz do repositório:

```bash
npm run dev      # = python3 -m http.server 8080 --directory frontend
```

E acesse `http://localhost:8080`. Para rodar os testes (Node 22 ou mais novo, sem dependências):

```bash
npm test
```

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Tela inicial com a busca (autocomplete acessível, padrão ARIA *combobox*) |
| `todas-siglas.html` | Lista completa agrupada por letra, com filtro por campus e por tipo (RF02) |
| `termo.html` | Página de um termo (`?id=...`), com mapa quando o termo tem `localizacao` |
| `data/termos.json` | Os dados, no schema da [ADR 0004](../docs/adr/0004-schema-unico-do-termo.md) |
| `js/termos.js` | Regras de busca, filtro e agrupamento (sem DOM, testadas em `tests/`) |
| `js/validacao-termo.js` | Validação do schema, usada pelo app e pelo CI |
| `js/app.js` | Liga as regras ao DOM das 3 páginas |
| `styles.css` | Estilo compartilhado, tema claro/escuro |
| `manifest.json` / `sw.js` | PWA e cache offline ([ADR 0003](../docs/adr/0003-pwa-com-service-worker-proprio.md)) |
| `icons/`, `favicon.png`, `icon-source.svg` | Ícone placeholder (ver abaixo) |

## Linguagem do domínio

- **Termo:** um item do glossário (sigla, gíria ou expressão), com definição, exemplo de uso e fonte. É uma entrada de `data/termos.json`. Evite chamar todo termo de "sigla": "Minhocão" é um apelido.
- **Tipo:** `sigla`, `giria` ou `expressao`. É o filtro do RF02.
- **Campus:** um dos 4 campi (Darcy Ribeiro, Ceilândia, Gama, Planaltina) ou `Geral`, quando vale para todos. Ao filtrar por um campus, os termos `Geral` aparecem junto.
- **Localização:** sub-objeto opcional (`lat`, `lng`, `link_como_chegar`). Quando existe, a página do termo mostra o mapa.

## Escopo offline

- **Funciona sem internet:** busca, lista e páginas de termo. O app shell e `data/termos.json` ficam em cache desde a primeira visita.
- **Precisa de internet:** o mapa (Leaflet via CDN e tiles do OpenStreetMap). Offline, aparece um aviso no lugar do mapa.
- **Ao mudar qualquer arquivo do app shell**, incremente `VERSAO_CACHE` em `sw.js`. Sem isso, quem já instalou continua vendo a versão antiga.

## Trocar o logo placeholder

O ícone atual é um monograma "UnB" gerado como placeholder. Para trocar pela logo oficial:

1. Substitua `icons/icon-192.png` (192×192), `icons/icon-512.png` (512×512) e `favicon.png`.
2. Incremente `VERSAO_CACHE` em `sw.js`.

## Publicação

É um site estático sem build: basta publicar a pasta `frontend/` (proposta: GitHub Pages, [ADR 0007](../docs/adr/0007-github-pages-e-ci-com-actions.md)).
