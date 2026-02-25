# Recursica JSON Spec

This document describes the JSON structure of Recursica design token files and their alignment with the [Design Tokens Community Group (DTCG) Format Module](https://www.designtokens.org/TR/2025.10/format/) (e.g. 2025.10).

## Reference

- **DTCG Format Module**: [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/)
- **Recursica export files**: `recursica_tokens.json`, `recursica_brand.json`, `recursica_ui-kit.json`
- **Schemas** (for validation): `tokens.schema.json`, `brand.schema.json`, `uikit.schema.json`

---

## 1. DTCG fundamentals

### Token vs group

- **Token**: Any JSON object that has a **`$value`** property. The object's key is the token name; `$value` holds the value (literal or reference).
- **Group**: Any JSON object that does **not** have a `$value` property. Groups contain nested groups and/or tokens. They provide hierarchy only; tools must not infer type or purpose from group names.

So: **presence of `$value` ⇒ token; absence ⇒ group.**

### Reserved properties (DTCG)

| Property           | Applies to   | Purpose                                                                                 |
| ------------------ | ------------ | --------------------------------------------------------------------------------------- |
| **`$value`**       | Token        | Required. The token's value (literal or alias).                                         |
| **`$type`**        | Token, Group | Optional. Token type (e.g. `color`, `dimension`, `number`) or default type for a group. |
| **`$description`** | Token, Group | Optional. Plain string description.                                                     |
| **`$extensions`**  | Token, Group | Optional. Vendor-/tool-specific data. Must be preserved by other tools.                 |
| **`$deprecated`**  | Token, Group | Optional. `true`, `false`, or string explanation.                                       |
| **`$extends`**     | Group        | Optional. Inherit from another group (reference syntax).                                |

All other keys (e.g. `alias` on color scale groups) are non-reserved and treated as group/token names or custom metadata.

### Naming rules (DTCG)

- Token and group **names** (object keys) must **not** start with `$`.
- Names must **not** contain `{`, `}`, or `.` (period).  
  (Dots are used only in **paths** when referencing, e.g. `{brand.palettes.neutral.050}`.)
- Names are case-sensitive.

### References (aliases)

- **Curly-brace syntax**: `"{path.to.token}"` — a string value that references another token by path. The path is built from group and token names joined by `.`. References resolve to the referenced token's `$value`; resolution must follow the spec (e.g. no circular references).
- **Target**: Curly-brace references target **whole tokens** (objects with `$value`), not individual properties inside a value.
- **Recursica**: Uses this form for token-to-token references across all three files, e.g. `"{brand.palettes.neutral.000.color.tone}"`, `"{tokens.size.3x}"`, `"{brand.layers.layer-0.elements.interactive.tone}"`.

---

## 2. Color type: allowed formats

Tokens with `"$type": "color"` (in any of the three files) must use a `$value` in one of the following formats. Recursica normalizes these to a single internal representation (e.g. for Figma: RGBA in 0–1).

| Format               | `$value` example                                             | Notes                                                                                         |
| -------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **Hex 6-digit**      | `"#73ceda"`                                                  | sRGB, alpha = 1. Case-insensitive.                                                            |
| **Hex 8-digit**      | `"#73ceda80"`                                                | sRGB; last two digits = alpha (00–ff → 0–1).                                                  |
| **rgb()**            | `"rgb(115, 206, 218)"`                                       | Red, green, blue in 0–255; alpha = 1. Spaces optional.                                        |
| **rgba()**           | `"rgba(0, 0, 0, 0.14)"`                                      | Red, green, blue in 0–255; alpha in 0–1.                                                      |
| **DTCG sRGB object** | `{ "colorSpace": "srgb", "components": [0.45, 0.81, 0.86] }` | Components in 0–1. Optional `"alpha"` (0–1). `colorSpace` may be `"srgb"` or `"srgb-linear"`. |

All of the above are valid in `recursica_tokens.json`, `recursica_brand.json`, and `recursica_ui-kit.json`. Color references (e.g. `"{tokens.colors.scale-01.100}"`) resolve to the referenced token’s `$value`, which must be in one of these formats.

Other DTCG color spaces (HSL, LCH, etc.) are not part of the Recursica allowed set for validation or import; only the formats above are supported.

**Schemas:** `tokens.schema.json` validates color `$value` explicitly via `$defs/colorValue` (oneOf the formats above). In `brand.schema.json` and `uikit.schema.json`, color-bearing fields may allow any string (so that reference strings like `"{path.to.token}"` are accepted); when the value is a literal color (not a reference), it must still be in one of the formats above.

### 2.1 Dimension type: allowed units

Tokens with `"$type": "dimension"` have a `$value` object: `{ "value": <number>, "unit": "<unit>" }`. Per the [DTCG Format Module § 8.2](https://www.designtokens.org/TR/2025.10/format/), the only **allowed unit values** are:

| Unit      | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| **`px`**  | Idealized pixel (viewport). Equivalent to Android `dp`, iOS `pt`.   |
| **`rem`** | Multiple of the root (default) font size. 1rem = 100% of that size. |

Recursica JSON and schemas restrict dimension `unit` to these two values. Other units (e.g. `em`, `%`) are not valid for the dimension type in this format.

**rem and base font size:** The DTCG spec does not define a base font size for rem; it says the system’s default “MAY be configurable by the user” and that translation tools “MAY … assume a default font size (usually 16px)” when converting to a fixed size. Recursica does not store a base in the token files. For outputs that need px (e.g. Figma variables, which use numeric values), Recursica uses a **default rem base of 16px**: `px = value * 16` when `unit` is `"rem"`. This can be overridden by tool or config (e.g. a future `remBasePx` in config) if needed.

### 2.2 Color scale alias

Under `tokens.colors`, each scale group (e.g. `scale-01`, `scale-02`) **may** include a non-reserved **`alias`** property: a string that gives a human-readable name for the scale. The canonical key is the scale id (e.g. `scale-01`); the alias is metadata for display or tooling and does not change the token path.

| Scale key  | Example alias  |
| ---------- | -------------- |
| `scale-01` | `"cornflower"` |
| `scale-02` | `"gray"`       |
| `scale-03` | `"greensheen"` |
| …          | …              |

Paths and references use the scale key (e.g. `tokens.colors.scale-01.100`), not the alias. Tools may use the alias for UI labels, documentation, or mapping to legacy names.

---

## 3. File roles and top-level structure

| File                      | Root key | Role                                                                                                                                                     |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **recursica_tokens.json** | `tokens` | Primitive design tokens: color scales, sizes, font, opacities. No theme or layer.                                                                        |
| **recursica_brand.json**  | `brand`  | Theme-aware brand: themes (e.g. light/dark), layers, palettes, dimensions, elevations, states, text-emphasis. References `tokens.*` and `brand.*` paths. |
| **recursica_ui-kit.json** | `ui-kit` | Component-level design: globals (form, icon, etc.) and per-component properties/variants. References `brand.*` and `tokens.*`.                           |

All three are valid JSON and follow the same token/group, reference, and color-format rules above.

---

## 4. recursica_tokens.json (`tokens`)

- **Groups**: e.g. `colors`, `font`, `sizes`, `opacities`; under `colors`, scale groups like `scale-01`, `scale-02`, etc.
- **Tokens**: Objects with `$type` and `$value`.
- **Types used**: `color`, `dimension`, `number`, `string`, `fontFamily`.
- **Typical patterns**:
  - Color: `"$type": "color", "$value": "<allowed color format>"`. See [§ 2. Color type: allowed formats](#2-color-type-allowed-formats).
  - Dimension: `"$type": "dimension", "$value": { "value": 8, "unit": "px" }`.
  - Font family: `"$type": "fontFamily", "$value": ["Lexend", "sans-serif"]` with optional `$extensions` (e.g. `com.google.fonts`).
- **Color scale alias**: Each scale group under `tokens.colors` may have an `alias` (e.g. `"alias": "cornflower"`). See [§ 2.2 Color scale alias](#22-color-scale-alias).

This file has no theme or layer structure; it is the shared primitive token set.

---

## 5. recursica_brand.json (`brand`)

- **Main groups**: `themes`, and under each theme (e.g. `light`, `dark`): `layers` (e.g. `layer-0`, `layer-1`), `palettes`, `elevations`, `states`, `text-emphasis`, `dimensions` (at theme or brand level as per schema), etc.
- **Tokens**: Any object with `$value` is a token. Values are often references:
  - To tokens: `"{tokens.size.3x}"`, `"{tokens.opacity.ghost}"`.
  - To brand: `"{brand.palettes.neutral.000.color.tone}"`, `"{brand.layers.layer-0.elements.interactive.tone}"`, `"{brand.elevations.elevation-0}"`.
- **Types used**: `color`, `number`, `dimension`, `elevation` (composite), and composite values (e.g. dimension with `value` + `unit`, where `value` can be a reference string like `"{tokens.size.2x}"`).
- **Palettes**: Nested structure (e.g. `palettes.neutral.050.color.tone` / `on-tone`); each leaf that has `$value` is a token. References use full path, e.g. `"{brand.palettes.core-colors.interactive.default.tone}"`.

This file is theme- and layer-aware; references use paths that include theme and layer where applicable.

---

## 6. recursica_ui-kit.json (`ui-kit`)

- **Groups**: `globals` (e.g. `form`, `icon`), `components` (e.g. `button`, `text-field`). Under components: `variants` (e.g. `styles`, `sizes`), `properties`, and nested groups (e.g. `colors`, `size` by layer or variant).
- **Tokens**: Any object with `$value` is a token. Values typically reference brand or tokens, e.g. `"{brand.layers.layer-0.elements.interactive.tone}"`, `"{brand.dimensions.general.default}"`, `"{brand.palettes.neutral.000.color.tone}"`.
- **Types used**: `color`, `dimension`, `number`, `string`. Dimension values may be `{ "value": "{...}", "unit": "px" }` with a reference inside `value`.
- **Component structure**: Layer- and variant-specific tokens live under paths like `components.button.variants.styles.solid.properties.colors.layer-0.background`.

This file defines component-level design tokens; references point at `brand.*` and `tokens.*`.

---

## 7. Summary table (DTCG alignment)

| Aspect              | DTCG (Format 2025.10)                                                       | Recursica                                               |
| ------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| Token definition    | Object with `$value`                                                        | Same                                                    |
| Group definition    | Object without `$value`                                                     | Same                                                    |
| Reserved properties | `$value`, `$type`, `$description`, `$extensions`, `$deprecated`, `$extends` | Same; all others (e.g. `alias`) are custom              |
| Name restrictions   | No `$`, `{`, `}`, `.` in names                                              | Same (dots only in paths)                               |
| References          | Curly-brace `{path.to.token}`; target whole tokens                          | Same; used in all three files                           |
| Type inheritance    | Optional `$type` on group; token can inherit                                | Used where applicable (e.g. font group `$type`)         |
| Extensions          | `$extensions` for vendor/tool data                                          | Used (e.g. `com.google.fonts` in recursica_tokens.json) |

Recursica's JSON structure is compatible with the DTCG Format Module: tokens and groups are distinguished by `$value`, naming and reserved properties follow the spec, and references use the specified curly-brace syntax targeting whole tokens. The three files split responsibilities (primitives, brand/theme/layer, component design) while sharing the same token/group and reference rules.
