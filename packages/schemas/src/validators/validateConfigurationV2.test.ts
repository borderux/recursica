import { describe, it, expect } from "vitest";
import { validateConfigurationV2 } from "./validateConfigurationV2.js";

describe("validateConfigurationV2", () => {
  it("should validate a correct V2 configuration object with a single project", () => {
    const validData = {
      version: 2,
      config: {
        project: {
          name: "My App",
          path: "./my-app",
        },
      },
    };

    const result = validateConfigurationV2(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should validate a correct V2 configuration object with multiple projects", () => {
    const validData = {
      version: 2,
      config: {
        projects: [
          {
            name: "My App",
            path: "./my-app",
          },
          {
            name: "Other App",
            path: "./other-app",
          },
        ],
      },
    };

    const result = validateConfigurationV2(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should validate a configuration with only version (config is optional)", () => {
    const validData = {
      version: 2,
    };

    const result = validateConfigurationV2(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should reject config without project or projects", () => {
    const invalidData = {
      version: 2,
      config: {},
    };

    const result = validateConfigurationV2(invalidData);
    expect(result.isValid).toBe(false);
  });

  it("should reject project missing required fields", () => {
    const invalidData = {
      version: 2,
      config: {
        project: {
          name: "My App",
          // missing path
        },
      },
    };

    const result = validateConfigurationV2(invalidData);
    expect(result.isValid).toBe(false);
  });

  it("should reject data missing version 2", () => {
    const invalidData = {
      // Missing version
      config: {
        project: {
          name: "My App",
          path: "./my-app",
        },
      },
    };

    const result = validateConfigurationV2(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "root level: must have required property 'version'",
    );
  });
});
