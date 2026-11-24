// Lista completa com filtros por tipo e campus (RF02), inclusive com os
// filtros vindos da URL para o link poder ser compartilhado. Os esperados
// saem do termos.json, que nunca muda a menos que seja editado a propósito.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const CARTOES = "#lista-termos .cartao";
const termos = JSON.parse(readFileSync(new URL("../frontend/data/termos.json", import.meta.url), "utf-8"));
const girias = termos.filter((t) => t.tipo === "giria");
const giriasDoCampus = (campus) => girias.filter((t) => t.campus === campus);
const textoContagem = (total) => (total === 1 ? "1 termo" : `${total} termos`);

test.describe("lista com filtros", () => {
  test("filtra por tipo e campus, atualizando a URL", async ({ page }) => {
    await page.goto("/frontend/todas-siglas.html");
    await expect(page.locator("#filtro-status")).toHaveText(/\d+ termos?/);

    await page.getByLabel("Tipo").selectOption("giria");
    await expect(page.locator("#filtro-status")).toHaveText(textoContagem(girias.length));
    await expect(page.locator(CARTOES)).toHaveCount(girias.length);
    await expect(page.locator("#lista-termos")).toContainText(girias[0].termo);

    let url = new URL(page.url());
    expect(url.searchParams.get("tipo")).toBe("giria");
    expect(url.searchParams.get("campus")).toBeNull();

    await page.getByLabel("Campus").selectOption("Darcy Ribeiro");
    await expect(page.locator(CARTOES)).toHaveCount(giriasDoCampus("Darcy Ribeiro").length);
    url = new URL(page.url());
    expect(url.searchParams.get("campus")).toBe("Darcy Ribeiro");

    await page.getByLabel("Campus").selectOption("Gama");
    await expect(page.locator("#filtro-status")).toHaveText(textoContagem(giriasDoCampus("Gama").length));
    await expect(page.locator("#lista-termos .aviso-vazio")).toHaveText("Nenhum termo encontrado para esse filtro.");
    await expect(page.locator(CARTOES)).toHaveCount(0);
  });

  test("abre já filtrado quando os filtros vêm da URL", async ({ page }) => {
    await page.goto("/frontend/todas-siglas.html?tipo=giria&campus=Darcy%20Ribeiro");

    await expect(page.getByLabel("Tipo")).toHaveValue("giria");
    await expect(page.getByLabel("Campus")).toHaveValue("Darcy Ribeiro");
    await expect(page.locator(CARTOES)).toHaveCount(giriasDoCampus("Darcy Ribeiro").length);
    await expect(page.locator("#lista-termos")).toContainText(girias[0].termo);
  });
});
