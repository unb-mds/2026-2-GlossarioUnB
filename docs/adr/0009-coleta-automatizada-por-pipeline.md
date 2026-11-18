# ADR 0009 — Coleta automatizada de termos por pipeline com PR revisado

## Status
Aceito no Encontro 1 do G10 (11/11/2026), com os 5 integrantes; registro em [`docs/scrum/dailies.md`](../scrum/dailies.md).

## Contexto
- **Hoje cada termo entra à mão.** O `frontend/data/termos.json` tem 41 termos (40 siglas e 1 gíria), todos vindos da planilha colaborativa (ADR 0001).
- **Crítica central da R1 (professora, 30/09):** "isso aí tinha que ser um robô", "vocês não fizeram trabalho de ver quais são as fontes de dados" e "a complexidade não vai estar no front, vai estar no maquinário". A #53 responde às críticas 2 e 3 da R1 e à aula de 30/09, em que uma decisão de arquitetura tomada pelo agente de IA passou sem ninguém perceber. Por isso esta fica registrada antes do código.
- **Referência indicada pela professora (07/10):** [GovHub-br/dados-desestruturados](https://github.com/GovHub-br/dados-desestruturados). Ele separa o que extrair de onde está, guarda a evidência de cada dado e só publica depois de uma validação determinística.
- **Fontes testadas:** as páginas de [decanatos](https://www.unb.br/administrativo-rodape/decanatos) e de [secretarias](https://www.unb.br/administrativo-rodape/secretarias) da UnB trazem cada sigla como "Nome (SIGLA)" num link, o que permite ler sem LLM. A Lista de Siglas em PDF da DPO é a #55.

## Decisão
- Um **pipeline no GitHub Actions** lê as fontes de `coleta/fontes.json` (URL, tipo, regras de extração), extrai os candidatos com a proveniência de cada um (URL, trecho e data da coleta) e os compara com o `termos.json` atual, separando novos, alterados e conflitos.
- O resultado passa pela mesma `validarGlossario()` do CI (ADR 0004 e ADR 0007) e vira um **Pull Request automático**. Nada entra direto na `main`: uma pessoa revisa cada termo e escreve a definição e o exemplo antes do merge.
- **Na Release 2:** o pipeline inteiro, como combinado no Encontro 1: coletor de HTML (#56) com as duas páginas acima e as fontes novas da #61, deduplicação (#57), coletor do PDF da DPO (#55), workflow que abre o PR (#59), categorização e redação assistidas por LLM (#58) e a coleta real (#62), tudo na `main` até 17/11. O LLM só sugere a categoria, o tipo e rascunhos da definição e do exemplo, e cada termo chega ao PR marcado como "revisar": a deduplicação continua determinística, e quem decide e escreve o texto final de cada termo é o revisor do PR.

## Alternativas descartadas
- **Planilha manual.** Depende de alguém lembrar de preencher, e a R1 terminou com 41 termos.
- **Crawler amplo de "todos os sites da UnB".** Traz muito ruído e é caro de manter, porque cada site tem um layout diferente. A lista curada em `coleta/fontes.json` diz exatamente de onde cada termo vem.
- **Backend com banco de dados.** Contraria a ADR 0001 (termos em JSON estático) e a ADR 0007 (site no GitHub Pages, sem servidor), e a revisão por PR já faz o papel de moderação.
- **Copiar um único site.** Fica com uma fonte só: se ela mudar ou sair do ar, a coleta para inteira.

## Consequências
- (+) Cada termo novo chega com a fonte e o trecho de onde saiu, o que responde ao "ver quais são as fontes de dados".
- (+) O Git continua sendo o banco (ADR 0001): todo termo tem histórico, autoria e revisão.
- (−) **Manutenção dos coletores:** quando uma página da UnB muda de layout, a regra de extração em `coleta/fontes.json` precisa mudar junto.
- (−) **Revisão humana obrigatória:** o robô propõe, mas a definição e o exemplo de cada termo ainda são escritos e conferidos por uma pessoa, o que pode virar gargalo.
- (−) **Custo e limites da API do LLM** na categorização e redação assistidas (#58): chave guardada como segredo do repositório, nunca no front.
- (−) Para o workflow abrir PR, o repositório precisa permitir que o GitHub Actions crie Pull Requests (Settings → Actions → General → Workflow permissions).
