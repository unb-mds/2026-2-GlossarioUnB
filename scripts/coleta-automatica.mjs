import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { TIPOS } from "../frontend/js/termos.js";
import { validarGlossario } from "../frontend/js/validacao-termo.js";
import { atualizarTermos } from "../coleta/atualizar-termos.js";
import { classificar, repetidosNoGlossario } from "../coleta/deduplicar.js";
import { MODELO_PADRAO, criarClienteGemini } from "../coleta/cliente-gemini.js";
import { coletar } from "../coleta/coletor-html.js";
import { validarFontes } from "../coleta/fontes.js";
import { coletarDpo } from "../coleta/coletores/dpo.js";
import { classificarNovos } from "../coleta/pipeline.js";
import { gerarCorpoDoPr, montarRelatorio, relatorioMudou } from "../coleta/relatorio.js";

const VERSAO_DO_PROMPT = "classificar-v1";
const lerDoRepositorio = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");
const hojeEmBrasilia = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });

const [config, termos, arquivoDeCategorias, molde] = await Promise.all([
  lerDoRepositorio("../coleta/fontes.json").then(JSON.parse),
  lerDoRepositorio("../frontend/data/termos.json").then(JSON.parse),
  lerDoRepositorio("../coleta/categorias.json").then(JSON.parse),
  lerDoRepositorio(`../coleta/prompts/${VERSAO_DO_PROMPT}.md`),
]);

const errosDoArquivo = validarFontes(config);
if (errosDoArquivo.length > 0) {
  console.error(errosDoArquivo.join("\n"));
  process.exit(1);
}

const repetidos = repetidosNoGlossario(termos).map(({ motivo, ids }) => `${motivo}: ${ids.join(", ")}`);
const errosDoGlossario = [...validarGlossario(termos), ...repetidos];
if (errosDoGlossario.length > 0) {
  console.error(errosDoGlossario.join("\n"));
  process.exit(1);
}

const dataDaColeta = hojeEmBrasilia();
const coletaHtml = await coletar(config.fontes, { hoje: () => dataDaColeta });
const coletaDpo = await coletarDpo({ hoje: () => dataDaColeta });
const candidatos = [...coletaHtml.candidatos, ...coletaDpo.candidatos];
const porFonte = { ...coletaHtml.por_fonte, ...coletaDpo.por_fonte };
const erros = [...coletaHtml.erros, ...coletaDpo.erros];

const chave = process.env.GEMINI_API_KEY ?? "";
let cliente = null;
if (chave) {
  const { GoogleGenAI } = await import("@google/genai");
  const modelo = process.env.GEMINI_MODELO || MODELO_PADRAO;
  cliente = criarClienteGemini({ chave, GoogleGenAI, modelo });
}

// A deduplicação vem antes do LLM: só os termos novos, que ainda não estão no glossário, gastam chamadas.
const resultado = classificar(candidatos, termos);
const classificados = await classificarNovos(resultado, {
  cliente,
  molde,
  categorias: arquivoDeCategorias.categorias,
  tipos: Object.keys(TIPOS),
  versaoDoPrompt: VERSAO_DO_PROMPT,
});
const atualizacao = atualizarTermos(termos, resultado, {
  categorias: arquivoDeCategorias.categorias,
});

const adicionados = new Set(atualizacao.adicionados);
const motivosParaNaoAdicionar = new Map(atualizacao.naoAdicionados.map(({ id, motivo }) => [id, motivo]));
for (const registro of resultado.novos) {
  registro.adicionado = adicionados.has(registro.proposta_id);
  if (!registro.adicionado) {
    registro.motivo_adicao = motivosParaNaoAdicionar.get(registro.proposta_id) ?? "não incluído no termos.json";
  }
}

const errosDosTermosAtualizados = validarGlossario(atualizacao.termos);
if (errosDosTermosAtualizados.length > 0) {
  console.error(errosDosTermosAtualizados.join("\n"));
  process.exit(1);
}

const relatorio = montarRelatorio({
  coletadoEm: dataDaColeta,
  porFonte,
  erros,
  classificados,
  resultado,
  totalDeCandidatos: candidatos.length,
});
const semSegredo = (texto) => (chave ? texto.replaceAll(chave, "[chave]") : texto);
const relatorioFinal = JSON.parse(semSegredo(JSON.stringify(relatorio)));
const corpoDoPr = semSegredo(gerarCorpoDoPr(relatorio));
const caminhoDosTermos = fileURLToPath(new URL("../frontend/data/termos.json", import.meta.url));
const caminhoDoRelatorio = fileURLToPath(new URL("../coleta/relatorio.json", import.meta.url));
const caminhoDoCorpo = fileURLToPath(new URL("../coleta/resumo.md", import.meta.url));

// Grava só quando o conteúdo mudou de verdade, sem as datas: os conflitos e os termos novos que ficam
// fora do termos.json voltam iguais em toda execução, e sem isso o robô abriria PR toda segunda.
const relatorioAnterior = await readFile(caminhoDoRelatorio, "utf-8").then(JSON.parse).catch(() => null);
const temMudanca = relatorioMudou(relatorioFinal, relatorioAnterior);

if (temMudanca) {
  const conteudoAtual = await readFile(caminhoDosTermos, "utf-8");
  const fimDeLinha = conteudoAtual.includes("\r\n") ? "\r\n" : "\n";
  const fimDoArquivo = conteudoAtual.endsWith("\n") ? fimDeLinha : "";
  const conteudoAtualizado = `${JSON.stringify(atualizacao.termos, null, 2).replaceAll("\n", fimDeLinha)}${fimDoArquivo}`;
  if (conteudoAtual !== conteudoAtualizado) await writeFile(caminhoDosTermos, conteudoAtualizado, "utf-8");
  await writeFile(caminhoDoRelatorio, `${JSON.stringify(relatorioFinal, null, 2)}\n`, "utf-8");
}

await mkdir(dirname(caminhoDoCorpo), { recursive: true });
await writeFile(caminhoDoCorpo, corpoDoPr, "utf-8");

for (const [fonte, total] of Object.entries(porFonte)) console.error(`${fonte}: ${total} candidato(s)`);
for (const erro of erros) console.error(`AVISO ${semSegredo(erro)}`);
console.error(
  `${relatorio.totais.novos} novo(s), ${relatorio.totais.alterados} alterado(s), ` +
    `${relatorio.totais.conflitos} conflito(s), ${relatorio.totais.iguais} igual(is), ` +
    `${atualizacao.adicionados.length} incluído(s) no termos.json, ` +
    `${atualizacao.naoAdicionados.length} não incluído(s)`,
);

if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, corpoDoPr, "utf-8");
if (process.env.GITHUB_OUTPUT) {
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `tem_mudancas=${temMudanca}\ndata=${dataDaColeta}\n`,
    "utf-8",
  );
}
