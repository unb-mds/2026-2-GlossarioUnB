// Regras de domínio sobre a lista de termos: busca, filtros e agrupamento.
// Sem acesso a DOM, para rodar tanto no navegador quanto nos testes (Node).

export const CAMPI = ["Darcy Ribeiro", "Ceilândia", "Gama", "Planaltina"];
export const CAMPUS_GERAL = "Geral";

// Valores aceitos em `tipo` (ADR 0004) e o rótulo exibido ao usuário.
export const TIPOS = {
  sigla: "Sigla",
  giria: "Gíria",
  expressao: "Expressão",
};

// Valores aceitos em `origem` (proveniência do dado).
export const ORIGENS = ["manual", "coleta"];

export function normalizar(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Termos cujo nome ou sinônimos contêm a consulta; os que começam com ela vêm primeiro.
export function buscarTermos(termos, consulta, limite = 8) {
  const q = normalizar(consulta);
  if (!q) return [];

  const pontuacao = (termo) => {
    if (normalizar(termo.termo).startsWith(q)) return 0;
    if (Array.isArray(termo.sinonimos) && termo.sinonimos.some((s) => normalizar(s).startsWith(q))) return 1;
    return 2;
  };

  const corresponde = (termo) => {
    if (normalizar(termo.termo).includes(q)) return true;
    if (Array.isArray(termo.sinonimos) && termo.sinonimos.some((s) => normalizar(s).includes(q))) return true;
    return false;
  };

  return termos
    .filter(corresponde)
    .sort((a, b) => pontuacao(a) - pontuacao(b))
    .slice(0, limite);
}

// Filtro por campus inclui os termos "Geral", que valem para os 4 campi.
export function filtrarTermos(termos, { campus = null, tipo = null } = {}) {
  return termos.filter((termo) => {
    if (campus && termo.campus !== campus && termo.campus !== CAMPUS_GERAL) return false;
    if (tipo && termo.tipo !== tipo) return false;
    return true;
  });
}

export function letraInicial(termo) {
  const letra = normalizar(termo.termo).charAt(0).toUpperCase();
  return /[A-Z]/.test(letra) ? letra : "#";
}

// Retorna [[letra, termos], ...] em ordem alfabética, com os termos de cada letra também ordenados.
export function agruparPorLetra(termos) {
  const grupos = new Map();
  for (const termo of termos) {
    const letra = letraInicial(termo);
    if (!grupos.has(letra)) grupos.set(letra, []);
    grupos.get(letra).push(termo);
  }

  return [...grupos.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letra, doGrupo]) => [
      letra,
      [...doGrupo].sort((a, b) => normalizar(a.termo).localeCompare(normalizar(b.termo))),
    ]);
}

export function encontrarTermo(termos, id) {
  return termos.find((termo) => termo.id === id);
}

// Filtros vindos da URL (ex.: todas-siglas.html?tipo=sigla); valor desconhecido é ignorado.
export function filtrosDaUrl(parametros) {
  const campus = parametros.get("campus");
  const tipo = parametros.get("tipo");
  return {
    campus: CAMPI.includes(campus) ? campus : null,
    tipo: tipo && Object.hasOwn(TIPOS, tipo) ? tipo : null,
  };
}

// Quantos termos existem de cada tipo, na ordem de TIPOS; tipos sem termos ficam de fora.
export function contarPorTipo(termos) {
  return Object.keys(TIPOS)
    .map((tipo) => [tipo, termos.filter((termo) => termo.tipo === tipo).length])
    .filter(([, total]) => total > 0);
}

// Linha curta que resume o termo em listas: a forma por extenso da sigla, ou a definição.
export function resumoDoTermo(termo) {
  return termo.significado || termo.definicao;
}
