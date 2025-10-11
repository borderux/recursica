#!/usr/bin/env node
/* global console */
/* eslint-disable no-console */

import { execSync } from "child_process";
import { rmSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../..");
const mantineAdapterPath = join(projectRoot, "../../packages/mantine-adapter");
const distPath = join(projectRoot, "../recursica-storybook/dist");

console.log("Building mantine-adapter storybook...");
execSync("npm run build-storybook", {
  cwd: mantineAdapterPath,
  stdio: "inherit",
});

console.log("Cleaning dist folder...");
rmSync(distPath, { recursive: true, force: true });

console.log("Copying storybook-static to dist...");
cpSync(join(mantineAdapterPath, "storybook-static"), distPath, {
  recursive: true,
});

console.log("Build complete!");
