// Regras da página inicial (index.html): a busca com autocomplete (padrão ARIA combobox), os atalhos por tipo e
// a trilha do calouro. Sem DOM, para serem testadas no Node (tests/busca.test.js); o app.js só monta os
// elementos e ouve as teclas.
import { buscarTermos, contarPorTipo, normalizar, resumoDoTermo, sinonimosDe } from "./termos.js";
import { montarTrilha } from "./trilha.js";
import { urlDoTermo } from "./ficha.js";

const TIPOS_NO_PLURAL = { sigla: "Siglas", giria: "Gírias", expressao: "Expressões" };

// As sugestões para o que foi digitado, ou null quando a consulta está vazia (não há o que mostrar).
export function sugestoesPara(termos, consulta) {
  return normalizar(consulta) ? buscarTermos(termos, consulta) : null;
}

// O nome na sugestão; quando foi um sinônimo que combinou com a busca, ele aparece entre parênteses.
export function rotuloDaSugestao(termo, consulta) {
  const q = normalizar(consulta);
  if (normalizar(termo.termo).includes(q)) return termo.termo;
  const sinonimo = sinonimosDe(termo).find((candidato) => normalizar(candidato).includes(q));
  return sinonimo ? `${termo.termo} (${sinonimo})` : termo.termo;
}

// O texto que o leitor de tela anuncia (região aria-live).
export function textoDoStatus(sugestoes) {
  if (sugestoes === null) return "";
  if (sugestoes.length === 0) return "Nenhum termo encontrado.";
  return sugestoes.length === 1 ? "1 sugestão disponível." : `${sugestoes.length} sugestões disponíveis.`;
}

// O aviso fica fora da lista de sugestões, para o link "Sugerir este termo" ser alcançável pelo teclado.
export const textoSemResultado = (consulta) => `Nenhum termo encontrado para “${consulta.trim()}”. `;

// A sugestão que as setas marcam, sem passar das pontas; null quando a tecla não mexe na lista.
export function proximoIndice(atual, tecla, total) {
  if (total === 0) return null;
  if (tecla === "ArrowDown") return Math.min(atual + 1, total - 1);
  if (tecla === "ArrowUp") return Math.max(atual - 1, 0);
  return null;
}

// O Enter abre a sugestão marcada; sem marcação, a primeira da busca; sem nenhuma, nada.
export function termoDoEnvio(sugestoes, indiceAtivo, termos, consulta) {
  if (indiceAtivo >= 0 && sugestoes[indiceAtivo]) return sugestoes[indiceAtivo];
  return buscarTermos(termos, consulta)[0] ?? null;
}

export function atalhosPorTipo(termos) {
  return contarPorTipo(termos).map(([tipo, quantidade]) => ({
    tipo,
    rotulo: TIPOS_NO_PLURAL[tipo],
    quantidade,
    href: `todas-siglas.html?tipo=${tipo}`,
  }));
}

// Trilha do calouro (#70, ADR 0011): os grupos do trilha.js prontos para a tela, com o id do título de cada
// grupo (a lista de termos aponta para ele no aria-labelledby) e, por termo, o nome, o resumo e o endereço.
export function gruposDaTrilha(trilha, termos) {
  return montarTrilha(trilha, termos).map((grupo) => ({
    nome: grupo.nome,
    idDoTitulo: `trilha-${grupo.id}`,
    termos: grupo.termos.map((termo) => ({ nome: termo.termo, resumo: resumoDoTermo(termo), href: urlDoTermo(termo) })),
  }));
}
