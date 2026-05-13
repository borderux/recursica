import type { Meta } from "@storybook/react-vite";
import { AdaptersContent, MuiLogo } from "@recursica/storybook-template";
import { VersionInfo } from "./Version";
import { OverStylingInfo } from "./OverStyling";

const DOCS_URL = "https://recursica.com";
const FORGE_URL = "https://forge.recursica.com";

import { Container, Box, Group, Title, Text, Link } from "./components";

function IntroductionContent() {
  return (
    <Container size="md" style={{ padding: "32px 0", maxWidth: 640 }}>
      <Group gap="rec-md" mb={2}>
        <MuiLogo width={40} height={40} />
        <Box>
          <Title order={1} m={0}>
            Recursica Design System (MUI Adapter)
          </Title>
          <Link href="https://mui.com" target="_blank" rel="noreferrer">
            mui.com
          </Link>
        </Box>
      </Group>
      <Text mb={4}>
        This Storybook showcases the Recursica design system implemented for the{" "}
        <strong>Material UI (MUI) Kit</strong>. It provides reusable components
        that map our design tokens to MUI's robust component layer.
      </Text>

      <Box component="section" sx={{ mb: 4 }}>
        <Title order={2} mb={1}>
          Looking for another UI Kit?
        </Title>
        <Text>
          Are you using a different UI Kit (like Mantine)? Recursica provides
          multiple adapters for different frameworks.
        </Text>
        <Box sx={{ mt: 2 }}>
          <a
            href="./?path=/story/introduction--adapters"
            target="_parent"
            className="adapter-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_background)",
              color:
                "var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_text)",
              textDecoration: "none",
              borderRadius:
                "var(--recursica_ui-kit_components_button_variants_sizes_default_properties_border-radius)",
              height:
                "var(--recursica_ui-kit_components_button_variants_sizes_default_properties_height)",
              padding:
                "0 var(--recursica_ui-kit_components_button_variants_sizes_default_properties_horizontal-padding)",
              fontFamily:
                "var(--recursica_ui-kit_components_button_variants_sizes_default_properties_text_font-family)",
              fontSize:
                "var(--recursica_ui-kit_components_button_variants_sizes_default_properties_text_font-size)",
              fontWeight:
                "var(--recursica_ui-kit_components_button_variants_sizes_default_properties_text_font-weight)",
              boxShadow:
                "var(--recursica_ui-kit_components_button_variants_styles_solid_properties_elevation)",
              border:
                "var(--recursica_ui-kit_components_button_variants_styles_solid_properties_border-size) solid var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_border-color)",
              transition: "opacity 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.color =
                "var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_text-hover)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.color =
                "var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_text)";
            }}
          >
            View Supported Adapters
          </a>
        </Box>
      </Box>

      <Box component="section" sx={{ mb: 4 }}>
        <Title order={2} mb={1}>
          Installation
        </Title>
        <Text>To install the MUI adapter in your project, run:</Text>
        <Box
          component="pre"
          sx={{
            p: 1.5,
            bgcolor: "grey.100",
            borderRadius: 1,
            fontSize: 13,
            mt: 1,
          }}
        >
          <code>
            npm install @recursica/mui-adapter @mui/material @emotion/react
            @emotion/styled
          </code>
        </Box>
      </Box>

      <Box component="section" sx={{ mb: 4 }}>
        <Title order={2} mb={1}>
          Tokens
        </Title>
        <Text>
          Raw design tokens (colors, sizes, font weights, opacities, etc.) that
          feed the theme and components. These are the primitive values defined
          in your token set and exposed as CSS custom properties.
        </Text>
      </Box>

      <Box component="section" sx={{ mb: 4 }}>
        <Title order={2} mb={1}>
          Theme
        </Title>
        <Text>
          Brand and theme layer built on top of tokens. Typography types,
          dimensions, and layout grids are defined here. Theme uses the tokens
          and exposes both CSS variables and helper classes (e.g. typography
          classes) for consistent styling across the product.
        </Text>
      </Box>

      <Box component="section" sx={{ mb: 4 }}>
        <Title order={2} mb={1}>
          Configuring Recursica
        </Title>
        <Text>
          To modify the Recursica configuration (tokens, brand, theme), go to{" "}
          <Link href={FORGE_URL} target="_blank" rel="noopener noreferrer">
            {FORGE_URL}
          </Link>
          . Changes there drive the tokens and theme you see in this Storybook.
        </Text>
      </Box>

      <Box component="section" sx={{ mb: 4 }}>
        <Title order={2} mb={1}>
          Documentation
        </Title>
        <Text>
          For full documentation, guides, and API reference, visit{" "}
          <Link href={DOCS_URL} target="_blank" rel="noopener noreferrer">
            {DOCS_URL}
          </Link>
          .
        </Text>
      </Box>
    </Container>
  );
}

const meta = {
  title: "Introduction",
} satisfies Meta;

export default meta;

export const Welcome = {
  render: () => <IntroductionContent />,
};

export const Adapters = {
  render: () => <AdaptersContent />,
};

export const OverStyling = {
  name: "Over Styling",
  render: () => <OverStylingInfo />,
};

export const VersionInfoStory = {
  name: "Version Info",
  render: () => <VersionInfo />,
};
