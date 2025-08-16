import { describe, it, expect } from "vitest";
import type { ErrorObject } from "ajv";
import { formatValidationErrors } from "./errorFormatter.js";

describe("Error Formatter", () => {
  it("should format root level errors", () => {
    const errors: ErrorObject[] = [
      {
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "projectId" },
        message: "must have required property 'projectId'",
      },
    ];

    const formatted = formatValidationErrors(errors);
    expect(formatted).toEqual([
      "root level: must have required property 'projectId'",
    ]);
  });

  it("should format nested property errors", () => {
    const errors: ErrorObject[] = [
      {
        keyword: "required",
        instancePath: "/tokens/color/primary",
        schemaPath:
          "#/properties/tokens/properties/color/properties/primary/required",
        params: { missingProperty: "value" },
        message: "must have required property 'value'",
      },
    ];

    const formatted = formatValidationErrors(errors);
    expect(formatted).toEqual([
      "tokens.color.primary: must have required property 'value'",
    ]);
  });

  it("should format array index errors", () => {
    const errors: ErrorObject[] = [
      {
        keyword: "type",
        instancePath: "/overrides/fontWeight/0",
        schemaPath: "#/properties/overrides/properties/fontWeight/items/type",
        params: { type: "object" },
        message: "must be object",
      },
    ];

    const formatted = formatValidationErrors(errors);
    expect(formatted).toEqual(["overrides.fontWeight.[0]: must be object"]);
  });

  it("should format multiple errors", () => {
    const errors: ErrorObject[] = [
      {
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "projectId" },
        message: "must have required property 'projectId'",
      },
      {
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "pluginVersion" },
        message: "must have required property 'pluginVersion'",
      },
    ];

    const formatted = formatValidationErrors(errors);
    expect(formatted).toEqual([
      "root level: must have required property 'projectId'",
      "root level: must have required property 'pluginVersion'",
    ]);
  });

  it("should handle empty errors array", () => {
    const formatted = formatValidationErrors([]);
    expect(formatted).toEqual([]);
  });

  it("should handle null errors", () => {
    const formatted = formatValidationErrors(null);
    expect(formatted).toEqual([]);
  });

  it("should handle undefined errors", () => {
    const formatted = formatValidationErrors(undefined);
    expect(formatted).toEqual([]);
  });

  it("should format complex nested paths", () => {
    const errors: ErrorObject[] = [
      {
        keyword: "pattern",
        instancePath: "/themes/light/colors/primary/0/value",
        schemaPath:
          "#/properties/themes/properties/light/properties/colors/items/properties/value/pattern",
        params: { pattern: "^#[0-9a-fA-F]{6}$" },
        message: 'must match pattern "^#[0-9a-fA-F]{6}$"',
      },
    ];

    const formatted = formatValidationErrors(errors);
    expect(formatted).toEqual([
      'themes.light.colors.primary.[0].value: must match pattern "^#[0-9a-fA-F]{6}$"',
    ]);
  });
});
