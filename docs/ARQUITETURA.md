# Arquitetura — Glossário UnB

Dicionário colaborativo de termos da UnB. Requisitos completos em [`REQUISITOS.md`](REQUISITOS.md).

## Visão geral 

```
Fontes oficiais da UnB (coleta/fontes.json: páginas de siglas; o PDF entra com a #55)
        │
        ▼
  Pipeline de coleta no GitHub Actions (ADR 0009)
  coletores → normalizar e deduplicar → validarGlossario()
        │
        ▼
  Pull Request automático → revisão humana → merge na main
        │
        ▼
  frontend/data/termos.json (JSON estático — ADR 0001)
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
│   ├── data/           # termos.json — dataset (ADR 0001, proposta); trilha-calouro.json (ADR 0011)
│   └── js/             # termos.js, trilha.js, validacao-termo.js (domínio); busca.js, lista.js, ficha.js, tema.js (regras de cada página, com teste); app.js (só a tela)
├── sobre/              # GitPage 2: apresentação do projeto, só HTML e CSS → /sobre/
├── frontend/           # GitPage 1: o glossário (PWA), sem build → /frontend/
├── coleta/             # o robô: fontes, coletor, deduplicação, classificador e atualização do termos.json; pode usar bibliotecas (ADR 0010)
├── scripts/            # servidor-local.mjs (as duas páginas no mesmo layout do Pages), coletar.mjs (roda o robô) e coleta-automatica.mjs (pipeline completo da #59)
├── tests/              # node:test — domínio + validação do dataset
├── e2e/                # Playwright — fluxos no navegador + axe-core (ADR 0010)
├── docs/
│   ├── adr/
│   ├── estudos/
│   └── scrum/
└── .github/
    └── workflows/      # ci.yml (testes e E2E em todo PR), coleta.yml (coleta semanal) e pages.yml (publicação)
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
> - [ADR 0009 — Coleta automatizada por pipeline com PR revisado](adr/0009-coleta-automatizada-por-pipeline.md) (11/11)
> - [ADR 0010 — Bibliotecas npm nos scripts do robô](adr/0010-bibliotecas-nos-scripts-do-robo.md) (13/11, proposta)
> - [ADR 0011 — Trilha do calouro num arquivo próprio](adr/0011-trilha-do-calouro-em-arquivo-proprio.md) (17/11)
> - [ADR 0013 — Análise de qualidade com o SonarQube Cloud](adr/0013-analise-de-qualidade-com-sonarqube-cloud.md) (18/11)

## Padrões de código (a manter desde o primeiro commit)

- Early return em vez de condicionais aninhadas
- Nenhuma lógica de validação de termo duplicada entre o front e o dataset
- Nomes de arquivo/módulo por domínio (`termos.js`, `buscaService.js`), evitar `utils.js`/`helpers.js` genérico
- Tratamento de erro explícito, sem `catch` vazio

## Referências

- Schema de termo: [`adr/0004-schema-unico-do-termo.md`](adr/0004-schema-unico-do-termo.md)
- Modelo conceitual, dicionário de dados e disponibilidade das fontes: [`docs/modelo-conceitual-dados.md`](modelo-conceitual-dados.md)
- Fluxo de contribuição: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
