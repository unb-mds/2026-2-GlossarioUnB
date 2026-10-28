# ADR 0002 — Frontend em HTML, CSS e JavaScript sem framework na Release 1


## Contexto
`docs/ARQUITETURA.md` reserva esta ADR como "Framework de frontend. A definir". O estudo comparando React e Vue está na issue #13 (Sprint 01, aberta), a skill de React/Vue ficou com o José e o estudo de frontend do Allan está no PR #25 (aberto). Até 26/09 não havia recomendação registrada.

O que pesa:

- **Story Map / matriz:** "Interface simples e acessível" (alto impacto, baixo esforço); "quero um site com uma estética agradável e de interface simples" (Release 2).
- **Tamanho do produto:** 3 páginas (busca, lista completa, página do termo) sobre um único arquivo de dados (ADR 0001).
- **Estado atual:** o MVP feito por um colega em 26/09 já funciona em HTML/CSS/JS puro, sem build.
- **Referência:** o glossario-ufcg usa React + Webpack.

## Decisão
- A Release 1 usa **HTML + CSS + JavaScript sem framework**, com **módulos ES nativos** (`<script type="module">`), sem etapa de build e sem dependências npm em tempo de execução.
- A lógica de domínio fica separada da manipulação de DOM, para ser testável no Node:
  - `frontend/js/termos.js`: busca, filtros e agrupamento;
  - `frontend/js/validacao-termo.js`: schema do termo e links seguros;
  - `frontend/js/app.js`: DOM. Dados de termo entram na página só via `textContent`.
- O uso de um framework é reavaliado antes da Release 2, se aparecer uma tela com estado complexo (por exemplo, um formulário de sugestão no próprio site).

## Alternativas descartadas
- **React** (como o glossario-ufcg). Exige build (Vite/Webpack) e tem uma curva maior para um time de 6 pessoas com níveis diferentes. O ganho é pequeno para 3 páginas.
- **Vue.** Mesma análise, e o estudo (#13) ainda não tem recomendação registrada.

## Consequências
- (+) Sem build: publicar é copiar a pasta `frontend/`. O service worker fica simples e qualquer pessoa do time consegue editar.
- (−) O cabeçalho HTML se repete nas 3 páginas e não há componentização.
- (−) Se o time migrar para um framework na Release 2, a lógica de domínio (isolada e testada) é reaproveitada; a camada de DOM, não.
- A issue #13 precisa registrar a recomendação final e referenciar esta ADR.
