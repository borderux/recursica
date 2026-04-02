import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

const STEP_ORDER = [
  "000",
  "050",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "1000",
] as const;

type ColorToken = { $type: string; $value: string };

function isColorToken(value: unknown): value is ColorToken {
  return (
    typeof value === "object" &&
    value !== null &&
    "$type" in value &&
    (value as ColorToken).$type === "color" &&
    "$value" in value &&
    typeof (value as ColorToken).$value === "string"
  );
}

function getColorScales(tokensData: {
  tokens?: { colors?: Record<string, Record<string, unknown>> };
}) {
  const colors = tokensData.tokens?.colors || {};

  return Object.entries(colors).map(
    ([scaleId, scaleEntries]: [string, unknown]) => {
      const entryObj = scaleEntries as Record<string, unknown>;
      const alias =
        typeof entryObj.alias === "string" ? entryObj.alias : scaleId;
      const steps = STEP_ORDER.filter((step) => {
        const entry = entryObj[step];
        return entry !== undefined && isColorToken(entry);
      }).map((step) => {
        const entry = entryObj[step] as ColorToken;
        const cssVar = `--recursica_tokens_colors_${scaleId}_${step}`;
        return { step, hex: entry.$value, cssVar };
      });
      return { scaleId, alias, steps };
    },
  );
}

const SWATCH_WIDTH = 60;

function ColorPalette() {
  const { tokensJson } = useRecursicaJson();
  const colorScales = getColorScales(tokensJson);
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {colorScales.map(({ scaleId, alias, steps }) => (
        <section
          key={scaleId}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h2
            style={{
              marginBottom: 4,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {scaleId} ({alias})
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {steps.map(({ step, cssVar }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: SWATCH_WIDTH,
                    height: 20,
                    flexShrink: 0,
                    backgroundColor: `var(${cssVar})`,
                  }}
                />
                <span style={{ fontSize: 10, color: "#666" }}>{step}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Tokens/Color",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ColorPalette />,
};
