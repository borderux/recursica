import { defineConfig, devices } from "@playwright/test";
import { getSourceOfTruth } from "./src/config";
import config from "./adapter-tester.config";

const sourceOfTruth = getSourceOfTruth(config);
const [target] = config.targets.filter((t) => !t.sourceOfTruth);

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
      port: Number(new URL(sourceOfTruth.url).port),
      reuseExistingServer: !process.env.CI,
      cwd: "../mantine-adapter",
      timeout: 120 * 1000,
    },
    {
      command: "npm run storybook",
      port: Number(new URL(target.url).port),
      reuseExistingServer: !process.env.CI,
      cwd: "../mui-adapter",
      timeout: 120 * 1000,
    },
  ],
});
