import recursica from "../../../packages/ui-kit-mantine/recursica-bundle.json" with { type: "json" };
import type { Token, RecursicaVariablesSchema } from "@recursica/schemas";

// Type the recursica bundle properly
const recursicaBundle = recursica as RecursicaVariablesSchema;

// Extended token types that include our computed properties
export interface ColorToken extends Token {
  shade: number;
  family: string;
  value: string; // Override to ensure it's a string for colors
}

export interface SizeToken extends Token {
  variant: string;
  category: string;
  value: number; // Override to ensure it's a number for sizes
}

export interface GroupedColors {
  [family: string]: ColorToken[];
}

export interface GroupedSizeTokens {
  [category: string]: SizeToken[];
}

class TokenManager {
  private static instance: TokenManager;
  private allTokens: Token[];

  private constructor() {
    this.allTokens = Object.values(recursicaBundle.tokens) as Token[];
  }

  /**
   * Create a ColorToken from a base Token
   */
  private createColorToken(
    token: Token,
    family: string,
    shade: number,
  ): ColorToken {
    return {
      ...token,
      value: String(token.value),
      shade,
      family,
    } as ColorToken;
  }

  /**
   * Create a SizeToken from a base Token
   */
  private createSizeToken(
    token: Token,
    category: string,
    variant: string,
  ): SizeToken {
    return {
      ...token,
      value: Number(token.value),
      variant,
      category,
    } as SizeToken;
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
        token.collection === "Tokens" &&
        token.type === "color" &&
        token.name.startsWith("color/") &&
        !token.name.startsWith("color/elevation/"),
    );

    const groupedColors = colors.reduce((acc, token) => {
      const nameParts = token.name.split("/");
      if (nameParts.length >= 3 && nameParts[0] === "color") {
        const family = nameParts[1];
        const shade = nameParts[2];

        if (!acc[family]) {
          acc[family] = [];
        }

        acc[family].push(
          this.createColorToken(token, family, parseInt(shade) || 0),
        );
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
        token.collection === "Tokens" &&
        token.type === "float" &&
        token.name.startsWith("size/"),
    );

    const groupedSizeTokens = sizeTokens.reduce((acc, token) => {
      const nameParts = token.name.split("/");
      if (nameParts.length >= 3 && nameParts[0] === "size") {
        const category = nameParts[1];
        const variant = nameParts[2];

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(this.createSizeToken(token, category, variant));
      }
      return acc;
    }, {} as GroupedSizeTokens);

    // Sort tokens within each category by value (smallest to largest)
    Object.keys(groupedSizeTokens).forEach((category) => {
      groupedSizeTokens[category].sort((a, b) => a.value - b.value);
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
   * Get all tokens by type
   */
  public getTokensByType(type: "color" | "float"): Token[] {
    return this.allTokens.filter(
      (token) => token.collection === "Tokens" && token.type === type,
    );
  }

  /**
   * Get tokens by name pattern
   */
  public getTokensByNamePattern(pattern: string): Token[] {
    return this.allTokens.filter((token) => token.name.startsWith(pattern));
  }

  /**
   * Get all raw tokens
   */
  public getAllTokens(): Token[] {
    return [...this.allTokens];
  }

  /**
   * Get tokens by collection
   */
  public getTokensByCollection(collection: string): Token[] {
    return this.allTokens.filter((token) => token.collection === collection);
  }
}

export default TokenManager;
