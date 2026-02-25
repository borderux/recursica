# Tokens → Figma Variable Import Plan

This document tracks the design and implementation of converting Recursica JSON (starting with `recursica_tokens.json`) into structures that the Figma plugin API can use to create and update variables.

## Goal

A function that converts our JSON into a **FigmaVariable** structure (TypeScript) that can be passed directly into the Figma plugin API to create variables. The type should make the contract with the API explicit.

## Pipeline (current)

```
recursica_tokens.json
    → flatten / walk (collect path, $type, $value)
    → map path → Figma variable name (strip "tokens", dots → slashes)
    → map $type + $value → Figma type + API-ready value
    → FigmaVariable[] (or TokensVariableBatch)
    → plugin: for each → createVariable(name, collection, resolvedType) + setValueForMode(modeId, value)
```

## Decisions

| Topic                   | Decision                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Figma variable name** | Strip leading `tokens/` segment. Path below `tokens` with dots → slashes. Example: `tokens.colors.scale-01.100` → `colors/scale-01/100`. |
| **Collection**          | Tokens collection (single collection for tokens file). One mode (e.g. "Default" or "Mode 1") for now.                                    |
| **Type mapping**        | `color` → COLOR (hex → RGBA 0–1). `dimension` → FLOAT (use numeric part). `number` → FLOAT. `string` / fontFamily / empty → STRING.      |
| **Dimension**           | Store as FLOAT (numeric value); unit (e.g. px) is convention.                                                                            |
| **References**          | Tokens file has no `"{...}"` references; literals only. Brand/UI Kit will need alias resolution later.                                   |

## Color conversion

Figma accepts a single color format for variables: **RGBA with `r`, `g`, `b`, `a` in the 0–1 range** (see VariableValue for COLOR). We normalize all Recursica/DTCG color values to this format before calling `setValueForMode`.

### Supported input formats (Recursica JSON / DTCG)

| Format                 | Example                                                      | Notes                                                                  |
| ---------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Hex 6-digit**        | `"#73ceda"`                                                  | sRGB, alpha = 1. Common in Recursica tokens schema.                    |
| **Hex 8-digit**        | `"#73ceda80"`                                                | Last two digits = alpha (0–255 → 0–1).                                 |
| **rgb() string**       | `"rgb(115, 206, 218)"`                                       | r,g,b in 0–255; alpha = 1.                                             |
| **rgba() string**      | `"rgba(0, 0, 0, 0.14)"`                                      | r,g,b in 0–255, a in 0–1. Used in old bundle.                          |
| **DTCG object (sRGB)** | `{ "colorSpace": "srgb", "components": [0.45, 0.81, 0.86] }` | Components in 0–1; optional `alpha` in 0–1. DTCG Color Module 2025.10. |

Other DTCG color spaces (HSL, LCH, etc.) are not normalized in the first version; we can add conversion (e.g. HSL → sRGB) later if needed. For now, only the formats above are supported.

### Output

Single type: **FigmaRGBA** `{ r, g, b, a? }` with all values in **0–1**. Omit `a` only when alpha is 1 (Figma accepts both).

### Implementation

- **[apps/figma-plugin/src/plugin/import/colorToFigmaRgba.ts](apps/figma-plugin/src/plugin/import/colorToFigmaRgba.ts)** – `colorToFigmaRgba(value: unknown): FigmaRGBA` plus parse helpers. Throws on unsupported format.

## Type conversion (non-color)

Figma variables support only **COLOR**, **FLOAT**, **STRING**, **BOOLEAN**. The remaining Recursica token types in `recursica_tokens.json` map as follows.

| JSON `$type`                         | Value shape (sample)                           | Figma type | Conversion                                                                                                       |
| ------------------------------------ | ---------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| **dimension**                        | `{ "value": 10, "unit": "px" }`                | FLOAT      | Use the numeric `value`. Unit (e.g. px) is convention; not stored in the variable.                               |
| **number**                           | `100`, `0.1`, `-0.05`, `1`                     | FLOAT      | Use as-is. Covers font weights (100–900), letter-spacing, line-height, opacities.                                |
| **string**                           | `"uppercase"`, `"normal"`, `null`              | STRING     | Use string as-is. For `null`: use empty string `""` (Figma STRING allows it).                                    |
| **fontFamily** or (missing on token) | `["Lexend", "sans-serif"]` or `"Bellota Text"` | STRING     | If array: join with `", "` (e.g. `"Lexend, sans-serif"`). If string: use as-is. Figma has no font variable type. |

