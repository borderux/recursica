export class PluginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginError';
    figma.notify(message);
    figma.closePlugin();
  }
}

export type FileTypes = 'ui-kit' | 'themes' | 'tokens' | 'icons';

export interface FiletypeResult {
  fileType: FileTypes;
  themeName: string;
}

class FiletypeSingleton {
  private static instance: FiletypeSingleton;
  private cachedResult: FiletypeResult | null = null;
  private isDetecting = false;
  private detectionPromise: Promise<FiletypeResult> | null = null;

  private constructor() {}

  public static getInstance(): FiletypeSingleton {
    if (!FiletypeSingleton.instance) {
      FiletypeSingleton.instance = new FiletypeSingleton();
    }
    return FiletypeSingleton.instance;
  }

  /**
   * Detects the file type from local variable collections and falls back to icon detection if needed.
   *
   * This function analyzes collection names to determine the project type and extracts
   * theme information. It uses pattern matching on collection names to classify the file.
   *
   * File type detection priority:
   * 1. 'tokens' - if any collection contains 'tokens' in the name
   * 2. 'themes' - if any collection contains 'themes' in the name
   * 3. 'ui-kit' - if any collection contains 'ui kit' or 'uikit' in the name
   * 4. 'icons' - if no collections found, checks for icons in pages
   *
   * Theme name extraction:
   * - Looks for an "ID variables" collection
   * - Searches for a variable named 'theme' within that collection
   * - Extracts the first mode value as the theme name
   *
   * @returns Promise resolving to an object containing:
   *   - fileType: The detected file type ('themes', 'ui-kit', 'tokens', 'icons')
   *   - themeName: The extracted theme name (empty string if not found)
   *
   * @throws Error if no file type can be determined
   *
   * @example
   * const { fileType, themeName } = await detectFiletype();
   * // fileType: 'themes', themeName: 'DarkTheme'
   */
  private async detectFiletypeInternal(): Promise<FiletypeResult> {
    // Get local variable collections
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();

    console.log('[detectFiletype] Found', localCollections.length, 'local collections');
    localCollections.forEach((collection, index) => {
      const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
      console.log(`[detectFiletype] Collection ${index + 1}:`, {
        name: collection.name,
        key: collection.key,
        metadataFileType: metadataFileType || '(none)',
      });
    });

    let fileType: FileTypes | undefined;
    let themeName = '';

    if (localCollections.length > 0) {
      // Look for collections that indicate the project type
      // Priority order: tokens > ui-kit > themes > icons (default)
      // Check metadata first (most reliable), then fall back to name patterns

      // Check for tokens: collection name contains "tokens" (prioritize name over metadata)
      const tokensCollection = localCollections.find((collection) => {
        const name = collection.name.toLowerCase();
        const nameMatches = name.includes('tokens');
        const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
        const metadataMatches = metadataFileType === 'tokens';

        // Only trust metadata if name also matches, or trust name if it matches
        if (nameMatches && metadataMatches) {
          console.log(
            '[detectFiletype] Found tokens collection by name and metadata:',
            collection.name
          );
          return true;
        }
        if (nameMatches) {
          console.log('[detectFiletype] Found tokens collection by name:', collection.name);
          return true;
        }
        // Don't trust metadata alone if name doesn't match
        if (metadataMatches) {
          console.log(
            '[detectFiletype] Ignoring tokens metadata (name does not match):',
            collection.name
          );
        }
        return false;
      });

      // Check for ui-kit: collection name contains "layer", "ui kit", or "uikit" (prioritize name over metadata)
      // UI Kit collection is named "Layer"
      const uikitCollection = localCollections.find((collection) => {
        const name = collection.name.toLowerCase();
        const nameMatches = name === 'layer' || name.includes('ui kit') || name.includes('uikit');
        const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
        const metadataMatches = metadataFileType === 'ui-kit';

        // Only trust metadata if name also matches, or trust name if it matches
        if (nameMatches && metadataMatches) {
          console.log(
            '[detectFiletype] Found ui-kit collection by name and metadata:',
            collection.name
          );
          return true;
        }
        if (nameMatches) {
          console.log('[detectFiletype] Found ui-kit collection by name:', collection.name);
          return true;
        }
        // Don't trust metadata alone if name doesn't match
        if (metadataMatches) {
          console.log(
            '[detectFiletype] Ignoring ui-kit metadata (name does not match):',
            collection.name
          );
        }
        return false;
      });

      // Check for themes: collection name contains "theme" or "themes" (prioritize name over metadata)
      const themesCollection = localCollections.find((collection) => {
        const name = collection.name.toLowerCase();
        const nameMatches = name.includes('theme') || name.includes('themes');
        const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
        const metadataMatches = metadataFileType === 'themes';

        // Only trust metadata if name also matches, or trust name if it matches
        if (nameMatches && metadataMatches) {
          console.log(
            '[detectFiletype] Found themes collection by name and metadata:',
            collection.name
          );
          return true;
        }
        if (nameMatches) {
          console.log('[detectFiletype] Found themes collection by name:', collection.name);
          return true;
        }
        // Don't trust metadata alone if name doesn't match
        if (metadataMatches) {
          console.log(
            '[detectFiletype] Ignoring themes metadata (name does not match):',
            collection.name
          );
        }
        return false;
      });

      // Determine file type based on collection names found
      if (tokensCollection) {
        fileType = 'tokens';
        console.log('[detectFiletype] Selected file type: tokens');
      } else if (uikitCollection) {
        fileType = 'ui-kit';
        console.log('[detectFiletype] Selected file type: ui-kit');
      } else if (themesCollection) {
        fileType = 'themes';
        console.log('[detectFiletype] Selected file type: themes');
      } else {
        console.log('[detectFiletype] No matching collection found for tokens/ui-kit/themes');
      }

      // Extract theme name from the "ID variables" collection if it exists
      // This collection typically contains metadata about the project
      const idVariablesCollection = localCollections.find(
        (collection) => collection.name === 'ID variables'
      );

      if (idVariablesCollection) {
        // Search through all variables in the ID variables collection
        for (const varId of idVariablesCollection.variableIds) {
          const variable = await figma.variables.getVariableByIdAsync(varId);
          if (!variable) continue;
          if (variable.name === 'project-type') {
            const firstMode = Object.values(variable.valuesByMode)[0];
            if (typeof firstMode === 'string') {
              fileType = firstMode as FileTypes;
            }
            continue;
          }
          // Look for a variable specifically named 'theme'
          if (variable.name === 'theme') {
            // Extract the theme name from the first mode value
            // Assuming the theme name is stored as a string value
            const firstMode = Object.values(variable.valuesByMode)[0];
            if (typeof firstMode === 'string') {
              themeName = firstMode;
            }
            continue; // Found the theme variable, no need to continue searching
          }
        }
      }
    }
    if (fileType === undefined || fileType === 'icons') {
      // If no file type was determined from collections, check if this is an icons file
      // Lightweight check: just look for component sets without exporting
      let iconsFound = false;

      // Load all pages first
      await figma.loadAllPagesAsync();

      function hasIconComponents(node: BaseNode): boolean {
        if (node.type === 'COMPONENT_SET') {
          return true;
        }
        if ('children' in node) {
          return node.children.some((child) => hasIconComponents(child));
        }
        return false;
      }

      for (const page of figma.root.children) {
        if (page.type === 'PAGE' && hasIconComponents(page)) {
          iconsFound = true;
          break;
        }
      }

      if (!iconsFound) {
        throw new PluginError(
          'This is not a recursica file: no variable collections or icons detected.'
        );
      }

      fileType = 'icons';
    }

    if (!fileType) {
      throw new PluginError(
        'This is not a recursica file: no variable collections or icons detected.'
      );
    }

    return { fileType, themeName };
  }

