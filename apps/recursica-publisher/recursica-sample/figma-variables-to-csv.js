/**
 * Converts a JSON file of FigmaVariable[] (or FigmaVariableBatch) to CSV.
 * Columns: figmaVariableName, mode, value, resolvedType.
 * Use for tests: export Figma variables to JSON, then run this to get CSV for comparison.
 *
 * Usage: node figma-variables-to-csv.js [path/to/figma-variables.json]
 * Default input: figma-variables.json in same directory as this script.
 * Output: figma-variables.csv (or <input-basename>.csv)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_PATH = path.resolve(
  __dirname,
  process.argv[2] || "figma-variables.json",
);
const OUTPUT_PATH = path.resolve(
  __dirname,
  path.basename(INPUT_PATH, ".json") + ".csv",
);

const CSV_HEADER = "figmaVariableName,mode,value,resolvedType";

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

function rgbaToHex(rgba) {
  const r = Math.round(Math.max(0, Math.min(1, rgba.r)) * 255);
  const g = Math.round(Math.max(0, Math.min(1, rgba.g)) * 255);
  const b = Math.round(Math.max(0, Math.min(1, rgba.b)) * 255);
  const a = rgba.a !== undefined ? Math.max(0, Math.min(1, rgba.a)) : 1;
  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(4)})`;
  }
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

function valueToCsvString(value) {
  if (isRGBA(value)) return rgbaToHex(value);
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function figmaVariablesToCsv(variables) {
  const rows = [CSV_HEADER];
  for (const v of variables) {
    const modes = Object.keys(v.valuesByMode || {});
    if (modes.length === 0) {
      rows.push([v.name, "", "", v.resolvedType].map(escapeCsvCell).join(","));
      continue;
    }
    for (const mode of modes) {
      const value = v.valuesByMode[mode];
      const valueStr = valueToCsvString(value);
      rows.push(
        [v.name, mode, valueStr, v.resolvedType].map(escapeCsvCell).join(","),
      );
    }
  }
  return rows.join("\n");
}

function main() {
  const raw = fs.readFileSync(INPUT_PATH, "utf8");
  const data = JSON.parse(raw);
  const variables = Array.isArray(data) ? data : (data.variables ?? []);
  if (variables.length === 0) {
    console.warn(
      "No variables found in input (expected array or { variables: [] })",
    );
  }
  const csv = figmaVariablesToCsv(variables);
  fs.writeFileSync(OUTPUT_PATH, csv, "utf8");
  const rowCount = csv.split("\n").length - 1;
  console.log(`Wrote ${rowCount} rows to ${OUTPUT_PATH}`);
}

main();
