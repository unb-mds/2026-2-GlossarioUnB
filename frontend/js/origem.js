// Regras da página "De onde vêm os dados" (#74, ADR 0007), sem o DOM. Os números vêm do boletim do robô
// (coleta/relatorio.json) e do termos.json: nada de valor fixo no HTML.

const NOMES_DAS_CATEGORIAS = {
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

// "2026-11-22" vira "22/11/2026". Lê o texto direto, sem passar por fuso horário. Data que não existe vira null.
export function dataBrasileira(iso) {
  if (typeof iso !== "string") return null;
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!partes) return null;
  const [, ano, mes, dia] = partes;
  const data = new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)));
  if (data.getUTCMonth() !== Number(mes) - 1 || data.getUTCDate() !== Number(dia)) return null;
  return `${dia}/${mes}/${ano}`;
}

function hostDa(fonte) {
  try {
    return new URL(fonte).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

const ehDaUnb = (host) => host === "unb.br" || host.endsWith(".unb.br");

export function termosPorFonte(termos) {
  let pdi = 0;
  let unb = 0;
  let fora = 0;
  const sites = new Set();
  for (const { fonte } of termos) {
    const host = hostDa(fonte);
    if (ehDaUnb(host) && String(fonte).includes("PDI_UnB")) pdi += 1;
    else if (ehDaUnb(host)) {
      unb += 1;
      sites.add(host);
    } else fora += 1;
  }
  return [
    { id: "pdi", rotulo: "Plano de Desenvolvimento Institucional (PDI)", total: pdi },
    { id: "unb", rotulo: `Sites oficiais da UnB (${sites.size} ${sites.size === 1 ? "site" : "sites"})`, total: unb },
    { id: "fora", rotulo: "Outras fontes", total: fora },
  ]
    .filter((grupo) => grupo.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function termosPorCategoria(termos) {
  const contagem = new Map();
  let semCategoria = 0;
  for (const { categoria } of termos) {
    if (typeof categoria === "string" && categoria.trim() !== "") contagem.set(categoria, (contagem.get(categoria) ?? 0) + 1);
    else semCategoria += 1;
  }
  const categorias = [...contagem]
    .map(([id, total]) => ({ id, rotulo: Object.hasOwn(NOMES_DAS_CATEGORIAS, id) ? NOMES_DAS_CATEGORIAS[id] : id, total }))
    .sort((a, b) => b.total - a.total || a.rotulo.localeCompare(b.rotulo, "pt-BR"));
  if (semCategoria > 0) categorias.push({ id: "sem-categoria", rotulo: "Ainda sem categoria", total: semCategoria });
  return categorias;
}

// `coletado_em` só muda quando o robô acha algo (relatorioMudou, em coleta/relatorio.js). Por isso o texto diz
// "com novidades": uma execução sem mudança não atualiza o boletim.
export function boletimDaColeta(relatorio, termos) {
  const data = dataBrasileira(relatorio?.coletado_em);
  const { candidatos, barrados } = relatorio?.totais ?? {};
  const temRelatorio = data !== null && Number.isInteger(candidatos) && Number.isInteger(barrados);
  return {
    temRelatorio,
    textoDaData: temRelatorio ? `Última coleta com novidades: ${data}` : null,
    numeros: {
      lidas: temRelatorio ? candidatos : null,
      barradas: temRelatorio ? barrados : null,
      publicados: termos.length,
    },
    fontes: termosPorFonte(termos),
    categorias: termosPorCategoria(termos),
  };
}