  /**
   * Gets the filetype and theme name, using cached results if available.
   * If not cached, performs detection and caches the result.
   *
   * @returns Promise resolving to the filetype result
   */
  public async getFiletype(): Promise<FiletypeResult> {
    // Return cached result if available
    if (this.cachedResult) {
      return this.cachedResult;
    }

    // If already detecting, return the existing promise
    if (this.isDetecting && this.detectionPromise) {
      return this.detectionPromise;
    }

    // Start detection
    this.isDetecting = true;
    this.detectionPromise = this.detectFiletypeInternal();

    try {
      const result = await this.detectionPromise;
      this.cachedResult = result;
      return result;
    } finally {
      this.isDetecting = false;
      this.detectionPromise = null;
    }
  }

  /**
   * Clears the cached filetype result, forcing a new detection on next call.
   */
  public clearCache(): void {
    this.cachedResult = null;
  }

  /**
   * Gets the cached filetype result without performing detection.
   * Returns null if no cached result is available.
   *
   * @returns Cached filetype result or null
   */
  public getCachedFiletype(): FiletypeResult | null {
    return this.cachedResult;
  }
}

// Export the singleton instance
export const filetypeSingleton = FiletypeSingleton.getInstance();

// Export the main function that uses the singleton
export async function detectFiletype(): Promise<FiletypeResult> {
  return filetypeSingleton.getFiletype();
}
