/**
 * Imports variables from the three Recursica JSON files (tokens, brand, ui-kit).
 * Transforms JSON to variable rows, then applies the same Figma variable/collection
 * logic as applyVariableRows (GUID-based collection lookup, variables, aliases, text/effect styles).
 *
 * Response data shape: variablesCreated, variablesAlreadyExisted, aliasErrors,
 * textStylesCreated, textStylesSkipped, textStyleWarnings, effectStylesCreated,
 * effectStylesSkipped, effectStyleWarnings; when present from transform:
 * transformErrors (string[]), transformWarnings (string[]).
 */

import type { PluginResponse } from "../types/messages";
import { applyVariableRows } from "./importVariablesCsv";
import { createEffectStylesFromElevations } from "./createEffectStylesFromElevations";
import { createTextStylesFromTypography } from "./createTextStylesFromTypography";
import {
  recursicaJsonToVariableRows,
  type RecursicaJsonToRowsResult,
} from "./recursicaJsonToVariableRows";

export async function importRecursicaJson(
  data: Record<string, unknown>,
): Promise<PluginResponse> {
  const tokensRoot = data.tokens;
  const brandRoot = data.brand;
  const uiKitRoot = data.uiKit;

  if (tokensRoot == null || typeof tokensRoot !== "object") {
    return {
      type: "importRecursicaJson",
      success: false,
      error: true,
      message: "Missing or invalid tokens JSON",
      data: {},
    };
  }
  if (brandRoot == null || typeof brandRoot !== "object") {
    return {
      type: "importRecursicaJson",
      success: false,
      error: true,
      message: "Missing or invalid brand JSON",
      data: {},
    };
  }
  if (uiKitRoot == null || typeof uiKitRoot !== "object") {
    return {
      type: "importRecursicaJson",
      success: false,
      error: true,
      message: "Missing or invalid uiKit JSON",
      data: {},
    };
  }

  let transformResult: RecursicaJsonToRowsResult;
  try {
    transformResult = recursicaJsonToVariableRows(
      tokensRoot,
      brandRoot,
      uiKitRoot,
    );
  } catch (e) {
    return {
      type: "importRecursicaJson",
      success: false,
      error: true,
      message: e instanceof Error ? e.message : String(e),
      data: {},
    };
  }

  const {
    rows,
    errors: transformErrors,
    warnings: transformWarnings,
  } = transformResult;

  if (rows.length === 0 && transformErrors.length > 0) {
    return {
      type: "importRecursicaJson",
      success: false,
      error: true,
      message: transformErrors[0] ?? "Transform failed",
      data: {
        transformErrors,
        transformWarnings,
      },
    };
  }

  const applyResult = await applyVariableRows(rows);

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

  const hasIssues = aliasErrors.length > 0 || transformErrors.length > 0;
  const message = hasIssues
    ? `Import complete with issues. Variables: ${variablesCreated} created, ${variablesAlreadyExisted} existed. Alias errors: ${aliasErrors.length}. Transform errors: ${transformErrors.length}. Text styles: ${textStylesCreated} created, ${textStylesSkipped} skipped. Effect styles: ${effectStylesCreated} created, ${effectStylesSkipped} skipped.`
    : `Import complete. Variables: ${variablesCreated} created, ${variablesAlreadyExisted} existed. Text styles: ${textStylesCreated} created, ${textStylesSkipped} skipped. Effect styles: ${effectStylesCreated} created, ${effectStylesSkipped} skipped.`;

  return {
    type: "importRecursicaJson",
    success: aliasErrors.length === 0 && transformErrors.length === 0,
    error: hasIssues,
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
      ...(transformErrors.length > 0 && { transformErrors }),
      ...(transformWarnings.length > 0 && { transformWarnings }),
    },
  };
}
