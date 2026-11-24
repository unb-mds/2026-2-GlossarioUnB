# Estratégia de testes — Glossário UnB

> Issue #43. Este documento define o que é testado, como rodar os testes e o que cada tipo de mudança exige antes do merge. Requisitos em [`REQUISITOS.md`](REQUISITOS.md); decisões de arquitetura em [`adr/`](adr/).

## 1. Objetivo e princípios

A estratégia de testes existe para:

- impedir que um termo inválido chegue ao site (sem fonte, fora do schema ou com `id` duplicado);
- detectar regressões na busca, nos filtros e no agrupamento de termos;
- manter o custo baixo: testes rápidos, sem rede e que rodam localmente e no CI;
- deixar explícito o que ainda **não** é automatizado.

Princípios adotados:

- **Domínio separado da tela.** As regras ficam em `frontend/js/termos.js` e `frontend/js/validacao-termo.js`, sem DOM, para serem testadas no Node (ADR 0002).
- **Uma única validação.** O schema da ADR 0004 é validado por `validacao-termo.js`, usado pelo app, pelos testes e pelo CI. Não há regra duplicada.
- **Teste faz parte da mudança.** Todo PR que altera comportamento deve incluir ou atualizar testes.
- **CI é obrigatório.** Nenhum PR entra na `main` com o workflow vermelho (ADR 0007).

## 2. Camadas de teste

