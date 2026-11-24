# language: pt
# Critérios de aceitação da busca (E2). Fonte: docs/VISAO-DE-PRODUTO.md, US02 (PR #119).
@E2
Funcionalidade: Encontrar um termo pela busca
  Como calouro, quero encontrar um termo pelo nome que as pessoas usam,
  para entender a sigla e não só ler uma definição solta.

  @US02 @issue-48 @RF01
  Cenário: busca por uma sigla leva à página do termo
    Dado que o calouro abre a página inicial
    Quando ele busca "deg"
    Então a primeira sugestão é "DEG"
    Quando ele escolhe a primeira sugestão pelo teclado
    Então ele vê a página do termo "DEG"
    E ela mostra o significado do termo

  @US02 @issue-48 @RF04
  Cenário: busca sem resultado oferece sugerir o termo
    Dado que o calouro abre a página inicial
    Quando ele busca "xilofonequimico"
    Então o glossário avisa que nenhum termo foi encontrado
    E oferece o link "Sugerir este termo"

  # Desde a coleta de 22/11 a FGA tem um termo próprio, que explica que ela virou a FCTE
  # (melhoria pedida no teste com calouro, #76). Este cenário confere isso.
  @US02 @issue-76 @RF01
  Cenário: busca pelo nome antigo FGA explica que agora é FCTE
    Dado que o calouro abre a página inicial
    Quando ele busca "FGA"
    Então a primeira sugestão é "FGA"
    Quando ele escolhe a primeira sugestão pelo teclado
    Então ele vê a página do termo "FGA"
    E ela menciona "FCTE"

  # O cenário da US02 como está na visão de produto (FGA como sinônimo dentro do termo
  # FCTE) continua pendente: depende do campo "sinonimos" (#64, PR #98, do Zé), que a
  # main ainda não tem. Para ativar, apague a tag @skip e rode npm run test:aceitacao.
  @skip @pendente @US02 @issue-63 @issue-64 @RF02
  Cenário: busca por um nome antigo (FGA leva à FCTE)
    Dado que o calouro abre a página inicial
    E que "FGA" é um sinônimo de "FCTE" no glossário
    Quando ele busca "FGA"
    Então a primeira sugestão é "FCTE"
    Quando ele escolhe a primeira sugestão pelo teclado
    Então ele vê a página do termo "FCTE"
    E ela mostra o significado do termo
