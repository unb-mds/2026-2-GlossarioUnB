# Rastreabilidade dos requisitos

Matriz que liga cada requisito de [`REQUISITOS.md`](REQUISITOS.md) à história, à issue, ao PR e ao arquivo ou teste que o prova. Dados conferidos na `main` em 20/11/2026 (`gh issue list --state all`, `gh pr list --state merged` e `grep` em `tests/`). Para o avaliador seguir o caminho: **requisito, história, issue, PR, prova**.

- **História:** as histórias Gherkin US01 a US06 estão no [PR #119](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/119) (`docs/VISAO-DE-PRODUTO.md`), ainda aberto. Este documento só cita o código de cada uma.
- **PR:** só os mergeados. Quando o trabalho está em PR aberto, aparece como "aberto" e não conta como prova.
- **Prova:** o arquivo de teste e o assunto do teste (`tests/<arquivo>`). "Sem teste" quer dizer que nenhum teste da `main` cobre o requisito.
- **Épicos:** E1 [#47], E2 [#48], E3 [#49], E4 [#50], E5 [#51].

## Requisitos funcionais

| Requisito | História | Issue (épico) | PR mergeado | Prova | Situação |
| --- | --- | --- | --- | --- | --- |
| RF01 Buscar termo pelo nome | US02 | [#38], [#20] (E3) | [#39] (R1), [#138] (módulo com teste) | `tests/termos.test.js` (buscarTermos: sem acento e caixa, começa com, limite, vazia); `tests/busca.test.js` (sugestões) | Pronto |
| RF02 Filtrar a lista por tipo e campus | US02 | [#38], [#66] (E2), [#63] (E2) | [#39], [#138] | `tests/termos.test.js` (filtrarTermos, filtrosDaUrl, agruparPorLetra); `tests/lista.test.js` (filtros, endereço, vazia) | Pronto (taxonomia: [#63] aberta) |
| RF03 Publicar os termos em JSON estático | US05 | [#37], [#21] (ADR 0004) | [#39] | `tests/dados.test.js` (termos.json segue o schema) | Pronto |
| RF04 Receber sugestão por Issue ou Pull Request | US04 | [#24], [#71] (E3) | [#5] (templates), [#39] (CONTRIBUTING) | Sem teste: `.github/ISSUE_TEMPLATE/sugerir-termo.md` e `CONTRIBUTING.md` | Pronto, sem teste |
| RF05 Exibir a ficha do termo | US02 | [#38], [#35] | [#39], [#138] | `tests/ficha.test.js` (endereço, aba, campus Geral, fonte com e sem link); `tests/validacao-termo.test.js` (localizacao, urlSegura) | Pronto (id inexistente e mapa sem teste) |
| RF06 Validar o termo contra o schema antes do merge | US05 | [#11], [#44] (E4) | [#39], [#41] (texto do RF) | `tests/validacao-termo.test.js` (12 testes); `tests/dados.test.js`; `tests/deduplicar.test.js` (repetidosNoGlossario); `.github/workflows/ci.yml` (`npm test`) | Pronto |
| RF07 Sinalizar termo desatualizado | US05 | [#60] (E1) | nenhum | Sem teste | Pendente |
| RF08 Sugerir termos ao digitar | US02 | [#38] | [#39], [#138] | `tests/busca.test.js` (setas, Enter, status do leitor de tela, sem resultado) | Pronto |
| RF09 Termos parecidos e busca sem resultado | US02 | [#66] (E2) | [#138] (aviso) | `tests/busca.test.js` ("sem resultado, o aviso repete o que foi digitado"); parecidos: sem teste | Parcial |
| RF10 Enviar sugestão pelo site | US04 | [#72] (E3) | nenhum | Sem teste | Pendente (opcional) |
| RF11 Coletar candidatos de páginas oficiais | US01 | [#56], [#52], [#53], [#61] (E1) | [#111], [#122] (fontes), [#102] (ADR 0009), [#142](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/142) (PDF da DPO) | `tests/coletor-html.test.js` (decanatos, secretarias, estrutura mudou, validarFontes, fonte com erro); `tests/coletor-dpo.test.js` (lista de siglas em PDF) | Parcial ([#61] fontes novas pendentes) |
| RF12 Separar candidatos em novo, alterado e conflito | US01 | [#57] (E1) | [#101] | `tests/deduplicar.test.js` (casos novo, igual, alterado, conflito, valor-limite 60%, mesclar) | Pronto |
| RF13 Sugerir categoria e rascunho com LLM, marcando para revisão | US01 | [#58] (E1) | [#104] | `tests/classificador.test.js` (validarResposta, montarPrompt, sem chave, erro da API, limite) | Pronto |
| RF14 Abrir PR com os termos coletados | US01 | [#59] (E1) | [#144] | `tests/workflow-coleta.test.js`, `tests/atualizar-termos.test.js`, `tests/relatorio.test.js`; execução real no [#162](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/162) | Pronto |
| RF15 Exibir a trilha "Primeiros passos na UnB" | US03 | [#69], [#70] (E3) | [#123], [#124] | `tests/trilha.test.js` (ids existem, 15 termos ou mais, fonte oficial, validarTrilha, montarTrilha); `tests/busca.test.js` (gruposDaTrilha) | Pronto |

## Requisitos não funcionais

| Requisito | História | Issue (épico) | PR mergeado | Prova | Situação |
| --- | --- | --- | --- | --- | --- |
| RNF01 Consulta offline | US05 | [#34], [#78] (E4) | [#39] (service worker) | Sem teste: `frontend/sw.js`; E2E offline na [#78] (aberta) | Implementado, sem teste |
| RNF02 Desempenho | US05 | [#80] (E4) | nenhum (PR [#148] aberto) | Sem prova na `main` | Pendente |
| RNF03 Acessibilidade | US05 | [#78], [#80] (E4) | nenhum | `tests/sobre.test.js` cobre só a página Sobre (h1, alt, títulos, âncoras); axe-core pendente | Parcial |
| RNF04 Usabilidade | US05 | [#78] (E4) | nenhum | Sem prova na `main` | Pendente |
| RNF05 Qualidade dos dados | US05 | [#77], [#60] (E4, E1) | [#112] | `tests/dados.test.js`; links quebrados: [#60] pendente | Parcial |
| RNF06 Manutenibilidade | US05 | [#79], [#106] (E4) | [#107] (SonarQube Cloud) | `npm run test:cobertura` mede; mínimo de 90% no CI está em [#79] (PR [#120] aberto) | Parcial |
| RNF07 Segurança | US05 | [#83], [#106] (E4) | [#107], [#128] | `tests/validacao-termo.test.js` (urlSegura); `tests/classificador.test.js` (link e HTML recusados, prompt injection); `tests/servidor-local.test.js`; `tests/fronteira-dependencias.test.js` | Parcial (SAST [#83] pendente) |
| RNF08 Privacidade | US01 | [#134] (E4) | [#135] | `tests/coletor-html.test.js` ("decanatos: o link do menu fora do trecho (LGPD) não vira candidato"); revisão no PR | Parcial |
| RNF09 Coleta responsável | US01 | [#134] (E1) | [#111], [#135] | `tests/coletor-html.test.js` (robots.txt, 1 s entre pedidos, user-agent, fonte com erro) | Pronto |

## Resumo

- **RF:** 15 no total. 10 prontos (9 com teste; RF04 pronto sem teste), 2 parciais (RF09, RF11) e 3 pendentes (RF07, RF10, RF14).
- **Sem teste:** RF04, RF07, RF10, RF14, RNF01, RNF02, RNF04.
- Quando um PR aberto entrar na `main` (por exemplo [#144], [#148], [#120]), a linha correspondente muda de "pendente" para "pronto" com o número do PR.

[#5]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/5
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
[#11]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/11
[#47]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/47
[#48]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/48
[#49]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/49
[#50]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/50
[#51]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/51
[#52]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/52
[#53]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/53
[#55]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/55
[#56]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/56
[#57]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/57
[#58]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/58
[#59]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/59
[#60]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60
[#61]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/61
[#63]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/63
[#66]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/66
[#69]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/69
[#70]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/70
[#71]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/71
[#72]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/72
[#77]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/77
[#78]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78
[#79]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79
[#80]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80
[#83]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83
[#101]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/101
[#102]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/102
[#104]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/104
[#106]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/106
[#107]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/107
[#111]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/111
[#112]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/112
[#120]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/120
[#122]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/122
[#123]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/123
[#124]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/124
[#128]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/128
[#134]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/134
[#135]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/135
[#138]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/138
[#144]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/144
[#148]: https://github.com/unb-mds/2026-2-GlossarioUnB/pull/148
