# Teste de mutação

O teste de mutação responde a uma pergunta que a cobertura não responde: **os testes percebem quando o código está errado?** O [StrykerJS](https://stryker-mutator.io/) cria cópias do código com um defeito pequeno de cada vez (um `>` vira `>=`, um `&&` vira `||`, um texto vira vazio) e roda a suíte em cada cópia. Se algum teste falha, o mutante **morreu** (bom). Se todos passam, o mutante **sobreviveu**: existe um defeito que a suíte não vê.

> escore de mutação = mutantes mortos ÷ mutantes totais

A meta do plano de ensino é **≥ 50%**; a issue #82 pede **≥ 70% nos módulos de domínio**.

## Como rodar

```sh
npm ci
npm run test:mutacao
```

Leva uns 5 minutos (cerca de 1.300 mutantes, a suíte inteira rodando para cada um). O terminal mostra o escore por arquivo e os mutantes sobreviventes; o relatório navegável fica em `reports/mutation/index.html` (a pasta não vai para o Git).

A configuração está em `stryker.config.json`. O Stryker não tem executor próprio para o `node:test`, então usa o executor `command`, que roda `node --test` (ADR 0010: sem plugin). Efeito: cada mutante roda a suíte toda (`coverageAnalysis: "off"`), o que é lento, mas simples.

## O que é mutado

- Domínio: `frontend/js/termos.js`, `validacao-termo.js`, `busca.js`, `lista.js`, `ficha.js`, `tema.js`, `trilha.js`.
- Pipeline: `coleta/*.js`.
- Fora: `app.js` (monta o DOM; a #78 cobre no navegador) e `scripts/` (só ligam as peças).

## Escore (20/11/2026)

Primeira medição (antes) e depois dos 14 testes novos. Tempo: 5 min 12 s e 5 min 20 s num Mac com 4 processos em paralelo.

| Grupo / arquivo | Antes | Depois |
|---|---|---|
| **Todos** | 86,65% | 90,90% |
| **Domínio** (`frontend/js`) | 88,18% | 99,20% |
| `termos.js` | 97,00% | 100% |
| `validacao-termo.js` | 75,47% | 100% |
| `busca.js` | 92,98% | 98,25% |
| `lista.js`, `ficha.js`, `tema.js` | 100%, 100%, 95,24% | 100% cada |
| `trilha.js` | 86,36% | 96,59% |
| **Pipeline** (`coleta/`) | 85,70% | 85,70% |
| `classificador.js` | 84,24% | 84,24% |
| `cliente-gemini.js` | 91,30% | 91,30% |
| `coletor-html.js` | 81,87% | 81,87% |
| `deduplicar.js` | 86,70% | 86,70% |
| `fontes.js` | 88,43% | 88,43% |

Os 4 sobreviventes do domínio são equivalentes (abaixo). No pipeline sobraram 114, a maioria texto de mensagem e lista de palavras vazias; já passa da meta e não foi mexido.

## Como ler um mutante sobrevivente

1. Abra o relatório e veja a linha e o que mudou.
2. Pergunte: **se o código fosse assim, o produto estaria errado?** Se sim, falta um teste: escreva o que quebra com aquela mudança (limite, mensagem exata, caso vazio).
3. Se não (o comportamento é o mesmo), o mutante é **equivalente**: não há teste que o mate. Não force o escore; anote o motivo.

Equivalentes comuns neste projeto:

- `?? []` trocado por `?? ["Stryker was here"]` quando o item falso é descartado logo depois (`trilha.js`, `montarTrilha`/`termosDaTrilha`).
- `indiceAtivo >= 0` trocado por `true` em `busca.js`: um vetor não tem posição `-1`, o resultado é o mesmo.
- Funções que só esperam de verdade (`setTimeout`, `esperarDeVerdade`) trocadas por funções vazias: os testes injetam a espera; testar a espera real deixaria a suíte lenta.
- Textos de mensagens que só aparecem para quem lê o terminal do robô (`classificador.js`, `fontes.js`, `deduplicar.js`): morreriam com testes de texto exato, que quebram a cada ajuste de redação. Ficam como aceitos.

## Diferença para o teste de sabotagem

O teste de sabotagem (#146) troca à mão trechos escolhidos e roda no CI. A mutação cria centenas de defeitos sozinha e demora minutos; por isso é um comando à parte, que não roda no `npm test`.
