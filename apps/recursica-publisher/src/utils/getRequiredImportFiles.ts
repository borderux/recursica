/**
 * Recursively expands compressed keys using the string table
 * The string table maps short -> long keys (e.g., "instT" -> "instanceType")
 * This is a simplified version for UI code - for full expansion including type enums,
 * use the StringTable.expandObject method from the plugin code
 */
function expandData(
  data: unknown,
  stringTable?: Record<string, string>,
): unknown {
  if (!stringTable || Object.keys(stringTable).length === 0) {
    return data;
  }

  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => expandData(item, stringTable));
  }

  if (typeof data === "object") {
    const expanded: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if key is a compressed key - stringTable maps short -> long
      const longKey = stringTable[key] || key;
      expanded[longKey] = expandData(value, stringTable);
    }
    return expanded;
  }

  return data;
}

/**
 * Extracts the list of required import files from a Recursica export JSON
 * Returns normal instance references that need separate import files
 * @param jsonData - The parsed JSON export data (may be compressed)
 * @returns Array of required file identifiers with componentGuid and componentVersion
 */
export interface RequiredImportFile {
  componentGuid: string;
  componentVersion: number;
  componentName: string;
  componentPageName?: string;
}

export function getRequiredImportFiles(
  jsonData: unknown,
): RequiredImportFile[] {
  if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
    console.log("[getRequiredImportFiles] Invalid jsonData");
    return [];
  }

  const data = jsonData as Record<string, unknown>;

  // Check if instances table exists
  if (!data.instances || typeof data.instances !== "object") {
    console.log("[getRequiredImportFiles] No instances table found");
    return [];
  }

  console.log(
    "[getRequiredImportFiles] Instances table found, keys:",
    Object.keys(data.instances),
  );

  // Expand string table if present
  let stringTable: Record<string, string> | undefined;
  if (data.stringTable && typeof data.stringTable === "object") {
    stringTable = data.stringTable as Record<string, string>;
    console.log(
      "[getRequiredImportFiles] String table found:",
      Object.keys(stringTable).length,
      "entries",
    );
  } else {
    console.log("[getRequiredImportFiles] No string table found");
  }

  // Expand only the instances table (not the whole JSON)
  const expandedInstances = expandData(data.instances, stringTable);
  if (
    !expandedInstances ||
    typeof expandedInstances !== "object" ||
    Array.isArray(expandedInstances)
  ) {
    console.log("[getRequiredImportFiles] Failed to expand instances table");
    return [];
  }

  const instances = expandedInstances as Record<string, unknown>;
  console.log(
    "[getRequiredImportFiles] Expanded instances, keys:",
    Object.keys(instances),
  );

  // The instances table structure: { "0": {...}, "1": {...}, ... }
  // Each entry is an InstanceTableEntry
  const requiredFiles: RequiredImportFile[] = [];
  const seen = new Set<string>(); // Track unique componentGuid:componentVersion combinations

  for (const key of Object.keys(instances)) {
    const entry = instances[key];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      continue;
    }

    const instanceEntry = entry as Record<string, unknown>;
    const allKeys = Object.keys(instanceEntry);
    console.log(`[getRequiredImportFiles] Instance ${key}:`, {
      instanceType: instanceEntry.instanceType,
      componentGuid: instanceEntry.componentGuid,
      componentVersion: instanceEntry.componentVersion,
      componentName: instanceEntry.componentName,
      componentPageName: instanceEntry.componentPageName,
      allKeys,
      allValues: allKeys.reduce(
        (acc, k) => {
          acc[k] = instanceEntry[k];
          return acc;
        },
        {} as Record<string, unknown>,
      ),
    });

    // Only process normal instances (they reference other files)
    // After expansion, keys should be long names, but check both just in case
    const instanceType = instanceEntry.instanceType || instanceEntry.instT;
    if (instanceType !== "normal") {
      console.log(
        `[getRequiredImportFiles] Skipping instance ${key}, type:`,
        instanceType,
      );
      continue;
    }

    // After expansion, keys should be long names, but check both just in case
    const componentGuid = instanceEntry.componentGuid || instanceEntry.compG;
    const componentVersion =
      instanceEntry.componentVersion || instanceEntry.cVers;
    const componentName = instanceEntry.componentName || instanceEntry.compN;
    const componentPageName =
      instanceEntry.componentPageName || instanceEntry.cPage;

    // For normal instances, we need either:
    // 1. componentGuid + componentVersion (for published components)
    // 2. componentPageName (for unpublished components on different pages)
    // If we have componentGuid + componentVersion, use that for matching
    // If we only have componentPageName, we can still show it but matching will be by page name
    if (typeof componentName === "string") {
      if (
        typeof componentGuid === "string" &&
        typeof componentVersion === "number"
      ) {
        // Published component - use GUID + version for matching
        const uniqueKey = `${componentGuid}:${componentVersion}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          requiredFiles.push({
            componentGuid,
            componentVersion,
            componentName,
            componentPageName:
              typeof componentPageName === "string"
                ? componentPageName
                : undefined,
          });
          console.log(
            `[getRequiredImportFiles] Added required file (published):`,
            uniqueKey,
          );
        }
      } else if (typeof componentPageName === "string") {
        // Unpublished component - use page name for matching
        // Create a unique key based on page name + component name
        const uniqueKey = `page:${componentPageName}:${componentName}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          requiredFiles.push({
            componentGuid: "", // Empty GUID indicates unpublished
            componentVersion: 0, // Version 0 indicates unpublished
            componentName,
            componentPageName,
          });
          console.log(
            `[getRequiredImportFiles] Added required file (unpublished):`,
            uniqueKey,
          );
        }
      } else {
        // Normal instance without GUID/version or page name
        // This shouldn't happen, but if it does, we can't identify which file to import
        // Still show it so the user knows there's a reference, but mark it as unknown
        const uniqueKey = `unknown:${componentName}:${key}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          requiredFiles.push({
            componentGuid: "", // Empty GUID indicates unknown
            componentVersion: 0, // Version 0 indicates unknown
            componentName,
            componentPageName: undefined,
          });
          console.log(
            `[getRequiredImportFiles] Added required file (unknown page):`,
            uniqueKey,
          );
        }
      }
    }
  }

  console.log(
    `[getRequiredImportFiles] Found ${requiredFiles.length} required files`,
  );
  return requiredFiles;
}

/**
 * Checks if an imported file matches a required import file
 * Currently matches by checking if the file's metadata contains componentGuid and componentVersion
 * Note: This requires that componentGuid and componentVersion are added to the export metadata
 * @param fileData - The parsed JSON data from an imported file
 * @param requiredFile - The required file identifier
 * @returns true if the file matches the required file
 */
export function fileMatchesRequired(
  fileData: unknown,
  requiredFile: RequiredImportFile,
): boolean {
  if (!fileData || typeof fileData !== "object" || Array.isArray(fileData)) {
    return false;
  }

  const data = fileData as Record<string, unknown>;

  // Check metadata for component GUID and version
  if (!data.metadata || typeof data.metadata !== "object") {
    return false;
  }

  const metadata = data.metadata as Record<string, unknown>;

  // Check if metadata has guid (the page GUID) and version
  // The metadata.guid is the page GUID, which matches componentGuid for normal instances
  const fileComponentGuid = metadata.guid;
  const fileComponentVersion = metadata.version;

  if (
    typeof fileComponentGuid === "string" &&
    typeof fileComponentVersion === "number" &&
    requiredFile.componentGuid &&
    requiredFile.componentVersion !== 0
  ) {
    return (
      fileComponentGuid === requiredFile.componentGuid &&
      fileComponentVersion === requiredFile.componentVersion
    );
  }

  // Fallback: Try to match by page name (less reliable)
  const pageName = metadata.name;
  if (typeof pageName === "string" && requiredFile.componentPageName) {
    return pageName === requiredFile.componentPageName;
  }

  return false;
}
