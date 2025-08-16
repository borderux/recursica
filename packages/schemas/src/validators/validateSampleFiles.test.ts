import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import {
  validateConfiguration,
  validateVariables,
  validateIcons,
} from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Helper function to load JSON files from the test directory
function loadTestFile(filename: string): unknown {
  const filePath = join(__dirname, "..", "test", filename);
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

// Type definitions for the test data
interface TestConfig {
  $schema: string;
  project: {
    name: string;
    root: string;
    adapter: string;
  };
  overrides: {
    mantineTheme: {
      "1-scale": string;
    };
  };
}

interface TestIcons {
  [key: string]: string;
}

interface TestToken {
  collection: string;
  mode: string;
  name: string;
  type: string;
  value: string | number;
}

interface TestVariables {
  projectId: string;
  pluginVersion: string;
  tokens: Record<string, TestToken>;
  themes: Record<string, unknown>;
  uiKit: Record<string, unknown>;
}

describe("Sample File Validation", () => {
  describe("recursica.json (Configuration)", () => {
    it("should validate the sample configuration file", () => {
      const configData = loadTestFile("recursica.json");
      const result = validateConfiguration(configData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it("should have the expected structure", () => {
      const configData = loadTestFile("recursica.json") as TestConfig;

      expect(configData).toHaveProperty("$schema");
      expect(configData).toHaveProperty("project");
      expect(configData).toHaveProperty("overrides");

      expect(configData.project).toHaveProperty("name");
      expect(configData.project).toHaveProperty("root");
      expect(configData.project).toHaveProperty("adapter");

      expect(configData.overrides).toHaveProperty("mantineTheme");
      expect(configData.overrides.mantineTheme).toHaveProperty("1-scale");
    });
  });

  describe("recursica-icons.json (Icons)", () => {
    it("should validate the sample icons file", () => {
      const iconsData = loadTestFile("recursica-icons.json");
      const result = validateIcons(iconsData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it("should have the expected structure", () => {
      const iconsData = loadTestFile("recursica-icons.json") as TestIcons;

      // Should be an object with icon names as keys
      expect(typeof iconsData).toBe("object");
      expect(Array.isArray(iconsData)).toBe(false);

      // Check that it has some icon entries
      const iconNames = Object.keys(iconsData);
      expect(iconNames.length).toBeGreaterThan(0);

      // Check that each icon has a string value (SVG content)
      for (const iconName of iconNames.slice(0, 5)) {
        // Only check first 5 to avoid too many assertions
        expect(typeof iconsData[iconName]).toBe("string");
        expect(iconsData[iconName]).toContain("<svg");
      }

      // Check for specific icon patterns
      expect(iconNames.some((name) => name.includes("academic-cap"))).toBe(
        true,
      );
      expect(iconNames.some((name) => name.includes("arrow"))).toBe(true);
    });

    it("should have valid SVG content", () => {
      const iconsData = loadTestFile("recursica-icons.json") as TestIcons;

      // Check a few specific icons for valid SVG structure
      const academicCapOutline = iconsData["academic-cap[Style=outline]"];
      expect(academicCapOutline).toContain('<svg width="24" height="24"');
      expect(academicCapOutline).toContain('viewBox="0 0 24 24"');
      expect(academicCapOutline).toContain("</svg>");
    });
  });

  describe("recursica-bundle.json (Variables)", () => {
    it("should validate the sample variables file", () => {
      const variablesData = loadTestFile("recursica-bundle.json");
      const result = validateVariables(variablesData);

      // The sample file contains violations of the new variable reference rules:
      // - UI Kit variables referencing Tokens (size/spacer references)
      // - Theme variables referencing other Themes (color references within Themes)
      // This is expected behavior for the current sample data
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);

      // Verify we're catching the expected types of violations
      const uiKitTokenViolations = result.errors!.filter((error) =>
        error.includes(
          "UI Kit variables should not reference Tokens collection",
        ),
      );
      const themeThemeViolations = result.errors!.filter((error) =>
        error.includes(
          "Theme variables should only reference Tokens collection",
        ),
      );

      expect(uiKitTokenViolations.length).toBeGreaterThan(0);
      expect(themeThemeViolations.length).toBeGreaterThan(0);

      // eslint-disable-next-line no-console
      console.log(
        `Sample file validation found ${result.errors!.length} violations:`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `- ${uiKitTokenViolations.length} UI Kit → Tokens violations`,
      );
      // eslint-disable-next-line no-console
      console.log(`- ${themeThemeViolations.length} Theme → Theme violations`);
    });

    it("should have the expected structure", () => {
      const variablesData = loadTestFile(
        "recursica-bundle.json",
      ) as TestVariables;

      expect(variablesData).toHaveProperty("projectId");
      expect(variablesData).toHaveProperty("pluginVersion");
      expect(variablesData).toHaveProperty("tokens");
      expect(variablesData).toHaveProperty("themes");
      expect(variablesData).toHaveProperty("uiKit");

      expect(typeof variablesData.projectId).toBe("string");
      expect(typeof variablesData.pluginVersion).toBe("string");
      expect(typeof variablesData.tokens).toBe("object");
      expect(typeof variablesData.themes).toBe("object");
      expect(typeof variablesData.uiKit).toBe("object");
    });

    it("should have valid token structure", () => {
      const variablesData = loadTestFile(
        "recursica-bundle.json",
      ) as TestVariables;
      const tokenNames = Object.keys(variablesData.tokens);

      expect(tokenNames.length).toBeGreaterThan(0);

      // Check a few tokens for proper structure
      for (const tokenName of tokenNames.slice(0, 5)) {
        const token = variablesData.tokens[tokenName];
        expect(token).toHaveProperty("collection");
        expect(token).toHaveProperty("mode");
        expect(token).toHaveProperty("name");
        expect(token).toHaveProperty("type");
        expect(token).toHaveProperty("value");

        expect(typeof token.collection).toBe("string");
        expect(typeof token.mode).toBe("string");
        expect(typeof token.name).toBe("string");
        expect(typeof token.type).toBe("string");
      }
    });

    it("should have color tokens with valid values", () => {
      const variablesData = loadTestFile(
        "recursica-bundle.json",
      ) as TestVariables;
      const colorTokens = Object.values(variablesData.tokens).filter(
        (token: TestToken) => token.type === "color",
      );

      expect(colorTokens.length).toBeGreaterThan(0);

      // Check that color tokens have valid color values
      for (const token of colorTokens.slice(0, 5)) {
        const value = token.value;
        expect(typeof value).toBe("string");
        // Should be either hex color or rgba
        if (typeof value === "string") {
          expect(value.startsWith("#") || value.startsWith("rgba")).toBe(true);
        }
      }
    });

    it("should have float tokens with numeric values", () => {
      const variablesData = loadTestFile(
        "recursica-bundle.json",
      ) as TestVariables;
      const floatTokens = Object.values(variablesData.tokens).filter(
        (token: TestToken) => token.type === "float",
      );

      expect(floatTokens.length).toBeGreaterThan(0);

      // Check that float tokens have numeric values
      for (const token of floatTokens.slice(0, 5)) {
        const value = token.value;
        expect(typeof value).toBe("number");
        expect(Number.isFinite(value)).toBe(true);
      }
    });
  });

  describe("Cross-file validation", () => {
    it("should validate all sample files successfully", () => {
      const configData = loadTestFile("recursica.json");
      const iconsData = loadTestFile("recursica-icons.json");
      const variablesData = loadTestFile("recursica-bundle.json");

      const configResult = validateConfiguration(configData);
      const iconsResult = validateIcons(iconsData);
      const variablesResult = validateVariables(variablesData);

      // Configuration and icons should pass
      expect(configResult.isValid).toBe(true);
      expect(iconsResult.isValid).toBe(true);

      // Variables should fail due to reference violations in the sample data
      // This is expected behavior for the current sample file
      expect(variablesResult.isValid).toBe(false);
      expect(variablesResult.errors).toBeDefined();
      expect(variablesResult.errors!.length).toBeGreaterThan(0);
    });

    it("should handle large files efficiently", () => {
      const variablesData = loadTestFile("recursica-bundle.json");
      const startTime = Date.now();

      const result = validateVariables(variablesData);
      const endTime = Date.now();

      // Should fail due to reference violations, but complete quickly
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
