# ADR 0001 — Termos em JSON estático versionado no repositório

## Contexto
A escolha entre "JSON estático" e "backend com banco de dados" está registrada como pendente em `docs/ARQUITETURA.md` desde a reestruturação do repositório (PR #5, 14/09) e virou a issue #21 em 23/09. É a decisão que trava as demais.

O que pesa, extraído do material do time:

- **Story Map (MVP):** "Quero consultar termos offline", "Queremos que qualquer pessoa da UnB possa sugerir um termo por Pull Request", "queremos adicionar termos em nosso glossário (RF03)". **Fora do escopo:** "Login de Usuário".
- **Requisitos:** RNF01 (PWA offline); REQUISITOS §1 "domínio pequeno de propósito"; §5 sem edição de termo direto pelo site.
- **Referência:** o glossario-ufcg usa JSON estático servido pelo próprio front (ARQUITETURA.md; benchmark no PR #26).
- **Estado atual:** o MVP feito por um colega (26/09) já consome um `termos.json` estático.

## Decisão
- Os termos ficam em **um único arquivo JSON versionado** no repositório, `frontend/data/termos.json`, servido junto com o site estático.
- **Não há backend nem banco de dados** na Release 1.
- Toda escrita acontece por Pull Request revisado. O Git faz o papel de "banco": histórico, revisão e autoria de cada termo.
- A planilha colaborativa é só a **coleta inicial** (RF03) e é migrada para o JSON.
- O arquivo fica em `frontend/data/` e não em `data/` na raiz (como no esboço do ARQUITETURA.md). Assim o site é publicado copiando uma única pasta, sem etapa de build. **PRECISA VALIDAÇÃO DA EQUIPE.**

## Alternativas descartadas
- **Backend + banco** (API REST com SQLite/PostgreSQL, temas dos estudos #1 e #7). Exigiria servidor hospedado, autenticação para escrita e sincronização para funcionar offline, e nenhuma história do MVP precisa de escrita em tempo real.
- **Um arquivo por categoria** (`data/termos-<categoria>.json`, sugerido na Sprint 02 do `sprint-planning.md`). Reduz conflito de merge, mas multiplica requisições e entradas no cache do service worker. Pode voltar a ser avaliado se o volume crescer.
- **Ler direto da planilha Google** (CSV publicado ou API). Cria dependência externa, dispensa a revisão por PR e não garante `fonte` preenchida.

## Consequências
- (+) Hospedagem gratuita em qualquer host estático. O offline fica trivial, com um arquivo no cache.
- (+) Cada termo tem histórico e revisão pelo próprio Git.
- (−) Toda alteração passa por PR, ou por uma issue que alguém do time converte.
- (−) PRs de termos em paralelo podem conflitar no mesmo arquivo.
- (−) Histórias da Release 2 como "avisar se alguém tentar sugerir um termo que já existe" viram checagens de CI no PR, não regras de servidor (ver ADR 0007).
