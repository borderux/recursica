# Effect Styles Import (elevations)

## Overview

When we import variables from FigmaVariables.csv, we also create **Figma Effect Styles** from elevations in the Themes collection. Elevation variables (e.g. `elevations/elevation-0`, `elevations/elevation-1`) are the source. This step runs **at the end of the variable import**, after variables and text styles, and only when the Themes collection exists and contains variables whose names start with `elevations/`.

Figma uses **Effect Styles** for shadows. We create one Effect style per elevation name so designers can apply them to layers. We bind the style to the elevation variable when the API allows it, so theme mode changes can drive the effect.

## When It Runs

- After variable import and text style creation.
- Only when the Themes collection exists and has variables whose names start with `elevations/`.

## Source of Data

- **Themes** collection variables whose `name` matches `elevations/<elevationName>`.
- Examples: `elevations/elevation-0`, `elevations/elevation-1`.
- Each variable has one value per theme mode (e.g. Light, Dark). The value is a STRING (JSON) describing the shadow: `x`, `y`, `blur`, `spread`, `color` (ref), `opacity`.

## Check Before Create

- Call `figma.getLocalEffectStylesAsync()`.
- For each elevation variable (e.g. `elevations/elevation-0`), the style name is the suffix (e.g. `elevation-0`).
- If an Effect style with that **name** already exists: **skip** creation (do not overwrite). So if the same elevation name appears for multiple theme modes, we create the style only once (first one processed wins).

## Creation Steps (per elevation)

1. Resolve the variable’s value for the first mode (e.g. Light) — it is a JSON string.
2. Parse the JSON to get `x`, `y`, `blur`, `spread`, `opacity`, and optional `color` ref.
3. Resolve the color ref to an RGB value if possible (otherwise use a fallback).
4. Build a Figma `DROP_SHADOW` effect and set `style.effects = [effect]`.
5. Optionally call `style.setBoundVariable("effects", variable)` so the style is bound to the elevation variable (if the API supports it for this variable type).

## Naming

- Effect style **name** = elevation name from the variable path: e.g. variable `elevations/elevation-0` → style name `elevation-0`.

## Result / Reporting

- Return: **effectStylesCreated**, **effectStylesSkipped** (already existed), **effectStyleWarnings** (parse errors, missing mode, etc.).
- Do not fail the overall import if effect style creation fails for one elevation; log and continue.
