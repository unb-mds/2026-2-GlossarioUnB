# Backlog de Sprints — Glossário UnB

> Projeto: **Glossário UnB** — dicionário colaborativo de siglas e gírias da UnB (inspirado no [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg), da OpenDevUFCG).
> Foco de qualidade: PWA, acessibilidade, i18n, cobertura de testes e fluxo de contribuição via PR de terceiros.

---

## 0. Por que esta reorganização

A disciplina MDS 2026/2 estrutura o semestre em **9 sprints de 2 semanas**, com a **Release 1 na semana 7 (28/09/2026)**. Antes da Release 1 são só **4 sprints**  e a Release 1 já exige: escopo/arquitetura validados, tecnologias testadas com código funcional e uma implementação inicial rodando. Depois da Release 1, as **Sprints 04 a 09** levam até a **Release 2 (25/11/2026)**, com foco em coleta automatizada, qualidade e documentação. Por isso o plano abaixo:

- Mantém os itens (arquitetura, metodologias ágeis, skills, benchmark, figma, requisitos, brainstorm).
- Acrescenta o que a grade oficial exige neste bloco: Git como artefato de engenharia, requisitos ágeis com critério de aceitação, spec-driven development (specify → plan → tasks → implement), ADR de arquitetura, backlog priorizado no GitHub Projects.
- Reordena: brainstorm e requisitos vêm **antes** do Figma.
- Fragmenta cada bloco em tarefas de **uma pessoa só**, para virar um commit/PR individual e rastreável, o padrão que projetos como a disciplina chama de "coelho da sprint" (uma pessoa assume um tópico, estuda/implementa e documenta).


---

## Linha do tempo até a Release 2

| Sprint | Semanas | Conteúdo oficial da disciplina no período                                                                       | Marco |
|---|---|---|-----------------------------------------------------------------------------------------------------------------|---|
| Sprint 00 | 1–2 | Fundamentos e setup: estudos de Git/GitHub, Metodologias Ágeis, Banco de Dados, Arquitetura, Backend e Frontend | Tema aprovado (Glossário UnB) |
| Sprint 01 | 3–4 | ADR 0001, benchmark do glossario-ufcg, skills individuais por tecnologia.                                       | Primeira spec rascunhada |
| Sprint 02 | 5 | Protótipo no Figma, backlog priorizado no board, migração da planilha de termos pro dataset.                                              | Backlog priorizado + protótipo Figma |
| Sprint 03 | 6–7 | Implementação inicial (PWA, tela de consulta), pipeline de CI verde, preparação da apresentação. Fecha em Release 1.                                                                   | **Release 1 — 28/09/2026** |
| Sprint 04 | 8–9 | Arrumação do repositório, catálogo das fontes, ADR 0009, taxonomia, RNFs mensuráveis e decisões da R2. | Decisões e fontes documentadas |
| Sprint 05 | 10 | Primeiros coletores (PDF da DPO e HTML), schema novo, lint e cobertura no CI. | Pipeline de coleta iniciado |
| Sprint 06 | 11 | Deduplicação, primeiras fontes reais, documentação dos dados, requisitos rastreáveis e testes E2E. | Dados e testes E2E |
| Sprint 07 | 12 | Classificação com LLM, workflow que abre PR, navegação por categoria, trilha do calouro e testes de aceitação. | PR automático do robô |
| Sprint 08 | 13 | Verificação das fontes, segurança, mutação, Lighthouse, página de dados e GitPage de produto. | CI completo e GitPage de produto |
| Sprint 09 | 14 | Coleta real revisada, relatório de testes, README final e release v2.0.0. | **Release 2 — 25/11/2026** |

---

## Sprint 00 — Fundamentos, tema e setup (semanas 1–2)

**Objetivo:** alinhar processo, montar o esqueleto técnico e já deixar o repositório pronto para receber contribuições.

| # | Tarefa | Responsável | Entregável (= 1 commit/PR) |
|---|---|---|---|
| 1 | Contrato de equipe: papéis rotativos (Scrum Master, PO), horários de reunião, canais de comunicação | Ítalo e Jéssyca | `docs/equipe.md` |
| 2 | Metodologias ágeis aplicadas ao projeto (Scrum vs Kanban, o que o time vai usar e por quê) | Pedro | `docs/metodologia.md` |
| 3 | Ciclo de vida e Processo Unificado — comparação rápida e justificativa da escolha (incremental/evolutivo) para o projeto | Pedro | `docs/processo.md` |
| 4 | Modelagem inicial dos dados de um termo (sigla, gíria, categoria, definição, exemplo de uso, fonte) — olhando o schema do glossario-ufcg como referência | Ítalo e Pedro | `docs/database.md` ou `schema.json` |
| 5 | Setup do repositório: `README.md`, `LICENSE` (MIT), `CODE_OF_CONDUCT.md`, templates de issue/PR | Pedro | Arquivos na raiz + `.github/` |
| 6 | Abrir `AI-USAGE.md` (registro de uso de IA, exigido pela política da disciplina) | Pedro | `AI-USAGE.md` |

