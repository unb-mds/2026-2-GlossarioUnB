# Glossário UnB

Grupo G10 - Métodos de Desenvolvimento de Software 2026/2

Dicionário colaborativo de siglas, gírias e jargões da UnB.

## Duas páginas publicadas (GitHub Pages)

| Página | Endereço | Pasta |
|---|---|---|
| **Glossário**: o produto (PWA) | `https://unb-mds.github.io/2026-2-GlossarioUnB/frontend/` | [`frontend/`](frontend/) |
| **Sobre o projeto**: apresentação, como contribuir, mapa do repositório | `https://unb-mds.github.io/2026-2-GlossarioUnB/sobre/` | [`sobre/`](sobre/) |

- O site publicado tem **as mesmas pastas do repositório**. Por isso os links entre as duas páginas funcionam igual no GitHub Pages, no `npm run dev` ou abrindo pelo Live Server do VS Code.
- A raiz do endereço ([`index.html`](index.html)) redireciona para a página Sobre.
- A publicação é feita automaticamente por [`.github/workflows/pages.yml`](.github/workflows/pages.yml) a cada push na `main` (ADR 0007), via *Settings → Pages → Source: GitHub Actions*.

## Como rodar

Pré-requisito: Node 22.9 ou mais novo. O site não usa dependências; os testes e a coleta usam as bibliotecas da ADR 0010, instaladas com `npm ci`.

```bash
npm ci                  # bibliotecas da coleta e dos testes
npm run dev             # glossário em http://localhost:8080/frontend/ e Sobre em /sobre/
npm test                # testes de domínio + validação de todos os termos
npm run test:cobertura  # os mesmos testes, com relatório de cobertura
```

Para usar outra porta, copie `.env.example` para `.env` e ajuste `PORT` (o `npm run dev` lê o `.env` automaticamente).

Detalhes do glossário em [`frontend/README.md`](frontend/README.md).

## Coleta semanal

O workflow [`.github/workflows/coleta.yml`](.github/workflows/coleta.yml) roda toda segunda às 09:00 UTC (06:00 de Brasília) e também pode ser disparado em **Actions → Coleta semanal → Run workflow**. Ele coleta as fontes HTML e o PDF da DPO, classifica os candidatos com o Gemini, compara com o `termos.json`, atualiza `frontend/data/termos.json` com alterações de significado e termos novos classificados como "revisar", grava `coleta/relatorio.json` e abre ou atualiza o PR `robo/coleta-semanal` com a tabela-resumo em `coleta/resumo.md`. O PR só é criado quando há termo novo, alterado ou conflito, e o robô nunca faz merge.

A definição e o exemplo de uso dos termos novos são rascunhos do LLM e precisam ser conferidos na revisão humana. O robô só altera o campo `significado` de termos existentes (ADR 0009).

Para o PR disparar o CI normal, configure em **Settings → Secrets and variables → Actions**:

- `ROBO_APP_ID` e `ROBO_APP_PRIVATE_KEY`: credenciais do GitHub App do robô, que abre o PR e faz o CI rodar.
- `GEMINI_API_KEY`: chave do Gemini. Sem ela, os termos saem como "sem classificação" e o pipeline continua, mas nenhum termo novo é incluído no `termos.json`.

Para rodar a coleta completa localmente, com o `.env` contendo a chave:

```bash
npm run coleta:completa
```

O relatório fica em `coleta/relatorio.json` e o corpo do PR em `coleta/resumo.md` (ignorado pelo Git).

## Documentação

- [Requisitos do sistema](docs/REQUISITOS.md)
- [Fontes de dados de termos](docs/FONTES-DE-DADOS.md)
- [Arquitetura do sistema](docs/ARQUITETURA.md) e [decisões (ADRs)](docs/adr/)
- [Estratégia de testes](docs/estrategia-de-testes.md)
- [Story Map](docs/storymap/story-map.png) e [quadro do Figma](https://www.figma.com/board/dk8nBcFiFEWo1AkOvn1554/Template-MDS--c%C3%B3pia-limpa---c%C3%B3pia---c%C3%B3pia-?node-id=0-1&t=IS5erq77oDUXUtei-1)
- [Processo do time](docs/PROCESSO.md)
- [Como contribuir](CONTRIBUTING.md)
- [Guia de fluxo de trabalho (Git passo a passo)](docs/GUIA-FLUXO-DE-TRABALHO.md)
- [Planejamento de sprints](docs/scrum/sprint-planning.md)
- [Planilha de coleta de termos](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing)
- [Registro de uso de IA](AI-USAGE.md)
- [Licença (MIT)](LICENSE)
- [Modelo Conceitual de Dados](docs/modelo-conceitual-dados.md)
