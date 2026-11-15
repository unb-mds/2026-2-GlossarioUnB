// Valida o arquivo real de termos: um PR com termo fora do schema (ADR 0004) falha no CI.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { CAMPI } from "../frontend/js/termos.js";
import { validarGlossario } from "../frontend/js/validacao-termo.js";

test("frontend/data/termos.json segue o schema do termo", async () => {
  const conteudo = await readFile(new URL("../frontend/data/termos.json", import.meta.url), "utf-8");
  assert.deepEqual(validarGlossario(JSON.parse(conteudo)), []);
});

test("cada campus possui pelo menos 1 termo específico", async () => {
  const conteudo = await readFile(new URL("../frontend/data/termos.json", import.meta.url), "utf-8");
  const termos = JSON.parse(conteudo);
  for (const campus of CAMPI) {
    const termosDoCampus = termos.filter((t) => t.campus === campus);
    assert.ok(
      termosDoCampus.length >= 1,
      `Esperava pelo menos 1 termo específico para o campus "${campus}"`
    );
  }
});
