# Contribuindo com o Glossário UnB

Obrigado por querer contribuir! Este projeto aceita dois tipos de contribuição:
a do **time G10** (acesso de escrita ao repositório) e a de **qualquer pessoa da
UnB** que queira sugerir ou corrigir um termo (via fork).

## Modelo de branches

Adotamos o **GitHub Flow** — um modelo ágil, seguro e simplificado em relação ao Git-Flow tradicional. Todo o trabalho do time é integrado diretamente na `main` através de Pull Requests revisados.

### Nomenclatura de branches

Toda branch deve ser criada a partir da `main` atualizada, escrita em letras minúsculas (`kebab-case`) e seguir os prefixos semânticos abaixo:

| Prefixo | Finalidade | Exemplo |
|---|---|---|
| `feature/` | Nova funcionalidade, épico ou user story | `feature/issue-14-busca-termo` |
| `fix/` | Correção de bug ou falha de sistema | `fix/issue-35-alinhamento-card` |
| `docs/` | Documentação, requisitos, ADRs, estudos | `docs/issue-19-constituicao` |
| `chore/` | Configurações, dependências, templates, CI/CD | `chore/issue-24-templates-issue` |
| `refactor/` | Reorganização de código sem mudar comportamento | `refactor/issue-42-modularizacao-busca` |
| `test/` | Adição ou reestruturação de testes | `test/issue-50-cobertura-schema` |

### Regras do ciclo de vida da branch

1. **`main` é protegida:** Nenhum integrante realiza commits diretamente na `main`. Todo código entra via Pull Request revisado por pelo menos 1 integrante.
2. **Branches temporárias e focadas:** Cada branch resolve uma issue/tarefa específica e deve ser excluída remotamente após o merge do PR.
3. **Sincronização:** Mantenha sua branch sincronizada com a `main` antes de abrir o PR para evitar conflitos (`git pull origin main`).
4. **Sem branches complexas:** Não usamos `develop`, `release/*` ou `hotfix/*` por enquanto (qualquer alteração será avaliada via ADR).

## Se você é do time G10

1. `git checkout main && git pull origin main`
2. `git checkout -b feature/issue-XX`
3. Commits pequenos, seguindo a convenção abaixo
4. `git push origin feature/issue-XX`
5. Abra um Pull Request **para `main`**
6. Peça revisão de pelo menos 1 pessoa. **Ninguém aprova o próprio PR.**

## Se você não é do time (quer sugerir um termo)

Você não precisa e não tem acesso de escrita a este repositório, use fork:

1. Clique em **Fork** neste repositório (canto superior direito no GitHub)
2. Clone o *seu fork*: `git clone <url-do-seu-fork>`
3. Crie uma branch: `git checkout -b add-termo-<nome-do-termo>`
4. Edite o arquivo de dados do termo seguindo o schema abaixo
5. `git push` para o seu fork e abra um Pull Request para o nosso `main`
6. Alguém do G10 revisa e mergeia

### Schema de um termo

```json
{
  "termo": "DEG",
  "tipo": "sigla",
  "categoria": "estrutura-administrativa",
  "significado": "Decanato de Ensino de Graduação",
  "definicao": "Explicação em português simples do que é/faz.",
  "exemplo_uso": "Frase real mostrando o termo em uso.",
  "fonte": "URL ou 'conhecimento comum verificado pelo grupo'"
}
```

Nenhum termo é aceito sem `fonte` preenchida. Ver `skills/glossario-unb-dev/SKILL.md`
para as regras completas do modelo de dados.

## Convenção de commits

Adotamos a especificação [Conventional Commits v1.0.0](https://www.conventionalcommits.org/pt-br/v1.0.0/). Cada mensagem de commit deve ser clara, contextualizada e padronizada.

### Formato da mensagem

```text
<tipo>(<escopo opcional>): <descrição no imperativo e em minúsculas>

[corpo opcional explicando o que mudou e por quê]

[rodapé opcional com referência à issue]
```

### Tipos permitidos

| Prefixo | Significado | Quando usar |
|---|---|---|
| `feat:` | Nova funcionalidade | Adiciona nova funcionalidade ou novos termos ao sistema |
| `fix:` | Correção de bug | Corrige um erro, link quebrado ou comportamento incorreto |
| `docs:` | Documentação | Alterações exclusivamente em documentação (`docs/`, `specs/`, `README.md`) |
| `chore:` | Tarefas de suporte | Atualizações de infra, dependências, build, templates de issue/PR |
| `test:` | Testes automatizados | Adição, correção ou refatoração de testes e schemas de validação |
| `refactor:` | Refatoração | Mudança interna no código que não altera o comportamento externo |
| `style:` | Estilo e formatação | Ajustes de formatação, pontuação, espaços, sem impacto funcional |
| `perf:` | Desempenho | Mudanças voltadas à melhoria de performance ou carregamento offline |

### Escopos padronizados do projeto

O escopo entre parênteses indica a área afetada:
- `dados`: arquivos do dataset de termos e schemas JSON
- `frontend` ou `ui`: componentes de interface, páginas e estilização
- `pwa`: service worker, manifest e rotinas de cache offline
- `i18n`: suporte e bibliotecas de internacionalização
- `github`: workflows, actions, templates de issue/PR
- `specs`: constituição, requisitos e ADRs

### Fechamento de issues no rodapé

Para fechar automaticamente a issue correspondente quando o PR for mergeado em `main`, inclua no rodapé do commit ou do PR:
```text
Closes #<número da issue>
```

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
