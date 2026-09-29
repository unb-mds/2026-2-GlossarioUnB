// Valida o arquivo real de termos: um PR com termo fora do schema (ADR 0004) falha no CI.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { validarGlossario } from "../frontend/js/validacao-termo.js";

test("frontend/data/termos.json segue o schema do termo", async () => {
  const conteudo = await readFile(new URL("../frontend/data/termos.json", import.meta.url), "utf-8");
  assert.deepEqual(validarGlossario(JSON.parse(conteudo)), []);
});
