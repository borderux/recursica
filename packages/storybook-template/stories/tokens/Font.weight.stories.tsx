import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

type FontWeights = Record<string, { $type: string; $value: number }>;

type TypefaceVariant = { weight?: string; style?: string };

type TypefaceEntry = {
  $value?: string | string[];
  $extensions?: {
    "com.google.fonts"?: { url?: string; variants?: TypefaceVariant[] };
    variants?: TypefaceVariant[];
  };
};

type TokensShape = {
  tokens?: {
    font?: {
      typefaces?: Record<string, TypefaceEntry>;
      weights?: FontWeights;
    };
  };
};

function weightKeyToCssVar(key: string): string {
  return `--recursica_tokens_font_weights_${key}`;
}

function parseWeightRef(ref: string): string | null {
  const match = ref.match(/tokens\.font\.weights\.([^}.]+)/);
  return match ? match[1].trim() : null;
}

function getWeightsSortedByValue(
  data: TokensShape,
): { key: string; weightVar: string }[] {
  const weights = data.tokens!.font!.weights!;

  const entries = Object.entries(weights)
    .filter(([name]) => !name.startsWith("$"))
    .filter(
      ([, entry]) =>
        entry?.$type === "number" && typeof entry.$value === "number",
    )
    .map(([key, entry]) => ({
      key,
      value: (entry as { $value: number }).$value,
    }))
    .sort((a, b) => a.value - b.value);

  return entries.map(({ key }) => ({ key, weightVar: weightKeyToCssVar(key) }));
}

function getWeightKeysForTypeface(
  typefaceKey: string,
  data: TokensShape,
): string[] {
  const typefaces = data.tokens?.font?.typefaces;
  const entry = typefaces?.[typefaceKey] as TypefaceEntry | undefined;
  const weightsData = data.tokens?.font?.weights;
  if (!weightsData) return [];

  const variants =
    entry?.$extensions?.["com.google.fonts"]?.variants ??
    entry?.$extensions?.variants;
  if (Array.isArray(variants) && variants.length > 0) {
    const keys = new Set<string>();
    for (const v of variants) {
      const key = parseWeightRef(v?.weight ?? "");
      if (key && Object.prototype.hasOwnProperty.call(weightsData, key))
        keys.add(key);
    }
    const order = getWeightsSortedByValue(data).map((w) => w.key);
    return order.filter((k) => keys.has(k));
  }

  return getWeightsSortedByValue(data).map((w) => w.key);
}

function getTypefaceDisplayName(entry: TypefaceEntry): string {
  const v = entry?.$value;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0];
  return "";
}

function getFontFamilyValue(entry: TypefaceEntry): string {
  const v = entry?.$value;
  if (typeof v === "string") return v.includes(" ") ? `"${v}"` : v;
  if (Array.isArray(v) && v.length > 0) {
    return v
      .map((name) =>
        typeof name === "string" && name.includes(" ") ? `"${name}"` : name,
      )
      .join(", ");
  }
  return "";
}

function getTypefaces(data: TokensShape) {
  const typefaces = data.tokens!.font!.typefaces!;

  const allWeights = getWeightsSortedByValue(data);

  return Object.entries(typefaces)
    .filter(([name]) => !name.startsWith("$"))
    .filter(([, face]) => face && typeof face === "object")
    .map(([key, entry]) => {
      const cssVar = `--recursica_tokens_font_typefaces_${key}`;
      const displayName = getTypefaceDisplayName(entry);
      const fontFamilyValue = getFontFamilyValue(entry);
      const weightKeys = getWeightKeysForTypeface(key, data);
      const weights = weightKeys
        .map((wk) => {
          const w = allWeights.find((a) => a.key === wk);
          return w ? { key: wk, weightVar: w.weightVar } : null;
        })
        .filter((w): w is { key: string; weightVar: string } => w !== null);
      return { key, displayName, cssVar, fontFamilyValue, weights };
    });
}

const SAMPLE_TEXT =
  "The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.";

function FontPalette() {
  const { tokensJson } = useRecursicaJson();
  const typefaces = getTypefaces(tokensJson as Record<string, unknown>);
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
      {typefaces.map(({ key, displayName, fontFamilyValue, weights }) => (
        <section key={key}>
          <h2 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
            {key}
            {displayName ? ` — ${displayName}` : ""}
          </h2>
          {weights.map(({ key: weightKey, weightVar }) => (
            <div key={weightKey} style={{ marginBottom: 12 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "#666",
                  marginBottom: 2,
                  textTransform: "capitalize",
                }}
              >
                {weightKey.replace(/-/g, " ")}
              </span>
              <p
                style={{
                  fontFamily: fontFamilyValue || undefined,
                  fontWeight: `var(${weightVar})`,
                  fontSize: 18,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {SAMPLE_TEXT}
              </p>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Tokens/Font/Weights",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FontPalette />,
};
