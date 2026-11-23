# Sprint 04 — Arrumação, fontes e decisões (11/10 a 18/10/2026)

Registro escrito em 17/11/2026 a partir do GitHub (milestone, issues, PRs e commits) e do `docs/scrum/dailies.md`, porque a sprint não teve review nem retrospectiva registrados na época. Responsável por este registro: Allan (#42).

## Planning

**Objetivo (issue #42):** definir os termos da trilha do calouro; implementar a pipeline de integração contínua (CI) com verificações de qualidade, segurança e testes; estruturar e mensurar a documentação de requisitos não funcionais e a estratégia de testes.

O planejamento saiu da reunião de 12/10 (`dailies.md`: "Definimos as issues da sprint 4 a 9 e dividimos entre os membros"). As issues do milestone foram criadas no GitHub em 21/10, já depois do fim da sprint; só a #42, a #43 e a #44 foram criadas em 18/10, no último dia.

| Issue | Tamanho | Pontos | Responsável |
|---|---|---|---|
| #69 Definir os termos da trilha do calouro | S | 1 | Jéssyca |
| #52 Levantar e documentar as fontes de dados de termos da UnB | M | 2 | Jéssyca |
| #53 ADR 0009: coleta automatizada de termos por pipeline com PR revisado | S | 1 | Pedro |
| #54 Spike: protótipo do bot de siglas (extração do PDF da DPO) | S | 1 | Ítalo |
| #63 Definir a taxonomia de categorias dos termos | S | 1 | Jéssyca |
| #65 Corrigir campus e redação dos termos atuais | S | 1 | José |
| #77 Reescrever os requisitos não funcionais de forma mensurável | S | 1 | Ítalo |
| #43 Documentação da estratégia de testes | S | 1 | Allan |
| #44 Proteger a branch main e adicionar o `.env.example` | S | 1 | Allan |
| #85 Corrigir as inconsistências da documentação e fechar o Status das ADRs | S | 1 | José |
| #86 Regularizar o `AI-USAGE.md` | S | 1 | Pedro |
| #87 Registrar a retrospectiva da R1 e o planejamento da R2 | S | 1 | Ítalo |
| #42 Documentação da Sprint 04: planning, review, retrospectiva e métricas | S | 1 | Allan |
| #94 Completar os padrões de software livre: CODE_OF_CONDUCT, CHANGELOG e SECURITY | S | 1 | José |
| #95 AGENTS.md conciso na raiz do repositório | S | 1 | Pedro |
| **Total** | | **16** | |

Pontos: S = 1, M = 2, L = 3, XL = 5.

> O milestone [Sprint 04 — Arrumação, fontes e decisões](https://github.com/unb-mds/2026-2-GlossarioUnB/milestone/5) hoje também tem a #116, criada em 17/11 para atualizar o `sprint-planning.md`; ela não fazia parte do backlog desta sprint.

## Review

- **Entregue na sprint:** nada. Nenhuma das 15 issues foi fechada e nenhum PR foi mergeado entre 11 e 18/10.
- **O que aconteceu no período:**
  - 12/10: reunião do time (4 presentes) definiu as issues das Sprints 04 a 09 e a divisão por pessoa; o `dailies.md` foi atualizado no commit `d01e2fb`.
  - 12/10: PR #41 aberto, alinhando o RF06 do `REQUISITOS.md`.
  - 18/10: issues #42, #43 e #44 criadas no GitHub; PRs #45 (`.env.example` e `.gitignore`) e #46 (`AI-USAGE.md`) abertos.
- **Depois da sprint:** em 21/10 foram criadas as demais issues do milestone e os três PRs receberam a primeira revisão do Pedro (#41 e #46 com comentários; #45 com ajustes pedidos).
- **O que ficou e onde está em 17/11:**
  - #41 e #45 foram mergeados em 17/11; #46 continua aberto.
  - #44, #53, #77 e #86 fecharam em 17/11.
  - #43 tem o PR #100 aberto e #95 tem o PR #108 aberto.
  - #52, #54, #63, #65, #69, #85, #87 e #94 seguem abertas, sem PR.
  - #42: este registro.

## Retrospectiva

Feita depois da sprint (17/11), a partir dos registros; não houve retrospectiva na época.

**O que funcionou**
- A reunião de 12/10 fechou o plano das Sprints 04 a 09 e a divisão por pessoa, o que deu base para o restante do semestre.
- A sprint terminou com três PRs abertos (#41, #45 e #46), cobrindo requisitos, ambiente local e registro de IA.

**O que não funcionou**
- Nenhuma das 15 issues foi fechada e nenhum PR foi mergeado: a sprint não teve incremento entregue.
- Quase nenhuma issue existia no GitHub durante a sprint (só #42, #43 e #44, criadas no último dia); o board não foi usado para puxar trabalho.
- Não houve review nem retrospectiva registrados; este documento foi escrito um mês depois.
- Os PRs abertos na sprint só receberam a primeira revisão em 21/10, e #41 e #45 só foram mergeados em 17/11; o #46 está aberto até hoje.

**Problemas que se repetem**
- A Sprint 05 também terminou com 0 issues fechadas e sem PR mergeado.
- "PR aberto sem merge" aparece nas Sprints 04 e 05, duas seguidas: pelo critério do time, não pode se repetir por mais de duas sprints.

**Ações, com responsável** (acordadas em 09/11 e no Encontro 1, de 11/11)
- [ ] Cada pessoa revisa pelo menos 1 PR por semana. Todos; a primeira rodada vai até 13/11.
- [ ] Encontros fixos com registro no `dailies.md` (11, 16, 18 e 24/11, às 13h). Ítalo (Scrum Master).
- [ ] Cada pessoa fecha as próprias issues na ordem das sprints (04, 05, 06…), cerca de uma por dia, com tudo da R2 na `main` até 17/11. Todos.

## Métricas

Levantadas do GitHub em 17/11/2026 (API de issues, PRs e commits), para o período de 11 a 18/10.

| Métrica | Sprint 04 |
|---|---|
| Issues comprometidas | 15 (16 pontos) |
| Issues fechadas | 0 (0 pontos) |
| PRs abertos | 3 (#41, #45, #46) |
| PRs mergeados | 0 |
| PRs fechados sem merge | 0 |
| Commits (todas as branches) | 5 |
| Velocity | 0 pontos |

Commits por pessoa no período: Allan 4, Ítalo 1, Jéssyca 0, José 0, Pedro 0.

**Encaminhamento:** a velocity das Sprints 04 e 05 foi 0, então o time não tem como estimar pela média. Para a R2 (25/11), vale o que for fechado até 17/11, quando tudo precisa estar na `main`.

## Prints

O quadro da Sprint 04 não foi registrado em print; as issues só foram criadas no GitHub em 21/10, depois do fim da sprint. Ficam como evidência a tabela do Planning, o `dailies.md` de 12/10 e o histórico dos PRs #41, #45 e #46.

## Atas

A única reunião registrada no período é o daily de 12/10 (planejamento das Sprints 04 a 09), em [`dailies.md`](../dailies.md). Não há ata de review ou de retrospectiva.
