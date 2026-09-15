# Backlog de Sprints — Glossário UnB

> Projeto: **Glossário UnB** — dicionário colaborativo de siglas e gírias da UnB (inspirado no [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg), da OpenDevUFCG).
> Foco de qualidade: PWA, acessibilidade, i18n, cobertura de testes e fluxo de contribuição via PR de terceiros.

---

## 0. Por que esta reorganização

A disciplina MDS 2026/2 estrutura o semestre em **9 sprints de 2 semanas**, com a **Release 1 na semana 7 (28/09/2026)**. Antes da Release 1 são só **4 sprints**  e a Release 1 já exige: escopo/arquitetura validados, tecnologias testadas com código funcional e uma implementação inicial rodando. Por isso o plano abaixo:

- Mantém os itens (arquitetura, metodologias ágeis, skills, benchmark, figma, requisitos, brainstorm).
- Acrescenta o que a grade oficial exige neste bloco: Git como artefato de engenharia, requisitos ágeis com critério de aceitação, spec-driven development (specify → plan → tasks → implement), ADR de arquitetura, backlog priorizado no GitHub Projects.
- Reordena: brainstorm e requisitos vêm **antes** do Figma.
- Fragmenta cada bloco em tarefas de **uma pessoa só**, para virar um commit/PR individual e rastreável, o padrão que projetos como a disciplina chama de "coelho da sprint" (uma pessoa assume um tópico, estuda/implementa e documenta).


---

## Linha do tempo até a Release 1

| Sprint | Semanas | Conteúdo oficial da disciplina no período                                                                       | Marco |
|---|---|-----------------------------------------------------------------------------------------------------------------|---|
| Sprint 00 | 1–2 | Fundamentos e setup: estudos de Git/GitHub, Metodologias Ágeis, Banco de Dados, Arquitetura, Backend e Frontend | Tema aprovado (Glossário UnB) |
| Sprint 01 | 3–4 | ADR 0001, benchmark do glossario-ufcg, skills individuais por tecnologia.                                       | Primeira spec rascunhada |
| Sprint 02 | 5 | Protótipo no Figma, backlog priorizado no board, migração da planilha de termos pro dataset.                                              | Backlog priorizado + protótipo Figma |
| Sprint 03 | 6–7 | Implementação inicial (PWA, tela de consulta), pipeline de CI verde, preparação da apresentação. Fecha em Release 1.                                                                   | **Release 1 — 28/09/2026** |

---

## Sprint 00 — Fundamentos, tema e setup (semanas 1–2)

**Objetivo:** alinhar processo, montar o esqueleto técnico e já deixar o repositório pronto para receber contribuições.

| # | Tarefa | Responsável | Entregável (= 1 commit/PR) |
|---|---|---|---|
| 1 | Contrato de equipe: papéis rotativos (Scrum Master, PO), horários de reunião, canais de comunicação | Pessoa A | `docs/equipe.md` |
| 2 | Metodologias ágeis aplicadas ao projeto (Scrum vs Kanban, o que o time vai usar e por quê) | Pessoa B | `docs/metodologia.md` |
| 3 | Ciclo de vida e Processo Unificado — comparação rápida e justificativa da escolha (incremental/evolutivo) para o projeto | Pessoa C | `docs/processo.md` |
| 4 | Modelagem inicial dos dados de um termo (sigla, gíria, categoria, definição, exemplo de uso, fonte) — olhando o schema do glossario-ufcg como referência | Pessoa D | `docs/database.md` ou `schema.json` |
| 5 | Setup do repositório: `README.md`, `LICENSE` (MIT), `CODE_OF_CONDUCT.md`, templates de issue/PR | Dividir entre 2 pessoas | Arquivos na raiz + `.github/` |
| 6 | Abrir `AI-USAGE.md` (registro de uso de IA, exigido pela política da disciplina) | Quem fizer a task 1 | `AI-USAGE.md` |

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
| 6 | Spec-driven development I: escrever o primeiro rascunho da "constituição" do projeto (specify) — o que o Glossário UnB é e não é | PO                                                                                               | `specs/constitution.md` |

---

## Sprint 02 — Requisitos, arquitetura e protótipo (semana 5)

**Objetivo:** fechar requisitos, registrar decisões de arquitetura em ADR, priorizar o backlog e só então desenhar as telas.

| # | Tarefa | Responsável            | Entregável |
|---|---|------------------------|---|
| 1 | Brainstorm de categorias de termos (siglas, gírias, ex.: "menção SR", "trancamento geral", "reoferta") — cada pessoa levanta uma lista de termos de **uma categoria** | 1 categoria por pessoa | `data/termos-<categoria>.json` (PR de conteúdo real!) |
| 2 | Levantamento de requisitos funcionais/não funcionais + Story Map, fechando os critérios de aceitação abertos na Sprint 01 | Pessoa A + PO          | `docs/requisitos.md` (final) |
| 3 | Spec-driven development II: revisar a spec com o resto do time, listar ambiguidades | Todos (async)          | `specs/spec.md` revisado |
| 4 | Arquitetura + ADR: JSON estático vs. banco de dados, stack definitiva, diagrama C4 nível 1–2 | Pessoa Z               | `docs/adr/0001-arquitetura.md` |
| 5 | Backlog priorizado no GitHub Projects (MoSCoW ou valor × esforço), épicos virando issues | Scrum Master/PO        | Board atualizado |
| 6 | Protótipo Figma: Home, Busca, Lista de termos por categoria, formulário "Sugerir termo" | 1–2 pessoas (design)   | Link do Figma no README |
| 7 | Fluxo de contribuição externa (igual ao do glossario-ufcg): templates de issue "Adicionar termo" / "Corrigir definição" | Pessoa C               | `.github/ISSUE_TEMPLATE/` |

---

## Sprint 03 — Planejamento, fluxo e implementação inicial (semanas 6–7) → Release 1

**Objetivo:** sair do planejamento para código funcionando, com pipeline verde, a tempo da apresentação de 28/09.

| # | Tarefa | Responsável | Entregável |
|---|---|---|---|
| 1 | Sprint planning com estimativa (planning poker) das issues de implementação | Todos | Sprint 03 no board |
| 2 | Kanban com limite de WIP configurado | Scrum Master | Board com WIP |
| 3 | PWA básico: `manifest.json` + service worker mínimo | Pessoa D | PWA instalável |
| 4 | Primeira tela funcional consumindo os dados de termos reais (das Sprints 00–02) | Pessoa E | Feature rodando em deploy |
| 5 | Pipeline CI/CD básico (lint + testes) verde | Pessoa F | Badge de CI no README |
| 6 | Preparar apresentação da Release 1 (5 min): desafio, o que foi implementado, evidências de viabilidade | Todos | Slides + ensaio |

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
