# ADR 0006 — Contribuição externa por Pull Request e por Issue, sem formulário com backend

## Status
Aceito (em uso desde a Release 1, 28/09/2026).

## Contexto
- **Story Map (MVP, "Perspectiva Time"):**
  - "Queremos que qualquer pessoa da UnB possa sugerir um termo por Pull Request";
  - "Queremos que quem não saiba de GitHub possa sugerir termos".
- **Requisitos (revisados em 28/09, PR #27):** RF04, "Sugestão de termo via Pull Request e Issue", na R1; RF10, "Formulário de sugestão no site", na R2+.
- **Matriz impacto × esforço:** "Contribuir tanto por github quanto formulário" (alto impacto, alto esforço).
- **Benchmark (PR #26):** aponta "contribuição via formulário" como diferencial.
- **Estado atual:** o modelo `sugerir-termo.md` existia desde 14/09 (commit `a2e2ee2`). O PR #29 (issue #24) o substitui por `adicionar-termo.md` e `corrigir-definicao.md`, e as issues #30 e #31 já usam os dois.

## Decisão
- Há **dois canais**, os dois dentro do GitHub:
  1. **Pull Request** editando `frontend/data/termos.json`, validado automaticamente pelo CI (ADR 0007);
  2. **Issue pelos modelos "Adicionar termo" e "Corrigir definição"**, que funcionam como o "formulário". Alguém do time converte a issue em termo. O site leva a esses modelos já com o termo no título.
- **Não há formulário próprio no site**, porque exigiria um backend ou serviço para receber os dados, o que contraria a ADR 0001. A revisão dos requisitos de 28/09 confirma isso: o formulário no site virou RF10, planejado para R2+.
- Melhoria futura (não bloqueante para a Release 1): avaliar migração dos templates `.md` de termo para **Issue Form (YAML)** com campos obrigatórios.

## Alternativas descartadas
- **Formulário no site enviando para uma API própria.** Precisa de backend, hospedagem e proteção contra spam.
- **Google Forms.** Não pede conta GitHub, mas os dados ficam fora do repositório e sem revisão rastreável até alguém copiá-los.

## Consequências
- (−) **Limitação aceita para o escopo atual:** o canal por issue ainda exige conta no GitHub, atendendo parcialmente a história "quem não saiba de GitHub"; caso a equipe decida ampliar o canal em releases futuras, uma alternativa externa (como formulário estático/Google Forms) pode ser reavaliada em nova ADR.
- (+) Toda sugestão fica pública, rastreável e revisada antes de publicada.
- (+) Desde 28/09 o próprio app leva ao formulário. Há link no rodapé de todas as páginas e, quando a busca não encontra nada, um "Sugerir este termo" com o termo já preenchido no título da issue.
