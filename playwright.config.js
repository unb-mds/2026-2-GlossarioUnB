// Testes ponta a ponta no navegador (issue #78). Rodam contra o servidor local,
// com o mesmo layout do GitHub Pages, e cobrem os fluxos principais e a
// acessibilidade (WCAG 2.1 AA) nos temas claro e escuro.
import { defineConfig, devices } from "@playwright/test";

const PORTA = 8080;
const URL_BASE = `http://127.0.0.1:${PORTA}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: URL_BASE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node scripts/servidor-local.mjs",
    url: `${URL_BASE}/frontend/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: { PORT: String(PORTA) },
  },
});
