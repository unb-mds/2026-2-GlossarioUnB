# Constituição do Projeto — Glossário UnB

- **Versão:** 0.1.0 (Rascunho — Sprint 01, revisado na Release 2)
- **Status:** Proposto para Revisão do Time
- **Metodologia:** Desenvolvimento Guiado por Especificação (*Spec-Driven Development* — SDD)

---

## 1. Propósito

Esta Constituição estabelece os fundamentos, princípios inegociáveis e limites de fronteira do **Glossário UnB**. No desenvolvimento guiado por especificação (*Spec-Driven Development*), ela serve como a **bússola de produto e engenharia**, garantindo que o time e a comunidade compreendam com clareza a essência do projeto antes e durante a evolução do produto.

Qualquer funcionalidade, decisão arquitetural ou contribuição futura deve ser avaliada contra as diretrizes desta Constituição.

---

## 2. O que o Glossário UnB É

O **Glossário UnB** é:

1. **Um dicionário colaborativo e aberto da UnB:** Uma fonte centralizada, confiável e descomplicada de significados de siglas, gírias, expressões acadêmicas e pontos de referência típicos da Universidade de Brasília.
2. **Uma ferramenta de utilidade pública para a comunidade:** Feita sob medida para calouros, veteranos, professores, técnicos e visitantes que precisam decifrar o vocabulário próprio do cotidiano universitário da UnB (ex.: *DEG*, *ICC*, *Ceubinho*, *"menção SR"*, *"trancamento geral"*).
3. **Uma aplicação PWA (*Progressive Web App*) de consulta rápida:** Um produto leve, responsivo, *mobile-first* e com **consulta dos termos offline** via *Service Worker* ([ADR 0003](../docs/adr/0003-pwa-com-service-worker-proprio.md)), mantendo o mapa interativo dependente de conexão para carregar os tiles externos ([ADR 0005](../docs/adr/0005-mapa-de-locais-com-leaflet.md)).
4. **Um ecossistema centrado na comunidade e na facilidade de contribuição:** Um projeto cujo conteúdo evolui organicamente através de contribuições tanto de pessoas técnicas (via *Pull Requests* no GitHub) quanto de pessoas sem conhecimento em Git (via *templates de issues* simples e diretos).
5. **Uma base de dados estruturada e verificável:** Um repositório de termos curados, padronizados conforme schema e onde toda definição possui fonte oficial ou contextualização comprovada.
6. **Um projeto de engenharia com foco em acessibilidade e qualidade:** Desenvolvido com padrões rigorosos de acessibilidade web (a11y), navegação fluida por teclado, contraste adequado e suporte a tema claro/escuro.

---

## 3. O que o Glossário UnB NÃO É

Para proteger o escopo e evitar complexidade acidental, declaramos formalmente o que o projeto **NÃO É**:

1. **NÃO É um substituto dos sistemas institucionais da UnB:** Não replica nem substitui o SIGAA, Matrícula Web, Aprender 3, SEI ou portais oficiais da UnB.
2. **NÃO É uma rede social ou fórum de debates:** Não possui *feed* de postagens, curtidas, comentários públicos, mensagens privadas ou áreas para discussões abertas.
3. **NÃO É uma plataforma com autenticação ou cadastro obrigatório:** Não exige login nem coleta credenciais de usuários para consulta de termos. O acesso à informação é anônimo, imediato e universal no MVP.
4. **NÃO É um espaço para fofocas, ofensas ou violações de privacidade:** Não admite termos que exponham, ofendam ou identifiquem pessoas, apelidos pejorativos de terceiros, discurso de ódio ou dados pessoais sensíveis; nomes próprios são admitidos apenas quando fazem parte do nome oficial de um lugar, unidade ou programa da UnB (ex.: *Darcy Ribeiro*, *Memorial Darcy Ribeiro*), em conformidade com a LGPD ([RNF08](../docs/REQUISITOS.md)) e o [Código de Conduta](../CODE_OF_CONDUCT.md).
5. **NÃO É um dicionário geral da língua portuguesa:** Não tem como escopo definir termos genéricos que não possuam vínculo direto, histórico ou semântico específico com a vida e a estrutura da Universidade de Brasília.
6. **NÃO É uma aplicação pesada ou com infraestrutura inflada:** Rejeita arquiteturas desnecessariamente complexas que demandem altos custos de hospedagem, servidores dedicados dispensáveis ou dependência de conectividade constante para consultas básicas.

---

## 4. Princípios Fundamentais (Core Tenets)

1. **Verificabilidade e Confiabilidade:** Nenhum termo é publicado sem fonte, significado claro e contexto de uso real na UnB → implementado pelo schema único e validação no CI ([ADR 0004](../docs/adr/0004-schema-unico-do-termo.md), [ci.yml](../.github/workflows/ci.yml)) e pelo pipeline de coleta e filtragem com revisão humana ([ADR 0009](../docs/adr/0009-coleta-automatizada-por-pipeline.md), [ADR 0014](../docs/adr/0014-filtro-de-termos-do-robo.md)).
2. **Simplicidade Radical (*KISS* & *YAGNI*):** Preferir sempre a solução mais simples que entregue valor imediato ao estudante → implementado pelo dataset em JSON estático sem backend ([ADR 0001](../docs/adr/0001-termos-em-json-estatico.md)), frontend sem framework ([ADR 0002](../docs/adr/0002-frontend-sem-framework.md)), PWA sem Workbox ([ADR 0003](../docs/adr/0003-pwa-com-service-worker-proprio.md)) e CSS puro com tokens ([ADR 0008](../docs/adr/0008-interface-com-css-puro-e-tokens.md)).
3. **Acessibilidade Universal:** O glossário deve ser utilizável por qualquer pessoa, em qualquer dispositivo e com qualquer tecnologia assistiva → implementado pelos tokens de tema claro/escuro e contraste ([ADR 0008](../docs/adr/0008-interface-com-css-puro-e-tokens.md)), pelas metas de qualidade ([docs/REQUISITOS.md](../docs/REQUISITOS.md)) e pelas auditorias automatizadas de acessibilidade ([ADR 0010](../docs/adr/0010-bibliotecas-nos-scripts-do-robo.md)).
4. **Acolhimento da Comunidade:** Quem deseja sugerir ou corrigir um termo nunca deve ser impedido por barreiras técnicas de ferramentas como o Git → implementado pelo fluxo simplificado por Issue Forms e Pull Requests ([ADR 0006](../docs/adr/0006-contribuicao-por-pr-e-issue.md)), pelos [templates de issue](../.github/ISSUE_TEMPLATE/) e pelo guia em [`CONTRIBUTING.md`](../CONTRIBUTING.md).
5. **Engenharia Transparente e Rastreável:** Todo processo segue especificações claras, decisões registradas em ADRs, commits convencionais e prestação de contas no uso de ferramentas de IA → mantido em [`docs/adr/`](../docs/adr/), [`docs/CONVENCAO-GIT.md`](../docs/CONVENCAO-GIT.md), [`docs/PROCESSO.md`](../docs/PROCESSO.md), [`AI-USAGE.md`](../AI-USAGE.md) e [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md).

---

## 5. Governança e Evolução

Esta Constituição é uma especificação viva com estabilidade protegida:
- Este documento permanece em versão `0.1.0` enquanto rascunho em revisão; após a aprovação formal da equipe G10, passa à versão `1.0.0`.
- Propostas de alteração em suas seções fundamentais devem ser discutidas pelo time e formalizadas por meio de *Pull Request* revisado, conforme o fluxo em [`docs/PROCESSO.md`](../docs/PROCESSO.md).
