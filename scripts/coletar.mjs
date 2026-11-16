// Roda a coleta de verdade: `npm run coleta > candidatos.json`.
// Lê coleta/fontes.json, respeita o robots.txt e espera 1 s entre pedidos (coleta/coletor-html.js).
// Os candidatos saem em JSON na saída padrão; o resumo por fonte e os erros saem no stderr.
import { readFile } from "node:fs/promises";

import { coletar } from "../coleta/coletor-html.js";
import { validarFontes } from "../coleta/fontes.js";

const config = JSON.parse(await readFile(new URL("../coleta/fontes.json", import.meta.url), "utf-8"));
const errosDoArquivo = validarFontes(config);
if (errosDoArquivo.length > 0) {
  console.error(errosDoArquivo.join("\n"));
  process.exit(1);
}

const resultado = await coletar(config.fontes);
for (const [id, total] of Object.entries(resultado.por_fonte)) console.error(`${id}: ${total} candidato(s)`);
for (const erro of resultado.erros) console.error(`ERRO ${erro}`);
console.log(JSON.stringify(resultado, null, 2));
process.exitCode = resultado.erros.length > 0 ? 1 : 0;