> Referência de padrão real: no SuaGradeUnB, a Sprint 0 definiu horário de reunião, 3 "coelhos" estudando Git/GitHub, GitHub Flow e Metodologias Ágeis, e já fechou tema, requisitos iniciais, stack e divisão de setores (mobile/design, back-end, DevOps) — tudo na primeira semana.

---

## Sprint 01 — Skills, board e primeiros artefatos de processo (semanas 3–4)

**Objetivo:** cada pessoa domina a tecnologia que vai usar, o board está pronto, e o time começa a tratar a especificação como artefato de primeira classe.

| # | Tarefa | Responsável                                                                                      | Entregável |
|---|---|--------------------------------------------------------------------------------------------------|---|
| 1 | Skill individual: estudar 1 tecnologia do projeto (React/Vue, testes automatizados, PWA/service worker, lib de i18n, Docker, GitHub Actions) | Ítalo - PWA + i18n / Alex Git Actions e Testes Automatizados / Jéssyca Docker / Allan - Frontend / José - React/Vue | `docs/skills/<nome>.md` |
| 2 | Molde de milestone + board Kanban no GitHub Projects, já com as sprints seguintes cadastradas | Ítalo                                                                                            | Board configurado |
| 3 | Benchmark: comparar o Glossário UnB com o glossario-ufcg (e opcionalmente outro glossário institucional) — o que copiar, o que melhorar (PWA, a11y, i18n) | Ítalo                                                                                            | `docs/benchmark.md` |
| 4 | Git como artefato de engenharia: convenção de commits (Conventional Commits) + fluxo de branches do time | Pedro                                                                                            | `CONTRIBUTING.md` (seção de Git) |
| 5 | Requisitos ágeis: primeiros épicos e user stories com critério de aceitação (formato Gherkin) | José                                                                                 | `docs/requisitos.md` (rascunho) |
| 6 | Spec-driven development I: escrever o primeiro rascunho da "constituição" do projeto (specify) — o que o Glossário UnB é e não é | Jéssyca | `specs/constitution.md` |

---

## Sprint 02 — Requisitos, arquitetura e protótipo (semana 5)

**Objetivo:** fechar requisitos, registrar decisões de arquitetura em ADR, priorizar o backlog e só então desenhar as telas.

| # | Tarefa | Responsável            | Entregável |
|---|---|------------------------|---|
| 1 | Brainstorm de categorias de termos (siglas, gírias, ex.: "menção SR", "trancamento geral", "reoferta") — cada pessoa levanta uma lista de termos de **uma categoria** | Todos (uma categoria por pessoa) | `data/termos-<categoria>.json` (PR de conteúdo real!) |
| 2 | Levantamento de requisitos funcionais/não funcionais + Story Map, fechando os critérios de aceitação abertos na Sprint 01 | Allan e Pedro          | `docs/requisitos.md` (final) |
| 3 | Spec-driven development II: revisar a spec com o resto do time, listar ambiguidades | Todos (assíncrono)          | `specs/spec.md` revisado |
| 4 | Arquitetura + ADR: JSON estático vs. banco de dados, stack definitiva, diagrama C4 nível 1–2 | Pedro               | `docs/adr/0001-arquitetura.md` |
| 5 | Backlog priorizado no GitHub Projects (MoSCoW ou valor × esforço), épicos virando issues | Ítalo        | Board atualizado |
| 6 | Protótipo Figma: Home, Busca, Lista de termos por categoria, formulário "Sugerir termo" | Ítalo, Allan e Pedro   | Link do Figma no README |
| 7 | Fluxo de contribuição externa (igual ao do glossario-ufcg): templates de issue "Adicionar termo" / "Corrigir definição" | José               | `.github/ISSUE_TEMPLATE/` |

---

## Sprint 03 — Planejamento, fluxo e implementação inicial (semanas 6–7) → Release 1

**Objetivo:** sair do planejamento para código funcionando, com pipeline verde, a tempo da apresentação de 28/09.

| # | Tarefa | Responsável | Entregável |
|---|---|---|---|
| 1 | Sprint planning com estimativa (planning poker) das issues de implementação | Todos | Sprint 03 no board |
| 2 | Kanban com limite de WIP configurado | Ítalo | Board com WIP |
| 3 | PWA básico: `manifest.json` + service worker mínimo | Pedro | PWA instalável |
| 4 | Primeira tela funcional consumindo os dados de termos reais (das Sprints 00–02) | Pedro | Feature rodando em deploy |
| 5 | Pipeline CI/CD básico (lint + testes) verde | Pedro | Badge de CI no README |
| 6 | Preparar apresentação da Release 1 (5 min): desafio, o que foi implementado, evidências de viabilidade | Todos | Slides + ensaio |

