import { fileURLToPath } from "node:url";

import { FONTE_ID, coletarDpo, salvarDpo } from "../coleta/coletores/dpo.js";

const saida = fileURLToPath(new URL("../coleta/saida/dpo.json", import.meta.url));
const resultado = await coletarDpo();
await salvarDpo(resultado, saida);

for (const erro of resultado.erros) console.error(`AVISO ${erro}`);
console.error(`${FONTE_ID}: ${resultado.candidatos.length} candidato(s) em ${saida}`);
