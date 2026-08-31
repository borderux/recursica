import type { Preview } from "@storybook/react-vite";
import { createPreviewConfig } from "@recursica/storybook-template/preview";
import { MantineProvider } from "@mantine/core";
import { Layer } from "@recursica/adapter-common";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@recursica/adapter-common/style.css";
import "@recursica/official-release/recursica_variables_scoped.css";
import recursicaTokens from "@recursica/official-release/recursica_tokens.json";
import recursicaBrand from "@recursica/official-release/recursica_brand.json";
import recursicaUIKit from "@recursica/official-release/recursica_ui-kit.json";

const basePreview = createPreviewConfig({
  defaultTheme: "light",
  recursicaTokensJsonPath: recursicaTokens,
  recursicaBrandJsonPath: recursicaBrand,
  recursicaUIKitJsonPath: recursicaUIKit,
});

// Mirrors mantine-adapter's own .storybook/preview.tsx decorator (every story defaults to
// withLayer: true, layer: 0, wrapped with 48px padding) — every real adapter's own preview.tsx
// applies this same wrapping, so a target adapter's story renders inside the same Layer
// chrome/padding the source-of-truth side does. Without this, target screenshots come out
// dramatically smaller/differently-positioned than the source of truth's (no Layer padding,
// background, or border-radius at all), which alone can blow past the pixel-diff threshold
// regardless of whether the actual Recursica tokens match — a false positive, not a real
// component bug. ColorSchemeWrapper (mantine-adapter's dark-mode-toggle sync helper) is
// intentionally not replicated — it only matters for the interactive dev-mode UI, not automated
// screenshot diffing, which always runs in a single theme.
const preview: Preview = {
  ...basePreview,
  decorators: [
    (Story, context) => {
      const { withLayer = true, layer = 0 } = context.args;
      const content = <Story />;
      return (
        <MantineProvider>
          {withLayer ? (
            <Layer layer={layer as 0 | 1 | 2 | 3} style={{ padding: "48px" }}>
              {content}
            </Layer>
          ) : (
            content
          )}
        </MantineProvider>
      );
    },
    ...(basePreview.decorators || []),
  ],
};

export default preview;
