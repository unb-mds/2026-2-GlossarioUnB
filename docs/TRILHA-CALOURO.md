# Trilha do calouro: "Primeiros passos na UnB"

Os termos que o calouro precisa conhecer na primeira semana, agrupados pelo que ele precisa fazer. A página inicial mostra esta lista na seção "Primeiros passos na UnB" (#70), lida de `frontend/data/trilha-calouro.json`.

Lista de 17/11/2026, com as gírias do campus acrescentadas em 18/11/2026, montada a partir do **[Manual do Calouro 2026/2](https://deg.unb.br/wp-content/uploads/manual_do_calouro_2026_2.pdf)** do DEG (134 páginas, de 25/05/2026) e dos sites oficiais de cada serviço e de cada lugar. As páginas citadas são as do PDF. O catálogo completo das fontes está em [`FONTES-DE-DADOS.md`](FONTES-DE-DADOS.md).

## Os 20 termos

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
| Gírias do campus | **Ceubinho** (o vão da ala norte do ICC) | já existe, com fonte e definição a corrigir | [UnB Notícias](https://noticias.unb.br/112-extensao-e-comunidade/753-comunidade-academica-repudia-atos-violentos-na-unb) |
| | **Minhocão** (o ICC) | falta | [CEPLAN](https://ceplan.unb.br/campus-universitario-darcy-ribeiro/) |
| | **Beijódromo** (o Memorial Darcy Ribeiro) | falta | [CEPLAN](https://ceplan.unb.br/campus-universitario-darcy-ribeiro/) |

**Na base:** dos 17 primeiros, a BCE e o DAC já existiam, e os outros 15 entraram à mão pelo PR da #70 (o #124), cada um com a fonte da tabela, porque o robô de coleta ainda não lê o manual (é PDF, ver `FONTES-DE-DADOS.md` nº 4). Das 3 gírias, o Ceubinho já existia, com a fonte "conhecimento comum"; ele ganha a fonte da UnB e a definição corrigida, e o Minhocão e o Beijódromo entram à mão. As mesmas páginas entram nas fontes do robô (`coleta/fontes.json`), para a coleta real (#62) confirmar as 3 gírias.

## Por que estes

- **Um grupo por necessidade da primeira semana**, como pede a issue: comer e estudar, entender a nota, entrar nos sistemas, montar a grade e pedir apoio.
- **De 3 a 4 termos por grupo**, para a seção caber numa tela de celular sem virar a lista completa.
- **Só termos com fonte oficial** (`*.unb.br`). O teste `tests/trilha.test.js` confere isso.
- **Um grupo de gírias do campus**: os apelidos que os veteranos usam para os lugares, que o calouro escuta na primeira semana e não acha com esse nome nos documentos da secretaria. Cada um tem uma página da UnB que usa o apelido, então a regra da fonte oficial continua a mesma para eles. A definição do Ceubinho segue essas páginas: o vão da ala norte do ICC, onde acontecem atos e eventos, e não uma praça de alimentação.

## O que ficou de fora e por quê

- **PPAES:** a issue #70 e o `REQUISITOS.md` §1 citam, mas esse nome não aparece no Manual do Calouro 2026/2. Os programas de lá são o Auxílio Socioeconômico (PASeUnB), o PACreche, o Auxílio Alimentação no RU e os outros da p. 86 e 87. Por isso a trilha usa o Auxílio Socioeconômico.
- **Cada menção separada (SS, MS, MM, MI, II):** a definição de "Menção" já traz a escala, e a busca encontra "MM" dentro dela. Só o **SR** ganhou termo próprio, porque é o que mais confunde (reprovação por falta).
- **Udefinho** (o vão da ala sul do ICC): a página da UnB que cita o apelido (a Revista Darcy) não traz o nome do lugar numa frase que o robô consiga ler e confirmar, como faz com as outras 3 gírias. Pode entrar à mão depois.
- **Calendário acadêmico, coordenação, créditos:** importam, mas a definição de "Matrícula" já aponta para o calendário. Ficam para a lista completa.

## Validação

A issue pede a lista validada por pelo menos 2 calouros ou veteranos. O retorno de cada pessoa (o que faltou, o que sobrou, o que não entendeu) fica registrado na issue #69, e as mudanças que vierem dele entram neste arquivo e no `trilha-calouro.json`.
