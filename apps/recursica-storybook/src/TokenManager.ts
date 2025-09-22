import { RecursicaColors } from "@recursica/ui-kit-mantine";
import recursica from "../../../packages/ui-kit-mantine/recursica-bundle.json" with { type: "json" };
import type {
  Token,
  RecursicaVariablesSchema,
  CollectionToken,
  GridToken,
} from "@recursica/schemas";

// Type the recursica bundle properly
const recursicaBundle = recursica as RecursicaVariablesSchema;

export interface ColorToken extends Token {
  family: string;
  shade: number;
}

export interface SizeToken extends Token {
  category: string;
  variant: string;
}

export interface GroupedColors {
  [family: string]: ColorToken[];
}

export interface GroupedSizeTokens {
  [category: string]: SizeToken[];
}

export interface ColorScaleProperty {
  subtle?: string;
  regular?: string;
  tone?: RecursicaColors;
  onTone?: RecursicaColors;
}

export interface ColorScale {
  [variant: string]: ColorScaleProperty;
}

export interface ColorScales {
  [scaleName: string]: ColorScale;
}

class TokenManager {
  private static instance: TokenManager;
  private allTokens: CollectionToken[];

  private constructor() {
    this.allTokens = Object.values(recursicaBundle.tokens);
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Get all color tokens grouped by family
   */
  public getGroupedColors(): GroupedColors {
    const colors = this.allTokens.filter(
      (token) =>
        "collection" in token &&
        token.collection === "Tokens" &&
        token.type === "color" &&
        token.name.startsWith("color/") &&
        !token.name.startsWith("color/elevation/"),
    );

    const groupedColors = colors.reduce((acc, token) => {
      if (!("collection" in token)) {
        return acc;
      }
      const nameParts = token.name.split("/");
      if (nameParts.length >= 3 && nameParts[0] === "color") {
        const family = nameParts[1];

        if (!acc[family]) {
          acc[family] = [];
        }

        acc[family].push({
          ...token,
          family,
          shade: parseInt(nameParts[2]),
        });
      }
      return acc;
    }, {} as GroupedColors);

    // Sort shades within each family (darkest to lightest)
    Object.keys(groupedColors).forEach((family) => {
      groupedColors[family].sort((a, b) => b.shade - a.shade);
    });

    return groupedColors;
  }

  /**
   * Get all size tokens grouped by category
   */
  public getGroupedSizeTokens(): GroupedSizeTokens {
    const sizeTokens = this.allTokens.filter(
      (token) =>
        "collection" in token &&
        token.collection === "Tokens" &&
        token.type === "float" &&
        token.name.startsWith("size/"),
    );

    const groupedSizeTokens = sizeTokens.reduce((acc, token) => {
      if (!("name" in token && "type" in token && token.type === "float")) {
        return acc;
      }
      const nameParts = token.name.split("/");
      if (nameParts.length >= 3 && nameParts[0] === "size") {
        const category = nameParts[1];
        const variant = nameParts[2];

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push({
          ...token,
          category,
          variant,
        });
      }
      return acc;
    }, {} as GroupedSizeTokens);

    // Sort tokens within each category by value (smallest to largest)
    Object.keys(groupedSizeTokens).forEach((category) => {
      groupedSizeTokens[category].sort((a, b) => {
        const aValue =
          typeof a.value === "number" ? a.value : parseFloat(String(a.value));
        const bValue =
          typeof b.value === "number" ? b.value : parseFloat(String(b.value));
        return aValue - bValue;
      });
    });

    return groupedSizeTokens;
  }

  /**
   * Get sorted color families
   */
  public getSortedColorFamilies(): string[] {
    return Object.keys(this.getGroupedColors()).sort();
  }

  /**
   * Get sorted size categories
   */
  public getSortedSizeCategories(): string[] {
    return Object.keys(this.getGroupedSizeTokens()).sort();
  }

  /**
   * Get all grid tokens
   */
  public getGridTokens(): GridToken[] {
    // Grid tokens have a different structure in the bundle, so we need to access them directly
    const allTokens = Object.values(recursicaBundle.tokens);
    const gridTokens = allTokens.filter(
      (token) => "type" in token && token.type === "GRID",
    );

    return gridTokens
      .filter(
        (token): token is GridToken => "type" in token && token.type === "GRID",
      )
      .map((token) => {
        return {
          type: token.type,
          name: token.name,
          description: token.description,
          layouts: (token as { layouts?: GridToken["layouts"] }).layouts || [],
        } as GridToken;
      });
  }

  /**
   * Get sorted grid breakpoints
   */
  public getSortedGridBreakpoints(): GridToken[] {
    const gridTokens = this.getGridTokens();
    return gridTokens.sort((a, b) => {
      // Sort by breakpoint size order: xs, sm, md, lg
      const order: Record<string, number> = { xs: 0, sm: 1, md: 2, lg: 3 };
      return order[a.name] - order[b.name];
    });
  }

  /**
   * Get color scales dynamically from theme tokens
   * Extracts scales like neutral, scale-1, scale-2 with their default properties and variants
   */
  public getColorScales(themeName?: string): ColorScales {
    if (!themeName) {
      themeName = Object.keys(recursicaBundle.themes)[0];
    }

    const themeTokens = Object.values(recursicaBundle.themes[themeName]).filter(
      (token) => {
        return (
          "collection" in token &&
          token.collection === "Themes" &&
          token.name.startsWith("colors/") &&
          token.name.split("/").length >= 4 // colors/scale-name/variant/property
        );
      },
    );

    // First, extract all scale names by looking for default/tone patterns
    const scaleNames = new Set<string>();
    themeTokens.forEach((token) => {
      if (!("name" in token)) return;
      const nameParts = token.name.split("/");
      if (
        nameParts.length >= 4 &&
        nameParts[2] === "default" &&
        nameParts[3] === "tone"
      ) {
        scaleNames.add(nameParts[1]);
      }
    });

    // Initialize the color scales structure
    const colorScales: ColorScales = {};
    scaleNames.forEach((scaleName) => {
      colorScales[scaleName] = {};
    });

    // Populate the scales with their properties
    themeTokens.forEach((token) => {
      if (!("name" in token)) return;

      const nameParts = token.name.split("/");
      if (nameParts.length < 4 || nameParts[0] !== "colors") return;

      const scaleName = nameParts[1];
      const variant = nameParts[2];
      const property = nameParts[3];

      if (!scaleNames.has(scaleName)) return;

      // Map property names to our interface
      const propertyMap: { [key: string]: keyof ColorScaleProperty } = {
        subtle: "subtle",
        regular: "regular",
        tone: "tone",
        "on-tone": "onTone",
      };

      const mappedProperty = propertyMap[property];
      if (!mappedProperty) return;

      // Initialize variant if it doesn't exist
      if (!colorScales[scaleName][variant]) {
        colorScales[scaleName][variant] = {};
      }

      colorScales[scaleName][variant][mappedProperty] =
        token.name as RecursicaColors;
    });

    return colorScales;
  }

  /**
   * Get available color scale names
   */
  public getColorScaleNames(themeName?: string): string[] {
    const colorScales = this.getColorScales(themeName);
    return Object.keys(colorScales).sort();
  }

  /**
   * Get theme colors for a specific mode (Light/Dark)
   */
  public getThemeColors(themeName?: string): Array<{
    name: string;
    color: RecursicaColors;
    opacity?: number;
  }> {
    if (!themeName) {
      themeName = Object.keys(recursicaBundle.themes)[0];
    }
    let selectedMode: string;
    // Get all theme tokens for the specified mode
    const themeTokens = Object.values(recursicaBundle.themes[themeName]).filter(
      (token) => {
        if (!("mode" in token)) return false;
        if (!selectedMode) selectedMode = token.mode;
        return (
          "collection" in token &&
          token.collection === "Themes" &&
          token.mode === selectedMode &&
          token.name.startsWith("colors/") &&
          token.name.split("/").length === 2
        );
      },
    );

    // Map the theme tokens to the expected format
    const themeColors = themeTokens
      .map((token) => {
        if (!("name" in token)) return null;

        const colorName = token.name.split("/")[1]; // Get the color name part
        const displayName =
          colorName.charAt(0).toUpperCase() + colorName.slice(1); // Capitalize first letter

        // Check if this is a disabled or overlay color (which have opacity)
        const isOpacityColor =
          colorName === "disabled" || colorName === "overlay";

        return isOpacityColor
          ? {
              name: `${displayName} \n(opacity)`,
              color: "colors/black",
              opacity: 0.38,
            }
          : {
              name: displayName,
              color: token.name,
              opacity: undefined,
            };
      })
      .filter(Boolean) as Array<{
      name: string;
      color: string;
      opacity?: number;
    }>;

    // Sort colors: regular colors first, then opacity colors at the end
    themeColors.sort((a, b) => {
      const aHasOpacity = a.opacity !== undefined;
      const bHasOpacity = b.opacity !== undefined;

      if (aHasOpacity && !bHasOpacity) return 1; // a goes after b
      if (!aHasOpacity && bHasOpacity) return -1; // a goes before b
      return 0; // maintain original order within each group
    });

    return themeColors as Array<{
      name: string;
      color: RecursicaColors;
      opacity?: number;
    }>;
  }
}

export default TokenManager;
