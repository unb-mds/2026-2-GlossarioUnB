import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/verificacao.yml", import.meta.url), "utf-8");
const coleta = await readFile(new URL("../.github/workflows/coleta.yml", import.meta.url), "utf-8");

test("workflow da verificação roda depois da coleta e também por workflow_dispatch", () => {
  assert.match(workflow, /^name: Verificação das fontes/m);
  assert.match(workflow, /schedule:\s*\n\s*- cron: "0 10 \* \* 1"/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(coleta, /cron: "0 9 \* \* 1"/, "a coleta precisa rodar antes, para a issue não citar termo recém-alterado");
});

test("workflow da verificação pede só leitura do código e escrita em issues", () => {
  assert.match(workflow, /permissions:\s*\n\s*contents: read\s*\n\s*issues: write/);
  assert.doesNotMatch(workflow, /contents: write|pull_request_target/);
  assert.match(workflow, /concurrency:\s*\n\s*group: verificacao-fontes\s*\n\s*cancel-in-progress: false/);
});

test("workflow usa o GITHUB_TOKEN, e não a senha do robô, porque aqui não há PR", () => {
  assert.match(workflow, /GH_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}/);
  assert.doesNotMatch(workflow, /ROBO_APP|GEMINI_API_KEY|create-github-app-token/);
});

test("workflow instala só as bibliotecas do robô, confere as fontes e guarda o relatório", () => {
  assert.match(workflow, /npm ci --omit=dev/);
  assert.match(workflow, /node scripts\/verificar-fontes\.mjs --abrir-issues/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /coleta\/saida\/verificacao\.json/);
});

test("workflow não edita termos, não faz commit, push nem merge", () => {
  assert.doesNotMatch(workflow, /git (add|commit|push)|gh pr |gh issue close/);
});
