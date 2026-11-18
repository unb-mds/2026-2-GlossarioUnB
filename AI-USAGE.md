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
| 28/09/2026 | Pedro | Claude Code (Claude Opus 5.5) | Arquivos do frontend: interface, busca, filtros, validação do tipo, service worker, ícones e README | Aceito; revisão registrada no PR #28 (o front entrou na main pelo PR #39) |
| 28/09/2026 | Pedro | Claude (chat no claude.ai) | Divisão dos arquivos do projeto em blocos e commits por pessoa, sob orientação do Pedro | Aceito |
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
| | | | | |

## Observações gerais

- Código/dado gerado por IA passa pela mesma revisão de PR que qualquer outro (ver `docs/PROCESSO.md`)
- Termo sugerido com ajuda de IA precisa ter `fonte` verificada por uma pessoa antes de aceito
