import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

type DimensionValue = { value: number; unit: string } | string;

type SizeEntry = { $type?: string; $value?: DimensionValue };

type TokensShape = {
  tokens?: {
    sizes?: Record<string, SizeEntry>;
  };
};

function formatSizeValue(entry: SizeEntry): string | null {
  const v = entry?.$value;
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "value" in v && "unit" in v) {
    return `${(v as { value: number; unit: string }).value}${(v as { value: number; unit: string }).unit}`;
  }
  return null;
}

function getSizes(
  data: TokensShape,
): { key: string; cssVar: string; value: string | null }[] {
  const sizes = data.tokens!.sizes!;

  return Object.entries(sizes)
    .filter(([name]) => !name.startsWith("$"))
    .filter(([, entry]) => entry && typeof entry === "object")
    .filter(([key]) => !key.startsWith("elevation-")) // skip elevation sub-keys (blur, offset_x, etc.)
    .map(([key, entry]) => {
      const cssVar = `--recursica_tokens_sizes_${key}`;
      const value = formatSizeValue(entry);
      return { key, cssVar, value };
    });
}

const SAMPLE_TEXT =
  "The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.";

function SizesPalette() {
  const { tokensJson } = useRecursicaJson();
  const sizes = getSizes(tokensJson as Record<string, unknown>);
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {sizes.map(({ key, cssVar, value }) => (
        <section key={key}>
          <h2 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            {key}
            {value !== null ? ` — ${value}` : ""}
          </h2>
          <div
            style={{
              width: `var(${cssVar})`,
              height: 32,
              backgroundColor: "#333",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <p
            style={{
              fontSize: `var(${cssVar})`,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {SAMPLE_TEXT}
          </p>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Tokens/Sizes",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SizesPalette />,
};