| Camada | O que verifica | Onde | Situação |
|---|---|---|---|
| **Unitário de domínio** | Normalização, busca, filtros, agrupamento, contagens, validação de um termo isolado e deduplicação | `tests/termos.test.js`, `tests/validacao-termo.test.js` e `tests/deduplicar.test.js` | Automatizado |
| **Contrato de dados** | Todos os termos reais de `frontend/data/termos.json` contra o schema da ADR 0004, incluindo `id` duplicado | `tests/dados.test.js` | Automatizado |
| **Estrutura da página** | Idioma, conteúdo sem JS, imagens com `alt`, ids únicos, um `h1`, links e resumo das ADRs na página Sobre | `tests/sobre.test.js` | Automatizado |
| **Interface (módulos de página)** | Busca, lista, ficha, tema e trilha: regras de tela separadas do `app.js` | `tests/busca.test.js`, `tests/lista.test.js`, `tests/ficha.test.js`, `tests/tema.test.js` e `tests/trilha.test.js` | Automatizado |
| **Robô de coleta** | Coleta, filtro, classificação, relatório e atualização do `termos.json`, sem rede nos testes | `tests/coletor-html.test.js`, `tests/coletor-dpo.test.js`, `tests/fontes-girias.test.js`, `tests/classificador.test.js`, `tests/filtro-de-termos.test.js`, `tests/pipeline.test.js`, `tests/relatorio.test.js`, `tests/atualizar-termos.test.js` e `tests/workflow-coleta.test.js` | Automatizado |
| **Infraestrutura** | Fronteira de dependências da ADR 0010, servidor local e teste de sabotagem | `tests/fronteira-dependencias.test.js`, `tests/servidor-local.test.js` e `tests/sabotagem.test.js` | Automatizado |
| **Integração** | Várias partes juntas (por exemplo, app + `fetch` + DOM) | — | Não automatizado |
| **Ponta a ponta (E2E)** | Fluxos reais no navegador e acessibilidade | — | Planejado na #78 |
| **Aceitação (BDD)** | Cenários Gherkin das histórias de usuário | — | Planejado na #81 |
| **Mutação** | Se os testes detectam defeitos de verdade, e não só cobertura | `npm run test:mutacao` ([TESTE-DE-MUTACAO.md](TESTE-DE-MUTACAO.md)) | Implementado (PR #157) |
| **Desempenho e acessibilidade** | Performance e WCAG AA medidos em todo PR | — | Planejado na #80 |

A prioridade segue o risco:

1. **Dado inválido publicado** é o risco mais alto: quebra a confiança no glossário e a regra de que todo termo tem fonte. Por isso o teste de contrato roda sobre o arquivo real e bloqueia a publicação.
2. **Regressão de busca e filtros** afeta o uso diário e é coberta por testes unitários.
3. **Problemas visuais, de acessibilidade e de offline** têm impacto alto, mas hoje dependem de verificação manual; entram no E2E quando a #78 for concluída.

## 3. Ferramentas e comandos

- **Node.js 22.9 ou mais novo** (`engines` do `package.json`; a #79 eleva o mínimo para 22.13 por causa do ESLint 10); o CI usa Node 24.
- **`node:test`** para os testes e **`node:assert/strict`** para as asserções, sem biblioteca de teste (ADR 0010). O front não tem dependências (ADR 0002); o robô de coleta usa as bibliotecas da ADR 0010, então rode `npm ci` uma vez antes do `npm test`.
- **Sem Jest ou Vitest:** ambos exigiriam dependências e build, sem ganho para o tamanho atual do projeto.

Comandos, executados na raiz do repositório:

```bash
npm test                          # todos os testes
npm run test:cobertura            # os mesmos testes, com cobertura
node --test tests/termos.test.js  # um arquivo específico
npm run dev                       # app em http://localhost:8080/frontend/
```

A cobertura usa `--experimental-test-coverage` do Node e mede **apenas os módulos importados pelos testes**: hoje, `frontend/js/` (menos `app.js`), `coleta/` e os scripts `scripts/classificar.mjs`, `scripts/sabotagem.mjs` e `scripts/servidor-local.mjs`. `app.js`, `sw.js`, HTML e CSS não entram no relatório. O `npm run lint` é adicionado pela #79; os comandos acima já existem na `main`.

## 4. O que está coberto hoje

| Arquivo | Foco | Testes |
|---|---|---|
| `tests/termos.test.js` | Normalização, busca com prioridade para prefixo e limite de sugestões, filtros por campus e tipo, agrupamento por letra, contagem por tipo, filtros da URL e resumo do termo | 13 |
| `tests/validacao-termo.test.js` | Campos obrigatórios, tipos aceitos, `significado` para siglas, campus, formato do `id`, `localizacao`, `id` duplicado, arquivo que não é lista e links seguros | 12 |
| `tests/dados.test.js` | Validação de **todos** os termos reais contra a ADR 0004 | 1 |
| `tests/deduplicar.test.js` | Normalização de chave, similaridade, decisão entre caso novo/igual/alterado/conflito, mesclagem e repetidos no glossário | 19 |
| `tests/busca.test.js` | Sugestões da busca da página inicial: status, teclas, atalhos por tipo e trilha do calouro | 9 |
| `tests/lista.test.js` | Agrupamento por letra, filtros por tipo e campus, contagem, filtros na URL e cartões | 8 |
| `tests/ficha.test.js` | Página do termo: endereço por `id`, título, campus, fonte exibida e link seguro | 5 |
| `tests/tema.test.js` | Tema claro/escuro: preferência salva, alternância e modo privado sem `localStorage` | 4 |
| `tests/trilha.test.js` | Integridade da trilha do calouro: ids, categorias, fontes oficiais e montagem | 10 |
| `tests/sobre.test.js` | Estrutura da página Sobre: idioma, conteúdo sem JS, imagens com `alt`, ids únicos, um `h1`, links e resumo das ADRs | 8 |
| `tests/coletor-html.test.js` | Leitura das páginas salvas em `tests/fixtures/` (decanatos e secretarias), padrões de sigla, robots.txt, espera entre pedidos e formato do `coleta/fontes.json`, sem rede | 27 |
| `tests/coletor-dpo.test.js` | Extração das siglas do PDF da DPO conferida contra a fixture das páginas 5 a 8, robots.txt e download | 23 |
| `tests/fontes-girias.test.js` | Gírias do campus nas páginas salvas: parágrafo certo, fonte e robots.txt compartilhado | 7 |
| `tests/classificador.test.js` | Validação da resposta do LLM, montagem do prompt, cliente do Gemini simulado, modelo reserva, limite de chamadas e o `scripts/classificar.mjs` sem chave | 41 |
| `tests/filtro-de-termos.test.js` | Lista fixa antes do LLM, decisões humanas e formato do `coleta/filtro-de-termos.json` | 13 |
| `tests/pipeline.test.js` | Classificação só dos termos novos, na ordem e com o limite de chamadas | 2 |
| `tests/relatorio.test.js` | Relatório da coleta e corpo do PR: totais, mudanças, tabela, filtros e modelos | 16 |
| `tests/atualizar-termos.test.js` | Inclusão de termos revisáveis no `termos.json`: campos do LLM, `id`, categoria e preservação do texto humano | 8 |
| `tests/workflow-coleta.test.js` | Workflow semanal da coleta: agendamento, permissões, credencial, pipeline e PR sem merge | 5 |
| `tests/fronteira-dependencias.test.js` | O front sem pacote npm e o `package.json` só com as bibliotecas da ADR 0010 | 2 |
| `tests/sabotagem.test.js` | Defeitos propositais nos módulos críticos: a suíte precisa quebrar | 6 |
| `tests/servidor-local.test.js` | Servidor do `npm run dev`: pastas publicadas, redirecionamento e acesso fora das pastas | 5 |

Situação na última execução local (23/11/2026):

| Métrica | Resultado |
|---|---|
| Testes | 244 passando, 0 falhando |
| Escore de mutação - domínio (`frontend/js`) | 99,20% |
| Escore de mutação - coleta (`coleta/`) | 85,70% |
| Escore de mutação - total | 90,90% |
| Cobertura de linhas* | 98,18% |
| Cobertura de branches* | 92,12% |
| Cobertura de funções* | 96,65% |

\* Somente os módulos carregados pelos testes (20 arquivos): `frontend/js/` (menos `app.js`), `coleta/` e os scripts `classificar.mjs`, `sabotagem.mjs` e `servidor-local.mjs`. A cobertura **não inclui** `app.js` e `sw.js`, justamente as partes sem teste. Os números devem ser atualizados quando o relatório da #84 for gerado.

## 5. Lacunas conhecidas

- **`app.js`** (camada de DOM: carga do `termos.json`, montagem das três páginas, botão de tema, mapa e registro do service worker) não tem teste automatizado; as regras de cada página foram separadas em `busca.js`, `lista.js`, `ficha.js`, `tema.js` e `trilha.js`, que têm teste.
- **`sw.js`** (cache e comportamento offline) não tem teste automatizado.
- **HTML, CSS, acessibilidade e layout** dependem de verificação manual; a página Sobre tem só o teste de estrutura.
- **Integração e E2E** ainda não existem; os fluxos reais no navegador não são verificados a cada PR.
- **Os scripts de entrada do robô** (`scripts/coletar.mjs`, `scripts/coletar-dpo.mjs` e `scripts/coleta-automatica.mjs`) não têm teste próprio; os coletores e o classificador são testados sem rede, com o HTML salvo em `tests/fixtures/` e um cliente simulado do Gemini.
- **A #79 adiciona lint e limite mínimo de cobertura ao CI**; enquanto o PR não entra, o CI só roda os testes (e o teste de sabotagem).
- A mutação (#82, PR #157) roda via `npm run test:mutacao` semanalmente; a cobertura alta não garante testes bons — o escore de mutação bloqueia.
- A cobertura de 98,18% de linhas **não inclui** `app.js`, `sw.js` nem os scripts de entrada, justamente as partes sem teste.

## 6. O que cada tipo de mudança exige

| Mudança | Evidência mínima antes do merge |
|---|---|
| Nova regra ou função em `termos.js` | Teste unitário em `tests/termos.test.js` |
| Mudança em `validacao-termo.js` ou no schema | Atualizar `tests/validacao-termo.test.js`, atualizar a ADR 0004 se a regra mudar e garantir `tests/dados.test.js` verde |
| Mudança em `coleta/deduplicar.js` | Atualizar `tests/deduplicar.test.js`; rodar `npm test` |
| Mudança em `coleta/coletor-html.js`, `coleta/fontes.js` ou `coleta/classificador.js` | Atualizar `tests/coletor-html.test.js` ou `tests/classificador.test.js`, com o HTML salvo em `tests/fixtures/` ou o cliente simulado, sem acessar a rede |
| Novo termo ou edição em `frontend/data/termos.json` | `npm test` verde; conferir `fonte`, `id` único e campos obrigatórios |
| Mudança em `app.js`, HTML ou CSS | Checklist manual da seção 7; adicionar E2E quando a #78 estiver disponível |
| Mudança em `sobre/` | Atualizar `tests/sobre.test.js` e revisar o checklist manual de acessibilidade/responsividade |
| Mudança em `sw.js` ou nos arquivos do app shell | Checklist offline da seção 7 e incremento de `VERSAO_CACHE` |
| Correção de bug | Teste de regressão que falha antes da correção e passa depois |
| Apenas documentação | Nenhum teste novo; o CI ainda precisa passar |
| Biblioteca npm nova | Pôr na lista da ADR 0010, com o motivo; o `tests/fronteira-dependencias.test.js` falha se ela ficar de fora |

## 7. Checklist manual (até o E2E existir)

Para PRs que alteram tela, tema, mapa ou service worker, rodar `npm run dev` e verificar:

- [ ] **Busca:** consulta vazia, termo parcial, termo com acento (ex.: "minhocao"), prioridade de quem começa com a consulta e limite de sugestões.
- [ ] **Lista:** filtros por tipo e campus (termos `Geral` aparecem junto), filtros refletidos na URL e navegação pelo índice alfabético.
- [ ] **Página do termo:** abertura por `termo.html?id=...`, fonte exibida (clicável quando for URL), mapa quando houver `localizacao` e aviso quando estiver offline.
- [ ] **Tema:** alternância claro/escuro e persistência após recarregar.
- [ ] **Offline:** carregar online, ativar o modo offline no navegador e recarregar busca, lista e página de termo.
- [ ] **Acessibilidade:** navegação só pelo teclado, foco visível, contraste WCAG AA e textos alternativos.
- [ ] **Responsividade:** celular (≈390 px) e desktop, nos dois temas.

## 8. Convenções para escrever testes

- Arquivos em `tests/`, com nome `*.test.js`; o `node --test` os encontra automaticamente.
- Importar as funções reais de `frontend/js/`; nunca copiar a regra para o teste.
- Um comportamento por `test()`, com título descritivo em português.
- Dados sintéticos e pequenos; não usar a rede, o relógio real ou valores aleatórios.
- Usar `assert.deepEqual` para listas e objetos e `assert.equal` para valores simples.
- Testes independentes, sem estado compartilhado mutável.
- Ao corrigir um bug, escrever primeiro o teste que reproduz a falha.
- Testar o comportamento observável, não detalhes internos de implementação.

Exemplo de padrão seguido no projeto:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

import { buscarTermos } from "../frontend/js/termos.js";

test("buscarTermos prioriza quem começa com a consulta", () => {
  const termos = [
    { id: "ppaes", termo: "PPAES", tipo: "sigla", campus: "Geral" },
    { id: "pa", termo: "PA", tipo: "sigla", campus: "Geral" },
  ];

  assert.deepEqual(buscarTermos(termos, "pa").map((t) => t.id), ["pa", "ppaes"]);
});
```

## 9. CI e fluxo de PR

- **`ci.yml`:** instala as bibliotecas (`npm ci`) e roda `npm test` e `npm run test:sabotagem` em todo `pull_request` e em push na `main`, com Node 24. Com a #79, passa a rodar também `npm run lint` e `npm run test:cobertura`.
- **`pages.yml`:** em push na `main`, roda `npm ci` e `npm test` e só publica as duas páginas se tudo passar. Teste vermelho significa **nada publicado**.
- **`sonar.yml`:** em todo PR e push na `main`, roda os testes com cobertura e manda o relatório para o SonarQube Cloud.
- **`mutacao.yml`:** semanalmente (segunda, 06h de Brasília) e com disponibilidade manual; roda o StrykerJS nos módulos de domínio e do pipeline e falha abaixo de 70% no domínio e de 50% na coleta; detalhes em [TESTE-DE-MUTACAO.md](TESTE-DE-MUTACAO.md).
- **No PR:** CI verde, revisão registrada e testes correspondentes à mudança. O revisor confere se o comportamento novo ou corrigido tem evidência automatizada.
- **Falha de dados:** a mensagem indica o item do arquivo, por exemplo `termo #12 (ru): campo obrigatório ausente ou vazio: fonte`.

## 10. Evolução planejada

| Issue | Entrega | Efeito nesta estratégia |
|---|---|---|
| #78 | Playwright + axe-core no CI | Cobre fluxos reais e acessibilidade; reduz o checklist manual |
| #80 | Lighthouse CI nos PRs | Mede desempenho, acessibilidade e boas práticas |
| #81 | Cenários Gherkin executáveis | Liga critérios de aceitação às histórias |
| #82 | StrykerJS nos módulos de domínio | Exige escore de mutação ≥ 70% e revela testes fracos |
| #84 | Relatório de testes e cobertura | Atualiza os números desta página e o material da R2 |
| #79 | Lint e cobertura mínima no CI | Impede regressão de estilo e de cobertura |

Quando cada item entrar, esta página deve ser atualizada com a nova camada, o comando e a situação real.

## 11. Referências

- [`docs/adr/0002-frontend-sem-framework.md`](adr/0002-frontend-sem-framework.md) — domínio separado da tela e sem dependências.
- [`docs/adr/0004-schema-unico-do-termo.md`](adr/0004-schema-unico-do-termo.md) — schema único e validação usada no CI.
- [`docs/adr/0007-github-pages-e-ci-com-actions.md`](adr/0007-github-pages-e-ci-com-actions.md) — CI e publicação condicionada aos testes.
- [`docs/adr/0010-bibliotecas-nos-scripts-do-robo.md`](adr/0010-bibliotecas-nos-scripts-do-robo.md) — bibliotecas npm só no robô e nos testes dele.
- [`docs/skills/github-actions-e-testes.md`](skills/github-actions-e-testes.md) — introdução a GitHub Actions e `node:test`.
- `tests/`, `.github/workflows/ci.yml`, `.github/workflows/pages.yml`, `.github/workflows/sonar.yml` e `.github/workflows/mutacao.yml` — implementação atual.
- `scripts/verificar-mutacao.mjs` — checagem dos escores mínimos de mutação (70% no domínio, 50% na coleta).

## Revisão

- [ ] Revisado por: _______ (preencher no PR)
