# Convenção de Commits e Branches — Glossário UnB

> **Status:** Documento Oficial de Engenharia  
> **Referência:** Issue #17 — Convenção de commits e branches  
> **Padrões adotados:** GitHub Flow e [Conventional Commits v1.0.0](https://www.conventionalcommits.org/pt-br/v1.0.0/)

---

## 1. Por que padronizar?

Em projetos de software colaborativos, branches desorganizadas e commits com mensagens vagas (ex.: *"ajustes"*, *"update"*, *"corrigindo"*) causam:
- Dificuldade para rastrear a origem e a motivação de alterações;
- Conflitos frequentes de merge difíceis de inspecionar;
- Impossibilidade de gerar *changelogs* e notas de release automáticas;
- Falta de evidência de engenharia de software avaliada na disciplina MDS.

Esta convenção formaliza o modelo que todos os integrantes do time devem seguir.

---

## 2. Modelo de Branches (GitHub Flow)

O time utiliza o **GitHub Flow**: um modelo ágil, focado em integração contínua na branch principal (`main`), sem a complexidade de ramos intermediários (`develop`, `release/*` ou `hotfix/*`).

### 2.1 Regras de Nomenclatura de Branches

Toda branch de desenvolvimento deve seguir o padrão:
```text
<prefixo>/issue-<ID>-<descricao-curta>
```

- **Letras minúsculas:** sempre em minúsculas, sem caracteres especiais ou acentos.
- **Hífen como separador (`kebab-case`):** use hífen para separar palavras.
- **Vínculo com a Issue:** inclua obrigatoriamente o número da issue que a branch resolve.

#### Tabela de Prefixos

| Prefixo | Finalidade | Exemplo |
|---|---|---|
| `feature/` | Nova funcionalidade, épico ou história de usuário | `feature/issue-14-busca-termo` |
| `fix/` | Correção de bug ou falha de sistema | `fix/issue-35-alinhamento-card` |
| `docs/` | Documentação, requisitos, ADRs, estudos | `docs/issue-19-constituicao` |
| `chore/` | Configurações, dependências, templates, CI/CD | `chore/issue-24-templates-issue` |
| `refactor/` | Reorganização interna de código sem alteração funcional | `refactor/issue-42-modularizacao-busca` |
| `test/` | Adição ou refatoração de testes automatizados | `test/issue-50-cobertura-schema` |

### 2.2 Ciclo de Vida da Branch

1. **Origem:** Toda branch nasce a partir da `main` atualizada:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/issue-XX-descricao
   ```
2. **Escopo limitado:** Uma branch deve resolver apenas o escopo da sua issue correspondente. Evite misturar múltiplos assuntos na mesma branch.
3. **Proteção da `main`:** Nenhum integrante commita diretamente na `main`. Toda alteração entra exclusivamente via Pull Request.
4. **Exclusão pós-merge:** Após a aprovação e o merge do PR na `main`, a branch remota deve ser excluída no GitHub para manter o repositório limpo.

---

## 3. Convenção de Commits (Conventional Commits)

Seguimos a especificação internacional **Conventional Commits v1.0.0**.

### 3.1 Estrutura do Commit

```text
<tipo>(<escopo opcional>): <descrição no imperativo e em minúsculas>

[corpo opcional explicando o quê mudou e por quê]

[rodapé opcional com Closes #XX]
```

### 3.2 Tipos Permitidos

| Tipo | Descrição | Exemplo de Aplicação |
|---|---|---|
| `feat` | Nova funcionalidade para o usuário ou novos dados | `feat(dados): adiciona novos termos da vida academica` |
| `fix` | Correção de bug ou comportamento inesperado | `fix(pwa): corrige falha de carregamento no modo offline` |
| `docs` | Alterações exclusivamente em documentação | `docs(specs): adiciona constituicao do projeto` |
| `chore` | Configurações, build, dependências, templates | `chore(github): atualiza templates de issue` |
| `test` | Criação ou modificação de testes automatizados | `test(schema): adiciona testes de validacao de termos` |
| `refactor` | Mudança de código que não altera comportamento | `refactor(front): extrai componente TermCard` |
| `style` | Formatação, pontuação, linting visual | `style(front): formata arquivos com prettier` |
| `perf` | Melhoria de desempenho ou otimização de recursos | `perf(front): reduz tamanho do bundle com lazy loading` |

### 3.3 Escopos Padronizados do Glossário UnB

O escopo situa em qual módulo do projeto a mudança ocorreu:
- `dados`: arquivos de dados do glossário (`data/*.json`) e schemas.
- `front` ou `frontend`: componentes de interface, CSS, páginas.
- `pwa`: service worker, manifesto e estratégias de cache offline.
- `i18n`: internacionalização e arquivos de tradução.
- `github`: workflows, templates de issue/PR e actions.
- `specs`: constituição, requisitos, regras de negócio e ADRs.

### 3.4 Boas Práticas na Mensagem

- **Verbo no imperativo ou infinitivo:** *"adiciona"* ou *"adicionar"*, e **não** *"adicionado"* ou *"adicionando"*.
- **Primeira letra minúscula:** após os dois pontos e espaço, inicie com minúscula (ex.: `feat: adiciona...`).
- **Sem ponto final no título:** o título do commit não leva ponto final.
- **Clareza e objetividade:** informe exatamente o que foi feito.

#### Exemplos: Bom vs. Ruim

| ✅ Como fazer | ❌ Como NÃO fazer |
|---|---|
| `feat(dados): adiciona termo PPAES com fontes verificadas` | `ajustes no json` |
| `fix(ui): corrige overflow de texto no card do termo` | `consertando bug` |
| `docs(processo): atualiza fluxo de revisao de PR` | `docs` |
| `chore(ci): configura pipeline de testes no github actions` | `subindo arquivos` |

---

## 4. Fechamento Automático de Issues

Para vincular o commit à issue correspondente e garantir que ela seja fechada automaticamente quando o Pull Request for mergeado na `main`, utilize no corpo ou rodapé:

```text
Closes #<número da issue>
```

---

## 5. Configuração do Template no Git Local

O repositório já disponibiliza o arquivo `.gitmessage`. Para que o Git abra esse modelo automaticamente a cada `git commit`, execute:

```bash
git config commit.template .gitmessage
```
