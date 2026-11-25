# Changelog

Todas as mudanças importantes do Glossário UnB ficam neste arquivo.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [2.1.0] - 2026-11-25

Evolução pós-Release 2 nascida da revisão do uso do site para a apresentação.

### Adicionado

- **Expansão de expressões, gírias e siglas oficiais (#195):** glossário sobe de **325 para 346 termos** (+21 entradas, todas com fonte `.unb.br` verificada), ampliando de 6 para **20 expressões** (Manual do Calouro 2026/2, Boas-Vindas e UnB Notícias: `Módulo Livre`, `Crédito`, `Atividades Complementares`, `Monitoria`, `Pré-requisito`, `Revisão de Menção`, `Reintegração`, `Trancamento Parcial`, `Aproveitamento de Estudos`, `Desligamento` com sinônimo `Jubilamento`, `Iniciação Científica`, `Anfiteatro 9`, `Calourada`, `InspiraUnB`), de 3 para **4 gírias** (`Bandejão`, fonte oficial `ru.unb.br/galeria-e-historico/`) e **+6 siglas** (`TCC`, `TCE`, `DIRIC`, `COC`, `PAT`, `PJC`), elevando "Veja também" de 148 para **197 ligações**.
- **Sinônimos das menções em `Menção` (#194):** a ficha `Menção` passa a aceitar `SS`, `MS`, `MM`, `MI` e `II` como sinônimos diretos (mantendo `SR` como ficha própria ligada em "Veja também" e sem colidir com nenhum outro termo do catálogo).
- **Filtro "Só com mapa ou planta" em Todas as siglas (#191):** novo seletor acessível **Localização** (`?localizacao=1`) que une os 34 termos com mapa OpenStreetMap e os 33 termos ligados à Planta 2D da FCTE (~65 termos no total), com testes unitários, sabotagem e E2E + `axe-core`.
- **Busca de salas da Planta da FCTE na capa e em `planta.html` (#192):** digitar `S10`, `S-10`, `I-10` ou `Auditório` na página inicial ou na nova caixa **Buscar sala** em `planta.html` leva direto ao prédio/andar certo com a sala destacada (ignorando hífens/acentos e sem poluir `termos.json`), com cache offline atualizado para `sw.js v26`.

### Documentação

- Atualização em cascata da matriz de rastreabilidade (`docs/RASTREABILIDADE.md`), do relatório de testes (`docs/RELATORIO-DE-TESTES.md`), da tabela de sabotagem (`docs/TESTE-DE-SABOTAGEM.md`), da página `/sobre/` e do `CHANGELOG.md` para a v2.1.0 (444 testes unitários/integração, 40/40 sabotagens, 17/17 E2E + `axe-core`, 5/5 BDD e 0 issues no SonarQube).

## [2.0.0] - 2026-11-24

Segunda versão: Release 2. Reúne todos os PRs mesclados na `main` depois da v1.0.0 (29/09/2026).

### Adicionado

- **Identidade visual V7 e logo "Entre aspas":** interface renovada em CSS puro (mantendo ADRs 0002 e 0008), cartões Bento na página de dados, cartões interativos em "Veja também", barra de filtros aprimorada, modo escuro harmonizado e nova logo "Entre aspas" escolhida em votação pelo grupo (#186).
- **Verificação periódica das fontes (RF07, #60):** workflow semanal `.github/workflows/verificacao.yml` que confere links quebrados, redirecionamentos suspeitos e `Last-Modified`, abre issue única por fonte sem duplicar e exibe o campo opcional `verificado_em` ("Verificado em dd/mm/aaaa") na ficha do termo (#187).
- **Planta 2D da FCTE ("Onde fica"):** desenho em SVG sem bibliotecas externas (ADR 0012) com campus, prédios (UAC, UED e LDTEA), 119 salas (com todas as 24 salas ligadas a siglas de laboratórios já conectadas às suas fichas), página própria por andar (`planta.html`) e marcação de posição aproximada nas salas ainda não conferidas presencialmente (#174, #181).
- **Mapa em 34 termos de lugar (OpenStreetMap, ADR 0005):** marcador interativo com Leaflet e link de rota no Ceubinho (#40) e em mais 33 prédios, faculdades, institutos e campi conferidos no OpenStreetMap (BCE, ICC, FCTE, RU, Minhocão, entre outros) (#184).
- **Filtro por categoria, busca por sinônimos e bloco "Veja também":** filtro por categoria em "Todas as siglas", busca que encontra termos por sinônimos validados (ex.: "assistência econômica" → Auxílio Socioeconômico; "FCE" → FCTS) e 148 ligações conferidas de "Veja também" validadas no CI (#180).
- **Página "De onde vêm os dados":** boletim público da última coleta do robô com totais por fonte e por categoria direto no site (`origem-dos-dados.html`) (#178).
- **Trilha "Primeiros passos na UnB" por momento do semestre:** 25 termos em 6 grupos, com progresso salvo no aparelho e funcionamento offline (#124, #123, #140, #179).
- **Robô de coleta de termos, em etapas (ADR 0009):**
  - coletor genérico de páginas HTML guiado por `coleta/fontes.json`, respeitando `robots.txt` e intervalo de 1 s (#111), expandido com 12 fontes oficiais da SAA e das unidades da FCTE (#175);
  - normalização, deduplicação e merge com o `termos.json`, sem sobrescrever definição nem exemplo escritos por pessoa (#101);
  - categorização e rascunho assistidos pelo Gemini com resposta validada por schema (#104);
  - coletor da Lista de Siglas da DPO em PDF (#142) e workflow semanal agendado que abre PR para revisão (#144);
  - filtro de termos de fora da universidade (lista fixa, avaliação do Gemini com modelo reserva automático e revisão humana no PR; ADR 0014) (#161).
- **Coleta real de termos:** glossário sobe de 41 termos na v1.0.0 para 325 na `main`, todos com fonte oficial e categorizados na taxonomia fechada (#136, #162, #164, #166, #167, #168, #169, #181) — incluindo os 50 novos termos conferidos na coleta de 24/11 (34 laboratórios da FCTE, UAC, 7 coordenações e 7 siglas da SAA, e CAREL-UnB) (#181).
- **Qualidade e testes automatizados no CI:**
  - teste de sabotagem nos módulos críticos (36 de 36 defeitos barrados pela suíte) (#146, #180);
  - lint com ESLint e cobertura mínima de testes no CI (#120);
  - testes E2E no navegador com Playwright e auditoria de acessibilidade axe-core nos temas claro e escuro (#153);
  - testes de aceitação BDD em Gherkin executáveis com `playwright-bdd` (#183);
  - teste de mutação com StrykerJS nos módulos de domínio (#157);
  - Lighthouse CI validando desempenho, LCP, CLS e acessibilidade em todo PR (#148);
  - SonarQube Cloud com análise contínua e cobertura de testes (#107, #133, #185).
- **Segurança e comunidade:** análise estática (SAST), `npm audit` no CI e testes de defesa contra prompt injection (#158); `.env.example` e `.gitignore` (#45, #99); `CODE_OF_CONDUCT.md` e `SECURITY.md` com links no `README` e no `CONTRIBUTING` (#176).
- **Contribuição:** migração dos templates de sugestão e correção de termos para Issue Forms YAML (#137); convenção de commits, fluxo de branches e registro do merge por squash como padrão (#33, #182).

### Alterado

- `README.md` atualizado para a Release 2 com badges de CI/Pages/SonarQube, guia completo de instalação, configuração do `.env` e execução do robô (#99).
- Página `/sobre/` reescrita como página de produto (#105) e harmonizada com a identidade visual V7 (#186).
- Planilha deixa de ser a fonte da verdade dos termos: novos termos chegam por PR revisado (ADR 0009) (#102).
- Regras das páginas extraídas de `app.js` para módulos testados no Node (`busca.js`, `lista.js`, `ficha.js`, `tema.js`, `planta.js`, `origem.js`, `trilha.js`) (#138).
- Redução de complexidade no coletor (#129) e limpeza de import sem uso (#125).
- Suíte de testes automatizados sobe de 26 na v1.0.0 para 437 na `main` (`8197992`).

### Corrigido

- Alertas do SonarQube Cloud (`S9383` em `frontend/js/app.js` e `S8786` em `frontend/js/planta.js` e `coleta/dpo.js`), restaurando o Quality Gate para `Passed` com 0 issues (#185).
- Reserva de espaço no HTML e no CSS para trilha, atalhos, lista e ficha evitarem deslocamento de layout (CLS) (#155); compressão gzip no servidor local de medição (#148).
- Definições com fonte oficial para 45 termos e nomes oficiais de FACE, IPOL, PCCTAE, PIBITI, UnBTV, PCTec, Mespt, PAINT e RAINT (#170, #177); correção de campus, redação, fontes HTTPS e coordenadas (#150).
- Servidor local e coletor no Windows, e tratamento de erro 5xx no `robots.txt` segundo a RFC 9309 (#111).
- Testes da DPO desacoplados do `termos.json` real (#159); ajuste no RF06 (#41).
- Remoção de artefatos locais de execução rastreados por acidente (`playwright-report/`, `test-results/` e `tests/aceitacao/passos.js.antes-137`) e atualização do cache do Service Worker para `v25`.

### Segurança

- Redirecionamento do servidor local restrito a lista fechada de pastas, resolvendo alerta S5146 do SonarQube (#128).
- Análise estática (SAST), `npm audit` e defesa contra prompt injection (#158).
- Chaves e segredos fora do repositório (#45), política de segurança (`SECURITY.md`, #176) e análise do SonarQube Cloud no CI (#107, #133, #185).

### Documentação

- ADRs 0009 (pipeline de coleta), 0010 (bibliotecas só no robô e em testes/qualidade), 0011 (trilha), 0012 (planta 2D), 0013 (SonarQube) e 0014 (filtro de termos) (#102, #131, #133, #161, #174), com status consolidado (#149).
- Visão de produto e histórias de usuário (#119), requisitos com verbo/objeto, RNFs com métrica e matriz de rastreabilidade (#112, #135, #156, #187), diagramas C4 (#121), modelo conceitual de dados (#143), estratégia e relatório de testes (#100, #165).
- Catálogo de fontes de dados (#122), trilha do calouro (#123), spike do bot (#141), relatório da coleta R2 (#171) e roteiro de conferência de termos (#163).
- `README.md` completo da R2 (#99), `AGENTS.md` na raiz (#108), `CODE_OF_CONDUCT.md` e `SECURITY.md` (#176), e registro do merge por squash (#182).
- Processo: Sprints 04 a 09 e retrospectiva da R2 (#118, #109, #151, #152, #147, #188), planejamento (#117), retrospectiva R1 / planejamento R2 (#127) e atas de encontro (#115, #126).

### Quebras de compatibilidade

Nenhuma para quem usa o glossário. Para quem desenvolve: `npm ci` instala as bibliotecas dos scripts do robô (`cheerio`, `robots-parser`, `@google/genai`, `pdfjs-dist`) e das ferramentas de teste/qualidade (`eslint`, `@playwright/test`, `playwright-bdd`, `@axe-core/playwright`, `@stryker-mutator/core`). O front (`frontend/`, `sobre/`) continua sem framework, sem build e sem dependência.

[Não lançado]: https://github.com/unb-mds/2026-2-GlossarioUnB/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/unb-mds/2026-2-GlossarioUnB/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/unb-mds/2026-2-GlossarioUnB/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/unb-mds/2026-2-GlossarioUnB/releases/tag/v1.0.0
