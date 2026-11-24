# Registro de uso de IA — Glossário UnB

Conforme a política de uso de IA da disciplina (MDS 2026/2): o uso de assistentes e agentes de IA é **esperado, não tolerado**, desde que registrado. Este arquivo documenta onde e como IA foi usada no projeto.

**É esperado e deve ser registrado em**: implementação, testes, documentação, exploração de bibliotecas, refatoração, geração de dados de termos.

## Formato de registro

Cada entrada deve conter: data, pessoa, ferramenta usada, o que foi pedido, o que foi aceito/rejeitado/ajustado.

## Registros

### Release 1

| Data | Pessoa | Ferramenta | O que foi feito | Aceito/ajustado/rejeitado |
|---|---|---|---|---|
| 20/09/2026 | Italo | Claude | pedi ajuda para elaborar os documentos de estudos sobre PWA e i18n | ajustado para um formato mais didatico e ajuste em algumas informações |
| 28/09/2026 | José Gabriel | Antigravity | Elaboração e formalização da convenção de commits e branches (`docs/CONVENCAO-GIT.md` e `CONTRIBUTING.md`) para a issue #17 | Aceito |
| 28/09/2026 | José Gabriel | Antigravity | Redação do rascunho da constituição do projeto (`specs/constitution.md`) definindo o que o projeto é e não é para a issue #19 | Aceito |
| 28/09/2026 | Pedro | Claude Code (Claude Opus 5.5) | Arquivos do frontend: interface, busca, filtros, validação do tipo, service worker, ícones e README | Aceito; revisão registrada no PR #28 (o front entrou na main pelo PR #39) |
| 28/09/2026 | Pedro | Claude (chat no claude.ai) | Divisão dos arquivos do projeto em blocos e commits por pessoa, sob orientação do Pedro | Aceito |
| 18/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Refatoração da coletar (complexidade cognitiva) e do idLivre, apontados pelas regras do SonarQube | Aceito após a minha revisão, com o `npm test` passando |
| | | | | |


<!-- Exemplo de linha preenchida:
| 11/09/2026 | Pedro | Claude | Estudo de Git-Flow e CONTRIBUTING.md da Sprint 00 | Aceito com ajustes de caminho e nomenclatura |
-->

### Release 2

