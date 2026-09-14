# Arquitetura — Glossário UnB

Dicionário colaborativo de termos da UnB. Requisitos completos em [`REQUISITOS.md`](REQUISITOS.md).

## Visão geral 

```
Planilha de coleta (Google Sheets)
        │
        ▼
  Dataset de termos (formato a definir — ver Decisões pendentes)
        │
        ▼
   Aplicação de consulta (PWA)
        │
        ├── Busca por texto
        └── Filtro por categoria
```

## Estrutura de pastas (proposta inicial)

```
G10-2026-2/
├── frontend/           # aplicação de consulta (PWA)
├── data/                # dataset de termos — ou backend/, conforme ADR 0001
├── docs/
│   ├── adr/
│   ├── estudos/
│   └── scrum/
├── skills/
│   └── glossario-unb-dev/
└── .github/
```

Ajustar assim que a ADR 0001 (abaixo) for fechada.

## Decisões pendentes (registrar como ADR em `docs/adr/` assim que fechadas)

- **ADR 0001 — JSON estático vs. backend com banco de dados.** O glossario-ufcg (referência direta do projeto) usa JSON estático servido pelo próprio front. Dado o volume pequeno de termos, essa opção evita infraestrutura desnecessária, mas precisa ser decidida formalmente pelo time responsável por Backend/Banco de Dados, não assumida por padrão.
- **ADR 0002 — Framework de frontend.** A definir.
- **ADR 0003 — Ferramenta de PWA/service worker.** Depende da escolha de framework (ADR 0002).

## Padrões de código (a manter desde o primeiro commit)

- Early return em vez de condicionais aninhadas
- Nenhuma lógica de validação de termo duplicada entre o front e o dataset
- Nomes de arquivo/módulo por domínio (`termos.js`, `buscaService.js`), evitar `utils.js`/`helpers.js` genérico
- Tratamento de erro explícito, sem `catch` vazio

## Referências

- Escopo detalhado e schema de termo: [`skills/glossario-unb-dev/SKILL.md`](../skills/glossario-unb-dev/SKILL.md)
- Fluxo de contribuição: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
