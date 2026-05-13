const sectionStyle: React.CSSProperties = {
  marginBottom: 32,
};

const headingStyle: React.CSSProperties = {
  fontSize: 18,
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

const cardStyle: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const adapterBtnCss = `
  .adapter-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_background);
    color: var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_text);
    text-decoration: none;
    border-radius: var(--recursica_ui-kit_components_button_variants_sizes_default_properties_border-radius);
    height: var(--recursica_ui-kit_components_button_variants_sizes_default_properties_height);
    padding: 0 var(--recursica_ui-kit_components_button_variants_sizes_default_properties_horizontal-padding);
    font-family: var(--recursica_ui-kit_components_button_variants_sizes_default_properties_text_font-family);
    font-size: var(--recursica_ui-kit_components_button_variants_sizes_default_properties_text_font-size);
    font-weight: var(--recursica_ui-kit_components_button_variants_sizes_default_properties_text_font-weight);
    align-self: flex-start;
    box-shadow: var(--recursica_ui-kit_components_button_variants_styles_solid_properties_elevation);
    border: var(--recursica_ui-kit_components_button_variants_styles_solid_properties_border-size) solid var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_border-color);
    transition: opacity 0.2s ease;
  }
  .adapter-btn:hover {
    color: var(--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_text-hover);
    opacity: 0.85;
  }
`;

export function AdaptersContent() {
  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <style>{adapterBtnCss}</style>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Recursica Adapters
      </h1>
      <p style={{ ...bodyStyle, marginBottom: 24 }}>
        Recursica provides a strict design token enforcing layer, but we do not
        build native components from scratch. Instead, we use{" "}
        <strong>Adapters</strong> to map our unified design system onto
        industry-leading UI Kits. This allows you to leverage the power of
        established frameworks while maintaining strict brand consistency.
      </p>

      <section style={sectionStyle}>
        <div style={cardStyle}>
          <div>
            <h2 style={headingStyle}>Mantine Adapter (Default)</h2>
            <p style={bodyStyle}>
              Built on top of Mantine v7. This is our primary, most robust
              adapter recommended for most new React applications.
            </p>
          </div>
          <a
            href="/recursica/storybook/mantine-adapter/"
            target="_parent"
            className="adapter-btn"
          >
            Switch to Mantine Storybook
          </a>
        </div>

        <div style={cardStyle}>
          <div>
            <h2 style={headingStyle}>MUI Adapter</h2>
            <p style={bodyStyle}>
              Built on top of Material UI (MUI) v7. Use this adapter if your
              project is heavily tied to the MUI ecosystem but needs to conform
              to Recursica guidelines.
            </p>
          </div>
          <a
            href="/recursica/storybook/mui-adapter/"
            target="_parent"
            className="adapter-btn"
          >
            Switch to MUI Storybook
          </a>
        </div>
      </section>
    </div>
  );
}
