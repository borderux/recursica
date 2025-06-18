import { ExportingResult } from "../types";

export function generatePrettierignore(): ExportingResult {
  return {
    filename: ".prettierignore",
    path: ".prettierignore",
    content: `recursica/
recursica.json
recursica-bundle.json
recursica-icons.json`,
  };
}
