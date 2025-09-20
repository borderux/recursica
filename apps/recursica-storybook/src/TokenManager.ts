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

class TokenManager {
  private static instance: TokenManager;
  private allTokens: CollectionToken[];
  private themes: RecursicaVariablesSchema["themes"];

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
}

export default TokenManager;
