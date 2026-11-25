// Busca de salas da Planta da FCTE (ex.: S-10, I-10) na página inicial e em planta.html + acessibilidade.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const CAMPO_BUSCA = "Pesquisar sigla, gíria ou expressão";

test.describe("busca de salas da planta da FCTE", () => {
  test("digitar S10 na capa abre a sala destacada na planta da FCTE", async ({ page }) => {
    await page.goto("/frontend/");
    await expect(page.locator("#total-termos")).toHaveText(/^\d+$/);

    const campo = page.getByRole("combobox", { name: CAMPO_BUSCA });
    await campo.fill("S10");

    const primeira = page.getByRole("option").first();
    await expect(primeira).toContainText("Sala S10");
    await expect(primeira).toContainText("UAC");
    await primeira.click();

    await expect(page).toHaveURL(/\/frontend\/planta\.html\?predio=uac&andar=superior&sala=S10$/);
    await expect(page.locator(".onde-fica-local")).toContainText("Sala S10");
  });

  test("buscar I-10 dentro de planta.html leva ao térreo da UAC com acessibilidade verde", async ({ page }) => {
    await page.goto("/frontend/planta.html");
    const campo = page.getByLabel("Encontrar sala na planta");
    await campo.fill("I-10");

    const link = page.locator(".planta-resultados a", { hasText: "Sala I10" }).first();
    await expect(link).toBeVisible();

    const auditoriaClaro = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(auditoriaClaro.violations).toEqual([]);

    await link.click();
    await expect(page).toHaveURL(/\/frontend\/planta\.html\?predio=uac&andar=terreo&sala=I10$/);
    await expect(page.locator(".onde-fica-local")).toContainText("Sala I10");
  });

  test("busca na planta em tema escuro passa no axe-core sem violações", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("glossario-unb:tema", "escuro");
      } catch {
        // segue tema do sistema
      }
    });
    await page.goto("/frontend/planta.html");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "escuro");
    await page.getByLabel("Encontrar sala na planta").fill("I-10");
    await expect(page.locator(".planta-resultados a", { hasText: "Sala I10" }).first()).toBeVisible();

    const auditoriaEscuro = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(auditoriaEscuro.violations).toEqual([]);
  });
});
