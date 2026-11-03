import { defineConfig, devices } from '@playwright/test';

// Recorre la app de verdad: necesita el backend con datos demo arriba.
//   docker compose up -d        (API en :8080)
//   npm run test:e2e
// Con otra API: E2E_API=http://localhost:8092/api npm run test:e2e
const api = process.env.E2E_API ?? 'http://localhost:8080/api';

export default defineConfig({
  testDir: './e2e',
  // Los recorridos comparten la base de datos.
  workers: 1,
  retries: 0,
  use: { baseURL: 'http://localhost:5173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    env: { VITE_API_URL: api },
  },
});
