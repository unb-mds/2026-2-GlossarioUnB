# Retrospectiva da Release 1 — Glossário UnB

## 1. O que a R1 entregou

- Glossário de siglas da UnB voltado principalmente a calouros, mas útil também para veteranos que precisam consultar uma sigla específica.
- Busca com autocomplete e página de termo com significado, exemplo de uso e fonte.
- Lista completa em ordem alfabética, mapa e rota para termos de locais, modo escuro, página "Sobre" e página "Contribua".
- Frontend estático em um único arquivo JSON, sem banco de dados, publicado como PWA instalável e com consulta offline (exceto o mapa).
- Na apresentação, os próximos passos citados foram os RF03, RF06, RF09 e RF10, ainda sem escopo fechado.

## 2. Feedback da professora

### 2.1 Críticas

| # | Crítica | O que foi apontado |
|---|---|---|
| 1 | Projeto simples demais | Tecnicamente havia "zero risco" e "zero complexidade"; como o projeto é simples, a execução precisaria ser muito bem-feita, e não estava. |
| 2 | Coleta manual e sem pesquisa de fontes | As siglas vieram de uma planilha preenchida à mão. A crítica mais forte foi não ter havido trabalho de identificar fontes nem um robô minerando os dados. |
| 3 | Falta de documentação | Fontes de dados, decisão de fazer tudo à mão e plano de automação não estavam documentados. "A documentação é o reflexo do trabalho." |
| 4 | Volume de trabalho e maturidade baixos | O que foi entregue não era suficiente para o tempo disponível; a R2 precisa de bem mais escopo, documentação e visão de produto. |
| 5 | Organização ingênua dos dados | Tratar todas as siglas como iguais ignora o contexto: só o histórico escolar tem cerca de 20 siglas, e termos como FGA, AC e AD dependem de contexto. Faltam categorização e indicação de onde buscar mais informação. |
| 6 | Falta de visão de produto | O trabalho não é "para a disciplina", e sim um produto de software; a pergunta foi quem pagaria por ele. |
| 7 | RNFs e testes fracos | O PWA era o único RNF listado, mas é uma escolha técnica. Faltavam requisitos de qualidade, disponibilidade e tempo de resposta, além de um fluxo de testes que fosse além da validação do schema pelo CI. |

### 2.2 Recomendações

- Automatizar a coleta com robôs/scrapers nos sites da UnB. A professora reconheceu que não é trivial e que esse é o grande trabalho do grupo.
- Usar IA, por exemplo a API do Gemini, para clusterizar e categorizar as siglas.
- Mostrar o "básico" ao calouro logo na entrada, em vez de oferecer apenas uma busca.
- Colocar a complexidade no "maquinário" (coleta, organização e automação dos dados), não no frontend.
- Pensar no fluxo completo do usuário: o que ele precisa saber, qual é o contexto e onde encontrar mais informação.

## 3. Lições aprendidas

- Documentação e rastreabilidade fazem parte da entrega, não são um extra no fim.
- Dados sem fonte, critério de coleta e automação não sustentam um produto de qualidade.
- Um projeto simples só se justifica se a execução for exemplar; a complexidade precisa ir para o problema real.
- Requisito não funcional sem métrica e forma de verificação não é verificável.
- Testar apenas o schema dos dados não cobre o comportamento do produto.
- O time precisa comunicar valor de produto, não apenas funcionalidades para a disciplina.

## 4. Itens de ação para a R2

| # | Ação | Como será feita | Onde está no plano | Responsável |
|---|---|---|---|---|
| 1 | Automatizar a coleta | Pipeline com coletores de PDF e HTML, normalização, deduplicação e PR automático revisado por uma pessoa | Épico E1 (#47), issues #52–#62 e ADR 0009 (#53) | Pedro, Ítalo e Allan |
| 2 | Documentar as fontes | Catálogo das fontes e documentação dos dados coletados | #52, #61 e #67 | Pedro e José |
| 3 | Categorizar e dar contexto às siglas | Taxonomia, schema com sinônimos/relacionados e navegação por categoria | #63, #64, #66 e #58 | Pedro e José |
| 4 | Usar IA na organização dos dados | Categorização e redação assistidas por LLM, com validação da resposta | #58 | Pedro |
| 5 | Melhorar a experiência do calouro | Trilha "Primeiros passos na UnB" e visão de produto centrada no usuário | #69, #70, #68 e #75 | José, Allan e Pedro |
| 6 | Tornar os RNFs mensuráveis | Métrica, critério de aceitação e forma de verificação para cada RNF | #77 | Ítalo |
| 7 | Ampliar a qualidade e os testes | Estratégia de testes, E2E, acessibilidade, lint, cobertura, Lighthouse, BDD e mutação | #43, #78, #79, #80, #81, #82 e #84 | Allan, José e Ítalo |
| 8 | Reforçar a segurança | SAST, auditoria de dependências e proteção contra prompt injection no pipeline | #83 | Ítalo |
| 9 | Manter a documentação atualizada | Revisar inconsistências, ADRs, AI-USAGE, atas e documentação de cada sprint | #42, #85, #86, #87 e #89–#93 | Todo o time |

## 5. Planejamento da R2

### 5.1 Período e foco das sprints

A R2 vai de **05/10/2026 a 25/11/2026**. O detalhamento das issues está no [`sprint-planning.md`](sprint-planning.md).

| Sprint | Período | Foco |
|---|---|---|
| Sprint 04 | 05/10 a 18/10 | Arrumação do repositório, fontes, ADR 0009, taxonomia e RNFs mensuráveis |
| Sprint 05 | 19/10 a 25/10 | Primeiros coletores, schema novo, lint e cobertura |
| Sprint 06 | 26/10 a 01/11 | Deduplicação, dados documentados, requisitos rastreáveis e testes E2E |
| Sprint 07 | 02/11 a 08/11 | LLM, PR automático, navegação por categoria e trilha do calouro |
| Sprint 08 | 09/11 a 15/11 | Verificação das fontes, segurança, mutação, Lighthouse e GitPage de produto |
| Sprint 09 | 16/11 a 22/11 | Coleta real revisada, relatório de testes, README final e release v2.0.0 |

### 5.2 Regra de trabalho

**1 issue = 1 branch = 1 PR com revisão.** Cada issue tem uma branch própria, um PR que a referencia com `Closes #<número>` e revisão registrada de outra pessoa antes do merge. A regra está registrada no [`PROCESSO.md`](../PROCESSO.md).

### 5.3 Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Scraping bloqueado ou instável | Catálogo de fontes, tratamento de erro explícito e revisão humana do PR do robô |
| Resposta do LLM inventar ou alterar dados | Validar a resposta por schema, separar texto coletado de instrução e revisar antes do merge |
| Prazo curto para o volume da R2 | Issues pequenas, uma por pessoa, e acompanhamento nas dailies |
| Documentação ficar para o fim | Documentar cada sprint e cada decisão junto com a entrega |
| Segurança no pipeline | SAST, auditoria de dependências e teste com fixture maliciosa (#83) |

## 6. Critérios de sucesso da R2

- Pipeline de coleta funcionando e com PR revisado por uma pessoa.
- 100% dos termos com fonte e categoria válidas; links de fonte verificados.
- RNFs com métrica, critério de aceitação e verificação automática.
- Testes E2E, acessibilidade e desempenho medidos no CI.
- Documentação de fontes, dados, decisões e sprints atualizada.
- Release v2.0.0 publicada até 25/11/2026.

