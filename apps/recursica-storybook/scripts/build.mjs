#!/usr/bin/env node
/* global console */
/* eslint-disable no-console */

import { execSync } from "child_process";
import { rmSync, cpSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../../..");
const mantineAdapterPath = join(projectRoot, "packages/mantine-adapter");
const muiAdapterPath = join(projectRoot, "packages/mui-adapter");
const distPath = join(projectRoot, "apps/recursica-storybook/dist");

console.log("Cleaning dist folder...");
rmSync(distPath, { recursive: true, force: true });
mkdirSync(distPath, { recursive: true });

console.log("Building mantine-adapter storybook...");
execSync("npm run build-storybook", {
  cwd: mantineAdapterPath,
  stdio: "inherit",
});
console.log("Copying mantine-adapter storybook-static to dist/mantine-adapter...");
cpSync(join(mantineAdapterPath, "storybook-static"), join(distPath, "mantine-adapter"), {
  recursive: true,
});

console.log("Building mui-adapter storybook...");
execSync("npm run build-storybook", {
  cwd: muiAdapterPath,
  stdio: "inherit",
});
console.log("Copying mui-adapter storybook-static to dist/mui-adapter...");
cpSync(join(muiAdapterPath, "storybook-static"), join(distPath, "mui-adapter"), {
  recursive: true,
});

console.log("Generating root index.html redirect...");
const indexHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=./mantine-adapter/">
    <title>Recursica Storybook</title>
  </head>
  <body>
    <p>Redirecting to the default <a href="./mantine-adapter/">Mantine Adapter Storybook</a>...</p>
  </body>
</html>`;
writeFileSync(join(distPath, "index.html"), indexHtml);

console.log("Build complete!");
