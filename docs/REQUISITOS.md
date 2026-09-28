# Glossário UnB

Análise de requisitos e planejamento — MDS, UnB
Equipe: Pedro, Ítalo, Jéssyca, Alex Kurokawa, Allan, Zé (José Gabriel)

## 1. Objetivo

Dicionário colaborativo de siglas, gírias e jargões da UnB (DEG, DPO, PPAES, "menção SR", "trancamento geral", etc.), inspirado no [glossario-ufcg](https://github.com/OpenDevUFCG/glossario-ufcg). Domínio pequeno de propósito, foco em qualidade de processo e produto.

## 2. Fonte de dados

Coleta inicial via [planilha colaborativa](https://docs.google.com/spreadsheets/d/1XciIDY79FAyY32bC4GDgQAWgyy-B5UahVMKZvdry0WY/edit?usp=sharing), depois migrada para o dataset estruturado do projeto. Ver `skills/glossario-unb-dev/SKILL.md` para o schema de cada termo.

## 3. Requisitos Funcionais

| ID | Nome | Release |
| --- | --- | --- |
| RF01 | Busca textual de termos | Busca textual de termos | R1 |
| RF02 | Listagem e filtro por categoria | R1 (lista) -> R2 (filtro) |
| RF03 | Arquivo Json da Planilha | R1 (parcial) -> R2 |
| RF04 | Sugestão de termo via Pull Request e Issue | R1 |
| RF05 | Detalhe do termo (significado, definição, exemplo, fonte) | R1 |
| RF06 | Validação automática das contribuições (schema, fonte, duplicidade) | R2 -> R2+ |
| RF07 | Sinalização de termo desatualizado | R2+ |
| RF08 | Autocomplete na busca | R2+ |
| RF09 | Termos parecidos e busca sem resultado | R2+ |
| RF10 | Formulário de sugestão no site | R2+ |

## 4. Requisitos Não-Funcionais

| ID | Nome | Release |
| --- | --- | --- |
| RNF01 | PWA com offline | R1+ |

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
| Jéssyca | Product Owner | — | Jessy2126 |
| Pedro | Dev | Git e GitHub + Metodologias Ágeis | p-magno |
| Allan | Dev | a confirmar (estudo já entregue) | MrD4ntas |
| Zé (José Gabriel) | Dev | a confirmar | josegabriel-iw |

## 7. Releases

Estrutura detalhada sprint a sprint em [`scrum/sprint-planning.md`](scrum/sprint-planning.md).

- **Release 1** (28/09/2026): escopo e arquitetura validados, protótipo funcional, tecnologias testadas com código rodando
- **Release 2** (25/11/2026): produto completo conforme RF01-05 e RNF01-05
