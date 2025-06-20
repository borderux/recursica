import type { ThemeTokens, ExportingProps, ExportingResult } from "../types";
import { autoGeneratedFile } from "@recursica/common";

export function generateRecursicaTokens(
  baseTokens: ThemeTokens,
  { outputPath, project }: ExportingProps,
): ExportingResult {
  const projectName =
    typeof project === "string" ? project : (project.name ?? "Recursica");
  const recursicaTokensFilename = `Recursica${projectName}Tokens.ts`;
  const recursicaTokensPath = outputPath + "/" + recursicaTokensFilename;
  const recursicaTokensContent = `${autoGeneratedFile()}
export const Recursica${projectName}Tokens = {
  ${Object.entries(baseTokens)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => typeof value === "string")
    .map(([key, value]) => `"${key}": "${value as string}"`)
    .join(",\n  ")}
};
`;
  return {
    content: recursicaTokensContent,
    path: recursicaTokensPath,
    filename: recursicaTokensFilename,
  };
}
