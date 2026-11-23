# Spike — bot de siglas a partir do PDF da DPO

> Issue: #54 · Épico: #47 · Sprint 04 · Responsável: Ítalo · Data: 18/11/2026

## Objetivo

Testar, em pequeno, se dá para extrair as siglas da Lista de Siglas da DPO (PDI UnB 2023–2028) antes de construir o coletor de verdade (E1-3). O spike tinha timebox de até 2 dias e o código podia ser descartado; o que importa é o aprendizado para a #55.

## Fonte testada

- **URL:** `https://planejamento.unb.br/images/Central_de_Conte%C3%BAdos/PDI_UnB__2023_2028.pdf`
- **Arquivo:** `PDI_UnB_2023_2028.pdf`
- **Tamanho:** 11.028.902 bytes
- **Páginas:** 186
- **PDF:** versão 1.4, produtor `iLovePDF`, idioma `pt-BR`
- **Lista de siglas:** páginas 5 a 8, em 4 colunas (cerca de 434 linhas de texto)

O download direto devolveu o PDF neste teste (header `%PDF-1.4`). Ainda assim, o coletor da #55 deve validar o header e o `content-type`, porque a mesma URL já retornou HTML em outra tentativa. Não se deve entregar o arquivo ao parser só pelo status 200.

## Bibliotecas testadas

Testes feitos em Node 24.21.0 no Windows, sem GPU. Os tempos incluem abrir o arquivo e extrair o texto; não são benchmark rigoroso.

| Biblioteca | Versão | Como foi usada | Resultado | Tempo |
|---|---|---|---|---|
| `pdf-parse` | 2.4.5 (usa `pdfjs-dist` 5.4.296) | `PDFParse.getText()` | 186 páginas, 527.685 caracteres; texto com quebras de linha; a ordem das colunas falha em alguns pontos | ~2,56 s |
| `pdfjs-dist` | 5.4.296 | `getDocument()` + `getTextContent()` | 186 páginas, 548.905 caracteres; cada item traz `x`, `y`, fonte e largura; exige reconstrução do layout | ~2,49 s |
| `pdfjs-dist` | 6.5.438 | import direto no Node | Falhou: API 6.5.438 não combina com Worker 5.4.296 (duas versões instaladas) | — |

O `pdf-parse` é uma camada de conveniência sobre o `pdfjs-dist`. Para o spike, ele foi o caminho mais rápido para ter texto. Para a #55, porém, os itens com coordenadas do `pdfjs-dist` são o que permitem separar as colunas e as linhas quebradas.

## Método

1. Baixar o PDF e conferir o header.
2. Extrair o texto com `pdf-parse` e os itens posicionados com `pdfjs-dist` 5.4.296.
3. Selecionar uma amostra manual de **30 siglas** (32 entradas, porque `CPP` e `SIC` têm duas definições cada), incluindo casos difíceis: hífen, número, `&`, acento, maiúsculas/minúsculas, descrição quebrada em várias linhas e sigla duplicada.
4. Comparar cada entrada da amostra com o texto do PDF.
5. Testar duas formas de estruturar os dados: parser ingênuo, linha a linha, e parser por coordenadas/colunas.

A amostra foi escolhida de propósito para incluir casos difíceis; ela não é aleatória e, portanto, a taxa abaixo não deve ser lida como estimativa para a lista inteira.

## Amostra de 30 siglas

| # | Sigla | Significado conferido no PDF | Extração |
|---|---|---|---|
| 1 | `A3M` | Programa Aprendizagem 3° Milênio | OK |
| 2 | `ABED` | Associação Brasileira de Educação a Distância | OK |
| 3 | `ADM-BCE` | Coordenadoria de Administração e Orçamento da BCE | OK |
| 4 | `Andifes` | Associação Nacional dos Dirigentes das Instituições Federais de Ensino Superior | OK |
| 5 | `APCNs` | Avaliação das Propostas de Cursos Novos | OK |
| 6 | `AUGM` | Associação de Universidades do Grupo Montevidéu | OK |
| 7 | `BDCE` | Biblioteca Digital de Coleções Especiais | OK |
| 8 | `BEPA` | Banca Examinadora de Professor Associado | OK |
| 9 | `BSAN` | Bloco de Salas de Aula Norte | OK |
| 10 | `CAPES` | Coordenação de Aperfeiçoamento de Pessoal de Nível Superior | OK |
| 11 | `CAREL-UnB` | Centro de Relações Internacionais UnB | OK |
| 12 | `CBMDF` | Corpo de Bombeiros Militar do Distrito Federal | OK |
| 13 | `CDG-UnB` | Comitê de Governança Digital | OK |
| 14 | `CGRIFES` | Colégio de Gestores de Relações Internacionais das Instituições Federais de Educação Superior | OK |
| 15 | `CNPq` | Conselho Nacional de Desenvolvimento Científico e Tecnológico | OK |
| 16 | `CoAC` | Coordenação de Arte e Cultura | OK |
| 17 | `Consuni` | Conselho Universitário | OK |
| 18 | `Copei` | Comitê de Pesquisa, Inovação e Extensão de combate à Covid-19 | OK |
| 19 | `CPP` | Câmara de Pesquisa e Pós-Graduação; Comissão Permanente de Projetos | OK (2/2) |
| 20 | `DPO` | Decanato de Planejamento, Orçamento e Avaliação Institucional | OK |
| 21 | `EaD` | Educação a Distância | OK |
| 22 | `eMAG` | Modelo de Acessibilidade em Governo Eletrônico | OK |
| 23 | `Enade` | Exame Nacional de Desempenhos dos Estudantes | OK |
| 24 | `FACE` | Faculdade de Administração, Contabilidade, Economia e Gestão Pública | OK |
| 25 | `FGA` | Faculdade do Gama | OK |
| 26 | `HIV` | Human Immunodeficiency Virus | OK |
| 27 | `IBICT` | Instituto Brasileiro de Informação em Ciência e Tecnologia | OK |
| 28 | `LEDOC` | Licenciatura em Educação do Campo | OK |
| 29 | `PIBIC-EM` | Programa Institucional de Bolsas de Iniciação Científica Ensino Médio | OK |
| 30 | `SIC` | Serviço de Informação ao Cidadão; Segurança da Informação e Comunicação | OK (2/2) |

