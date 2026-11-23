// Trilha do calouro, "Primeiros passos na UnB" (#70, ADR 0011).
// A lista fica em data/trilha-calouro.json e cita os termos pelo id; os dados de cada termo
// continuam só no termos.json. Funções puras, sem DOM, para rodarem no Node (testes) e no navegador.

const SUFIXO_UNB = ".unb.br";

// Fonte oficial = endereço https de um site da UnB (unb.br ou *.unb.br).
export function fonteOficial(fonte) {
  try {
    const { protocol, hostname } = new URL(fonte);
    return protocol === "https:" && (hostname === "unb.br" || hostname.endsWith(SUFIXO_UNB));
  } catch {
    return false;
  }
}

const textoPreenchido = (valor) => typeof valor === "string" && valor.trim() !== "";

export function termosDaTrilha(trilha) {
  return (trilha?.grupos ?? []).flatMap((grupo) => grupo.termos ?? []);
}

// Devolve a lista de erros; vazia quando a trilha está certa. Usada no teste dos dados reais.
export function validarTrilha(trilha, termos) {
  if (!Array.isArray(trilha?.grupos)) return ["a trilha precisa de uma lista \"grupos\""];

  const erros = [];
  const idsDosTermos = new Set(termos.map((termo) => termo.id));
  const idsDosGrupos = new Set();
  const jaCitados = new Set();

  for (const grupo of trilha.grupos) {
    if (idsDosGrupos.has(grupo.id)) erros.push(`grupo "${grupo.id}" aparece mais de uma vez`);
    idsDosGrupos.add(grupo.id);
    if (!textoPreenchido(grupo.nome)) erros.push(`grupo "${grupo.id}" sem nome`);
    if (!Array.isArray(grupo.termos) || grupo.termos.length === 0) {
      erros.push(`grupo "${grupo.id}" sem termos`);
      continue;
    }
    for (const id of grupo.termos) {
      if (!idsDosTermos.has(id)) erros.push(`grupo "${grupo.id}": o termo "${id}" não existe no termos.json`);
      if (jaCitados.has(id)) erros.push(`o termo "${id}" aparece mais de uma vez na trilha`);
      jaCitados.add(id);
    }
  }
  return erros;
}

// Troca cada id pelo termo completo, na ordem do arquivo. Na página, um id que não existe
// (ou um termo recusado pelo schema) é pulado em vez de quebrar a seção inteira.
export function montarTrilha(trilha, termos) {
  const porId = new Map(termos.map((termo) => [termo.id, termo]));
  return (trilha?.grupos ?? [])
    .map((grupo) => ({
      id: grupo.id,
      nome: grupo.nome,
      termos: (grupo.termos ?? []).map((id) => porId.get(id)).filter(Boolean),
    }))
    .filter((grupo) => grupo.termos.length > 0);
}
