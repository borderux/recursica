import type { Meta, StoryObj } from "@storybook/react-vite";

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
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Recursica Design System
      </h1>
      <p style={{ ...bodyStyle, marginBottom: 24 }}>
        This Storybook showcases the Recursica design system: design tokens,
        theme (brand) configuration, and UI components. Use the sidebar to
        explore each section.
      </p>

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
        <h2 style={headingStyle}>UI Kit</h2>
        <p style={bodyStyle}>
          Reusable components (buttons, layers, etc.) that consume the theme and
          tokens. Use these as the building blocks for application UIs while
          staying on-brand.
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
  title: "Introduction/Default",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <IntroductionContent />,
};
