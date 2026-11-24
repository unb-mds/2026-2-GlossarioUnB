import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/mutacao.yml", import.meta.url), "utf-8");

test("workflow de mutação roda semanalmente e por workflow_dispatch", () => {
  assert.match(workflow, /^name: Mutação/m);
  assert.match(workflow, /schedule:\s*\n\s*- cron: "0 9 \* \* 1"/);
  assert.match(workflow, /workflow_dispatch:/);
});

test("workflow de mutação mantém o GITHUB_TOKEN só de leitura e checa domínio e coleta", () => {
  assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  assert.match(workflow, /npm run test:mutacao/);
  assert.match(workflow, /node scripts\/verificar-mutacao\.mjs/);
});
