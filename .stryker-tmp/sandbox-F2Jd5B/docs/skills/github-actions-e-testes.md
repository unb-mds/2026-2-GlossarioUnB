# Skill: GitHub Actions e testes automatizados

> Issue #11 · Sprint 01. Estudo aplicado ao Glossário UnB. Os exemplos são os arquivos reais do repositório.

## 1. O que é um workflow do GitHub Actions

Um **workflow** é um arquivo YAML em `.github/workflows/` que diz ao GitHub o que executar, e quando, numa máquina virtual descartável.

| Parte | O que é | No nosso `ci.yml` |
|---|---|---|
| `on` | O **gatilho**: quais eventos disparam o workflow | `push` na `main` e todo `pull_request` |
| `jobs` | Os trabalhos; cada um roda numa máquina própria | Um job, `testes` |
| `runs-on` | O sistema da máquina | `ubuntu-latest` |
| `steps` | Os passos, em ordem: ações prontas (`uses`) ou comandos (`run`) | Baixa o código, instala o Node 24 e roda `npm test` |
| `permissions` | O que o workflow pode fazer no repositório | Só leitura (`contents: read`) |

Quando um passo falha, o workflow fica **vermelho** e aparece no Pull Request. Assim o erro é visto **antes** do merge.

O projeto tem dois workflows:
- **`ci.yml`:** roda os testes em todo PR.
- **`pages.yml`:** a cada push na `main`, roda os testes e, se passarem, publica as duas páginas no GitHub Pages.

## 2. Tipos de teste

| Tipo | O que verifica | Exemplo no projeto |
|---|---|---|
| **Unitário** | Uma função isolada, sem navegador nem rede | `buscarTermos("de")` devolve DEG e DEX (`tests/termos.test.js`) |
| **De dados / contrato** | Que os dados seguem o formato combinado | Todos os termos de `frontend/data/termos.json` passam no schema da ADR 0004 (`tests/dados.test.js`) |
| **Integração** | Várias partes juntas | Ainda não temos automatizado |
| **Ponta a ponta (E2E)** | O sistema inteiro, como o usuário usa, num navegador de verdade | Ainda não temos; ficou para depois |

## 3. Ferramenta escolhida: `node:test`

- Já vem no Node (versão 22 ou mais nova): **nenhuma dependência para instalar**. Isso combina com a ADR 0002, que evita build e dependências.
- Roda com `npm test`, que chama `node --test` e acha sozinho os arquivos `*.test.js`.
- Mede cobertura com `npm run test:cobertura` (`--experimental-test-coverage`).
- Por que funciona: as regras ficam em `frontend/js/termos.js` e `frontend/js/validacao-termo.js`, **separadas da tela** (`app.js`), então dá para testá-las sem navegador.

Alternativas consideradas:
- **Jest:** mais recursos, mas exige instalar dependências.
- **Vitest:** muito bom com Vite, que não usamos.

## 4. Exemplo: um teste e o workflow que o roda

```js
// tests/termos.test.js (trecho)
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar } from "../frontend/js/termos.js";

test("normalizar ignora acento, caixa e espaços nas pontas", () => {
  assert.equal(normalizar("  Minhocão "), "minhocao");
});
```

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm test
```

**Para ver funcionando:** abra um PR que apague a `fonte` de algum termo. O CI fica vermelho com a mensagem `termo #N (id): campo obrigatório ausente ou vazio: fonte`.

## 5. Limites atuais

- Não há **lint** (checagem automática de estilo e erros) no CI.
- A camada de tela (`app.js`) e o service worker não têm teste automatizado.

## Revisão

- [ ] Revisado por: _______ (preencher no PR)
