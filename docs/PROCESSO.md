# Processo — Glossário UnB

Como o time trabalha: fluxo de Git, padrões de qualidade e governança do repositório. Requisitos do sistema estão em [`REQUISITOS.md`](REQUISITOS.md).

## 1. Repositório e fluxo de Git

Repositório: `github.com/unb-mds/G10-2026-2`

- Um único repositório
- Branches: `main` (estável) → `feature/nome-da-tarefa`, **GitHub Flow**, sem `develop`/`release`/`hotfix`. Optamos por simplificar em relação ao Git-Flow completo porque o time é pequeno e o volume de branches simultâneas é baixo; se isso mudar, revisitar via ADR.
- Contribuidor externo (fora do G10): fluxo por fork, documentado em [`CONTRIBUTING.md`](../CONTRIBUTING.md)
- Commits em Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`)
- Organização de tarefas via Issues + Milestones (1 Milestone = 1 Sprint) + board (Projects) do GitHub

## 2. Padrão de Issues e Pull Requests

- Toda issue usa um dos templates em `.github/ISSUE_TEMPLATE/` (bug, feature, tarefa técnica, sugerir termo)
- Toda issue tem label de tamanho (S/M/L/XL) e milestone da sprint correspondente
- Todo PR usa o template em `.github/PULL_REQUEST_TEMPLATE.md`
- Todo PR precisa de **revisão formal e registrada**, comentário ou aprovação no próprio PR. 

## 3. Ritmo individual esperado

- Atividade constante ao longo do projeto, é recomendado pelo menos 2-3 commits/semana por pessoa
- Presença nas reuniões da sprint (`scrum/horarios.md`), registrada em `scrum/dailies.md`

## 4. ADR (Architecture Decision Record)

Decisões de arquitetura relevantes ficam registradas individualmente em `docs/adr/`, um arquivo por decisão:

```markdown
# ADR 00X — [título da decisão]

## Status
Aceito / Proposto / Substituído

## Contexto
[Por que essa decisão precisou ser tomada]

## Decisão
[O que foi decidido]

## Alternativas descartadas
[O que também foi considerado e por que não foi escolhido]

## Consequências
[O que essa decisão implica, custos e trade-offs assumidos]
```

Exemplo de decisão que já merece ADR assim que for fechada: JSON estático vs. banco de dados para os termos.

## 5. Padrões de projeto open source

- `LICENSE`, `CONTRIBUTING.md`, `AI-USAGE.md` na raiz do repositório
- Cada Release fechada deve ter uma Release Note publicada na aba Releases do GitHub

## 6. Registro de uso de IA

Uso de IA no projeto é documentado em [`AI-USAGE.md`](../AI-USAGE.md), na raiz do repositório. 