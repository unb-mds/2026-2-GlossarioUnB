// Regras da página do termo (termo.html): o título da aba, o rótulo do campus, a fonte e o endereço do termo.
// Sem DOM, para serem testadas no Node (tests/ficha.test.js); o app.js só monta os elementos.
import { CAMPUS_GERAL, sinonimosDe } from "./termos.js";
import { urlSegura } from "./validacao-termo.js";

// Endereço da página de um termo; as sugestões da busca, os cartões e a trilha também levam para ele.
export function urlDoTermo(termo) {
  return `termo.html?id=${encodeURIComponent(termo.id)}`;
}

export const tituloDaFicha = (termo) => `${termo.termo} — Glossário UnB`;

// O texto do bloco "Também conhecido como"; null quando o termo não tem sinônimo (o bloco não aparece).
export function textoDosSinonimos(termo) {
  const sinonimos = sinonimosDe(termo);
  return sinonimos.length > 0 ? sinonimos.join(", ") : null;
}

// Os termos do bloco "Veja também", na ordem gravada em `relacionados`. Um id que não existe é ignorado (o CI recusa,
// mas a página não pode quebrar por isso).
export function relacionadosDe(termo, termos) {
  if (!Array.isArray(termo?.relacionados)) return [];
  const porId = new Map(termos.map((outro) => [outro.id, outro]));
  return termo.relacionados
    .map((id) => porId.get(id))
    .filter(Boolean)
    .map((outro) => ({ id: outro.id, termo: outro.termo, significado: outro.significado ?? null, href: urlDoTermo(outro) }));
}

export function rotuloCampus(campus) {
  return campus === CAMPUS_GERAL ? "Todos os campi" : `Campus ${campus}`;
}

// Fonte pode ser um link ou um texto ("conhecimento comum verificado pelo grupo").
// Links aparecem sem "https://" e sem a barra final, que só atrapalham a leitura.
// Só vira link o que passa pela urlSegura (http ou https): "javascript:" fica como texto.
export function textoDaFonte(fonte) {
  const url = urlSegura(fonte);
  if (!url) return { texto: fonte };
  const { hostname, pathname } = new URL(url);
  return { texto: `${hostname}${pathname === "/" ? "" : pathname}`, href: url };
}
