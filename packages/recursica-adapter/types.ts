export interface MantineThemeOverride {
  "1-scale"?: string;
  background?: string;
}
/** Recursica config overrides */
export interface RecursicaConfigOverrides {
  mantineTheme: MantineThemeOverride | undefined;
  fontWeight: {
    fontFamily: string;
    value: number;
    alias: string;
  }[];
  fontFamily?: Record<string, string>;
}
/**
 * Recursica config icons
 */
export interface RecursicaConfigIcons {
  /** The path to the output file */
  output?: string;
  /** The names of the icons */
  names?: string[];
  /** The variants of the icons */
  variants?: string[];
}
/**
 * Represents a basic design token with common properties
 */
export interface Token {
  /** The collection this token belongs to */
  collection: string;
  /** The mode or variant of the token (e.g., light, dark) */
  mode: string;
  /** The type of token (e.g., color, spacing, typography) */
  type: string;
  /** The name of the token */
  name: string;
  /** The value of the token, which can be either a direct value or a reference to another token */
  value: string | { name: string; collection: string };
}

/**
 * Represents a font family token with detailed typography properties
 */
export interface FontFamilyToken {
  /** The variable name used to reference this font token */
  variableName: string;
  /** The actual font family name */
  fontFamily: string;
  /** The font size in pixels */
  fontSize: number;
  /** The font weight configuration */
  fontWeight: {
    /** The numeric weight value */
    value: number;
    /** The weight alias (e.g., 'regular', 'bold') */
    alias: string;
  };
  /** The line height configuration */
  lineHeight: {
    /** The unit of measurement */
    unit: string;
    /** The line height value */
    value: number;
  };
  /** The letter spacing configuration */
  letterSpacing: {
    /** The unit of measurement */
    unit: string;
    /** The letter spacing value */
    value: number;
  };
  /** The text case transformation (e.g., 'uppercase', 'lowercase') */
  textCase: string;
  /** The text decoration (e.g., 'none', 'underline') */
  textDecoration: string;
}

/**
 * Represents an effect token (like shadows) with detailed effect properties
 */
export interface EffectToken {
  /** The variable name used to reference this effect token */
  variableName: string;
  /** Array of effects applied to this token */
  effects: [
    {
      /** The type of effect (e.g., 'drop-shadow', 'inner-shadow') */
      type: string;
      /** The color of the effect in RGBA format */
      color: {
        /** Red component (0-255) */
        r: number;
        /** Green component (0-255) */
        g: number;
        /** Blue component (0-255) */
        b: number;
        /** Alpha/opacity component (0-1) */
        a: number;
      };
      /** The offset of the effect */
      offset: {
        /** Horizontal offset */
        x: number;
        /** Vertical offset */
        y: number;
      };
      /** The blur radius of the effect */
      radius: number;
      /** The spread radius of the effect */
      spread: number;
    },
  ];
}

export interface ValueToken {
  collection: string;
  name: string;
}

export type ThemeTokens = Record<string, string | Record<string, string>>;

export type ContractTokens = Record<string, null>;

/**
 * Union type representing any type of collection token
 */
export type CollectionToken = Token | FontFamilyToken | EffectToken;

/**
 * Represents the structure of a JSON content file containing collections of tokens
 */
export interface JsonContent {
  /** The project ID */
  projectId: string;
  /** Nested record structure containing collections of tokens, organized by collection name and token name */
  tokens: Record<string, CollectionToken>;
  themes: Record<string, Record<string, CollectionToken>>;
  uiKit: Record<string, CollectionToken>;
}

export type JsonContentIcons = Record<string, string>;

/**
 * Represents a record of theme names to their respective theme tokens
 */
export type Themes = Record<string, Record<string, ThemeTokens>>;

/**
 * Represents the properties required for exporting tokens
 */
export interface ExportingProps {
  /** The path to the output file */
  outputPath: string;
  /** The project name */
  project: string;
}

export interface ExportingResult {
  content: string;
  path: string;
  filename: string;
}
