# Constituição do Projeto — Glossário UnB

> **Versão:** 1.0.0 (Rascunho Inicial — Sprint 01)  
> **Status:** Proposto para Revisão do Time  
> **Metodologia:** Desenvolvimento Guiado por Especificação (*Spec-Driven Development* — SDD)

---

## 1. Propósito

Esta Constituição estabelece os fundamentos, princípios inegociáveis e limites de fronteira do **Glossário UnB**. No desenvolvimento guiado por especificação (*Spec-Driven Development*), ela serve como a **bússola de produto e engenharia**, garantindo que o time e a comunidade compreendam com clareza a essência do projeto antes da implementação.

Qualquer funcionalidade, arquitetura ou contribuição futura deve ser avaliada contra as diretrizes desta Constituição.

---

## 2. O que o Glossário UnB É

O **Glossário UnB** é:

1. **Um dicionário colaborativo e aberto da UnB:** Uma fonte centralizada, confiável e descomplicada de significados de siglas, gírias, expressões acadêmicas e pontos de referência típicos da Universidade de Brasília.
2. **Uma ferramenta de utilidade pública para a comunidade:** Feita sob medida para calouros, veteranos, professores, técnicos e visitantes que precisam decifrar o vocabulário próprio do cotidiano universitário da UnB (ex.: *DEG*, *ICC*, *Ceubinho*, *"menção SR"*, *"trancamento geral"*).
3. **Uma aplicação PWA (*Progressive Web App*) de consulta rápida:** Um produto leve, responsivo, *mobile-first* e com funcionamento *offline*, garantindo acesso rápido mesmo em áreas do campus com sinal de internet instável.
4. **Um ecossistema centrado na comunidade e na facilidade de contribuição:** Um projeto cujo conteúdo evolui organicamente através de contribuições tanto de pessoas técnicas (via *Pull Requests* no GitHub) quanto de pessoas sem conhecimento em Git (via *templates de issues* simples e diretos).
5. **Uma base de dados estruturada e verificável:** Um repositório de termos curados, padronizados conforme schema e onde toda definição possui fonte oficial ou contextualização comprovada.
6. **Um projeto de engenharia com foco em acessibilidade e qualidade:** Desenvolvido com padrões rigorosos de acessibilidade web (a11y), navegação fluida por teclado, contraste adequado e arquitetura preparada para internacionalização (i18n).

---

## 3. O que o Glossário UnB NÃO É

Para proteger o escopo e evitar complexidade acidental, declaramos formalmente o que o projeto **NÃO É**:

1. **NÃO É um substituto dos sistemas institucionais da UnB:** Não replica nem substitui o SIGAA, Matrícula Web, Aprender 3, SEI ou portais oficiais da UnB.
2. **NÃO É uma rede social ou fórum de debates:** Não possui *feed* de postagens, curtidas, comentários públicos, mensagens privadas ou áreas para discussões abertas.
3. **NÃO É uma plataforma com autenticação ou cadastro obrigatório:** Não exige login nem coleta credenciais de usuários para consulta de termos. O acesso à informação é anônimo, imediato e universal no MVP.
4. **NÃO É um espaço para fofocas, ofensas ou violações de privacidade:** Não admite nomes de pessoas físicas, apelidos pejorativos de terceiros, termos difamatórios, discurso de ódio ou dados pessoais sensíveis, em total conformidade com a LGPD e o Código de Conduta.
5. **NÃO É um dicionário geral da língua portuguesa:** Não tem como escopo definir termos genéricos que não possuam vínculo direto, histórico ou semântico específico com a vida e a estrutura da Universidade de Brasília.
6. **NÃO É uma aplicação pesada ou com infraestrutura inflada:** Rejeita arquiteturas desnecessariamente complexas que demandem altos custos de hospedagem, servidores dedicados dispensáveis ou dependência de conectividade constante para consultas básicas.

---

## 4. Princípios Fundamentais (Core Tenets)

1. **Verificabilidade e Confiabilidade:** Nenhum termo é publicado sem fonte, significado claro e contexto de uso real na UnB.
2. **Simplicidade Radical (*KISS* & *YAGNI*):** Preferir sempre a solução mais simples que entregue valor imediato ao estudante.
3. **Acessibilidade Universal:** O glossário deve ser utilizável por qualquer pessoa, em qualquer dispositivo e com qualquer tecnologia assistiva.
4. **Acolhimento da Comunidade:** Quem deseja sugerir ou corrigir um termo nunca deve ser impedido por barreiras técnicas de ferramentas como o Git.
5. **Engenharia Transparente e Rastreável:** Todo processo segue especificações claras, decisões registradas em ADRs, commits convencionais e prestação de contas no uso de ferramentas de IA.

---

## 5. Governança e Evolução

Esta Constituição é um documento vivo durante a fase de especificação, mas possui estabilidade protegida:
- Propostas de alteração em suas seções fundamentais exigem discussão com o Product Owner (PO), alinhamento com a equipe G10 e abertura de um *Pull Request* específico.
- A revisão e o refinamento detalhado desta especificação ocorrerão na Sprint 02, conforme o planejamento das *Releases*.
