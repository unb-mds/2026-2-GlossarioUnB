# ADR 0004 — Schema único do termo


## Contexto
Até 26/09 havia três versões divergentes do que é um termo:

| Onde | Campos | Problema |
|---|---|---|
| `CONTRIBUTING.md` | `termo`, `tipo`, `categoria`, `significado` (por extenso), `definicao`, `exemplo_uso`, `fonte` (obrigatória) | Não tem `id` para URL nem `campus` |
| `docs/REQUISITOS.md` (RF02) | "categoria (sigla / gíria / expressão)" | Chama de "categoria" o que o CONTRIBUTING chama de `tipo` |
| MVP do colega (`termos.json`) | `id`, `termo`, `significado` (= definição), `exemplo`, `categoria` (`sigla`/`local`/`jargao`, só controla o mapa), `campus`, `localizacao` | Não tem `fonte`, e `categoria` mistura tipo com regra de renderização |

O `skills/glossario-unb-dev/SKILL.md`, citado como fonte das "regras completas do modelo de dados", não existe no repositório.

Histórias e itens envolvidos:

- **Story Map (MVP):** "Quero ver um exemplo de uso e fonte do termo" e "Quero filtrar termos por categoria (sigla/gíria/expressão) (RF02)".
- **Matriz impacto × esforço:** "Filtro por categoria e campus" e "Mapa para termos 'local'".

## Decisão
Um único schema, validado por uma única função (`frontend/js/validacao-termo.js`), usada nos testes e no CI. Isso cumpre o padrão do ARQUITETURA.md de "nenhuma lógica de validação de termo duplicada".

| Campo | Obrigatório | Valores | Origem |
|---|---|---|---|
| `id` | sim | slug único `a-z0-9-`, usado na URL (`termo.html?id=`) | MVP do colega |
| `termo` | sim | texto | ambos |
| `tipo` | sim | `sigla` / `giria` / `expressao` | CONTRIBUTING + RF02 |
| `significado` | só se `tipo` = `sigla` | forma por extenso | CONTRIBUTING |
| `definicao` | sim | explicação em português simples | CONTRIBUTING (era `significado` no MVP) |
| `exemplo_uso` | sim | frase real de uso | CONTRIBUTING (era `exemplo` no MVP) |
| `fonte` | sim | URL ou "conhecimento comum verificado pelo grupo" | CONTRIBUTING |
| `campus` | sim | `Darcy Ribeiro` / `Ceilândia` / `Gama` / `Planaltina` / `Geral` | MVP do colega |
| `categoria` | sim | lista fechada de 9 temas em `kebab-case` (ver tabela abaixo) | CONTRIBUTING + issue #63 |
| `localizacao` | não | `{ "lat", "lng", "link_como_chegar" }` (link só `http(s)`) | MVP do colega |

### Taxonomia de `categoria`

| Categoria | Rótulo | Definição | Exemplos |
|---|---|---|---|
| `vida-academica` | Vida acadêmica | Normas, avaliações, matrícula, trancamento e índices curriculares. | SS, IRA, trancamento |
| `unidades-academicas` | Unidades acadêmicas | Faculdades, institutos, centros de ensino/pesquisa e campi. | FT, IE, FCTE |
| `administracao` | Administração | Decanatos, secretarias e órgãos da gestão universitária. | DEG, DAC, SAA |
| `colegiados` | Colegiados | Conselhos e câmaras deliberativas da universidade. | CONSUNI, CEPE, CAD |
| `locais-campus` | Locais do campus | Prédios, espaços de convivência e pontos de referência nos campi. | ICC, BCE, Ceubinho |
| `sistemas` | Sistemas | Sistemas, portais e plataformas digitais institucionais da UnB. | SIGAA, Aprender 3, E-mail institucional |
| `assistencia-estudantil` | Assistência estudantil | Programas, diretorias e auxílios voltados à permanência estudantil. | DDS, Auxílio socioeconômico, DASU |
| `representacao-estudantil` | Representação estudantil | Entidades e coletivos de representação discente. | DCE, CA, DA |
| `girias` | Gírias | Gírias, apelidos e expressões informais usadas na UnB. | calouro, veterano, jubilar |

Regras:

- O filtro do RF02 usa `tipo` e `categoria`.
- O mapa aparece quando existe `localizacao`, sem depender de "categoria".
- Chaves em `snake_case`.
- `id` é único no arquivo.

## Alternativas descartadas
- **Manter o schema do MVP.** Não tem `fonte`, o que viola a regra "nenhum termo é aceito sem fonte" do CONTRIBUTING, e `categoria: "local"` mistura classificação com renderização.
- **Manter o schema do CONTRIBUTING sem `id`/`campus`.** Quebraria as URLs de termo e o filtro por campus que já funcionam no MVP.

## Consequências
- Os 5 termos de exemplo do MVP foram migrados para este schema. Depois, em 28/09, o time os substituiu pelas 40 siglas reais, todas com fonte, e pelo termo "Ceubinho" (issue #30).
- O bloco de schema do `CONTRIBUTING.md` foi atualizado.
- Os modelos `adicionar-termo.md` e `corrigir-definicao.md` (PR #29) não pedem `campus`: quem converte a issue em termo preenche.
- O modelo `adicionar-termo.md` oferece o tipo `local`, que este schema **não aceita**. Um lugar é uma sigla, gíria ou expressão com `categoria` (ex.: `locais-campus`) e, se houver coordenadas, `localizacao`. Foi o caso do termo "Ceubinho" (issue #30).
- A taxonomia de `categoria` foi fechada na issue #63 com 9 categorias obrigatórias, validadas em `frontend/js/validacao-termo.js` e sincronizadas com `coleta/categorias.json`. Todos os termos atuais em `frontend/data/termos.json` foram classificados.
