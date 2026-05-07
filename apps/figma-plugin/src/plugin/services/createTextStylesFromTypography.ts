/**
 * Creates Figma Text Styles from parsed typography rows.
 * Runs after variable import. See docs/TEXT-STYLES-IMPORT.md for design.
 */

import type { CsvRow } from "./importVariablesCsv";

const TYPOGRAPHY_VAR_PREFIX = "typography/";
const TEXT_STYLE_FOLDER_NAME = "Recursica";
const TEXT_STYLE_NAME_PREFIX = "recursica_";

/** Typography property keys (variable name segment after style name). Only font-family is required to create a style; others use Figma defaults if missing. */
export const TYPOGRAPHY_PROPERTY_KEYS = [
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "line-height",
  "text-case",
  "text-decoration",
] as const;

export type TypographyPropertyKey = (typeof TYPOGRAPHY_PROPERTY_KEYS)[number];

export interface CreateTextStylesFromTypographyResult {
  textStylesCreated: number;
  textStylesUpdated: number;
  textStylesSkipped: number;
  textStyleWarnings: string[];
}

function isVariableAlias(v: VariableValue): v is VariableAlias {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as { type: string }).type === "VARIABLE_ALIAS"
  );
}

/**
 * Find the collection that contains this variable and return its first mode id.
 * Each variable's valuesByMode is keyed by its own collection's mode ids.
 */
function getModeIdForVariable(
  variableId: string,
  collections: VariableCollection[],
): string | null {
  for (const coll of collections) {
    if (coll.variableIds.includes(variableId) && coll.modes.length > 0) {
      return coll.modes[0].modeId;
    }
  }
  return null;
}

/** Resolve variable value, following aliases to a literal. Uses each variable's own collection mode. */
async function resolveVariableValue(
  variable: Variable,
  collections: VariableCollection[],
  log?: (msg: string) => void,
): Promise<string | number | RGB | null> {
  const modeId = getModeIdForVariable(variable.id, collections);
  if (!modeId) {
    log?.(
      `  [resolve] no mode for variable ${variable.name} (id: ${variable.id})`,
    );
    return null;
  }
  const raw = variable.valuesByMode[modeId];
  if (raw === undefined) {
    const msg = `[resolve] ${variable.name}: no value for modeId (keys: ${Object.keys(variable.valuesByMode).join(",")})`;
    log?.(msg);
    return null;
  }
  if (isVariableAlias(raw)) {
    const msg = `[resolve] ${variable.name}: alias → ${raw.id}`;
    log?.(msg);
    const target = await figma.variables.getVariableByIdAsync(raw.id);
    if (!target) {
      const err = `[resolve] alias target not found: ${raw.id}`;
      log?.(err);
      return null;
    }
    return resolveVariableValue(target, collections, log);
  }
  if (typeof raw === "number" || typeof raw === "string") {
    const msg = `[resolve] ${variable.name}: literal ${typeof raw} = ${typeof raw === "string" ? JSON.stringify(raw) : raw}`;
    log?.(msg);
    return raw;
  }
  if (typeof raw === "object" && raw !== null && "r" in raw) {
    const msg = `[resolve] ${variable.name}: literal COLOR`;
    log?.(msg);
    return raw as RGB;
  }
  const msg = `[resolve] ${variable.name}: unhandled value type`;
  log?.(msg);
  return null;
}

/** Narrow resolved variable value to string/number for typography (font style, text case, decoration). RGB is not used. */
function toLiteralOrNull(
  v: string | number | RGB | null,
): string | number | null {
  if (v == null || typeof v === "string" || typeof v === "number") return v;
  return null;
}

/** Map our text-case value to Figma TextCase. */
function toTextCase(value: string | number | null): TextCase {
  if (value == null) return "ORIGINAL";
  const s = String(value).toUpperCase().replace(/-/g, "_");
  if (s === "NONE" || s === "ORIGINAL" || s === "NORMAL") return "ORIGINAL";
  if (s === "UPPER" || s === "UPPERCASE") return "UPPER";
  if (s === "LOWER" || s === "LOWERCASE") return "LOWER";
  if (s === "TITLE" || s === "CAPITALIZE") return "TITLE";
  if (s === "SMALL_CAPS") return "SMALL_CAPS";
  if (s === "SMALL_CAPS_FORCED") return "SMALL_CAPS_FORCED";
  return "ORIGINAL";
}

