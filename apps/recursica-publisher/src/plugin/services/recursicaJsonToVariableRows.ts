/**
 * Transforms recursica_tokens.json, recursica_brand.json, and recursica_ui-kit.json
 * into the same CsvRow[] format consumed by applyVariableRows (Figma variables import).
 * Port of tokens-to-csv.js logic; no Node fs/path.
 *
 * --- WORKAROUNDS (candidate for removal) ---
 * Alias resolution uses several workarounds when the JSON/spec and Figma’s variable
 * model don’t align. Each is marked in-code with "WORKAROUND WA-N". To find all
 * sites: grep for "WORKAROUND WA-". To remove later: fix the source JSON or the spec
 * so references and variable names match what we emit.
 *
 * WA-1  Typography sub-property kebab-case
 *   JSON may use camelCase for typography sub-properties (e.g. fontFamily); we emit
 *   kebab-case paths (font-family). If direct path not found, try last segment as kebab-case.
 *   Remove when: brand typography references use kebab-case in JSON or we accept camelCase.
 *
 * WA-2  core-black / core-white → core-colors/black|white
 *   References like {brand.palettes.core-black} don’t exist; actual structure is
 *   palettes/core-colors/black with tone/on-tone. We map to core-colors/black|white and
 *   pick tone or on-tone from referrer context.
 *   Remove when: JSON uses core-colors/black|white paths or we add core-black/core-white vars.
 *
 * WA-3  default → step indirection
 *   Brand uses indirection (e.g. default → actual step name). We follow one level via
 *   brandRefByTheme when the path contains "default".
 *   Remove when: references point directly to the step path (no default indirection).
 *
 * WA-4  Palette step → .color.tone / .color.on-tone
 *   Reference targets a palette step (3 segments: palettes/name/step); Figma has
 *   variables for .color.tone and .color.on-tone. We resolve to the correct one by
 *   referrer (on-tone vs tone).
 *   Remove when: references point to the actual variable path (e.g. .../step/color/tone).
 *
 * WA-5  .color → .tone / .on-tone when .color missing
 *   Reference ends in .color but no such variable exists; we try .tone and .on-tone.
 *   Remove when: JSON references use .tone/.on-tone or we emit a .color variable.
 *
 * WA-6  Group reference → .tone / .on-tone
 *   Reference targets a group (no $value); we resolve to the .tone or .on-tone child variable.
 *   Remove when: DTCG/spec allows referencing group and we map it, or refs point to leaves.
 *
 * WA-7  text-transform → text-case
 *   DTCG typography uses "text-transform"; Figma variable is "text-case". We map the ref.
 *   Remove when: spec or our export uses "text-case" or Figma accepts "text-transform".
 *
 * WA-8  tokens.size → sizes, tokens.opacity → opacities
 *   JSON paths may say tokens.size / tokens.opacity; we emit tokens.sizes / tokens.opacities.
 *   We try the alternate path when the direct one isn’t in the registry.
 *   Remove when: JSON uses "sizes" and "opacities" in paths (or we accept size/opacity).
 */

export interface CsvRow {
  collection: string;
  figmaVariableName: string;
  mode: string;
  value: string;
  type: string;
  alias: string;
  defaultMode: string;
}

export interface RecursicaJsonToRowsResult {
  rows: CsvRow[];
  errors: string[];
  warnings: string[];
}

const TOKENS_PREFIX = "tokens/";
const FIGMA_TYPE_COLOR = "COLOR";
const FIGMA_TYPE_FLOAT = "FLOAT";
const FIGMA_TYPE_STRING = "STRING";
const REFERENCE_PATTERN = /^\{[^}]+\}$/;
const VALID_ROOTS = ["tokens", "brand", "ui-kit"];
const VALID_THEMES = ["light", "dark"];
const THEMES_DEFAULT_MODE = "Light";
const THEMES_MODES = ["Light", "Dark"];
const NORMALIZED_MODES: Record<string, string> = {
  light: "Light",
  dark: "Dark",
};
const UIKIT_PREFIX = "ui-kit/";
const LAYER_MODES = ["0", "1", "2", "3"];
const LAYER_DEFAULT_MODE = "0";
const LAYER_MODE_KEYS = ["layer-0", "layer-1", "layer-2", "layer-3"];
const HEX6 = /^#[0-9a-fA-F]{6}$/;
const HEX8 = /^#[0-9a-fA-F]{8}$/;

