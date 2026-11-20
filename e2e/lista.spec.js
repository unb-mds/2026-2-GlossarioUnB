// Lista completa com filtros por tipo e campus (RF02), inclusive com os
// filtros vindos da URL para o link poder ser compartilhado.
import { test, expect } from "@playwright/test";

const CARTOES = "#lista-termos .cartao";

test.describe("lista com filtros", () => {
  test("filtra por tipo e campus, atualizando a URL", async ({ page }) => {
    await page.goto("/frontend/todas-siglas.html");
    await expect(page.locator("#filtro-status")).toHaveText(/\d+ termos?/);

    await page.getByLabel("Tipo").selectOption("giria");
    await expect(page.locator("#filtro-status")).toHaveText("1 termo");
    await expect(page.locator(CARTOES)).toHaveCount(1);
    await expect(page.locator("#lista-termos")).toContainText("Ceubinho");

    let url = new URL(page.url());
    expect(url.searchParams.get("tipo")).toBe("giria");
    expect(url.searchParams.get("campus")).toBeNull();

    await page.getByLabel("Campus").selectOption("Darcy Ribeiro");
    await expect(page.locator(CARTOES)).toHaveCount(1);
    url = new URL(page.url());
    expect(url.searchParams.get("campus")).toBe("Darcy Ribeiro");

    await page.getByLabel("Campus").selectOption("Gama");
    await expect(page.locator("#filtro-status")).toHaveText("0 termos");
    await expect(page.locator("#lista-termos .aviso-vazio")).toHaveText("Nenhum termo encontrado para esse filtro.");
    await expect(page.locator(CARTOES)).toHaveCount(0);
  });

  test("abre já filtrado quando os filtros vêm da URL", async ({ page }) => {
    await page.goto("/frontend/todas-siglas.html?tipo=giria&campus=Darcy%20Ribeiro");

    await expect(page.getByLabel("Tipo")).toHaveValue("giria");
    await expect(page.getByLabel("Campus")).toHaveValue("Darcy Ribeiro");
    await expect(page.locator(CARTOES)).toHaveCount(1);
    await expect(page.locator("#lista-termos")).toContainText("Ceubinho");
  });
});
