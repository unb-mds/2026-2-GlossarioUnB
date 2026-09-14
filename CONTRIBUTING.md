# Contribuindo com o Glossário UnB

Obrigado por querer contribuir! Este projeto aceita dois tipos de contribuição:
a do **time G10** (acesso de escrita ao repositório) e a de **qualquer pessoa da
UnB** que queira sugerir ou corrigir um termo (via fork).

## Modelo de branches

Usamos **GitHub Flow** — simplificado em relação ao Git-Flow completo, porque
o time é pequeno e não mantemos uma versão em produção separada da que está
em desenvolvimento (ver o porquê em `docs/PROCESSO.md`, seção 1):

- `main` — estável e protegida, só recebe código já revisado via PR
- `feature/*` — uma branch por issue/tarefa (ex.: `feature/issue-12`)

Sem `develop`, `release/*` ou `hotfix/*` por enquanto, caso haja necessidade de mudança entra como ADR.

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

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Só documentação |
| `chore:` | Configuração, dependências, infra |
| `test:` | Testes automatizados |
| `refactor:` | Reorganização sem mudar comportamento |

Exemplo: `feat(dados): adiciona termo PPAES`

## Regras de revisão de PR

- PR que só adiciona/edita termo (dado) → 1 aprovação do time já basta
- PR que mexe em código/lógica da aplicação → revisão humana
- Nunca fazer `rebase` em `main`
- Registrar uso relevante de IA no `AI-USAGE.md` do repositório