## Taxa de acerto

| Abordagem | Acertos na amostra | Taxa |
|---|---|---|
| Texto bruto do `pdf-parse` (contém a sigla e o significado) | 30/30 siglas (32/32 entradas) | 100% |
| Parser ingênuo, linha a linha | 29/32 entradas | 90,6% |
| Parser por coordenadas/colunas (`pdfjs-dist`) | 30/30 siglas (32/32 entradas) | 100% |

No parser ingênuo, as 3 falhas foram `Andifes`, `CGRIFES` e `CNPq`: a segunda linha da descrição começa com uma palavra capitalizada (`Instituições`, `Internacionais`, `Científico`) e foi tratada como uma nova sigla. Isso mostra que o problema principal não é ler o texto, e sim reconstruir a estrutura.

O parser por coordenadas encontrou 323 entradas nas páginas 5–8. Esse total não foi auditado item a item; a amostra de 30 siglas é a evidência validada neste spike. A #55 deve conferir a lista completa.

## Problemas encontrados

1. **Layout em 4 colunas.** O `pdf-parse` às vezes intercala ou desordena colunas: por exemplo, `CE Biblioteca Central` aparece antes de `BDCE`, e `BDU` aparece depois de `CAREL-UnB`. Texto puro perde a noção de coluna.
2. **Descrição quebrada em várias linhas.** A continuação começa na mesma coordenada `x` da coluna da sigla e costuma ser um único item de texto. Uma regra baseada em “linha começa com maiúscula” falha (`Andifes`, `CGRIFES`, `CNPq`).
3. **Siglas duplicadas.** `CPP` e `SIC` têm dois significados. O resultado precisa ser uma lista de entradas, não um objeto indexado por sigla.
4. **Nome da fonte não é estável.** Dependendo da ordem de carregamento das páginas, a fonte da sigla aparece como `g_d0_f1` ou `g_d0_f4`. Não se deve fixar o nome da fonte no código; o mais seguro é usar a estrutura dos itens (posição e quantidade) ou detectar o estilo de forma relativa.
5. **Cabeçalhos e rodapés.** `XX`, `LISTA DE SIGLAS E ABREVIAÇÕES`, `+` e “Para acessar a lista de quadros...” precisam ser filtrados.
6. **Conflito de versões do `pdfjs-dist`.** Com 6.5.438 e 5.4.296 no mesmo `node_modules`, o import direto falhou com “API version 6.5.438 does not match Worker version 5.4.296”. A #55 deve fixar uma versão só.
7. **URL pode devolver HTML.** O coletor deve validar `%PDF` e `content-type` antes de chamar o parser, com erro claro se vier HTML.
8. **Textos mistos e símbolos.** Há descrições em inglês, acentos, `3°`, `Covid-19`, `&`, `/` e hífen. Normalização agressiva pode perder informação.

## Recomendação para a #55

**Biblioteca:** usar `pdfjs-dist` diretamente, em versão fixa (a 5.4.296 funcionou; ou uma versão estável mais nova, sem misturar versões), com o build `legacy/build/pdf.mjs` no Node. O `pdf-parse` serve para um primeiro protótipo, mas não expõe as coordenadas dos itens e não é a melhor base para o parser final.

**Abordagem:**

1. Ler os itens de texto de cada página com `getTextContent()`.
2. Separar as 4 colunas pela coordenada `x` do início da linha. Neste PDF, limites como `[250, 490, 710]` funcionaram; o ideal é calcular os limites a partir das posições das siglas, não fixar no código.
3. Dentro de cada coluna, agrupar por `y` e ordenar de cima para baixo.
4. Considerar início de entrada quando a linha tem pelo menos dois itens, o primeiro é um token sem espaço na borda esquerda da coluna e os demais formam a descrição. Caso contrário, concatenar a linha à descrição anterior.
5. Manter uma lista de entradas, preservando duplicidades.
6. Filtrar cabeçalhos, rodapés e a página de créditos.
7. Testar com uma fixture JSON dos itens das páginas 5–8 (ou de uma amostra reduzida), sem baixar o PDF de 11 MB no CI.

A biblioteca escolhida precisa entrar na lista fechada da ADR 0010 no PR da #55, com o motivo “leitura de PDF com coordenadas de texto”. O `package.json` e o `package-lock.json` também devem ser atualizados no mesmo PR.

## Conclusão

O spike é viável. O PDF é legível, o texto contém todas as 30 siglas da amostra e o parser por coordenadas acertou 32/32 entradas. O risco maior não está na extração, mas na reconstrução das colunas e na validação da lista completa. A recomendação é seguir com `pdfjs-dist` + parser por colunas/linhas na #55, com fixture de teste e validação de `%PDF` no coletor.
