/**
 * Creates Figma Effect Styles from elevations in the Themes collection.
 * Runs after variable import. One Effect style per elevation name (e.g. elevation-0).
 * If an Effect style with that name already exists, skip (so first theme/mode wins).
 * See docs/EFFECT-STYLES-IMPORT.md.
 */

import { getFixedGuidForCollection } from "../../const/CollectionConstants";

const ELEVATION_VAR_PREFIX = "elevations/";
const COLLECTION_GUID_KEY = "recursica:collectionId";
const THEMES_COLLECTION_NAMES = ["Themes", "Theme"];
const EFFECT_STYLE_FOLDER_NAME = "Recursica";
const EFFECT_STYLE_NAME_PREFIX = "recursica_";

export interface CreateEffectStylesFromElevationsResult {
  effectStylesCreated: number;
  effectStylesUpdated: number;
  effectStylesSkipped: number;
  effectStyleWarnings: string[];
}

/**
 * Find the collection that contains this variable and return its first mode id.
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

/** Parse elevation JSON string (x, y, blur, spread, color ref, opacity) into numbers + color ref. */
function parseElevationValue(raw: string): {
  x: number;
  y: number;
  blur: number;
  spread: number;
  opacityPct: number;
  colorRef: string | null;
} | null {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
  const getNum = (obj: unknown, defaultVal: number): number => {
    if (!obj || typeof obj !== "object") return defaultVal;
    const o = obj as Record<string, unknown>;
    const v = (o.$value as { value?: number } | undefined)?.value ?? o.value;
    return typeof v === "number" && !Number.isNaN(v) ? v : defaultVal;
  };
  const x = getNum(parsed.x, 0);
  const y = getNum(parsed.y, 0);
  const blur = getNum(parsed.blur, 0);
  const spread = getNum(parsed.spread, 0);
  const opacityPct = getNum(parsed.opacity, 10);
  let colorRef: string | null = null;
  const colorObj = parsed.color;
  if (colorObj && typeof colorObj === "object") {
    const co = colorObj as Record<string, unknown>;
    const v = (co.$value as string | undefined) ?? co.value;
    if (typeof v === "string") colorRef = v;
  }
  return { x, y, blur, spread, opacityPct, colorRef };
}

function isVariableAlias(v: VariableValue): v is VariableAlias {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as { type: string }).type === "VARIABLE_ALIAS"
  );
}

/** Resolve variable to a literal (follow aliases). Uses variable's collection first mode. */
async function resolveVariableValue(
  variable: Variable,
  collections: VariableCollection[],
): Promise<string | number | RGB | null> {
  const modeId = getModeIdForVariable(variable.id, collections);
  if (!modeId) return null;
  const raw = variable.valuesByMode[modeId];
  if (raw === undefined) return null;
  if (isVariableAlias(raw)) {
    const target = await figma.variables.getVariableByIdAsync(raw.id);
    if (!target) return null;
    return resolveVariableValue(target, collections);
  }
  if (typeof raw === "number" || typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null && "r" in raw) return raw as RGB;
  return null;
}

/** Normalize a token ref (e.g. "{brand.palettes...}") to a path for matching variable names. */
function refToPath(ref: string): string {
  return ref.replace(/^\{|\}$/g, "").replace(/\./g, "/");
}

/** Resolve a color ref to the COLOR Variable so we can bind it; returns null if not found. */
async function resolveColorRefToVariable(
  ref: string,
  collections: VariableCollection[],
): Promise<Variable | null> {
  const path = refToPath(ref);
  const pathWithoutBrand = path.replace(/^brand\/?/, "");
  for (const coll of collections) {
    for (const varId of coll.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (!variable || variable.resolvedType !== "COLOR") continue;
      const name = variable.name;
      if (
        name === pathWithoutBrand ||
        name === path ||
        path.endsWith(name) ||
        pathWithoutBrand.endsWith(name) ||
        pathWithoutBrand.startsWith(name + "/")
      ) {
        return variable;
      }
    }
  }
  return null;
}

/** Build a Figma DROP_SHADOW effect from parsed elevation + optional resolved color. */
function toDropShadow(
  parsed: {
    x: number;
    y: number;
    blur: number;
    spread: number;
    opacityPct: number;
  },
  color: RGB | null,
): DropShadowEffect {
  const a = Math.max(0, Math.min(1, parsed.opacityPct / 100));
  const rgb = color ?? { r: 0, g: 0, b: 0 };
  return {
    type: "DROP_SHADOW",
    color: { ...rgb, a },
    offset: { x: parsed.x, y: parsed.y },
    radius: parsed.blur,
    spread: parsed.spread,
    visible: true,
    blendMode: "NORMAL",
  };
}

