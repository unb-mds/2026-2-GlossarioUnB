// Valida o arquivo real de termos: um PR com termo fora do schema (ADR 0004) falha no CI.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { CAMPI, filtrarTermos } from "../frontend/js/termos.js";
import { validarGlossario } from "../frontend/js/validacao-termo.js";

async function lerTermos() {
  const conteudo = await readFile(new URL("../frontend/data/termos.json", import.meta.url), "utf-8");
  return JSON.parse(conteudo);
}

test("frontend/data/termos.json segue o schema do termo", async () => {
  assert.deepEqual(validarGlossario(await lerTermos()), []);
});

test("cada campus possui pelo menos 1 termo específico no filtro por campus", async () => {
  const termos = await lerTermos();
  for (const campus of CAMPI) {
    const especificos = termos.filter((termo) => termo.campus === campus);
    assert.ok(
      especificos.length >= 1,
      `esperava pelo menos 1 termo específico para o campus "${campus}"`,
    );
    const filtrados = filtrarTermos(termos, { campus });
    for (const termo of especificos) {
      assert.ok(filtrados.includes(termo));
    }
  }
});

// Sites oficiais que só respondem em http (a porta 443 recusa a conexão). Trocar por https
// deixaria a fonte com link quebrado (RNF05). Ao ganhar https, o endereço sai daqui.
const SO_HTTP = new Set(["http://ft.unb.br/"]);

test("fontes em URL de frontend/data/termos.json usam https, menos os sites que só têm http", async () => {
  const termos = await lerTermos();
  const inseguras = termos
    .filter((termo) => termo.fonte.startsWith("http://") && !SO_HTTP.has(termo.fonte))
    .map((termo) => `${termo.id}: ${termo.fonte}`);
  assert.deepEqual(inseguras, [], `fontes sem https: ${inseguras.join(", ")}`);
});
