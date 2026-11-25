// Filtro "Só com mapa ou planta" em Todas as siglas (OSM + Planta 2D da FCTE) + acessibilidade.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { idsComPlanta, temLocalizacao } from "../frontend/js/lista.js";

const termos = JSON.parse(readFileSync(new URL("../frontend/data/termos.json", import.meta.url), "utf-8"));
const planta = JSON.parse(readFileSync(new URL("../frontend/data/planta-fcte.json", import.meta.url), "utf-8"));
const idsNaPlanta = idsComPlanta(planta);
const comLocalizacao = termos.filter((t) => temLocalizacao(t, idsNaPlanta));

test.describe("filtro com localização (OSM + Planta FCTE)", () => {
  test("filtra apenas termos com mapa ou planta e persiste na URL", async ({ page }) => {
    await page.goto("/frontend/todas-siglas.html");
    await expect(page.locator("#filtro-status")).toHaveText(/\d+ termos?/);

    await page.getByLabel("Localização").selectOption("1");
    await expect(page.locator("#filtro-status")).toHaveText(`${comLocalizacao.length} termos`);
    await expect(page.locator("#lista-termos")).toContainText("BCE");
    await expect(page.locator("#lista-termos")).toContainText("LDS");

    const url = new URL(page.url());
    expect(url.searchParams.get("localizacao")).toBe("1");

    // Reabre a URL compartilhada direto com ?localizacao=1
    await page.goto("/frontend/todas-siglas.html?localizacao=1");
    await expect(page.locator("#filtro-status")).toHaveText(`${comLocalizacao.length} termos`);
    await expect(page.getByLabel("Localização")).toHaveValue("1");

    const auditoria = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(auditoria.violations).toEqual([]);
  });
});
