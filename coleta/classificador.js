// Categorização e redação assistidas por LLM (#58, ADR 0009). Para cada candidato do coletor, pede ao LLM a
// categoria, o tipo e rascunhos da definição e do exemplo, valida a resposta por schema e marca o candidato
// como "revisar". O LLM só propõe: as sugestões ficam em `classificacao` e nunca viram `definicao` nem
// `exemplo_uso`, que quem escreve é o revisor do PR. Função pura: sem rede, sem arquivo e sem SDK. O cliente
// chega pronto por parâmetro (coleta/cliente-gemini.js), o que deixa trocar de provedor e testar sem a API.

export const SEM_CLASSIFICACAO = "sem classificação";
export const REVISAR = "revisar";
export const CONFIANCAS = ["alta", "media", "baixa"];
export const MAX_TEXTO = 300;
export const INTERVALO_PADRAO_MS = 4000; // 15 pedidos por minuto, dentro do limite gratuito da API
export const LIMITE_PADRAO = 100; // chamadas por execução

const MARCADORES = ["CATEGORIAS", "TIPOS", "TERMO", "SIGNIFICADO", "FONTE", "TRECHO"];
const TAMANHO_DO_TRECHO = 1000;
const TAMANHO_DO_MOTIVO = 200; // o erro da API pode ser um JSON enorme
const CAMPOS = ["categoria", "tipo", "definicao", "exemplo_uso", "confianca"];
const LINK_OU_HTML = /[<>]|https?:/i;

const esperarDeVerdade = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// O texto da página é dado, não instrução: tira os delimitadores do bloco de dados, para ele não conseguir
// fechar o bloco e escrever fora dele (prompt injection).
function comoDado(valor, tamanho = TAMANHO_DO_TRECHO) {
  return String(valor ?? "")
    .replace(/<<<|>>>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, tamanho);
}

export function montarPrompt(molde, candidato, categorias, tipos) {
  for (const marcador of MARCADORES) {
    if (!molde.includes(`{{${marcador}}}`)) throw new Error(`o prompt não tem o marcador {{${marcador}}}`);
  }
  const valores = {
    CATEGORIAS: categorias.map((c) => `- ${c.id}: ${c.nome}. ${c.descricao}`).join("\n"),
    TIPOS: tipos.map((tipo) => `- ${tipo}`).join("\n"),
    TERMO: comoDado(candidato.termo, 60),
    SIGNIFICADO: comoDado(candidato.significado, 300),
    FONTE: comoDado(candidato.fonte, 300),
    TRECHO: comoDado(candidato.trecho),
  };
  return molde.replace(/\{\{([A-Z]+)\}\}/g, (marca, nome) => valores[nome] ?? marca);
}

// O schema que vai para a API (JSON Schema) e que a validarResposta confere de novo aqui: a API pode errar.
export function esquemaDaResposta(categorias, tipos) {
  return {
    type: "object",
    properties: {
      categoria: { type: "string", enum: categorias.map((c) => c.id) },
      tipo: { type: "string", enum: tipos },
      definicao: { type: "string", description: `Em linguagem simples, até ${MAX_TEXTO} caracteres.` },
      exemplo_uso: { type: "string", description: `Uma frase curta, até ${MAX_TEXTO} caracteres.` },
      confianca: { type: "string", enum: CONFIANCAS },
    },
    required: CAMPOS,
  };
}

function erroDeTexto(campo, valor) {
  const genero = campo === "definicao" ? "vazia" : "vazio";
  if (valor === "") return `${campo} está ${genero}`;
  if (valor.length > MAX_TEXTO) return `${campo} passa de ${MAX_TEXTO} caracteres (${valor.length})`;
  if (LINK_OU_HTML.test(valor)) return `${campo} tem link ou HTML`;
  return null;
}

export function validarResposta(texto, categorias, tipos) {
  let dados;
  try {
    dados = JSON.parse(texto);
  } catch {
    return { ok: false, erro: "a resposta não é JSON" };
  }
  if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
    return { ok: false, erro: "a resposta precisa ser um objeto" };
  }

  const valor = {};
  for (const campo of CAMPOS) {
    if (typeof dados[campo] !== "string") return { ok: false, erro: `o campo ${campo} precisa ser texto` };
    valor[campo] = dados[campo].trim();
  }

  const listas = { categoria: categorias.map((c) => c.id), tipo: tipos, confianca: CONFIANCAS };
  for (const [campo, permitidos] of Object.entries(listas)) {
    if (!permitidos.includes(valor[campo])) return { ok: false, erro: `${campo} "${valor[campo]}" não está na lista` };
  }
  for (const campo of ["definicao", "exemplo_uso"]) {
    const erro = erroDeTexto(campo, valor[campo]);
    if (erro) return { ok: false, erro };
  }
  return { ok: true, valor };
}

const semClassificacao = (motivo) => ({ estado: SEM_CLASSIFICACAO, motivo });

// Uma lista nova, com `classificacao` em cada candidato. Sem cliente (sem chave), com a API fora do ar ou com
// resposta inválida, o candidato segue "sem classificação" e o pipeline continua.
export async function classificarCandidatos(candidatos, opcoes) {
  const {
    cliente,
    molde,
    categorias,
    tipos,
    versaoDoPrompt,
    esperar = esperarDeVerdade,
    intervaloMs = INTERVALO_PADRAO_MS,
    limite = LIMITE_PADRAO,
  } = opcoes;
  if (!cliente) return candidatos.map((c) => ({ ...c, classificacao: semClassificacao("sem chave da API") }));

  const esquema = esquemaDaResposta(categorias, tipos);
  const saida = [];
  let chamadas = 0;
  for (const candidato of candidatos) {
    if (chamadas >= limite) {
      saida.push({ ...candidato, classificacao: semClassificacao(`passou do limite de ${limite} chamadas desta execução`) });
      continue;
    }
    if (chamadas > 0) await esperar(intervaloMs);
    chamadas += 1;
    saida.push({ ...candidato, classificacao: await classificarUm(candidato) });
  }
  return saida;

  async function classificarUm(candidato) {
    let texto;
    try {
      texto = await cliente.gerar(montarPrompt(molde, candidato, categorias, tipos), esquema);
    } catch (erro) {
      return semClassificacao(`a API falhou: ${String(erro.message).slice(0, TAMANHO_DO_MOTIVO)}`);
    }
    const resposta = validarResposta(texto, categorias, tipos);
    if (!resposta.ok) return semClassificacao(`resposta inválida: ${resposta.erro}`);
    const { categoria, tipo, definicao, exemplo_uso, confianca } = resposta.valor;
    return {
      estado: REVISAR,
      categoria,
      tipo_sugerido: tipo,
      definicao_sugerida: definicao,
      exemplo_sugerido: exemplo_uso,
      confianca,
      modelo: cliente.modelo,
      prompt_versao: versaoDoPrompt,
    };
  }
}

export function resumirClassificacao(lista) {
  const resumo = { revisar: 0, sem_classificacao: 0, motivos: {} };
  for (const { classificacao } of lista) {
    if (classificacao?.estado === REVISAR) {
      resumo.revisar += 1;
      continue;
    }
    resumo.sem_classificacao += 1;
    const motivo = classificacao?.motivo ?? "sem motivo";
    resumo.motivos[motivo] = (resumo.motivos[motivo] ?? 0) + 1;
  }
  return resumo;
}
