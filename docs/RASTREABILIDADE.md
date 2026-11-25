# Rastreabilidade dos requisitos

Matriz que liga cada requisito de [`REQUISITOS.md`](REQUISITOS.md) à história, à issue, ao PR e ao arquivo ou teste que o prova. Atualizada em **25/11/2026** para a consolidação da **Release `v2.0.0`** e das evoluções da **`v2.1.0`** (`#194`, `#195`, `#191`, `#192`). Para o avaliador seguir o caminho: **requisito, história, issue, PR, prova**.

- **História:** as histórias Gherkin `US01` a `US06` estão em [`VISAO-DE-PRODUTO.md`](VISAO-DE-PRODUTO.md) (PR [#119]).
- **Prova:** arquivo de teste e escopo coberto (`tests/<arquivo>`, `e2e/<arquivo>` ou workflow).
- **Épicos:** E1 [#47], E2 [#48], E3 [#49], E4 [#50], E5 [#51].

## Requisitos funcionais

| Requisito | História | Issue (épico) | PRs | Prova | Situação |
| --- | --- | --- | --- | --- | --- |
| RF01 Buscar termo pelo nome, sinônimo e sala | US02 | [#38], [#20] (E3) | [#39], [#138], [#180], [#194], [#192] | `tests/termos.test.js` (nome e sinônimos); `tests/busca.test.js`; `tests/planta.test.js`; `e2e/busca.spec.js`; `e2e/busca-salas.spec.js`; `tests/aceitacao/busca.feature` | Pronto (busca por assunto em [#172] pós-validação com calouros) |
| RF02 Filtrar a lista por tipo, categoria, campus e localização | US02 | [#38], [#63] (E2), [#66] (E2) | [#39], [#136], [#138], [#180], [#191] | `tests/termos.test.js`; `tests/lista.test.js` (filtros + `?localizacao=1`); `e2e/lista.spec.js`; `e2e/filtro-localizacao.spec.js` | Pronto |
| RF03 Publicar os termos em JSON estático | US05 | [#37], [#21] (ADR 0004) | [#39], [#162], [#181], [#195] | `tests/dados.test.js` (346 termos conferidos contra o schema) | Pronto |
| RF04 Receber sugestão por Issue ou Pull Request | US04 | [#24], [#71] (E3) | [#5], [#39], [#137] (Issue Forms YAML) | `tests/issue-templates.test.js`; `e2e/busca.spec.js` (link "Sugerir este termo"); `tests/aceitacao/busca.feature` | Pronto |
| RF05 Exibir a ficha do termo (com Veja também, mapa OSM e planta 2D) | US02 | [#38], [#35], [#65] | [#39], [#138], [#174], [#180], [#184] | `tests/ficha.test.js`; `tests/validacao-termo.test.js` (`localizacao`, `urlSegura`, `relacionados`); `tests/planta.test.js`; `tests/planta-dados.test.js` | Pronto |
| RF06 Validar o termo contra o schema antes do merge | US05 | [#11], [#44] (E4) | [#39], [#41], [#180] | `tests/validacao-termo.test.js` (schema, `relacionados`, `sinonimosQueSaoOutroTermo`); `tests/dados.test.js`; `tests/deduplicar.test.js`; `.github/workflows/ci.yml` | Pronto |
| RF07 Sinalizar termo desatualizado | US05 | [#60] (E1) | [#187] | `tests/verificacao.test.js` (HTTP, redirect, `Last-Modified`, deduplicação de issues, `robots.txt`); `tests/ficha.test.js` (`verificado_em`); `tests/workflow-verificacao.test.js` | Pronto |
| RF08 Sugerir termos ao digitar | US02 | [#38] | [#39], [#138], [#180], [#194], [#192] | `tests/busca.test.js` (teclado, Enter, status ARIA, sinônimos, salas); `e2e/busca.spec.js`; `e2e/busca-salas.spec.js` | Pronto |
| RF09 Sinônimos, termos relacionados ("Veja também") e busca sem resultado | US02 | [#66] (E2) | [#138], [#180], [#194], [#195] | `tests/termos.test.js`; `tests/ficha.test.js` (`relacionadosDe`); `tests/busca.test.js`; `e2e/busca.spec.js` | Pronto (busca na definição em [#172] pós-validação) |
| RF10 Enviar sugestão pelo site sem conta GitHub | US04 | [#72] (E3) | nenhum | Opcional pós-R2 (coberto hoje por Issue Forms em RF04) | Pendente (opcional) |
| RF11 Coletar candidatos de páginas oficiais e PDF da DPO | US01 | [#52], [#53], [#56], [#61] (E1) | [#102], [#111], [#122], [#142], [#175] | `tests/coletor-html.test.js`; `tests/coletor-dpo.test.js`; `tests/fontes-saa-fcte.test.js`; `tests/fontes-girias.test.js` | Pronto |
| RF12 Separar candidatos em novo, alterado e conflito | US01 | [#57] (E1) | [#101] | `tests/deduplicar.test.js` (novo, igual, alterado, conflito, limite 60%, merge preservando texto humano) | Pronto |
| RF13 Sugerir categoria, filtrar escopo e gerar rascunho com LLM | US01 | [#58] (E1) | [#104], [#161] (ADR 0014) | `tests/classificador.test.js`; `tests/filtro-de-termos.test.js` (lista fixa + Gemini com fallback 503/429 + revisão humana) | Pronto |
| RF14 Abrir PR semanal com os termos coletados | US01 | [#59] (E1) | [#144], [#162], [#181] | `tests/workflow-coleta.test.js`; `tests/atualizar-termos.test.js`; `tests/relatorio.test.js`; PRs reais [#162] e [#181] | Pronto |
| RF15 Exibir a trilha "Primeiros passos na UnB" com progresso local | US03 | [#69], [#70] (E3) | [#123], [#124], [#179] | `tests/trilha.test.js` (25 termos em 6 grupos, progresso em `localStorage`); `tests/busca.test.js`; `tests/aceitacao/trilha-do-calouro.feature` | Pronto (validação com 5 calouros em aberto: [#76], 1/5) |

## Requisitos não funcionais

| Requisito | História | Issue (épico) | PRs | Prova | Situação |
| --- | --- | --- | --- | --- | --- |
| RNF01 Consulta offline (PWA) | US05 | [#34], [#78] (E4) | [#39], [#153], [#189], [#192] | `frontend/sw.js` (`v26`); `e2e/offline.spec.js` (consulta offline após 1ª visita) | Pronto |
| RNF02 Desempenho (LCP, CLS e orçamento) | US05 | [#80] (E4) | [#148], [#155] | `.github/workflows/lighthouse.yml`; `tests/layout-estavel.test.js`; `tests/lighthouse.test.js` | Pronto |
| RNF03 Acessibilidade (WCAG 2.1 AA claro e escuro) | US05 | [#78], [#80] (E4) | [#153], [#186], [#191], [#192] | `e2e/acessibilidade.spec.js`; `e2e/filtro-localizacao.spec.js`; `e2e/busca-salas.spec.js` (0 violações `axe-core`); `tests/sobre.test.js` | Pronto |
| RNF04 Usabilidade e aceitação (BDD) | US05 | [#78], [#81] (E4), [#76] (E3) | [#153], [#179], [#183] | `tests/aceitacao/busca.feature` e `trilha-do-calouro.feature` (5/5 BDD verdes); 1/5 testes presenciais com calouros em [#76] | Parcial (testes automáticos prontos; 4/5 calouros em aberto) |
| RNF05 Qualidade dos dados e proveniência | US05 | [#77], [#60] (E4, E1) | [#112], [#178], [#187] | `tests/dados.test.js`; `tests/origem-dos-dados.test.js`; `tests/verificacao.test.js`; página `origem-dos-dados.html` | Pronto |
| RNF06 Manutenibilidade (cobertura, sabotagem, mutação, lint) | US05 | [#79], [#82], [#106] (E4) | [#107], [#120], [#146], [#157], [#185] | `npm run lint` (0 erros); `npm run test:cobertura` (99,47% domínio); `npm run test:sabotagem` (40/40); `npm run test:mutacao` (~90,9% StrykerJS); SonarQube `Passed · 0 Issues` | Pronto |
| RNF07 Segurança (SAST, `npm audit`, prompt injection, segredos) | US05 | [#83], [#106] (E4) | [#45], [#107], [#128], [#158], [#176] | `tests/seguranca.test.js`; `tests/servidor-local.test.js` (S5146); `tests/classificador.test.js`; `tests/fronteira-dependencias.test.js`; `npm audit`; `SECURITY.md` | Pronto |
| RNF08 Privacidade (LGPD, sem rastreamento, progresso local) | US01 | [#134] (E4) | [#135], [#179] | `tests/coletor-html.test.js` (recorte LGPD); `tests/trilha.test.js` (`localStorage` só no aparelho); zero analytics/login | Pronto |
| RNF09 Coleta responsável (`robots.txt`, RFC 9309, pausa 1 s) | US01 | [#134] (E1) | [#111], [#135] | `tests/coletor-html.test.js` (`robots.txt`, erro 5xx pela RFC 9309, 1 s entre pedidos, user-agent); sabotagem em `tests/sabotagens/robo.json` | Pronto |

## Resumo

- **RF:** 15 no total — **14 prontos e testados**, **1 opcional pós-R2** (`RF10`, [#72]).
- **RNF:** 9 no total — **8 prontos com prova automática no CI**, **1 parcial** (`RNF04`: BDD/E2E prontos, faltam 4 de 5 calouros em [#76]).

[#5]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/5
[#11]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/11
[#20]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/20
[#21]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/21
[#24]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/24
[#34]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/34
[#35]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/35
[#37]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/37
[#38]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/38
[#39]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/39
[#41]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/41
[#44]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/44
[#45]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/45
[#47]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/47
[#48]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/48
[#49]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/49
[#50]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/50
[#51]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/51
[#52]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/52
[#53]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/53
[#56]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/56
[#57]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/57
[#58]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/58
[#59]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/59
[#60]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60
[#61]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/61
[#63]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/63
[#65]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/65
[#66]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/66
[#69]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/69
[#70]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/70
[#71]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/71
[#72]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/72
[#76]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/76
[#77]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/77
[#78]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78
[#79]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79
[#80]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80
[#81]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/81
[#82]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/82
[#83]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83
[#101]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/101
[#102]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/102
[#104]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/104
[#106]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/106
[#107]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/107
[#111]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/111
[#112]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/112
[#119]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/119
[#120]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/120
[#122]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/122
[#123]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/123
[#124]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/124
[#128]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/128
[#134]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/134
[#135]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/135
[#136]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/136
[#137]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/137
[#138]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/138
[#142]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/142
[#144]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/144
[#146]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/146
[#148]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/148
[#153]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/153
[#155]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/155
[#157]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/157
[#158]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/158
[#161]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/161
[#162]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/162
[#172]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/172
[#174]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/174
[#175]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/175
[#176]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/176
[#178]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/178
[#179]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/179
[#180]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/180
[#181]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/181
[#183]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/183
[#184]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/184
[#185]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/185
[#186]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/186
[#187]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/187
[#189]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/189
[#191]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/191
[#192]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/192
[#194]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/194
[#195]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/195
