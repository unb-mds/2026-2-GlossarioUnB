# ADR 0010 — Bibliotecas npm nos scripts do robô de coleta e nos testes

## Status
Proposta em 13/11/2026 pelo Pedro; a aprovação deste PR é a decisão do grupo. Discussão no Telegram (tópico G10) e no Encontro 2 (16/11).

Atualizada em 18/11/2026 pelo Pedro: libera as bibliotecas de teste e de qualidade, numa segunda lista fechada (seção "Bibliotecas de desenvolvimento").

## Contexto
- **A ADR 0002 foi escrita para o front da R1:** "sem etapa de build e sem dependências npm em tempo de execução". O robô de coleta (ADR 0009) não existia, e mesmo assim seguiu a mesma regra.
- **Crítica da professora (R1, 30/09):** "a complexidade não vai estar no front, vai estar no maquinário". O maquinário é o robô.
- **A issue #56 sugere o `cheerio`** para ler as páginas. Sem ele, o coletor lê o HTML com expressão regular, que depende de cada `<a>` ter o seu `</a>` e de uma tabela de entidades feita à mão.
- **O leitor de robots.txt feito à mão não trata os curingas `*` e `$`**, e isso está escrito no próprio código. Uma regra `Disallow: /*.pdf$` passaria despercebida.
- **A #58 precisa falar com a API do Gemini**, com resposta em JSON que siga um schema.
- **Atualização de 18/11:** a versão de 13/11 dizia "nenhuma biblioteca de teste". Três issues da R2 precisam de uma:
  - a **#78** (testes ponta a ponta e auditoria de acessibilidade) precisa de um navegador de verdade, e é ela que mede o RNF01, o RNF03 e o RNF04;
  - a **#82** (teste de mutação) precisa de uma ferramenta que crie os defeitos sozinha e calcule o escore;
  - o **#120** (lint no CI) traz o ESLint como `devDependency`, e o teste da fronteira barrava qualquer `devDependency`.

## Decisão
- **Alcance:** bibliotecas npm liberadas só em `coleta/`, `scripts/` e nos testes deles. O front (`frontend/`, `sobre/`) continua como a ADR 0002 e a ADR 0008 dizem: sem framework, sem build e sem dependência.
- **Lista fechada, com o motivo de cada uma:**
  - `cheerio`: lê o HTML das páginas da UnB com um parser de verdade e seletores CSS.
  - `robots-parser`: lê o robots.txt com curingas, no lugar de ~50 linhas próprias.
  - `@google/genai`: o SDK oficial do Gemini, usado só pelo script da #58.
- **Biblioteca nova:** entra só atualizando esta lista no mesmo PR, com o motivo.
- **`package-lock.json` versionado** e `npm ci` no CI, para todo mundo instalar as mesmas versões.
- **Os testes de unidade continuam com `node:test`.**

### Bibliotecas de desenvolvimento (atualização de 18/11)
- **Onde:** só em `devDependencies`. Elas rodam no CI e na máquina de quem desenvolve. O site publicado não carrega nenhuma, e o robô agendado pode instalar sem elas (`npm ci --omit=dev`).
- **Lista fechada, com o motivo de cada uma:**
  - `@playwright/test`: testes ponta a ponta no navegador (#78). É a cobertura da camada de tela.
  - `@axe-core/playwright`: auditoria WCAG 2.1 AA dentro dos testes do Playwright, nos temas claro e escuro (#78, RNF03).
  - `@stryker-mutator/core`: teste de mutação (#82). Roda o `npm test` pelo executor `command`, que já vem nele, sem plugin.
  - `eslint`, `@eslint/js` e `globals`: lint no CI (#120).
- **Biblioteca nova** (de qualquer uma das duas listas): entra só atualizando a lista certa no mesmo PR, com o motivo. Um plugin do Stryker, por exemplo, segue essa regra.
- **O limite do escore de mutação** não é decidido aqui: fica na #82.

### A regra tem teste
`tests/fronteira-dependencias.test.js` falha se:
- um arquivo do front importar um pacote npm;
- o `package.json` tiver uma dependência fora da primeira lista (uma biblioteca de teste em `dependencies` também falha);
- o `package.json` tiver uma `devDependency` fora da segunda lista.

## Alternativas descartadas
- **Manter tudo puro.** Funciona hoje, mas deixa o robô com o parser e o robots.txt mais frágeis que existem, para manter na mão.
- **Liberar também um framework no front agora.** É a outra pergunta da rediscussão das ADRs; não cabe até 17/11, e o front não tem etapa de build.
- **jsdom ou navegador sem cabeça (Puppeteer) para o robô ler as páginas.** Pesados demais para páginas estáticas. O Playwright da atualização de 18/11 roda só nos testes, nunca no robô.
- **Liberar qualquer `devDependency` (18/11).** É mais simples, mas perde o controle da cadeia de dependências que a lista fechada dá, e o teste da fronteira deixaria de proteger alguma coisa.
- **Testar a tela e a mutação sem biblioteca (18/11).** O teste de sabotagem cobre defeitos escolhidos à mão, mas não cria mutantes sozinho nem roda um navegador. Testes ponta a ponta e a auditoria do axe-core precisam de um navegador.
- **Chamar o Gemini por `fetch`, sem SDK.** Funciona e é o plano B; o SDK oficial já pede a resposta em JSON com schema.

## Consequências
- (+) Menos código próprio para manter, e o HTML é lido por um parser de verdade.
- (+) A regra de onde pode haver biblioteca tem teste, então não depende de alguém lembrar.
- (−) É a primeira dependência do projeto: passa a existir `npm ci`, um lockfile e atualização de versões.
- (−) Superfície de ataque na cadeia de dependências (supply chain). Por isso a lista é fechada e curta.
- (−) O `README.md` e a ADR 0007 dizem "sem dependências" no sentido do front e dos testes do front, o que continua verdade; mas quem clona e vai rodar o robô precisa rodar `npm ci` antes.
- (+) A #78, a #82 e o #120 entram sem mudar esta ADR de novo, e o teste da fronteira continua barrando o resto.
- (−) O CI fica mais lento. O Playwright baixa um navegador (`npx playwright install --with-deps chromium`), e a mutação roda a suíte muitas vezes. Se ela entra em todo PR ou roda à parte, a #82 decide.
- (−) Mais pacotes para atualizar e auditar, mesmo só no desenvolvimento.