export async function createEffectStylesFromElevations(): Promise<CreateEffectStylesFromElevationsResult> {
  const result: CreateEffectStylesFromElevationsResult = {
    effectStylesCreated: 0,
    effectStylesUpdated: 0,
    effectStylesSkipped: 0,
    effectStyleWarnings: [],
  };

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const themesGuid = getFixedGuidForCollection("Themes");
  let themesCollection = themesGuid
    ? collections.find(
        (c) =>
          c.getSharedPluginData("recursica", COLLECTION_GUID_KEY) ===
          themesGuid,
      )
    : undefined;

  if (!themesCollection) {
    themesCollection = collections.find((c) =>
      THEMES_COLLECTION_NAMES.includes(c.name),
    );
  }

  if (!themesCollection) {
    console.log(
      `[createEffectStyles] No Themes collection found. Collections: ${collections.map((c) => c.name).join(", ")}`,
    );
    return result;
  }

  console.log(
    `[createEffectStyles] Found Themes collection (id: ${themesCollection.id})`,
  );

  const elevationVariables: { name: string; variable: Variable }[] = [];
  const allLocalVariables = await figma.variables.getLocalVariablesAsync();
  console.log(
    `[createEffectStyles] Fetched ${allLocalVariables.length} total local variables.`,
  );
  for (const variable of allLocalVariables) {
    if (variable.variableCollectionId !== themesCollection.id) continue;
    if (!variable.name.includes(ELEVATION_VAR_PREFIX)) continue;
    const parts = variable.name.split(ELEVATION_VAR_PREFIX);
    const elevationName = parts[parts.length - 1];
    if (!elevationName) continue;
    elevationVariables.push({ name: elevationName, variable });
  }

  console.log(
    `[createEffectStyles] Found ${elevationVariables.length} elevation variables in Themes collection.`,
  );

  if (elevationVariables.length === 0) return result;

  const existingEffectStyles = await figma.getLocalEffectStylesAsync();
  console.log(
    `[createEffectStyles] Found ${existingEffectStyles.length} existing effect styles.`,
  );
  const createdNames = new Set<string>();

  for (const { name: elevationName, variable } of elevationVariables) {
    if (createdNames.has(elevationName)) {
      console.log(
        `[createEffectStyles] Already processed ${elevationName} in this run.`,
      );
      continue;
    }
    const figmaStyleName = `${EFFECT_STYLE_FOLDER_NAME}/${EFFECT_STYLE_NAME_PREFIX}${elevationName}`;
    const existing = existingEffectStyles.find(
      (s) => s.name === figmaStyleName,
    );

    let style: EffectStyle;
    if (existing) {
      style = existing;
      result.effectStylesUpdated++;
    } else {
      style = figma.createEffectStyle();
      style.name = figmaStyleName;
      result.effectStylesCreated++;
    }

    createdNames.add(elevationName);

    const modeId = getModeIdForVariable(variable.id, collections);
    if (!modeId) {
      console.log(
        `[createEffectStyles] No mode ID for ${elevationName} (var: ${variable.id})`,
      );
      result.effectStyleWarnings.push(
        `Elevation "${elevationName}": no mode; skipping.`,
      );
      result.effectStylesSkipped++;
      continue;
    }
    const rawValue = await resolveVariableValue(variable, collections);
    if (typeof rawValue !== "string") {
      console.log(
        `[createEffectStyles] ${elevationName} value is not a string (type: ${typeof rawValue}, val: ${JSON.stringify(rawValue)})`,
      );
      result.effectStyleWarnings.push(
        `Elevation "${elevationName}": value is not a string; skipping.`,
      );
      result.effectStylesSkipped++;
      continue;
    }

    const parsed = parseElevationValue(rawValue);
    if (!parsed) {
      result.effectStyleWarnings.push(
        `Elevation "${elevationName}": could not parse value; skipping.`,
      );
      result.effectStylesSkipped++;
      continue;
    }

    let colorRgb: RGB | null = null;
    let colorVariable: Variable | null = null;
    if (parsed.colorRef) {
      colorVariable = await resolveColorRefToVariable(
        parsed.colorRef,
        collections,
      );
      if (colorVariable) {
        const v = await resolveVariableValue(colorVariable, collections);
        if (v && typeof v === "object" && "r" in v) colorRgb = v as RGB;
      }
    }
    let effect = toDropShadow(parsed, colorRgb);
    if (colorVariable) {
      effect = figma.variables.setBoundVariableForEffect(
        effect,
        "color",
        colorVariable,
      ) as DropShadowEffect;
    }

    style.effects = [effect];
  }

  return result;
}
