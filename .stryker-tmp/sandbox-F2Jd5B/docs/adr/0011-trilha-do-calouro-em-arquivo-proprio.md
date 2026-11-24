# ADR 0011 — Trilha do calouro num arquivo próprio

## Status
Decidida em 17/11/2026 pelo Pedro, responsável pelas issues #69 e #70. A revisão do PR da #70 é a validação do grupo.

## Contexto
- **A #70 pede uma seção "Primeiros passos na UnB" na página inicial**, com pelo menos 15 termos agrupados pelo que o calouro precisa fazer (onde comer e estudar, notas, sistemas, matrícula e trancamento, apoio estudantil), "gerada a partir dos dados, sem lista fixa no HTML", e que funcione offline.
- **A issue sugeria um "campo `trilha_calouro` (ordem) nos dados"**, mas a trilha precisa de três coisas: quais termos entram, em que grupo e em que ordem. Um número só não diz o grupo.
- **A taxonomia de categorias (#63) ainda não existe.** Os grupos da trilha são por necessidade ("Onde comer"), não por categoria.
- **O PR #98 (#64, evolução do schema) muda o `termos.json` e o `validacao-termo.js`.** O `termos.json` da `main` usa fim de linha CRLF e o do #98 usa LF, então qualquer outra mudança nesse arquivo já vai dar conflito com ele.

## Decisão
A trilha fica em **`frontend/data/trilha-calouro.json`**: uma lista de grupos, na ordem em que aparecem, cada um com `id`, `nome` e a lista de **ids** dos termos, também na ordem.

```json
{ "grupos": [ { "id": "notas", "nome": "Notas", "termos": ["mencao", "sr", "ira"] } ] }
```

- Os dados do termo continuam **só** no `termos.json`, e o schema do termo (ADR 0004) não muda.
- **Integridade referencial:** `tests/trilha.test.js` falha se a trilha citar um id que não existe no `termos.json`, se um termo aparecer duas vezes, se um grupo ficar vazio, se a trilha tiver menos de 15 termos ou se um termo dela não tiver categoria e fonte `https://*.unb.br`.
- **Na página**, `montarTrilha` (em `frontend/js/trilha.js`, função pura testada no Node) troca os ids pelos termos. Um id que não existe é pulado, e um grupo vazio some, em vez de quebrar a seção.
- **Offline:** o arquivo é pré-cacheado e tratado como dado no `sw.js` (stale-while-revalidate, como o `termos.json`). O cache foi para a v14.

## Alternativas descartadas
- **Um objeto `trilha_calouro: { grupo, ordem }` dentro de cada termo.** É o mais perto do texto da issue, mas muda o schema do termo e os arquivos do #98, e o nome do grupo se repetiria em cada termo (um erro de digitação criaria um grupo novo).
- **Só um número `trilha_calouro` em cada termo, com o grupo vindo da `categoria`.** Os grupos por necessidade sumiriam, e a trilha passaria a depender da taxonomia da #63, que ainda não existe (acoplamento).
- **A lista escrita no `index.html`.** A issue proíbe ("sem lista fixa no HTML"), e quem quisesse mudar a trilha teria que mexer em código.

## Consequências
- (+) Mudar a trilha é editar um arquivo pequeno, sem tocar nos termos nem no código.
- (+) A regra "todo id da trilha existe" tem teste, então não depende de alguém lembrar.
- (−) São dois arquivos que precisam concordar. Renomear o `id` de um termo exige atualizar a trilha, e o teste avisa.
- (−) A página inicial faz um pedido a mais (`trilha-calouro.json`), que o service worker guarda em cache.
- (−) Os termos novos da trilha entraram no `termos.json` (no fim da lista, com CRLF), e por isso este PR ainda encosta no #98, mas só nas linhas novas.
