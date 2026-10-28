# ADR 0007 — Publicação no GitHub Pages e CI com GitHub Actions

## Contexto
- **Critérios de avaliação (Release 1):** "Gitpage – visão de produto (com foco no usuário)" vale 10%; "Deploy" vale 5% na avaliação coletiva.
- **Sprint 03 (`sprint-planning.md`):** "Pipeline CI/CD básico (lint + testes) verde" e "Feature rodando em deploy".
- **Requisitos:** RNF01 (PWA offline) exige HTTPS para o service worker (ADR 0003). Testes no módulo de dados eram o RNF04 até a revisão de 28/09 (PR #27), que deixou só o RNF01; o time mantém os testes como prática de qualidade.
- **Repositórios de referência** (SuaGradeUnB 2023-2, LicitaBSB 24.1, NoFluxoUnB 2025-1): usam GitHub Actions e publicam documentação no GitHub Pages com MkDocs Material.
- **Estado atual:** `.github/workflows/` só tinha um `.gitkeep`.

## Decisão
- **CI** (`.github/workflows/ci.yml`), em todo PR e push para `main`, roda `npm test`. Os testes usam `node:test`, sem dependências, e cobrem:
  - a lógica de domínio (busca, filtros, agrupamento, links seguros);
  - a validação de **todos** os termos de `frontend/data/termos.json` contra o schema da ADR 0004 (incluindo `id` duplicado).
- **Publicação em duas GitPages** (`.github/workflows/pages.yml`, 28/09). A cada push na `main`, o workflow roda `npm test` e só então publica:

  | Endereço | Pasta | O que é |
  |---|---|---|
  | `…/2026-2-GlossarioUnB/frontend/` | `frontend/` | **O glossário**: o produto (PWA) |
  | `…/2026-2-GlossarioUnB/sobre/` | `sobre/` | **Sobre o projeto**: apresentação, como contribuir, mapa do repositório. Só HTML e CSS |
  | `…/2026-2-GlossarioUnB/` | `index.html` | Redireciona para a página Sobre |

  - **Por que separar:** o glossário é para estudantes e a página Sobre é para quem avalia ou quer contribuir. Separadas, cada uma tem um público, a página Sobre não carrega o service worker nem o JavaScript do app, e o escopo do service worker fica restrito a `/frontend/`.
  - **Por que um só repositório e um só Pages:** o GitHub Pages permite um site por repositório. As duas páginas são pastas desse único site.
  - **Por que as mesmas pastas do repositório:** a primeira versão publicava a Sobre na raiz e o glossário em `/glossario/`. Os links entre as páginas só funcionavam depois de publicados; abrindo pelo Live Server ou direto no navegador, os botões "Sobre" e "Abrir o glossário" não levavam a lugar nenhum. Com as mesmas pastas, `../sobre/index.html` e `../frontend/index.html` funcionam em qualquer forma de abrir. O custo é a URL do glossário ter `frontend/` no caminho.
  - `npm run dev` (`scripts/servidor-local.mjs`) serve o mesmo layout, sem dependências.
  - **[FALTA: ativar em Settings → Pages → Source: GitHub Actions]**

## Alternativas descartadas
- **Vercel ou Netlify.** Exigem conta e serviço fora da organização `unb-mds`, sem ganho para um site estático.
- **CI em serviço externo** (o glossario-ufcg usa Travis). Mais uma integração para configurar, quando o Actions já está disponível no repositório.

## Consequências
- (+) Um PR com termo inválido (sem `fonte`, `tipo` fora da lista, `id` repetido) fica vermelho no CI antes da revisão humana. Isso adianta parte da ideia futura "bot que confere schema, duplicidade e fonte" do Story Map.
- (−) Ainda não há lint no CI; é um próximo passo.
- (−) A página Sobre é escrita à mão, então números como "40 siglas" e "26 testes" precisam ser atualizados junto com o projeto.
- (−) `unb-mds.github.io` é uma origem compartilhada com os outros projetos da organização (ver ADR 0003).
