# Fontes de dados de termos da UnB

O catálogo de onde tirar termos para o glossário: o que cada fonte tem, em que formato, se o robô de coleta ([ADR 0009](adr/0009-coleta-automatizada-por-pipeline.md)) consegue ler sozinho e qual vem primeiro.

Levantamento de 17 e 18/11/2026. Cada endereço foi aberto nesses dias, e as datas vêm do próprio arquivo (data de criação do PDF) ou da página. Se um link parar de funcionar, atualize a linha e a data.

## Resumo

| # | Fonte | Formato | Termos (estimativa) | Coleta automática | Prioridade |
|---|---|---|---|---|---|
| 1 | Portal da UnB: páginas de Decanatos e Secretarias | HTML | 17 siglas | **Sim** | 1 |
| 2 | Glossário de unidades e órgãos da UnB (TermiTraDiCo), citado pela professora na R1 | HTML | 89 siglas, com nome em inglês | **Parcial** | 2 |
| 3 | Listas de siglas da DPO: PDI 2023–2028 (no ar) e Relatório de Gestão 2024 (só no Wayback) | PDF | ~285 e ~300 siglas | **Parcial** | 3 |
| 4 | Manual do Calouro 2026/2 (DEG) | PDF | ~30 termos de vida acadêmica | **Parcial** | 4 |
| 5 | Sites dos serviços (RU, BCE, SAA, DDS, DASU, SIGAA, Aprender 3) | HTML | 1 termo por site | **Parcial** | 5 |
| 6 | Estatuto e Regimento Geral da UnB | PDF | ~10 siglas e as menções | **Parcial** | 6 |
| 7 | Guia do Estudante: Avaliação Socioeconômica 2026 (DDS) | PDF | ~10 siglas da UnB | **Parcial** | 7 |
| 8 | Mapa dos campi (UnB Notícias) | PDF | 38 lugares com sigla | **Parcial** | 8 |
| 9 | Portal de Boas-vindas | HTML | poucos (aponta para os decanatos) | **Sim** | 9 |
| 10 | Manual para Estudantes 2022 e Guias do Calouro 2019 (DEG) | PDF | já cobertos pelo nº 4 | **Não** | 10 |
| 11 | SIGAA, páginas públicas | HTML gerado na hora | siglas de departamentos e cursos | **Não** | 11 |
| 12 | Lista de termos do Arquivo Central | PDF | 0 (é índice de assuntos) | **Não** | fora |
| 13 | Centro Lexterm (terminologia, IL/UnB) | não encontrado | ? | **Não** | referência |

Fora do catálogo, mas citados como referência de **formato** (não são da UnB): o [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg) e o Guia Viver UFMG, comparados no [`BENCHMARK.md`](BENCHMARK.md).

## Regras que valem para todas

- **`robots.txt`:** os sites em WordPress da UnB (`deg`, `dpo`, `saa`, `ru`, `bce`, `dds.dac`, `boasvindas`, `arquivocentral`) só bloqueiam `/wp-admin/`. O portal `unb.br` (Joomla) só bloqueia pastas de sistema (`/administrator/`, `/cache/`, `/components/`, `/modules/` e outras). O `sigaa.unb.br` não tem `robots.txt` (404). O coletor lê o `robots.txt` antes de cada página (`robots-parser`, ADR 0010).
- **Termos de uso:** os sites trazem "Copyright © 2026 - Universidade de Brasília. Todos os direitos reservados." e nenhum mostra licença aberta. Por isso o glossário escreve a definição com as próprias palavras e guarda o link da fonte em `fonte`. Não copiamos trechos longos.
- **Frequência:** quase nenhuma página mostra a data da última mudança. Os PDFs, sim. Por isso a tabela usa a data de criação do arquivo.

## Catálogo

### 1. Portal da UnB: Decanatos e Secretarias

