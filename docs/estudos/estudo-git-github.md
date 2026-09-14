# Sprint 00 — Estudo: Git e GitHub (Git-Flow)

> Responsável: **Pedro**.

## Descrição

Estudar o fluxo de Git/GitHub que o G10 vai realmente usar: o modelo de branches
(Git-Flow), a convenção de commits, como resolver conflito, e como alguém que não é do time consegue contribuir com um termo
sem ter acesso de escrita ao nosso repositório.

## Objetivos

- [x] Entender a diferença entre Git (local) e GitHub (remoto)
- [x] Entender o modelo de branches do Git-Flow e quando usar cada uma
- [x] Padronizar mensagens de commit (Conventional Commits)
- [x] Saber resolver um conflito de merge sem apagar trabalho de ninguém
- [x] Definir como um contribuidor **externo** consegue mandar um termo (fork + PR)

## Conteúdo

### 1. Git vs. GitHub

Git é a ferramenta que guarda o histórico de versões do projeto na sua própria
máquina. GitHub é o serviço que hospeda esse histórico na nuvem e permite que o
time (e, no nosso caso, pessoas de fora) colabore em cima dele. Um roda local,
o outro é a cópia compartilhada.

### 2. O modelo de branches (Git-Flow)

| Branch | Nasce de | Vai para | Papel no G10 |
|---|---|---|---|
| `main` | — | — | Intocável. Só recebe código já validado. |
| `develop` | `main` | — | Onde o time integra o que cada um fez. |
| `feature/*` | `develop` | `develop` | Uma feature ou estudo por branch (ex.: `feature/issue-12`). |
| `release/*` | `develop` | `main` e `develop` | Fechamento antes de uma entrega (Release 1, Release 2). |
| `hotfix/*` | `main` | `main` e `develop` | Correção urgente (ex.: quebrou em produção véspera de apresentação). |

### 3. Fluxo do dia a dia (time interno)

1. `git checkout develop && git pull origin develop` — atualizar antes de começar
2. `git checkout -b feature/issue-XX` — uma branch por issue
3. Trabalhar em commits pequenos e frequentes
4. `git push origin feature/issue-XX` e abrir Pull Request **para `develop`**
5. Pelo menos 1 outra pessoa revisa — **ninguém aprova o próprio PR**

### 4. Convenção de commits (Conventional Commits)

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade (ex.: rota de busca de termo) |
| `fix:` | Correção de bug |
| `docs:` | Só documentação (README, docs/) |
| `chore:` | Configuração, dependências, infra |
| `test:` | Testes automatizados |
| `refactor:` | Reorganização de código sem mudar comportamento |

Exemplo bom: `feat(dados): adiciona schema de termo em JSON`
Exemplo ruim: `git commit -m "ajustes"` — não diz onde nem o quê.

### 5. Merge vs. Rebase

- **Merge:** junta duas branches criando um commit de merge. Seguro, não reescreve histórico. **Padrão do G10 para trazer feature → develop.**
- **Rebase:** reescreve a base da branch, deixando o histórico linear. Nunca usar em `main` ou `develop` — só reescreve histórico de branch própria, ainda não compartilhada.

### 6. Resolvendo conflito

Um conflito é o Git perguntando "qual dessas duas versões válidas eu mantenho?". Ele marca o trecho com `<<<<<<<`, `=======` e `>>>>>>>` no arquivo. Na prática: abrir no VS Code (ou editor com suporte a merge), escolher "Accept Current", "Accept Incoming" ou "Accept Both", testar se ainda funciona, e só então commitar a resolução.

### 7. Contribuição de quem não é do time

Nosso projeto quer receber PR de qualquer pessoa da UnB sugerindo um termo — igual
ao glossario-ufcg. Essa pessoa **não tem** (e não deve ter) acesso de escrita ao
nosso repositório, então o fluxo de branch direta não serve. O fluxo correto é
por **fork**:

1. A pessoa clica em "Fork" no nosso repositório (cria uma cópia na conta dela)
2. Clona o fork dela: `git clone <url-do-fork-dela>`
3. Cria uma branch no fork dela: `git checkout -b add-termo-xyz`
4. Edita o arquivo de dados do termo, commita, `git push` **para o fork dela**
5. Abre Pull Request do fork dela **para o nosso `develop`**
6. Alguém do G10 revisa — como definido no `skills/glossario-unb-dev/SKILL.md`, um PR externo que só mexe em dado de termo pode mergear direto; se mexer em código, precisa de revisão humana antes.

