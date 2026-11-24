# Glossário UnB

Análise de requisitos e planejamento — MDS, UnB
Equipe: Pedro, Ítalo, Allan, Zé (José Gabriel)

## 1. Objetivo

Dicionário colaborativo de siglas, gírias e jargões da UnB (DEG, DPO, PPAES, "menção SR", "trancamento geral", etc.), inspirado no [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg). Domínio pequeno de propósito, foco em qualidade de processo e produto.

## 2. Fonte de dados

Desde a Release 2, os termos vêm de fontes oficiais da UnB por um pipeline de coleta que abre um Pull Request revisado por uma pessoa ([`adr/0009-coleta-automatizada-por-pipeline.md`](adr/0009-coleta-automatizada-por-pipeline.md)). A [planilha colaborativa](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing) foi a coleta inicial da Release 1 e não recebe mais termos. Ver [`adr/0004-schema-unico-do-termo.md`](adr/0004-schema-unico-do-termo.md) para o schema de cada termo. O catálogo das fontes possíveis, com formato, `robots.txt`, viabilidade de coleta e prioridade, está em [`FONTES-DE-DADOS.md`](FONTES-DE-DADOS.md).

## 3. Requisitos Funcionais

Cada RF começa por um verbo no infinitivo seguido do objeto e tem um critério de aceitação que dá para conferir. A coluna Situação vale para a `main`: **Pronto** (código e teste), **Parcial** (parte pronta) ou **Pendente** (só a issue). Para cada RF, a issue, o PR e o teste que o provam estão em [`RASTREABILIDADE.md`](RASTREABILIDADE.md). As histórias de usuário (Gherkin) estão em [PR #119](https://github.com/unb-mds/2026-2-GlossarioUnB/pull/119) e a matriz só as cita.

| ID | Requisito (verbo + objeto) | Critério de aceitação | Regras | Release | Situação |
| --- | --- | --- | --- | --- | --- |
| RF01 | Buscar termo pelo nome | Ao digitar parte do nome, o site mostra até 8 termos cujo nome contém o texto, sem diferenciar acento nem maiúsculas, com os que começam pelo texto primeiro; consulta vazia ou só com espaços não mostra nada | RN09 | R1 | Pronto |
| RF02 | Filtrar a lista de termos por tipo e por campus | A página "todas as siglas" agrupa os termos por letra; escolher um tipo (sigla, gíria ou expressão), um campus ou os dois mostra só os termos que atendem (o campus inclui os termos "Geral"); os filtros ficam no endereço, para o link poder ser compartilhado; filtro sem resultado mostra lista vazia | RN03, RN04, RN09 | R1 (lista), R2 (filtro) | Pronto. A categoria temática (taxonomia da [#63](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/63)) ainda não está na `main` |
| RF03 | Publicar os termos em um arquivo JSON estático | `frontend/data/termos.json` guarda todos os termos no schema da [ADR 0004](adr/0004-schema-unico-do-termo.md) e o site lê só esse arquivo, sem servidor; `npm test` falha se o arquivo sair do schema | RN01, RN02, RN03, RN04, RN05 | R1 (parcial), R2 | Pronto |
| RF04 | Receber sugestão de termo por Issue ou Pull Request | O repositório tem o modelo de issue "Sugerir um termo" com termo, tipo, significado, definição, exemplo e fonte, e o `CONTRIBUTING.md` explica o caminho por Pull Request; nenhum termo entra na `main` sem passar por um PR revisado | RN01, RN06 | R1 | Pronto, sem teste automático (a prova é o arquivo) |
| RF05 | Exibir a ficha do termo | A página do termo mostra nome, tipo, significado (nas siglas), definição, exemplo de uso, campus ("Geral" aparece como todos os campi) e fonte (link só se for http(s), senão texto); id que não existe mostra aviso; termo com `localizacao` mostra o mapa | RN01, RN08 | R1 | Pronto |
| RF06 | Validar cada termo contra o schema antes do merge | O CI roda `npm test` e falha se um termo tiver campo obrigatório vazio, `fonte` vazia, id repetido ou fora do padrão, tipo ou campus fora da lista, sigla sem significado ou localização inválida; o glossário não pode ter dois termos com a mesma sigla ou o mesmo significado sob ids diferentes | RN01 a RN05 | R2 | Pronto |
| RF07 | Sinalizar termo possivelmente desatualizado | Link de fonte quebrado ou com redirecionamento suspeito gera uma issue, sem duplicar issue aberta, e a página do termo mostra "verificado em dd/mm/aaaa" (critérios da [#60](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60)) | RN01 | R2+ | Pendente |
| RF08 | Sugerir termos enquanto o leitor digita (autocomplete) | A lista de sugestões aparece a cada tecla; as setas marcam uma sugestão sem passar das pontas; Enter abre a marcada (ou a primeira); o leitor de tela ouve quantas sugestões há | RN09 | R1 | Pronto |
| RF09 | Mostrar termos parecidos e avisar quando a busca não acha | Busca sem resultado mostra o aviso com o texto digitado e o link "Sugerir este termo". Termos parecidos, "Veja também" e desambiguação: critérios da [#66](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/66) | RN06 | R2 | Parcial (aviso pronto; parecidos pendente) |
| RF10 | Enviar sugestão de termo pelo site, sem conta no GitHub | Coleta só o necessário (LGPD) e a sugestão chega como PR revisável com a proveniência "sugestão via formulário" (critérios da [#72](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/72), opcional) | RN06, RN07 | R2+ | Pendente |
| RF11 | Coletar candidatos a termo de páginas oficiais da UnB | Para cada fonte de `coleta/fontes.json`, o robô lê só o trecho configurado e devolve cada candidato com termo, significado e proveniência (URL e trecho); a estrutura da página mudou: erro claro, e as outras fontes seguem. Respeita o RNF09 | RN06, RN07 | R2 | Parcial (páginas HTML e PDF da DPO prontos; faltam as fontes novas da [#61](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/61)) |
| RF12 | Comparar os candidatos com o glossário e separá-los em novo, alterado e conflito | Sigla ou sinônimo que não existe: novo; mesma sigla com pelo menos 60% das palavras do significado em comum: alterado (muda só o `significado`); abaixo disso: conflito, proposto como desambiguação, sem sobrescrever; o mesmo termo em duas fontes vira um registro com a outra fonte anotada | RN06, RN10 | R2 | Pronto |
| RF13 | Sugerir categoria, tipo e rascunho de texto com LLM e marcar o termo para revisão | A resposta do LLM só vale se passar na validação (campos, listas fechadas, sem link nem HTML); o candidato sai marcado "revisar" e a sugestão fica em `classificacao`, nunca em `definicao` ou `exemplo_uso`; sem chave da API ou com erro, o candidato sai "sem classificação" e o resto segue | RN06, RN10 | R2 | Pronto |
| RF14 | Abrir um Pull Request com os termos coletados | O PR só é aberto se houver mudança, nunca faz merge sozinho e passa no CI normal; o README explica como disparar a coleta à mão (critérios da [#59](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/59)) | RN06 | R2 | Pronto |
| RF15 | Exibir a trilha "Primeiros passos na UnB" na página inicial | A trilha mostra os grupos e termos na ordem de `trilha-calouro.json`, com pelo menos 15 termos, todo id existente no glossário, sem termo em dois grupos e cada termo com categoria e fonte oficial da UnB; id inexistente é pulado e grupo vazio some | RN01, RN11 | R2 | Pronto |

### Regras de negócio

| ID | Regra | Onde é aplicada |
| --- | --- | --- |
| RN01 | Todo termo publicado tem `fonte` preenchida | [`validacao-termo.js`](../frontend/js/validacao-termo.js) e CI |
| RN02 | O `id` do termo é único e usa só minúsculas sem acento, números e hífens | `validacao-termo.js` |
| RN03 | O `tipo` é `sigla`, `giria` ou `expressao` | `validacao-termo.js` e [`termos.js`](../frontend/js/termos.js) |
| RN04 | O `campus` é Darcy Ribeiro, Ceilândia, Gama, Planaltina ou Geral; o filtro por campus inclui os termos Geral | `validacao-termo.js` e `termos.js` |
| RN05 | Sigla tem `significado` por extenso; gíria e expressão não precisam | `validacao-termo.js` |
| RN06 | Nenhum termo entra na `main` sem Pull Request revisado por uma pessoa, inclusive os coletados pelo robô ([ADR 0009](adr/0009-coleta-automatizada-por-pipeline.md)) | processo ([`CONTRIBUTING.md`](../CONTRIBUTING.md)) |
| RN07 | O robô e o formulário não coletam nem publicam dado pessoal (RNF08) e o robô respeita o robots.txt (RNF09) | [`coleta/fontes.json`](../coleta/fontes.json) e [`coletor-html.js`](../coleta/coletor-html.js) |
| RN08 | Link de fonte só é link se for http(s); outro esquema (por exemplo `javascript:`) vira texto | `urlSegura` em `validacao-termo.js` |
| RN09 | A busca ignora acento, maiúsculas e espaços nas pontas | `normalizar` em `termos.js` |
| RN10 | `definicao` e `exemplo_uso` são escritos por uma pessoa: o robô só muda o `significado`, e o LLM só sugere | [`deduplicar.js`](../coleta/deduplicar.js) e [`classificador.js`](../coleta/classificador.js) |
| RN11 | Fonte oficial é um endereço https de `unb.br` ou `*.unb.br` | `fonteOficial` em [`trilha.js`](../frontend/js/trilha.js) |

## 4. Requisitos Não-Funcionais

O PWA (instalável, com service worker) é a decisão técnica da [ADR 0003](adr/0003-pwa-com-service-worker-proprio.md), não um RNF. Cada RNF abaixo tem métrica, critério de aceitação e uma forma objetiva de verificação.

| ID | Requisito | Métrica e critério de aceitação | Como verificar | Release |
| --- | --- | --- | --- | --- |
| RNF01 | Disponibilidade: consulta offline | Depois da primeira visita, consultar termos em `frontend/` funciona sem rede, com o dataset em cache | Teste E2E offline ([#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78)) | R1+ |
| RNF02 | Desempenho | Página inicial carrega em até 2 s em 4G lento e Lighthouse Performance ≥ 90 | Lighthouse CI ([#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80)) | R2 |
| RNF03 | Acessibilidade | WCAG 2.1 AA, sem violações do axe-core nas três páginas, nos temas claro e escuro | axe-core no CI ([#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78)) e Lighthouse ([#80](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/80)) | R2 |
| RNF04 | Usabilidade | Texto base de pelo menos 17 px e alvos de toque de pelo menos 44 px | Revisão de interface e teste E2E ([#78](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/78)) | R2 |
| RNF05 | Qualidade dos dados | 100% dos termos com `fonte` e `tipo` (categoria) preenchidos e válidos; 0 links de fonte quebrados | `npm test` valida o schema ([`tests/dados.test.js`](../tests/dados.test.js)); links conferidos pela verificação periódica das fontes ([#60](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/60)) | R1+ |
| RNF06 | Manutenibilidade | Cobertura de linhas ≥ 90% em `frontend/js/termos.js`, `frontend/js/validacao-termo.js` e `coleta/` | Cobertura mínima no CI ([#79](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/79)) | R2 |
| RNF07 | Segurança | Nenhum dado de termo vira HTML, CDN usado só com SRI e nenhum segredo no front | Revisão de código, testes de URL segura ([`tests/validacao-termo.test.js`](../tests/validacao-termo.test.js)) e análise de segurança ([#83](https://github.com/unb-mds/2026-2-GlossarioUnB/issues/83)) | R2 |
| RNF08 | Privacidade | Nenhum dado pessoal coletado nem publicado: sem login, sem analytics e sem cookies (o navegador guarda só a preferência de tema), e nenhum termo traz e-mail, telefone ou matrícula de uma pessoa. O robô lê só o elemento configurado de cada página (numa lista de laboratórios, o nome do laboratório, e não o nome nem o e-mail de quem coordena) | Revisão humana de cada termo no PR ([ADR 0009](adr/0009-coleta-automatizada-por-pipeline.md)) e a configuração de cada fonte em [`coleta/fontes.json`](../coleta/fontes.json) | R2 |
| RNF09 | Coleta responsável | O robô respeita o robots.txt de cada site, espera pelo menos 1 s entre um pedido e outro, identifica-se pelo user-agent do projeto, e uma fonte com erro não para as outras | [`tests/coletor-html.test.js`](../tests/coletor-html.test.js) (robots.txt, intervalo, user-agent e fonte com erro) | R2 |

## 5. Fora de escopo (MVP)

- Login de usuário / conta pessoal
- Edição de termo diretamente pelo site (sem passar por PR/issue)
- Tradução de fato para outro idioma
- App nativo mobile (o PWA cobre isso)
- Favoritar termos

## 6. Equipe

| Pessoa | Papel | Tema de Sprint 00 | GitHub |
|---|---|---|---|
| Ítalo | Scrum Master | — | smitalo |
| Pedro | Dev | Git e GitHub + Metodologias Ágeis | p-magno |
| Allan | Dev | a confirmar (estudo já entregue) | MrD4ntas |
| Zé (José Gabriel) | Dev | a confirmar | josegabriel-iw |

A Jéssyca (Jessy2126) foi a Product Owner até 16/11/2026, quando saiu do grupo, e as issues dela foram redistribuídas no Encontro 2 (16/11). O papel de Product Owner ainda não foi reatribuído.

## 7. Releases

Estrutura detalhada sprint a sprint em [`scrum/sprint-planning.md`](scrum/sprint-planning.md).

- **Release 1** (28/09/2026): escopo e arquitetura validados, protótipo funcional, tecnologias testadas com código rodando
- **Release 2** (25/11/2026): produto completo conforme RF01–RF06 e RNF01–RNF09 (os RF11–RF15 vieram dos épicos E1 e E3 da R2)
