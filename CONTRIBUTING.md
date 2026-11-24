# Contribuindo com o Glossário UnB

Obrigado por querer contribuir! Este projeto aceita dois tipos de contribuição:
a do **time G10** (acesso de escrita ao repositório) e a de **qualquer pessoa da
UnB** que queira sugerir ou corrigir um termo (via fork).

Ao participar, você concorda em seguir o [Código de Conduta](CODE_OF_CONDUCT.md). Para reportar uma vulnerabilidade, veja a [Política de Segurança](SECURITY.md) (não abra issue pública).

## Modelo de branches

Adotamos o **GitHub Flow** — simplificado em relação ao Git-Flow completo, porque
o time é pequeno e não mantemos uma versão em produção separada da que está
em desenvolvimento (ver o porquê em `docs/PROCESSO.md`, seção 1). Sem `develop`,
`release/*` ou `hotfix/*` por enquanto (se houver necessidade de mudança, entra como ADR).

### Nomenclatura de branches

Toda branch deve ser criada a partir da `main` atualizada, escrita em minúsculas (`kebab-case`) com prefixo por tipo, número da issue e descrição curta:
```text
<prefixo>/issue-<ID>-<descricao-curta>
```

Prefixos válidos: `feature/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`. Detalhes e exemplos completos em [`docs/CONVENCAO-GIT.md`](docs/CONVENCAO-GIT.md).

## Se você é do time G10

1. `git checkout main && git pull origin main`
2. `git checkout -b <prefixo>/issue-XX-<descricao-curta>` (ex.: `feature/issue-14-busca-termo`, `docs/issue-19-constituicao`)
3. Commits pequenos, seguindo a convenção abaixo
4. `git push origin <prefixo>/issue-XX-<descricao-curta>`
5. Abra um Pull Request **para `main`**
6. Peça revisão de pelo menos 1 pessoa. **Ninguém aprova o próprio PR.**

## Se você não é do time (quer sugerir um termo)

Você não precisa e não tem acesso de escrita a este repositório, use fork:

1. Clique em **Fork** neste repositório (canto superior direito no GitHub)
2. Clone o *seu fork*: `git clone <url-do-seu-fork>`
3. Crie uma branch: `git checkout -b add-termo-<nome-do-termo>`
4. Edite `frontend/data/termos.json` seguindo o schema abaixo e rode `npm test`
5. `git push` para o seu fork e abra um Pull Request para o nosso `main`
6. Alguém do G10 revisa e mergeia

### Schema de um termo

```json
{
  "id": "deg",
  "termo": "DEG",
  "tipo": "sigla",
  "categoria": "administracao",
  "significado": "Decanato de Ensino de Graduação",
  "definicao": "Explicação em português simples do que é/faz.",
  "exemplo_uso": "Minha dúvida sobre matrícula foi encaminhada para o DEG.",
  "fonte": "URL ou 'conhecimento comum verificado pelo grupo'",
  "campus": "Geral"
}
```

- `tipo`: `sigla`, `giria` ou `expressao`. `significado` (por extenso) só é obrigatório para siglas.
- `categoria`: `vida-academica`, `unidades-academicas`, `administracao`, `colegiados`, `locais-campus`, `sistemas`, `assistencia-estudantil`, `representacao-estudantil` ou `girias`.
- `campus`: `Darcy Ribeiro`, `Ceilândia`, `Gama`, `Planaltina` ou `Geral`.
- Opcional: `localizacao` (`lat`, `lng`, `link_como_chegar`) para lugares físicos.
- Opcional: `sinonimos`, a lista de outros nomes do mesmo termo, com prova na fonte. Não use o nome de outro termo do glossário.
- Opcional: `relacionados`, a lista de ids de outros termos que aparecem em "Veja também". Só ponha uma ligação depois de ler as duas definições e conferir que é o mesmo órgão ou assunto.
- Opcional: `verificado_em`, a data `aaaa-mm-dd` em que uma pessoa conferiu a fonte. A página mostra "Verificado em dd/mm/aaaa" e o robô usa essa data para avisar quando a página mudar (RF07).

Nenhum termo é aceito sem `fonte` preenchida. O CI valida todo PR contra esse schema;
regras completas em [`docs/adr/0004-schema-unico-do-termo.md`](docs/adr/0004-schema-unico-do-termo.md).

## Lint e cobertura

O CI roda `npm run lint` e `npm run test:cobertura` em todo PR. Para rodar localmente:

```bash
npm ci                  # só na primeira vez; instala o ESLint e as bibliotecas do robô
npm run lint            # ESLint
npm run test:cobertura  # testes + cobertura mínima
```

- O lint usa ESLint com as regras recomendadas e o `eslint.config.js` versionado.
- A cobertura mínima é de **90% de linhas, funções e branches** em `frontend/js/termos.js`, `frontend/js/validacao-termo.js` e `coleta/`.
- A camada de tela (`frontend/js/app.js`) e o service worker (`frontend/sw.js`) ficam para os testes E2E da #78.

## Convenção de commits

Adotamos a especificação [Conventional Commits v1.0.0](https://www.conventionalcommits.org/pt-br/v1.0.0/). Cada mensagem deve seguir a estrutura:

```text
<tipo>(<escopo opcional>): <descrição no imperativo e em minúsculas>

[corpo opcional explicando o que mudou e por quê]

[rodapé opcional com Closes #XX]
```

- **Tipos permitidos:** `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `style`, `perf`.
- **Escopos:** livres para indicar o módulo alterado (ex.: `dados`, `frontend`, `pwa`, `github`, `specs`, etc.).

Para a especificação completa, boas práticas, ciclo de vida da branch e exemplos práticos de commits, consulte o guia oficial em [**`docs/CONVENCAO-GIT.md`**](docs/CONVENCAO-GIT.md).

### Template local do Git

Para preencher a mensagem de commit de forma guiada no terminal, ative o template do repositório:
```bash
git config commit.template .gitmessage
```

## Regras de revisão de PR

- PR que só adiciona/edita termo (dado) → 1 aprovação do time já basta
- PR que mexe em código/lógica da aplicação → revisão humana
- Nunca fazer `rebase` em `main`
- Registrar uso relevante de IA no `AI-USAGE.md` do repositório
