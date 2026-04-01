import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

type LetterSpacingEntry = { $type?: string; $value?: number | null };

type TokensShape = {
  tokens?: {
    font?: {
      "letter-spacings"?: Record<string, LetterSpacingEntry>;
    };
  };
};

function getLetterSpacings(
  data: TokensShape,
): { key: string; cssVar: string; value: number | null }[] {
  const letterSpacings = data.tokens!.font!["letter-spacings"]!;

  return Object.entries(letterSpacings)
    .filter(([name]) => !name.startsWith("$"))
    .filter(([, entry]) => entry && typeof entry === "object")
    .map(([key, entry]) => {
      const cssVar = `--recursica_tokens_font_letter-spacings_${key}`;
      const value = entry?.$value ?? null;
      return { key, cssVar, value };
    });
}

const SAMPLE_TEXT =
  "The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.";

function FontLetterSpacingsPalette() {
  const { tokensJson } = useRecursicaJson();
  const letterSpacings = getLetterSpacings(
    tokensJson as Record<string, unknown>,
  );
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
      {letterSpacings.map(({ key, cssVar, value }) => (
        <section key={key}>
          <h2 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            {key}
            {value !== null ? ` — ${value}em` : ""}
          </h2>
          <p
            style={{
              letterSpacing: `var(${cssVar})`,
              fontSize: 18,
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
  title: "Tokens/Font/Letter Spacings",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FontLetterSpacingsPalette />,
};
