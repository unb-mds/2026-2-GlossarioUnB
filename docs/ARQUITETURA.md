# Arquitetura — Glossário UnB

Dicionário colaborativo de termos da UnB. Requisitos completos em [`REQUISITOS.md`](REQUISITOS.md).

## Visão geral 

```
Planilha de coleta (Google Sheets)
        │
        ▼
  frontend/data/termos.json (JSON estático — ADR 0001, proposta)
        │
        ▼
   Aplicação de consulta (PWA) — publicada em /frontend/
        │
        ├── Busca por texto
        └── Filtro por categoria

   Página "Sobre o projeto" — publicada em /sobre/, site separado (a raiz redireciona para ela)
```

## Estrutura de pastas

```
G10-2026-2/
├── index.html          # raiz do site publicado: redireciona para sobre/
│   ├── data/           # termos.json — dataset (ADR 0001, proposta)
│   └── js/             # termos.js, validacao-termo.js (domínio) + app.js (DOM)
├── sobre/              # GitPage 2: apresentação do projeto, só HTML e CSS → /sobre/
├── frontend/           # GitPage 1: o glossário (PWA), sem build → /frontend/
├── scripts/            # servidor-local.mjs: as duas páginas no mesmo layout do Pages
├── tests/              # node:test — domínio + validação do dataset
├── docs/
│   ├── adr/
│   ├── estudos/
│   └── scrum/
└── .github/
    └── workflows/      # ci.yml (testes em todo PR) e pages.yml (publicação)
```

O dataset ficou dentro de `frontend/` para o glossário ser publicado copiando uma única pasta (ver ADR 0001). A pasta `skills/`, citada em versões anteriores deste documento, não existe no repositório.

## Decisões pendentes 

> - [ADR 0001 — Termos em JSON estático](adr/0001-termos-em-json-estatico.md)
> - [ADR 0002 — Frontend sem framework](adr/0002-frontend-sem-framework.md)
> - [ADR 0003 — PWA com service worker próprio](adr/0003-pwa-com-service-worker-proprio.md)
> - [ADR 0004 — Schema único do termo](adr/0004-schema-unico-do-termo.md)
> - [ADR 0005 — Mapa com Leaflet/OSM](adr/0005-mapa-de-locais-com-leaflet.md)
> - [ADR 0006 — Contribuição por PR e Issue](adr/0006-contribuicao-por-pr-e-issue.md)
> - [ADR 0007 — GitHub Pages e CI](adr/0007-github-pages-e-ci-com-actions.md)
> - [ADR 0008 — Interface com CSS puro e tokens](adr/0008-interface-com-css-puro-e-tokens.md) (28/09)

## Padrões de código (a manter desde o primeiro commit)

- Early return em vez de condicionais aninhadas
- Nenhuma lógica de validação de termo duplicada entre o front e o dataset
- Nomes de arquivo/módulo por domínio (`termos.js`, `buscaService.js`), evitar `utils.js`/`helpers.js` genérico
- Tratamento de erro explícito, sem `catch` vazio

## Referências

- Schema de termo: [`adr/0004-schema-unico-do-termo.md`](adr/0004-schema-unico-do-termo.md)
- Fluxo de contribuição: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
