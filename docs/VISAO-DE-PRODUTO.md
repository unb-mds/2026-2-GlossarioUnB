# Visão de Produto — Glossário UnB

> **Versão:** 1.0 · **Data:** 17/11/2026 · **Issue:** [#68](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/68) · **Release:** R2 (25/11/2026)
>
> **Status:** documento de produto da R2. As histórias apontam para as issues que as implementam; a constituição citada ainda é o rascunho do [PR #32](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/32).

## 1. Problema

Quem chega à UnB encontra siglas, gírias e expressões que não existem fora da universidade: **DEG**, **BCE**, **FGA/FCTE**, **RU**, **SIGAA**, "menção SR", "trancamento geral". A explicação costuma estar espalhada em PDFs, sites de decanatos e secretarias, grupos de WhatsApp e na memória de veteranos. Muitas vezes, o texto que explica o termo usa outro jargão.

O resultado é sempre o mesmo: o calouro perde tempo procurando, pergunta a um veterano ou desiste de entender. Na R1, a professora resumiu a crítica: **"não é para a disciplina, é um produto de software, quem pagaria por isso?"** e **"você vai dar para ele de mão beijada o básico: o que é RU..."** ([#49](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/49)).

O Glossário UnB existe para responder a uma pergunta simples, em segundos: **"o que significa este termo da UnB?"**

## 2. Personas

As personas abaixo vêm do story map/Figma do projeto e da [página Sobre](../sobre/index.html). A perspectiva **Visitante** é quem consulta; a perspectiva **Time** é quem mantém e contribui.

### 2.1 Calouro que acabou de chegar (persona principal)

- **Contexto:** primeira semana, celular na mão, muitos termos novos ao mesmo tempo.
- **Precisa:** entender RU, BCE, SIGAA, menções e trancamento sem depender de outra pessoa.
- **Dor:** a informação está espalhada e usa mais jargão para explicar o jargão.
- **Sucesso:** encontra o termo em poucos segundos, entende a definição e vê um exemplo de uso.

### 2.2 Calouro que voltou a estudar

- **Contexto:** voltou depois de um tempo longe da universidade; pode estar no computador ou no celular.
- **Precisa:** de explicações em português simples, sem pressupor que ele já conhece a estrutura da UnB.
- **Dor:** os sistemas e documentos institucionais pressupõem um vocabulário que ele não tem.
- **Sucesso:** entende o termo na primeira leitura e sabe onde encontrar a fonte oficial.

### 2.3 Veterano com uma dúvida

- **Contexto:** já conhece o campus, mas esqueceu ou quer confirmar uma sigla, um apelido ou uma regra.
- **Precisa:** de uma resposta rápida, com a fonte, para não passar informação errada adiante.
- **Dor:** a busca no site da UnB ou no PDF da DPO não é rápida e nem sempre está atualizada.
- **Sucesso:** confirma o significado e a fonte em uma consulta.

### 2.4 Time e comunidade (perspectiva Time)

- **Contexto:** pessoas que revisam PRs, mantêm o dataset e contribuem com termos.
- **Precisa:** de um fluxo de contribuição claro, validação automática e dados rastreáveis.
- **Dor:** planilha manual, termos sem fonte e retrabalho na revisão.
- **Sucesso:** um PR automático chega com a fonte, o CI valida e uma pessoa revisa antes do merge.

## 3. Proposta de valor

**As siglas da UnB, explicadas em português simples, com exemplo de uso e fonte, no celular e offline.**

Os pilares do produto:

1. **Simples:** definição curta, exemplo real e nada de jargão para explicar jargão.
2. **Confiável:** todo termo tem `fonte` e passa pela validação do glossário; a origem fica visível.
3. **Rápido e offline:** busca com sugestões, PWA e consulta mesmo sem internet depois da primeira visita.
4. **Aberto:** qualquer pessoa pode sugerir um termo; o time revisa e publica.
5. **Rastreável:** cada termo, requisito e decisão aponta para a issue, o PR e o teste que o sustentam.

## 4. Alternativas que o estudante usa hoje

| Alternativa | O que resolve | Limitação para o calouro |
|---|---|---|
| PDF da Lista de Siglas da DPO | Reúne siglas oficiais | É um PDF longo, pouco pesquisável no celular e nem sempre está atualizado |
| Sites de decanatos, secretarias e unidades | Têm a definição oficial | Cada site tem um layout e uma URL diferente; a informação fica espalhada |
| Grupos de WhatsApp/Telegram | Resposta rápida de veteranos | A resposta pode estar errada, desatualizada ou se perder na conversa |
| Perguntar a um veterano | Funciona para quem tem contato | Cria dependência de outra pessoa e não escala para todos os calouros |
| SIGAA, Matrícula Web, Aprender 3 | São os sistemas oficiais | Não são glossários: explicam o fluxo, não o vocabulário |
| Busca no Google ou em redes sociais | Às vezes encontra algo | O resultado pode ser antigo, sem fonte ou de outra universidade |
| Planilha colaborativa da R1 | Foi a base inicial do dataset | Processo manual, sem validação automática e sem revisão por PR |

O diferencial do Glossário UnB é juntar **curadoria, linguagem simples, fonte e revisão** num só lugar, com uma experiência de consulta pensada para o celular.

## 5. Quem adotaria ou patrocinaria

Estes são **potenciais** adotantes ou patrocinadores, não compromissos firmados. A validação com pessoas de fora do grupo está prevista na [#75](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/75) e na [#76](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/76).

| Quem | Como poderia usar | O que ganharia |
|---|---|---|
| **DEG/DAC** (Decanato de Ensino de Graduação / Diretoria de Acompanhamento e Apoio ao Estudante) | Link no acolhimento de calouros e na semana de boas-vindas | Menos dúvidas repetidas sobre o vocabulário básico da UnB |
| **Secom** (Secretaria de Comunicação) | Divulgação institucional e link em materiais de comunicação | Um canal simples e confiável para explicar siglas e expressões da universidade |
| **Semana de boas-vindas / centros acadêmicos / DCE** | Material de onboarding e grupos de calouros | Um recurso pronto para o calouro consultar sozinho |
| **Unidades, decanatos e secretarias** | Glossário de siglas e expressões da própria área | Padronização do vocabulário e da fonte |
| **Professores e disciplinas** | Uso em sala, em projetos e como exemplo de software livre | Um produto real para atividades de ensino e extensão |
| **Comunidade open source** | Contribuição de termos e correções | Um projeto aberto, com processo de revisão e documentação |

## 6. Métricas de sucesso

As metas abaixo usam os RNFs e as issues da R2. Elas não substituem os critérios de aceitação de cada issue.

| Métrica | Meta | Como verificar | Referência |
|---|---|---|---|
| Qualidade dos dados | 100% dos termos com `fonte` e `tipo` válidos; 0 links de fonte quebrados | `npm test` e verificação periódica das fontes | RNF05, [#60](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60) |
| Consulta offline | Depois da primeira visita, consultar termos sem rede | Teste E2E offline | RNF01, [#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78) |
| Desempenho | Lighthouse Performance ≥ 90 na página inicial | Lighthouse CI | RNF02, [#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80) |
| Acessibilidade | Lighthouse Acessibilidade ≥ 95; WCAG 2.1 AA | Lighthouse e axe-core | RNF03, [#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78) e [#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80) |
| Cobertura | ≥ 90% de linhas nos módulos de domínio e do pipeline | Cobertura mínima no CI | RNF06, [#79](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79) |
| Pipeline real | Pelo menos uma coleta real revisada, com os números registrados | PR do robô revisado e mergeado | [#59](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/59) e [#62](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/62) |
| Usabilidade | **Meta proposta:** 4 de 5 calouros encontram o termo pedido sem ajuda, em até 30 s | Teste com 5 calouros | [#76](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/76) |
| Adoção | **Meta proposta:** mapear 3 potenciais adotantes e registrar o retorno de pelo menos 1 | Conversas e retorno registrado | [#75](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/75) e [#76](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/76) |
| Release | v2.0.0 publicada com notas e CHANGELOG | GitHub Releases | [#96](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/96) |

## 7. O que o produto é e o que não é

Este documento incorpora o rascunho da constituição do [PR #32](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/32) enquanto ele não está na `main`. Quando a constituição for aprovada, este trecho pode apontar para `specs/constitution.md`.

**O Glossário UnB é:**

- um dicionário colaborativo e aberto da UnB;
- uma ferramenta de utilidade pública, feita para calouros, veteranos, professores, técnicos e visitantes;
- uma PWA de consulta rápida, responsiva e offline;
- um ecossistema de contribuição para quem usa Git e para quem só sabe usar o navegador;
- uma base estruturada e verificável, com fonte em todo termo;
- um projeto de engenharia com foco em acessibilidade e qualidade.

**O Glossário UnB não é:**

- um substituto do SIGAA, Matrícula Web, Aprender 3 ou SEI;
- uma rede social, fórum ou espaço de comentários;
- uma plataforma com login ou cadastro obrigatório;
- um espaço para fofocas, ofensas ou dados pessoais;
- um dicionário geral da língua portuguesa;
- uma aplicação pesada, com backend ou infraestrutura desnecessária.

## 8. Histórias de usuário e critérios de aceitação (Gherkin)

As histórias abaixo cobrem os cinco épicos da R2. Cada uma cita as issues que a implementam ou detalham; os números são a rastreabilidade pedida na [#68](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/68).

### US01 — Coleta automatizada com PR revisado (E1)

**Como** mantenedor do glossário, **quero** que termos novos cheguem por um Pull Request automático, com a fonte de cada um, **para** não depender de alguém preenchendo uma planilha.

```gherkin
Cenário: termo novo encontrado em uma fonte oficial
  Dado que uma fonte configurada em coleta/fontes.json tem um termo que ainda não está no glossário
  Quando o workflow agendado roda a coleta
  Então o pipeline abre um Pull Request com o termo, a fonte e o trecho de onde ele saiu
  E a validação do glossário roda nesse Pull Request
  E o termo só entra na main depois da revisão de uma pessoa

Cenário: termo que já existe no glossário
  Dado que o termo coletado já está no termos.json
  Quando o pipeline compara os candidatos
  Então ele não abre uma duplicata
  E registra o conflito para a revisão humana
```

**Rastreabilidade:** [#47](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/47), [#52](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/52), [#56](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/56), [#57](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/57), [#58](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/58), [#59](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/59), [#62](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/62); ADR 0009.

### US02 — Encontrar o termo pelo nome antigo e ver relacionados (E2)

**Como** calouro, **quero** encontrar um termo pelo nome que as pessoas usam, inclusive nomes antigos como FGA, e ver termos do mesmo contexto, **para** entender a sigla e não só ler uma definição solta.

```gherkin
Cenário: busca por um nome antigo
  Dado que "FGA" é um sinônimo de "FCTE" no glossário
  Quando o calouro busca "FGA"
  Então o glossário mostra o termo "FCTE" com o significado
  E exibe "Veja também" com termos do mesmo contexto
```

**Rastreabilidade:** [#48](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/48), [#63](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/63), [#64](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/64), [#66](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/66); RF02 e RF09.

### US03 — Primeiros passos na UnB (E3)

**Como** calouro na primeira semana, **quero** ver logo de cara os termos que todo mundo usa — RU, BCE, SIGAA, menções, trancamento —, **para** não depender de perguntar a um veterano.

```gherkin
Cenário: calouro abre o glossário na primeira semana
  Dado que o calouro acessa a página inicial
  Quando ele ainda não conhece as siglas da UnB
  Então vê a trilha "Primeiros passos na UnB" com os termos essenciais
  E consegue abrir o significado e o exemplo de uso de cada um
```

**Rastreabilidade:** [#49](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/49), [#69](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/69), [#70](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/70); RF02.

### US04 — Sugerir um termo sem usar Git (E3)

**Como** pessoa que usa o glossário, mas não tem prática com Git, **quero** sugerir um termo ou uma correção por um formulário no GitHub, **para** contribuir sem precisar entender de branch e Pull Request.

```gherkin
Cenário: sugestão de um termo novo
  Dado que a pessoa sabe usar o navegador, mas não usa Git
  Quando ela abre o formulário "Adicionar termo" e preenche os campos
  Então a sugestão vira uma issue pública com o termo, o significado, o exemplo e a fonte
  E a equipe revisa antes de publicar
```

**Rastreabilidade:** [#49](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/49), [#71](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/71), [#72](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/72); RF04 e RF10; ADR 0006.

### US05 — Qualidade e segurança no CI (E4)

**Como** mantenedor, **quero** que todo PR rode testes, lint e checagens de acessibilidade, desempenho e segurança, **para** que nenhuma mudança quebre o glossário sem o time perceber.

```gherkin
Cenário: PR com mudança no glossário
  Dado que uma pessoa abre um Pull Request
  Quando o CI roda
  Então os testes de domínio, a validação do schema, o lint e a cobertura mínima são executados
  E o PR falha se acessibilidade, desempenho ou segurança ficarem abaixo do critério
  E o merge só é liberado com o CI verde e uma revisão
```

**Rastreabilidade:** [#50](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/50), [#43](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/43), [#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78), [#79](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79), [#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80), [#81](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/81), [#82](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/82), [#83](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83), [#84](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/84); RNF02 a RNF07.

### US06 — Rastrear decisões e requisitos (E5)

**Como** avaliador ou novo contribuidor, **quero** rastrear cada decisão do time, de épico até issue, PR e teste, **para** entender o projeto lendo só o repositório.

```gherkin
Cenário: avaliador segue a trilha de uma decisão
  Dado que o avaliador está lendo o repositório
  Quando ele abre um requisito ou uma história de usuário
  Então encontra o vínculo com a issue, o Pull Request e o teste que a implementam
  E consegue chegar à sprint e à ata em que a decisão foi tomada
```

**Rastreabilidade:** [#51](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/51), [#73](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/73), [#88](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/88), [#42](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/42), [#89](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/89) a [#93](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/93), [#96](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/96).

## 9. Referências

- [Requisitos do sistema](REQUISITOS.md) — RF01 a RF10 e RNF01 a RNF07.
- [Story map e Figma](storymap/story-map.png) e [link do Figma](storymap/link_figma.txt).
- [ADR 0009 — coleta automatizada por pipeline](adr/0009-coleta-automatizada-por-pipeline.md).
- [Página Sobre](../sobre/index.html) e [README](../README.md).
- Épicos: [#47](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/47), [#48](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/48), [#49](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/49), [#50](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/50) e [#51](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/51).
- Rascunho da constituição: [PR #32](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/32).

## 10. Manutenção

Este documento é vivo. Atualizar quando:

- a [#69](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/69) fechar a lista de termos da trilha do calouro;
- a [#70](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/70) implementar a trilha no app;
- a [#73](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/73) reescrever os requisitos e criar a matriz de rastreabilidade;
- o [PR #32](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/32) da constituição for aprovado e entrar na `main`.
