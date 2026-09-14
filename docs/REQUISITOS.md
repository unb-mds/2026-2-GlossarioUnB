# Glossário UnB

Análise de requisitos e planejamento — MDS, UnB
Equipe: Pedro, Ítalo, Jéssyca, Alex Kurokawa, Allan, Zé (José Gabriel)

## 1. Objetivo

Dicionário colaborativo de siglas, gírias e jargões da UnB (DEG, DPO, PPAES, "menção SR", "trancamento geral", etc.), inspirado no [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg). Domínio pequeno de propósito, foco em qualidade de processo e produto.

## 2. Fonte de dados

Coleta inicial via [planilha colaborativa](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing), depois migrada para o dataset estruturado do projeto. Ver `skills/glossario-unb-dev/SKILL.md` para o schema de cada termo.

## 3. Requisitos Funcionais

- **RF01** — Consulta de termos por busca textual
- **RF02** — Consulta de termos por categoria (sigla / gíria / expressão)
- **RF03** — Cadastro de termos a partir da planilha de coleta (dataset inicial do projeto)
- **RF04** — Contribuição externa via Pull Request, seguindo o schema de dados (fluxo em `CONTRIBUTING.md`)
- **RF05** — Contribuição externa via Issue, para quem não sabe Git (template `sugerir-termo.md`)

## 4. Requisitos Não-Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RNF01 | PWA | Instalável, funciona offline para consulta |
| RNF02 | Acessibilidade | Navegação por teclado, contraste, leitor de tela |
| RNF03 | i18n | Estrutura preparada para múltiplos idiomas (não traduzido no MVP) |
| RNF04 | Testes | Cobertura no módulo de dados (parsing/validação de termo) |
| RNF05 | Doc viva | `AI-USAGE.md`, `PROCESSO.md` e este arquivo refletem o estado real do projeto |

## 5. Fora de escopo (MVP)

- Login de usuário / conta pessoal
- Edição de termo diretamente pelo site (sem passar por PR/issue)
- Tradução de fato para outro idioma
- App nativo mobile (o PWA cobre isso)

## 6. Equipe

| Pessoa | Papel | Tema de Sprint 00 | GitHub |
|---|---|---|---|
| Ítalo | Scrum Master | — | smitalo |
| Jéssyca | Product Owner | — | Jessy2126 |
| Pedro | Dev | Git e GitHub + Metodologias Ágeis | p-magno |
| Alex Kurokawa | Dev | a confirmar | Alexkurokawa |
| Allan | Dev | a confirmar (estudo já entregue) | MrD4ntas |
| Zé (José Gabriel) | Dev | a confirmar | josegabriel-iw |

## 7. Releases

Estrutura detalhada sprint a sprint em [`scrum/sprint-planning.md`](scrum/sprint-planning.md).

- **Release 1** (28/09/2026): escopo e arquitetura validados, protótipo funcional, tecnologias testadas com código rodando
- **Release 2** (25/11/2026): produto completo conforme RF01-05 e RNF01-05