- **dimension**: 22 tokens (font sizes 2xs–6xl, sizes none/0-5x/default/2x–6x). All numeric values; unit is always px in the sample.
- **number**: 25 tokens (weights, letter-spacings, line-heights, opacities). Integers and decimals.
- **string**: 12 tokens (cases original/uppercase/titlecase, decorations none/underline/strikethrough, styles normal/italic). Some values are `null`.
- **fontFamily / typefaces**: 3 tokens (primary, secondary, tertiary). Value is either array of strings or single string.

No BOOLEAN tokens in the current tokens file; if added later, map JSON boolean → Figma BOOLEAN.

## Figma API contract (reference)

- **createVariable**(name: string, collection: VariableCollection, resolvedType: VariableResolvedDataType): Variable
- **setValueForMode**(modeId: string, value: VariableValue): void
- **VariableResolvedDataType** = `"BOOLEAN" | "COLOR" | "FLOAT" | "STRING"`
- **VariableValue** (for setValueForMode):
  - COLOR → `{ r, g, b, a? }` (0–1)
  - FLOAT → number
  - STRING → string
  - BOOLEAN → boolean
  - Or VariableAlias for references

## Type definitions

The canonical TypeScript types live in the figma-plugin codebase so the plugin and any pre-processing (e.g. Node script or future converter) can share the same contract:

- **[apps/figma-plugin/src/plugin/import/figmaVariableTypes.ts](apps/figma-plugin/src/plugin/import/figmaVariableTypes.ts)** – `FigmaVariable`, `FigmaVariableValue`, `FigmaRGBA`, `FigmaVariableResolvedType`, `FigmaVariableBatch`, and `isFigmaRGBA` guard. Re-exported from `apps/figma-plugin/src/plugin/import/index.ts`.

## Test scripts: FigmaVariable → CSV

Tests can round-trip or compare by converting Figma variable data to the same CSV shape as the tokens CSV.

- **Column names**: `figmaVariableName`, `mode`, `value`, `resolvedType`
- **One row per (variable, mode)**. Value: primitives as string; COLOR as hex (RGBA 0–1 → hex for output).
- **Plugin**: `figmaVariablesToCsv(variables: FigmaVariable[])` in [apps/figma-plugin/src/plugin/import/figmaVariablesToCsv.ts](apps/figma-plugin/src/plugin/import/figmaVariablesToCsv.ts) — use in plugin or Node tests that import the package.
- **Standalone script**: [apps/recursica-publisher/recursica-sample/figma-variables-to-csv.js](apps/recursica-publisher/recursica-sample/figma-variables-to-csv.js) — reads a JSON file (array of FigmaVariable or `{ variables: FigmaVariable[] }`) and writes `<name>.csv`.  
  `node figma-variables-to-csv.js [path/to/figma-variables.json]`

## Implementation status

- [x] Plan doc and type definitions
- [x] FigmaVariable → CSV (figmaVariablesToCsv + standalone script)
- [x] Color conversion (colorToFigmaRgba: hex, rgb/rgba strings, DTCG sRGB → Figma RGBA 0–1)
- [ ] JSON → FigmaVariable[] converter (tokens only)
- [ ] Dimension/number/string value normalization
- [ ] Plugin handler: createVariable + setValueForMode from FigmaVariable[]
- [ ] Integration: fetch JSON → convert → send to plugin → apply

## Open questions

- Mode name: use "Default" or match existing Tokens file mode (e.g. "Mode 1")?
- Where does the converter run: in the plugin (main thread) vs. in the UI (then postMessage payload)? If UI, we send FigmaVariable[] to the plugin; if plugin, we send raw JSON and convert in the plugin.
