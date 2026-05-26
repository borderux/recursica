import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm run storybook",
      port: 6011,
      reuseExistingServer: !process.env.CI,
      cwd: "../mantine-adapter",
      timeout: 120 * 1000,
    },
    {
      command: "npm run storybook",
      port: 6012,
      reuseExistingServer: !process.env.CI,
      cwd: "../mui-adapter",
      timeout: 120 * 1000,
    },
  ],
});
