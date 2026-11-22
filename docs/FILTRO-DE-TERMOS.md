# Filtro de termos do robô

O robô lê páginas oficiais da UnB e a lista de siglas do PDI. Nem toda sigla dessas fontes é da universidade: o PDI também explica termos como Covid-19, IPCA e TCU. O filtro impede que eles entrem no glossário. A decisão está na [ADR 0014](adr/0014-filtro-de-termos-do-robo.md).

## Como funciona

```text
Fontes oficiais → deduplicação → lista fixa → Gemini → PR do robô → revisão de uma pessoa → main
```

| Camada | O que faz | Onde fica |
|---|---|---|
| Lista fixa | Barra o que já se sabe que não é da universidade, sem usar o Gemini | `coleta/filtro-de-termos.json`, seção `fora_do_escopo` |
| Gemini | Avalia o que a lista não conhece. Na dúvida, deixa passar | `coleta/prompts/classificar-v2.md` |
| Revisão humana | Confere o que entrou e o que foi barrado | PR `feat(dados): coleta semanal de termos` |

O robô nunca faz merge.

## Como revisar o PR do robô

1. Leia **Termos para revisão** e confira a definição e o exemplo de cada termo novo.
2. Abra **Barrados pelo Gemini** e confira cada um.
3. Se um termo barrado for da universidade, adicione em `liberados`, com o motivo.
4. Se o Gemini acertou, adicione em `fora_do_escopo`, com o motivo.
5. Em **Alterações recusadas**, confira se o texto publicado continua sendo o certo.

## Como mudar o filtro

Edite `coleta/filtro-de-termos.json` num PR. Cada item é `"chave": "motivo"`, e o motivo é obrigatório.

```json
{
  "versao": 1,
  "fora_do_escopo": { "covid19": "Saúde em geral" },
  "liberados": { "libras": "Curso e serviço presentes na UnB" },
  "alteracoes_recusadas": { "fav": "O PDF traz o nome com erro" }
}
```

- `fora_do_escopo` e `liberados` usam a chave da sigla: minúsculas, sem acento, sem espaço e sem pontuação (`Covid-19` vira `covid19`).
- `alteracoes_recusadas` usa o `id` do termo publicado.
- Um termo não pode estar em `fora_do_escopo` e em `liberados` ao mesmo tempo. O teste acusa.

## Quando o Gemini está sobrecarregado ou sem cota

O robô usa o `gemini-3.8-flash`. Se ele responder que está sobrecarregado (503) ou que a cota do dia acabou (429), o robô passa para o `gemini-3.5-flash-lite` até o fim da rodada. A linha "Modelos que responderam", no PR, mostra quantos termos cada um respondeu. Para trocar os modelos sem mudar código, use as variáveis `GEMINI_MODELO` e `GEMINI_MODELO_RESERVA`.

## Como conferir

```bash
npm test
npm run coleta:completa
```

Sem `GEMINI_API_KEY`, a lista fixa continua valendo, mas os termos novos ficam sem classificação e não entram no `termos.json`.
