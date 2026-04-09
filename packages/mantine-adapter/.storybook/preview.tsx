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

const preview: Preview = {
  ...basePreview,
  parameters: {
    ...basePreview.parameters,
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
    (Story) => (
      <MantineProvider defaultColorScheme="dark">
        <ColorSchemeWrapper>
          <Story />
        </ColorSchemeWrapper>
      </MantineProvider>
    ),
  ],
};

export default preview;
