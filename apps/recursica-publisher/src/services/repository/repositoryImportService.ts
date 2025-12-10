/**
 * Service for importing components from the repository
 * Fetches figma.json files from the repository based on GUID and index.json
 */

import { getRequiredImportFiles } from "../../utils/getRequiredImportFiles";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface IndexJson {
  components?: Record<
    string,
    {
      name: string;
      path: string;
      version?: number;
      publishDate?: string;
    }
  >;
}

interface GitHubFileContent {
  sha: string;
  content?: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  name: string;
  path: string;
}

interface ImportedComponentFile {
  guid: string;
  name: string;
  path: string;
  jsonData: unknown;
}

/**
 * Fetches index.json from the repository for a specific branch/ref
 * Note: This makes unauthenticated requests for public repositories.
 * No authentication is needed or used for public repos.
 */
async function fetchIndexJson(ref: string): Promise<IndexJson> {
  const url = `https://api.github.com/repos/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/contents/index.json?ref=${encodeURIComponent(ref)}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Intentionally no Authorization header - public repo doesn't need authentication
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "index.json not found. The repository may not have been initialized yet.",
      );
    } else if (response.status === 403) {
      // 403 on a public repo usually means rate limiting or the file doesn't exist
      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
      if (rateLimitRemaining === "0") {
        throw new Error(
          "GitHub API rate limit exceeded. Please wait a few minutes and try again.",
        );
      }
      throw new Error(
        `Cannot access index.json (403 Forbidden). This may be due to rate limiting or the repository may be private.`,
      );
    }
    throw new Error(
      `Failed to load index.json: ${response.status} ${response.statusText}`,
    );
  }

  const fileData = (await response.json()) as GitHubFileContent;

  // Download and parse the file content
  const indexContent = await fetch(fileData.download_url).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to download index.json: ${res.status} ${res.statusText}`,
      );
    }
    return res.text();
  });

  return JSON.parse(indexContent) as IndexJson;
}

/**
 * Fetches a figma.json file from the repository by path
 * Note: This makes unauthenticated requests for public repositories.
 * No authentication is needed or used for public repos.
 */
async function fetchFigmaJson(path: string, ref: string): Promise<unknown> {
  const url = `https://api.github.com/repos/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Intentionally no Authorization header - public repo doesn't need authentication
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`File not found: ${path}`);
    } else if (response.status === 403) {
      // 403 on a public repo usually means rate limiting or the file doesn't exist
      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
      if (rateLimitRemaining === "0") {
        throw new Error(
          `GitHub API rate limit exceeded while fetching ${path}. Please wait a few minutes and try again.`,
        );
      }
      throw new Error(
        `Cannot access ${path} (403 Forbidden). This may be due to rate limiting or the file may not exist.`,
      );
    }
    throw new Error(
      `Failed to load ${path}: ${response.status} ${response.statusText}`,
    );
  }

  const fileData = (await response.json()) as GitHubFileContent;

  // Download and parse the file content
  const jsonContent = await fetch(fileData.download_url).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to download ${path}: ${res.status} ${res.statusText}`,
      );
    }
    return res.text();
  });

  return JSON.parse(jsonContent);
}

/**
 * Fetches a component's figma.json file by GUID from the repository
 * @param componentGuid - The GUID of the component to fetch
 * @param ref - The branch/commit ref to fetch from
 * @returns The component's JSON data
 */
export async function fetchComponentByGuid(
  componentGuid: string,
  ref: string,
): Promise<ImportedComponentFile> {
  // First, fetch index.json to get the component path
  const indexJson = await fetchIndexJson(ref);

  if (!indexJson.components || !indexJson.components[componentGuid]) {
    throw new Error(
      `Component with GUID ${componentGuid} not found in index.json`,
    );
  }

  const componentInfo = indexJson.components[componentGuid];
  const path = componentInfo.path;

  // Fetch the figma.json file
  const jsonData = await fetchFigmaJson(path, ref);

  return {
    guid: componentGuid,
    name: componentInfo.name,
    path,
    jsonData,
  };
}

