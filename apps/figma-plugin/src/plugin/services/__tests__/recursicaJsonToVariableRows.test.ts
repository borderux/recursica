import { recursicaJsonToVariableRows } from "../recursicaJsonToVariableRows";
import { describe, it, expect } from "vitest";

describe("recursicaJsonToVariableRows", () => {
  it("should process shadow type in brand themes and emit a warning", () => {
    const tokens = {};
    const brand = {
      themes: {
        light: {
          elevations: {
            "elevation-0": {
              $type: "shadow",
              $value: {
                x: { $value: { value: 0, unit: "px" }, $type: "number" },
                y: { $value: { value: 0, unit: "px" }, $type: "number" },
                blur: { $value: { value: 0, unit: "px" }, $type: "number" },
                spread: { $value: { value: 0, unit: "px" }, $type: "number" },
                color: { $value: "#000000", $type: "color" },
              },
            },
          },
        },
      },
    };
    const uiKit = {};

    const result = recursicaJsonToVariableRows(tokens, brand, uiKit);

    // Check that the variable row was created correctly
    const shadowRow = result.rows.find(
      (r) =>
        r.collection === "themes" &&
        r.figmaVariableName === "elevations/elevation-0",
    );
    expect(shadowRow).toBeDefined();
    expect(shadowRow?.type).toBe("STRING");

    // Check for deprecation warning
    expect(result.warnings).toContain(
      "[brand.themes] Shadow type is deprecated and should be updated to elevation or boxShadow at path: brand.themes.light.elevations.elevation-0",
    );
  });

  it("should skip ui-kit tokens with recursica.component extension", () => {
    const tokens = {};
    const brand = { themes: { light: {} } };
    const uiKit = {
      "ui-kit": {
        components: {
          pagination: {
            properties: {
              "active-pages": {
                $value: "{ui-kit.components.button}",
                $extensions: {
                  "recursica.component": {
                    "selected-variants": {
                      style: "{ui-kit.components.button.variants.styles.solid}",
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const result = recursicaJsonToVariableRows(tokens, brand, uiKit);

    // The active-pages variable should be skipped entirely
    const row = result.rows.find((r) =>
      r.figmaVariableName.includes("active-pages"),
    );
    expect(row).toBeUndefined();
    expect(result.errors).toHaveLength(0);
  });
});
