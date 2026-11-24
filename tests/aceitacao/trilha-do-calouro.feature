# language: pt
# Critérios de aceitação da trilha do calouro (E3). Fonte: docs/VISAO-DE-PRODUTO.md, US03 (PR #119).
@E3
Funcionalidade: Primeiros passos na UnB

  @US03 @issue-49 @issue-69 @issue-70 @RF02
  Cenário: calouro abre o glossário na primeira semana
    Dado que o calouro abre a página inicial
    Então ele vê a trilha "Primeiros passos na UnB"
    E a trilha traz os termos essenciais "RU", "BCE", "SIGAA" e "Menção"

  @US03 @issue-49 @issue-70 @RF02
  Cenário: calouro abre um termo da trilha
    Dado que o calouro abre a página inicial
    Quando ele abre o termo "RU" da trilha
    Então ele vê a página do termo "RU"
    E ela mostra o significado do termo
    E ela mostra um exemplo de uso
