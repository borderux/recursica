/**
 * Creates Figma Text Styles from brand.typography variables in the Themes collection.
 * Runs after variable import. See docs/TEXT-STYLES-IMPORT.md for design.
 */

const TYPOGRAPHY_VAR_PREFIX = "typography/";
const THEMES_COLLECTION_NAME = "Themes";

/** Expected typography property keys (variable name segment after style name). Missing = warn. */
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
    console.log(msg);
    log?.(msg);
    return null;
  }
  if (isVariableAlias(raw)) {
    const msg = `[resolve] ${variable.name}: alias → ${raw.id}`;
    console.log(msg);
    log?.(msg);
    const target = await figma.variables.getVariableByIdAsync(raw.id);
    if (!target) {
      const err = `[resolve] alias target not found: ${raw.id}`;
      console.log(err);
      log?.(err);
      return null;
    }
    return resolveVariableValue(target, collections, log);
  }
  if (typeof raw === "number" || typeof raw === "string") {
    const msg = `[resolve] ${variable.name}: literal ${typeof raw} = ${typeof raw === "string" ? JSON.stringify(raw) : raw}`;
    console.log(msg);
    log?.(msg);
    return raw;
  }
  if (typeof raw === "object" && raw !== null && "r" in raw) {
    const msg = `[resolve] ${variable.name}: literal COLOR`;
    console.log(msg);
    log?.(msg);
    return raw as RGB;
  }
  const msg = `[resolve] ${variable.name}: unhandled value type`;
  console.log(msg);
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
function toTextCase(value: string | number | null): TextCase | undefined {
  if (value == null) return undefined;
  const s = String(value).toUpperCase().replace(/-/g, "_");
  if (s === "NONE" || s === "ORIGINAL") return "ORIGINAL";
  if (s === "UPPER") return "UPPER";
  if (s === "LOWER") return "LOWER";
  if (s === "TITLE") return "TITLE";
  if (s === "SMALL_CAPS") return "SMALL_CAPS";
  if (s === "SMALL_CAPS_FORCED") return "SMALL_CAPS_FORCED";
  return undefined;
}

/** Map our text-decoration value to Figma TextDecoration. */
function toTextDecoration(
  value: string | number | null,
): TextDecoration | undefined {
  if (value == null) return undefined;
  const s = String(value).toUpperCase();
  if (s === "NONE") return "NONE";
  if (s === "UNDERLINE") return "UNDERLINE";
  if (s === "STRIKETHROUGH") return "STRIKETHROUGH";
  return undefined;
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
  const weight = fontWeight != null ? String(fontWeight) : "";
  if (style === "italic") return "Italic";
  if (weight === "bold" || weight === "700") return "Bold";
  if (weight === "600" || weight === "semi-bold") return "SemiBold";
  if (weight === "500" || weight === "medium") return "Medium";
  if (weight === "300" || weight === "light") return "Light";
  return "Regular";
}

