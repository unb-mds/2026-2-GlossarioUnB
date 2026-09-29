# ADR 0005 — Mapa de locais com Leaflet e OpenStreetMap


## Contexto
- O mapa **não está no Story Map**. Aparece na matriz impacto × esforço do Figma como "Mapa para termos 'local'" (alto impacto, alto esforço) e entre os diferenciais do benchmark (PR #26, "mapa de locais").
- O MVP do colega (26/09) já o implementa com Leaflet 1.9.4 (via unpkg) e tiles do OpenStreetMap, só na página do termo e só quando o termo tem `localizacao`.

## Decisão
- O mapa é opcional **por termo**: aparece somente quando o termo tem `localizacao` (ADR 0004).
- Leaflet 1.9.4 é carregado do CDN com **Subresource Integrity** (`integrity` + `crossorigin`), apenas em `termo.html`.
- A atribuição "© OpenStreetMap contributors" fica **visível**, como exige a política de uso de tiles do OSM. O MVP desligava a atribuição (`attributionControl: false`).
- Offline, ou se a biblioteca não carregar, a página mostra um aviso no lugar do mapa, sem quebrar.

## Alternativas descartadas
- **Embed do Google Maps.** Exige chave de API e aceitar termos de uso de terceiros.
- **Imagem estática por local.** Sem interação, e alguém precisa gerar e manter uma imagem por termo.
- **Não ter mapa na Release 1.** Continua sendo uma opção legítima, porque o Story Map não prioriza o mapa. Cabe à equipe decidir.

## Consequências
- (−) Depende de CDN externo e dos tiles do OSM; o mapa não funciona offline (ADR 0003).
- (−) Cada `localizacao` precisa de coordenadas verificadas. As dos termos de exemplo **não foram verificadas**.
