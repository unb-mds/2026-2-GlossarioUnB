# Glossário UnB

Análise de requisitos e planejamento — MDS, UnB
Equipe: Pedro, Ítalo, Jéssyca, Allan, Zé (José Gabriel)

## 1. Objetivo

Dicionário colaborativo de siglas, gírias e jargões da UnB (DEG, DPO, PPAES, "menção SR", "trancamento geral", etc.), inspirado no [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg). Domínio pequeno de propósito, foco em qualidade de processo e produto.

## 2. Fonte de dados

Desde a Release 2, os termos vêm de fontes oficiais da UnB por um pipeline de coleta que abre um Pull Request revisado por uma pessoa ([`adr/0009-coleta-automatizada-por-pipeline.md`](adr/0009-coleta-automatizada-por-pipeline.md)). A [planilha colaborativa](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing) foi a coleta inicial da Release 1 e não recebe mais termos. Ver [`adr/0004-schema-unico-do-termo.md`](adr/0004-schema-unico-do-termo.md) para o schema de cada termo.

## 3. Requisitos Funcionais

| ID | Nome | Release |
| --- | --- | --- |
| RF01 | Busca textual de termos | R1 |
| RF02 | Listagem e filtro por categoria | R1 (lista) -> R2 (filtro) |
| RF03 | Arquivo Json da Planilha | R1 (parcial) -> R2 |
| RF04 | Sugestão de termo via Pull Request e Issue | R1 |
| RF05 | Detalhe do termo (significado, definição, exemplo, fonte) | R1 |
| RF06 | Validação automática das contribuições (schema, fonte, duplicidade) | R2 |
| RF07 | Sinalização de termo desatualizado | R2+ |
| RF08 | Autocomplete na busca | R2+ |
| RF09 | Termos parecidos e busca sem resultado | R2+ |
| RF10 | Formulário de sugestão no site | R2+ |

## 4. Requisitos Não-Funcionais

O PWA (instalável, com service worker) é a decisão técnica da [ADR 0003](adr/0003-pwa-com-service-worker-proprio.md), não um RNF. Cada RNF abaixo tem métrica, critério de aceitação e uma forma objetiva de verificação.

| ID | Requisito | Métrica e critério de aceitação | Como verificar | Release |
| --- | --- | --- | --- | --- |
| RNF01 | Disponibilidade: consulta offline | Depois da primeira visita, consultar termos em `frontend/` funciona sem rede, com o dataset em cache |  | R1+ |
| RNF02 | Desempenho | Página inicial carrega em até 2 s em 4G lento e Lighthouse Performance ≥ 90 | Lighthouse CI ([#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80)) | R2 |
| RNF03 | Acessibilidade | WCAG 2.1 AA, sem violações do axe-core nas três páginas, nos temas claro e escuro | axe-core no CI ([#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78)) e Lighthouse ([#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80)) | R2 |
| RNF04 | Usabilidade | Texto base de pelo menos 17 px e alvos de toque de pelo menos 44 px | Revisão de interface e teste E2E ([#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78)) | R2 |
| RNF05 | Qualidade dos dados | 100% dos termos com `fonte` e `tipo` (categoria) preenchidos e válidos; 0 links de fonte quebrados | `npm test` valida o schema ([`tests/dados.test.js`](../tests/dados.test.js)); links conferidos pela verificação periódica das fontes ([#60](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60)) | R1+ |
| RNF06 | Manutenibilidade | Cobertura de linhas ≥ 90% em `frontend/js/termos.js`, `frontend/js/validacao-termo.js` e `coleta/` | Cobertura mínima no CI ([#79](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79)) | R2 |
| RNF07 | Segurança | Nenhum dado de termo vira HTML, CDN usado só com SRI e nenhum segredo no front | Revisão de código, testes de URL segura ([`tests/validacao-termo.test.js`](../tests/validacao-termo.test.js)) e análise de segurança ([#83](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83)) | R2 |

## 5. Fora de escopo (MVP)

- Login de usuário / conta pessoal
- Edição de termo diretamente pelo site (sem passar por PR/issue)
- Tradução de fato para outro idioma
- App nativo mobile (o PWA cobre isso)
- Favoritar termos

## 6. Equipe

| Pessoa | Papel | Tema de Sprint 00 | GitHub |
|---|---|---|---|
| Ítalo | Scrum Master | — | smitalo |
| Jéssyca | Product Owner | — | Jessy2126 |
| Pedro | Dev | Git e GitHub + Metodologias Ágeis | p-magno |
| Allan | Dev | a confirmar (estudo já entregue) | MrD4ntas |
| Zé (José Gabriel) | Dev | a confirmar | josegabriel-iw |

## 7. Releases

Estrutura detalhada sprint a sprint em [`scrum/sprint-planning.md`](scrum/sprint-planning.md).

- **Release 1** (28/09/2026): escopo e arquitetura validados, protótipo funcional, tecnologias testadas com código rodando
- **Release 2** (25/11/2026): produto completo conforme RF01–RF06 e RNF01–RNF07
