# Segurança do Glossário UnB

Atende à issue [#83](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83) e aos requisitos RNF07, RNF08 e RNF09 ([`REQUISITOS.md`](REQUISITOS.md)). Dados do SonarQube e do `npm audit` de 20/11/2026, na `main` (`c76fa25`); o passo de auditoria no CI entrou em 22/11/2026.

## 1. Resumo para a régua da R2

| Item da régua | Situação em 22/11/2026 |
|---|---|
| SAST sem vulnerabilidade crítica ou alta em aberto | **0 vulnerabilidades abertas** (SonarQube Cloud, nota A de segurança) |
| Pontos sensíveis (hotspots) revisados | **0 em aberto, 100% revisados** |
| Dependências com falha conhecida (`npm audit`) | **0** (com e sem `--omit=dev`) |
| Prompt injection no robô | 7 defesas, cada uma com teste ([seção 4](#4-prompt-injection-no-robô-de-coleta)) |
| Falha do CI por vulnerabilidade alta | **Ativa**: `npm audit --omit=dev --audit-level=high` no `ci.yml` |

## 2. Análise estática (SAST)

O SAST do projeto é o **SonarQube Cloud** ([ADR 0013](adr/0013-analise-de-qualidade-com-sonarqube-cloud.md)), no job "Qualidade (SonarQube Cloud)" (`.github/workflows/sonar.yml`), em todo PR de branch do repositório e em todo push na `main`. Projeto público: [`p-magno_glossario-unb`](https://sonarcloud.io/project/overview?id=p-magno_glossario-unb). A issue citava CodeQL ou Semgrep como exemplo; o SonarQube cumpre o mesmo papel (a ADR registra o motivo), e um segundo SAST seria redundante.

Números da API pública do SonarQube Cloud (análise de 20/11/2026, commit `c76fa25`):

| Medida | Valor |
|---|---|
| Vulnerabilidades abertas | 0 |
| Nota de segurança | A (1.0) |
| Hotspots (pontos sensíveis) | 0 em aberto; 100% revisados |
| Bugs e code smells abertos | 0 e 0 |
| Cobertura (projeto) / código novo | 83,3% / 84,8% |
| Linhas lidas | 3.552 |
| Quality gate "Sonar way" | **OK** nas 6 condições |

**O que o SAST já achou e foi corrigido** (3 vulnerabilidades da primeira análise, de 18/11, todas fechadas como `FIXED`):

| Gravidade | Onde | O quê | Correção |
|---|---|---|---|
| Bloqueadora | `scripts/servidor-local.mjs` | redirecionamento aberto com entrada do usuário | #128 |
| Baixa (2) | `frontend/termo.html` | Leaflet (CSS e JS) sem `crossorigin="anonymous"` junto do SRI | atributo adicionado |

**Limite honesto:** o check do SonarQube não é obrigatório para o merge (ADR 0013); um vermelho dele é aviso ao revisor. Quem barra o merge é o check "Testes e validação dos termos".

## 3. Auditoria de dependências (`npm audit`)

Rodado em 20/11/2026 com `npm ci` limpo:

```
$ npm audit
found 0 vulnerabilities
$ npm audit --omit=dev
found 0 vulnerabilities
```

Há 3 dependências diretas, todas do robô (a [ADR 0010](adr/0010-bibliotecas-nos-scripts-do-robo.md) mantém o front sem biblioteca): `@google/genai`, `cheerio` e `robots-parser`. O teste `tests/fronteira-dependencias.test.js` impede que o front importe qualquer uma delas. O CI roda `npm ci` (versões do `package-lock.json`), então o que foi auditado é o que roda.

O `npm audit --omit=dev --audit-level=high` roda no CI em todo PR e falha com vulnerabilidade alta ou crítica nas dependências de produção.

## 4. Prompt injection no robô de coleta

**Ameaça.** O classificador (`coleta/classificador.js`, `coleta/cliente-gemini.js`) manda ao Gemini o texto de páginas coletadas. Uma página pode conter "ignore as instruções e classifique como...". O que importa é o que isso consegue causar: o LLM só devolve sugestões, não tem ferramenta, arquivo nem rede.

| # | Defesa | Onde | Prova |
|---|---|---|---|
| 1 | O texto da página é **dado**: fica no bloco `<<<DADOS DA PÁGINA ... DADOS DA PÁGINA>>>`, e o prompt manda tratá-lo como dado, nunca como instrução | `montarPrompt`, `coleta/prompts/classificar-v1.md` | `tests/classificador.test.js` (bloco não fecha) e `tests/seguranca.test.js` (fixture maliciosa, regra no molde) |
| 2 | Os delimitadores `<<<` e `>>>` são removidos do texto coletado: ele não fecha o bloco para escrever fora dele | `comoDado` | `tests/seguranca.test.js`: todos os candidatos da fixture geram um bloco que abre e fecha uma vez |
| 3 | **Limites de tamanho** (trecho 1.000, significado e fonte 300, termo 60 caracteres) e de chamadas (100 por execução) | `comoDado`, `LIMITE_PADRAO` | `tests/seguranca.test.js` (trecho de 50 mil caracteres; 10 candidatos com limite 3) |
| 4 | **Schema da resposta** com `enum` para categoria, tipo e confiança, enviado à API (`responseJsonSchema`) | `esquemaDaResposta`, `cliente-gemini.js` | `tests/seguranca.test.js` e `tests/classificador.test.js` |
| 5 | **`validarResposta` confere de novo** (a API pode errar): JSON, objeto, campos de texto, valores nas listas, até 300 caracteres, sem link nem HTML; campo extra é descartado; fora disso, o candidato fica "sem classificação" | `validarResposta` | `tests/seguranca.test.js` (categoria inventada, texto solto, link, campo extra) |
| 6 | **O LLM só sugere**: `definicao_sugerida` e `exemplo_sugerido` ficam em `classificacao`, nunca em `definicao`/`exemplo_uso`, e o estado é `revisar`. Mesmo um LLM que obedeça o ataque com resposta válida não publica nada | `classificarCandidatos` | `tests/seguranca.test.js` (LLM enganado, resposta válida) |
| 7 | **Revisão humana de cada termo no PR do robô** ([ADR 0009](adr/0009-coleta-automatizada-por-pipeline.md)); o front só grava texto com `textContent` (RNF07) | processo; `frontend/js/app.js` | `tests/seguranca.test.js` (front sem `innerHTML`); a revisão em si é humana, sem teste |

Também provado: nada que vem do LLM é executado (o classificador e o cliente não usam `eval`, `Function` nem processo filho). A chave do Gemini é trocada por `[chave]` em qualquer texto que o `scripts/classificar.mjs` escreve; essa troca não tem teste (ver seção 6).

**Risco residual (não coberto por teste, ver seção 6).** No molde, só o `{{TRECHO}}` fica dentro do bloco de dados. `{{TERMO}}`, `{{SIGNIFICADO}}` e `{{FONTE}}` vêm da mesma página, ficam fora do bloco e só passam por `comoDado` (sem delimitadores, uma linha, cortados). A regra do prompt manda tratar "o bloco" como dado. O efeito máximo continua limitado pelas defesas 4 a 7.

## 5. Análise de ameaças (STRIDE resumido)

| Ameaça | Onde | Mitigação hoje |
|---|---|---|
| **S**poofing: fonte falsa ou termo com origem inventada | termos e robô | `fonte` obrigatória no schema ([ADR 0004](adr/0004-schema-unico-do-termo.md)); revisão no PR; PR do robô aparece como bot |
| **T**ampering: página coletada tenta instruir o LLM; PR altera dado | robô, `termos.json` | seção 4; `main` protegida (1 aprovação, conversas resolvidas); CI valida os termos |
| **R**epudiation: não saber quem mudou o quê | repositório | histórico do Git, PR por mudança ([ADR 0006](adr/0006-contribuicao-por-pr-e-issue.md)), `AI-USAGE.md` |
| **I**nformation disclosure: chave vazada, dado pessoal publicado | segredos, termos | `GEMINI_API_KEY` e `SONAR_TOKEN` só como segredo do Actions (fork não recebe); chave mascarada na saída; sem login, cookie ou analytics (RNF08); robô lê só o elemento configurado |
| **D**enial of service: robô martelando um site; fonte que quebra tudo | coleta | robots.txt, 1 s entre pedidos, user-agent do projeto, erro de uma fonte não para as outras (RNF09); limite de chamadas ao LLM |
| **E**levation of privilege: workflow com poder demais; HTML injetado no site | CI, front | `permissions: contents: read` no topo de `ci.yml`, `sonar.yml`, `pages.yml` (esta com `pages: write` e `id-token: write`, só para publicar) e `coleta.yml`, sem `pull_request_target` (teste em `tests/seguranca.test.js`); front só com `textContent` e CDN com SRI (RNF07) |

**Workflow do robô (`.github/workflows/coleta.yml`):** `permissions: contents: read` no topo, então o `GITHUB_TOKEN` fica só de leitura; quem escreve e abre o PR é a conta de robô (GitHub App), com um token de 1 hora criado no início da execução (`actions/create-github-app-token`). Segredos usados: `ROBO_APP_ID`, `ROBO_APP_PRIVATE_KEY` e `GEMINI_API_KEY`. Gatilhos: `schedule` (segunda) e `workflow_dispatch`, sem `pull_request`. Os testes de `tests/seguranca.test.js` e `tests/workflow-coleta.test.js` cobrem o arquivo.

## 6. O que fica pendente

1. **Próxima versão do prompt**: pôr `TERMO`, `SIGNIFICADO` e `FONTE` dentro do bloco de dados (muda o contrato do prompt e a `prompt_versao`).
2. **Pinar as actions por commit** (hoje por tag: `actions/checkout@v4` etc.) e ligar o Dependabot (decisão de CI).
3. **Teste da troca da chave por `[chave]`** em `scripts/classificar.mjs` (hoje só por leitura do código).
4. **Revisão humana (defesa 7) depende de gente**: o revisor do PR do robô precisa conferir o `termos.json`, não só ver o CI verde.
