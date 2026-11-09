# Glossário UnB

[![CI](https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/ci.yml/badge.svg)](https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/ci.yml)
[![Pages](https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/pages.yml/badge.svg)](https://github.com/unb-mds/2026-2-GlossarioUnB/actions/workflows/pages.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Dicionário colaborativo e de código aberto das siglas, gírias e expressões da **Universidade de Brasília (UnB)**, desenvolvido pelo **Grupo G10** na disciplina de Métodos de Desenvolvimento de Software (MDS 2026/2).

🔗 **Acesse as páginas publicadas no GitHub Pages:**
- **[Glossário UnB (Aplicação PWA)](https://unb-mds.github.io/2026-2-GlossarioUnB/frontend/)**: o produto em funcionamento com busca rápida e funcionamento offline.
- **[Sobre o Projeto (Visão Institucional)](https://unb-mds.github.io/2026-2-GlossarioUnB/sobre/)**: apresentação, objetivos, personas e governança.

---

## Sumário

1. [O que é o Glossário UnB](#1-o-que-é-o-glossário-unb)
2. [O Problema](#2-o-problema)
3. [Público-Alvo](#3-público-alvo)
4. [Arquitetura em Alto Nível](#4-arquitetura-em-alto-nível)
5. [Tecnologias Utilizadas](#5-tecnologias-utilizadas)
6. [Como Rodar Localmente (Guia Passo a Passo)](#6-como-rodar-localmente-guia-passo-a-passo)
   - [6.1 Pré-requisitos](#61-pré-requisitos)
   - [6.2 Clonar o repositório](#62-clonar-o-repositório)
   - [6.3 Configurar variáveis de ambiente (.env)](#63-configurar-variáveis-de-ambiente-env)
   - [6.4 Executar o servidor da aplicação](#64-executar-o-servidor-da-aplicação)
   - [6.5 Executar os testes automatizados e cobertura](#65-executar-os-testes-automatizados-e-cobertura)
   - [6.6 Verificação e análise de código (Lint)](#66-verificação-e-análise-de-código-lint)
7. [Como Rodar a Coleta de Termos (Pipeline de Dados)](#7-como-rodar-a-coleta-de-termos-pipeline-de-dados)
8. [Como Contribuir](#8-como-contribuir)
9. [Mapa de Documentação](#9-mapa-de-documentação)
10. [Licença](#10-licença)

---

## 1. O que é o Glossário UnB

O **Glossário UnB** é um dicionário acadêmico e comunitário voltado a desmistificar a linguagem do dia a dia da Universidade de Brasília. O projeto catalogou siglas institucionais, jargões acadêmicos, termos regulamentares e apelidos de locais físicos nos quatro campi da UnB (Darcy Ribeiro, Ceilândia, Gama e Planaltina).

Inspirado no projeto [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg), o Glossário UnB foca na simplicidade de uso, alta acessibilidade e rigor metodológico no processo de engenharia de software.

---

## 2. O Problema

Quem chega à UnB encontra uma verdadeira "sopa de letrinhas" e jargões:
- **Siglas institucionais complexas:** DEG, BCE, FCTE, DAC, DPO, PPAES, CEAD.
- **Expressões normativas e acadêmicas:** "menção SR", "trancamento geral", "matrícula extraordinária", "créditos".
- **Gírias e locais físicos:** "Ceubinho", "Minhocão", "Bandejão", "Udefinho".

Tradicionalmente, essas informações estão dispersas em resoluções burocráticas de dezenas de páginas em PDF, sites departamentais desatualizados ou dependem exclusivamente da transmissão oral entre veteranos. Isso gera insegurança, perda de prazos e sobrecarga no atendimento presencial das secretarias. O Glossário UnB centraliza essas definições de forma didática, rápida e confiável.

---

## 3. Público-Alvo

O produto foi desenhado a partir de três perfis principais mapeados pela equipe:

1. **Calouro Jovem (17 a 22 anos):** acostumado com busca instantânea no celular ("tipo Google"). Prioriza velocidade, autocompletar ágil e respostas diretas sem fricção.
2. **Calouro Adulto / Terceira Idade (60+):** estudantes que necessitam de navegação clara, botões com áreas de toque generosas (mínimo 44 px), alto contraste (WCAG AA), tipografia legível e explicações em linguagem simples, sem "usar jargão para explicar jargão".
3. **Veteranos, Servidores e Comunidade Externa:** realizam consultas pontuais sobre setores específicos, desambiguação entre campi e buscam links oficiais para aprofundamento.
4. **Novos Contribuidores:** estudantes que desejam sugerir novos termos, correções ou colaborar com código aberto.

---

## 4. Arquitetura em Alto Nível

O sistema foi arquitetado como uma aplicação puramente estática e sem dependências pesadas, garantindo alta performance, resiliência e custo zero de infraestrutura:

```text
 ┌────────────────────────────────────────────────────────┐
 │                   FONTES DE DADOS                      │
 │  - PDFs Oficiais da DPO (Lista de Siglas)              │
 │  - Páginas Institucionais da UnB (FAQ SAA, Decanatos)  │
 │  - Sugestões da Comunidade (Issues e Pull Requests)    │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                 PIPELINE DE DADOS                      │
 │  - Ingestão e extração de candidatos                   │
 │  - Normalização e deduplicação semântica               │
 │  - Validação estrita de schema (validacao-termo.js)    │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │               frontend/data/termos.json                │
 │         Dataset estruturado com fonte oficial          │
 └─────────────┬────────────────────────────┬─────────────┘
               │                            │
               ▼                            ▼
 ┌───────────────────────────┐ ┌───────────────────────────┐
 │   PRODUTO: GLOSSÁRIO PWA  │ │     SOBRE O PROJETO       │
 │       (/frontend/)        │ │         (/sobre/)         │
 │ - Busca com Autocomplete  │ │ - Visão do produto        │
 │ - Índice A-Z e Filtros    │ │ - Guia de contribuição    │
 │ - Mapa de locais (Leaflet)│ │ - Personas e requisitos   │
 │ - Offline (Service Worker)│ │ - HTML/CSS puro sem JS    │
 └─────────────┬─────────────┘ └────────────┬──────────────┘
               │                            │
               └──────────────┬─────────────┘
                              │
                              ▼
 ┌────────────────────────────────────────────────────────┐
 │                 INTEGRAÇÃO CONTÍNUA                    │
 │  - GitHub Actions: testes nativos (node --test)        │
 │  - Validação do schema do dataset no CI                │
 │  - Deploy automatizado no GitHub Pages                 │
 └────────────────────────────────────────────────────────┘
```

### As Duas Páginas Publicadas

O repositório publica simultaneamente dois sites irmãos estáticos via GitHub Pages:
- **`frontend/`**: a aplicação PWA do Glossário, com service worker para navegação offline, mapas dinâmicos e busca instantânea.
- **`sobre/`**: a página institucional de apresentação do projeto, construída exclusivamente em HTML e CSS puros sem JavaScript (ADR 0008).
- **`index.html` (raiz)**: redireciona automaticamente o visitante para a página `sobre/`.

---

## 5. Tecnologias Utilizadas

A escolha técnica priorizou a ausência de *build steps* e a longevidade do código (ADR 0002):

- **Runtime & Testes:** [Node.js](https://nodejs.org/) (versão `>=22.0.0`) com test runner nativo (`node:test`) e cobertura nativa (`--experimental-test-coverage`).
- **Linguagem:** JavaScript moderno nativo (Vanilla ES Modules). Sem bundlers (Webpack, Vite) e sem frameworks (React, Vue).
- **Estilização:** CSS3 puro baseado em variáveis CSS / *Design Tokens*, com suporte nativo a temas Claro/Escuro e conformidade de contraste WCAG AA.
- **PWA & Offline:** Web App Manifest e Service Worker nativos com estratégia de cache *stale-while-revalidate* para dados e *cache-first* para o App Shell (ADR 0003).
- **Mapas Interativos:** [Leaflet](https://leafletjs.com/) e [OpenStreetMap](https://www.openstreetmap.org/) carregados sob demanda apenas quando o termo possui coordenadas geográficas (`localizacao`), com fallback gracioso em modo offline (ADR 0005).
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) para integração contínua e [GitHub Pages](https://pages.github.com/) para distribuição.

---

## 6. Como Rodar Localmente (Guia Passo a Passo)

Siga este passo a passo para executar o projeto em qualquer máquina local ou ambiente de nuvem (ex.: GitHub Codespaces).

### 6.1 Pré-requisitos

- **Node.js**: versão **22.0.0** ou superior instalada (`node -v`).
- **Git**: instalado e configurado (`git --version`).
- **Nenhuma dependência externa**: o projeto não requer comandos como `npm install` para executar a aplicação principal.

### 6.2 Clonar o repositório

```bash
git clone https://github.com/unb-mds/2026-2-GlossarioUnB.git
cd 2026-2-GlossarioUnB
```

### 6.3 Configurar variáveis de ambiente (.env)

Crie o arquivo `.env` a partir do modelo disponível:

```bash
# No Linux / macOS / Git Bash:
cp .env.example .env

# No Windows PowerShell:
Copy-Item .env.example .env
```

O arquivo `.env` permite customizar o comportamento local:
```env
# Porta do servidor de desenvolvimento local (padrão: 8080)
PORT=8080
NODE_ENV=development

# Chaves de API para integrações do pipeline de coleta (opcional)
GEMINI_API_KEY=
API_KEY=
```

### 6.4 Executar o servidor da aplicação

Como a aplicação faz uso de ES Modules e Service Workers, ela precisa ser servida via protocolo HTTP/HTTPS:

```bash
npm run dev
```

O servidor local (`scripts/servidor-local.mjs`) reproduz exatamente a mesma estrutura de diretórios do GitHub Pages:
- **Glossário (PWA):** [http://localhost:8080/frontend/](http://localhost:8080/frontend/)
- **Sobre o projeto:** [http://localhost:8080/sobre/](http://localhost:8080/sobre/)

> **Dica:** O projeto também pode ser servido perfeitamente pela extensão **Live Server** do VS Code, abrindo a pasta raiz do repositório.

### 6.5 Executar os testes automatizados e cobertura

Os testes utilizam o módulo nativo `node:test` e validam tanto a lógica de domínio quanto a conformidade de todo o dataset contra o schema:

```bash
# Executa todos os testes unitários e de integração
npm test

# Executa os testes exibindo o relatório detalhado de cobertura de linhas e branches
npm run test:cobertura
```

### 6.6 Verificação e análise de código (Lint)

Para inspecionar a integridade sintática de todos os arquivos do projeto sem dependências:

```bash
# Verificação de sintaxe de todos os arquivos JS/MJS
node --check frontend/js/*.js scripts/*.mjs tests/*.js
```

Quando o linter formal for acionado pelo pipeline de qualidade:
```bash
npm run lint
```

---

## 7. Como Rodar a Coleta de Termos (Pipeline de Dados)

Na Release 1, os termos iniciais foram inseridos com base em uma planilha colaborativa. Na Release 2, a ingestão de termos evoluiu para um **pipeline de dados automatizado** (Épico E1 e ADR 0009).

### 7.1 Como funciona o fluxo de coleta

1. **Extração das Fontes:** Os coletores extraem termos de fontes públicas oficiais da UnB (como a Lista de Siglas em PDF da DPO e páginas institucionais da SAA e Decanatos).
2. **Normalização e Deduplicação:** O robô limpa caracteres, remove redundâncias e compara o termo extraído com o dataset existente em `frontend/data/termos.json`.
3. **Enriquecimento e Classificação:** O pipeline categoriza o termo (`sigla`, `giria` ou `expressao`) e gera rascunhos de definições claras e exemplos reais.
4. **Validação Determinística de Schema:** O arquivo gerado deve passar com 100% de conformidade pelas regras de [`frontend/js/validacao-termo.js`](frontend/js/validacao-termo.js).
5. **Abertura de Pull Request Automático:** As alterações nunca entram diretamente na `main`; o bot abre um PR com a procedência e links de cada fonte para **revisão humana obrigatória**.

### 7.2 Execução e Validação Local do Dataset

Para validar se o arquivo `frontend/data/termos.json` cumpre todas as regras do schema (todos os campos obrigatórios preenchidos, fontes válidas, sem IDs duplicados e com integridade de termos relacionados):

```bash
node --test tests/dados.test.js
```

Se algum termo violar as diretrizes do projeto (ex.: termo sem fonte verificada ou ID com caracteres maiúsculos), o teste indicará o índice e o motivo do erro detalhadamente.

---

## 8. Como Contribuir

Contribuições são muito bem-vindas! Existem duas formas principais de contribuir:

### Para quem não sabe programar ou não usa Git
1. Acesse a aba **[Issues](https://github.com/unb-mds/2026-2-GlossarioUnB/issues)** deste repositório.
2. Clique em **New Issue** e escolha o modelo **📖 Sugerir um termo** (ou *Corrigir definição*).
3. Preencha o formulário com o termo, significado, exemplo e fonte. A equipe fará a revisão e inclusão no site.

### Para desenvolvedores e colaboradores com Git
Seguimos o **GitHub Flow** com **Conventional Commits**:
1. Faça um Fork do repositório.
2. Crie uma branch semântica: `git checkout -b feature/issue-XX-descricao` (ou `fix/`, `docs/`, `chore/`).
3. Adicione ou edite o termo em `frontend/data/termos.json` respeitando o schema único.
4. Execute `npm test` para garantir que o CI passará.
5. Faça o commit padronizado: `git commit -m "feat(dados): adiciona termo PPAES"`.
6. Envie para o seu fork (`git push origin ...`) e abra um Pull Request para a branch `main`.

Consulte o guia completo em [**CONTRIBUTING.md**](CONTRIBUTING.md) e a convenção detalhada em [**docs/CONVENCAO-GIT.md**](docs/CONVENCAO-GIT.md).

> **Atenção:** Qualquer uso relevante de ferramentas de IA (geração de código, testes ou redação) deve ser registrado em [**AI-USAGE.md**](AI-USAGE.md), conforme a política da disciplina MDS.

---

## 9. Mapa de Documentação

Toda a documentação do projeto está versionada na pasta [`docs/`](docs/):

| Documento | Descrição |
|---|---|
| [**CONTRIBUTING.md**](CONTRIBUTING.md) | Guia de contribuição, schema de termos e regras de PR |
| [**docs/CONVENCAO-GIT.md**](docs/CONVENCAO-GIT.md) | Padrões de nomenclatura de branch e Conventional Commits |
| [**docs/REQUISITOS.md**](docs/REQUISITOS.md) | Requisitos funcionais (RF), não funcionais (RNF) e personas |
| [**docs/ARQUITETURA.md**](docs/ARQUITETURA.md) | Visão de arquitetura de software e organização de diretórios |
| [**docs/adr/**](docs/adr/) | Registros de Decisões de Arquitetura (ADR 0001 a 0008) |
| [**docs/PROCESSO.md**](docs/PROCESSO.md) | Metodologia de trabalho ágil do time G10 |
| [**docs/GUIA-FLUXO-DE-TRABALHO.md**](docs/GUIA-FLUXO-DE-TRABALHO.md) | Passo a passo prático de Git e resolução de conflitos |
| [**docs/BENCHMARK.md**](docs/BENCHMARK.md) | Comparativo com outros glossários acadêmicos e diferenciais |
| [**docs/scrum/sprint-planning.md**](docs/scrum/sprint-planning.md) | Planejamento das sprints e backlog da equipe |
| [**docs/scrum/dailies.md**](docs/scrum/dailies.md) | Registro de presença e notas das reuniões diárias/semanais |
| [**AI-USAGE.md**](AI-USAGE.md) | Registro de transparência do uso de Inteligência Artificial |

---

## 10. Licença

Este projeto é distribuído sob a licença de código aberto **MIT**. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
