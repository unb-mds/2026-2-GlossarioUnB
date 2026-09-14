# Guia de Fluxo de Trabalho — Git e GitHub (G10)

>Esse documento foi feito para adaptar e informar o fluxo de trabalho no GitHub para os membros do G10.

## 0. Configuração inicial (uma vez só, por máquina)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "email-da-sua-conta-github@exemplo.com"
git config commit.template .gitmessage
```

- Linha 1 e 2: dizem ao Git quem você é — isso vai carimbado em cada commit.
- Linha 3: liga o template de commit (o arquivo `.gitmessage` do repositório) — assim, quando você rodar `git commit` sem `-m`, já abre o formato pronto pra preencher.

Se ainda não clonou o repositório:
```bash
git clone https://github.com/unb-mds/G10-2026-2.git
cd G10-2026-2
```
`clone` baixa o repositório inteiro (com todo o histórico) pra sua máquina, dentro de uma pasta com o nome do repositório. `cd` entra nela.

## 1. Fluxo do dia a dia — cada comando explicado

```bash
git checkout main
```
Troca pra branch `main` — garante que você não está "dentro" de uma branch antiga de outra tarefa.

```bash
git pull origin main
```
Busca as atualizações do repositório remoto (`origin`, o apelido padrão do GitHub) e já junta na sua cópia local. Sem isso, você corre o risco de criar sua branch a partir de uma versão desatualizada.

```bash
git checkout -b feature/nome-da-tarefa
```
`checkout -b` faz duas coisas de uma vez: cria uma branch nova **e** já troca pra ela. `feature/nome-da-tarefa` é só uma convenção de nome — troque `nome-da-tarefa` por algo que descreva o que você vai fazer (ex.: `feature/issue-14-busca-termo`).

*(...aqui você programa, edita arquivos, etc.)*

```bash
git status
```
Mostra o que mudou desde o último commit — o que está "sujo" (modificado), o que é novo (untracked), o que já está pronto pra commitar (staged). É o comando que você roda toda vez que ficar em dúvida do que está acontecendo.

```bash
git add caminho/do/arquivo.md
```
Marca aquele arquivo específico pra entrar no próximo commit ("stage"). Prefira sempre listar o arquivo em vez de usar `git add .` (que pega tudo) — evita commitar algo que você esqueceu de revisar.

```bash
git commit
```
Sem `-m`, abre o editor com o template configurado no passo 0 — você preenche tipo, escopo, descrição. Se preferir direto no terminal: `git commit -m "feat(dados): adiciona termo PPAES"`.

```bash
git push origin feature/nome-da-tarefa
```
Envia sua branch (com os commits novos) pro GitHub. `origin` é o repositório remoto, e o nome depois é o nome da branch — precisa bater com o nome que você criou no `checkout -b`.

## 2. Como abrir o Pull Request

1. Depois do `push`, abra o repositório no navegador — geralmente aparece uma faixa amarela **"feature/nome-da-tarefa had recent pushes"** com um botão **Compare & pull request**. Clique nele.
2. Confira o destino: **base: main** ← **compare: feature/nome-da-tarefa** (nunca abra PR direto pra `main` vindo de outra pessoa sem revisar, e nunca deixe o destino errado).
3. O corpo do PR já vem preenchido com o `PULL_REQUEST_TEMPLATE.md` — preencha os campos, não deixe em branco.
4. Se a issue relacionada tiver número, escreva `Closes #12` (troque pelo número real) — isso fecha a issue sozinho quando o PR for mergeado.
5. Na barra lateral direita, clique no ícone de engrenagem ao lado de **Reviewers** e escolha quem vai revisar.
6. **Create pull request**.

Do lado de quem revisa: abrir o PR → aba **Files changed** → ler o diff → botão **Review changes** → **Approve** (ou **Request changes**) → **Submit review**. Só depois disso o botão de merge libera.

## 3. Como resolver um conflito de merge

Isso acontece quando duas pessoas mudaram a mesma parte de um arquivo. Não é motivo de pânico — é só o Git perguntando qual das duas versões deve ficar.

```bash
git checkout main
git pull origin main
git checkout feature/nome-da-tarefa
git merge main
```
Essas 4 linhas trazem o que há de novo na `main` pra dentro da sua branch, **antes** de abrir o PR — assim, se vai dar conflito, ele aparece pra você resolver localmente, e não some no meio de uma revisão.

Se der conflito, o terminal avisa quais arquivos têm o problema. Abra cada um no editor (VS Code mostra isso de forma visual) — vai aparecer algo assim:

```
<<<<<<< HEAD
sua versão da linha
=======
versão que veio da main
>>>>>>> main
```

No VS Code, aparecem botões **Accept Current Change**, **Accept Incoming Change** ou **Accept Both Changes** bem em cima do trecho conflitante — escolha, apague as marcações (`<<<<<<<`, `=======`, `>>>>>>>`) se sobrar alguma, teste se o código ainda funciona, e então:

```bash
git add arquivo-que-tinha-conflito
git commit
```
Como o merge já estava em andamento, esse commit fecha ele. Depois é só continuar o fluxo normal (`push`, PR).

## 4. Erros comuns (e como sair deles)

**"Esqueci de dar `pull` antes de começar a trabalhar"**
Sem problema, ainda dá pra resolver: faça commit do que já tem, depois `git pull origin main` — se der conflito, resolva como na seção 3.

**"Commitei sem querer direto na `main` local"**
```bash
git branch feature/salvando-isso
git reset --hard origin/main
git checkout feature/salvando-isso
```
Isso move seu commit pra uma branch nova, sem perder nada, e deixa sua `main` local limpa de novo.

**"Quero desfazer o último commit, mas ainda não dei `push`"**
```bash
git reset --soft HEAD~1
```
Desfaz o commit mas mantém as mudanças nos arquivos (você só precisa commitar de novo, corrigido). **Nunca** rodar isso depois de já ter dado `push` numa branch que outra pessoa também usa.

**"Não sei em que branch estou"**
```bash
git branch
```
A branch atual aparece marcada com `*`.

## 5. Referências

- Fonte dos termos coletados até agora: [Planilha de coleta — Glossário UnB](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing)
- O porquê de cada decisão: [`docs/estudos/estudo-git-github.md`](estudos/estudo-git-github.md)
- A regra oficial do time: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
