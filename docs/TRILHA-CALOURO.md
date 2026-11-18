# Trilha do calouro: "Primeiros passos na UnB"

Os termos que o calouro precisa conhecer na primeira semana, agrupados pelo que ele precisa fazer. A página inicial mostra esta lista na seção "Primeiros passos na UnB" (#70), lida de `frontend/data/trilha-calouro.json`.

Lista de 17/11/2026, montada a partir do **[Manual do Calouro 2026/2](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf)** do DEG (134 páginas, de 25/05/2026) e dos sites oficiais de cada serviço. As páginas citadas são as do PDF. O catálogo completo das fontes está em [`FONTES-DE-DADOS.md`](FONTES-DE-DADOS.md).

## Os 17 termos

| Grupo | Termo | Na base? | Fonte oficial |
|---|---|---|---|
| Onde comer e onde estudar | **RU** (Restaurante Universitário) | falta | [ru.unb.br](https://ru.unb.br/) |
| | **BCE** (Biblioteca Central) | já existe | [bce.unb.br](https://bce.unb.br/) |
| | **ICC** (Instituto Central de Ciências) | falta | [Manual, p. 84](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=84) |
| Notas | **Menção** (SS, MS, MM, MI, II, SR) | falta | [Manual, p. 46](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=46) |
| | **SR** (Sem Rendimento) | falta | [Manual, p. 46](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=46) |
| | **IRA** (Índice de Rendimento Acadêmico) | falta | [Manual, p. 49](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=49) |
| Sistemas | **SIGAA** | falta | [Manual, p. 15](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=15) |
| | **Aprender 3** (Moodle da UnB) | falta | [Manual, p. 14](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=14) |
| | **E-mail institucional** (@aluno.unb.br) | falta | [Manual, p. 14](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=14) |
| Matrícula e trancamento | **Matrícula** (e rematrícula) | falta | [Manual, p. 38](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=38) |
| | **Fluxo** (do curso) | falta | [Manual, p. 24](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=24) |
| | **TGM** (Trancamento Geral de Matrícula) | falta | [Manual, p. 58](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=58) |
| | **SAA** (Secretaria de Administração Acadêmica) | falta | [Manual, p. 18](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=18) |
| Apoio estudantil | **DAC** (Decanato de Assuntos Comunitários) | já existe | [dac.unb.br](https://dac.unb.br/) |
| | **DDS** (Diretoria de Desenvolvimento Social) | falta | [Manual, p. 87](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=87) |
| | **Auxílio Socioeconômico** (PASeUnB) | falta | [Manual, p. 86](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf#page=86) |
| | **DASU** (Diretoria de Atenção à Saúde da Comunidade Universitária) | falta | [dasu.unb.br](https://dasu.unb.br/) |

**Na base:** 2 dos 17 (BCE e DAC). Os 15 que faltam entram à mão pelo PR da #70, cada um com a fonte da tabela, porque o robô de coleta ainda não lê o manual (é PDF, ver `FONTES-DE-DADOS.md` nº 4).

## Por que estes

- **Um grupo por necessidade da primeira semana**, como pede a issue: comer e estudar, entender a nota, entrar nos sistemas, montar a grade e pedir apoio.
- **De 3 a 4 termos por grupo**, para a seção caber numa tela de celular sem virar a lista completa.
- **Só termos com fonte oficial** (`*.unb.br`). O teste `tests/trilha.test.js` confere isso.

## O que ficou de fora e por quê

- **Ceubinho:** a issue #70 cita, mas a fonte dele na base é "conhecimento comum" (issue #30), não um site da UnB. O Correio Braziliense (2022) também o descreve de outro jeito: como o corredor entre as alas Norte e Central do ICC, e não como praça de alimentação. Fica como sugestão para a #65 (correção dos termos atuais).
- **PPAES:** a issue #70 e o `REQUISITOS.md` §1 citam, mas esse nome não aparece no Manual do Calouro 2026/2. Os programas de lá são o Auxílio Socioeconômico (PASeUnB), o PACreche, o Auxílio Alimentação no RU e os outros da p. 86 e 87. Por isso a trilha usa o Auxílio Socioeconômico.
- **Cada menção separada (SS, MS, MM, MI, II):** a definição de "Menção" já traz a escala, e a busca encontra "MM" dentro dela. Só o **SR** ganhou termo próprio, porque é o que mais confunde (reprovação por falta).
- **Calendário acadêmico, coordenação, créditos:** importam, mas a definição de "Matrícula" já aponta para o calendário. Ficam para a lista completa.

## Validação

A issue pede a lista validada por pelo menos 2 calouros ou veteranos. O retorno de cada pessoa (o que faltou, o que sobrou, o que não entendeu) fica registrado na issue #69, e as mudanças que vierem dele entram neste arquivo e no `trilha-calouro.json`.
