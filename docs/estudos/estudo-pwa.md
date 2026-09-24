# Sprint 01 — Skills individuais e primeiros documentos do projeto

> Responsável: **Italo**

# PWA – Progressive Web App

## O que é um PWA?

**PWA (Progressive Web App)** é um site construído com tecnologias web comuns que se comporta como um aplicativo nativo. Ele pode ser **instalado** na tela inicial do celular ou do computador, **funcionar sem internet**, **enviar notificações** e abrir em tela cheia, tudo isso sem precisar passar por uma loja de aplicativos.

Em resumo: é um site que se comporta como um app.

---

## Por que usar PWA?

| Vantagem | Explicação |
|---|---|
| **Instalável** | O usuário adiciona o app à tela inicial direto pelo navegador |
| **Funciona offline** | Arquivos importantes ficam guardados no aparelho |
| **Rápido** | Como muita coisa já está salva, o carregamento é quase instantâneo |
| **Uma base só** | O mesmo projeto funciona em Android, iOS, Windows, macOS e Linux |
| **Sem loja de apps** | Não depende de aprovação da Google Play ou da App Store |
| **Atualização automática** | Basta publicar a nova versão no servidor |
| **Encontrável no Google** | Continua sendo um site, então pode ser indexado |

### Limitações

- Alguns recursos nativos ainda são limitados, principalmente no iOS.
- Tem menos visibilidade do que apps publicados em lojas oficiais.
- O acesso a certos recursos do aparelho depende do navegador.

---

## Os 3 pilares de um PWA

Para que um site seja considerado um PWA instalável, ele precisa de três coisas:

1. **HTTPS**: conexão segura (durante o desenvolvimento, o endereço local também é aceito).
2. **Manifest**: um arquivo que descreve o app.
3. **Service Worker**: um script que trabalha nos bastidores.

---

## 1. O Manifest

O manifest é como o **documento de identidade** do app. Ele informa ao navegador como o aplicativo deve aparecer e se comportar quando for instalado.

### O que ele define

| Informação | Para que serve |
|---|---|
| **Nome** | Nome completo do app |
| **Nome curto** | Texto exibido embaixo do ícone na tela inicial |
| **Página inicial** | Qual página abre quando o app é iniciado |
| **Modo de exibição** | Se abre como app independente, em tela cheia ou dentro do navegador |
| **Cor do tema** | Cor da barra superior do aparelho |
| **Cor de fundo** | Cor da tela de abertura (splash screen) |
| **Ícones** | Imagens do app em diferentes tamanhos (geralmente 192 e 512 pixels) |

---

## 2. O Service Worker

O Service Worker funciona como um **porteiro** entre o aplicativo e a internet. Toda vez que o app precisa de algo (uma página, uma imagem, dados), o Service Worker decide: "pego isso da internet ou uso a cópia que já tenho guardada?".

### O ciclo de vida

| Etapa | O que acontece |
|---|---|
| **Registro** | A página avisa o navegador que existe um Service Worker |
| **Instalação** | Na primeira vez, ele salva os arquivos essenciais no aparelho |
| **Ativação** | Ele assume o controle e apaga versões antigas guardadas |
| **Interceptação** | A cada pedido do app, ele decide de onde vem a resposta |


---

## 3. Estratégias de cache

Existem diferentes formas de combinar o que está guardado com o que vem da internet. A melhor escolha depende do tipo de conteúdo.

| Estratégia | Como funciona | Melhor para |
|---|---|---|
| **Cache primeiro** | Usa a cópia guardada; só busca na internet se não tiver | Imagens, estilos, fontes |
| **Rede primeiro** | Tenta a internet; se falhar, usa a cópia guardada | Notícias, preços, dados que mudam sempre |
| **Cache com atualização em segundo plano** | Mostra a cópia guardada na hora e atualiza para a próxima vez | Feeds, fotos de perfil |
| **Somente rede** | Sempre busca na internet | Pagamentos e dados sensíveis |
| **Somente cache** | Nunca usa a internet | Conteúdo que nunca muda |


---

## 4. Página offline

Quando não há internet e o conteúdo pedido não está guardado, o app pode exibir uma **página de aviso** em vez do erro padrão do navegador (aquele dinossauro do Chrome, por exemplo).

Uma boa página offline costuma ter:

- Uma mensagem clara, como "Você está sem conexão".
- Um botão de "Tentar novamente".
- Visual coerente com o resto do app.

---

## 5. Instalação do app

### No Android e no computador (Chrome, Edge)

O navegador oferece a opção de instalar quando detecta que o site cumpre os requisitos de um PWA. O desenvolvedor também pode criar um **botão próprio de instalação**, com o texto e o visual que preferir.

### No iPhone e iPad (Safari)

Não existe o aviso automático. O usuário instala manualmente:

1. Toca no botão **Compartilhar**.
2. Escolhe **Adicionar à Tela de Início**.

---

## 6. Notificações push

Com um PWA, é possível enviar avisos ao usuário mesmo quando o app está fechado, como promoções, mensagens ou lembretes.

O processo funciona em três passos:

1. O app **pede permissão** ao usuário.
2. Se ele aceitar, o aparelho é **registrado** em um serviço de envio de notificações.
3. O servidor do app **envia a mensagem**, e o Service Worker a exibe na tela.

> **Boa prática:** peça permissão só no momento certo, explicando por que as notificações são úteis. Pedir logo na primeira visita costuma resultar em recusa.


---

## Exemplos de PWAs conhecidos

| App | Resultado destacado |
|---|---|
| **Twitter Lite (X)** | Menor consumo de dados e mais engajamento |
| **Pinterest** | Mais tempo de uso após a versão PWA |
| **Starbucks** | Permite ver o cardápio e montar pedidos mesmo offline |
| **Uber** | Versão leve que funciona bem em conexões lentas |
| **Spotify Web Player** | Pode ser instalado como app no computador |

---

## Checklist rápido

- [ ] Site em **HTTPS**
- [ ] **Manifest** configurado e ligado à página
- [ ] Ícones nos tamanhos **192x192** e **512x512**
- [ ] **Service Worker** registrado
- [ ] **Página offline** criada
- [ ] Layout **responsivo** (adaptado a celulares)
- [ ] **Cor do tema** definida
- [ ] Teste feito no **Lighthouse**

---

## Conclusão

Um PWA une o melhor de dois mundos: o **alcance da web** e a **experiência de um app nativo**. Com três peças (HTTPS, manifest e Service Worker), um site comum se transforma em uma aplicação instalável, rápida e capaz de funcionar mesmo sem internet.