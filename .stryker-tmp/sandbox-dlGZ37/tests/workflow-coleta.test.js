import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/coleta.yml", import.meta.url), "utf-8");

test("workflow da coleta roda semanalmente e por workflow_dispatch", () => {
  assert.match(workflow, /^name: Coleta semanal/m);
  assert.match(workflow, /schedule:\s*\n\s*- cron: "0 9 \* \* 1"/);
  assert.match(workflow, /workflow_dispatch:/);
});

test("workflow da coleta mantém o GITHUB_TOKEN só de leitura e evita execuções concorrentes", () => {
  assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  assert.match(workflow, /concurrency:\s*\n\s*group: coleta\s*\n\s*cancel-in-progress: false/);
});

test("workflow usa a credencial do robô para disparar o CI do PR", () => {
  assert.match(workflow, /actions\/create-github-app-token@v2/);
  assert.match(workflow, /app-id: \$\{\{ secrets\.ROBO_APP_ID \}\}/);
  assert.match(workflow, /private-key: \$\{\{ secrets\.ROBO_APP_PRIVATE_KEY \}\}/);
  assert.match(workflow, /actions\/checkout@v4\s*\n\s*with:\s*\n\s*token: \$\{\{ steps\.robo\.outputs\.token \}\}/);
});

test("workflow roda o pipeline completo e grava o relatório e o corpo do PR", () => {
  assert.match(workflow, /npm ci --omit=dev/);
  assert.match(workflow, /npm run coleta:completa/);
  assert.match(workflow, /GEMINI_API_KEY: \$\{\{ secrets\.GEMINI_API_KEY \}\}/);
  assert.match(workflow, /--body-file coleta\/resumo\.md/);
  assert.doesNotMatch(workflow, /COLETA_PAT/);
});

test("workflow só abre o PR quando há mudança e nunca faz merge", () => {
  assert.match(workflow, /git status --porcelain/);
  assert.match(workflow, /RAMO=robo\/coleta-semanal/);
  assert.match(workflow, /git add -A/);
  assert.match(workflow, /gh pr create --base main --head "\$RAMO"/);
  assert.match(workflow, /gh pr edit "\$RAMO" --body-file coleta\/resumo\.md/);
  assert.doesNotMatch(workflow, /gh pr merge|merge: true/);
});
