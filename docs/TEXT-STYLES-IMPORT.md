# Text Styles Import

## Overview

When we import variables (from FigmaVariables.csv or from Recursica JSON), we also create **Figma Text Styles** from typography variables in the Themes collection. This step runs **at the end of the variable import**, after all variables (including typography sub-properties) have been created and aliases resolved.

Figma does not bind text layers to typography _variables_; it uses **Text Styles**. So we create local Text Styles that match our typography tokens, so designers can apply them to text layers.

## Sources of typography variables (Themes collection)

We create typography variables (and thus Text Styles) from two sources:

1. **recursica_brand.json** — `brand.themes.<mode>.typography` (e.g. `typography/h1/font-family`, `typography/body/font-size`). Each key under `brand.typography` becomes a style name.
2. **recursica_ui-kit.json** — Component-level typography blocks. We traverse the ui-kit JSON and, whenever we find an object that contains any of the typography property keys below, we treat that object as a typography style and emit variables `typography/<styleName>/<property>`. The style name is derived from the path to that object (see [Naming (ui-kit)](#naming-ui-kit)).

## When It Runs

- After all variable import (pass 1: create variables + set literals; pass 2: set aliases) is complete.
- Only when the Themes collection exists and contains variables whose names start with `typography/`.

## Source of Data

- **Themes** collection variables whose `name` matches `typography/<styleName>/<property>`.
- Examples: `typography/h1/font-family`, `typography/h1/font-size`, `typography/body/letter-spacing`.
- We group by _style name_ (e.g. `h1`, `body`). For each style we collect resolved values for each expected property.
- Variable values may be **aliases** (e.g. `typography/h1/font-family` → alias to `tokens/font/typefaces/primary`). We resolve alias chains to get the final literal (string, number, etc.) before applying to the Text Style.

## Check Before Create

- Call `figma.getLocalTextStylesAsync()`.
- For each typography style name (e.g. `h1`, `body`), check if a text style with that **name** already exists.
- If it exists: **skip** creation for that style (do not overwrite).
- If it does not exist: create the text style.

## Property List (Expected Keys)

We define a list of expected typography property keys. If a variable for that property is missing for a given style, we **warn** (do not fail).

| Key (our name)    | Figma TextStyle property | Notes                                                                      |
| ----------------- | ------------------------ | -------------------------------------------------------------------------- |
| `font-family`     | `fontName.family`        | Required for font; used with `font-style` for `fontName.style`.            |
| `font-style`      | `fontName.style`         | e.g. "normal" → "Regular", "italic" → "Italic".                            |
| `font-size`       | `fontSize`               | number (px).                                                               |
| `font-weight`     | (inferred for fontName)  | May map to style name (e.g. 700 → "Bold").                                 |
| `letter-spacing`  | `letterSpacing`          | Figma: `{ value: number, unit: "PIXELS" \| "PERCENT" }`.                   |
| `line-height`     | `lineHeight`             | Figma: `{ value: number, unit: "PIXELS" \| "PERCENT" \| "AUTO" }` or unit. |
| `text-case`       | `textCase`               | Figma: `NONE`, `UPPER`, `LOWER`, `TITLE`.                                  |
| `text-decoration` | `textDecoration`         | Figma: `NONE`, `UNDERLINE`, `STRIKETHROUGH`.                               |

- If `font-family` (or composite font) is missing: warn and skip creating that style (cannot create without font).
- For any other missing property: warn and omit that property on the created style (use Figma defaults where applicable).

## Creation Steps (per style)

1. Resolve **font** values from variables (font-family, font-style, font-weight) so we can load the font and set `fontName`.
2. **Load font**: `figma.loadFontAsync({ family: string, style: string })` — required before setting `fontName`.
3. Create: `figma.createTextStyle()`.
4. Set `name` = style name (e.g. `h1`, `body`).
5. Set `fontName` from resolved family + style.
6. **Bind variables** for `fontSize`, `letterSpacing`, `lineHeight`, `textCase`, `textDecoration` via `textStyle.setBoundVariable(field, variable)` so the style stays linked to the Themes variables (matches design files where these properties are bound).

## Naming (brand)

- Text style **name** = typography style key from the variable path: e.g. variable `typography/h1/font-size` → style name `h1`; `typography/body/font-family` → style name `body`.
- No prefix like `typography/` in the Figma style name unless we explicitly choose that later.

## Naming (ui-kit)

For ui-kit we derive the Text Style name from the **path to the parent object** that contains the typography keys. We:

1. Take the full path (e.g. `ui-kit.components.menu-item.properties.text`).
2. Remove the prefix `ui-kit.components.`
3. Remove the segment `.properties`
4. Remove the segment `.variants`

Result: e.g. `ui-kit.components.menu-item.properties.text` → `menu-item.text`; `ui-kit.components.avatar.variants.sizes.small.properties.text` → `avatar.sizes.small.text`. Because Figma variable names cannot contain periods (`.`), we replace `.` with `_` when building the variable name (and thus the Figma Text Style name); dashes are reserved in our names. E.g. `menu-item.text` → variable/style name `menu-item_text`, `avatar.sizes.small.text` → `avatar_sizes_small_text`.

## Typography keys (ui-kit detection and binding)

We detect a typography style object in ui-kit when it contains any of these keys:

- `font-family`, `font-size`, `font-weight`, `letter-spacing`, `line-height`, `font-style`, `text-decoration`, `text-transform`

For each such object we create one Figma Text Style. We bind only these properties to variables; any other Text Style property (e.g. paragraph spacing) is left at Figma default if not defined. In variable names we map `text-transform` → `text-case` (Figma uses `text-case`).

## API References

- `figma.getLocalTextStylesAsync()` — list existing text styles.
- `figma.createTextStyle()` — create a new local text style.
- `figma.loadFontAsync(fontName)` — load font before setting on a text style.
- TextStyle: `name`, `fontName`, `fontSize`, `letterSpacing`, `lineHeight`, `textCase`, `textDecoration`.

## Result / Reporting

- Return (or append to import result): **textStylesCreated**, **textStylesSkipped** (already existed), **textStyleWarnings** (missing properties, one entry per style+property or aggregated).
- Do not fail the overall import if text style creation fails for one style (e.g. font load failure); log and continue.
