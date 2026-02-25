/**
 * Imports variables from variable rows (CSV or Recursica JSON–derived).
 * Creates collection if it does not exist; uses existing by GUID then by name; sets GUID on create or when matched by name.
 * For each variable: if it already exists at that path, skip; otherwise create it with the value.
 * applyVariableRows() does collections + variables + alias resolution; callers add Text/Effect styles and response.
 */

import type { PluginResponse } from "../types/messages";
import { getFixedGuidForCollection } from "../../const/CollectionConstants";
import { createEffectStylesFromElevations } from "./createEffectStylesFromElevations";
import { createTextStylesFromTypography } from "./createTextStylesFromTypography";

const COLLECTION_GUID_KEY = "recursica:collectionId";

const COLLECTION_DISPLAY_NAMES: Record<string, string> = {
  tokens: "Tokens",
  themes: "Themes",
  layer: "Layer",
};

const COLLECTION_MODES: Record<string, string[]> = {
  tokens: ["Default"],
  themes: ["Light", "Dark"],
  layer: ["0", "1", "2", "3"],
};

type VariableResolvedDataType = "COLOR" | "FLOAT" | "STRING";

export interface CsvRow {
  collection: string;
  figmaVariableName: string;
  mode: string;
  value: string;
  type: string;
  alias: string;
  defaultMode: string;
}

export interface ApplyVariableRowsResult {
  variablesCreated: number;
  variablesAlreadyExisted: number;
  aliasErrors: string[];
}

function parseCsvRow(header: string[], cells: string[]): CsvRow | null {
  if (cells.length < 5) return null;
  const get = (key: string) => {
    const i = header.indexOf(key);
    return i >= 0 ? (cells[i] ?? "").trim() : "";
  };
  return {
    collection: get("collection") || (cells[0] ?? "").trim(),
    figmaVariableName: get("figmaVariableName") || (cells[1] ?? "").trim(),
    mode: get("mode") || (cells[2] ?? "").trim(),
    value: get("value") ?? cells[3] ?? "",
    type: get("type") || (cells[4] ?? "").trim(),
    alias: get("alias") || (cells[5] ?? "").trim(),
    defaultMode: get("defaultMode") || (cells[6] ?? "").trim(),
  };
}

function parseCsvRows(rows: string[][]): CsvRow[] {
  if (rows.length < 2) return [];
  const header = rows[0].map((c) => c.trim());
  const out: CsvRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = parseCsvRow(header, rows[i]);
    if (row && row.collection && row.figmaVariableName) out.push(row);
  }
  return out;
}

async function findVariableByName(
  collection: VariableCollection,
  variableName: string,
): Promise<Variable | null> {
  for (const varId of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (variable && variable.name === variableName) return variable;
  }
  return null;
}

function ensureCollectionModes(
  collection: VariableCollection,
  modeNames: string[],
): void {
  if (modeNames.length === 0) return;
  const defaultMode = collection.modes.find(
    (m) => m.name === "Mode 1" || m.name === "Default",
  );
  if (defaultMode && !modeNames.includes(defaultMode.name)) {
    try {
      collection.renameMode(defaultMode.modeId, modeNames[0]);
    } catch {
      // ignore rename failure
    }
  }
  for (const modeName of modeNames) {
    if (!collection.modes.some((m) => m.name === modeName)) {
      collection.addMode(modeName);
    }
  }
}