type TokenObj = Record<string, unknown>;

function isReference(value: unknown): value is string {
  return typeof value === "string" && REFERENCE_PATTERN.test(value.trim());
}

function camelToKebab(str: string): string {
  return String(str).replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
}

interface JsonReferenceToFigmaPathResult {
  collectionFileType: string;
  figmaVariableName: string;
  themeKey?: string;
}

function jsonReferenceToFigmaPath(ref: string): JsonReferenceToFigmaPathResult {
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
  const root = (parts[0] as string)?.toLowerCase();
  if (!root || !VALID_ROOTS.includes(root)) {
    throw new Error(
      `Invalid alias reference: path must start with "tokens.", "brand.", or "ui-kit.", got: ${JSON.stringify(pathContent)}`,
    );
  }
  let figmaVariableName: string;
  let themeKey: string | undefined;
  if (
    root === "brand" &&
    (parts[1] as string)?.toLowerCase() === "themes" &&
    VALID_THEMES.includes((parts[2] as string)?.toLowerCase())
  ) {
    themeKey = (parts[2] as string).toLowerCase();
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

interface Registry {
  tokens: Set<string>;
  tokenKeyToAliasPath: Map<string, string>;
  brandByTheme: Record<string, Set<string>>;
  brandRefByTheme: Record<string, Map<string, string>>;
  "ui-kit": Set<string>;
}

/**
 * Resolves a DTCG-style reference "{path.to.token}" to a Figma variable path (e.g. "tokens/...").
 * All alias-resolution workarounds (WA-1 through WA-8) live in this function; see file header.
 */
function resolveAndValidateAlias(
  ref: string,
  registry: Registry,
  currentThemeKey: string,
  locationForWarnings: string | null,
): { value: string; warning: string | null } {
  const parsed = jsonReferenceToFigmaPath(ref);
  let set: Set<string> | null = null;
  if (parsed.collectionFileType === "brand") {
    const resolvedTheme = parsed.themeKey ?? currentThemeKey;
    if (resolvedTheme && registry.brandByTheme?.[resolvedTheme]) {
      set = registry.brandByTheme[resolvedTheme];
    }
  } else {
    const s = registry[parsed.collectionFileType as keyof Registry];
    set = s instanceof Set ? s : null;
  }

  const pathDisplay =
    parsed.collectionFileType === "brand" &&
    (parsed.themeKey ?? currentThemeKey)
      ? `${parsed.collectionFileType}/themes/${parsed.themeKey ?? currentThemeKey}/${parsed.figmaVariableName}`
      : `${parsed.collectionFileType}/${parsed.figmaVariableName}`;
  const notFoundError = (): Error =>
    new Error(
      `Alias reference points to a variable that does not exist: ${pathDisplay} (from reference ${JSON.stringify(ref)})`,
    );

  if (set?.has(parsed.figmaVariableName)) {
    const value = `${parsed.collectionFileType}/${parsed.figmaVariableName}`;
    let warning: string | null = null;
    // WORKAROUND WA-1: typography sub-property may be referenced in camelCase; we emit kebab-case.
    if (
      parsed.collectionFileType === "brand" &&
      parsed.figmaVariableName.startsWith("typography/") &&
      parsed.figmaVariableName.split("/").length > 2
    ) {
      warning = `Reference targets typography sub-property (kebab-case) per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`;
    }
    return { value, warning };
  }

  // WORKAROUND WA-1: try kebab-case for typography sub-property when direct path not found.
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

  // Token key may differ from alias path (e.g. $alias on a group); resolve via registry.
  const tokenKeyToAliasPath = registry.tokenKeyToAliasPath;
  if (parsed.collectionFileType === "tokens" && set && tokenKeyToAliasPath) {
    const aliasPath = tokenKeyToAliasPath.get(parsed.figmaVariableName);
    if (aliasPath != null && set.has(aliasPath)) {
      return { value: `tokens/${aliasPath}`, warning: null };
    }
  }

  if (parsed.collectionFileType === "brand" && set) {
    // WORKAROUND WA-2: core-black / core-white → core-colors/black|white + tone|on-tone.
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
        return {
          value: `${parsed.collectionFileType}/${expandedPath}/${firstSuffix}`,
          warning: `Reference used core-black/core-white → core-colors and .${firstSuffix} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
      if (set.has(`${expandedPath}/${secondSuffix}`)) {
        return {
          value: `${parsed.collectionFileType}/${expandedPath}/${secondSuffix}`,
          warning: `Reference used core-black/core-white → core-colors and .${secondSuffix} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
    }
    // WORKAROUND WA-3: follow one-level indirection (e.g. default → step) via brandRefByTheme.
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
          return {
            value: `${parsed.collectionFileType}/${newPath}`,
            warning: `Reference followed one-level indirection (e.g. default → step) per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
          };
        }
      }
    }
    // WORKAROUND WA-4: palette step (3 segments) → resolve to .color.tone or .color.on-tone by referrer.
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
        return {
          value: `${parsed.collectionFileType}/${firstPath}`,
          warning: `Reference targeted palette step; resolved to .color.${referrerIsOnTone ? "on-tone" : "tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
      if (set.has(secondPath)) {
        return {
          value: `${parsed.collectionFileType}/${secondPath}`,
          warning: `Reference targeted palette step; resolved to .color.${referrerIsOnTone ? "tone" : "on-tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
    }
    // WORKAROUND WA-5: reference ends in .color but token doesn't exist; try .tone and .on-tone.
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
        return {
          value: `${parsed.collectionFileType}/${firstPath}`,
          warning: `Reference targeted .color but token does not exist; resolved to .${referrerIsOnTone ? "on-tone" : "tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
      if (set.has(secondPath)) {
        return {
          value: `${parsed.collectionFileType}/${secondPath}`,
          warning: `Reference targeted .color but token does not exist; resolved to .${referrerIsOnTone ? "tone" : "on-tone"} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
    }
    // WORKAROUND WA-6: reference targets a group; resolve to .tone or .on-tone child.
    const referrerIsOnTone =
      locationForWarnings &&
      (locationForWarnings.endsWith(".on-tone") ||
        locationForWarnings.endsWith("/on-tone"));
    const onTonePath = `${parsed.figmaVariableName}/on-tone`;
    const tonePath = `${parsed.figmaVariableName}/tone`;
    if (referrerIsOnTone && set.has(onTonePath)) {
      return {
        value: `${parsed.collectionFileType}/${onTonePath}`,
        warning: `Reference targeted a group; resolved to .on-tone per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
      };
    }
    if (set.has(tonePath)) {
      return {
        value: `${parsed.collectionFileType}/${tonePath}`,
        warning: `Reference targeted a group; resolved to .tone per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
      };
    }
    if (set.has(onTonePath)) {
      return {
        value: `${parsed.collectionFileType}/${onTonePath}`,
        warning: `Reference targeted a group; resolved to .on-tone per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
      };
    }
  }

  // WORKAROUND WA-7: DTCG typography "text-transform" → Figma "text-case".
  if (parsed.collectionFileType === "brand" && set) {
    const parts = parsed.figmaVariableName.split("/");
    if (
      parts.length > 2 &&
      parts[0] === "typography" &&
      parts[parts.length - 1] === "text-transform"
    ) {
      const textCasePath = [...parts.slice(0, -1), "text-case"].join("/");
      if (set.has(textCasePath)) {
        return {
          value: `${parsed.collectionFileType}/${textCasePath}`,
          warning: `Reference used typography .text-transform → .text-case (DTCG textCase) per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
        };
      }
    }
  }

  // WORKAROUND WA-8: tokens.size → sizes, tokens.opacity → opacities (path renames).
  if (parsed.collectionFileType === "tokens" && set) {
    const parts = parsed.figmaVariableName.split("/");
    const renames: [string, string, string][] = [
      ["size", "sizes", "tokens.size → tokens.sizes"],
      ["opacity", "opacities", "tokens.opacity → tokens.opacities"],
    ];
    for (const [from, to, label] of renames) {
      if (parts[0] === from) {
        const altPath = [to, ...parts.slice(1)].join("/");
        if (set.has(altPath)) {
          return {
            value: `${parsed.collectionFileType}/${altPath}`,
            warning: `Reference used ${label} per work-around${locationForWarnings ? ` at ${locationForWarnings}` : ""}: ${ref}`,
          };
        }
      }
    }
  }

  throw notFoundError();
}

function tokenTypeToFigmaType(tokenType: string): string {
  const t = tokenType?.toLowerCase();
  if (t === "color") return FIGMA_TYPE_COLOR;
  if (t === "number" || t === "dimension") return FIGMA_TYPE_FLOAT;
  return FIGMA_TYPE_STRING;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function rgbaToHex(rgba: Rgba): string {
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

function isRGBA(value: unknown): value is Rgba {
  return (
    value !== null &&
    typeof value === "object" &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    typeof (value as Rgba).r === "number" &&
    typeof (value as Rgba).g === "number" &&
    typeof (value as Rgba).b === "number"
  );
}

function parseRgbOrRgbaString(str: string): Rgba | null {
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

function colorToHex(value: unknown): string | null {
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
    const v = value as {
      components: unknown[];
      colorSpace?: string;
      alpha?: number;
    };
    const comp = v.components;
    if (!Array.isArray(comp) || comp.length < 3) return null;
    const space = (v.colorSpace ?? "srgb").toLowerCase();
    if (space !== "srgb" && space !== "srgb-linear") return null;
    const r = Math.max(0, Math.min(1, Number(comp[0])));
    const g = Math.max(0, Math.min(1, Number(comp[1])));
    const b = Math.max(0, Math.min(1, Number(comp[2])));
    const a =
      v.alpha !== undefined ? Math.max(0, Math.min(1, Number(v.alpha))) : 1;
    return rgbaToHex({ r, g, b, a });
  }
  return null;
}

// --- Tokens ---
type TokenRow = [string, number | string, string, string];

function collectTokens(
  obj: TokenObj | null,
  keyPathSegments: string[],
  aliasPathSegments: string[],
  rows: TokenRow[],
  errors: string[],
  inheritedType: string | undefined,
  tokenKeyToAliasPath: Map<string, string> | null,
): void {
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
      if (
        v !== null &&
        typeof v === "object" &&
        (v as { unit?: string }).unit === "rem"
      ) {
        throw new Error(
          `rem format is not supported at path: ${aliasPathWithSlashes}`,
        );
      }
      const vObj = v as { value?: number; unit?: string } | null;
      if (
        vObj !== null &&
        typeof vObj === "object" &&
        vObj.unit === "px" &&
        typeof vObj.value === "number"
      ) {
        rows.push([figmaVariableName, vObj.value, FIGMA_TYPE_FLOAT, "false"]);
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
            ? (v as string[]).join(", ")
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
      const child = value as TokenObj & { alias?: string };
      const aliasSegment = typeof child.alias === "string" ? child.alias : key;
      collectTokens(
        child,
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

// --- Themes ---
type ThemeRow = [string, string, string | number, string, string];

function collectThemeRows(
  obj: TokenObj | null,
  pathSegments: string[],
  mode: string,
  rows: ThemeRow[],
  errors: string[],
  inheritedType: string | undefined,
  warnings: string[],
  pathPrefix: string | null,
): void {
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
      const vObj = v as { value?: number; unit?: string } | null;
      if (
        vObj !== null &&
        typeof vObj === "object" &&
        "value" in vObj &&
        "unit" in vObj &&
        vObj.unit === "px" &&
        typeof vObj.value === "number"
      ) {
        rows.push([
          figmaVariableName,
          mode,
          vObj.value,
          FIGMA_TYPE_FLOAT,
          "false",
        ]);
        return;
      }
    }
    if (tokenType === "dimension") {
      const vObj = v as { unit?: string } | null;
      if (vObj !== null && typeof vObj === "object" && vObj.unit === "rem") {
        errors.push(`rem format is not supported at path: ${jsonPath}`);
        return;
      }
      const vDim = v as { value?: number; unit?: string } | null;
      if (
        vDim !== null &&
        typeof vDim === "object" &&
        vDim.unit === "px" &&
        typeof vDim.value === "number"
      ) {
        rows.push([
          figmaVariableName,
          mode,
          vDim.value,
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
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        const vTypo = v as Record<string, unknown>;
        for (const key of Object.keys(vTypo)) {
          if (key.startsWith("$")) continue;
          const subVal = vTypo[key];
          const subPath = figmaVariableName + "/" + camelToKebab(key);
          const subRef = typeof subVal === "string" && isReference(subVal);
          rows.push([
            subPath,
            mode,
            subRef ? (subVal as string) : String(subVal ?? ""),
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

    const vObj = v as Record<string, unknown> | null;
    if (
      tokenType === "color" &&
      vObj !== null &&
      typeof vObj === "object" &&
      !Array.isArray(vObj) &&
      !("components" in vObj) &&
      !("r" in vObj)
    ) {
      const groupType =
        obj.$type != null ? String(obj.$type).trim() : inheritedType;
      for (const key of Object.keys(vObj)) {
        if (key.startsWith("$")) continue;
        const child = vObj[key];
        if (
          child !== null &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          collectThemeRows(
            child as TokenObj,
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
          value as TokenObj,
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

function collectBrandVariableNames(
  obj: TokenObj | null,
  pathSegments: string[],
  namesSet: Set<string>,
  refMap: Map<string, string> | null,
): void {
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
        } catch {
          // ignore
        }
      }
      return;
    }
    const tokenType = obj.$type != null ? String(obj.$type).trim() : "";
    const vObj = v as Record<string, unknown> | null;
    if (
      tokenType === "typography" &&
      typeof vObj === "object" &&
      vObj !== null &&
      !Array.isArray(vObj)
    ) {
      for (const key of Object.keys(vObj)) {
        if (key.startsWith("$")) continue;
        namesSet.add(`${path}/${camelToKebab(key)}`);
      }
    }
    if (
      typeof vObj === "object" &&
      vObj !== null &&
      !Array.isArray(vObj) &&
      !("components" in vObj) &&
      !("r" in vObj)
    ) {
      for (const key of Object.keys(vObj)) {
        if (key.startsWith("$")) continue;
        const child = vObj[key];
        if (
          child !== null &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          collectBrandVariableNames(
            child as TokenObj,
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
        value as TokenObj,
        pathSegments.concat(key),
        namesSet,
        refMap,
      );
    }
  }
}

function processBrandToThemeRows(
  brandData: { brand?: TokenObj } | TokenObj,
  rows: ThemeRow[],
  errors: string[],
  warnings: string[],
): void {
  const brand = (brandData as { brand?: TokenObj }).brand ?? brandData;
  const themes = (brand as TokenObj).themes;
  if (themes == null || typeof themes !== "object") {
    errors.push("brand.json: missing or invalid brand.themes");
    return;
  }
  const themesObj = themes as Record<string, TokenObj>;
  for (const [rawMode, themeObj] of Object.entries(themesObj)) {
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
  const brandObj = brand as TokenObj;
  for (const rootKey of Object.keys(brandObj)) {
    if (rootKey === "themes") continue;
    const rootSection = brandObj[rootKey];
    if (
      rootSection == null ||
      typeof rootSection !== "object" ||
      Array.isArray(rootSection)
    )
      continue;
    for (const mode of THEMES_MODES) {
      collectThemeRows(
        rootSection as TokenObj,
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

// --- Ui-kit / Layer ---
function layerKeyToMode(layerKey: string): string {
  const i = LAYER_MODE_KEYS.indexOf(String(layerKey));
  return i >= 0 ? LAYER_MODES[i] : LAYER_DEFAULT_MODE;
}

function isLayerModeMap(obj: TokenObj | null): boolean {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj))
    return false;
  const keys = Object.keys(obj).filter((k) => !String(k).startsWith("$"));
  if (keys.length === 0) return false;
  return keys.every((k) => LAYER_MODE_KEYS.includes(k));
}

function collectUiKitVariableNames(
  obj: TokenObj | null,
  pathSegments: string[],
  namesSet: Set<string>,
): void {
  if (obj === null || typeof obj !== "object") return;
  if ("$value" in obj) {
    const path = pathSegments.join("/");
    if (path.startsWith(UIKIT_PREFIX))
      namesSet.add(path.slice(UIKIT_PREFIX.length));
    else namesSet.add(path);
    const v = obj.$value;
    if (isReference(v)) return;
    const vObj = v as Record<string, unknown> | null;
    if (
      typeof vObj === "object" &&
      vObj !== null &&
      !Array.isArray(vObj) &&
      !("components" in vObj) &&
      !("r" in vObj)
    ) {
      for (const key of Object.keys(vObj)) {
        if (key.startsWith("$")) continue;
        const child = vObj[key];
        if (
          child !== null &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          collectUiKitVariableNames(
            child as TokenObj,
            pathSegments.concat(key),
            namesSet,
          );
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
        ? Object.keys((obj as Record<string, TokenObj>)[layerKeys[0]]).filter(
            (k) => !String(k).startsWith("$"),
          )
        : [];
    for (const childKey of childKeys) {
      const child = (obj as Record<string, Record<string, TokenObj>>)[
        layerKeys[0]
      ]?.[childKey];
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
      collectUiKitVariableNames(
        value as TokenObj,
        pathSegments.concat(key),
        namesSet,
      );
    }
  }
}

type UiKitRow = [string, string, string | number, string, string];

function collectUiKitRows(
  obj: TokenObj | null,
  pathSegments: string[],
  rows: UiKitRow[],
  errors: string[],
  inheritedType: string | undefined,
  warnings: string[],
  modeOverride: string | null,
): void {
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
      const vObj = v as { value?: number; unit?: string } | null;
      if (
        typeof vObj === "object" &&
        vObj !== null &&
        "value" in vObj &&
        "unit" in vObj &&
        vObj.unit === "px" &&
        typeof vObj.value === "number"
      ) {
        rows.push([
          figmaVariableName,
          mode,
          vObj.value,
          FIGMA_TYPE_FLOAT,
          "false",
        ]);
        return;
      }
      if (
        typeof vObj === "object" &&
        vObj !== null &&
        "value" in vObj &&
        "unit" in vObj &&
        vObj.unit === "px" &&
        isReference(vObj.value)
      ) {
        const figmaType = tokenTypeToFigmaType(tokenType);
        rows.push([
          figmaVariableName,
          mode,
          vObj.value as string,
          figmaType,
          "true",
        ]);
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
      const vObj = v as { unit?: string; value?: number } | null;
      if (typeof vObj === "object" && vObj !== null && vObj.unit === "rem") {
        errors.push(
          `rem format is not supported at path: ${figmaVariableName}`,
        );
        return;
      }
      if (typeof vObj === "object" && vObj !== null && vObj.unit === "px") {
        if (typeof vObj.value === "number") {
          rows.push([
            figmaVariableName,
            mode,
            vObj.value,
            FIGMA_TYPE_FLOAT,
            "false",
          ]);
          return;
        }
        if (isReference(vObj.value)) {
          rows.push([
            figmaVariableName,
            mode,
            vObj.value as string,
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
          ? Object.keys((obj as Record<string, TokenObj>)[layerKeys[0]]).filter(
              (k) => !String(k).startsWith("$"),
            )
          : [];
      for (const childKey of childKeys) {
        for (const layerKey of layerKeys) {
          const child = (obj as Record<string, Record<string, TokenObj>>)[
            layerKey
          ]?.[childKey];
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
          value as TokenObj,
          pathSegments.concat(key),
          rows,
          errors,
          groupType,
          warnings,
          null,
        );
      }
    }
  }
}

/**
 * Transforms the three Recursica JSON roots into CsvRow[] (same shape as FigmaVariables.csv)
 * for consumption by applyVariableRows. Process order: tokens → brand/themes → ui-kit/layer.
 */
export function recursicaJsonToVariableRows(
  tokensRoot: unknown,
  brandRoot: unknown,
  uiKitRoot: unknown,
): RecursicaJsonToRowsResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const tokensData = tokensRoot as { tokens?: TokenObj } | TokenObj;
  const root = tokensData?.tokens != null ? tokensData.tokens : tokensData;
  if (root == null || typeof root !== "object") {
    errors.push(
      "tokens: missing or invalid root (expected object with tokens or raw tokens object)",
    );
    return { rows: [], errors, warnings };
  }

  const tokenRows: TokenRow[] = [];
  const tokenKeyToAliasPath = new Map<string, string>();
  collectTokens(
    root as TokenObj,
    ["tokens"],
    ["tokens"],
    tokenRows,
    errors,
    undefined,
    tokenKeyToAliasPath,
  );
  const tokenNames = new Set(tokenRows.map((r) => r[0]));

  const brandData = brandRoot as { brand?: TokenObj } | TokenObj;
  const brand = (brandData as { brand?: TokenObj }).brand ?? brandData;
  if (brand == null || typeof brand !== "object") {
    errors.push("brand: missing or invalid root");
    return {
      rows: buildCombinedRows([], [], []),
      errors,
      warnings,
    };
  }

  const brandNamesByTheme: Record<string, Set<string>> = {};
  const brandRefByTheme: Record<string, Map<string, string>> = {};
  const themes = (brand as TokenObj).themes;
  if (themes != null && typeof themes === "object") {
    const themesObj = themes as Record<string, TokenObj>;
    for (const [themeKey, themeObj] of Object.entries(themesObj)) {
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
  const brandObj = brand as TokenObj;
  for (const rootKey of Object.keys(brandObj)) {
    if (rootKey === "themes") continue;
    const rootSection = brandObj[rootKey];
    if (
      rootSection != null &&
      typeof rootSection === "object" &&
      !Array.isArray(rootSection)
    ) {
      for (const themeKey of Object.keys(brandNamesByTheme)) {
        collectBrandVariableNames(
          rootSection as TokenObj,
          [rootKey],
          brandNamesByTheme[themeKey],
          brandRefByTheme[themeKey],
        );
      }
    }
  }

  const registry: Registry = {
    tokens: tokenNames,
    tokenKeyToAliasPath,
    brandByTheme: brandNamesByTheme,
    brandRefByTheme,
    "ui-kit": new Set(),
  };

  const themeRows: ThemeRow[] = [];
  processBrandToThemeRows(brandData, themeRows, errors, warnings);
  const themeRowsWithResolvedAliases: ThemeRow[] = themeRows.map((row) => {
    const [figmaVariableName, mode, value, type, alias] = row;
    const currentThemeKey = (mode as string)?.toLowerCase();
    const location = `brand.themes.${currentThemeKey}.${figmaVariableName.replace(/\//g, ".")}`;
    if (alias === "true" && isReference(value)) {
      try {
        const { value: figmaPathValue, warning } = resolveAndValidateAlias(
          value,
          registry,
          currentThemeKey,
          location,
        );
        if (warning) warnings.push(warning);
        return [figmaVariableName, mode, figmaPathValue, type, "true"];
      } catch {
        errors.push(
          `At ${location}: invalid reference ${value} (target variable does not exist; DTCG requires references to tokens, not groups)`,
        );
        return [figmaVariableName, mode, value as string, type, "true"];
      }
    }
    return row;
  });

  const uiKitData = uiKitRoot as { "ui-kit"?: TokenObj } | TokenObj;
  const uiKitRootObj =
    (uiKitData as { "ui-kit"?: TokenObj })["ui-kit"] != null
      ? (uiKitData as { "ui-kit": TokenObj })["ui-kit"]
      : uiKitData;
  if (uiKitRootObj == null || typeof uiKitRootObj !== "object") {
    return {
      rows: buildCombinedRows(tokenRows, themeRowsWithResolvedAliases, []),
      errors,
      warnings,
    };
  }

  const uiKitNames = new Set<string>();
  collectUiKitVariableNames(
    uiKitRootObj as TokenObj,
    [UIKIT_PREFIX.replace("/", "")],
    uiKitNames,
  );
  registry["ui-kit"] = uiKitNames;

  const uiKitRows: UiKitRow[] = [];
  collectUiKitRows(
    uiKitRootObj as TokenObj,
    [UIKIT_PREFIX.replace("/", "")],
    uiKitRows,
    errors,
    undefined,
    warnings,
    null,
  );

  const UIKIT_THEME_FOR_BRAND_REFS = "light";
  const uiKitRowsWithResolvedAliases: UiKitRow[] = uiKitRows.map((row) => {
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
        if (warning) warnings.push(warning);
        return [figmaVariableName, mode, figmaPathValue, type, "true"];
      } catch {
        errors.push(
          `At ${location}: invalid reference ${value} (target variable does not exist; DTCG requires references to tokens, not groups)`,
        );
        return [figmaVariableName, mode, value as string, type, "true"];
      }
    }
    return row;
  });

  const layerRowsByVariable = new Map<string, UiKitRow[]>();
  for (const row of uiKitRowsWithResolvedAliases) {
    const [figmaVariableName, mode, value, type, alias] = row;
    if (!layerRowsByVariable.has(figmaVariableName))
      layerRowsByVariable.set(figmaVariableName, []);
    layerRowsByVariable
      .get(figmaVariableName)!
      .push([figmaVariableName, mode, value, type, alias]);
  }
  const layerRows: Array<
    [string, string, string | number, string, string, string]
  > = [];
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
      for (const m of LAYER_MODES) {
        const defaultMode = m === LAYER_DEFAULT_MODE ? "true" : "false";
        layerRows.push([figmaVariableName, m, value, type, alias, defaultMode]);
      }
    }
  }

  const combined = buildCombinedRows(
    tokenRows,
    themeRowsWithResolvedAliases,
    layerRows,
  );
  return { rows: combined, errors, warnings };
}

function buildCombinedRows(
  tokenRows: TokenRow[],
  themeRowsWithResolvedAliases: ThemeRow[],
  layerRows: Array<[string, string, string | number, string, string, string]>,
): CsvRow[] {
  const out: CsvRow[] = [];
  for (const row of tokenRows) {
    const [figmaVariableName, value, type, alias] = row;
    out.push({
      collection: "tokens",
      figmaVariableName,
      mode: "",
      value: String(value),
      type,
      alias,
      defaultMode: "true",
    });
  }
  for (const row of themeRowsWithResolvedAliases) {
    const [figmaVariableName, mode, value, type, alias] = row;
    const defaultMode = mode === THEMES_DEFAULT_MODE ? "true" : "false";
    out.push({
      collection: "themes",
      figmaVariableName,
      mode,
      value: String(value),
      type,
      alias,
      defaultMode,
    });
  }
  for (const row of layerRows) {
    const [figmaVariableName, mode, value, type, alias, defaultMode] = row;
    out.push({
      collection: "layer",
      figmaVariableName,
      mode,
      value: String(value),
      type,
      alias,
      defaultMode,
    });
  }
  return out;
}
