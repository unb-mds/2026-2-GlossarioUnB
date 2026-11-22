# Relatório da coleta real (R2)

Números da `main` no commit `4d9c481` (22/11/2026). O ponto de partida é o commit `bab79b5`, o último antes da primeira coleta real.

## 1. Resumo

| Medida | Antes | Depois |
|---|---:|---:|
| Termos no glossário | 58 | **275** |
| Termos novos que entraram | — | **217** |
| Propostos pelo robô e deixados de fora | — | 21 |

## 2. Por rodada

| Rodada | PR | Propostos | Entraram | Com frase oficial | Só o que o nome diz |
|---|---|---:|---:|---:|---:|
| 1 | #162 | 92 | 82 | 62 | 20 |
| 2 | #164 | 97 | 91 | 71 | 20 |
| 3 | #166 | 37 | 34 | 31 | 3 |
| 4 | #167 | 10 | 8 | 7 | 1 |
| 5 | #168 | 2 | 2 | 2 | 0 |
| **Total** | | **238** | **217** | **173** | **44** |

Depois da rodada 5, o robô rodou de novo, encontrou 0 termos novos e 0 alterados, e o #169 registrou esse relatório. A execução seguinte terminou com "Nada mudou nas fontes" e não abriu PR.

## 3. Por fonte

O que o robô leu na última coleta:

| Fonte coletada | Candidatos |
|---|---:|
| `unb-decanatos` | 8 |
| `unb-secretarias` | 9 |
| `ceplan-minhocao` | 1 |
| `ceplan-beijodromo` | 1 |
| `noticias-ceubinho` | 1 |
| `dpo-siglas` | 323 |
| **Total** | **343** |

Desses candidatos, 226 já estão no glossário, 16 ficaram como conflito para uma pessoa decidir, 77 foram barrados pelo filtro, 10 alterações foram recusadas e 14 eram repetições entre as fontes.

De onde vem a fonte citada em cada termo publicado:

| Fonte citada | Antes | Depois |
|---|---:|---:|
| PDI UnB 2023–2028 | 0 | 211 |
| Outros sites da UnB | 56 | 60 |
| CEPLAN (mapa e páginas do campus) | 2 | 4 |
| **Total** | **58** | **275** |

## 4. Por categoria

| Categoria | Antes | Depois |
|---|---:|---:|
| Administração | 2 | 110 |
| Vida acadêmica | 6 | 53 |
| Locais do campus | 6 | 24 |
| Sistemas | 3 | 18 |
| Assistência estudantil | 3 | 13 |
| Colegiados | 0 | 13 |
| Representação estudantil | 0 | 3 |
| Unidades acadêmicas | 0 | 3 |
| Sem categoria | 38 | 38 |
| **Total** | **58** | **275** |

Os termos sem categoria são os da base antiga. Eles recebem categoria com o PR #136.

## 5. O que mudou na conferência

O robô propõe a sigla, o nome, a categoria, a definição e o exemplo. A sigla e o nome vêm da fonte. A definição e o exemplo são rascunhos do Gemini, que recebe só o trecho coletado. Numa lista de siglas, esse trecho é a própria sigla com o nome.

Antes de cada merge, os rascunhos foram comparados com uma fonte oficial:

- **173 definições** usam uma frase do PDI ou do site do órgão, em linguagem simples, e o campo `fonte` aponta para a página.
- **44 definições** não têm frase que explique o termo, então dizem só o que o nome e a estrutura da UnB informam. São as primeiras a trocar quando aparecer uma fonte melhor.
- **18 nomes** vieram errados na lista do PDI e foram corrigidos, como CBDU (a lista traz BDU), CGD (CDG-UnB), Codim (Codin), CPLAD (é Câmara), Enade, IFES, PNAES e UED.
- **PDI** entrou no lugar de PD&I, porque as duas siglas têm a mesma chave no robô.
- **3 termos antigos** tiveram o significado atualizado: CEAD, CEAM e DPO.
- **21 propostas** ficaram de fora por serem externas à universidade ou redundantes: ABED, APCNs, ARWU, ATS, CAREL-UnB, CEP, CGRIFES, CIESUD, CNRMS, CTC-ES, ENAP, ESUD, Forproex, GE, NITCDT, PNPG, RUE, SBPC, PSBE, SNPG, THE.

Os exemplos de uso são frases ilustrativas e não vêm da fonte.

## 6. O que ainda fica em aberto

- 16 candidatos seguem como conflito no relatório do robô, sem mudar o site. A maioria é erro da lista do PDI. CPP e SIC têm um segundo significado real que ainda não está no glossário.
- O PR #170 corrige o nome de mais seis termos, sem mudar o total.
- O PR #136 dá categoria aos termos antigos.

## 7. Como refazer

```sh
npm ci
npm run coleta:completa
```

A explicação do filtro e da revisão está em [`FILTRO-DE-TERMOS.md`](FILTRO-DE-TERMOS.md). Os números da coleta mais recente ficam em `coleta/relatorio.json`.
