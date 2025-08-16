import { describe, it, expect } from "vitest";
import { validateConfiguration } from "./validateConfiguration.js";

describe("validateConfiguration", () => {
  it("should validate a correct configuration object", () => {
    const validData = {
      project: "TestProject",
      jsonsPath: "recursica-json",
    };

    const result = validateConfiguration(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should validate configuration with project as object", () => {
    const validData = {
      project: {
        name: "TestProject",
        root: "packages/recursica-ui-kit",
        adapter: "packages/recursica-ui-kit/webworker.js",
      },
      jsonsPath: "recursica-json",
    };

    const result = validateConfiguration(validData);
    expect(result.isValid).toBe(true);
  });

  it("should reject data missing required project field", () => {
    const invalidData = {
      jsonsPath: "recursica-json",
      // Missing project
    };

    const result = validateConfiguration(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "root level: must have required property 'project'",
    );
  });

  it("should reject project name with invalid characters", () => {
    const invalidData = {
      project: "Test Project", // Contains space
      jsonsPath: "recursica-json",
    };

    const result = validateConfiguration(invalidData);
    expect(result.isValid).toBe(false);
    // Check for any pattern-related error
    expect(result.errors?.some((error) => error.includes("pattern"))).toBe(
      true,
    );
  });

  it("should validate configuration with icons configuration", () => {
    const validData = {
      project: "TestProject",
      jsonsPath: "recursica-json",
      icons: {
        output: "components/Icons",
        include: {
          names: ["icon1", "icon2"],
          variants: ["outline", "solid"],
        },
      },
    };

    const result = validateConfiguration(validData);
    expect(result.isValid).toBe(true);
  });

  it("should validate configuration with overrides", () => {
    const validData = {
      project: "TestProject",
      jsonsPath: "recursica-json",
      overrides: {
        mantineTheme: {
          "1-scale": "color-1-scale-default",
          background: "color/background/default",
        },
        fontWeight: [
          {
            fontFamily: "Inter",
            value: 450,
            alias: "55 Roman",
          },
        ],
      },
    };

    const result = validateConfiguration(validData);
    expect(result.isValid).toBe(true);
  });
});
