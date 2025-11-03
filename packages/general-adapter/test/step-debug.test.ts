import { processAdapter } from "../shared/common";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testOutputPath = path.join(__dirname, "output");

beforeAll(() => {
  if (fs.existsSync(testOutputPath)) {
    fs.rmSync(testOutputPath, { recursive: true });
  }
  fs.mkdirSync(testOutputPath, { recursive: true });
});

afterAll(() => {
  // Clean up after tests so repeated runs stay clean
  if (fs.existsSync(testOutputPath)) {
    fs.rmSync(testOutputPath, { recursive: true });
  }
});

describe("General Adapter", () => {
  it("processes the bundle and generates expected files", async () => {
    const bundlePath = path.join(__dirname, "test-recursica-bundle.json");
    expect(fs.existsSync(bundlePath)).toBe(true);

    const bundledJsonContent = fs.readFileSync(bundlePath, "utf-8");
    const bundledJson = JSON.parse(bundledJsonContent);

    // Basic sanity on the bundle
    expect(typeof bundledJson).toBe("object");

    const result = processAdapter({
      rootPath: "",
      bundledJsonContent,
      project: "Recursica",
      overrides: undefined,
      srcPath: testOutputPath,
      iconsJsonContent: undefined,
      iconsConfig: undefined,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Ensure we generate some key files
    const filenames = result.map((f) => f.filename);
    expect(filenames).toContain("recursica.css");
    expect(filenames).toContain("recursica.js");
    expect(filenames).toContain("recursica.d.ts");
    expect(filenames).toContain("recursica-tokens.css");
    expect(filenames.some((n) => n.endsWith("-theme.css"))).toBe(true);

    // Write files and optionally analyze for debugging
    for (const file of result) {
      const fullPath = path.join(testOutputPath, file.filename);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, file.content);
      analyzeFile(file);
    }

    // Verify some outputs exist on disk
    for (const required of [
      "recursica.css",
      "recursica.js",
      "recursica.d.ts",
      "recursica-tokens.css",
    ]) {
      expect(fs.existsSync(path.join(testOutputPath, required))).toBe(true);
    }

    // Optionally print samples when debugging locally
    if (process.env.DEBUG === "1") {
      listGeneratedFiles(testOutputPath);
    }
  });
});

function analyzeFile(file: { filename: string; content: string }) {
  const lines = file.content.split("\n").length;
  const size = file.content.length;

  console.log(`📄 ${file.filename}`);
  console.log(`   Size: ${size} bytes, Lines: ${lines}`);

  if (file.filename === "recursica-tokens.css") {
    const variableCount = (file.content.match(/--[^:]+:/g) || []).length;
    console.log(`   CSS Variables: ${variableCount}`);
  } else if (file.filename === "recursica.css") {
    const variableCount = (file.content.match(/--[^:]+:/g) || []).length;
    console.log(`   UI Kit Variables: ${variableCount}`);
  } else if (file.filename === "recursica.js") {
    const hasTokens = file.content.includes("tokens:");
    const hasUiKit = file.content.includes("uiKit:");
    const hasThemes = file.content.includes("themes:");
    console.log(
      `   JavaScript Object (tokens: ${hasTokens ? "✓" : "✗"}, uiKit: ${hasUiKit ? "✓" : "✗"}, themes: ${hasThemes ? "✓" : "✗"})`,
    );
  } else if (file.filename === "recursica.d.ts") {
    const typeCount = (file.content.match(/export type/g) || []).length;
    console.log(`   TypeScript Types (${typeCount} type definitions)`);
  } else if (file.filename.endsWith("-theme.css")) {
    const variableCount = (file.content.match(/--[^:]+:/g) || []).length;
    const themeName = file.filename.replace("-theme.css", "");
    console.log(`   Theme Variables: ${variableCount} (${themeName} theme)`);
  }
}

function listGeneratedFiles(outputPath: string) {
  const files = fs.readdirSync(outputPath);
  for (const file of files) {
    const filePath = path.join(outputPath, file);
    const stats = fs.statSync(filePath);
    console.log(`📄 ${file} (${stats.size} bytes)`);
  }
}