- **Endereços:** <https://unb.br/administrativo-rodape/decanatos> e <https://unb.br/administrativo-rodape/secretarias>
- **Formato:** HTML. Cada item é um nome por extenso com a sigla.
- **Termos:** 17 siglas na coleta de 11/11/2026, 12 delas novas para a base.
- **Atualização:** muda quando a estrutura da UnB muda. A página não mostra data.
- **Coleta automática: sim.** São as duas fontes do `coleta/fontes.json` do coletor genérico (#56, PR #111).
- **Prioridade 1:** já funciona e é a mesma origem das 40 siglas da R1 (sites `*.unb.br`).

### 2. Glossário de unidades e órgãos da UnB (TermiTraDiCo)

- **Endereço:** <https://termitradico.unb.br/recursos/2-publicacoes/54-glossario-unidades-unb>
- **Quem fez:** o grupo de pesquisa **TermiTraDiCo** (Terminologia e Tradução Direcionadas por Corpus), do POSTRAD e do Instituto de Letras, coordenado pela Profa. Elisa Duarte Teixeira (<https://termitradico.unb.br/>). Foi compilado na disciplina de Prática de Tradução PT-EN do 1º/2017, a partir do livro "Registro Arquitetônico da UnB".
- **É a fonte que a professora citou na R1** ("um grupo de pesquisa […] que o trabalho deles é fazer esse dicionário […] um glossário da UnB inteiro da sigla"). A transcrição tinha registrado o nome como "termina tradito".
- **Formato:** HTML, uma tabela de 3 colunas (sigla, nome em português, nome em inglês).
- **Termos:** 89 siglas de unidades, órgãos e associações (ADUnB, BCE, Cespe, UEP, UISS…), com o nome em inglês.
- **Atualização:** de 2017, sem sinal de revisão depois.
- **`robots.txt`:** o mesmo padrão do portal (Joomla), que só bloqueia pastas de sistema.
- **Coleta automática: parcial.** A tabela é limpa, mas o coletor genérico (#56) lê cada linha como um texto só ("ADUnB Associação dos Docentes da UnB Association of UnB Professors"), sem separar as colunas. Precisa de um leitor por coluna no coletor, que é código novo e pequeno. Testado em 18/11 com o coletor do PR #111.
- **Prioridade 2:** foi indicada pela professora como "banco de dados inicial", está no ar e traz o nome em inglês, que serve para os intercambistas se a interface ganhar inglês (i18n).

### 3. Listas de siglas da DPO (Relatório de Gestão e PDI)

A DPO publica uma lista de siglas no Relatório de Gestão e outra no Plano de Desenvolvimento Institucional (PDI). São as listas oficiais mais completas.

| Lista | Endereço | No ar? | Siglas |
|---|---|---|---|
| **PDI 2023–2028**, "Lista de Siglas e Abreviações" (p. 5 a 8 de 186) | <https://planejamento.unb.br/images/Central_de_Conte%C3%BAdos/PDI_UnB__2023_2028.pdf> | **sim** | ~285 |
| Relatório de Gestão 2024, "Lista de Abreviaturas e Siglas" (10 p., março/2025) | `https://dpo.unb.br/images/dpl/2025/Lista_de_siglas_2024.pdf` dá 404; [cópia no Wayback (05/10/2025)](http://web.archive.org/web/20251005225538/https://www.dpo.unb.br/images/dpl/2025/Lista_de_siglas_2024.pdf) | só a cópia | ~300 |
| Relatório de Gestão 2019 | [cópia no Wayback](https://web.archive.org/web/2id_/https://www.dpo.unb.br/images/dpl/Lista_de_Siglas_2019.pdf) | só a cópia | ~280 |

- **O que o PDI tem a mais:** siglas de programas e bolsas (PIBIC, PET, PEC-G, Pibex), de sistemas (SIGAA), de laboratórios, núcleos e coordenadorias, e siglas repetidas com sentidos diferentes (CPP, POP, SIC). Ele precisa de regra para escolher o sentido certo.
- **Para que serve a de 2019:** achar siglas que mudaram de nome. Por exemplo, a ACT era "Agência de Comercialização de Tecnologia" e, na lista de 2024, virou "Núcleo de Comercialização de Tecnologia".
- **Lacunas:** a lista de julho/2022 não está no ar nem no Wayback. O Relatório de Gestão 2025 ([repositório da DPO](https://repositoriodpo.unb.br/relatorios/relatorio-de-gestao-2025/), 178 páginas, 114 MB) não traz a lista como texto.
- **Coleta automática: parcial.** O texto sai do PDF. A lista de 2024 tem uma sigla por linha e é a mais fácil de ler, mas só existe a cópia. No PDI, a lista vem em quatro colunas e as linhas longas continuam na linha de baixo. As duas trazem siglas de fora da UnB (ABNT, AGU, ANATEL), que precisam de filtro. É a fonte do coletor de PDF (#55).
- **Prioridade 3:** são as listas oficiais mais completas, e o PDI é a mais recente que está no ar. Falta pedir à DPO o link novo da lista de 2024.

### 4. Manual do Calouro 2026/2 (DEG)

- **Endereço:** <https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf>, publicado em <https://deg.unb.br/manual-do-calouro/>
- **Formato:** PDF de 134 páginas (13,6 MB), criado em 25/05/2026.
- **Termos:** cerca de 30 termos da vida acadêmica, cada um explicado em linguagem de calouro: menções (p. 46 do PDF), IRA (p. 49), fluxo (p. 24), matrícula, rematrícula e matrícula extraordinária (p. 38), trancamento e TGM (p. 58 e 59), auxílios da assistência estudantil (p. 86 e 87), e-mail institucional, SIGAA e Aprender 3 (p. 14 e 15).
- **Atualização:** uma edição por semestre.
- **Coleta automática: parcial.** O texto sai do PDF, mas a diagramação em colunas mistura frases, e as definições são texto corrido. A pessoa cura o termo e o robô só confere se a página citada continua no ar.
- **Prioridade 4:** é a fonte principal da trilha do calouro (`docs/TRILHA-CALOURO.md`, #69).

### 5. Sites dos serviços

| Serviço | Endereço | Para o termo |
|---|---|---|
| Restaurante Universitário | <https://ru.unb.br/> | RU |
| Biblioteca Central | <https://bce.unb.br/> | BCE |
| Secretaria de Administração Acadêmica | <https://saa.unb.br/> | SAA |
| Diretoria de Desenvolvimento Social | <https://dds.dac.unb.br/> | DDS, auxílios |
| Diretoria de Atenção à Saúde da Comunidade Universitária | <https://dasu.unb.br/> | DASU |
| Decanato de Assuntos Comunitários | <https://dac.unb.br/> | DAC |
| SIGAA | <https://sigaa.unb.br/sigaa/public/home.jsf> | SIGAA |
| Aprender 3 (Moodle) | <https://aprender3.unb.br/> | Aprender 3 |
| Trancamento (DEG) | <https://deg.unb.br/trancamento/> | TGM |

- **Formato:** HTML (WordPress, menos o SIGAA e o Aprender 3).
- **Termos:** um por site, mais os serviços que ele lista.
- **Coleta automática: parcial.** O robô confirma que a página existe e lê o título. A definição é curada.
- **Prioridade 5:** é o `fonte` mais direto de cada termo, o link que o calouro vai abrir.

### 6. Estatuto e Regimento Geral da UnB

- **Endereço:** <https://unb.br/images/Documentos/Estatuto_e_Regimento_Geral_UnB.pdf>
- **Formato:** PDF de 83 páginas, gerado em 19/11/2025.
- **Termos:** cerca de 10 siglas (colegiados como CAD, órgãos como o ACE) e a escala de menções (SS, MS, MM, MI, II, SR) com valor de norma.
- **Atualização:** rara, por resolução do Conselho Universitário.
- **Coleta automática: parcial.** O texto sai limpo, mas tem poucas siglas e linguagem jurídica.
- **Prioridade 6:** serve de base oficial quando o manual e o site discordam.

### 7. Guia do Estudante: Avaliação Socioeconômica 2026 (DDS)

- **Endereço:** <https://dds.dac.unb.br/wp-content/uploads/2026/08/Guia_do_Estudante___Avaliacao_Socioeconomica_UnB_2026_compressed.pdf>
- **Formato:** PDF de 49 páginas, de 04/08/2026.
- **Termos:** cerca de 35 siglas. Umas 10 são da UnB (DDS, CEU, BAES, PBPMEC, PIBEX), e o resto é de documentos (CPF, CNIS, INSS).
- **Atualização:** uma por ano, com o edital.
- **Coleta automática: parcial**, pelo mesmo motivo do nº 4.
- **Prioridade 7:** cobre o grupo "apoio estudantil" da trilha.

### 8. Mapa dos campi (UnB Notícias)

- **Endereço:** <https://noticias.unb.br/images/mapas_campi_unb.pdf>
- **Formato:** PDF de 2 páginas, de 23/06/2022.
- **Termos:** 38 lugares com sigla (RU, ICC, BCE, CCN, PRC, os prédios SG e os pavilhões).
- **Coleta automática: parcial.** A lista de nomes sai do PDF, mas sem coordenadas, que o campo `localizacao` precisa (ADR 0005).
- **Prioridade 8:** confirma o nome oficial dos lugares.

### 9. Portal de Boas-vindas

- **Endereço:** <https://boasvindas.unb.br/>
- **Formato:** HTML (WordPress).
- **Termos:** poucos. A página aponta para os decanatos e para o manual do nº 4.
- **Coleta automática: sim**, mas traz pouca coisa nova.
- **Prioridade 9.**

### 10. Manual para Estudantes 2022 e Guias do Calouro 2019 (DEG)

- **Endereços:** <https://deg.unb.br/wp-content/uploads/manual_para_estudantes_2022.pdf> (70 páginas, 24/06/2022), <https://deg.unb.br/wp-content/uploads/guia_do_calouro_2019_1.pdf> e <https://deg.unb.br/wp-content/uploads/guia_do_calouro_2019_2.pdf>
- **Coleta automática: não.** O manual de 2022 usa uma fonte com codificação própria, e parte do texto sai embaralhado na extração ("DOJXPD" no lugar de palavras). Os de 2019 estão desatualizados.
- **Prioridade 10:** só para comparar com o nº 4 e achar termos que mudaram de nome.

### 11. SIGAA, páginas públicas

- **Endereço:** <https://sigaa.unb.br/sigaa/public/home.jsf>
- **Formato:** HTML gerado na hora (JSF). A navegação depende de formulários com estado da sessão.
- **Coleta automática: não.** Cada página depende do clique anterior, então o coletor fica frágil, e não há `robots.txt` para dizer o que é permitido.
- **Prioridade 11.**

### 12. Lista de termos do Arquivo Central

- **Endereço:** <https://arquivocentral.unb.br/wp-content/uploads/2026/02/lista_termos_pdf.pdf> (74 páginas, de 01/03/2024)
- **Coleta automática: não.** É um índice de assuntos para classificar documentos ("Concursos vestibulares", "Eventos"), não um vocabulário do estudante.
- **Fora do glossário.**

### 13. Centro Lexterm

- O Centro de Estudos Lexicais e Terminológicos, do Instituto de Letras, faz glossários terminológicos em teses e dissertações do [Repositório da UnB](https://repositorio.unb.br/). Era o primeiro palpite para o "grupo de terminologia" que a professora citou na R1, mas o grupo certo é o TermiTraDiCo (nº 2).
- O site citado na ementa de Terminologia e Tradução 1 (`www.centrolexterm.com.br`) não respondeu em 17/11/2026, e não achamos um glossário de termos da UnB publicado por ele.
- **Coleta automática: não.**
- **Referência de método:** como se escreve uma definição terminológica.
- **Outros grupos:** os demais glossários do IL e do POSTRAD achados em 18/11 (2016 a 2023) são temáticos, em Libras e português (matemática, história, saúde suplementar), e nenhum tem siglas da UnB.

## Pendências

- [ ] Pedir à DPO o link novo da Lista de Siglas (nº 3).
- [ ] Leitor por coluna no coletor, para a tabela do TermiTraDiCo (nº 2).
