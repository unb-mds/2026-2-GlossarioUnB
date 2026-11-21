# AGENTS.md — Glossário UnB (G10, MDS 2026/2)

Regras para qualquer agente de IA que mexa neste repositório. Leia antes de mudar qualquer arquivo.

## Comandos

- `npm test`: roda todos os testes (`node --test`) e valida o `frontend/data/termos.json`. Rode depois de cada mudança.
- `npm run test:cobertura`: os mesmos testes, com o relatório de cobertura.
- `npm run dev`: servidor local. Glossário em `http://localhost:8080/frontend/`, Sobre em `/sobre/`.
- Node 22 ou mais novo (o CI usa o 24). `npm ci` instala as bibliotecas do robô de coleta (ADR 0010); o front e os testes do front não dependem delas.
- Ainda não existe `npm run lint` (a issue #79 cria o lint no CI).

## Onde está cada coisa

- `frontend/`: o glossário (PWA). `data/termos.json` são os termos; `js/validacao-termo.js` é a única regra do schema; `sw.js` é o service worker.
- `sobre/`: a página "Sobre o projeto", só HTML e CSS (ADR 0008).
- `coleta/`: o robô de coleta (ADR 0009). `fontes.json` diz quais páginas ler; o coletor, a deduplicação e o classificador ficam aqui.
- `scripts/servidor-local.mjs`: o servidor do `npm run dev`, com o mesmo layout do GitHub Pages.
- `tests/`: testes com `node:test`. `dados.test.js` valida todos os termos.
- `docs/adr/`: as decisões de arquitetura. O molde de ADR está em `docs/PROCESSO.md`, seção 4.
- `docs/skills/`: estudos individuais da Sprint 01. Não são instruções para o agente, e não existe pasta `skills/` na raiz.

## Regras que o agente não pode quebrar

1. **Todo termo passa pela `validarTermo` (ADR 0004).** Campos obrigatórios: `id`, `termo`, `tipo`, `definicao`, `exemplo_uso`, `fonte`, `campus`. O `id` usa só minúsculas sem acento, números e hífens; sigla precisa de `significado`. Nunca copie essa regra para outro arquivo.
2. **Sem framework e sem build no front (ADR 0002).** JavaScript puro com ES Modules e CSS puro com tokens. Biblioteca npm só pelas duas listas fechadas da ADR 0010: as do robô, em `coleta/` e `scripts/`, e as de teste e qualidade, só em `devDependencies`. Qualquer outra precisa de ADR.
3. **Nenhum segredo no front nem no repositório.** O site é público no GitHub Pages (ADR 0007). Chave de API fica no `.env`, que não é commitado.
4. **Conventional Commits e branch com issue** (`docs/CONVENCAO-GIT.md`): `tipo(escopo): descrição no imperativo` e `<prefixo>/issue-<N>-<descricao>`. Quem faz o commit é a pessoa: o agente não roda `git commit` nem `git push`.
5. **Uso de IA registrado no `AI-USAGE.md`**: data, pessoa, ferramenta, o que foi feito e se foi aceito, ajustado ou rejeitado.

## Padrões de código (docs/ARQUITETURA.md)

- Early return em vez de condicionais aninhadas.
- Nomes de arquivo por domínio (`termos.js`), nada de `utils.js` ou `helpers.js`.
- Erro tratado de forma explícita, sem `catch` vazio.
- Teste novo em `tests/` junto com a mudança.
- Mudou um arquivo do app shell? Incremente `VERSAO_CACHE` em `frontend/sw.js`.

## Antes de entregar

Rode `npm test`, explique em até 5 linhas o que mudou e em quais arquivos, e pare antes do commit.