export async function createTextStylesFromTypography(): Promise<CreateTextStylesFromTypographyResult> {
  const result: CreateTextStylesFromTypographyResult = {
    textStylesCreated: 0,
    textStylesSkipped: 0,
    textStyleWarnings: [],
  };

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const themesCollection = collections.find(
    (c) => c.name === THEMES_COLLECTION_NAME,
  );
  if (!themesCollection) return result;

  const variablesByStyle = new Map<
    string,
    Map<TypographyPropertyKey, Variable>
  >();
  for (const varId of themesCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (!variable || !variable.name.startsWith(TYPOGRAPHY_VAR_PREFIX)) continue;
    const rest = variable.name.slice(TYPOGRAPHY_VAR_PREFIX.length);
    const parts = rest.split("/");
    if (parts.length < 2) continue;
    const styleName = parts[0];
    const propKey = parts.slice(1).join("/") as TypographyPropertyKey;
    if (!TYPOGRAPHY_PROPERTY_KEYS.includes(propKey)) continue;
    if (!variablesByStyle.has(styleName)) {
      variablesByStyle.set(
        styleName,
        new Map<TypographyPropertyKey, Variable>(),
      );
    }
    variablesByStyle.get(styleName)!.set(propKey, variable);
  }

  if (variablesByStyle.size === 0) return result;

  const existingTextStyles = await figma.getLocalTextStylesAsync();

  for (const [styleName, propVars] of variablesByStyle) {
    const existing = existingTextStyles.find((s) => s.name === styleName);
    if (existing) {
      result.textStylesSkipped++;
      continue;
    }

    const warnings: string[] = [];
    const fontFamilyVar = propVars.get("font-family");
    if (!fontFamilyVar) {
      warnings.push(
        `Typography style "${styleName}": missing font-family; skipping creation.`,
      );
      result.textStyleWarnings.push(...warnings);
      continue;
    }

    const resolveLog: string[] = [];
    console.log(
      `[createTextStyles] Resolving font-family for style "${styleName}" (var: ${fontFamilyVar.name})`,
    );
    const fontFamily = await resolveVariableValue(
      fontFamilyVar,
      collections,
      (msg) => resolveLog.push(msg),
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
      continue;
    }

    const fontFamilyStr = parseFirstFontFamily(fontFamilyRaw);

    const fontStyleVar = propVars.get("font-style");
    const fontWeightVar = propVars.get("font-weight");
    const fontStyleVal = fontStyleVar
      ? await resolveVariableValue(fontStyleVar, collections)
      : null;
    const fontWeightVal = fontWeightVar
      ? await resolveVariableValue(fontWeightVar, collections)
      : null;
    const fontStyleName = toFontStyleName(
      toLiteralOrNull(fontStyleVal),
      toLiteralOrNull(fontWeightVal),
    );

    for (const key of TYPOGRAPHY_PROPERTY_KEYS) {
      if (!propVars.has(key)) {
        warnings.push(
          `Typography style "${styleName}": missing property "${key}".`,
        );
      }
    }
    result.textStyleWarnings.push(...warnings);

    try {
      await figma.loadFontAsync({
        family: fontFamilyStr,
        style: fontStyleName,
      });
    } catch {
      result.textStyleWarnings.push(
        `Typography style "${styleName}": could not load font "${fontFamilyStr}" / "${fontStyleName}" (from "${fontFamilyRaw}"); skipping.`,
      );
      continue;
    }

    const textStyle = figma.createTextStyle();
    textStyle.name = styleName;
    textStyle.fontName = { family: fontFamilyStr, style: fontStyleName };

    // Bind typography variables so style updates when variables change (matches design files).
    // Figma only allows: fontFamily | fontSize | fontStyle | fontWeight | letterSpacing | lineHeight | paragraphSpacing | paragraphIndent.
    const bindableFields: Array<{
      key: TypographyPropertyKey;
      field: "fontSize" | "letterSpacing" | "lineHeight";
    }> = [
      { key: "font-size", field: "fontSize" },
      { key: "letter-spacing", field: "letterSpacing" },
      { key: "line-height", field: "lineHeight" },
    ];
    for (const { key, field } of bindableFields) {
      const variable = propVars.get(key);
      if (variable) {
        textStyle.setBoundVariable(field, variable);
      }
    }

    // textCase and textDecoration are not bindable; set from resolved values.
    const textCaseVar = propVars.get("text-case");
    if (textCaseVar) {
      const v = await resolveVariableValue(textCaseVar, collections);
      const tc = toTextCase(toLiteralOrNull(v));
      if (tc) textStyle.textCase = tc;
    }
    const textDecorationVar = propVars.get("text-decoration");
    if (textDecorationVar) {
      const v = await resolveVariableValue(textDecorationVar, collections);
      const td = toTextDecoration(toLiteralOrNull(v));
      if (td) textStyle.textDecoration = td;
    }

    result.textStylesCreated++;
  }

  return result;
}
