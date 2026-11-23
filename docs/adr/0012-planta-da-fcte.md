# ADR 0012 — Planta 2D da FCTE no site

## Status
Decidida entre 19 e 20/11/2026 por mim (Pedro), responsável pela issue desta planta. A revisão do PR é a validação do grupo. As decisões estão numeradas como no meu registro (22, 24 a 27, 29 a 33 e 45).

## Contexto
- **Quem procura uma sigla de lugar da FCTE (um laboratório, um prédio) quer saber onde ele fica.** O termo hoje só tem texto e, quando tem, um mapa externo (Leaflet, ADR 0005) que mostra o campus inteiro como um ponto.
- **Já existe um levantamento dos três prédios (UAC, UED e UEP/LDTEA) com as salas em metros**, feito fora do repositório, e um gerador que o transforma em desenho 2D.
- **A maior parte dos lugares da FCTE ainda não está no `termos.json`:** os termos chegam só pelo robô (decisão 8). Em 23/11, com 275 termos, `fcte` (o campus) e `ldtea` (o prédio UEP/LDTEA) já existem; os laboratórios entram quando as páginas da FCTE estiverem nas fontes do robô (#61) e uma rodada trouxer as siglas.
- **O contrato dos termos (ADR 0004) e o `validacao-termo.js` são usados pelo time e pelo robô** e não devem mudar por causa da planta.

## Decisão
- **22 · 2D sempre, em SVG gerado do JSON, sem biblioteca, offline.** O 3D (Three.js 0.160.0 por CDN com SRI, só em `planta.html`) fica para depois.
- **24 · É a planta que diz qual termo está em cada lugar.** O campus e cada prédio guardam o `termo` (o id), cada sala guarda `termos` (a lista de ids), e o `termos.json` não muda.
- **25 · O JSON da planta sai de um gerador que, por agora, fica fora do repositório.** O gerador e o levantamento entram depois da R2.
- **26 · Na R2 entra só o 2D:** o bloco "Onde fica" no termo e a página do andar inteiro.
- **27 · Termos novos chegam só pelo robô.** As páginas da FCTE entram em `coleta/fontes.json` (PR do robô).
- **29 · A planta pode guardar o id de um termo que ainda não existe e liga sala, prédio e campus.** O site só mostra "Onde fica" quando o termo existe. O teste confere o formato do id e que cada termo tem um lugar só; não exige que o termo já exista. O termo `fcte` mostra o campus.
- **30 · Estilo "aplicativo":** cores do site, tokens `--planta-*` no `styles.css` nos dois temas, a sala em destaque com contorno mais grosso (não só cor).
- **31 · `frontend/data/planta-fcte.json`, enxuto, com `versao`.** Campos (versão 2): `versao`, `gerado_em`, `campus {id, nome, termo?}`, `predios[{id, sigla, nome, termo?, contorno, patios, andares[{id, nome, corredores[{eixo, largura}], itens[{id, rotulo, nome, tipo, cantos, termos?}]}]}]`, em metros e com 2 casas. Fica de fora do arquivo o que é interno do levantamento (confiança, estado, dúvidas, mudanças, regras).
- **32 · Endereço `planta.html?predio=&andar=&sala=`.** `planta.html` sem parâmetros mostra o campus. A função `enderecoAndar` (em `frontend/js/planta.js`) é a única que monta o link, e `lerEnderecoAndar` a única que o lê.
- **33 · O arquivo da planta e `planta.html` entram no cache do aplicativo** (app shell do `sw.js`), como os outros arquivos; os dados respondem do cache e se atualizam em segundo plano. `VERSAO_CACHE` sobe.

- **45 · Uma sala pode abrigar várias siglas.** Cada sigla vira um termo próprio pelo robô e todas levam à mesma sala (ex.: LAPPIS, LATEd e LIST). Na página do andar, tocar numa sala abre o endereço dela e mostra um link para cada sigla que já existe.

Como fica no código: `planta.js` (regras sem DOM: achar o lugar, desenhar o SVG, conferir ligações, endereços), com `tests/planta.test.js` e `tests/planta-dados.test.js`; o `app.js` só cria os elementos. O SVG entra na página pelo `DOMParser`, nunca por `innerHTML`, e todo texto da planta sai escapado.

## Alternativas descartadas
- **Guardar o termo dentro do `termos.json` (um campo `lugar` no termo).** Muda o schema da ADR 0004 e os arquivos do robô; a planta ficaria espalhada em 56+ termos.
- **Ligar só termos que já existem (integridade forte).** Na R2 só o `fcte` teria o bloco, e cada termo novo exigiria uma edição manual no PR do robô.
- **Arquivo completo do gerador no site (`planta-2d.json`) ou um arquivo por prédio.** O primeiro leva campos internos como se fossem contrato; o segundo obriga a abrir vários arquivos para achar uma sala.
- **`planta.html?termo=...` como único endereço.** Não serve para navegar por andar quando a sala não tem termo.
- **Cache só sob demanda.** Offline, o "Onde fica" só apareceria para quem já tivesse visto um lugar, e exigiria uma segunda regra no `sw.js`.
- **Outros estilos de desenho (técnico, sinalização, aventura, mundo aberto).** Trocar é só mudar os valores dos tokens `--planta-*`.

## Consequências
- (+) Os laboratórios ganham o mapa sozinhos quando o PR do robô trouxer os termos, sem outro PR (se o robô usar o id que a planta espera: a sigla sem acento e sem espaços, como `labss`).
- (+) O contrato dos termos não muda; a planta pode ser regerada sem mexer no glossário.
- (+) O desenho é um texto SVG: nítido em qualquer zoom e disponível offline.
- (−) Se o robô escolher outro id, a ligação fica sem dono em silêncio (o teste não acusa de propósito). O teste lista os pendentes para conferência.
- (+) Quem procura qualquer sigla de uma sala compartilhada chega ao mesmo lugar.
- (−) Prédio e campus continuam com um termo só: `ldtea` mostra o prédio, e `uep` ainda não.
- (−) O mesmo id pode chegar com outro sentido. O `ued` do glossário é o tipo de prédio da UnB inteira (a UED do ICS, a do IPOL/IREL), e o `uep` é o prédio de Ceilândia; por isso o prédio UED da FCTE fica sem ligação por enquanto, e cada ligação nova pede conferir o sentido do termo, não só o id.
- (−) Cada visitante baixa o arquivo da planta (cerca de 52 KB, 7 KB comprimido) mesmo sem abrir um lugar.
- Fica para depois: o gerador e o levantamento no repositório (com testes e atualização desta ADR) e o 3D (`versao: 3`, com altura e ângulo das salas).
