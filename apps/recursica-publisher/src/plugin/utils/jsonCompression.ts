/* eslint-disable @typescript-eslint/no-explicit-any */
import { StringTable } from "../services/import-export/parsers/stringTable";

/**
 * Compresses a JSON object by replacing long keys with short abbreviations
 * and compressing type enum values to numbers.
 *
 * This should be called at the very last stage of export, after all data
 * has been collected and structured. All internal code should use full key names.
 *
 * Note: The metadata field is never compressed, so it can be read without expansion.
 *
 * @param data - The JSON object to compress (can be any structure)
 * @param stringTable - The StringTable instance to use for compression
 * @returns The compressed JSON object (with metadata left uncompressed)
 */
export function compressJsonData(data: any, stringTable: StringTable): any {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const compressed: any = {};

  // Never compress metadata - keep it as-is so it can be read without expansion
  if (data.metadata) {
    compressed.metadata = data.metadata;
  }

  // Compress all other fields
  for (const [key, value] of Object.entries(data)) {
    if (key !== "metadata") {
      compressed[key] = stringTable.compressObject(value);
    }
  }

  return compressed;
}

/**
 * Expands a compressed JSON object by replacing short keys with long names
 * and expanding type enum values from numbers back to strings.
 *
 * This can be called on the entire JSON or just specific parts as needed.
 * All internal code should use full key names.
 *
 * Note: The metadata field is never compressed, so it doesn't need expansion.
 *
 * @param data - The compressed JSON object (or part of it) to expand
 * @param stringTable - The StringTable instance to use for expansion
 * @returns The expanded JSON object with full key names
 */
export function expandJsonData(data: any, stringTable: StringTable): any {
  return stringTable.expandObject(data);
}
