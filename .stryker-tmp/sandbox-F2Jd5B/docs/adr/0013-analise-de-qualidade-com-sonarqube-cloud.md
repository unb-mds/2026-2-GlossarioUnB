# ADR 0013 — Análise de qualidade com o SonarQube Cloud, ao lado do CI

## Status
Decidida pelo Pedro em 10/11/2026, responsável pela issue #106, e em uso desde o PR #107, que entrou na `main` em 17/11/2026. Esta ADR registra a decisão depois do fato. A revisão deste PR confere o registro.

## Contexto
- **A porta de qualidade do plano de ensino 2026/2:** sem vulnerabilidade crítica ou alta na análise estática de segurança (SAST), a release não é aprovada.
- **O pipeline pedido para a MDS (aula de 21/10):** build → teste unitário → teste de integração → qualidade de código → cobertura. O SonarQube e o linter foram as dicas de ferramenta da aula.
- **O CI da [ADR 0007](0007-github-pages-e-ci-com-actions.md) roda os testes**, mas não lê o código sem rodar: não aponta vulnerabilidade, código difícil de manter (code smell) nem duplicação, e a cobertura não aparecia em lugar nenhum.
- **A organização `unb-mds` já existe no SonarQube Cloud**, mas ligar um repositório a ela pede alguém que seja dono da organização, e ninguém do G10 é. Outros grupos da disciplina (2026-1-Guard.IA e 2026.1-ContraDito) usaram uma organização própria, com o token guardado como segredo do Actions.
- **O plano gratuito do SonarQube Cloud** cobre projeto público sem limite de linhas.

## Decisão
- **Um job próprio**, "Qualidade (SonarQube Cloud)", em `.github/workflows/sonar.yml`, roda em todo PR de branch deste repositório e em todo push na `main`. Ele roda os mesmos testes `node:test` com cobertura, grava `coverage/lcov.info` e manda o código e a cobertura para a análise.
- **Organização `p-magno`, projeto público `p-magno_glossario-unb`** (`sonar-project.properties`). Qualquer pessoa abre o painel sem conta. A análise lê `frontend/`, `sobre/`, `scripts/` e `coleta/`, e os testes de `tests/`.
- **O token é o segredo `SONAR_TOKEN` do repositório**, nunca o código. PR vindo de fork não roda o job, porque fork não recebe segredo. Sem o segredo, só o passo do scan é pulado, e o check não fica vermelho.
- **A régua é o quality gate padrão "Sonar way"**, que olha só o código novo de cada PR (as linhas que ele muda): cobertura de pelo menos 80%, até 3% de linhas duplicadas, nota A em segurança, confiabilidade e manutenção, e todos os pontos sensíveis de segurança (hotspots) revisados.
- **Não substitui o CI da ADR 0007.** O check obrigatório continua sendo "Testes e validação dos termos", e é ele, junto com a proteção da `main` (1 aprovação e conversas resolvidas), que barra o merge. O check do SonarQube não é obrigatório: um vermelho dele é um aviso para o revisor.

## Alternativas descartadas
- **Projeto na organização `unb-mds`.** É o lugar natural para a disciplina, mas depende de um dono da organização. Continua sendo o caminho de volta (ver "Como desfazer").
- **Só o CI da ADR 0007.** Não faz análise estática de segurança, e a porta de qualidade pede essa análise.
- **A análise automática do SonarQube Cloud, sem workflow.** Não precisa de Actions, mas não lê o relatório de cobertura dos testes.
- **SonarQube Server, instalado por nós.** Pede um servidor ligado o tempo todo, e o projeto não tem servidor (ADR 0001 e ADR 0007).
- **Só o SonarQube for IDE, no editor de cada pessoa.** Ajuda quem escreve o código, mas não deixa registro no PR nem histórico da `main`. Continua recomendado como complemento.

## Consequências
- (+) Cada PR mostra no próprio GitHub a nota de segurança, confiabilidade e manutenção, a duplicação e a cobertura do código novo.
- (+) A `main` ganha um histórico: cada merge vira um ponto no gráfico do painel. Na primeira análise (18/11/2026, commit `74d1256`): 0 bugs, 0 code smells, 1,6% de duplicação, 77,4% de cobertura e 3 vulnerabilidades, sendo 2 de severidade baixa (o Leaflet sem `crossorigin` em `frontend/termo.html`) e 1 bloqueadora (redirecionamento aberto em `scripts/servidor-local.mjs`), que a porta de qualidade barra até ser corrigida.
- (−) O projeto mora numa conta pessoal (`p-magno`). Se o Pedro sair, alguém precisa recriar o projeto em outra organização e trocar o segredo.
- (−) É um serviço externo: se o SonarQube Cloud estiver fora do ar, o job falha. Como o check não é obrigatório, o merge não trava.
- (−) O job baixa o histórico inteiro do Git (`fetch-depth: 0`), para o SonarQube saber qual linha é nova. A execução fica um pouco mais lenta.

## Como desfazer
- **Levar para a `unb-mds`:** um dono da organização cria o projeto lá; no `sonar-project.properties` mudam `sonar.organization` e `sonar.projectKey`, e o segredo `SONAR_TOKEN` é trocado por um token novo. O workflow não muda.
- **Desligar:** apagar `.github/workflows/sonar.yml` e `sonar-project.properties` (e o selo do README, se houver). O CI da ADR 0007 continua igual, e nenhum código do produto muda.
