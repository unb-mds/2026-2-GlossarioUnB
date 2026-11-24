// Checa os escores mínimos de mutação: domínio ≥ 70%, coleta ≥ 50% (#82).
// Lê o relatório que `stryker.config.json` grava em `reports/mutation/mutation.json`,
// usando a mesma conta de escore do StrykerJS (mutantes mortos ÷ válidos por grupo).

import { readFile } from "node:fs/promises";

const DOMINIO_MIN = 70;
const PIPELINE_MIN = 50;

const emDominio = (arquivo) => arquivo.replaceAll("\\", "/").includes("frontend/js/");
const emPipeline = (arquivo) => {
  const caminho = arquivo.replaceAll("\\", "/");
  return caminho.startsWith("coleta/") || caminho.includes("/coleta/");
};

function escoreDoGrupo(relatorio, grupo) {
  let mortos = 0;
  let validos = 0;
  for (const [caminho, { mutants }] of Object.entries(relatorio.files)) {
    if (!grupo(caminho)) continue;
    for (const { status } of mutants) {
      if (status === "Killed" || status === "Timeout") {
        mortos++;
        validos++;
      } else if (status === "Survived" || status === "NoCoverage") {
        validos++;
      }
    }
  }
  return validos > 0 ? (mortos / validos) * 100 : 100;
}

const relatorio = JSON.parse(await readFile("reports/mutation/mutation.json", "utf8"));
const dominio = escoreDoGrupo(relatorio, emDominio);
const pipeline = escoreDoGrupo(relatorio, emPipeline);
console.log(`Escore de mutação: domínio ${dominio.toFixed(1)}%, coleta ${pipeline.toFixed(1)}%`);

let ok = dominio >= DOMINIO_MIN && pipeline >= PIPELINE_MIN;
if (!ok) {
  if (dominio < DOMINIO_MIN) console.error(`Escore de mutação do domínio abaixo do mínimo: ${dominio.toFixed(1)}% < ${DOMINIO_MIN}%`);
  if (pipeline < PIPELINE_MIN) console.error(`Escore de mutação da coleta abaixo do mínimo: ${pipeline.toFixed(1)}% < ${PIPELINE_MIN}%`);
  process.exit(1);
}
