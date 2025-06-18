/**
 * WARNING: This file is auto-generated from a JSON schema. Do not edit directly.
 */

/**
 * Union type representing any type of collection token
 */
export type CollectionToken = Token | FontFamilyToken | EffectToken;
/**
 * Represents a variable casted value
 */
export type VariableCastedValue = string | boolean | number;

/**
 * Schema for Recursica design tokens and variables
 */
export interface RecursicaVariablesSchema {
  /**
   * The project ID
   */
  projectId: string;
  /**
   * The plugin version
   */
  pluginVersion: string;
  /**
   * Nested record structure containing collections of tokens, organized by collection name and token name
   */
  tokens: {
    [k: string]: CollectionToken;
  };
  /**
   * Themes containing collections of tokens
   */
  themes: {
    [k: string]: {
      [k: string]: CollectionToken;
    };
  };
  /**
   * UI Kit components
   */
  uiKit: {
    [k: string]: CollectionToken;
  };
}
/**
 * Represents a basic design token with common properties
 */
export interface Token {
  /**
   * The collection this token belongs to
   */
  collection: string;
  /**
   * The mode or variant of the token (e.g., light, dark)
   */
  mode: string;
  /**
   * The type of token (e.g., color, spacing, typography)
   */
  type: string;
  /**
   * The name of the token
   */
  name: string;
  /**
   * The value of the token, which can be either a direct value or a reference to another token
   */
  value: VariableCastedValue | VariableReferenceValue;
}
/**
 * Represents a variable reference value
 */
export interface VariableReferenceValue {
  collection: string;
  name: string;
}
/**
 * Represents a font family token with detailed typography properties
 */
export interface FontFamilyToken {
  /**
   * The variable name used to reference this font token
   */
  variableName: string;
  /**
   * The actual font family name
   */
  fontFamily: string;
  /**
   * The font size in pixels
   */
  fontSize: number;
  /**
   * The font weight configuration
   */
  fontWeight: {
    /**
     * The numeric weight value
     */
    value: number;
    /**
     * The weight alias (e.g., 'regular', 'bold')
     */
    alias: string;
  };
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  /**
   * The text case transformation (e.g., 'uppercase', 'lowercase')
   */
  textCase: string;
  /**
   * The text decoration (e.g., 'none', 'underline')
   */
  textDecoration: string;
}
/**
 * The line height configuration
 */
export interface LineHeight {
  value: number;
  unit: string;
}
/**
 * The letter spacing configuration
 */
export interface LetterSpacing {
  value: number;
  unit: string;
}
export interface EffectToken {
  /**
   * The variable name used to reference this effect token
   */
  variableName: string;
  effects: Effect[];
}
/**
 * Represents an effect token (like shadows) with detailed effect properties
 */
export interface Effect {
  /**
   * The type of effect (e.g., 'drop-shadow', 'inner-shadow')
   */
  type: string;
  /**
   * The color of the effect in RGBA format
   */
  color: {
    /**
     * Red component (0-255)
     */
    r: number;
    /**
     * Green component (0-255)
     */
    g: number;
    /**
     * Blue component (0-255)
     */
    b: number;
    /**
     * Alpha/opacity component (0-1)
     */
    a: number;
  };
  /**
   * The offset of the effect
   */
  offset: {
    /**
     * Horizontal offset
     */
    x: number;
    /**
     * Vertical offset
     */
    y: number;
  };
  /**
   * The blur radius of the effect
   */
  radius: number;
  /**
   * The spread radius of the effect
   */
  spread: number;
}
