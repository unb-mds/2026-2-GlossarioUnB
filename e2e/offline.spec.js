// Consulta offline com o service worker (ADR 0003): depois da primeira visita,
// a busca, a lista e a página do termo abrem sem rede.
import { test, expect } from "@playwright/test";

const CAMPO_BUSCA = "Pesquisar sigla, gíria ou expressão";

async function esperarServiceWorkerControlar(page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  const controlando = () => page.evaluate(() => Boolean(navigator.serviceWorker.controller));
  if (!(await controlando())) await page.reload();
  await expect.poll(controlando, { timeout: 15_000 }).toBe(true);
}

test("consulta offline depois da primeira visita", async ({ page, context }) => {
  await page.goto("/frontend/");
  await expect(page.locator("#total-termos")).toHaveText(/^\d+$/);
  await esperarServiceWorkerControlar(page);

  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole("heading", { level: 1 })).toContainText("O que significa essa sigla?");
  await expect(page.locator("#total-termos")).toHaveText(/^\d+$/);

  const campo = page.getByRole("combobox", { name: CAMPO_BUSCA });
  await campo.fill("bce");
  await expect(page.getByRole("option").first()).toContainText("BCE");
  await expect(campo).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("link", { name: /Ver a lista completa/ }).click();
  await expect(page).toHaveURL(/\/frontend\/todas-siglas\.html$/);
  await expect(page.locator("#filtro-status")).toHaveText(/\d+ termos?/);
  await expect(page.locator("#lista-termos .cartao").first()).toBeVisible();

  await page.goto("/frontend/termo.html?id=bce");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("BCE");
  await expect(page.locator("#conteudo-termo")).toContainText("Biblioteca Central");

  await page.goto("/frontend/termo.html?id=ceubinho");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ceubinho");
  await expect(page.locator(".mapa-offline")).toHaveText(/Mapa indisponível offline/);
});
