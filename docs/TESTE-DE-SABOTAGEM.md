# Teste de sabotagem

O plano de ensino de MDS pede **teste de sabotagem em 100% dos módulos críticos**: a suíte precisa quebrar quando alguém introduz um defeito de propósito. Cobertura mostra o que rodou; a sabotagem mostra se os testes conferem de verdade.

```bash
npm run test:sabotagem
```

Roda no CI depois do `npm test`, no mesmo job ("Testes e validação dos termos"). Leva poucos segundos (uns 4 no Mac).

## Como funciona

Cada item de `tests/sabotagens/*.json` descreve um defeito que uma pessoa poderia introduzir sem perceber. O script `scripts/sabotagem.mjs`, para cada item:

1. troca o trecho indicado no arquivo pelo defeito;
2. roda a suíte inteira (`node --test`);
3. desfaz a troca, sempre, mesmo com erro ou Ctrl+C;
4. anota se a suíte **quebrou** (o esperado) ou **passou** (o teste não pegou o defeito).

O CI falha se algum defeito passar, ou se o trecho de algum item não existir mais no código (`NÃO APLICADA`). Cada trecho precisa aparecer **exatamente uma vez** no arquivo, para o defeito cair no lugar pensado. No GitHub, a tabela de resultados aparece no resumo da execução (Actions → a execução → Summary).

## Módulos críticos

| Lista | Módulos | Por que são críticos |
|---|---|---|
| `dominio.json` | `frontend/js/termos.js`, `frontend/js/validacao-termo.js`, `frontend/js/ficha.js`, `frontend/js/trilha.js` | A busca (nome, sinônimos e assunto com corte de ruído), os filtros, a trilha e o schema que o CI usa para barrar termo inválido (RNF06) |
| `robo.json` | `coleta/coletor-html.js`, `coleta/deduplicar.js`, `coleta/classificador.js` | A coleta responsável (robots.txt, 1 s entre pedidos, user-agent) e a deduplicação que decide o que vira PR (ADR 0009) |
| `servidor.json` | `scripts/servidor-local.mjs` | Segurança: o redirecionamento aberto apontado pelo SonarQube (regra S5146) |
| `tela.json` | `frontend/js/busca.js`, `lista.js`, `ficha.js`, `tema.js` | As regras de cada página (incluindo o filtro "Só com mapa ou planta"), tiradas do `app.js` |
| `origem.json` | `frontend/js/origem.js` | O boletim público "De onde vêm os dados" e a checagem de origem oficial da UnB |
| `planta.json` | `frontend/js/planta.js` | Escape de SVG, ligação termo-sala, detecção de duplicata e busca de salas na planta 2D da FCTE |

Na Release `v2.0.0` eram **36 de 36** defeitos barrados; com os PRs `#190`, `#191` e `#192` da `v2.1.0`, a suíte passa a barrar **42 de 42** defeitos propositais.

**Fora da lista, de propósito:** o `app.js` e o `sw.js` só rodam no navegador e não têm teste unitário. Um defeito neles (texto do termo entrando como HTML, Enter que não abre o termo) passa pela suíte: quem pega são os testes ponta a ponta da #78.

## Adicionar uma sabotagem

Junto com um módulo crítico novo, ou quando um teste novo cobre um defeito que importa:

```json
{
  "modulo": "frontend/js/termos.js",
  "defeito": "a busca deixa de ignorar acentos",
  "arquivo": "frontend/js/termos.js",
  "trocas": [{ "de": ".normalize(\"NFD\")", "para": ".normalize(\"NFC\")" }]
}
```

- `defeito`: o que dá errado para quem usa, em uma frase.
- `trocas`: o trecho original e o defeituoso. Pode haver mais de uma troca no mesmo arquivo.
- Rode `npm run test:sabotagem`. Se o novo item **passar**, falta um teste: escreva o teste, e não apague a sabotagem.

**Se o CI acusar `NÃO APLICADA`** depois de uma refatoração, atualize o trecho do item para o código novo, mantendo o mesmo defeito.

## O que o piloto achou (18/11/2026)

- **O teste do servidor local não pegava a volta do redirecionamento aberto** com barras codificadas antes da pasta (`/%2F%2Fexemplo.com/frontend`). O teste ganhou essa entrada no #128.
- **Um defeito que não muda nada:** tirar o `idsUsados.add(id)` do `idLivre` não altera nenhum resultado, porque dois candidatos do mesmo lote nunca disputam o mesmo id. É o que o teste de mutação chama de *mutante equivalente*. A sabotagem da deduplicação mira em outros dois defeitos, o limite de 60% e a junção do mesmo termo vindo de duas fontes.

## Relação com o teste de mutação (#82)

São duas métricas do plano de ensino. A sabotagem usa poucos defeitos escolhidos, os que importam para quem usa o site e o robô, e roda em todo PR. O teste de mutação (StrykerJS, na #82) gera centenas de defeitos sozinho e mede o escore (≥ 50% nos módulos críticos). Ele vem depois e não substitui esta lista.

## Decisão

Decidido pelo Pedro em 18/11/2026, entre registro à mão, lista automática no CI, só o StrykerJS ou a lista agora e o StrykerJS depois: "Vamos seguir então com o plano de B e posterior ao PR do Allan #82". O registro está em `AI-USAGE.md`.