/**
 * Internal helper function that recursively fetches dependencies
 * Maintains a seen set across recursive calls to prevent infinite loops from circular dependencies
 */
async function fetchComponentDependenciesRecursive(
  jsonData: unknown,
  ref: string,
  indexJson: IndexJson,
  seen: Set<string>,
  dependencies: ImportedComponentFile[],
): Promise<void> {
  // Use the existing getRequiredImportFiles utility to extract dependencies
  const requiredFiles = getRequiredImportFiles(jsonData);

  for (const requiredFile of requiredFiles) {
    // Only fetch files with GUIDs (normal instances)
    if (
      !requiredFile.componentGuid ||
      requiredFile.componentGuid.length === 0
    ) {
      continue;
    }

    // Skip if we've already fetched this GUID (prevents infinite loops from circular dependencies)
    if (seen.has(requiredFile.componentGuid)) {
      console.log(
        `[fetchComponentDependencies] Skipping already fetched component: ${requiredFile.componentGuid}`,
      );
      continue;
    }

    // Look up the component in index.json
    if (
      !indexJson.components ||
      !indexJson.components[requiredFile.componentGuid]
    ) {
      console.warn(
        `Component with GUID ${requiredFile.componentGuid} not found in index.json, skipping`,
      );
      continue;
    }

    const componentInfo = indexJson.components[requiredFile.componentGuid];
    const path = componentInfo.path;

    try {
      // Mark as seen BEFORE fetching to prevent infinite loops if there's a circular dependency
      seen.add(requiredFile.componentGuid);

      // Fetch the figma.json file
      const dependencyJsonData = await fetchFigmaJson(path, ref);

      const dependencyFile: ImportedComponentFile = {
        guid: requiredFile.componentGuid,
        name: componentInfo.name,
        path,
        jsonData: dependencyJsonData,
      };

      dependencies.push(dependencyFile);

      // Recursively fetch dependencies of this dependency
      // Pass the same seen set to prevent circular dependencies
      await fetchComponentDependenciesRecursive(
        dependencyJsonData,
        ref,
        indexJson,
        seen,
        dependencies,
      );
    } catch (error) {
      console.error(
        `Failed to fetch dependency ${requiredFile.componentGuid}:`,
        error,
      );
      // Remove from seen set if fetch failed so it can be retried if needed
      seen.delete(requiredFile.componentGuid);
      // Continue with other dependencies even if one fails
    }
  }
}

/**
 * Fetches all required dependencies for a component by parsing its instanceTable
 * @param jsonData - The parsed JSON data of the main component
 * @param ref - The branch/commit ref to fetch from
 * @returns Array of imported component files
 */
export async function fetchComponentDependencies(
  jsonData: unknown,
  ref: string,
): Promise<ImportedComponentFile[]> {
  // Fetch index.json once and reuse it for all lookups
  const indexJson = await fetchIndexJson(ref);

  const dependencies: ImportedComponentFile[] = [];
  const seen = new Set<string>(); // Track fetched GUIDs to avoid duplicates and circular dependencies

  // Use recursive helper that maintains state across calls
  await fetchComponentDependenciesRecursive(
    jsonData,
    ref,
    indexJson,
    seen,
    dependencies,
  );

  return dependencies;
}

/**
 * Fetches a component and all its dependencies from the repository
 * @param componentGuid - The GUID of the component to import
 * @param ref - The branch/commit ref to fetch from
 * @returns Object containing the main component and all dependencies
 */
export async function fetchComponentWithDependencies(
  componentGuid: string,
  ref: string,
): Promise<{
  mainComponent: ImportedComponentFile;
  dependencies: ImportedComponentFile[];
}> {
  // Fetch the main component
  const mainComponent = await fetchComponentByGuid(componentGuid, ref);

  // Fetch all dependencies
  const dependencies = await fetchComponentDependencies(
    mainComponent.jsonData,
    ref,
  );

  return {
    mainComponent,
    dependencies,
  };
}
