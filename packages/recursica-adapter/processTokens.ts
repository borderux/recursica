import type {
  Token,
  Themes,
  ThemeTokens,
  RecursicaConfigOverrides,
  CollectionToken,
} from "./types";
import {
  isFontFamilyToken,
  isEffectToken,
  isColorOrFloatToken,
} from "./utils/helpers";
import { capitalize } from "./utils/capitalize";

export interface ProcessTokensParams {
  tokens: ThemeTokens;
  themes: Themes;
  overrides: RecursicaConfigOverrides | undefined;
}
export class ProcessTokens {
  tokens: ThemeTokens = {};

  breakpoints: Record<string, string> = {};

  colorTokens: string[] = [];

  icons: Record<string, string> = {};

  themes: Themes = {};

  uiKit: ThemeTokens = {};

  processTokenValue(token: Token, modeName: string, jsonThemeName?: string) {
    const processValue = (
      target: Record<string, number | string | Token | ThemeTokens>,
    ) => {
      if (typeof token.value === "string") {
        target[token.name] = token.value;
        return true;
      }
      if (typeof token.value === "number") {
        target[token.name] = `${token.value}px`;
        return true;
      }
      if (typeof token.value === "object") {
        target[token.name] = token.value as Token;
        return true;
      }
      return false;
    };

    if (token.collection === "Breakpoints") {
      processValue(this.breakpoints);
      // Add breakpoints to uiKit with 'breakpoints/' prefix
      const uiKitTarget: Record<string, number | string | Token | ThemeTokens> =
        {};
      processValue(uiKitTarget);
      Object.entries(uiKitTarget).forEach(([key, value]) => {
        // Ensure we only store string values
        if (typeof value === "string") {
          this.uiKit[`breakpoint/${key}`] = value;
        } else if (typeof value === "number") {
          this.uiKit[`breakpoint/${key}`] = `${value.toString()}px`;
        }
      });
    } else if (token.collection === "UI Kit") {
      processValue(this.uiKit);
    } else if (token.collection === "Tokens") {
      processValue(this.tokens);
    } else {
      if (!jsonThemeName) return;
      if (!this.themes[jsonThemeName]) this.themes[jsonThemeName] = {};

      if (!this.themes[jsonThemeName][modeName])
        this.themes[jsonThemeName][modeName] = {};
      processValue(this.themes[jsonThemeName][modeName]);
    }
  }

  processTokens(
    variables: Record<string, CollectionToken>,
    { tokens, themes, overrides }: ProcessTokensParams,
    jsonThemeName?: string,
  ) {
    // Process tokens collection
    for (const token of Object.values(variables)) {
      if (isFontFamilyToken(token)) {
        if (!jsonThemeName) continue;
        if (!tokens[jsonThemeName]) tokens[jsonThemeName] = {};
        if (typeof tokens[jsonThemeName] !== "object")
          tokens[jsonThemeName] = {};

        tokens[jsonThemeName][`typography/${token.variableName}`] =
          overrides?.fontFamily?.[token.fontFamily] ?? token.fontFamily;
        tokens[jsonThemeName][`typography/${token.variableName}-size`] =
          `${token.fontSize.toString()}px`;
        // check if overrides.fontWeight is defined
        if (overrides?.fontWeight) {
          const weight = overrides.fontWeight.find(
            (weight) =>
              weight.alias === token.fontWeight.alias &&
              weight.fontFamily === token.fontFamily,
          );
          // check if there's a weight that matches the alias and fontFamily
          // if there is, use the value from the overrides
          // if there isn't, use the value from the token
          if (weight) {
            tokens[jsonThemeName][`typography/${token.variableName}-weight`] =
              weight.value.toString();
          } else {
            tokens[jsonThemeName][`typography/${token.variableName}-weight`] =
              token.fontWeight.value.toString();
          }
        } else {
          tokens[jsonThemeName][`typography/${token.variableName}-weight`] =
            token.fontWeight.value.toString();
        }
        if (token.lineHeight.unit === "PERCENT") {
          tokens[jsonThemeName][
            `typography/${token.variableName}-line-height`
          ] = `${token.lineHeight.value.toString()}%`;
        } else {
          tokens[jsonThemeName][
            `typography/${token.variableName}-line-height`
          ] = "1.2";
        }
        tokens[jsonThemeName][
          `typography/${token.variableName}-letter-spacing`
        ] =
          token.letterSpacing.unit === "PIXELS"
            ? `${token.letterSpacing.value.toString()}px`
            : `${token.letterSpacing.value.toString()}%`;
        tokens[jsonThemeName][`typography/${token.variableName}-text-case`] =
          token.textCase;
        tokens[jsonThemeName][
          `typography/${token.variableName}-text-decoration`
        ] = token.textDecoration;
        continue;
      }
      if (isEffectToken(token)) {
        const effectValue: string[] = [];
        token.effects.forEach((effect) => {
          const {
            color: { r, g, b, a },
            offset: { x, y },
            radius,
            spread,
          } = effect;
          effectValue.push(
            `${x.toString()}px ${y.toString()}px ${radius.toString()}px ${spread.toString()}px rgba(${r.toString()}, ${g.toString()}, ${b.toString()}, ${a.toString()})`,
          );
        });
        tokens[`effect/${token.variableName}`] = effectValue.join(", ");
        continue;
      }
      if (isColorOrFloatToken(token)) {
        const modeName = capitalize(token.mode)
          .replace(/[()/]/g, "-")
          .replace(/\s/g, "")
          .replace(/-$/, "");

        if (modeName !== "mode1") themes[modeName] = {};
        if (token.type === "color" && !this.colorTokens.includes(token.name)) {
          this.colorTokens.push(token.name);
        }
        this.processTokenValue(token, modeName, jsonThemeName);
      } else {
        console.warn(
          `${JSON.stringify(token, null, 2)} could not be processed`,
        );
      }
    }
  }
}