function parseColorToRgba(value: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const trimmed = value.trim();
  const hex8 =
    /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
  const hex6 = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
  const rgbaMatch = trimmed.match(
    /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/,
  );
  if (hex8.test(trimmed)) {
    const m = trimmed.match(hex8)!;
    return {
      r: parseInt(m[1], 16) / 255,
      g: parseInt(m[2], 16) / 255,
      b: parseInt(m[3], 16) / 255,
      a: parseInt(m[4], 16) / 255,
    };
  }
  if (hex6.test(trimmed)) {
    const m = trimmed.match(hex6)!;
    return {
      r: parseInt(m[1], 16) / 255,
      g: parseInt(m[2], 16) / 255,
      b: parseInt(m[3], 16) / 255,
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
  throw new Error(`Unsupported color format: ${value}`);
}

/** Resolve alias value like "tokens/sizes/3x", "brand/palettes/...", or "ui-kit/..." to variableMap key. */
function aliasValueToMapKey(value: string): string {
  const v = value.trim();
  if (v.toLowerCase().startsWith("tokens/")) return "tokens/" + v.slice(7);
  if (v.toLowerCase().startsWith("brand/")) return "themes/" + v.slice(6);
  if (v.toLowerCase().startsWith("ui-kit/")) return "layer/" + v.slice(7);
  return v;
}

function findOrCreateCollection(
  localCollections: VariableCollection[],
  displayName: string,
): VariableCollection {
  const fixedGuid = getFixedGuidForCollection(displayName);
  let collection = fixedGuid
    ? localCollections.find(
        (c) =>
          c.getSharedPluginData("recursica", COLLECTION_GUID_KEY) === fixedGuid,
      )
    : undefined;
  if (!collection) {
    collection = localCollections.find((c) => c.name === displayName);
  }
  if (collection) {
    if (fixedGuid) {
      const currentGuid = collection.getSharedPluginData(
        "recursica",
        COLLECTION_GUID_KEY,
      );
      if (!currentGuid || currentGuid.trim() === "") {
        collection.setSharedPluginData(
          "recursica",
          COLLECTION_GUID_KEY,
          fixedGuid,
        );
      }
    }
    return collection;
  }
  collection = figma.variables.createVariableCollection(displayName);
  if (fixedGuid) {
    collection.setSharedPluginData("recursica", COLLECTION_GUID_KEY, fixedGuid);
  }
  return collection;
}

export async function applyVariableRows(
  csvRows: CsvRow[],
): Promise<ApplyVariableRowsResult> {
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  const variableByKey = new Map<string, Variable>();
  let variablesCreated = 0;
  let variablesAlreadyExisted = 0;
  const aliasErrors: string[] = [];
  const loggedTargetKeys = new Set<string>();
  const MAX_ALIAS_MISS_LOGS = 10;

  const order: string[] = ["tokens", "themes", "layer"];
  for (const collKey of order) {
    const displayName = COLLECTION_DISPLAY_NAMES[collKey];
    const modeNames = COLLECTION_MODES[collKey];
    const rows = csvRows.filter((r) => r.collection.toLowerCase() === collKey);
    if (rows.length === 0) continue;

    const uniqueNames = new Set(rows.map((r) => r.figmaVariableName));
    console.log(
      `[applyVariableRows] ${displayName}: ${rows.length} rows, ${uniqueNames.size} unique variable names`,
    );

    const collection = findOrCreateCollection(localCollections, displayName);
    ensureCollectionModes(collection, modeNames);

    const modeByName = new Map(collection.modes.map((m) => [m.name, m]));
    const rowsByVariable = new Map<string, CsvRow[]>();
    for (const row of rows) {
      const name = row.figmaVariableName;
      if (!rowsByVariable.has(name)) rowsByVariable.set(name, []);
      rowsByVariable.get(name)!.push(row);
    }

    // Pass 1: Create all variables and set only literal (non-alias) values, so variableByKey is complete.
    for (const [variableName, modeRows] of rowsByVariable) {
      const existing = await findVariableByName(collection, variableName);
      if (existing) {
        variableByKey.set(`${collKey}/${variableName}`, existing);
        variablesAlreadyExisted++;
        continue;
      }

      let resolvedType: VariableResolvedDataType = "STRING";
      for (const row of modeRows) {
        const fromRow = (
          row.type || "STRING"
        ).toUpperCase() as VariableResolvedDataType;
        const validType =
          fromRow === "COLOR" || fromRow === "FLOAT" || fromRow === "STRING";
        if (!validType) continue;
        if (row.alias === "true" && row.value) {
          const targetKey = aliasValueToMapKey(row.value);
          const targetVar = variableByKey.get(targetKey);
          if (targetVar) {
            resolvedType = targetVar.resolvedType as VariableResolvedDataType;
            break;
          }
        }
        resolvedType = fromRow;
        break;
      }

      const variable = figma.variables.createVariable(
        variableName,
        collection,
        resolvedType,
      );
      variableByKey.set(`${collKey}/${variableName}`, variable);
      variablesCreated++;

      for (const row of modeRows) {
        const mode =
          row.mode || (collKey === "tokens" ? "Default" : modeNames[0]);
        const modeObj = modeByName.get(mode);
        if (!modeObj) continue;

        const isAlias = row.alias === "true";
        const rawValue = row.value;

        if (isAlias && rawValue) {
          continue;
        }

        if (resolvedType === "COLOR") {
          try {
            const rgba = parseColorToRgba(rawValue);
            variable.setValueForMode(modeObj.modeId, rgba);
          } catch {
            // skip invalid color
          }
          continue;
        }
        if (resolvedType === "FLOAT") {
          const n = Number(rawValue);
          if (!Number.isNaN(n)) {
            variable.setValueForMode(modeObj.modeId, n);
          }
          continue;
        }
        variable.setValueForMode(modeObj.modeId, rawValue);
      }
    }

    // Pass 2: Set alias values (all target variables now exist).
    for (const [variableName, modeRows] of rowsByVariable) {
      const variable = variableByKey.get(`${collKey}/${variableName}`);
      if (!variable) continue;

      for (const row of modeRows) {
        const mode =
          row.mode || (collKey === "tokens" ? "Default" : modeNames[0]);
        const modeObj = modeByName.get(mode);
        if (!modeObj) continue;

        const isAlias = row.alias === "true";
        const rawValue = row.value;

        if (!isAlias || !rawValue) continue;

        const targetKey = aliasValueToMapKey(rawValue);
        const targetVar = variableByKey.get(targetKey);
        if (!targetVar) {
          if (
            loggedTargetKeys.size < MAX_ALIAS_MISS_LOGS &&
            !loggedTargetKeys.has(targetKey)
          ) {
            loggedTargetKeys.add(targetKey);
            const prefix = targetKey.split("/")[0];
            const sampleKeys = [...variableByKey.keys()]
              .filter((k) => k.startsWith(prefix + "/"))
              .slice(0, 5);
            console.log(
              `[applyVariableRows] Alias target not found: rawValue=${JSON.stringify(rawValue)} → targetKey=${JSON.stringify(targetKey)}. Sample keys for "${prefix}":`,
              sampleKeys,
            );
          }
          aliasErrors.push(
            `${displayName}/${variableName} (mode ${mode}): alias target not found: ${rawValue}`,
          );
          continue;
        }
        const alias: VariableAlias = {
          type: "VARIABLE_ALIAS",
          id: targetVar.id,
        };
        variable.setValueForMode(modeObj.modeId, alias);
      }
    }
  }

  if (aliasErrors.length > 0) {
    const uniqueTargets = new Set(
      aliasErrors.map((e) => {
        const m = e.match(/alias target not found: (.+)$/);
        return m ? m[1] : e;
      }),
    );
    console.log(
      `[applyVariableRows] Alias errors: ${aliasErrors.length} total, ${uniqueTargets.size} unique missing target(s). Sample:`,
      [...uniqueTargets].slice(0, 5),
    );
  }

  return {
    variablesCreated,
    variablesAlreadyExisted,
    aliasErrors,
  };
}

export async function importVariablesCsv(
  data: Record<string, unknown>,
): Promise<PluginResponse> {
  const rowsInput = data.rows as string[][] | undefined;
  if (!Array.isArray(rowsInput) || rowsInput.length === 0) {
    return {
      type: "importVariablesCsv",
      success: false,
      error: true,
      message: "No CSV rows provided",
      data: {},
    };
  }

  const csvRows = parseCsvRows(rowsInput);
  if (csvRows.length === 0) {
    return {
      type: "importVariablesCsv",
      success: false,
      error: true,
      message: "CSV has no data rows",
      data: {},
    };
  }

  const rowsByCollection = new Map<string, number>();
  for (const r of csvRows) {
    const c = r.collection.toLowerCase();
    rowsByCollection.set(c, (rowsByCollection.get(c) ?? 0) + 1);
  }
  console.log(
    "[importVariablesCsv] Parsed rows:",
    csvRows.length,
    "total. Per collection:",
    Object.fromEntries(rowsByCollection),
  );

  const applyResult = await applyVariableRows(csvRows);

  let textStylesCreated = 0;
  let textStylesSkipped = 0;
  const textStyleWarnings: string[] = [];
  try {
    const textStyleResult = await createTextStylesFromTypography();
    textStylesCreated = textStyleResult.textStylesCreated;
    textStylesSkipped = textStyleResult.textStylesSkipped;
    textStyleWarnings.push(...textStyleResult.textStyleWarnings);
  } catch (e) {
    textStyleWarnings.push(
      `Text styles from typography failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  let effectStylesCreated = 0;
  let effectStylesSkipped = 0;
  const effectStyleWarnings: string[] = [];
  try {
    const effectStyleResult = await createEffectStylesFromElevations();
    effectStylesCreated = effectStyleResult.effectStylesCreated;
    effectStylesSkipped = effectStyleResult.effectStylesSkipped;
    effectStyleWarnings.push(...effectStyleResult.effectStyleWarnings);
  } catch (e) {
    effectStyleWarnings.push(
      `Effect styles from elevations failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  const { variablesCreated, variablesAlreadyExisted, aliasErrors } =
    applyResult;
  const message =
    aliasErrors.length > 0
      ? `Import complete with ${aliasErrors.length} alias error(s). Variables: ${variablesCreated} created, ${variablesAlreadyExisted} existed. Text styles: ${textStylesCreated} created, ${textStylesSkipped} skipped. Effect styles: ${effectStylesCreated} created, ${effectStylesSkipped} skipped.`
      : `Import complete. Variables: ${variablesCreated} created, ${variablesAlreadyExisted} existed. Text styles: ${textStylesCreated} created, ${textStylesSkipped} skipped. Effect styles: ${effectStylesCreated} created, ${effectStylesSkipped} skipped.`;

  return {
    type: "importVariablesCsv",
    success: aliasErrors.length === 0,
    error: aliasErrors.length > 0,
    message,
    data: {
      variablesCreated,
      variablesAlreadyExisted,
      aliasErrors,
      textStylesCreated,
      textStylesSkipped,
      textStyleWarnings,
      effectStylesCreated,
      effectStylesSkipped,
      effectStyleWarnings,
    },
  };
}
