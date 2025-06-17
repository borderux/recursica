import type { Themes, ThemeTokens, RecursicaConfigOverrides } from "../types";
import type { Token, CollectionToken } from "@recursica/schemas";
import {
  isFontFamilyToken,
  isEffectToken,
  isColorOrFloatToken,
} from "../utils/helpers";
import { capitalize } from "../utils/capitalize";

export interface ProcessTokensParams {
  tokens: ThemeTokens;
  themes: Themes;
  overrides: RecursicaConfigOverrides | undefined;
}
export class ProcessTokens {
  public tokens: ThemeTokens = {};
  public themes: Themes = {};

  public breakpoints: Record<string, string> = {};
  public colors: string[] = [];
  public spacers: string[] = [];
  public borderRadius: string[] = [];
  public uiKit: ThemeTokens = {};

  public overrides: RecursicaConfigOverrides | undefined;

  constructor(overrides: RecursicaConfigOverrides | undefined) {
    this.overrides = overrides;
  }

  private processValue = (
    target: Record<string, number | string | Token | ThemeTokens>,
    token: Token,
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

  private processTokenValue(
    token: Token,
    modeName: string,
    jsonThemeName?: string,
  ) {
    if (token.collection === "Breakpoints") {
      this.processValue(this.breakpoints, token);
      // Add breakpoints to uiKit with 'breakpoints/' prefix
      const uiKitTarget: Record<string, number | string | Token | ThemeTokens> =
        {};
      this.processValue(uiKitTarget, token);
      Object.entries(uiKitTarget).forEach(([key, value]) => {
        // Ensure we only store string values
        if (typeof value === "string") {
          this.uiKit[`breakpoint/${key}`] = value;
        } else if (typeof value === "number") {
          this.uiKit[`breakpoint/${key}`] = `${value.toString()}px`;
        }
      });
    } else if (token.collection === "UI Kit") {
      this.processValue(this.uiKit, token);
    } else if (token.collection === "Tokens") {
      this.processValue(this.tokens, token);
    } else {
      if (!jsonThemeName) return;
      if (!this.themes[jsonThemeName]) this.themes[jsonThemeName] = {};

      if (!this.themes[jsonThemeName][modeName])
        this.themes[jsonThemeName][modeName] = {};
      this.processValue(this.themes[jsonThemeName][modeName], token);
    }
  }

  public processTokens(
    variables: Record<string, CollectionToken>,
    jsonThemeName?: string,
  ) {
    // Process tokens collection
    for (const token of Object.values(variables)) {
      if (isFontFamilyToken(token)) {
        if (!jsonThemeName) continue;
        if (!this.tokens[jsonThemeName]) this.tokens[jsonThemeName] = {};
        if (typeof this.tokens[jsonThemeName] !== "object")
          this.tokens[jsonThemeName] = {};

        this.tokens[jsonThemeName][`typography/${token.variableName}`] =
          this.overrides?.fontFamily?.[token.fontFamily] ?? token.fontFamily;
        this.tokens[jsonThemeName][`typography/${token.variableName}-size`] =
          `${token.fontSize.toString()}px`;
        // check if overrides.fontWeight is defined
        if (this.overrides?.fontWeight) {
          const weight = this.overrides.fontWeight.find(
            (weight) =>
              weight.alias === token.fontWeight.alias &&
              weight.fontFamily === token.fontFamily,
          );
          // check if there's a weight that matches the alias and fontFamily
          // if there is, use the value from the overrides
          // if there isn't, use the value from the token
          if (weight) {
            this.tokens[jsonThemeName][
              `typography/${token.variableName}-weight`
            ] = weight.value.toString();
          } else {
            this.tokens[jsonThemeName][
              `typography/${token.variableName}-weight`
            ] = token.fontWeight.value.toString();
          }
        } else {
          this.tokens[jsonThemeName][
            `typography/${token.variableName}-weight`
          ] = token.fontWeight.value.toString();
        }
        if (token.lineHeight.unit === "PERCENT") {
          this.tokens[jsonThemeName][
            `typography/${token.variableName}-line-height`
          ] = `${token.lineHeight.value.toString()}%`;
        } else {
          this.tokens[jsonThemeName][
            `typography/${token.variableName}-line-height`
          ] = "1.2";
        }
        this.tokens[jsonThemeName][
          `typography/${token.variableName}-letter-spacing`
        ] =
          token.letterSpacing.unit === "PIXELS"
            ? `${token.letterSpacing.value.toString()}px`
            : `${token.letterSpacing.value.toString()}%`;
        this.tokens[jsonThemeName][
          `typography/${token.variableName}-text-case`
        ] = token.textCase;
        this.tokens[jsonThemeName][
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
        this.tokens[`effect/${token.variableName}`] = effectValue.join(", ");
        continue;
      }
      if (isColorOrFloatToken(token)) {
        const modeName = capitalize(token.mode)
          .replace(/[()/]/g, "-")
          .replace(/\s/g, "")
          .replace(/-$/, "");

        if (modeName !== "mode1") this.themes[modeName] = {};
        if (token.type === "color" && !this.colors.includes(token.name)) {
          this.colors.push(token.name);
        }
        if (
          token.name.startsWith("size/spacer/") &&
          !this.spacers.includes(token.name)
        ) {
          this.spacers.push(token.name);
        }
        if (
          token.name.startsWith("size/border-radius/") &&
          !this.borderRadius.includes(token.name)
        ) {
          this.borderRadius.push(token.name);
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
