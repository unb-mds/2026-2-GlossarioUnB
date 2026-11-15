# ADR 0010 — Bibliotecas npm nos scripts do robô de coleta

## Status
Proposta em 13/11/2026 pelo Pedro; a aprovação deste PR é a decisão do grupo. Discussão no Telegram (tópico G10) e no Encontro 2 (16/11).

## Contexto
- **A ADR 0002 foi escrita para o front da R1:** "sem etapa de build e sem dependências npm em tempo de execução". O robô de coleta (ADR 0009) não existia, e mesmo assim seguiu a mesma regra.
- **Crítica da professora (R1, 30/09):** "a complexidade não vai estar no front, vai estar no maquinário". O maquinário é o robô.
- **A issue #56 sugere o `cheerio`** para ler as páginas. Sem ele, o coletor lê o HTML com expressão regular, que depende de cada `<a>` ter o seu `</a>` e de uma tabela de entidades feita à mão.
- **O leitor de robots.txt feito à mão não trata os curingas `*` e `$`**, e isso está escrito no próprio código. Uma regra `Disallow: /*.pdf$` passaria despercebida.
- **A #58 precisa falar com a API do Gemini**, com resposta em JSON que siga um schema.

## Decisão
- **Alcance:** bibliotecas npm liberadas só em `coleta/`, `scripts/` e nos testes deles. O front (`frontend/`, `sobre/`) continua como a ADR 0002 e a ADR 0008 dizem: sem framework, sem build e sem dependência.
- **Lista fechada, com o motivo de cada uma:**
  - `cheerio`: lê o HTML das páginas da UnB com um parser de verdade e seletores CSS.
  - `robots-parser`: lê o robots.txt com curingas, no lugar de ~50 linhas próprias.
  - `@google/genai`: o SDK oficial do Gemini, usado só pelo script da #58.
- **Biblioteca nova:** entra só atualizando esta lista no mesmo PR, com o motivo.
- **`package-lock.json` versionado** e `npm ci` no CI, para todo mundo instalar as mesmas versões.
- **Os testes continuam com `node:test`.** Nenhuma biblioteca de teste.
- **A regra tem teste:** `tests/fronteira-dependencias.test.js` falha se um arquivo do front importar um pacote npm ou se o `package.json` tiver uma dependência fora da lista.

## Alternativas descartadas
- **Manter tudo puro.** Funciona hoje, mas deixa o robô com o parser e o robots.txt mais frágeis que existem, para manter na mão.
- **Liberar também um framework no front agora.** É a outra pergunta da rediscussão das ADRs; não cabe até 17/11, e o front não tem etapa de build.
- **jsdom ou navegador sem cabeça (Puppeteer).** Pesados demais para páginas estáticas.
- **Chamar o Gemini por `fetch`, sem SDK.** Funciona e é o plano B; o SDK oficial já pede a resposta em JSON com schema.

## Consequências
- (+) Menos código próprio para manter, e o HTML é lido por um parser de verdade.
- (+) A regra de onde pode haver biblioteca tem teste, então não depende de alguém lembrar.
- (−) É a primeira dependência do projeto: passa a existir `npm ci`, um lockfile e atualização de versões.
- (−) Superfície de ataque na cadeia de dependências (supply chain). Por isso a lista é fechada e curta.
- (−) O `README.md` e a ADR 0007 dizem "sem dependências" no sentido do front e dos testes do front, o que continua verdade; mas quem clona e vai rodar o robô precisa rodar `npm ci` antes.
