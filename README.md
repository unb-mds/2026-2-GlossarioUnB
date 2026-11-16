<a href="https://unb-mds.github.io/2026-2-GlossarioUnB/frontend/">
  <h1 align="center">
    <img alt="" src="frontend/icons/icon-192.png" width="96"><br>
    Glossário UnB
  </h1>
</a>

[![CI][CI badge]][CI]
[![GitHub Pages][Pages badge]][Pages]

O Glossário UnB é um dicionário das siglas, gírias e expressões da Universidade
de Brasília, feito para quem chega à UnB e tropeça em DEG, BCE, FCTE, "menção SR"
ou "trancamento geral". Ele roda no navegador do celular ou do computador,
funciona sem internet e mostra a fonte de cada termo. É um projeto de código
aberto do Grupo G10, da disciplina Métodos de Desenvolvimento de Software
(MDS 2026/2).

## Documentação

* [Usar o glossário][app]
* [Sobre o projeto][sobre]: o problema, os perfis de quem usa e a equipe
* [Requisitos](docs/REQUISITOS.md), [arquitetura](docs/ARQUITETURA.md) e [decisões de arquitetura (ADRs)](docs/adr/)
* [Processo do time](docs/PROCESSO.md) e [planejamento das sprints](docs/scrum/sprint-planning.md)
* [Contribuir com o Glossário UnB](CONTRIBUTING.md)

As datas das entregas (Release 1 e Release 2) estão na
[seção 7 dos requisitos](docs/REQUISITOS.md#7-releases), e o que entra em cada
sprint, no [planejamento das sprints](docs/scrum/sprint-planning.md). O uso de
IA no projeto fica registrado no [AI-USAGE.md](AI-USAGE.md).

## Rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org/) 22 ou mais novo. Não há
dependências para instalar.

```bash
git clone https://github.com/unb-mds/2026-2-GlossarioUnB.git
cd 2026-2-GlossarioUnB
npm run dev             # glossário em http://localhost:8080/frontend/ e Sobre em /sobre/
npm test                # testes + validação de todos os termos
npm run test:cobertura  # os mesmos testes, com relatório de cobertura
```

Para usar outra porta, crie um arquivo `.env` com `PORT=` e o número da porta
(o `npm run dev` lê o `.env` sozinho). Detalhes do app, página por página, em
[`frontend/README.md`](frontend/README.md).

## Serviços externos

A página de um lugar físico, como o Ceubinho, mostra um mapa. Para isso, o
navegador baixa o [Leaflet] 1.9.4 do unpkg.com e as imagens do mapa dos
servidores do [OpenStreetMap], que têm uma [política de uso][OSM tiles] e pedem
o crédito que aparece no canto do mapa. Sem internet, ou com esses endereços
bloqueados, a página mostra um aviso no lugar do mapa e o resto continua
funcionando ([ADR 0005][ADR 0005]).

Fora isso, o glossário só carrega arquivos do próprio site. Não há login,
cadastro nem servidor próprio do projeto.

## Sobre o Glossário UnB

Achamos que o Glossário UnB ajuda quem chega à universidade a entender a
linguagem dela sem depender de um veterano por perto, e que ele pode crescer com
a ajuda de quem já conhece essa linguagem.

### Resposta enquanto você digita

A busca sugere termos enquanto você digita e já mostra o significado de cada
sugestão. A lista completa tem índice de A a Z e filtros por tipo e por campus,
que ficam no endereço da página (por exemplo, `todas-siglas.html?tipo=sigla`)
e podem ser compartilhados.

### Funciona sem internet

O glossário é um PWA: pode ser instalado na tela inicial do celular e, depois da
primeira visita, abre mesmo sem conexão. O cache é feito por um service worker
próprio, sem biblioteca ([ADR 0003][ADR 0003]).

### Feito para quem nunca ouviu falar

Três perfis de estudante guiam as decisões de tela: o calouro jovem, que quer a
resposta na hora; o calouro com mais de 60 anos, que precisa de explicação
didática e navegação simples; e o veterano, que tira dúvidas pontuais. Por isso,
cada termo é explicado em português simples, sem usar jargão para explicar
jargão, com um exemplo de uso e, quando é um lugar, o mapa. O site tem tema
claro e escuro ([ADR 0008][ADR 0008]).

### Aberto e verificável

Nenhum termo entra sem `fonte`: um link oficial da UnB ou "conhecimento comum
verificado pelo grupo". Toda sugestão é pública, passa pela revisão de alguém do
time, e o CI confere todos os termos contra o [schema][ADR 0004] a cada pull
request. Por dentro, os termos ficam num arquivo JSON estático
([ADR 0001][ADR 0001]), e o site é feito em JavaScript e CSS puros, sem
framework e sem etapa de build ([ADR 0002][ADR 0002]). Os testes usam o
`node:test`, do próprio Node, e o GitHub Actions publica o site no GitHub Pages
a cada push na `main` ([ADR 0007][ADR 0007]).

O Glossário UnB é um projeto de código aberto, e contribuições são bem-vindas.
Quem não usa Git pode sugerir um termo pelo [modelo de issue][sugerir], e quem
usa encontra o passo a passo no [guia de contribuição](CONTRIBUTING.md).

## Licença

O Glossário UnB é distribuído sob a [licença MIT](LICENSE).

[app]: https://unb-mds.github.io/2026-2-GlossarioUnB/frontend/
[sobre]: https://unb-mds.github.io/2026-2-GlossarioUnB/sobre/
[sugerir]: https://github.com/unb-mds/2026-2-GlossarioUnB/issues/new?template=sugerir-termo.md
[CI]: https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/ci.yml
[CI badge]: https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/ci.yml/badge.svg
[Pages]: https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/pages.yml
[Pages badge]: https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/pages.yml/badge.svg
[Leaflet]: https://leafletjs.com/
[OpenStreetMap]: https://www.openstreetmap.org/copyright
[OSM tiles]: https://operations.osmfoundation.org/policies/tiles/
[ADR 0001]: docs/adr/0001-termos-em-json-estatico.md
[ADR 0002]: docs/adr/0002-frontend-sem-framework.md
[ADR 0003]: docs/adr/0003-pwa-com-service-worker-proprio.md
[ADR 0004]: docs/adr/0004-schema-unico-do-termo.md
[ADR 0005]: docs/adr/0005-mapa-de-locais-com-leaflet.md
[ADR 0007]: docs/adr/0007-github-pages-e-ci-com-actions.md
[ADR 0008]: docs/adr/0008-interface-com-css-puro-e-tokens.md
