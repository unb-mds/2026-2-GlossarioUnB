# i18n – Internacionalização (Resumo)

## O que é

**i18n** (internationalization) é preparar um software para funcionar em qualquer idioma e cultura, sem precisar reescrever o sistema a cada novo país.

- **i18n**: preparar o sistema (feito uma vez)
- **l10n** (localization): adaptar para um idioma/região específicos (feito para cada mercado)
- **g11n** (globalization): i18n + l10n + estratégia para atuar globalmente

---

## Por que fazer

- Alcança mais usuários
- Melhora a experiência (as pessoas preferem o próprio idioma)
- Aumenta conversão em vendas
- Barateia a expansão para novos mercados

---

## Conceitos-chave

- **Locale**: idioma + região (ex: `pt-BR`, `en-US`)
- **Chaves de tradução**: em vez de texto fixo na tela, usa-se um identificador que busca o texto no idioma certo

**Arquivos de tradução (exemplo com JSON):**

```json
// pt-BR.json
{
  "bemVindo": "Bem-vindo",
  "entrar": "Entrar",
  "mensagensNovas": "Você tem {count} novas mensagens"
}
```

```json
// en-US.json
{
  "bemVindo": "Welcome",
  "entrar": "Sign in",
  "mensagensNovas": "You have {count} new messages"
}
```

---

## Exemplo com i18next (JavaScript)

```javascript
import i18next from 'i18next';

i18next.init({
  lng: 'pt-BR',
  resources: {
    'pt-BR': { translation: { bemVindo: 'Bem-vindo' } },
    'en-US': { translation: { bemVindo: 'Welcome' } }
  }
});

console.log(i18next.t('bemVindo')); // "Bem-vindo"
```

---

## Formatação com Intl (nativo do navegador)

```javascript
// Data
new Intl.DateTimeFormat('pt-BR').format(new Date()); // 24/09/2026
new Intl.DateTimeFormat('en-US').format(new Date()); // 9/24/2026

// Número / moeda
new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(1234.56); // R$ 1.234,56

new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(1234.56); // $1,234.56

// Plural
const pluralPT = new Intl.PluralRules('pt-BR');
pluralPT.select(1); // "one"
pluralPT.select(2); // "other"
```

---

## Erros comuns

- Escrever texto fixo direto na interface, em vez de usar chaves
- Montar frases juntando pedaços (a ordem das palavras muda entre idiomas)
- Fixar formato de data/moeda no código
- Ignorar que textos traduzidos podem ficar maiores e quebrar o layout
- Usar bandeiras para representar idiomas (idioma ≠ país)

---

## Ferramentas comuns

i18next, react-intl, vue-i18n, Angular i18n, gettext, `Intl` (nativo do navegador)

---

## Conclusão

i18n é preparar a base do sistema; l10n é adaptar para cada idioma específico. Usando chaves de tradução e ferramentas como `Intl` ou `i18next`, adicionar um novo idioma vira uma tarefa simples de tradução, sem mexer na lógica do programa.