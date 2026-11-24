// Regras da página "Todas as siglas" (todas-siglas.html): filtros por tipo, categoria (RF02) e campus, grupos por letra,
// índice e cartões. Sem DOM, para serem testadas no Node (tests/lista.test.js); o app.js só monta os elementos.
import { CAMPI, CAMPUS_GERAL, CATEGORIAS, TIPOS, agruparPorLetra, filtrarTermos } from "./termos.js";

export const opcoesDeTipo = () => Object.entries(TIPOS);
export const opcoesDeCampus = () => CAMPI.map((campus) => [campus, campus]);

// Só as categorias que têm termo: uma opção que leva à lista vazia só atrapalha quem está procurando.
export const opcoesDeCategoria = (termos) =>
  Object.entries(CATEGORIAS).filter(([categoria]) => termos.some((termo) => termo.categoria === categoria));

export const idDaLetra = (letra) => (letra === "#" ? "letra-outros" : `letra-${letra}`);
export const rotuloDaLetra = (letra) => (letra === "#" ? "Outros símbolos" : `Letra ${letra}`);
export const textoDaContagem = (total) => (total === 1 ? "1 termo" : `${total} termos`);

// Os filtros voltam para o endereço, para o link poder ser compartilhado; sem filtro, só o caminho da página.
export function enderecoDosFiltros({ tipo, campus, categoria }, caminho) {
  const parametros = new URLSearchParams();
  if (tipo) parametros.set("tipo", tipo);
  if (campus) parametros.set("campus", campus);
  if (categoria) parametros.set("categoria", categoria);
  const busca = parametros.toString();
  return busca ? `?${busca}` : caminho;
}

// Os termos que passam nos filtros (seletor vazio = sem filtro), agrupados por letra, com o id e o rótulo do índice.
export function montarLista(termos, { tipo, campus, categoria }) {
  const filtrados = filtrarTermos(termos, { campus: campus || null, tipo: tipo || null, categoria: categoria || null });
  return {
    total: filtrados.length,
    grupos: agruparPorLetra(filtrados).map(([letra, doGrupo]) => ({
      letra,
      id: idDaLetra(letra),
      rotulo: rotuloDaLetra(letra),
      termos: doGrupo,
    })),
  };
}

// "Geral" vale para todos: repetir a etiqueta em todo cartão só gera ruído.
export function etiquetasDoCartao(termo) {
  const etiquetas = [{ texto: TIPOS[termo.tipo], contorno: false }];
  if (termo.campus !== CAMPUS_GERAL) etiquetas.push({ texto: termo.campus, contorno: true });
  return etiquetas;
}
