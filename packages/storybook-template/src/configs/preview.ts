import type { Preview } from "@storybook/react-vite";
import {
  withRecursicaJson,
  withRecursicaFonts,
  withRecursicaTheme,
} from "../decorators";
import {
  commonParameters,
  accessibilityParameters,
  backgroundParameters,
  lightBackgroundParameters,
  controlParameters,
} from "../parameters/index";

export interface PreviewConfigOptions {
  /** The default theme to inject into the storybook global toolbar. Defaults to "dark" */
  defaultTheme?: "light" | "dark";
  /** Whether to automatically inject the RecursicaThemeProvider context provider onto stories, defaults to true */
  useRecursicaTheme?: boolean;
  /** The fully imported \`recursica_tokens.json\` JSON object. Must be populated so inherited Stories can visualize the base token systems. */
  recursicaTokensJsonPath: Record<string, unknown> | null;
  /** The fully imported \`recursica_brand.json\` JSON object. Must be populated so inherited Stories can visualize active brand matrices. */
  recursicaBrandJsonPath: Record<string, unknown> | null;
  /** The fully imported \`recursica_ui-kit.json\` JSON object (strictly optional usage inside Storybook contexts but provided for schema completeness). */
  recursicaUIKitJsonPath: Record<string, unknown> | null;
}

export const createPreviewConfig = (options: PreviewConfigOptions): Preview => {
  const {
    defaultTheme = "dark",
    useRecursicaTheme = true,
    recursicaTokensJsonPath,
    recursicaBrandJsonPath,
    recursicaUIKitJsonPath,
  } = options;

  const decorators: NonNullable<Preview["decorators"]> = [];

  // Add recursica JSON context decorator if any json is provided
  if (
    recursicaTokensJsonPath ||
    recursicaBrandJsonPath ||
    recursicaUIKitJsonPath
  ) {
    decorators.push(
      withRecursicaJson({
        tokensJson: recursicaTokensJsonPath,
        brandJson: recursicaBrandJsonPath,
        uiKitJson: recursicaUIKitJsonPath,
      }),
    );
  }

  // Add recursica font loader decorator if tokens are provided
  if (recursicaTokensJsonPath) {
    decorators.push(withRecursicaFonts({ tokens: recursicaTokensJsonPath }));
  }

  // Add direct generic recursica theme wrapper
  if (useRecursicaTheme) {
    decorators.push(withRecursicaTheme(defaultTheme as "light" | "dark"));
  }

  // Combine all parameters
  const parameters = {
    ...commonParameters,
    ...accessibilityParameters,
    ...controlParameters,
    ...(defaultTheme === "light"
      ? lightBackgroundParameters
      : backgroundParameters),
  };

  return {
    parameters,
    decorators,
    globalTypes: {},
  };
};
