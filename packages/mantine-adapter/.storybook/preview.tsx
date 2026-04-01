import type { Preview } from "@storybook/react-vite";
import { createPreviewConfig } from "@recursica/storybook-template/preview";
import { MantineProvider } from "@mantine/core";
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

const preview: Preview = {
  ...basePreview,
  decorators: [
    ...(Array.isArray(basePreview.decorators)
      ? basePreview.decorators
      : basePreview.decorators
        ? [basePreview.decorators]
        : []),
    (Story) => (
      <MantineProvider defaultColorScheme="auto">
        <Story />
      </MantineProvider>
    ),
  ],
};

export default preview;
