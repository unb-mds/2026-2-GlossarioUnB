# ADR 0003 — PWA com manifest e service worker próprios, sem Workbox


## Contexto
`docs/ARQUITETURA.md` reserva esta ADR como "Ferramenta de PWA/service worker. Depende da escolha de framework (ADR 0002)".

- **Story Map (MVP):** "Quero consultar termos offline"; "queremos implementar PWA, permitindo o usuário instalar um app nativo em única base de código".
- **Requisito:** RNF01, instalável e funcionando offline para consulta.
- **Estudo de PWA (PR #26):** lista os três pilares (HTTPS, manifest, service worker) e as estratégias de cache (cache primeiro, rede primeiro, cache com atualização em segundo plano).
- **Estado atual:** o MVP do colega já tem `manifest.json` e `sw.js` escritos à mão.

## Decisão
Manter `manifest.json` e `sw.js` **escritos à mão**, sem Workbox, com as estratégias abaixo.

| Recurso | Estratégia |
|---|---|
| App shell (HTML, CSS, JS, ícones) | Pré-cache na instalação e depois cache primeiro |
| `data/termos.json` | Pré-cache na instalação e depois *stale-while-revalidate* (só guarda respostas `ok`) |
| Navegação entre páginas | Rede primeiro, com fallback para a página em cache (ignorando `?id=`) |
| Leaflet e tiles do mapa (outra origem) | Só rede; offline mostra um aviso (ADR 0005) |

Cada mudança no app shell exige incrementar `VERSAO_CACHE` em `sw.js`.

**Origem compartilhada (28/09):** no GitHub Pages, `unb-mds.github.io` é o mesmo endereço de todos os projetos da organização.
- Os caches deste app usam o prefixo `glossario-unb-`.
- Ao ativar, o service worker apaga **só** os caches antigos com esse prefixo; os de outros projetos ficam intactos.
- O escopo do service worker é `/frontend/`, então ele não intercepta a página "Sobre o projeto" (`/sobre/`).

## Alternativas descartadas
- **Workbox.** Exige build/CLI ou importação de CDN dentro do service worker, o que é exagero para cerca de 15 arquivos estáticos.
- **Sem service worker.** Não cumpre o RNF01 nem a história de consulta offline.

## Consequências
- (+) Nenhuma dependência; o comportamento offline cabe em um arquivo que qualquer pessoa lê.
- (−) Esquecer de incrementar `VERSAO_CACHE` deixa usuários com o shell antigo (documentado em `frontend/README.md`).
- (−) Service worker só funciona em HTTPS ou `localhost`, então a hospedagem precisa ter HTTPS (ADR 0007).
