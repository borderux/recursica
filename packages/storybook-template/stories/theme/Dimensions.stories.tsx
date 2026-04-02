import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

type DimensionEntry = { $type?: string; $value?: unknown };

type BrandDimensions = Record<string, Record<string, DimensionEntry>>;

type BrandShape = {
  brand?: {
    dimensions?: BrandDimensions;
  };
};

function getDimensionSections(
  brandData: BrandShape,
): { section: string; items: { key: string; cssVar: string }[] }[] {
  const dimensions = brandData.brand!.dimensions!;

  return Object.entries(dimensions)
    .filter(([name]) => !name.startsWith("$"))
    .filter(([, section]) => section && typeof section === "object")
    .map(([sectionKey, sectionEntries]) => {
      const items = Object.entries(sectionEntries)
        .filter(([name]) => !name.startsWith("$"))
        .filter(([, entry]) => entry && typeof entry === "object")
        .map(([key]) => ({
          key,
          cssVar: `--recursica_brand_dimensions_${sectionKey}_${key}`,
        }));
      return { section: sectionKey, items };
    })
    .filter((s) => s.items.length > 0);
}

function SampleIcon({ sizeVar }: { sizeVar: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{
        width: `var(${sizeVar})`,
        height: `var(${sizeVar})`,
        flexShrink: 0,
      }}
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ThemeDimensionsPalette() {
  const { brandJson } = useRecursicaJson();
  const sections = getDimensionSections(brandJson as BrandShape);
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {sections.map(({ section, items }) => (
        <section key={section}>
          <h2
            style={{
              marginBottom: 16,
              fontSize: 12,
              fontWeight: 600,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {section}
            <span
              style={{
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              {" — "}
              <code style={{ fontSize: 11 }}>
                --recursica_brand_dimensions_{section}_*
              </code>
            </span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map(({ key, cssVar }) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <span
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 500,
                    minWidth: 80,
                  }}
                >
                  {key}
                </span>
                {section === "icons" ? (
                  <SampleIcon sizeVar={cssVar} />
                ) : section === "text-size" ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: `var(${cssVar})`,
                      lineHeight: 1.4,
                      flex: 1,
                    }}
                  >
                    The quick onyx goblin jumps over the lazy dwarf.
                  </p>
                ) : (
                  <div
                    style={{
                      width: section === "border-radii" ? 64 : `var(${cssVar})`,
                      height: section === "border-radii" ? 64 : 24,
                      backgroundColor:
                        section === "border-radii" ? "transparent" : "#333",
                      border:
                        section === "border-radii"
                          ? "2px solid #333"
                          : undefined,
                      borderRadius:
                        section === "border-radii" ? `var(${cssVar})` : 4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Theme/Dimensions",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ThemeDimensionsPalette />,
};
