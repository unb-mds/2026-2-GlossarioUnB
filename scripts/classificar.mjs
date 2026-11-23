// Classifica os candidatos do robô com o Gemini (#58). Lê da entrada padrão o JSON do `npm run coleta`
// (objeto com `candidatos`) ou uma lista, escreve o JSON classificado na saída padrão e o resumo no stderr.
//   Local:  npm run --silent coleta | node --env-file=.env scripts/classificar.mjs > classificados.json
//   No CI (workflow da #59): o segredo GEMINI_API_KEY. GEMINI_MODELO troca o modelo (opcional).
// Sem a chave, todos saem "sem classificação" e o pipeline segue. A chave nunca aparece na saída.
import { readFile } from "node:fs/promises";
import { text } from "node:stream/consumers";

import { TIPOS } from "../frontend/js/termos.js";
import { classificarCandidatos, resumirClassificacao } from "../coleta/classificador.js";
import { MODELO_PADRAO, MODELO_RESERVA, comReserva, criarClienteGemini } from "../coleta/cliente-gemini.js";

const VERSAO_DO_PROMPT = "classificar-v2";
const lerDoRepositorio = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");

const entrada = JSON.parse(await text(process.stdin));
const candidatos = Array.isArray(entrada) ? entrada : entrada?.candidatos;
if (!Array.isArray(candidatos)) {
  console.error('A entrada precisa ser uma lista de candidatos ou um objeto com "candidatos".');
  process.exit(1);
}

const { categorias } = JSON.parse(await lerDoRepositorio("../coleta/categorias.json"));
const molde = await lerDoRepositorio(`../coleta/prompts/${VERSAO_DO_PROMPT}.md`);
const chave = process.env.GEMINI_API_KEY ?? "";

let cliente = null;
if (chave) {
  const { GoogleGenAI } = await import("@google/genai");
  // Modelo reserva (decisão 48): se o principal estiver sobrecarregado, a rodada continua no reserva.
  const principal = criarClienteGemini({ chave, GoogleGenAI, modelo: process.env.GEMINI_MODELO || MODELO_PADRAO });
  const reserva = criarClienteGemini({ chave, GoogleGenAI, modelo: process.env.GEMINI_MODELO_RESERVA || MODELO_RESERVA });
  cliente = comReserva(principal, reserva);
}

const classificados = await classificarCandidatos(candidatos, {
  cliente,
  molde,
  categorias,
  tipos: Object.keys(TIPOS),
  versaoDoPrompt: VERSAO_DO_PROMPT,
});

// Um erro da API pode repetir o que recebeu; a chave sai de qualquer texto antes de ser escrita.
const semChave = (texto) => (chave ? texto.replaceAll(chave, "[chave]") : texto);
const saida = Array.isArray(entrada) ? classificados : { ...entrada, candidatos: classificados };
process.stdout.write(`${semChave(JSON.stringify(saida, null, 2))}\n`);

const resumo = resumirClassificacao(classificados);
console.error(`${resumo.revisar} para revisar, ${resumo.sem_classificacao} sem classificação`);
for (const [motivo, quantos] of Object.entries(resumo.motivos)) console.error(semChave(`  ${motivo}: ${quantos}`));
