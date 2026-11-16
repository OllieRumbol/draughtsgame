import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the production build, served by "vite preview" (plan section 7.1).
// "npm run e2e" builds the site first.
const previewUrl = "http://localhost:4173/draughtsgame/";
const onCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: onCi,
  // One retry in CI only. A retried test is still reported as flaky (plan section 9, risk 5).
  retries: onCi ? 1 : 0,
  reporter: onCi ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: previewUrl,
    trace: "on-first-retry",
  },
  // The browsers stand in for spec section 6.5, item 2 (plan section 7.1).
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "chromium-phone", use: { ...devices["Pixel 7"] } },
    { name: "webkit-phone", use: { ...devices["iPhone 17"] } },
  ],
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: previewUrl,
    reuseExistingServer: !onCi,
  },
});