/** Map our text-decoration value to Figma TextDecoration. */
function toTextDecoration(value: string | number | null): TextDecoration {
  if (value == null) return "NONE";
  const s = String(value).toUpperCase().replace(/-/g, "_");
  if (s === "NONE" || s === "NORMAL") return "NONE";
  if (s === "UNDERLINE") return "UNDERLINE";
  if (s === "STRIKETHROUGH" || s === "LINE_THROUGH") return "STRIKETHROUGH";
  return "NONE";
}

/** Parse first font family from a CSS-style font stack (e.g. "Lexend, sans-serif" → "Lexend"). */
function parseFirstFontFamily(value: string): string {
  const first = value.split(",")[0]?.trim();
  return first ?? value.trim();
}

/** Map font-style / font-weight to Figma font style name (e.g. "Regular", "Bold"). */
function toFontStyleName(
  fontStyle: string | number | null,
  fontWeight: string | number | null,
): string {
  const style = fontStyle != null ? String(fontStyle).toLowerCase() : "";
  const weightStr = fontWeight != null ? String(fontWeight).toLowerCase() : "";

  // 1. Map weight to standard Figma names
  let weightName = "";
  if (weightStr === "100" || weightStr === "thin") weightName = "Thin";
  else if (
    weightStr === "200" ||
    weightStr === "extra-light" ||
    weightStr === "extralight"
  )
    weightName = "Extra Light";
  else if (weightStr === "300" || weightStr === "light") weightName = "Light";
  else if (weightStr === "500" || weightStr === "medium") weightName = "Medium";
  else if (
    weightStr === "600" ||
    weightStr === "semi-bold" ||
    weightStr === "semibold"
  )
    weightName = "Semi Bold";
  else if (weightStr === "700" || weightStr === "bold") weightName = "Bold";
  else if (
    weightStr === "800" ||
    weightStr === "extra-bold" ||
    weightStr === "extrabold"
  )
    weightName = "Extra Bold";
  else if (weightStr === "900" || weightStr === "black") weightName = "Black";
  // 400/Regular stays as empty string for concatenation

  const isItalic = style === "italic" || style === "oblique";

  // 2. Handle Italic/Oblique concatenation
  if (isItalic) {
    // For weight 400 (empty string), return just "Italic"
    // For other weights, return "Bold Italic", "Light Italic", etc.
    return weightName ? `${weightName} Italic` : "Italic";
  }

  // 3. Handle Normal/Regular
  return weightName || "Regular";
}

