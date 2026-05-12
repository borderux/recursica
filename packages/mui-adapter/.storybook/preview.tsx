import type { Preview } from "@storybook/react-vite";
import { createPreviewConfig } from "@recursica/storybook-template/preview";
import { MantineProvider } from "@mantine/core";
import { ColorSchemeWrapper } from "../src/utils/ColorSchemeWrapper";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../recursica_variables_scoped.css";
import recursicaTokens from "../recursica_tokens.json";
import recursicaBrand from "../recursica_brand.json";
import recursicaUIKit from "../recursica_ui-kit.json";

const basePreview = createPreviewConfig({
  defaultTheme: "light",
  recursicaTokensJsonPath: recursicaTokens,
  recursicaBrandJsonPath: recursicaBrand,
  recursicaUIKitJsonPath: recursicaUIKit,
});

import recursicaTheme from "./RecursicaTheme";
import { BLOCKED_STYLING_KEYS } from "../src/utils/filterStylingProps";
import { Layer } from "@recursica/adapter-common";

// Dynamically map table disable directives globally for all blocked CSS props
const globalArgTypes = [
  ...BLOCKED_STYLING_KEYS,
  "overStyled",
  "readOnlyComponent",
].reduce(
  (acc, key) => {
    acc[key] = { table: { disable: true } };
    return acc;
  },
  {} as Record<string, { table: { disable: boolean } }>,
);

const preview: Preview = {
  ...basePreview,
  args: {
    ...basePreview.args,
    withLayer: true,
    layer: 0,
  },
  argTypes: {
    ...basePreview.argTypes,
    withLayer: {
      control: "boolean",
      description:
        "Wrap this story dynamically in a Recursica design-system Layer?",
      table: {
        category: "Story Controls",
      },
    },
    layer: {
      control: "inline-radio",
      options: [0, 1, 2, 3],
      description:
        "Dynamically tests the recursive variable mappings across underlying design-system layers.",
      table: {
        category: "Story Controls",
      },
      if: { arg: "withLayer", truthy: true },
    },
    ...globalArgTypes,
  },
  parameters: {
    ...basePreview.parameters,
    options: {
      ...basePreview.parameters?.options,
      storySort: {
        order: ["Introduction", ["Default", "*"], "*"],
      },
    },
    // Provide a backup literal regex exclusion for legacy Storybook control engines
    controls: {
      ...basePreview.parameters?.controls,
      exclude:
        /^(className|classNames|style|styles|vars|p|px|py|pt|pb|pl|pr|bg|c|opacity|ff|fz|fw|lts|ta|lh|fs|tt|td|bd|bdw|bds|bdc|bdr|shadow|w|miw|maw|h|mih|mah|overStyled)$/i,
    },
    darkMode: {
      current: "light",
      dark: recursicaTheme,
      light: recursicaTheme,
    },
  },
  decorators: [
    ...(Array.isArray(basePreview.decorators)
      ? basePreview.decorators
      : basePreview.decorators
        ? [basePreview.decorators]
        : []),
    (Story, context) => {
      const { withLayer = true, layer = 0 } = context.args;
      const content = <Story />;

      return (
        <MantineProvider defaultColorScheme="light">
          <ColorSchemeWrapper>
            {withLayer ? (
              <Layer layer={layer as 0 | 1 | 2 | 3} style={{ padding: "48px" }}>
                {content}
              </Layer>
            ) : (
              content
            )}
          </ColorSchemeWrapper>
        </MantineProvider>
      );
    },
  ],
};

export default preview;
