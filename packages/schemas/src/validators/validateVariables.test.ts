import { describe, it, expect } from "vitest";
import { validateVariables } from "./validateVariables.js";

describe("validateVariables", () => {
  it("should validate a correct variables object", () => {
    const validData = {
      projectId: "test-project",
      pluginVersion: "1.0.0",
      tokens: {
        "color/primary": {
          collection: "Tokens",
          mode: "light",
          type: "color",
          name: "color/primary",
          value: "#007bff",
        },
      },
      themes: {
        light: {
          "theme/primary": {
            collection: "Themes",
            mode: "light",
            type: "color",
            name: "theme/primary",
            value: {
              collection: "Tokens",
              name: "color/primary",
            },
          },
        },
      },
      uiKit: {
        "button/primary": {
          collection: "UI Kit",
          mode: "light",
          type: "color",
          name: "button/primary",
          value: {
            collection: "Themes",
            name: "theme/primary",
          },
        },
      },
    };

    const result = validateVariables(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should reject data missing required fields", () => {
    const invalidData = {
      projectId: "test-project",
      // Missing pluginVersion, tokens, themes, uiKit
    };

    const result = validateVariables(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "root level: must have required property 'pluginVersion'",
    );
    expect(result.errors).toContain(
      "root level: must have required property 'tokens'",
    );
    expect(result.errors).toContain(
      "root level: must have required property 'themes'",
    );
    expect(result.errors).toContain(
      "root level: must have required property 'uiKit'",
    );
  });

  it("should reject data with invalid token structure", () => {
    const invalidData = {
      projectId: "test-project",
      pluginVersion: "1.0.0",
      tokens: {
        "color/primary": {
          // Missing required fields
          collection: "color",
          // Missing mode, type, name, value
        },
      },
      themes: {},
      uiKit: {},
    };

    const result = validateVariables(invalidData);
    expect(result.isValid).toBe(false);
    // Check for any required property errors
    expect(
      result.errors?.some((error) => error.includes("required property")),
    ).toBe(true);
  });

  it("should reject UI Kit variables that reference Tokens", () => {
    const invalidData = {
      projectId: "test-project",
      pluginVersion: "1.0.0",
      tokens: {
        "color/primary": {
          collection: "Tokens",
          mode: "light",
          type: "color",
          name: "color/primary",
          value: "#007bff",
        },
      },
      themes: {
        light: {
          "theme/primary": {
            collection: "Themes",
            mode: "light",
            type: "color",
            name: "theme/primary",
            value: {
              collection: "Tokens",
              name: "color/primary",
            },
          },
        },
      },
      uiKit: {
        "button/primary": {
          collection: "UI Kit",
          mode: "light",
          type: "color",
          name: "button/primary",
          value: {
            collection: "Tokens", // This should be Themes
            name: "color/primary",
          },
        },
      },
    };

    const result = validateVariables(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'uiKit.button/primary: UI Kit variables should not reference Tokens collection, found reference to "color/primary"',
    );
  });

  it("should reject Theme variables that reference other Themes", () => {
    const invalidData = {
      projectId: "test-project",
      pluginVersion: "1.0.0",
      tokens: {
        "color/primary": {
          collection: "Tokens",
          mode: "light",
          type: "color",
          name: "color/primary",
          value: "#007bff",
        },
      },
      themes: {
        light: {
          "theme/primary": {
            collection: "Themes",
            mode: "light",
            type: "color",
            name: "theme/primary",
            value: {
              collection: "Tokens",
              name: "color/primary",
            },
          },
          "theme/secondary": {
            collection: "Themes",
            mode: "light",
            type: "color",
            name: "theme/secondary",
            value: {
              collection: "Themes", // This should be Tokens
              name: "theme/primary",
            },
          },
        },
      },
      uiKit: {
        "button/primary": {
          collection: "UI Kit",
          mode: "light",
          type: "color",
          name: "button/primary",
          value: {
            collection: "Themes",
            name: "theme/primary",
          },
        },
      },
    };

    const result = validateVariables(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'themes.light.theme/secondary: Theme variables should only reference Tokens collection, found reference to "theme/primary" in Themes collection',
    );
  });

  it("should validate font family tokens", () => {
    const validData = {
      projectId: "test-project",
      pluginVersion: "1.0.0",
      tokens: {
        "font/family/primary": {
          collection: "Tokens",
          mode: "light",
          type: "fontFamily",
          name: "font/family/primary",
          value: "Inter",
        },
      },
      themes: {},
      uiKit: {},
    };

    const result = validateVariables(validData);
    expect(result.isValid).toBe(true);
  });

  it("should validate effect tokens", () => {
    const validData = {
      projectId: "test-project",
      pluginVersion: "1.0.0",
      tokens: {
        "effect/shadow/primary": {
          collection: "Tokens",
          mode: "light",
          type: "effect",
          name: "effect/shadow/primary",
          value: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        },
      },
      themes: {},
      uiKit: {},
    };

    const result = validateVariables(validData);
    expect(result.isValid).toBe(true);
  });
});