Isso precisa ficar documentado em público, no `CONTRIBUTING.md` do repositório.

### 8. Checklist prático

- [ ] Git instalado e `user.name`/`user.email` configurados em cada máquina do time
- [ ] Todo mundo já testou `add → commit → push → pull` no repositório real
- [ ] `develop` criada e protegida
- [ ] `CONTRIBUTING.md` publicado com o fluxo interno **e** o fluxo de fork
- [ ] Um PR de teste (interno) já foi aberto, revisado e mergeado

### 9. Por que Pull Request e não só merge direto?

Pergunta justa. Tecnicamente, qualquer pessoa com acesso de escrita pode fazer
`git checkout develop && git merge feature/x && git push` e pronto — sem PR
nenhum. E trocar de ferramenta (GitHub Desktop, GitKraken, linha de comando)
não muda isso: nenhuma delas "substitui" o PR, porque PR não é uma forma de
mesclar código — é uma camada de **revisão e registro** em cima de qualquer
ferramenta que você use pra commitar.

Por que usar mesmo dentro do time:

1. **Revisão pega problema antes de entrar em `develop`.** Com back, front e
   banco de dados divididos entre pessoas diferentes, ninguém tem contexto
   completo do que o outro fez. Revisar o diff antes do merge é o momento
   mais simples de pegar um erro.
2. **É o gatilho do CI.** Lint e teste automatizado normalmente rodam
   `on: pull_request` — merge direto nunca dispara essa checagem.
3. **É o rastro que a disciplina avalia.** Issue → branch → PR → merge é a
   trilha que mostra quem fez o quê. A professora já cobrou commit semanal;
   PR é a evidência de que teve revisão, não só commit solto.
4. **Proteção de branch só funciona em cima de PR.** Quando alguém do G10
   finalmente tiver admin, dá pra configurar a `develop` pra bloquear merge
   sem aprovação — isso não tem equivalente pra push direto.


Pra uma edição pequena e sem risco (typo no README, por exemplo), várias
equipes reais liberam commit direto — não é regra de vida ou morte. Mas como
vocês estão sendo avaliados no processo, não só no resultado, manter PR como
padrão fixo é mais simples do que decidir caso a caso.

### 10. Milestones, Labels, Projects e Releases — pra que serve cada um

**Milestone:** agrupa issues (e PRs) em torno de um objetivo com data-alvo, e
mostra sozinho "X de Y issues fechadas" com barra de progresso. No nosso caso,
**1 Milestone = 1 Sprint**. Toda issue da Sprint 00 entra
nesse milestone, quando todas fecham, o milestone bate 100%.

Como criar: no repositório → aba **Issues** → **Milestones** → **New
milestone** → título ("Sprint 00"), data-alvo opcional, descrição. Depois, ao
criar ou editar cada issue, você escolhe o milestone dela na barra lateral
direita.



Confusão comum entre os quatro recursos do GitHub, então a distinção rápida:

| Recurso | Pra que serve | Escopo |
|---|---|---|
| **Label** | Etiqueta numa issue/PR (`estudo`, `bug`, `documentation`) | Uma issue pode ter várias |
| **Milestone** | Agrupa issues em torno de um objetivo com prazo | Uma issue pertence a no máximo um |
| **Project (board)** | Visualiza o fluxo (A Fazer / Fazendo / Feito) | Pode misturar issues de milestones diferentes |
| **Release** (recurso do GitHub) | Marca uma versão publicada do código (tag + changelog) | Não é o "Release 1/2" da disciplina — dá pra usar junto: taguear o repositório quando a Release da matéria for entregue |

Ou seja: Label = o que é isso; Milestone = pra quando; Project = em que fase
está agora. 
### 11. Links úteis

- Documentação oficial do Git: https://git-scm.com/doc
- Documentação do GitHub em português: https://docs.github.com/pt
- Learn Git Branching (interativo): https://learngitbranching.js.org/?locale=pt_BR
- Especificação Conventional Commits: https://www.conventionalcommits.org/pt-br/

## Resultado esperado

O time sabe abrir branch, commitar com padrão, resolver conflito e sabe exatamente como alguém de fora da UnB-MDS manda
um termo sem ter acesso ao repositório. Isso vira a base do `CONTRIBUTING.md`.

## Link do estudo

Este documento (`docs/sprints/sprint-00/git-github.md`) + `CONTRIBUTING.md` na raiz do repositório.
