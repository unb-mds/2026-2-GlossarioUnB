// Normalização, deduplicação e merge com o termos.json (#57, ADR 0009).
// Funções puras: recebem os candidatos do coletor e os termos atuais e separam novos, alterados e conflitos,
// cada um com o motivo. O robô só propõe: definicao e exemplo_uso são sempre escritos por uma pessoa.

const PALAVRAS_VAZIAS = new Set(["a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "na", "no", "para"]);

// A partir de quantas palavras em comum dois significados da mesma sigla são "o mesmo, atualizado" (alterado)
// e não "outra coisa com a mesma sigla" (conflito).
export const PARECIDO_A_PARTIR_DE = 0.6;
export const CAMPOS_QUE_O_ROBO_PODE_MUDAR = ["significado"];

// Sem acento, em minúsculas, pontuação vira espaço e os espaços se juntam.
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// A chave de um termo para comparar: "U.n.B", "UnB" e "unb" viram "unb".
export function chave(termo) {
  return normalizar(termo).replaceAll(" ", "");
}

function palavras(texto) {
  return new Set(normalizar(texto).split(" ").filter((palavra) => palavra && !PALAVRAS_VAZIAS.has(palavra)));
}

// Quanto dois significados se parecem, de 0 a 1: palavras em comum ÷ palavras no total (sem "de", "e", "da"…).
export function semelhanca(a, b) {
  const pa = palavras(a);
  const pb = palavras(b);
  if (pa.size === 0 && pb.size === 0) return 1;
  const comuns = [...pa].filter((palavra) => pb.has(palavra)).length;
  return comuns / (pa.size + pb.size - comuns);
}

// Cada termo existente pela chave do termo e de cada sinônimo (o campo `sinonimos`, quando existe).
function indexar(termos) {
  const porChave = new Map();
  for (const termo of termos) {
    const nomes = [termo.termo, ...(Array.isArray(termo.sinonimos) ? termo.sinonimos : [])];
    for (const nome of nomes) {
      const k = chave(nome);
      if (k && !porChave.has(k)) porChave.set(k, { termo, peloSinonimo: nome !== termo.termo });
    }
  }
  return porChave;
}

// Um id que ainda não existe: "saa", ou "saa-2" se "saa" já é de outro termo.
function idLivre(base, idsUsados) {
  let id = base;
  for (let n = 2; idsUsados.has(id); n += 1) id = `${base}-${n}`;
  idsUsados.add(id);
  return id;
}

// Para a mesma sigla com outro significado: a primeira palavra que diferencia os dois ("ip-internet").
function idDeDesambiguacao(candidato, existente, idsUsados) {
  const doExistente = palavras(existente.significado);
  const diferente = [...palavras(candidato.significado)].find((palavra) => !doExistente.has(palavra));
  return idLivre(diferente ? `${chave(candidato.termo)}-${diferente}` : chave(candidato.termo), idsUsados);
}

function porcentagem(valor) {
  return `${Math.round(valor * 100)}%`;
}

function classificarPelaSigla(candidato, { termo, peloSinonimo }, idsUsados) {
  const como = peloSinonimo ? `"${candidato.termo}" é sinônimo de ${termo.termo} (${termo.id})` : `mesmo termo de ${termo.id}`;
  if (normalizar(candidato.significado) === normalizar(termo.significado)) {
    return { lista: "iguais", registro: { id: termo.id, candidato, motivo: `${como}, com o mesmo significado` } };
  }

  const mudancas = { significado: { de: termo.significado ?? "", para: candidato.significado } };
  if (!normalizar(termo.significado)) {
    return { lista: "alterados", registro: { id: termo.id, candidato, mudancas, motivo: `${como}, que estava sem significado` } };
  }
  const s = semelhanca(candidato.significado, termo.significado);
  if (s >= PARECIDO_A_PARTIR_DE) {
    const motivo = `${como}, com significado parecido (${porcentagem(s)} das palavras em comum): proposta de atualizar o significado`;
    return { lista: "alterados", registro: { id: termo.id, candidato, mudancas, motivo } };
  }
  const motivo =
    `${como} com outro significado ("${termo.significado}" × "${candidato.significado}", ${porcentagem(s)} das palavras ` +
    "em comum): proposta de desambiguação, nada foi sobrescrito";
  return {
    lista: "conflitos",
    registro: { id_existente: termo.id, candidato, motivo, proposta_id: idDeDesambiguacao(candidato, termo, idsUsados) },
  };
}

function classificarUm(candidato, porChave, termos, idsUsados) {
  const achado = porChave.get(chave(candidato.termo));
  if (achado) return classificarPelaSigla(candidato, achado, idsUsados);

  // Outra sigla com o mesmo significado de um termo que já existe: é o mesmo termo, repetido com outro id.
  const significado = normalizar(candidato.significado);
  const repetido = termos.find((termo) => normalizar(termo.significado) === significado);
  if (repetido) {
    const motivo =
      `repetido: mesmo significado de ${repetido.termo} (${repetido.id}) com outra sigla. ` +
      "Se for um nome antigo, vira sinônimo; se não, alguém decide";
    return { lista: "conflitos", registro: { id_existente: repetido.id, candidato, motivo, proposta_id: null } };
  }

  const motivo = "nenhum termo com essa sigla, sinônimo ou significado";
  return { lista: "novos", registro: { candidato, motivo, proposta_id: idLivre(chave(candidato.termo), idsUsados) } };
}

// Separa os candidatos em novos, alterados e conflitos (e iguais e descartados, para o relatório).
// O mesmo termo vindo de duas fontes vira um registro só, com a outra fonte em `tambem_em`.
export function classificar(candidatos, termos) {
  const saida = { novos: [], alterados: [], conflitos: [], iguais: [], descartados: [] };
  const porChave = indexar(termos);
  const idsUsados = new Set(termos.map((termo) => termo.id));
  const jaVistos = new Map();

  for (const candidato of candidatos) {
    const termo = chave(candidato?.termo);
    const significado = normalizar(candidato?.significado);
    if (!termo || !significado) {
      saida.descartados.push({ candidato, motivo: "candidato sem termo ou sem significado" });
      continue;
    }
    const k = `${termo}\u0000${significado}`;
    if (jaVistos.has(k)) {
      const registro = jaVistos.get(k);
      if (candidato.fonte && !registro.tambem_em.includes(candidato.fonte)) registro.tambem_em.push(candidato.fonte);
      continue;
    }
    const { lista, registro } = classificarUm(candidato, porChave, termos, idsUsados);
    registro.tambem_em = [];
    jaVistos.set(k, registro);
    saida[lista].push(registro);
  }
  return saida;
}

// Aplica nos termos só o que o robô pode mudar (o significado) e devolve uma lista nova, sem mexer na de entrada.
// Uma mudança em qualquer outro campo (definicao, exemplo_uso…) é erro: esses campos são de uma pessoa.
export function mesclar(termos, alterados) {
  const mudancasPorId = new Map(alterados.map((alterado) => [alterado.id, alterado.mudancas]));
  return termos.map((termo) => {
    const mudancas = mudancasPorId.get(termo.id);
    if (!mudancas) return termo;

    const proibidos = Object.keys(mudancas).filter((campo) => !CAMPOS_QUE_O_ROBO_PODE_MUDAR.includes(campo));
    if (proibidos.length > 0) {
      throw new Error(`o robô não pode mudar ${proibidos.join(", ")} de ${termo.id}: esse campo é escrito por uma pessoa`);
    }
    const novosValores = Object.fromEntries(Object.entries(mudancas).map(([campo, { para }]) => [campo, para]));
    return { ...termo, ...novosValores };
  });
}

// Termos do próprio glossário que são o mesmo com ids diferentes (mesma chave ou mesmo significado).
export function repetidosNoGlossario(termos) {
  const grupos = new Map();
  for (const termo of termos) {
    for (const k of [`termo:${chave(termo.termo)}`, `significado:${normalizar(termo.significado)}`]) {
      if (k.endsWith(":")) continue;
      grupos.set(k, [...(grupos.get(k) ?? []), termo.id]);
    }
  }
  return [...grupos].filter(([, ids]) => new Set(ids).size > 1).map(([motivo, ids]) => ({ motivo, ids }));
}