export async function createTextStylesFromTypography(
  typographyRows: CsvRow[] = [],
  allRows: CsvRow[] = [],
): Promise<CreateTextStylesFromTypographyResult> {
  const result: CreateTextStylesFromTypographyResult = {
    textStylesCreated: 0,
    textStylesUpdated: 0,
    textStylesSkipped: 0,
    textStyleWarnings: [],
  };

  if (typographyRows.length === 0) return result;

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allLocalVariables = await figma.variables.getLocalVariablesAsync();

  // Create lookup for all variables
  const variableByKey = new Map<string, Variable>();
  for (const variable of allLocalVariables) {
    const coll = collections.find(
      (c) => c.id === variable.variableCollectionId,
    );
    if (!coll) continue;
    let collKey = coll.name.toLowerCase();
    if (collKey === "theme" || collKey === "themes") collKey = "themes";
    else if (collKey === "layer") collKey = "layer";
    else if (collKey === "tokens") collKey = "tokens";

    variableByKey.set(`${collKey}/${variable.name}`, variable);
  }

  const variablesByStyle = new Map<
    string,
    Map<TypographyPropertyKey, Variable | string | number>
  >();

  for (const row of typographyRows) {
    if (!row.figmaVariableName.startsWith(TYPOGRAPHY_VAR_PREFIX)) continue;
    const rest = row.figmaVariableName.slice(TYPOGRAPHY_VAR_PREFIX.length);
    const parts = rest.split("/");
    if (parts.length < 2) continue;
    const styleName = parts[0];
    const propKey = parts.slice(1).join("/") as TypographyPropertyKey;
    if (!TYPOGRAPHY_PROPERTY_KEYS.includes(propKey)) continue;

    if (!variablesByStyle.has(styleName)) {
      variablesByStyle.set(
        styleName,
        new Map<TypographyPropertyKey, Variable | string | number>(),
      );
    }
    const styleMap = variablesByStyle.get(styleName)!;

    if (row.alias === "true") {
      let targetKey = row.value.trim();
      if (targetKey.toLowerCase().startsWith("brand/")) {
        targetKey = "themes/" + targetKey.slice(6);
      } else if (targetKey.toLowerCase().startsWith("ui-kit/")) {
        targetKey = "layer/" + targetKey.slice(7);
      } else if (targetKey.toLowerCase().startsWith("tokens/")) {
        targetKey = "tokens/" + targetKey.slice(7);
      }

      const targetVar = variableByKey.get(targetKey);
      if (targetVar) {
        styleMap.set(propKey, targetVar);
      } else {
        result.textStyleWarnings.push(
          `Typography style "${styleName}": could not resolve reference "${row.value}" for property "${propKey}"`,
        );
      }
    } else {
      const rawVal = row.type === "FLOAT" ? Number(row.value) : row.value;
      styleMap.set(propKey, rawVal);
    }
  }

  console.log(
    `[createTextStyles] Found ${variablesByStyle.size} distinct typography styles from rows.`,
  );

  if (variablesByStyle.size === 0) return result;

  const existingTextStyles = await figma.getLocalTextStylesAsync();
  console.log(
    `[createTextStyles] Found ${existingTextStyles.length} existing text styles.`,
  );

  async function resolveEntry(
    entry: Variable | string | number | undefined,
    log?: (msg: string) => void,
  ): Promise<string | number | RGB | null> {
    if (entry === undefined) return null;
    if (typeof entry === "string" || typeof entry === "number") return entry;
    return await resolveVariableValue(entry, collections, log);
  }

  function resolveEntryUnit(
    entry: Variable | string | number | undefined,
  ): string | undefined {
    if (entry === undefined) return undefined;
    if (typeof entry === "object" && "name" in entry) {
      // Find the variable's row in allRows to retrieve its unit
      const name = entry.name;
      // Note: allRows has figmaVariableName without the collection prefix.
      const row = allRows.find(
        (r) =>
          r.figmaVariableName === name &&
          (r.collection.toLowerCase() === "tokens" ||
            r.collection.toLowerCase() === "themes"),
      );
      return row?.unit;
    }
    return undefined;
  }

  for (const [styleName, propVars] of variablesByStyle) {
    const figmaStyleName = `${TEXT_STYLE_FOLDER_NAME}/${TEXT_STYLE_NAME_PREFIX}${styleName}`;
    const existing = existingTextStyles.find((s) => s.name === figmaStyleName);

    let textStyle: TextStyle;
    if (existing) {
      textStyle = existing;
      result.textStylesUpdated++;
    } else {
      textStyle = figma.createTextStyle();
      textStyle.name = figmaStyleName;
      result.textStylesCreated++;
    }

    const warnings: string[] = [];
    const fontFamilyEntry = propVars.get("font-family");
    if (fontFamilyEntry === undefined) {
      console.log(
        `[createTextStyles] Style ${styleName} missing font-family variable.`,
      );
      warnings.push(
        `Typography style "${styleName}": missing font-family; skipping creation.`,
      );
      result.textStyleWarnings.push(...warnings);
      result.textStylesSkipped++;
      continue;
    }

    const resolveLog: string[] = [];
    const fontFamily = await resolveEntry(fontFamilyEntry, (msg) =>
      resolveLog.push(msg),
    );
    const fontFamilyRaw = typeof fontFamily === "string" ? fontFamily : null;
    if (!fontFamilyRaw) {
      warnings.push(
        `Typography style "${styleName}": font-family could not be resolved; skipping.`,
      );
      if (resolveLog.length > 0) {
        warnings.push(`  Debug: ${resolveLog.join(" | ")}`);
      }
      result.textStyleWarnings.push(...warnings);
      result.textStylesSkipped++;
      continue;
    }

    const fontFamilyStr = parseFirstFontFamily(fontFamilyRaw);

    const fontStyleEntry = propVars.get("font-style");
    const fontWeightEntry = propVars.get("font-weight");
    const fontStyleVal = await resolveEntry(fontStyleEntry);
    const fontWeightVal = await resolveEntry(fontWeightEntry);
    const fontStyleName = toFontStyleName(
      toLiteralOrNull(fontStyleVal),
      toLiteralOrNull(fontWeightVal),
    );

    let fontLoaded = false;
    let finalFontStyleName = fontStyleName;
    try {
      await figma.loadFontAsync({
        family: fontFamilyStr,
        style: fontStyleName,
      });
      fontLoaded = true;
    } catch {
      if (fontStyleName !== "Regular") {
        try {
          await figma.loadFontAsync({
            family: fontFamilyStr,
            style: "Regular",
          });
          fontLoaded = true;
          finalFontStyleName = "Regular";
          result.textStyleWarnings.push(
            `Typography style "${styleName}": could not load font "${fontFamilyStr}" / "${fontStyleName}". Falling back to "Regular".`,
          );
        } catch {
          // both failed
        }
      }

      if (!fontLoaded) {
        result.textStyleWarnings.push(
          `Typography style "${styleName}": could not load font "${fontFamilyStr}" / "${fontStyleName}" (from "${fontFamilyRaw}"); skipping.`,
        );
      }
    }

    if (!fontLoaded) {
      result.textStylesSkipped++;
      continue;
    }

    textStyle.fontName = { family: fontFamilyStr, style: finalFontStyleName };

    // Bind typography variables so style updates when variables change (matches design files).
    // Figma only allows bindings to actual Variables
    const bindableFields: Array<{
      key: TypographyPropertyKey;
      field: "fontSize";
    }> = [{ key: "font-size", field: "fontSize" }];
    for (const { key, field } of bindableFields) {
      const entry = propVars.get(key);
      if (entry && typeof entry === "object" && "id" in entry) {
        textStyle.setBoundVariable(field, entry);
      } else if (entry !== undefined) {
        // If it's a literal value, we can't bind it, so we just set the raw value
        if (field === "fontSize") {
          const val =
            typeof entry === "number" ? entry : parseFloat(String(entry));
          if (!Number.isNaN(val)) textStyle.fontSize = val;
        }
      }
    }

    // `line-height` resolves to a multiplier in our tokens, so we calc an absolute pixel value.
    const lineHeightEntry = propVars.get("line-height");
    const fontSizeEntry = propVars.get("font-size");
    if (lineHeightEntry !== undefined && fontSizeEntry !== undefined) {
      const lhVal = await resolveEntry(lineHeightEntry);
      const fsVal = await resolveEntry(fontSizeEntry);

      const parsedLh =
        typeof lhVal === "number" ? lhVal : parseFloat(String(lhVal));
      const parsedFs =
        typeof fsVal === "number" ? fsVal : parseFloat(String(fsVal));

      if (!Number.isNaN(parsedLh) && !Number.isNaN(parsedFs)) {
        const unit = resolveEntryUnit(lineHeightEntry);
        // If unit is explicitly px, use raw value. Otherwise default to em multiplier.
        const absolutePixelLh = unit === "px" ? parsedLh : parsedLh * parsedFs;
        textStyle.lineHeight = {
          value: absolutePixelLh,
          unit: "PIXELS",
        };
      }
    }

    // `letter-spacing` resolves to a multiplier in our tokens, so we calc an absolute pixel value.
    const letterSpacingEntry = propVars.get("letter-spacing");
    if (letterSpacingEntry !== undefined && fontSizeEntry !== undefined) {
      const lsVal = await resolveEntry(letterSpacingEntry);
      const fsVal = await resolveEntry(fontSizeEntry);

      const parsedLs =
        typeof lsVal === "number" ? lsVal : parseFloat(String(lsVal));
      const parsedFs =
        typeof fsVal === "number" ? fsVal : parseFloat(String(fsVal));

      if (!Number.isNaN(parsedLs) && !Number.isNaN(parsedFs)) {
        const unit = resolveEntryUnit(letterSpacingEntry);
        // If unit is explicitly px, use raw value. Otherwise default to em multiplier.
        const absolutePixelLs = unit === "px" ? parsedLs : parsedLs * parsedFs;

        textStyle.letterSpacing = {
          value: absolutePixelLs,
          unit: "PIXELS",
        };
      }
    }

    // textCase and textDecoration are not bindable; set from resolved values.
    const textCaseEntry = propVars.get("text-case");
    const resolvedTc = await resolveEntry(textCaseEntry);
    textStyle.textCase = toTextCase(toLiteralOrNull(resolvedTc));

    const textDecorationEntry = propVars.get("text-decoration");
    const resolvedTd = await resolveEntry(textDecorationEntry);
    textStyle.textDecoration = toTextDecoration(toLiteralOrNull(resolvedTd));
  }

  return result;
}
