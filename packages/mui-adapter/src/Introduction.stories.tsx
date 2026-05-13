import type { Meta } from "@storybook/react-vite";
import { AdaptersContent, MuiLogo } from "@recursica/storybook-template";
import { Button } from "./components/Button/Button";
import { VersionInfo } from "./Version";
import { OverStylingInfo } from "./OverStyling";

const DOCS_URL = "https://recursica.com";
const FORGE_URL = "https://forge.recursica.com";

const sectionStyle: React.CSSProperties = {
  marginBottom: 32,
};

const headingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#333",
  marginBottom: 8,
  marginTop: 0,
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#444",
  margin: 0,
};

const linkStyle: React.CSSProperties = {
  color: "#0066cc",
  textDecoration: "none",
};

function IntroductionContent() {
  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <MuiLogo width={40} height={40} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Recursica Design System (MUI Adapter)
          </h1>
          <a
            href="https://mui.com"
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            mui.com
          </a>
        </div>
      </div>
      <p style={{ ...bodyStyle, marginBottom: 24 }}>
        This Storybook showcases the Recursica design system implemented for the{" "}
        <strong>Material UI (MUI) Kit</strong>. It provides reusable components
        that map our design tokens to MUI's robust component layer.
      </p>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Looking for another UI Kit?</h2>
        <p style={bodyStyle}>
          Are you using a different UI Kit (like Mantine)? Recursica provides
          multiple adapters for different frameworks.
        </p>
        <div style={{ marginTop: "16px" }}>
          <Button
            href="./?path=/story/introduction--adapters"
            target="_parent"
            variant="solid"
          >
            View Supported Adapters
          </Button>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Installation</h2>
        <p style={bodyStyle}>
          To install the MUI adapter in your project, run:
        </p>
        <pre
          style={{
            padding: 12,
            backgroundColor: "#f5f5f5",
            borderRadius: 6,
            fontSize: 13,
            marginTop: 8,
          }}
        >
          <code>
            npm install @recursica/mui-adapter @mui/material @emotion/react
            @emotion/styled
          </code>
        </pre>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Tokens</h2>
        <p style={bodyStyle}>
          Raw design tokens (colors, sizes, font weights, opacities, etc.) that
          feed the theme and components. These are the primitive values defined
          in your token set and exposed as CSS custom properties.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Theme</h2>
        <p style={bodyStyle}>
          Brand and theme layer built on top of tokens. Typography types,
          dimensions, and layout grids are defined here. Theme uses the tokens
          and exposes both CSS variables and helper classes (e.g. typography
          classes) for consistent styling across the product.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Configuring Recursica</h2>
        <p style={bodyStyle}>
          To modify the Recursica configuration (tokens, brand, theme), go to{" "}
          <a
            href={FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            {FORGE_URL}
          </a>
          . Changes there drive the tokens and theme you see in this Storybook.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Documentation</h2>
        <p style={bodyStyle}>
          For full documentation, guides, and API reference, visit{" "}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            {DOCS_URL}
          </a>
          .
        </p>
      </section>
    </div>
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
