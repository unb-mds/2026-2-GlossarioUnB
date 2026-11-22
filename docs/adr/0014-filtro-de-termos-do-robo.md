# ADR 0014 — Filtro de termos do robô

## Status
Decidida em 21/11/2026 por mim (Pedro), responsável pela primeira rodada real do robô (#62). A revisão do PR é a validação do grupo.

## Contexto
- **A lista de siglas do PDI traz siglas que não são da universidade.** O documento explica termos que ele mesmo cita, como Covid-19, IPCA, TCU e LED. Numa conferência manual dos termos que o robô traria, 54 siglas não tinham relação com a UnB nem com a vida universitária.
- **O classificador não sabia recusar um termo.** Toda resposta válida do LLM virava "revisar", então esses termos chegariam ao PR como candidatos normais.
- **O PDF também traz nomes com erro.** A FAV aparece como "Agronomia de Medicina Veterinária", e o robô proporia trocar o nome certo que já está publicado.
- **Revisar até 100 termos por PR sem nenhuma triagem é pouco confiável**, e o glossário é para calouros: um termo fora de lugar tira a confiança no resto.

## Decisão
O filtro tem três camadas, nesta ordem:

1. **Lista fixa (`coleta/filtro-de-termos.json`, seção `fora_do_escopo`).** Barra o que já se sabe que não é da universidade, antes do LLM, sem gastar chamada e sem depender da chave.
2. **LLM (prompt `classificar-v2`).** Responde se o termo é pertinente e por quê. Na dúvida, deixa passar para a revisão. Uma recusa vale enquanto o significado na fonte for o mesmo, para o termo não gastar chamada toda semana.
3. **Revisão humana no PR do robô.** O PR mostra o que foi barrado, por quem e por quê. A decisão de uma pessoa vale mais que a do LLM: o que entra em `liberados` passa mesmo que o LLM recuse.

A seção `alteracoes_recusadas` guarda as mudanças que uma pessoa já recusou, com o motivo, para o robô não propor de novo o mesmo erro da fonte.

### Quando o modelo está sobrecarregado ou sem cota (decisões 48 e 49)
O robô usa o `gemini-3.8-flash` e, se ele responder que está sobrecarregado (erro 503) ou que a cota acabou (erro 429), passa para o `gemini-3.5-flash-lite` até o fim da rodada. No Gemini gratuito cada modelo tem a sua cota, então a reserva continua respondendo. Chave inválida não aciona a reserva. O PR mostra quantos termos cada modelo respondeu. Em 21/11/2026, o modelo principal ficou cerca de uma hora sobrecarregado e depois sem cota; com as mesmas 30 siglas, o reserva barrou as 12 de fora da UnB e aceitou as 12 da UnB.

## Alternativas descartadas
- **Só a lista fixa.** Previsível, mas uma sigla nova fora da lista dependeria só da revisão.
- **Só o LLM.** Pega siglas novas, mas pode errar e deixa de filtrar quando a chave ou a cota falham.
- **Lista só do que pode entrar.** Barraria siglas legítimas novas até alguém liberar.
- **Esperar o modelo principal voltar.** Uma sobrecarga na segunda de manhã deixaria a rodada sem termos novos.
- **Outro provedor de IA.** Exigiria outra biblioteca, outra chave e mudar a ADR 0010 a poucos dias da R2.
- **Só revisão humana.** Não muda código, mas põe até 100 termos sem triagem em cada PR.

## Consequências
- (+) O filtro continua funcionando sem a chave do Gemini, pela lista fixa.
- (+) Nada é apagado em silêncio: tudo o que foi barrado aparece no PR e em `coleta/relatorio.json`.
- (+) Toda decisão fica versionada, com o motivo, num arquivo que qualquer pessoa pode corrigir por PR.
- (−) A lista precisa de manutenção quando uma fonte nova trouxer outro tipo de sigla.
- (−) O LLM pode recusar um termo válido. Nesse caso, a pessoa que revisa põe o termo em `liberados`.