| Data | Pessoa | Ferramenta | O que foi feito | Aceito/ajustado/rejeitado |
|---|---|---|---|---|
| 18/10/2026 | Allan | Claude | Pedi ajuda com o documento .env.example e como subir o pull request pelo cmd | ajustei o texto do pull request, o resto foi aceito |
| 11/11/2026 | Pedro | Claude Code | `AGENTS.md` (#95) e as minhas linhas deste registro (#86), a partir da issue, dos ADRs e dos arquivos do repositório | Aceito após a minha revisão |
| 11/11/2026 | Pedro | Claude Code | Rascunho da ADR 0009 e das atualizações da ADR 0001, do `ARQUITETURA.md` e do `REQUISITOS.md` (#53) | Aceito após a minha revisão, completado em 13/11 com o que o Encontro 1 decidiu |
| 11/11/2026 | Pedro | Claude Code | Primeira versão do coletor genérico de páginas, sem bibliotecas (`coleta/coletor-html.js`, `coleta/fontes.js`, `coleta/fontes.json`, `scripts/coletar.mjs`), e os testes com as páginas salvas da UnB (#56) | Aceito após a minha revisão, com o `npm test` passando |
| 11/11/2026 | Pedro | Claude Code | Normalização e deduplicação (`coleta/deduplicar.js`) e os testes (#57) | Aceito após a minha revisão, com o `npm test` passando |
| 11/11/2026 | Pedro | Claude Code | Registro da Sprint 05 a partir do milestone, das issues, dos PRs e dos commits (#89) | Aceito após a minha revisão |
| 13/11/2026 | Pedro | Claude Code | ADR 0010 (bibliotecas só nos scripts do robô), a linha na ADR 0002 e os ajustes do `ARQUITETURA.md` (#53) e do `AGENTS.md` (#95), a partir da minha decisão de liberar bibliotecas só no robô | Aceito após a minha revisão |
| 13/11/2026 | Pedro | Claude Code | Coletor refeito com `cheerio` e `robots-parser`, com os testes escritos antes; `package.json`, `package-lock.json`, `npm ci` no CI e o teste de fronteira das dependências (#56) | Aceito após a minha revisão, com o `npm test` passando |
| 13/11/2026 | Pedro | Claude Code | Classificador com LLM: `coleta/classificador.js`, `coleta/cliente-gemini.js`, o prompt versionado, as categorias provisórias, `scripts/classificar.mjs` e os testes com cliente simulado (#58) | Aceito após a minha revisão, com o `npm test` passando |
| 13/11/2026 | Pedro | Claude Code | Página Sobre reescrita como página de produto, com o teste da página (#75) | Aceito após a minha revisão, com o `npm test` passando |
| 13/11/2026 | Pedro | Claude Code | Configuração do SonarQube Cloud no CI (`sonar-project.properties` e `.github/workflows/sonar.yml`) e o texto da issue | Aceito após a minha revisão |
| 17/11/2026 | Allan | opencode (DeepSeek) | Diagramas C4 de contexto e contêineres no `ARQUITETURA.md`, com o pipeline da ADR 0009 (#88) | Aceito após revisão |
| 17/11/2026 | Allan | opencode (DeepSeek) | ESLint, script `npm run lint`, cobertura mínima no CI e atualização da ADR 0007 (#79) | Aceito após revisão |
| 13/11/2026 | Allan | opencode (DeepSeek) | Elaboração do `docs/estrategia-de-testes.md` para a issue #43, com base nos testes e workflows reais do repositório; atualização em 17/11 para os 52 testes, a deduplicação, a página Sobre e o estado atual do CI | Aceito após revisão no PR |
| 17/11/2026 | Allan | opencode | Registro da Sprint 04 (`docs/scrum/sprints/sprint-04.md`): planning, review, retrospectiva e métricas, a partir do milestone, das issues, dos PRs, dos commits e do `dailies.md` (#42) | Aceito após a minha revisão |
| 17/11/2026 | Allan | opencode (DeepSeek) | `docs/VISAO-DE-PRODUTO.md`, histórias Gherkin e links no README/Sobre, a partir das issues #47–#51, do story map e do rascunho da constituição (#68) | Aceito após revisão |
| 17/11/2026 | Allan | opencode | Revisão e correções do PR #104: caminho do script no Windows e remoção do `temperature` não suportado no Gemini 3.8 (#58) | Aceito após revisão no PR |
| 17/11/2026 | Pedro | Claude Code | Catálogo das fontes de dados (`docs/FONTES-DE-DADOS.md`): cada endereço aberto, o `robots.txt` e a data de cada PDF conferidos (#52) | Aceito após a minha revisão |
| 17/11/2026 | Pedro | Claude Code | Lista da trilha do calouro a partir do Manual do Calouro 2026/2 (`docs/TRILHA-CALOURO.md`, #69) | Aceito após a minha revisão; a validação com calouros fica registrada na issue |
| 17/11/2026 | Pedro | Claude Code | Trilha na página inicial: `frontend/data/trilha-calouro.json`, os termos novos com fonte oficial, `frontend/js/trilha.js`, o teste de integridade referencial e a ADR 0011, a partir da minha decisão de guardar a trilha num arquivo próprio (#70) | Aceito após a minha revisão, com o `npm test` passando |
| 18/11/2026 | Pedro | Claude Code | Rascunho da ADR 0013 (SonarQube Cloud ao lado do CI), a partir da minha decisão de 10/11 e da configuração do #107, e as linhas no `ARQUITETURA.md` e na página Sobre | Aceito após a minha revisão |
| 18/11/2026 | Pedro | Claude Code | Texto do RNF08 (privacidade) e do RNF09 (coleta responsável), conferido contra o `coleta/coletor-html.js` e os testes dele, e a atualização da equipe no `REQUISITOS.md` | Aceito após a minha revisão |
| 18/11/2026 | Italo | opencode | Coletor do PDF da DPO (#55): `coleta/coletores/dpo.js`, fixture das páginas 5–8, script `coleta:dpo`, testes e atualização da ADR 0010 | Aceito |
| 18/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Atualização da ADR 0010 com a segunda lista fechada (Playwright, axe-core, StrykerJS e ESLint, só em devDependencies) e do teste da fronteira de dependências | Aceito após a minha revisão, com o `npm test` passando e o `package.json` do #120 conferido |
| 18/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Correção do redirecionamento aberto (S5146) e dos 2 avisos de crossorigin apontados pelo SonarQube Cloud, com os testes do servidor local | Aceito após a minha revisão, com o `npm test` passando |
| 19/11/2026 | José Gabriel | Antigravity | Correção de campus (FCTS, FCTE, FUP), significados e redação (FCTS, FCTE, FUP, DAC), fonte HTTPS da FT, verificação das coordenadas do Ceubinho no OpenStreetMap (nó 767000561), atualização da ADR 0005 e testes em `tests/dados.test.js` (issue #65) | Aceito após revisão manual e execução dos testes unitários |
| 18/11/2026 | José Gabriel | Antigravity | Definição da taxonomia fechada de `categoria` na ADR 0004, obrigatoriedade no schema (`termos.js`, `validacao-termo.js`, `CONTRIBUTING.md`), classificação dos termos atuais em `termos.json`, sincronização de `coleta/categorias.json` e atualização dos testes (#63) | Aceito após revisão |
| 19/11/2026 | José Gabriel | Antigravity | Levantamento das métricas da Sprint 08 (GitHub API e `git log`) e redação de `docs/scrum/sprints/sprint-08.md` com planning, review, retrospectiva e métricas (#92) | Aceito após revisão |
| 19/11/2026 | Italo | opencode | Documentação dos dados (#67): `docs/modelo-conceitual-dados.md` com modelo conceitual, dicionário de dados e disponibilidade das fontes; referência adicionada em `docs/ARQUITETURA.md` | Aceito com resalvas |
| 19/11/2026 | José Gabriel | Antigravity | Configuração do Lighthouse CI nos PRs (`lighthouserc.json`, `.github/workflows/lighthouse.yml`, `.gitignore` e `tests/lighthouse.test.js`) com os limites da RNF02 e RNF03 (#80) | Aceito após revisão |
| 18/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Teste de sabotagem (decisão B): script sem biblioteca, 17 defeitos nos módulos críticos, passo no CI e documentação; o piloto achou a falha do teste do servidor corrigida no #128 | Aceito após a minha revisão, com o `npm test` e o `npm run test:sabotagem` passando |
| 18/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Gírias do campus na trilha: busca das páginas da UnB que citam o Ceubinho, o Minhocão e o Beijódromo, correção da definição do Ceubinho, as 3 fontes do robô com o padrão regex e os testes com as páginas salvas, a partir das minhas decisões de 18/11 | Aceito após a minha revisão, com o `npm test` passando |
| 18/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Separação das regras de cada página do `app.js` em `busca.js`, `lista.js`, `ficha.js` e `tema.js`, incluindo a trilha do calouro do #124, com 26 testes, conferida com fotos do DOM das 3 páginas antes e depois | Aceito após a minha revisão, com o `npm test` passando |
| 20/11/2026 | Allan | opencode | Configuração do Playwright, testes E2E dos fluxos principais e da auditoria axe-core, job no `ci.yml` com o relatório como artefato, e atualizações de README e da skill de testes (#78) | Aguardando revisão no PR |
| 20/11/2026 | Allan | Claude Code | Configuração do StrykerJS (executor command), 14 testes novos para matar mutantes do domínio e docs/TESTE-DE-MUTACAO.md (issue #82) | Aceito após a minha revisão, com ajuste de 13 para 14 testes novos no documento |
| 23/11/2026 | Allan | opencode | Correção do PR #157 (issue #82): workflow de mutação (`.github/workflows/mutacao.yml`: semanal e com dispatch, falha abaixo de 70% no domínio e de 50% na coleta), script `scripts/verificar-mutacao.mjs`, teste `tests/workflow-mutacao.test.js` e ajuste dos testes de segurança ao instrumentação do StrykerJS; escores de 22/11 (90,90% total, 99,20% domínio, 85,70% coleta) registrados na estratégia de testes | Aceito após revisão no PR |
| 20/11/2026 | Allan | Claude Code | Reescrita dos RF em verbo + objeto com critério de aceitação, regras de negócio RN01 a RN11 e matriz de rastreabilidade em docs/REQUISITOS.md e docs/RASTREABILIDADE.md (issue #73), com dados de gh issue/pr e dos testes | Aceito após a minha revisão |
| 19/11/2026 | Italo | opencode | Registro da Sprint 06 com planning, review, retrospectiva e métricas (#90), a partir do milestone, das issues, dos PRs e dos commits | Aceito após a minha revisão com resalvas |
| 20/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Correção do deslocamento de layout (CLS) da página inicial e da lista de siglas: espaço reservado para a trilha, os atalhos e a lista, preload dos dados da lista e 7 testes, com Lighthouse antes e depois | Aceito após a minha revisão |
| 19/11/2026 | Italo | opencode | Registro da Sprint 07 com planning, review, retrospectiva e métricas (#91), a partir do milestone, das issues, dos PRs e dos commits | Aceito |
| 19/11/2026 | Italo | opencode | Workflow agendado da coleta (#59): `.github/workflows/coleta.yml`, pipeline completo (`coleta/relatorio.js`, `coleta/atualizar-termos.js` e `scripts/coleta-automatica.mjs`), atualização do `termos.json`, resumo do PR, testes e instruções no README | Aceito |
| 20/11/2026 | Italo | Claude Code | docs/SEGURANCA.md (SAST, npm audit, defesas de prompt injection, STRIDE) e 12 testes de segurança com fixture de página maliciosa (issue #83) | Aceito após a minha revisão |
| 20/11/2026 | Allan | Claude Code | Medição dos números de teste, cobertura e SonarQube e redação do docs/RELATORIO-DE-TESTES.md (#84) | Aceito após a minha revisão, com os números do #82 (PR #157) e do #78 (PR #153) atualizados |
| 21/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Dois testes da DPO em `deduplicar.test.js` com base própria, para o PR do robô não quebrar quando a coleta atualizar o termo | Aceito após a minha revisão |
| 21/11/2026 | Pedro | Claude Code (Claude Opus 5.5) | Filtro de termos do robô (lista fixa, pertinência pelo Gemini, modelo reserva e seções de revisão no PR), correção do texto do PDF, relatório sem mudança por data, testes, ADR 0014 e documentação | Aceito após a minha revisão |
| 19/11/2026 | José Gabriel | Antigravity | Correção de inconsistências da documentação, preenchimento da seção Status das ADRs 0001–0008 e criação de `tests/documentacao.test.js` (issue #85) | Aceito após revisão manual e execução dos testes unitários |
| 22/11/2026 | Allan | opencode (DeepSeek V4.1 Flash) | Atualização do `docs/RELATORIO-DE-TESTES.md` com os números da `main` em 22/11 (244 testes, cobertura de 98,18%, Sonar 86,0%) e com o resultado do Lighthouse do PR #148 | Aguardando a minha revisão |
| 22/11/2026 | Italo | opencode | Correções da revisão do #158: `npm audit --omit=dev --audit-level=high` no `ci.yml`, teste de schema alinhado ao #161, teste de workflow estendido ao `coleta.yml`, merge da `main` e ajustes do `docs/SEGURANCA.md` (#83) | Aceito após a minha revisão |
| 23/11/2026 | Allan | opencode (DeepSeek) | Ajustes no `docs/estrategia-de-testes.md` pedidos na revisão do PR #100: branch atualizada com a `main`, seção 4 e cobertura refeitas, dependências do robô, lacunas e seção 6 | Ajustado após revisão no PR #100 |
| 23/11/2026 | Allan | opencode | Resolução do conflito do `AI-USAGE.md` no PR #119: restaurou as linhas de 17/11/2026 (Sprint 04) e 13/11/2026 (estratégia de testes) da `main` e manteve a linha do `docs/VISAO-DE-PRODUTO.md`; com o `npm test` passando | Aceito após revisão no PR |
| 09/11/2026 | José Gabriel | Antigravity | Elaboração do README.md completo para a Release 2 (arquitetura, tecnologias, guia de instalação, .env e seção de coleta de termos) para a issue #97 | Aceito |
| 16/11/2026 | Pedro | Claude | README.md reescrito no padrão do README do Flutter (badges de CI e Pages, Documentação, Serviços externos, Sobre por qualidades), a partir da versão do José Gabriel, para a issue #97 | Aceito; a escolha do Flutter como modelo (a professora indicou os badges dele) e de fazer o commit no PR #99 foi minha |
| 18/11/2026 | Pedro | Claude Code | Seção "Rodar a coleta", `npm ci`, Node 22.9 e links da documentação no README, a partir da revisão do Allan no PR #99, para a issue #97 | Aceito após a minha revisão |
| 18/11/2026 | José Gabriel | Antigravity | Sincronização do PR #99 com a `main`, inclusão de `GEMINI_API_KEY=` no `.env.example` e atualização do `README.md` com a Trilha do calouro (ADR 0011) e o SonarQube Cloud (ADR 0013) (#97) | Aceito após revisão |
| 24/11/2026 | Allan | opencode (DeepSeek) | Verificação periódica das fontes (#60): campo `verificado_em` no schema e na ficha, `coleta/verificacao.js`, `scripts/verificar-fontes.mjs`, workflow semanal que abre issue por fonte sem duplicar, testes e atualização de docs | Aceito após revisão no PR #187 |
| 24/11/2026 | Italo | Antigravity | Registro da Sprint 09 e retrospectiva da R2 (docs/scrum/sprints/sprint-09.md): levantamento de métricas no GitHub , review, retrospectiva| Aceito após a minha revisão |
| 24/11/2026 | José Gabriel | Antigravity | Revisão e atualização de `specs/constitution.md` conforme revisão do PR #32 (versão 0.1.0, consulta offline, nomes oficiais de lugares/programas, link para `CODE_OF_CONDUCT.md` e rastreabilidade com ADRs) | Aceito após revisão manual e execução dos testes |
| | | | | |

## Observações gerais

- Código/dado gerado por IA passa pela mesma revisão de PR que qualquer outro (ver `docs/PROCESSO.md`)
- Termo sugerido com ajuda de IA precisa ter `fonte` verificada por uma pessoa antes de aceito
