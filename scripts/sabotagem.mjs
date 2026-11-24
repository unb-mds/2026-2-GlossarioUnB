// Teste de sabotagem: põe de propósito, um por vez, os defeitos listados em tests/sabotagens/*.json, roda a
// suíte inteira e confere que ela quebra. O plano de ensino de MDS pede isso em 100% dos módulos críticos
// (docs/TESTE-DE-SABOTAGEM.md). Sem biblioteca: só Node (ADR 0010).
//
//   npm run test:sabotagem
//
// O arquivo sabotado sempre volta ao original, mesmo com erro ou Ctrl+C. Sai com código 1 se algum defeito
// passar sem quebrar a suíte, ou se o trecho de algum defeito não existir mais no código (a lista ficou velha).

import { spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PASTA_DA_LISTA = path.join("tests", "sabotagens");
const LIMITE_POR_SUITE_MS = 120_000;

function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

// Problemas de um item da lista; lista vazia = item válido. Os itens chegam por PR, então são conferidos.
export function validarSabotagem(item) {
  if (typeof item !== "object" || item === null) return ["cada sabotagem deve ser um objeto"];
  const erros = ["modulo", "defeito", "arquivo"]
    .filter((campo) => !textoPreenchido(item[campo]))
    .map((campo) => `campo obrigatório ausente ou vazio: ${campo}`);
  if (!Array.isArray(item.trocas) || item.trocas.length === 0) {
    erros.push("trocas deve ser uma lista com pelo menos uma troca { de, para }");
    return erros;
  }
  item.trocas.forEach((troca, i) => {
    if (!textoPreenchido(troca?.de) || typeof troca?.para !== "string") erros.push(`troca ${i + 1}: precisa de "de" (texto) e "para"`);
    else if (troca.de === troca.para) erros.push(`troca ${i + 1}: "de" e "para" são iguais, não há defeito`);
  });
  return erros;
}

// Aplica as trocas ao conteúdo. Cada trecho precisa aparecer exatamente uma vez: assim o defeito cai no lugar
// pensado, e uma refatoração que mude o trecho avisa que a lista precisa ser atualizada.
export function aplicarTrocas(conteudo, trocas) {
  let resultado = conteudo;
  for (const { de, para } of trocas) {
    const vezes = resultado.split(de).length - 1;
    if (vezes !== 1) throw new Error(`o trecho aparece ${vezes} vezes (precisa ser 1): ${de.slice(0, 60)}`);
    resultado = resultado.replace(de, () => para);
  }
  return resultado;
}

export function lerSabotagens(raiz) {
  const pasta = path.join(raiz, PASTA_DA_LISTA);
  return readdirSync(pasta)
    .filter((nome) => nome.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .flatMap((nome) => JSON.parse(readFileSync(path.join(pasta, nome), "utf8")).map((item) => ({ ...item, lista: nome })));
}

// Caminho do arquivo a sabotar, sempre dentro do repositório (a lista vem de PR e não pode apontar para fora).
function caminhoDentro(raiz, arquivo) {
  const base = path.resolve(raiz);
  const alvo = path.resolve(base, arquivo);
  if (alvo !== base && alvo.startsWith(base + path.sep)) return alvo;
  throw new Error(`arquivo fora do repositório: ${arquivo}`);
}

export function rodarSuiteDeVerdade(raiz) {
  // Sem o NODE_TEST_CONTEXT: chamado de dentro de um teste, o node --test filho se reportaria ao pai e sairia com 0.
  const ambiente = { ...process.env, SABOTAGEM: "1" };
  delete ambiente.NODE_TEST_CONTEXT;
  const r = spawnSync(process.execPath, ["--test"], {
    cwd: raiz,
    encoding: "utf8",
    timeout: LIMITE_POR_SUITE_MS,
    env: ambiente,
  });
  const falhas = /ℹ fail (\d+)/.exec(`${r.stdout}${r.stderr}`)?.[1] ?? "?";
  return { quebrou: r.status !== 0, falhas };
}

// Põe cada defeito, roda a suíte e desfaz. "quebrou" é o resultado esperado.
export function rodarSabotagens({ raiz, sabotagens, rodarSuite = rodarSuiteDeVerdade, aoSabotar = () => {} }) {
  return sabotagens.map((item) => {
    const base = { lista: item.lista, modulo: item.modulo, defeito: item.defeito };
    const erros = validarSabotagem(item);
    if (erros.length > 0) return { ...base, situacao: "invalida", detalhe: erros.join("; ") };

    let alvo;
    let original;
    try {
      alvo = caminhoDentro(raiz, item.arquivo);
      original = readFileSync(alvo, "utf8");
      const sabotado = aplicarTrocas(original, item.trocas);
      aoSabotar({ alvo, original });
      writeFileSync(alvo, sabotado);
      const { quebrou, falhas } = rodarSuite(raiz);
      return { ...base, situacao: quebrou ? "quebrou" : "passou", detalhe: quebrou ? `${falhas} teste(s) falharam` : "nenhum teste falhou" };
    } catch (erro) {
      return { ...base, situacao: "nao-aplicada", detalhe: erro.message };
    } finally {
      if (original !== undefined) writeFileSync(alvo, original);
      aoSabotar(null);
    }
  });
}

const ROTULO = { quebrou: "quebrou ✔", passou: "PASSOU ✘", "nao-aplicada": "NÃO APLICADA ✘", invalida: "INVÁLIDA ✘" };

export function relatorio(resultados) {
  const linhas = [
    "| Lista | Módulo | Defeito proposital | Suíte | Detalhe |",
    "|---|---|---|---|---|",
    ...resultados.map((r) => `| ${r.lista} | \`${r.modulo}\` | ${r.defeito} | ${ROTULO[r.situacao]} | ${r.detalhe} |`),
  ];
  const quebraram = resultados.filter((r) => r.situacao === "quebrou").length;
  const ok = resultados.length > 0 && quebraram === resultados.length;
  linhas.push("", `${quebraram} de ${resultados.length} defeitos quebraram a suíte${ok ? "." : ": corrija os testes ou atualize a lista."}`);
  return { ok, texto: linhas.join("\n") };
}

export function principal({ raiz, escrever = console.log, resumoDoCi = process.env.GITHUB_STEP_SUMMARY, rodarSuite } = {}) {
  let emAndamento = null;
  const desfazer = () => {
    if (emAndamento) writeFileSync(emAndamento.alvo, emAndamento.original);
    process.exit(130);
  };
  process.once("SIGINT", desfazer);
  try {
    const resultados = rodarSabotagens({ raiz, sabotagens: lerSabotagens(raiz), rodarSuite, aoSabotar: (estado) => { emAndamento = estado; } });
    const { ok, texto } = relatorio(resultados);
    escrever(texto);
    if (resumoDoCi) appendFileSync(resumoDoCi, `## Teste de sabotagem\n\n${texto}\n`);
    return ok ? 0 : 1;
  } finally {
    process.removeListener("SIGINT", desfazer);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = principal({ raiz: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..") });
}
