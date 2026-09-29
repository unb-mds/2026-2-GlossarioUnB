# G10-2026-2 — Glossário UnB

Grupo G10 - Métodos de Desenvolvimento de Software 2026/2

Dicionário colaborativo de siglas, gírias e jargões da UnB.

## Duas páginas publicadas (GitHub Pages)

| Página | Endereço | Pasta |
|---|---|---|
| **Glossário**: o produto (PWA) | `https://unb-mds.github.io/2026-2-GlossarioUnB/frontend/` | [`frontend/`](frontend/) |
| **Sobre o projeto**: apresentação, como contribuir, mapa do repositório | `https://unb-mds.github.io/2026-2-GlossarioUnB/sobre/` | [`sobre/`](sobre/) |

- O site publicado tem **as mesmas pastas do repositório**. Por isso os links entre as duas páginas funcionam igual no GitHub Pages, no `npm run dev` ou abrindo pelo Live Server do VS Code.
- A raiz do endereço ([`index.html`](index.html)) redireciona para a página Sobre.
- A publicação é feita por [`.github/workflows/pages.yml`](.github/workflows/pages.yml) a cada push na `main` (ADR 0007). Ela precisa ser ativada uma vez em *Settings → Pages → Source: GitHub Actions*.

## Como rodar

Pré-requisito: Node 22 ou mais novo. Não há dependências para instalar.

```bash
npm run dev             # glossário em http://localhost:8080/frontend/ e Sobre em /sobre/
npm test                # testes de domínio + validação de todos os termos
npm run test:cobertura  # os mesmos testes, com relatório de cobertura
```

Detalhes do glossário em [`frontend/README.md`](frontend/README.md).

## Documentação

- [Requisitos do sistema](docs/REQUISITOS.md)
- [Arquitetura do sistema](docs/ARQUITETURA.md) e [decisões (ADRs)](docs/adr/)
- [Story Map](docs/storymap/story-map.md) e [quadro do Figma](https://www.figma.com/board/oz0fZUVEhd1tCFegxVybE4/Template-MDS--c%C3%B3pia-limpa---c%C3%B3pia-?node-id=2044-1060&t=DtFGVXxLTmBRKyXd-0)
- [Processo do time](docs/PROCESSO.md)
- [Como contribuir](CONTRIBUTING.md)
- [Guia de fluxo de trabalho (Git passo a passo)](docs/GUIA-FLUXO-DE-TRABALHO.md)
- [Planejamento de sprints](docs/scrum/sprint-planning.md)
- [Planilha de coleta de termos](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing)
- [Registro de uso de IA](AI-USAGE.md)
- [Licença (MIT)](LICENSE)
