/**
 * Converts recursica tokens, brand, and ui-kit JSON files to Figma collection CSVs.
 * All 3 JSON files are required. Output: Tokens.csv, Themes.csv, Layer.csv, FigmaVariables.csv (combined, with collection column).
 *
 * Process order: tokens → brand → ui-kit (later files can reference earlier or same collection).
 *
 * References follow DTCG: they must target tokens (objects with $value), not groups. Invalid
 * references are reported as errors. Work-arounds (applied when strict resolution would fail)
 * are recorded as warnings:
 * - Current-theme context: brand refs without a theme in the path are resolved in the current
 *   theme being parsed (e.g. parsing brand.themes.light uses the light theme set).
 * - Color group .tone / .on-tone: if the path points to a group, resolve to .tone or .on-tone; when the referrer path ends in "on-tone", prefer .on-tone.
 * - core-black / core-white: brand.palettes.core-black → palettes.core-colors.black, same for core-white; then resolve to .tone or .on-tone by referrer context.
 * - Palette step → .color.tone: refs like brand.palettes.neutral.200 (palette step group) resolve to .color.tone or .color.on-tone by referrer context.
 * - One-level indirection: refs like brand.palettes.palette-1.default.color.tone resolve by following the "default" token's reference (e.g. to palette-1.600) then appending the rest of the path; DTCG does not define this pattern.
 * - tokens.size → tokens.sizes, tokens.opacity → tokens.opacities: if the tokens path starts with the old segment and is not found, try the renamed segment.
 * At the end the script lists errors (numbered) then warnings (numbered). Parsing continues
 * so as much CSV as possible is written.
 *
 * Tokens: path prefix "tokens/". Types: color, dimension (px; rem throws), number, fontFamily, string.
 * Themes: from brand.themes; each row has figmaVariableName, mode, value, type, alias, defaultMode.
 * Layer (ui-kit): 4 modes 0, 1, 2, 3 (default 0); each variable emitted once per mode with defaultMode column.
 * When alias=true, value is stored in Figma path form (collection/path/with/slashes).
 *
 * FigmaVariables.csv: collection (tokens|themes|layer), figmaVariableName, mode, value, type, alias, defaultMode; tokens use empty mode and defaultMode true.
 *
 * Usage: node tokens-to-csv.js [<tokensPath> <brandPath> <uiKitPath>]
 *        Or: node tokens-to-csv.js <dir>  (uses <dir>/recursica_tokens.json, recursica_brand.json, recursica_ui-kit.json)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOKENS_PREFIX = "tokens/";
const FIGMA_TYPE_COLOR = "COLOR";
const FIGMA_TYPE_FLOAT = "FLOAT";
const FIGMA_TYPE_STRING = "STRING";

// Reference: string value wrapped in { }; points to another variable. We preserve token $type when emitting.
const REFERENCE_PATTERN = /^\{[^}]+\}$/;
function isReference(value) {
  return typeof value === "string" && REFERENCE_PATTERN.test(value.trim());
}

// --- Alias reference: JSON dot path → Figma path, validate exists (mirrors figma-plugin import/aliasReference.ts) ---
const VALID_ROOTS = ["tokens", "brand", "ui-kit"];
const VALID_THEMES = ["light", "dark"];

function jsonReferenceToFigmaPath(ref) {
  const trimmed = typeof ref === "string" ? ref.trim() : "";
  const match = trimmed.match(/^\{([^}]+)\}$/);
  if (!match) {
    throw new Error(
      `Invalid alias reference: expected "{path.to.token}" form, got: ${trimmed ? JSON.stringify(trimmed) : "(empty)"}`,
    );
  }
  const pathContent = match[1].trim();
  if (!pathContent) {
    throw new Error(
      `Invalid alias reference: path is empty in ${JSON.stringify(ref)}`,
    );
  }
  const parts = pathContent.split(".");
  const root = parts[0]?.toLowerCase();
  if (!root || !VALID_ROOTS.includes(root)) {
    throw new Error(
      `Invalid alias reference: path must start with "tokens.", "brand.", or "ui-kit.", got: ${JSON.stringify(pathContent)}`,
    );
  }
  let figmaVariableName;
  let themeKey;
  if (
    root === "brand" &&
    parts[1]?.toLowerCase() === "themes" &&
    VALID_THEMES.includes(parts[2]?.toLowerCase())
  ) {
    themeKey = parts[2].toLowerCase();
    figmaVariableName = parts.slice(3).join("/");
  } else {
    figmaVariableName = parts.slice(1).join("/");
  }
  if (!figmaVariableName) {
    throw new Error(
      `Invalid alias reference: path has no segments after root, got: ${JSON.stringify(pathContent)}`,
    );
  }
  return { collectionFileType: root, figmaVariableName, themeKey };
}
function jsonReferenceToFigmaPathValue(ref) {
  const parsed = jsonReferenceToFigmaPath(ref);
  return `${parsed.collectionFileType}/${parsed.figmaVariableName}`;
}
/**
 * Resolves a reference per DTCG: references must target tokens (not groups).
 * Work-arounds (recorded as warnings):
 * - Current-theme context: brand refs without theme in path are validated against current theme set; alias points to variable (Figma resolves per mode).
 * - Color group .tone: if path points to a group, try path/tone (assume tone for color groups).
 * - tokens renames: size→sizes, opacity→opacities (try renamed segment when not found).
 * Returns { value, warning? } or throws if unresolved.
 */
