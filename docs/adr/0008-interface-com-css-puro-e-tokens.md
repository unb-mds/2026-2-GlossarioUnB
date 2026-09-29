# ADR 0008 — Interface com CSS puro, tokens de cor e fontes do sistema

## Contexto
O visual do MVP foi refeito em 28/09. Com a carga de 40 siglas reais, o problema deixou de ser "mostrar 5 termos" e passou a ser "achar e ler rápido um termo entre dezenas".

A interface precisava respeitar quatro coisas:

- **As personas do Figma:**
  - o calouro jovem quer "busca rápida, tipo Google";
  - o calouro 60+ precisa de "fonte maior, navegação mais simples";
  - o veterano "não quer navegar por menus, quer digitar e achar rápido".
- **Acessibilidade**, com contraste, teclado e leitor de tela. Era o RNF02 até a revisão dos requisitos de 28/09 (PR #27); o time mantém como prática de qualidade.
- **RNF01 / ADR 0003:** a interface precisa funcionar **offline**, e o service worker só guarda arquivos da mesma origem.
- **ADR 0002:** sem framework e sem etapa de build.

## Decisão
- **CSS puro num único `styles.css`**, com as cores definidas **só como tokens** (variáveis CSS) nos blocos `:root`. Os temas claro e escuro trocam apenas os tokens.
- **Fontes do sistema** (`system-ui`), sem fonte web: nada a baixar, nada que falhe offline.
- **Ícones em SVG inline no HTML:** lupa e lua/sol. O ícone do tema é trocado pelo CSS, não por emoji.
- **Regras fixas de legibilidade:**
  - texto base de 17 px;
  - alvos de toque de pelo menos 44 px;
  - toda combinação de texto e fundo com contraste **WCAG AA**;
  - foco sempre visível;
  - animações só com `prefers-reduced-motion: no-preference`.
- **Estrutura de telas:**
  - busca em destaque na página inicial;
  - barra compacta nas páginas internas;
  - lista em cartões (termo + significado) com índice alfabético;
  - rodapé em todas as páginas com o link para o modelo "Adicionar termo" (ADR 0006).
- **Verificação:** auditoria automatizada com **axe-core** (WCAG 2.1 A/AA + boas práticas) nas três páginas, nos temas claro e escuro.

## Alternativas descartadas
- **Bootstrap / Tailwind.** O Tailwind exige build (contraria a ADR 0002). O Bootstrap via CDN não fica no cache do service worker (contraria a ADR 0003) e traz muito mais CSS do que 3 páginas usam.
- **Fonte web (Google Fonts).** Dependência de terceiros, requisição extra e texto com fonte trocada quando offline. Hospedar a fonte no repositório resolveria o offline, mas soma peso sem ganho de legibilidade.
- **Biblioteca de ícones** (Font Awesome etc.). Os 3 ícones usados cabem em poucas linhas de SVG.

## Consequências
- (+) Nenhuma dependência nova; o app continua 100% offline depois da primeira visita.
- (+) Trocar a paleta, por exemplo para a identidade oficial da UnB, é mexer só nos tokens.
- (−) A página "Sobre o projeto" (`sobre/`) é um site separado, com o próprio `estilo.css`. Os tokens estão **copiados** do glossário, então uma mudança de paleta precisa ser feita nos dois arquivos. Ela não tem JavaScript: o tema segue só a preferência do sistema.
- (−) Barra e rodapé se repetem nas 3 páginas, como já previa a ADR 0002. Um script curto de tema também se repete no `<head>` de cada página, para evitar que a tela "pisque" no tema errado.
- (−) As cores são inspiradas no azul e no verde da UnB, mas não seguem o manual da marca. Em 28/09 o ícone do app passou a ser o **logotipo oficial da UnB**. **[FALTA: conferir as regras de uso da marca em marca.unb.br]**
