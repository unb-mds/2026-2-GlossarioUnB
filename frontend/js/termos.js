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

// Valores aceitos em `categoria` (ADR 0004) e o rótulo exibido ao usuário.
export const CATEGORIAS = {
  "vida-academica": "Vida acadêmica",
  "unidades-academicas": "Unidades acadêmicas",
  administracao: "Administração",
  colegiados: "Colegiados",
  "locais-campus": "Locais do campus",
  sistemas: "Sistemas",
  "assistencia-estudantil": "Assistência estudantil",
  "representacao-estudantil": "Representação estudantil",
  girias: "Gírias",
};

export function normalizar(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Termos cujo nome contém a consulta; os que começam com ela vêm primeiro.
export function buscarTermos(termos, consulta, limite = 8) {
  const q = normalizar(consulta);
  if (!q) return [];

  const naoComecaCom = (termo) => Number(!normalizar(termo.termo).startsWith(q));
  return termos
    .filter((termo) => normalizar(termo.termo).includes(q))
    .sort((a, b) => naoComecaCom(a) - naoComecaCom(b))
    .slice(0, limite);
}

// Filtro por campus inclui os termos "Geral", que valem para os 4 campi.
export function filtrarTermos(termos, { campus = null, tipo = null, categoria = null } = {}) {
  return termos.filter((termo) => {
    if (campus && termo.campus !== campus && termo.campus !== CAMPUS_GERAL) return false;
    if (tipo && termo.tipo !== tipo) return false;
    if (categoria && termo.categoria !== categoria) return false;
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

// Filtros vindos da URL (ex.: todas-siglas.html?categoria=sistemas); valor desconhecido é ignorado.
export function filtrosDaUrl(parametros) {
  const campus = parametros.get("campus");
  const tipo = parametros.get("tipo");
  const categoria = parametros.get("categoria");
  return {
    campus: CAMPI.includes(campus) ? campus : null,
    tipo: tipo && Object.hasOwn(TIPOS, tipo) ? tipo : null,
    categoria: categoria && Object.hasOwn(CATEGORIAS, categoria) ? categoria : null,
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
