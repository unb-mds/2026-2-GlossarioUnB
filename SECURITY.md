# Política de Segurança

## Versões com suporte

Damos suporte de segurança apenas à **última versão publicada** (veja as [Releases](https://github.com/unb-mds/2026-2-GlossarioUnB/releases)) e à branch `main`. Versões anteriores não recebem correção.

## O que está no escopo

* O site estático publicado no GitHub Pages (`frontend/` e `sobre/`), por exemplo falha de script entre sites (XSS) ou de redirecionamento aberto
* O robô de coleta (`coleta/` e `scripts/`) e os fluxos de CI (`.github/workflows/`)
* O segredo `GEMINI_API_KEY` guardado nos segredos do repositório: vazamento da chave em código, log, PR ou arquivo versionado

Fora do escopo: erro ou ofensa num termo do glossário (abra uma issue comum ou um PR), falhas em serviços de terceiros (GitHub, Google) e problemas que exijam acesso físico a um computador.

## Como reportar uma vulnerabilidade

**Não abra uma issue pública** nem um Pull Request com os detalhes: o repositório é público e qualquer pessoa leria.

Use o canal privado do GitHub: aba *Security* do repositório, botão *Report a vulnerability* (relato privado de vulnerabilidade). Só o time vê o relato.

Inclua, se puder: o que encontrou, onde (arquivo, página ou workflow), passos para reproduzir e o impacto que imagina. Não é preciso ter a correção pronta.

Se você achar que uma chave ou senha foi exposta (a nossa ou a sua), avise pelo canal privado e não a cole em nenhum comentário público.

## O que esperar

Prazo de primeira resposta: 7 dias corridos. Depois de confirmada, a correção é feita num PR do time G10 e a pessoa que reportou é avisada. O projeto é acadêmico e mantido por estudantes, então os prazos são de melhor esforço.
