// Verificação periódica das fontes (#60, RF07), chamada pelo workflow .github/workflows/verificacao.yml.
//
// Sem argumentos, só confere os links e grava o relatório em coleta/saida/verificacao.json (fora do Git).
// --abrir-issues: cria uma issue para cada fonte com problema, sem repetir a que já está aberta (usa o gh).
// --atualizar: grava `verificado_em` nos termos cuja fonte respondeu bem e não mudou (carga inicial ou revisão manual).

import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { validarGlossario } from "../frontend/js/validacao-termo.js";
import { atualizarVerificados, hojeEmBrasilia, planejarIssues, verificarFontes } from "../coleta/verificacao.js";

const executar = promisify(execFile);
const argumentos = new Set(process.argv.slice(2));
const lerDoRepositorio = (caminho) => readFile(new URL(caminho, import.meta.url), "utf-8");
const caminhoDosTermos = fileURLToPath(new URL("../frontend/data/termos.json", import.meta.url));
const caminhoDoRelatorio = fileURLToPath(new URL("../coleta/saida/verificacao.json", import.meta.url));
const celula = (texto) => String(texto ?? "").replace(/\s+/g, " ").replaceAll("|", "\\|").trim();

const termos = JSON.parse(await lerDoRepositorio("../frontend/data/termos.json"));
const errosDoGlossario = validarGlossario(termos);
if (errosDoGlossario.length > 0) {
  console.error(errosDoGlossario.join("\n"));
  process.exit(1);
}

const data = hojeEmBrasilia();
const resultado = await verificarFontes(termos, { data });
const relatorio = { gerado_em: new Date().toISOString(), ...resultado };
await mkdir(dirname(caminhoDoRelatorio), { recursive: true });
await writeFile(caminhoDoRelatorio, `${JSON.stringify(relatorio, null, 2)}\n`, "utf-8");

let issuesCriadas = [];
let issuesExistentes = [];
if (argumentos.has("--abrir-issues")) {
  const { stdout } = await executar(
    "gh",
    ["issue", "list", "--state", "open", "--limit", "1000", "--json", "number,title,body"],
    { maxBuffer: 20 * 1024 * 1024 },
  );
  const abertas = JSON.parse(stdout || "[]");
  const plano = planejarIssues(resultado.problemas, abertas);
  for (const issue of plano.abrir) {
    const { stdout: criada } = await executar(
      "gh",
      ["issue", "create", "--title", issue.titulo, "--body", issue.corpo, "--label", "coleta", "--label", "dados"],
      { maxBuffer: 1024 * 1024 },
    );
    issuesCriadas.push(criada.trim());
  }
  issuesExistentes = plano.existentes;
}

if (argumentos.has("--atualizar")) {
  const conteudoAtual = await readFile(caminhoDosTermos, "utf-8");
  const fimDeLinha = conteudoAtual.includes("\r\n") ? "\r\n" : "\n";
  const fimDoArquivo = conteudoAtual.endsWith("\n") ? fimDeLinha : "";
  const conteudoAtualizado = `${JSON.stringify(atualizarVerificados(termos, resultado), null, 2).replaceAll("\n", fimDeLinha)}${fimDoArquivo}`;
  if (conteudoAtual !== conteudoAtualizado) await writeFile(caminhoDosTermos, conteudoAtualizado, "utf-8");
}

const linhasDoResumo = [
  `## Verificação das fontes — ${data}`,
  "",
  `- Fontes conferidas: ${resultado.fontes.filter((fonte) => fonte.status !== null).length}`,
  `- Termos com fonte saudável: ${resultado.verificados.length}`,
  `- Fontes com problema: ${resultado.problemas.length}`,
  `- Issues criadas: ${issuesCriadas.length}`,
  `- Issues que já existiam: ${issuesExistentes.length}`,
];
if (resultado.problemas.length > 0) {
  linhasDoResumo.push(
    "",
    "### Fontes com problema",
    "",
    "| Fonte | Status | Termos | Motivo |",
    "|---|---:|---:|---|",
    ...resultado.problemas.map((problema) =>
      `| ${celula(problema.url)} | ${problema.status ?? "-"} | ${problema.termos.length} | ${celula(problema.motivos.join("; "))} |`),
  );
}
if (resultado.erros.length > 0) {
  linhasDoResumo.push("", "### Avisos", "", ...resultado.erros.map((erro) => `- ${celula(erro)}`));
}
const resumo = `${linhasDoResumo.join("\n")}\n`;

for (const problema of resultado.problemas) console.error(`PROBLEMA ${problema.url}: ${problema.motivos.join("; ")}`);
for (const erro of resultado.erros) console.error(`AVISO ${erro}`);
for (const issue of issuesCriadas) console.error(`issue criada: ${issue}`);
console.error(
  `${resultado.fontes.length} fonte(s), ${resultado.verificados.length} termo(s) verificado(s), ` +
    `${resultado.problemas.length} problema(s), ${resultado.ignoradas.length} fonte(s) sem URL`,
);

if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, resumo, "utf-8");
