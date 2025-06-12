import type {
  Token,
  EffectToken,
  FontFamilyToken,
  CollectionToken,
} from "@repo/shared-interfaces";

/**
 * Type guard function to check if a token is a FontFamilyToken
 *
 * @param token - The token to check
 * @returns True if the token has fontFamily and variableName properties, indicating it's a FontFamilyToken
 */
export function isFontFamilyToken(
  token: CollectionToken,
): token is FontFamilyToken {
  return "fontFamily" in token && "variableName" in token;
}

/**
 * Type guard function to check if a token is an EffectToken
 *
 * @param token - The token to check
 * @returns True if the token has effects and variableName properties, indicating it's an EffectToken
 */
export function isEffectToken(token: CollectionToken): token is EffectToken {
  return "effects" in token && "variableName" in token;
}

/**
 * Type guard function to check if a token is a basic Token (color or float)
 *
 * @param token - The token to check
 * @returns True if the token has mode, type, name, and value properties, indicating it's a basic Token
 */
export function isColorOrFloatToken(token: CollectionToken): token is Token {
  return (
    "mode" in token && "type" in token && "name" in token && "value" in token
  );
}