function resolveAndValidateAlias(
  ref,
  registry,
  currentThemeKey,
  locationForWarnings,
) {
  const parsed = jsonReferenceToFigmaPath(ref);
  let set;
  if (parsed.collectionFileType === "brand") {
    const resolvedTheme = parsed.themeKey ?? currentThemeKey;
    if (!resolvedTheme || !registry.brandByTheme?.[resolvedTheme]) {
      set = null;
    } else {
      set = registry.brandByTheme[resolvedTheme];
    }
  } else {
    set = registry[parsed.collectionFileType];
  }

  const pathDisplay =
    parsed.collectionFileType === "brand" &&
    (parsed.themeKey ?? currentThemeKey)
      ? `${parsed.collectionFileType}/themes/${parsed.themeKey ?? currentThemeKey}/${parsed.figmaVariableName}`
      : `${parsed.collectionFileType}/${parsed.figmaVariableName}`;
  const notFoundError = () =>
    new Error(
      `Alias reference points to a variable that does not exist: ${pathDisplay} (from reference ${JSON.stringify(ref)})`,
    );

  if (set?.has(parsed.figmaVariableName)) {
    const value = `${parsed.collectionFileType}/${parsed.figmaVariableName}`;
    let warning = null;
    if (
      parsed.collectionFileType === "brand" &&
      parsed.figmaVariableName.startsWith("typography/") &&
      parsed.figmaVariableName.split("/").length > 2
    ) {
      warning = `Reference targets typography sub-property (kebab-case) per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
    }
    return { value, warning };
  }

  // DTCG camelCase: typography sub-property refs use fontFamily, fontSize, textCase, etc.; set has kebab-case. Accept camelCase refs.
  if (
    parsed.collectionFileType === "brand" &&
    set &&
    parsed.figmaVariableName.startsWith("typography/")
  ) {
    const typoParts = parsed.figmaVariableName.split("/");
    if (typoParts.length > 2) {
      const last = typoParts[typoParts.length - 1];
      const kebabLast = camelToKebab(last);
      if (kebabLast !== last) {
        const kebabPath = typoParts.slice(0, -1).concat(kebabLast).join("/");
        if (set.has(kebabPath)) {
          return {
            value: `${parsed.collectionFileType}/${kebabPath}`,
            warning: null,
          };
        }
      }
    }
  }

  if (
    parsed.collectionFileType === "tokens" &&
    set &&
    registry.tokenKeyToAliasPath
  ) {
    const aliasPath = registry.tokenKeyToAliasPath.get(
      parsed.figmaVariableName,
    );
    if (aliasPath != null && set.has(aliasPath)) {
      return { value: `tokens/${aliasPath}`, warning: null };
    }
  }

  if (parsed.collectionFileType === "brand" && set) {
    if (
      parsed.figmaVariableName === "palettes/core-black" ||
      parsed.figmaVariableName === "palettes/core-white"
    ) {
      const expandedPath =
        parsed.figmaVariableName === "palettes/core-black"
          ? "palettes/core-colors/black"
          : "palettes/core-colors/white";
      const referrerIsOnTone =
        locationForWarnings &&
        (locationForWarnings.endsWith(".on-tone") ||
          locationForWarnings.endsWith("/on-tone"));
      const firstSuffix = referrerIsOnTone ? "on-tone" : "tone";
      const secondSuffix = referrerIsOnTone ? "tone" : "on-tone";
      if (set.has(`${expandedPath}/${firstSuffix}`)) {
        const value = `${parsed.collectionFileType}/${expandedPath}/${firstSuffix}`;
        const warning = `Reference used core-black/core-white → core-colors and .${firstSuffix} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
      if (set.has(`${expandedPath}/${secondSuffix}`)) {
        const value = `${parsed.collectionFileType}/${expandedPath}/${secondSuffix}`;
        const warning = `Reference used core-black/core-white → core-colors and .${secondSuffix} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
    }
    const refByTheme =
      registry.brandRefByTheme?.[parsed.themeKey ?? currentThemeKey];
    const parts = parsed.figmaVariableName.split("/");
    const defaultIdx = parts.indexOf("default");
    if (defaultIdx >= 0 && refByTheme) {
      const prefix = parts.slice(0, defaultIdx + 1).join("/");
      const suffix = parts.slice(defaultIdx + 1).join("/");
      const targetPath = refByTheme.get(prefix);
      if (targetPath) {
        const newPath = suffix ? `${targetPath}/${suffix}` : targetPath;
        if (set.has(newPath)) {
          const value = `${parsed.collectionFileType}/${newPath}`;
          const warning = `Reference followed one-level indirection (e.g. default → step) per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
          return { value, warning };
        }
      }
    }
    if (parts.length === 3 && parts[0] === "palettes") {
      const colorTonePath = `${parsed.figmaVariableName}/color/tone`;
      const colorOnTonePath = `${parsed.figmaVariableName}/color/on-tone`;
      const referrerIsOnTone =
        locationForWarnings &&
        (locationForWarnings.endsWith(".on-tone") ||
          locationForWarnings.endsWith("/on-tone"));
      const firstPath = referrerIsOnTone ? colorOnTonePath : colorTonePath;
      const secondPath = referrerIsOnTone ? colorTonePath : colorOnTonePath;
      if (set.has(firstPath)) {
        const value = `${parsed.collectionFileType}/${firstPath}`;
        const warning = `Reference targeted palette step; resolved to .color.${referrerIsOnTone ? "on-tone" : "tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
      if (set.has(secondPath)) {
        const value = `${parsed.collectionFileType}/${secondPath}`;
        const warning = `Reference targeted palette step; resolved to .color.${referrerIsOnTone ? "tone" : "on-tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
    }
    // layers.layer-0 has elements.interactive.tone but not .color; resolve .color → .tone (or .on-tone by referrer)
    const partsForColor = parsed.figmaVariableName.split("/");
    if (
      partsForColor.length > 0 &&
      partsForColor[partsForColor.length - 1] === "color"
    ) {
      const basePath = partsForColor.slice(0, -1).join("/");
      const referrerIsOnTone =
        locationForWarnings &&
        (locationForWarnings.endsWith(".on-tone") ||
          locationForWarnings.endsWith("/on-tone"));
      const tonePathAlt = `${basePath}/tone`;
      const onTonePathAlt = `${basePath}/on-tone`;
      const firstPath = referrerIsOnTone ? onTonePathAlt : tonePathAlt;
      const secondPath = referrerIsOnTone ? tonePathAlt : onTonePathAlt;
      if (set.has(firstPath)) {
        const value = `${parsed.collectionFileType}/${firstPath}`;
        const warning = `Reference targeted .color but token does not exist; resolved to .${referrerIsOnTone ? "on-tone" : "tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
      if (set.has(secondPath)) {
        const value = `${parsed.collectionFileType}/${secondPath}`;
        const warning = `Reference targeted .color but token does not exist; resolved to .${referrerIsOnTone ? "tone" : "on-tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
    }
    const referrerIsOnTone =
      locationForWarnings &&
      (locationForWarnings.endsWith(".on-tone") ||
        locationForWarnings.endsWith("/on-tone"));
    const onTonePath = `${parsed.figmaVariableName}/on-tone`;
    const tonePath = `${parsed.figmaVariableName}/tone`;
    if (referrerIsOnTone && set.has(onTonePath)) {
      const value = `${parsed.collectionFileType}/${onTonePath}`;
      const warning = `Reference targeted a group; resolved to .on-tone per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
      return { value, warning };
    }
    if (set.has(tonePath)) {
      const value = `${parsed.collectionFileType}/${tonePath}`;
      const warning = `Reference targeted a group; resolved to .tone per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
      return { value, warning };
    }
    if (set.has(onTonePath)) {
      const value = `${parsed.collectionFileType}/${onTonePath}`;
      const warning = `Reference targeted a group; resolved to .on-tone per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
      return { value, warning };
    }
  }

  if (parsed.collectionFileType === "brand" && set) {
    const parts = parsed.figmaVariableName.split("/");
    if (
      parts.length > 2 &&
      parts[0] === "typography" &&
      parts[parts.length - 1] === "text-transform"
    ) {
      const textCasePath = [...parts.slice(0, -1), "text-case"].join("/");
      if (set.has(textCasePath)) {
        const value = `${parsed.collectionFileType}/${textCasePath}`;
        const warning = `Reference used typography .text-transform → .text-case (DTCG textCase) per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
        return { value, warning };
      }
    }
  }

  if (parsed.collectionFileType === "tokens" && set) {
    const parts = parsed.figmaVariableName.split("/");
    const renames = [
      ["size", "sizes", "tokens.size → tokens.sizes"],
      ["opacity", "opacities", "tokens.opacity → tokens.opacities"],
    ];
    for (const [from, to, label] of renames) {
      if (parts[0] === from) {
        const altPath = [to, ...parts.slice(1)].join("/");
        if (set.has(altPath)) {
          const value = `${parsed.collectionFileType}/${altPath}`;
          const warning = `Reference used ${label} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
          return { value, warning };
        }
      }
    }
  }

  throw notFoundError();
}

/** Maps DTCG token $type to Figma variable type (COLOR | FLOAT | STRING). Used for references so we do not lose type. */
function tokenTypeToFigmaType(tokenType) {
  const t = tokenType?.toLowerCase();
  if (t === "color") return FIGMA_TYPE_COLOR;
  if (t === "number" || t === "dimension") return FIGMA_TYPE_FLOAT;
  return FIGMA_TYPE_STRING;
}

function escapeCsvCell(value) {
  const str = String(value);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// --- Color conversion (matches RECURSICA_JSON_SPEC § 2 and colorToFigmaRgba) ---
const HEX6 = /^#[0-9a-fA-F]{6}$/;
const HEX8 = /^#[0-9a-fA-F]{8}$/;

function rgbaToHex(rgba) {
  const r = Math.round(Math.max(0, Math.min(1, rgba.r)) * 255);
  const g = Math.round(Math.max(0, Math.min(1, rgba.g)) * 255);
  const b = Math.round(Math.max(0, Math.min(1, rgba.b)) * 255);
  const a = rgba.a !== undefined ? Math.max(0, Math.min(1, rgba.a)) : 1;
  const aHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  return (
    "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("") + aHex
  );
}

function isRGBA(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    typeof value.r === "number" &&
    typeof value.g === "number" &&
    typeof value.b === "number"
  );
}

function parseRgbOrRgbaString(str) {
  const trimmed = str.trim().toLowerCase();
  const rgbMatch = trimmed.match(
    /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/,
  );
  const rgbaMatch = trimmed.match(
    /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/,
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10) / 255,
      g: parseInt(rgbMatch[2], 10) / 255,
      b: parseInt(rgbMatch[3], 10) / 255,
      a: 1,
    };
  }
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10) / 255,
      g: parseInt(rgbaMatch[2], 10) / 255,
      b: parseInt(rgbaMatch[3], 10) / 255,
      a: Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))),
    };
  }
  return null;
}

function colorToHex(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const s = value.trim();
    if (HEX6.test(s)) {
      const r = parseInt(s.slice(1, 3), 16) / 255;
      const g = parseInt(s.slice(3, 5), 16) / 255;
      const b = parseInt(s.slice(5, 7), 16) / 255;
      return rgbaToHex({ r, g, b, a: 1 });
    }
    if (HEX8.test(s)) {
      const r = parseInt(s.slice(1, 3), 16) / 255;
      const g = parseInt(s.slice(3, 5), 16) / 255;
      const b = parseInt(s.slice(5, 7), 16) / 255;
      const a = parseInt(s.slice(7, 9), 16) / 255;
      return rgbaToHex({ r, g, b, a });
    }
    if (s.startsWith("rgb")) {
      const rgba = parseRgbOrRgbaString(s);
      return rgba ? rgbaToHex(rgba) : null;
    }
    return null;
  }
  if (isRGBA(value)) return rgbaToHex(value);
  if (typeof value === "object" && value !== null && "components" in value) {
    const comp = value.components;
    if (!Array.isArray(comp) || comp.length < 3) return null;
    const space = (value.colorSpace ?? "srgb").toLowerCase();
    if (space !== "srgb" && space !== "srgb-linear") return null;
    const r = Math.max(0, Math.min(1, Number(comp[0])));
    const g = Math.max(0, Math.min(1, Number(comp[1])));
    const b = Math.max(0, Math.min(1, Number(comp[2])));
    const a =
      value.alpha !== undefined
        ? Math.max(0, Math.min(1, Number(value.alpha)))
        : 1;
    return rgbaToHex({ r, g, b, a });
  }
  return null;
}

// --- Tokens collection (recursica_tokens.json → Tokens.csv) ---
// Uses alias name in path when present (e.g. colors/cornflower/100 not colors/scale-01/100).
// tokenKeyToAliasPath: key path -> alias path so refs like tokens.colors.scale-01.100 resolve to the alias path.
function collectTokens(
  obj,
  keyPathSegments,
  aliasPathSegments,
  rows,
  errors,
  inheritedType,
  tokenKeyToAliasPath = null,
) {
  if (obj === null || typeof obj !== "object") return;

  if ("$value" in obj) {
    const aliasPathWithSlashes = aliasPathSegments.join("/");
    const tokenType =
      obj.$type != null
        ? String(obj.$type).trim()
        : inheritedType != null
          ? String(inheritedType).trim()
          : "";

    if (!aliasPathWithSlashes.startsWith(TOKENS_PREFIX)) {
      errors.push(
        `Variable path must start with "${TOKENS_PREFIX}", got: ${aliasPathWithSlashes}`,
      );
      return;
    }
    const figmaVariableName = aliasPathWithSlashes.slice(TOKENS_PREFIX.length);
    if (tokenKeyToAliasPath != null) {
      const keyPath = keyPathSegments.slice(1).join("/");
      const aliasPath = aliasPathSegments.slice(1).join("/");
      if (keyPath !== aliasPath) tokenKeyToAliasPath.set(keyPath, aliasPath);
    }
    if (tokenType === "dimension") {
      const v = obj.$value;
      if (v !== null && typeof v === "object" && v.unit === "rem") {
        throw new Error(
          `rem format is not supported at path: ${aliasPathWithSlashes}`,
        );
      }
      if (
        v !== null &&
        typeof v === "object" &&
        v.unit === "px" &&
        typeof v.value === "number"
      ) {
        rows.push([figmaVariableName, v.value, FIGMA_TYPE_FLOAT, "false"]);
        return;
      }
      errors.push(
        `Unsupported or invalid dimension value at path: ${aliasPathWithSlashes}`,
      );
      return;
    }
    if (tokenType === "number") {
      const v = obj.$value;
      if (typeof v === "number" && !Number.isNaN(v)) {
        rows.push([figmaVariableName, v, FIGMA_TYPE_FLOAT, "false"]);
        return;
      }
      errors.push(
        `Unsupported or invalid number value at path: ${aliasPathWithSlashes}`,
      );
      return;
    }
    if (tokenType === "fontFamily") {
      const v = obj.$value;
      const str =
        typeof v === "string"
          ? v
          : Array.isArray(v) &&
              v.length > 0 &&
              v.every((x) => typeof x === "string")
            ? v.join(", ")
            : null;
      if (str !== null) {
        rows.push([figmaVariableName, str, FIGMA_TYPE_STRING, "false"]);
        return;
      }
      errors.push(
        `Unsupported or invalid fontFamily value at path: ${aliasPathWithSlashes}`,
      );
      return;
    }
    if (tokenType === "string") {
      const v = obj.$value;
      const str =
        v === null || v === undefined
          ? "null"
          : typeof v === "string"
            ? v
            : null;
      if (str !== null) {
        rows.push([figmaVariableName, str, FIGMA_TYPE_STRING, "false"]);
        return;
      }
      errors.push(
        `Unsupported or invalid string value at path: ${aliasPathWithSlashes}`,
      );
      return;
    }
    if (tokenType !== "color") {
      errors.push(
        `Only color type is supported, got "${tokenType}" at path: ${aliasPathWithSlashes}`,
      );
      return;
    }

    const hex = colorToHex(obj.$value);
    if (hex === null) {
      errors.push(
        `Unsupported or invalid color value at path: ${aliasPathWithSlashes}`,
      );
      return;
    }

    rows.push([figmaVariableName, hex, FIGMA_TYPE_COLOR, "false"]);
    return;
  }

  const groupType =
    obj.$type != null ? String(obj.$type).trim() : inheritedType;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) continue;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      if (key === "alias") continue;
      const aliasSegment = typeof value.alias === "string" ? value.alias : key;
      collectTokens(
        value,
        keyPathSegments.concat(key),
        aliasPathSegments.concat(aliasSegment),
        rows,
        errors,
        groupType,
        tokenKeyToAliasPath,
      );
    }
  }
}

// --- Themes collection (recursica_brand.json → Themes.csv). Rows: [figmaVariableName, mode, value, type, defaultMode]. ---
// References ({...}) are emitted with value = the reference string; type is taken from token $type (see tokenTypeToFigmaType).
// pathPrefix (optional): JSON path prefix for warnings/errors, e.g. "brand.typography" or "brand.themes.light".
function collectThemeRows(
  obj,
  pathSegments,
  mode,
  rows,
  errors,
  inheritedType,
  warnings = [],
  pathPrefix = null,
) {
  if (obj === null || typeof obj !== "object") return;

  if ("$value" in obj) {
    const figmaVariableName = pathSegments.join("/");
    const jsonPath = pathPrefix
      ? pathPrefix + "." + figmaVariableName.replace(/\//g, ".")
      : mode + "/" + figmaVariableName;
    const tokenType =
      obj.$type != null
        ? String(obj.$type).trim()
        : inheritedType != null
          ? String(inheritedType).trim()
          : "";
    const v = obj.$value;

    if (isReference(v)) {
      const figmaType = tokenTypeToFigmaType(tokenType);
      rows.push([figmaVariableName, mode, v, figmaType, "true"]);
      return;
    }

    if (tokenType === "color") {
      const hex = colorToHex(v);
      if (hex !== null) {
        rows.push([figmaVariableName, mode, hex, FIGMA_TYPE_COLOR, "false"]);
        return;
      }
    }
    if (tokenType === "number") {
      if (typeof v === "number" && !Number.isNaN(v)) {
        rows.push([figmaVariableName, mode, v, FIGMA_TYPE_FLOAT, "false"]);
        return;
      }
      if (
        v !== null &&
        typeof v === "object" &&
        "value" in v &&
        "unit" in v &&
        v.unit === "px" &&
        typeof v.value === "number"
      ) {
        rows.push([
          figmaVariableName,
          mode,
          v.value,
          FIGMA_TYPE_FLOAT,
          "false",
        ]);
        return;
      }
    }
    if (tokenType === "dimension") {
      if (v !== null && typeof v === "object" && v.unit === "rem") {
        errors.push(`rem format is not supported at path: ${jsonPath}`);
        return;
      }
      if (
        v !== null &&
        typeof v === "object" &&
        v.unit === "px" &&
        typeof v.value === "number"
      ) {
        rows.push([
          figmaVariableName,
          mode,
          v.value,
          FIGMA_TYPE_FLOAT,
          "false",
        ]);
        return;
      }
    }

    if (tokenType === "typography") {
      const str =
        v === null || v === undefined
          ? "null"
          : typeof v === "string"
            ? v
            : typeof v === "object" && v !== null
              ? JSON.stringify(v)
              : String(v);
      rows.push([figmaVariableName, mode, str, FIGMA_TYPE_STRING, "false"]);
      // Emit sub-property rows (font-family, font-size, etc.) so alias targets like brand/typography/h3/font-family exist in Themes.
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        for (const key of Object.keys(v)) {
          if (key.startsWith("$")) continue;
          const subVal = v[key];
          const subPath = figmaVariableName + "/" + camelToKebab(key);
          const subRef = typeof subVal === "string" && isReference(subVal);
          rows.push([
            subPath,
            mode,
            subRef ? subVal : String(subVal ?? ""),
            FIGMA_TYPE_STRING,
            subRef ? "true" : "false",
          ]);
        }
      }
      return;
    }
    if (
      tokenType === "elevation" ||
      tokenType === "boxShadow" ||
      tokenType === "string"
    ) {
      const str =
        tokenType === "string"
          ? v === null || v === undefined
            ? "null"
            : typeof v === "string"
              ? v
              : null
          : typeof v === "object" && v !== null
            ? JSON.stringify(v)
            : String(v);
      if (str !== null) {
        rows.push([figmaVariableName, mode, str, FIGMA_TYPE_STRING, "false"]);
        return;
      }
    }

    if (
      tokenType === "color" &&
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      !("components" in v) &&
      !("r" in v)
    ) {
      const groupType =
        obj.$type != null ? String(obj.$type).trim() : inheritedType;
      for (const key of Object.keys(v)) {
        if (key.startsWith("$")) continue;
        const child = v[key];
        if (
          child !== null &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          collectThemeRows(
            child,
            pathSegments.concat(key),
            mode,
            rows,
            errors,
            groupType,
            warnings,
            pathPrefix,
          );
        }
      }
      return;
    }

    errors.push(
      `Unsupported or invalid theme token type "${tokenType}" at path: ${jsonPath}`,
    );
  } else {
    const groupType =
      obj.$type != null ? String(obj.$type).trim() : inheritedType;
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$")) continue;
      const value = obj[key];
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        collectThemeRows(
          value,
          pathSegments.concat(key),
          mode,
          rows,
          errors,
          groupType,
          warnings,
          pathPrefix,
        );
      }
    }
  }
}

const THEMES_DEFAULT_MODE = "Light";
const THEMES_MODES = ["Light", "Dark"];
const NORMALIZED_MODES = { light: "Light", dark: "Dark" };

function camelToKebab(str) {
  return String(str).replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
}

/** Walks theme object and adds every token's figma variable name (path with /) to the set. Optionally records path → target path when $value is a reference (for one-level indirection, e.g. default → step). Typography tokens have composite $value (fontFamily, fontSize, etc.); we add synthetic sub-paths in kebab-case (font-family, font-size) so refs like brand.typography.h3.font-family resolve. */
function collectBrandVariableNames(obj, pathSegments, namesSet, refMap = null) {
  if (obj === null || typeof obj !== "object") return;
  if ("$value" in obj) {
    const v = obj.$value;
    const path = pathSegments.join("/");
    namesSet.add(path);
    if (isReference(v)) {
      if (refMap != null) {
        try {
          const parsed = jsonReferenceToFigmaPath(v);
          if (parsed.collectionFileType === "brand")
            refMap.set(path, parsed.figmaVariableName);
        } catch (_) {}
      }
      return;
    }
    const tokenType = obj.$type != null ? String(obj.$type).trim() : "";
    if (
      tokenType === "typography" &&
      typeof v === "object" &&
      v !== null &&
      !Array.isArray(v)
    ) {
      for (const key of Object.keys(v)) {
        if (key.startsWith("$")) continue;
        namesSet.add(`${path}/${camelToKebab(key)}`);
      }
    }
    if (
      typeof v === "object" &&
      v !== null &&
      !Array.isArray(v) &&
      !("components" in v) &&
      !("r" in v)
    ) {
      for (const key of Object.keys(v)) {
        if (key.startsWith("$")) continue;
        const child = v[key];
        if (
          child !== null &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          collectBrandVariableNames(
            child,
            pathSegments.concat(key),
            namesSet,
            refMap,
          );
        }
      }
    }
    return;
  }
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) continue;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      collectBrandVariableNames(
        value,
        pathSegments.concat(key),
        namesSet,
        refMap,
      );
    }
  }
}

const UIKIT_PREFIX = "ui-kit/";
/** Layer collection has 4 modes in Figma: 0, 1, 2, 3; default is 0. ui-kit keys layer-0..layer-3 map to these modes. */
const LAYER_MODES = ["0", "1", "2", "3"];
const LAYER_DEFAULT_MODE = "0";
const LAYER_MODE_KEYS = ["layer-0", "layer-1", "layer-2", "layer-3"];
function layerKeyToMode(layerKey) {
  const i = LAYER_MODE_KEYS.indexOf(String(layerKey));
  return i >= 0 ? LAYER_MODES[i] : LAYER_DEFAULT_MODE;
}
/** True if obj looks like a layer-mode map: all keys are layer-0, layer-1, etc. */
function isLayerModeMap(obj) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj))
    return false;
  const keys = Object.keys(obj).filter((k) => !String(k).startsWith("$"));
  if (keys.length === 0) return false;
  return keys.every((k) => LAYER_MODE_KEYS.includes(k));
}

/** Walks ui-kit object and adds every token's figma variable name (path with /, no "ui-kit/" prefix) to the set. Layer-mode maps (layer-0..layer-3) are flattened: we add child keys (e.g. colors/background) not layer-X keys. */
function collectUiKitVariableNames(obj, pathSegments, namesSet) {
  if (obj === null || typeof obj !== "object") return;
  if ("$value" in obj) {
    const path = pathSegments.join("/");
    if (path.startsWith(UIKIT_PREFIX))
      namesSet.add(path.slice(UIKIT_PREFIX.length));
    else namesSet.add(path);
    const v = obj.$value;
    if (isReference(v)) return;
    if (
      typeof v === "object" &&
      v !== null &&
      !Array.isArray(v) &&
      !("components" in v) &&
      !("r" in v)
    ) {
      for (const key of Object.keys(v)) {
        if (key.startsWith("$")) continue;
        const child = v[key];
        if (
          child !== null &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          collectUiKitVariableNames(child, pathSegments.concat(key), namesSet);
        }
      }
    }
    return;
  }
  if (isLayerModeMap(obj)) {
    const layerKeys = Object.keys(obj).filter((k) =>
      LAYER_MODE_KEYS.includes(k),
    );
    const childKeys =
      layerKeys.length > 0
        ? Object.keys(obj[layerKeys[0]]).filter(
            (k) => !String(k).startsWith("$"),
          )
        : [];
    for (const childKey of childKeys) {
      const child = obj[layerKeys[0]]?.[childKey];
      if (
        child !== null &&
        typeof child === "object" &&
        !Array.isArray(child)
      ) {
        collectUiKitVariableNames(
          child,
          pathSegments.concat(childKey),
          namesSet,
        );
      }
    }
    return;
  }
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) continue;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      collectUiKitVariableNames(value, pathSegments.concat(key), namesSet);
    }
  }
}

/** Collects ui-kit rows: [figmaVariableName, mode, value, type, alias]. When under a layer-0..layer-3 map, emits one row per mode (layer-0→0, layer-1→1, etc.); otherwise mode "0" (expanded to 4 when writing Layer.csv). */
function collectUiKitRows(
  obj,
  pathSegments,
  rows,
  errors,
  inheritedType,
  warnings = [],
  modeOverride = null,
) {
  if (obj === null || typeof obj !== "object") return;
  const mode = modeOverride ?? LAYER_DEFAULT_MODE;

  if ("$value" in obj) {
    const pathWithSlashes = pathSegments.join("/");
    const figmaVariableName = pathWithSlashes.startsWith(UIKIT_PREFIX)
      ? pathWithSlashes.slice(UIKIT_PREFIX.length)
      : pathWithSlashes;
    const tokenType =
      obj.$type != null
        ? String(obj.$type).trim()
        : inheritedType != null
          ? String(inheritedType).trim()
          : "";
    const v = obj.$value;

    if (isReference(v)) {
      const figmaType = tokenTypeToFigmaType(tokenType);
      rows.push([figmaVariableName, mode, v, figmaType, "true"]);
      return;
    }

    if (tokenType === "color") {
      const hex = colorToHex(v);
      if (hex !== null) {
        rows.push([figmaVariableName, mode, hex, FIGMA_TYPE_COLOR, "false"]);
        return;
      }
      // Null/undefined color = transparent (rule, not warning)
      if (v === null || v === undefined) {
        rows.push([
          figmaVariableName,
          mode,
          "rgba(0,0,0,0)",
          FIGMA_TYPE_COLOR,
          "false",
        ]);
        return;
      }
    }
    if (tokenType === "number") {
      if (typeof v === "number" && !Number.isNaN(v)) {
        rows.push([figmaVariableName, mode, v, FIGMA_TYPE_FLOAT, "false"]);
        return;
      }
      if (v === null || v === undefined) {
        warnings.push(
          `Number token has null/undefined value at path: ${figmaVariableName}; converted to 0 (FLOAT)`,
        );
        rows.push([figmaVariableName, mode, 0, FIGMA_TYPE_FLOAT, "false"]);
        return;
      }
      if (
        typeof v === "object" &&
        "value" in v &&
        "unit" in v &&
        v.unit === "px" &&
        typeof v.value === "number"
      ) {
        rows.push([
          figmaVariableName,
          mode,
          v.value,
          FIGMA_TYPE_FLOAT,
          "false",
        ]);
        return;
      }
      if (
        typeof v === "object" &&
        "value" in v &&
        "unit" in v &&
        v.unit === "px" &&
        isReference(v.value)
      ) {
        const figmaType = tokenTypeToFigmaType(tokenType);
        rows.push([figmaVariableName, mode, v.value, figmaType, "true"]);
        return;
      }
    }
    if (tokenType === "dimension") {
      if (v === null || v === undefined) {
        warnings.push(
          `Dimension token has null/undefined value at path: ${figmaVariableName}; converted to 0 (FLOAT)`,
        );
        rows.push([figmaVariableName, mode, 0, FIGMA_TYPE_FLOAT, "false"]);
        return;
      }
      if (typeof v === "object" && v.unit === "rem") {
        errors.push(
          `rem format is not supported at path: ${figmaVariableName}`,
        );
        return;
      }
      if (typeof v === "object" && v.unit === "px") {
        if (typeof v.value === "number") {
          rows.push([
            figmaVariableName,
            mode,
            v.value,
            FIGMA_TYPE_FLOAT,
            "false",
          ]);
          return;
        }
        if (isReference(v.value)) {
          rows.push([
            figmaVariableName,
            mode,
            v.value,
            FIGMA_TYPE_FLOAT,
            "true",
          ]);
          return;
        }
      }
    }
    if (tokenType === "string") {
      const str =
        v === null || v === undefined
          ? "null"
          : typeof v === "string"
            ? v
            : null;
      if (str !== null) {
        rows.push([figmaVariableName, mode, str, FIGMA_TYPE_STRING, "false"]);
        return;
      }
    }
    if (tokenType === "typography") {
      const str =
        v === null || v === undefined
          ? "null"
          : typeof v === "string"
            ? v
            : typeof v === "object" && v !== null
              ? JSON.stringify(v)
              : String(v);
      rows.push([figmaVariableName, mode, str, FIGMA_TYPE_STRING, "false"]);
      return;
    }

    errors.push(
      `Unsupported or invalid ui-kit token type "${tokenType}" at path: ${figmaVariableName}`,
    );
  } else {
    if (isLayerModeMap(obj)) {
      const layerKeys = Object.keys(obj).filter((k) =>
        LAYER_MODE_KEYS.includes(k),
      );
      const childKeys =
        layerKeys.length > 0
          ? Object.keys(obj[layerKeys[0]]).filter(
              (k) => !String(k).startsWith("$"),
            )
          : [];
      for (const childKey of childKeys) {
        for (const layerKey of layerKeys) {
          const child = obj[layerKey]?.[childKey];
          if (
            child !== null &&
            typeof child === "object" &&
            !Array.isArray(child)
          ) {
            collectUiKitRows(
              child,
              pathSegments.concat(childKey),
              rows,
              errors,
              inheritedType,
              warnings,
              layerKeyToMode(layerKey),
            );
          }
        }
      }
      return;
    }
    const groupType =
      obj.$type != null ? String(obj.$type).trim() : inheritedType;
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$")) continue;
      const value = obj[key];
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        collectUiKitRows(
          value,
          pathSegments.concat(key),
          rows,
          errors,
          groupType,
          warnings,
        );
      }
    }
  }
}

function processBrandToThemeRows(brandData, rows, errors, warnings = []) {
  const brand = brandData.brand ?? brandData;
  const themes = brand.themes;
  if (themes == null || typeof themes !== "object") {
    errors.push("brand.json: missing or invalid brand.themes");
    return;
  }
  for (const [rawMode, themeObj] of Object.entries(themes)) {
    if (
      themeObj === null ||
      typeof themeObj !== "object" ||
      Array.isArray(themeObj)
    )
      continue;
    const mode = NORMALIZED_MODES[rawMode?.toLowerCase()];
    if (mode == null) {
      errors.push(
        `brand.json: theme mode must be "light" or "dark" (case insensitive), got: ${rawMode}`,
      );
      continue;
    }
    collectThemeRows(
      themeObj,
      [],
      mode,
      rows,
      errors,
      undefined,
      warnings,
      "brand.themes." + rawMode.toLowerCase(),
    );
  }
  // Emit theme rows for brand root sections (dimensions, typography, etc.) so alias targets exist in Themes collection.
  for (const rootKey of Object.keys(brand)) {
    if (rootKey === "themes") continue;
    const rootSection = brand[rootKey];
    if (
      rootSection == null ||
      typeof rootSection !== "object" ||
      Array.isArray(rootSection)
    )
      continue;
    for (const mode of ["Light", "Dark"]) {
      collectThemeRows(
        rootSection,
        [rootKey],
        mode,
        rows,
        errors,
        undefined,
        warnings,
        "brand",
      );
    }
  }
}

function writeCsv(filePath, header, rows) {
  const csvLines = [
    header.join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  fs.writeFileSync(filePath, csvLines.join("\n"), "utf8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    return {
      tokensPath: path.resolve(__dirname, "recursica_tokens.json"),
      brandPath: path.resolve(__dirname, "recursica_brand.json"),
      uiKitPath: path.resolve(__dirname, "recursica_ui-kit.json"),
    };
  }
  if (args.length === 1) {
    const dir = path.resolve(process.cwd(), args[0]);
    return {
      tokensPath: path.join(dir, "recursica_tokens.json"),
      brandPath: path.join(dir, "recursica_brand.json"),
      uiKitPath: path.join(dir, "recursica_ui-kit.json"),
    };
  }
  if (args.length >= 3) {
    return {
      tokensPath: path.resolve(process.cwd(), args[0]),
      brandPath: path.resolve(process.cwd(), args[1]),
      uiKitPath: path.resolve(process.cwd(), args[2]),
    };
  }
  throw new Error(
    "Usage: node tokens-to-csv.js [<dir>] or node tokens-to-csv.js <tokensPath> <brandPath> <uiKitPath>",
  );
}

function main() {
  const { tokensPath, brandPath, uiKitPath } = parseArgs();

  console.log("--- tokens-to-csv ---");
  console.log(
    "Converts recursica_tokens.json, recursica_brand.json, and recursica_ui-kit.json to Figma CSVs.",
  );
  console.log(
    "Process order: tokens → brand → ui-kit. Alias references are converted to Figma path form and validated.",
  );
  console.log(
    "Output: Tokens.csv, Themes.csv, Layer.csv (in same directory as tokens file).",
  );
  console.log("");

  for (const [name, p] of [
    ["tokens", tokensPath],
    ["brand", brandPath],
    ["ui-kit", uiKitPath],
  ]) {
    if (!fs.existsSync(p)) {
      throw new Error(`Required file missing: ${name} at ${p}`);
    }
  }

  const outputDir = path.dirname(tokensPath);
  const tokensOut = path.join(outputDir, "Tokens.csv");
  const themesOut = path.join(outputDir, "Themes.csv");
  const layerOut = path.join(outputDir, "Layer.csv");
  const figmaVariablesOut = path.join(outputDir, "FigmaVariables.csv");

  const allErrors = [];
  const allWarnings = [];
  let themeProcessed = 0;
  let tokensProcessed = 0;

  // Process order: tokens → brand → ui-kit (aliases in later files reference earlier or same).
  // 1. Tokens → Tokens.csv and build token variable name set
  const tokenRows = [];
  const tokenErrors = [];
  const tokensRaw = fs.readFileSync(tokensPath, "utf8");
  const tokensData = JSON.parse(tokensRaw);
  const root = tokensData.tokens != null ? tokensData.tokens : tokensData;
  const tokenKeyToAliasPath = new Map();
  collectTokens(
    root,
    ["tokens"],
    ["tokens"],
    tokenRows,
    tokenErrors,
    undefined,
    tokenKeyToAliasPath,
  );
  tokensProcessed = tokenRows.length;
  allErrors.push(...tokenErrors);
  const tokenNames = new Set(tokenRows.map((row) => row[0]));
  writeCsv(
    tokensOut,
    ["figmaVariableName", "value", "type", "alias"],
    tokenRows,
  );

  // 2. Brand: collect brand variable names per theme (references are theme-agnostic: assume current theme when not specified)
  const brandRaw = fs.readFileSync(brandPath, "utf8");
  const brandData = JSON.parse(brandRaw);
  const brand = brandData.brand ?? brandData;
  const themes = brand?.themes;
  const brandNamesByTheme = {};
  const brandRefByTheme = {};
  if (themes != null && typeof themes === "object") {
    for (const [themeKey, themeObj] of Object.entries(themes)) {
      if (
        themeObj != null &&
        typeof themeObj === "object" &&
        !Array.isArray(themeObj)
      ) {
        const key = themeKey.toLowerCase();
        if (VALID_THEMES.includes(key)) {
          brandNamesByTheme[key] = new Set();
          brandRefByTheme[key] = new Map();
          collectBrandVariableNames(
            themeObj,
            [],
            brandNamesByTheme[key],
            brandRefByTheme[key],
          );
        }
      }
    }
  }
  // Brand root sections (dimensions, typography, elevations, etc.) are not inside themes; add them to each theme set so refs like {brand.dimensions.gutters.horizontal} resolve.
  for (const rootKey of Object.keys(brand)) {
    if (rootKey === "themes") continue;
    const rootSection = brand[rootKey];
    if (
      rootSection != null &&
      typeof rootSection === "object" &&
      !Array.isArray(rootSection)
    ) {
      for (const themeKey of Object.keys(brandNamesByTheme)) {
        collectBrandVariableNames(
          rootSection,
          [rootKey],
          brandNamesByTheme[themeKey],
          brandRefByTheme[themeKey],
        );
      }
    }
  }
  const registry = {
    tokens: tokenNames,
    tokenKeyToAliasPath,
    brandByTheme: brandNamesByTheme,
    brandRefByTheme,
    "ui-kit": new Set(),
  };
  const themeRows = [];
  const themeErrors = [];
  processBrandToThemeRows(brandData, themeRows, themeErrors, allWarnings);
  themeProcessed = themeRows.length;
  allErrors.push(...themeErrors);
  const themeRowsWithResolvedAliases = themeRows.map((row) => {
    const [figmaVariableName, mode, value, type, alias] = row;
    const defaultMode = mode === THEMES_DEFAULT_MODE ? "true" : "false";
    const currentThemeKey = mode?.toLowerCase();
    const location = `brand.themes.${currentThemeKey}.${figmaVariableName.replace(/\//g, ".")}`;
    if (alias === "true" && isReference(value)) {
      try {
        const { value: figmaPathValue, warning } = resolveAndValidateAlias(
          value,
          registry,
          currentThemeKey,
          location,
        );
        if (warning) allWarnings.push(warning);
        return [
          figmaVariableName,
          mode,
          figmaPathValue,
          type,
          "true",
          defaultMode,
        ];
      } catch (err) {
        allErrors.push(
          `At ${location}: invalid reference ${value} (target variable does not exist; DTCG requires references to tokens, not groups)`,
        );
        return [figmaVariableName, mode, value, type, "true", defaultMode];
      }
    }
    return [figmaVariableName, mode, value, type, alias, defaultMode];
  });
  writeCsv(
    themesOut,
    ["figmaVariableName", "mode", "value", "type", "alias", "defaultMode"],
    themeRowsWithResolvedAliases,
  );

  // 3. Ui-kit → Layer.csv: collect ui-kit variable names, then rows; resolve aliases (brand refs use theme "light" when from ui-kit)
  const uiKitNames = new Set();
  const uiKitRaw = fs.readFileSync(uiKitPath, "utf8");
  const uiKitData = JSON.parse(uiKitRaw);
  const uiKitRoot =
    uiKitData["ui-kit"] != null ? uiKitData["ui-kit"] : uiKitData;
  collectUiKitVariableNames(
    uiKitRoot,
    [UIKIT_PREFIX.replace("/", "")],
    uiKitNames,
  );
  registry["ui-kit"] = uiKitNames;

  const uiKitRows = [];
  const uiKitErrors = [];
  collectUiKitRows(
    uiKitRoot,
    [UIKIT_PREFIX.replace("/", "")],
    uiKitRows,
    uiKitErrors,
    undefined,
    allWarnings,
  );
  const uiKitProcessed = uiKitRows.length;
  allErrors.push(...uiKitErrors);

  const UIKIT_THEME_FOR_BRAND_REFS = "light";
  const uiKitRowsWithResolvedAliases = uiKitRows.map((row) => {
    const [figmaVariableName, mode, value, type, alias] = row;
    const location = `ui-kit.${figmaVariableName.replace(/\//g, ".")}`;
    if (alias === "true" && isReference(value)) {
      try {
        const { value: figmaPathValue, warning } = resolveAndValidateAlias(
          value,
          registry,
          UIKIT_THEME_FOR_BRAND_REFS,
          location,
        );
        if (warning) allWarnings.push(warning);
        return [figmaVariableName, mode, figmaPathValue, type, "true"];
      } catch (err) {
        allErrors.push(
          `At ${location}: invalid reference ${value} (target variable does not exist; DTCG requires references to tokens, not groups)`,
        );
        return [figmaVariableName, mode, value, type, "true"];
      }
    }
    return row;
  });
  // Layer collection has 4 modes (0,1,2,3); default is 0. Variables from layer-0..layer-3 maps already have one row per mode; others expand to 4 with same value.
  const layerRowsByVariable = new Map();
  for (const row of uiKitRowsWithResolvedAliases) {
    const [figmaVariableName, mode, value, type, alias] = row;
    if (!layerRowsByVariable.has(figmaVariableName))
      layerRowsByVariable.set(figmaVariableName, []);
    layerRowsByVariable
      .get(figmaVariableName)
      .push([figmaVariableName, mode, value, type, alias]);
  }
  const layerRows = [];
  for (const [, variableRows] of layerRowsByVariable) {
    const modesPresent = new Set(variableRows.map((r) => r[1]));
    const hasAllModes = LAYER_MODES.every((m) => modesPresent.has(m));
    if (hasAllModes && variableRows.length === LAYER_MODES.length) {
      for (const [
        figmaVariableName,
        mode,
        value,
        type,
        alias,
      ] of variableRows) {
        const defaultMode = mode === LAYER_DEFAULT_MODE ? "true" : "false";
        layerRows.push([
          figmaVariableName,
          mode,
          value,
          type,
          alias,
          defaultMode,
        ]);
      }
    } else {
      const [figmaVariableName, , value, type, alias] = variableRows[0];
      for (const mode of LAYER_MODES) {
        const defaultMode = mode === LAYER_DEFAULT_MODE ? "true" : "false";
        layerRows.push([
          figmaVariableName,
          mode,
          value,
          type,
          alias,
          defaultMode,
        ]);
      }
    }
  }
  writeCsv(
    layerOut,
    ["figmaVariableName", "mode", "value", "type", "alias", "defaultMode"],
    layerRows,
  );

  const layerProcessed = layerRows.length;

  // Combined FigmaVariables.csv: collection column + all rows in order (tokens → themes → layer)
  const FIGMA_VARS_HEADER = [
    "collection",
    "figmaVariableName",
    "mode",
    "value",
    "type",
    "alias",
    "defaultMode",
  ];
  const combinedRows = [
    ...tokenRows.map((row) => [
      "tokens",
      row[0],
      "",
      row[1],
      row[2],
      row[3],
      "true",
    ]),
    ...themeRowsWithResolvedAliases.map((row) => [
      "themes",
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
    ]),
    ...layerRows.map((row) => [
      "layer",
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
    ]),
  ];
  writeCsv(figmaVariablesOut, FIGMA_VARS_HEADER, combinedRows);

  console.log("--- Run information ---");
  console.log("Inputs:");
  console.log("  tokens:", tokensPath);
  console.log("  brand:", brandPath);
  console.log("  ui-kit:", uiKitPath);
  console.log("Output directory:", outputDir);
  console.log("");
  console.log("--- Statistics ---");
  console.log("Tokens.csv:", tokensProcessed, "rows");
  console.log("Themes.csv:", themeProcessed, "rows");
  console.log("Layer.csv:", layerProcessed, "rows");
  console.log("FigmaVariables.csv:", combinedRows.length, "rows (combined)");
  console.log("Written:", tokensOut);
  console.log("Written:", themesOut);
  console.log("Written:", layerOut);
  console.log("Written:", figmaVariablesOut);
  console.log("");
  console.log("--- Errors and Warnings statistics ---");
  console.log("Errors:", allErrors.length);
  console.log("Warnings:", allWarnings.length);
  console.log("");
  console.log("--- Warnings (work-arounds applied) ---");
  if (allWarnings.length > 0) {
    allWarnings.forEach((w, i) => {
      console.warn(`W-${i + 1}. ${w}`);
    });
  } else {
    console.log("(none)");
  }
  console.log("");
  console.log("--- Errors ---");
  if (allErrors.length > 0) {
    allErrors.forEach((e, i) => {
      console.error(`E-${i + 1}. ${e}`);
    });
  } else {
    console.log("(none)");
  }
}

main();
