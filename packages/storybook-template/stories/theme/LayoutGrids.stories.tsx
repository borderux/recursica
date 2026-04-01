import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaJson } from "@recursica/storybook-template";

/*
  Layout grids from recursica_brand.json are breakpoints:
  - Desktop: largest; applies at viewport ≥ 1280px → 6 columns, max-width 1280px, gutter
  - Tablet: at viewport < 1280 and ≥ 810px → 6 columns, max-width 810px, gutter
  - Mobile: at viewport < 810px → 4 columns, max-width 480px, gutter

  Grid CSS variables exist in recursica_variables_scoped.css as --recursica_brand_layout-grids_*
  (desktop/tablet/mobile: columns, gutter, max-width). That file has no @media queries; it only
  defines the variables. This story implements the intended breakpoints (1280 / 810 / 480) with
  @media rules so the grid responds to viewport. Resize the Storybook frame to see the change.
*/

const REF_PATTERN = /^\{([^}]+)\}$/;

function getByPath(obj: unknown, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function resolveRef(
  ref: string,
  data: Record<string, unknown>,
  depth = 0,
): unknown {
  if (depth > 5) return ref;
  const match = ref.trim().match(REF_PATTERN);
  if (!match) return ref;
  const path = match[1];
  let resolved = getByPath(data, path);
  if (resolved == null) {
    const altPath = path.replace(/\.size\./, ".sizes.");
    resolved = getByPath(data, altPath);
  }
  if (
    resolved != null &&
    typeof resolved === "object" &&
    "$value" in resolved
  ) {
    const val = (resolved as { $value: unknown }).$value;
    if (typeof val === "string" && REF_PATTERN.test(val)) {
      return resolveRef(val, data, depth + 1);
    }
  }
  return resolved;
}

function dimensionToPx(entry: unknown): number | null {
  if (entry == null || typeof entry !== "object") return null;
  const node = entry as Record<string, unknown>;
  const value = node.$value;
  if (
    value != null &&
    typeof value === "object" &&
    "value" in value &&
    "unit" in value
  ) {
    const v = value as { value: number; unit: string };
    if (v.unit === "px") return v.value;
  }
  if (typeof value === "number") return value;
  return null;
}

type LayoutGridEntry = {
  "max-width"?: { $type?: string; $value?: number };
  columns?: { $type?: string; $value?: number };
  gutter?: { $type?: string; $value?: string };
};

type BrandShape = {
  brand?: {
    "layout-grids"?: Record<string, LayoutGridEntry>;
  };
};

function getLayoutGrids(
  brandData: BrandShape,
  mergedData: Record<string, unknown>,
): {
  name: string;
  maxWidthPx: number;
  columns: number;
  gutterPx: number;
}[] {
  const grids = brandData.brand!["layout-grids"]!;

  return Object.entries(grids)
    .filter(([name]) => !name.startsWith("$"))
    .filter(([, entry]) => entry && typeof entry === "object")
    .map(([name, entry]) => {
      const maxWidthEntry = entry["max-width"];
      const maxWidthPx =
        maxWidthEntry?.$value != null &&
        typeof maxWidthEntry.$value === "number"
          ? maxWidthEntry.$value
          : 800;

      const columnsEntry = entry.columns;
      const columns =
        columnsEntry?.$value != null && typeof columnsEntry.$value === "number"
          ? columnsEntry.$value
          : 6;

      let gutterPx = 16;
      const gutterEntry = entry.gutter;
      const gutterRef = gutterEntry?.$value;
      if (typeof gutterRef === "string" && REF_PATTERN.test(gutterRef)) {
        const resolved = resolveRef(gutterRef, mergedData);
        const dim = dimensionToPx(resolved);
        if (dim != null) gutterPx = dim;
      }

      return { name, maxWidthPx, columns, gutterPx };
    });
}

function getResponsiveGridCss(
  layoutGrids: ReturnType<typeof getLayoutGrids>,
): string {
  const DESKTOP = layoutGrids.find((g) => g.name === "desktop");
  const TABLET = layoutGrids.find((g) => g.name === "tablet");
  const MOBILE = layoutGrids.find((g) => g.name === "mobile");

  const BREAKPOINT_DESKTOP_PX = DESKTOP?.maxWidthPx ?? 1280;
  const BREAKPOINT_TABLET_PX = TABLET?.maxWidthPx ?? 810;
  const BREAKPOINT_MOBILE_PX = MOBILE?.maxWidthPx ?? 480;

  const desktopCols = DESKTOP?.columns ?? 6;
  const desktopGutter = DESKTOP?.gutterPx ?? 16;
  const tabletCols = TABLET?.columns ?? 6;
  const tabletGutter = TABLET?.gutterPx ?? 16;
  const mobileCols = MOBILE?.columns ?? 4;
  const mobileGutter = MOBILE?.gutterPx ?? 16;

  return `
    .layout-grids-responsive-demo {
      display: grid;
      grid-template-columns: repeat(var(--layout-cols), 1fr);
      gap: var(--layout-gutter);
      max-width: var(--layout-max-width);
      margin: 0 auto;
    }
    /* Mobile: default (< 810px) */
    .layout-grids-responsive-demo {
      --layout-cols: ${mobileCols};
      --layout-gutter: ${mobileGutter}px;
      --layout-max-width: ${BREAKPOINT_MOBILE_PX}px;
    }
    /* Tablet: 810px to < 1280px */
    @media (min-width: ${BREAKPOINT_TABLET_PX}px) and (max-width: ${BREAKPOINT_DESKTOP_PX - 1}px) {
      .layout-grids-responsive-demo {
        --layout-cols: ${tabletCols};
        --layout-gutter: ${tabletGutter}px;
        --layout-max-width: ${BREAKPOINT_TABLET_PX}px;
      }
    }
    /* Desktop: 1280px and above */
    @media (min-width: ${BREAKPOINT_DESKTOP_PX}px) {
      .layout-grids-responsive-demo {
        --layout-cols: ${desktopCols};
        --layout-gutter: ${desktopGutter}px;
        --layout-max-width: ${BREAKPOINT_DESKTOP_PX}px;
      }
    }
  `;
}

function LayoutGridsStory() {
  const { brandJson, tokensJson } = useRecursicaJson();
  const mergedData = {
    ...tokensJson,
    brand: (brandJson as Record<string, unknown>)?.brand,
  };
  const layoutGrids = getLayoutGrids(brandJson as BrandShape, mergedData);

  const DESKTOP = layoutGrids.find((g) => g.name === "desktop");
  const TABLET = layoutGrids.find((g) => g.name === "tablet");
  const MOBILE = layoutGrids.find((g) => g.name === "mobile");

  const BREAKPOINT_DESKTOP_PX = DESKTOP?.maxWidthPx ?? 1280;
  const BREAKPOINT_TABLET_PX = TABLET?.maxWidthPx ?? 810;

  const desktopCols = DESKTOP?.columns ?? 6;
  const tabletCols = TABLET?.columns ?? 6;
  const mobileCols = MOBILE?.columns ?? 4;
  const maxCells = Math.max(desktopCols * 2, tabletCols * 2, mobileCols * 2);

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
      <style
        dangerouslySetInnerHTML={{ __html: getResponsiveGridCss(layoutGrids) }}
      />
      <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
        One responsive grid: desktop ≥{BREAKPOINT_DESKTOP_PX}px ({desktopCols}{" "}
        cols), tablet {BREAKPOINT_TABLET_PX}–{BREAKPOINT_DESKTOP_PX - 1}px (
        {tabletCols} cols), mobile &lt;
        {BREAKPOINT_TABLET_PX}px ({mobileCols} cols). Resize the viewport to see
        the grid change.
      </p>
      <div className="layout-grids-responsive-demo">
        {Array.from({ length: maxCells }, (_, i) => (
          <div
            key={i}
            style={{
              minHeight: 48,
              backgroundColor: "rgba(0,0,0,0.08)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#666",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Theme/Layout Grids",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <LayoutGridsStory />,
};
