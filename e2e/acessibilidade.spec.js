// RNF03: as três páginas do glossário não podem ter violação do axe-core
// (WCAG 2.1 A/AA + boas práticas) nos temas claro e escuro (ADR 0008).
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGINAS = [
  {
    nome: "inicio",
    caminho: "/frontend/",
    pronto: (page) => expect(page.locator("#total-termos")).toHaveText(/^\d+$/),
  },
  {
    nome: "todas-as-siglas",
    caminho: "/frontend/todas-siglas.html",
    pronto: (page) => expect(page.locator("#filtro-status")).toHaveText(/\d+ termos?/),
  },
  {
    nome: "termo",
    caminho: "/frontend/termo.html?id=deg",
    pronto: (page) => expect(page.getByRole("heading", { level: 1 })).toHaveText("DEG"),
  },
];

const TEMAS = ["claro", "escuro"];

function descrever(violacoes) {
  return violacoes
    .map((violacao) =>
      [
        `${violacao.id} (${violacao.impact}): ${violacao.help}`,
        ...violacao.nodes.map((no) => `  ${no.target.join(" ")}\n  ${no.failureSummary}`),
      ].join("\n")
    )
    .join("\n\n");
}

for (const tema of TEMAS) {
  for (const pagina of PAGINAS) {
    test(`${pagina.nome}, tema ${tema}: sem violações do axe-core`, async ({ page }, testInfo) => {
      await page.addInitScript((valor) => {
        try {
          localStorage.setItem("glossario-unb:tema", valor);
        } catch {
          // sem localStorage: a página segue o tema do sistema
        }
      }, tema);

      await page.goto(pagina.caminho);
      await expect(page.locator("html")).toHaveAttribute("data-tema", tema);
      await pagina.pronto(page);

      const resultado = await new AxeBuilder({ page }).analyze();

      await testInfo.attach(`axe-${tema}-${pagina.nome}`, {
        body: JSON.stringify(resultado, null, 2),
        contentType: "application/json",
      });

      expect(resultado.violations, descrever(resultado.violations)).toEqual([]);
    });
  }
}
