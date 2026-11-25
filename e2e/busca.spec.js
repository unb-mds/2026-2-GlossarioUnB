// Fluxo principal: buscar → autocomplete → página do termo, e busca sem
// resultado → link "Sugerir este termo" (RF01 e RF04).
import { test, expect } from "@playwright/test";

const CAMPO_BUSCA = "Pesquisar sigla, gíria ou expressão";

async function aguardarTermos(page) {
  await expect(page.locator("#total-termos")).toHaveText(/^\d+$/);
}

test.describe("busca com autocomplete", () => {
  test("teclado: digita DEG, escolhe a primeira sugestão e abre o termo", async ({ page }) => {
    await page.goto("/frontend/");
    await aguardarTermos(page);

    const campo = page.getByRole("combobox", { name: CAMPO_BUSCA });
    await campo.fill("deg");

    await expect(campo).toHaveAttribute("aria-expanded", "true");
    const opcoes = page.getByRole("option");
    await expect(opcoes.first()).toContainText("DEG");
    await expect(opcoes.first()).toContainText("Decanato de Ensino de Graduação");

    await campo.press("ArrowDown");
    await expect(campo).toHaveAttribute("aria-activedescendant", "sugestao-0");
    await campo.press("Enter");

    await expect(page).toHaveURL(/\/frontend\/termo\.html\?id=deg$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("DEG");
    await expect(page.getByRole("heading", { name: "O que é" })).toBeVisible();
  });

  test("mouse: clicar na sugestão abre o termo", async ({ page }) => {
    await page.goto("/frontend/");
    await aguardarTermos(page);

    await page.getByRole("combobox", { name: CAMPO_BUSCA }).fill("bce");
    await page.getByRole("option", { name: /^BCE/ }).click();

    await expect(page).toHaveURL(/\/frontend\/termo\.html\?id=bce$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("BCE");
    await expect(page.getByRole("heading", { name: "Fonte" })).toBeVisible();
  });

  test("busca sem resultado mostra o link para sugerir o termo", async ({ page }) => {
    await page.goto("/frontend/");
    await aguardarTermos(page);

    await page.getByRole("combobox", { name: CAMPO_BUSCA }).fill("xilofonequimico");

    await expect(page.locator("#busca-status")).toHaveText("Nenhum termo encontrado.");
    const aviso = page.locator("#busca-vazia");
    await expect(aviso).toBeVisible();
    await expect(aviso).toContainText("Nenhum termo encontrado para “xilofonequimico”.");

    const link = aviso.getByRole("link", { name: "Sugerir este termo" });
    const url = new URL(await link.getAttribute("href"));
    expect(url.origin).toBe("https://github.com");
    expect(url.pathname).toBe("/unb-mds/2026-2-GlossarioUnB/issues/new");
    expect(url.searchParams.get("template")).toBe("adicionar-termo.yml");
    expect(url.searchParams.get("title")).toBe("[Adicionar Termo] xilofonequimico");
  });

  test("busca por menção (MM) e por assunto nas definições (#172)", async ({ page }) => {
    await page.goto("/frontend/");
    await aguardarTermos(page);

    const campo = page.getByRole("combobox", { name: CAMPO_BUSCA });
    await campo.fill("MM");
    await expect(page.getByRole("option").first()).toContainText("Menção (MM)");

    await campo.fill("assistência estudantil");
    await expect(page.getByRole("option").first()).toBeVisible();
    await expect(page.locator("#busca-vazia")).toBeHidden();
  });
});
