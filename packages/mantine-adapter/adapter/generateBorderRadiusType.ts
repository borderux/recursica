import { autoGeneratedFile } from "@recursica/common";
import { ExportingResult } from "../types";

export function generateBorderRadiusType(
  borderRadius: string[],
  outputPath: string,
): ExportingResult {
  const borderRadiusTypeContent = `${autoGeneratedFile()}
export type RecursicaBorderRadiusType = ${borderRadius
    .map((key) => `'${key}'`)
    .join(" | ")};
`;

  return {
    content: borderRadiusTypeContent,
    path: `${outputPath}/RecursicaBorderRadiusType.ts`,
    filename: "RecursicaBorderRadiusType.ts",
  };
}
