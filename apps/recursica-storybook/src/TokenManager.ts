import recursica from "@recursica/official-release/recursica-bundle.json" with { type: "json" };
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

export interface GroupedColors {
  [family: string]: ColorToken[];
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
        token.collection === "tokens" &&
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
  public getGroupedSizeTokens(): Record<string, Token> {
    const sizeTokens = this.allTokens.filter(
      (token) =>
        "collection" in token &&
        token.collection === "tokens" &&
        token.type === "float" &&
        token.name.startsWith("size/"),
    );

    const groupedSizeTokens = sizeTokens.reduce(
      (acc, token) => {
        if (!("name" in token && "type" in token && token.type === "float")) {
          return acc;
        }
        const nameParts = token.name.split("/");
        if (nameParts.length >= 2 && nameParts[0] === "size") {
          const variant = nameParts[1];
          acc[variant] = token;
        }
        return acc;
      },
      {} as Record<string, Token>,
    );

    return groupedSizeTokens;
  }

  /**
   * Get sorted color families
   */
  public getSortedColorFamilies(): string[] {
    return Object.keys(this.getGroupedColors()).sort();
  }

  /**
   * Get all size tokens sorted by value from smaller to bigger
   */
  public getSortedSizeTokens(): Token[] {
    return Object.values(this.getGroupedSizeTokens()).sort((a, b) => {
      return (a.value as number) - (b.value as number);
    });
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