---

## Sprints da Release 2

As seções abaixo listam as issues de cada sprint conforme os milestones do GitHub, com o responsável e o estado (aberta/fechada) em 17/11/2026.

## Sprint 04 — Arrumação, fontes e decisões (05/10 a 18/10)

**Objetivo:** arrumar o repositório, catalogar as fontes de dados e tomar as decisões da R2 (ADR 0009, categorias, RNFs, trilha do calouro e spike do bot de siglas).

| Issue | Tarefa | Responsável | Estado |
|---|---|---|---|
| [#42](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/42) | Documentação da Sprint 04: planning, review, retrospectiva e métricas | Allan | Aberta |
| [#43](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/43) | Documentação da estratégia de testes | Allan | Aberta |
| [#44](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/44) | Proteger a branch main e adicionar o .env.example | Allan | Aberta |
| [#52](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/52) | Levantar e documentar as fontes de dados de termos da UnB | Pedro | Aberta |
| [#53](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/53) | ADR 0009: coleta automatizada de termos por pipeline com PR revisado | Pedro | Fechada |
| [#54](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/54) | Spike: protótipo do bot de siglas (extração do PDF da DPO) | Ítalo | Aberta |
| [#63](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/63) | Definir a taxonomia de categorias dos termos | Pedro | Aberta |
| [#65](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/65) | Corrigir campus e redação dos termos atuais | José | Aberta |
| [#69](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/69) | Definir os termos da trilha do calouro | José | Aberta |
| [#77](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/77) | Reescrever os requisitos não funcionais de forma mensurável | Ítalo | Aberta |
| [#85](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/85) | Corrigir as inconsistências da documentação e fechar o Status das ADRs | José | Aberta |
| [#86](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/86) | Regularizar o AI-USAGE.md | Pedro | Aberta |
| [#87](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/87) | Registrar a retrospectiva da R1 e o planejamento da R2 | Ítalo | Aberta |
| [#94](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/94) | Completar os padrões de software livre: CODE_OF_CONDUCT, CHANGELOG e SECURITY | José | Aberta |
| [#95](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/95) | AGENTS.md conciso na raiz do repositório | Pedro | Aberta |
| [#116](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/116) | Atualizar o sprint-planning | Ítalo | Em andamento |

## Sprint 05 — Primeiros coletores e schema novo (19/10 a 25/10)

**Objetivo:** primeiros coletores (PDF da DPO e HTML), schema com sinônimos e relacionados, lint e cobertura no CI.

| Issue | Tarefa | Responsável | Estado |
|---|---|---|---|
| [#55](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/55) | Coletor da Lista de Siglas oficial da DPO (PDF para candidatos) | Ítalo | Aberta |
| [#56](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/56) | Coletor genérico de páginas HTML configurado por fontes.json | Pedro | Aberta |
| [#64](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/64) | Evoluir o schema: sinônimos, relacionados, saiba mais e proveniência | José | Aberta |
| [#68](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/68) | Escrever a visão de produto e as histórias de usuário (Gherkin) | Allan | Aberta |
| [#71](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/71) | Migrar os templates de sugestão para Issue Forms (YAML) | José | Aberta |
| [#79](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79) | Lint e cobertura mínima no CI | Allan | Aberta |
| [#88](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/88) | Diagrama de arquitetura no modelo C4 (níveis 1 e 2), já com o pipeline | Allan | Aberta |
| [#89](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/89) | Documentar a Sprint 05: planning, review, retrospectiva e métricas | Pedro | Aberta |

## Sprint 06 — Deduplicação, dados documentados e testes E2E (26/10 a 01/11)

**Objetivo:** deduplicação, primeiras fontes reais, documentação dos dados, requisitos rastreáveis e testes E2E.

| Issue | Tarefa | Responsável | Estado |
|---|---|---|---|
| [#57](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/57) | Normalização, deduplicação e merge com o termos.json | Pedro | Fechada |
| [#61](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/61) | Configurar as primeiras fontes HTML: FAQ da SAA e páginas das unidades | José | Aberta |
| [#67](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/67) | Documentar os dados: modelo conceitual, dicionário de dados e disponibilidade das fontes | Ítalo | Aberta |
| [#73](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/73) | Reescrever os requisitos (verbo + objeto, critérios de aceitação, regras de negócio) e criar a matriz de rastreabilidade | Allan | Aberta |
| [#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78) | Testes E2E com Playwright e auditoria de acessibilidade (axe-core) no CI | Allan | Aberta |
| [#90](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/90) | Documentar a Sprint 06: planning, review, retrospectiva e métricas | Ítalo | Aberta |

## Sprint 07 — LLM, automação e navegação por categoria (02/11 a 08/11)

**Objetivo:** classificação com LLM, workflow que abre PR, navegação por categoria, trilha do calouro e testes de aceitação.

| Issue | Tarefa | Responsável | Estado |
|---|---|---|---|
| [#58](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/58) | Categorização e redação assistidas por LLM (API do Gemini) | Pedro | Aberta |
| [#59](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/59) | Workflow agendado que abre PR com os termos coletados | Ítalo | Aberta |
| [#66](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/66) | Navegação por categoria, "Veja também" e desambiguação (RF02 e RF09) | José | Aberta |
| [#70](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/70) | Trilha "Primeiros passos na UnB" na página inicial | José | Aberta |
| [#81](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/81) | Testes de aceitação BDD: cenários Gherkin executáveis | Allan | Aberta |
| [#91](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/91) | Documentar a Sprint 07: planning, review, retrospectiva e métricas | Ítalo | Aberta |

## Sprint 08 — Verificação, segurança e GitPage (09/11 a 15/11)

**Objetivo:** verificação periódica das fontes, segurança, mutação, Lighthouse, página de dados e GitPage de produto.

| Issue | Tarefa | Responsável | Estado |
|---|---|---|---|
| [#60](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60) | RF07: verificação periódica das fontes (termo possivelmente desatualizado) | Allan | Aberta |
| [#74](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/74) | Página "De onde vêm os dados": transparência do pipeline no app | Ítalo | Aberta |
| [#75](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/75) | GitPage como visão de produto centrada no usuário | Pedro | Aberta |
| [#76](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/76) | Teste de usabilidade com 5 calouros | José | Aberta |
| [#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80) | Lighthouse CI nos PRs | José | Aberta |
| [#82](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/82) | Teste de mutação nos módulos de domínio e do pipeline | Allan | Aberta |
| [#83](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83) | Segurança: análise estática (SAST), auditoria de dependências e prompt injection no pipeline | Ítalo | Aberta |
| [#92](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/92) | Documentar a Sprint 08: planning, review, retrospectiva e métricas | José | Aberta |
| [#113](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/113) | Registrar a ata do encontro (11/11) no dailies.md | Ítalo | Aberta |

## Sprint 09 — Estabilização e Release 2 (16/11 a 22/11)

**Objetivo:** coleta real revisada, relatório de testes, README final e release v2.0.0. Release 2 em 25/11/2026.

| Issue | Tarefa | Responsável | Estado |
|---|---|---|---|
| [#62](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/62) | Rodar a coleta real, revisar o PR do robô e registrar os números | Pedro | Aberta |
| [#84](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/84) | Relatório de testes e cobertura para a R2 | Allan | Aberta |
| [#93](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/93) | Documentar a Sprint 09 e a retrospectiva da R2 | Ítalo | Aberta |
| [#96](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/96) | Release v2.0.0: release notes, CHANGELOG, GitPage e roteiro da apresentação | Pedro | Aberta |
| [#97](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/97) | Atualizar o README e o guia de instalação e configuração para a R2 | José | Aberta |
| [#106](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/106) | SonarQube Cloud no CI, com cobertura e badge no README | Pedro | Aberta |
| [#114](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/114) | Registrar a ata do Encontro (16/11) no dailies.md | Ítalo | Aberta |

---

## Checklist de qualidade (o diferencial do Glossário UnB)

- [ ] **PWA:** manifest + service worker + funciona offline para consulta de termos
- [ ] **Acessibilidade:** lint de a11y (ex. `eslint-plugin-jsx-a11y`), navegação por teclado, contraste
- [ ] **i18n:** estrutura pronta para múltiplos idiomas, mesmo que só PT-BR no MVP
- [ ] **Testes:** cobertura mínima no domínio (dados/parsing dos termos) + relatório (Codecov)
- [ ] **Contribuição externa:** `CONTRIBUTING.md` claro, templates de issue/PR, processo de revisão definido

---

## Fontes consultadas

- Site oficial da disciplina: https://mds.lappis.rocks/planoensino/ e https://mds.lappis.rocks/aulas/
- Roteiro de entregas (Release 1 e 2): https://github.com/unb-mds/Qualifying-Software-Engineers-Undergraduates-in-DevOps/blob/main/RoteiroEntrega.md
- SuaGradeUnB — docs de sprints: https://unb-mds.github.io/2023-2-SuaGradeUnB/sprints/sprint-0/ (e sprint-1, sprint-2)
- Grupo atual do mesmo semestre (G9-2026-2): https://github.com/unb-mds/G9-2026-2
- Referência do tema: https://github.com/OpenDevUFCG/glossario-ufcg
