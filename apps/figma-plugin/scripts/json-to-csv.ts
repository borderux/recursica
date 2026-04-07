import fs from "fs/promises";
import path from "path";
import { recursicaJsonToVariableRows } from "../src/plugin/services/recursicaJsonToVariableRows.js";

async function main() {
  const args = process.argv.slice(2);
  let tokensPath = "recursica_tokens.json";
  let brandPath = "recursica_brand.json";
  let uiKitPath = "recursica_ui-kit.json";
  let outPath = "recursica_variables.csv";

  // Basic arg parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--tokens" && args[i + 1]) tokensPath = args[++i];
    if (args[i] === "--brand" && args[i + 1]) brandPath = args[++i];
    if (args[i] === "--uiKit" && args[i + 1]) uiKitPath = args[++i];
    if (args[i] === "--out" && args[i + 1]) outPath = args[++i];
  }

  async function readJsonSafely(filePath: string): Promise<unknown> {
    try {
      const content = await fs.readFile(
        path.resolve(process.cwd(), filePath),
        "utf-8",
      );
      return JSON.parse(content);
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        (e as { code: string }).code === "ENOENT"
      ) {
        console.warn(`Warning: Could not find ${filePath}. Skipping.`);
        return null;
      }
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to parse ${filePath}: ${msg}`);
    }
  }

  console.log("Reading JSON files...");
  const [tokens, brand, uiKit] = await Promise.all([
    readJsonSafely(tokensPath),
    readJsonSafely(brandPath),
    readJsonSafely(uiKitPath),
  ]);

  if (!tokens && !brand && !uiKit) {
    console.error("Error: None of the JSON files were found or valid.");
    process.exit(1);
  }

  console.log("Converting to CSV rows...");
  const result = recursicaJsonToVariableRows(tokens, brand, uiKit);

  if (result.errors && result.errors.length > 0) {
    console.error("Transformation errors:");
    result.errors.forEach((e) => console.error(" - " + e));
    // Continue despite errors as per existing import process logic
  }

  if (result.warnings && result.warnings.length > 0) {
    console.warn("Transformation warnings:");
    result.warnings.forEach((w) => console.warn(" - " + w));
  }

  console.log(`Generated ${result.rows.length} rows.`);

  // Write to CSV
  // Header based on the CsvRow definition
  const header = [
    "collection",
    "figmaVariableName",
    "mode",
    "value",
    "type",
    "alias",
    "defaultMode",
  ];

  // Escape CSV value
  function escapeCsv(val: string): string {
    if (val == null) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const csvLines = [header.join(",")];
  for (const row of result.rows) {
    csvLines.push(
      [
        row.collection,
        row.figmaVariableName,
        row.mode,
        row.value,
        row.type,
        row.alias,
        row.defaultMode,
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  await fs.writeFile(
    path.resolve(process.cwd(), outPath),
    csvLines.join("\n"),
    "utf-8",
  );
  console.log(`Successfully wrote ${csvLines.length - 1} rows to ${outPath}`);
}

main().catch((e) => {
  console.error("Script failed:", e);
  process.exit(1);
});
