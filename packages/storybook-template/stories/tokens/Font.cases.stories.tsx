import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

type CaseEntry = { $type?: string; $value?: string | null };

type TokensShape = {
  tokens?: {
    font?: {
      cases?: Record<string, CaseEntry>;
    };
  };
};

function getCases(
  data: TokensShape,
): { key: string; cssVar: string; value: string | null }[] {
  const cases = data.tokens!.font!.cases!;

  return Object.entries(cases)
    .filter(([name]) => !name.startsWith("$"))
    .filter(([, entry]) => entry && typeof entry === "object")
    .map(([key, entry]) => {
      const cssVar = `--recursica_tokens_font_cases_${key}`;
      const value = entry?.$value ?? null;
      return { key, cssVar, value };
    });
}

const SAMPLE_TEXT =
  "The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.";

function FontCasesPalette() {
  const { tokensJson } = useRecursicaJson();
  const cases = getCases(tokensJson as Record<string, unknown>);
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
      {cases.map(({ key, cssVar, value }) => (
        <section key={key}>
          <h2 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            {key}
            {value !== null ? ` — ${value}` : " (none)"}
          </h2>
          <p
            style={{
              textTransform:
                `var(${cssVar})` as React.CSSProperties["textTransform"],
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
  title: "Tokens/Font/Cases",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FontCasesPalette />,
};
