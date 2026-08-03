# Layer - Usage Guide

This document describes how to integrate and use the `Layer` component in your projects using `@recursica/mui-adapter`.

> [!NOTE] > `Layer` is defined once in `@recursica/adapter-common` and re-exported here so it shares the exact same behavior across every Recursica adapter.

---

## 1. Import Reference

```tsx
import { Layer } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

`Layer` sets `data-recursica-layer` on its root element, which is what makes the theme+layer scoped CSS variables (surface color, border, elevation, padding) in `recursica_variables_scoped.css` actually apply. [`RecursicaThemeProvider`](../RecursicaThemeProvider/USAGE.md) automatically wraps your app in a `layer={0}` `Layer` by default (via its `initLayer0` prop), so you don't need to add one yourself for the base page. You still add `Layer`s manually for anything visually elevated above the page background:

```tsx
import { RecursicaThemeProvider, Layer, Card } from "@recursica/mui-adapter";

function App() {
  return (
    <RecursicaThemeProvider theme="light">
      {/* Page background/surface already uses layer 0, applied automatically */}
      <Layer layer={1}>
        <Card>Elevated content sits on layer 1</Card>
      </Layer>
    </RecursicaThemeProvider>
  );
}
```

---

## 3. Design System Integration

> [!IMPORTANT]
>
> - **Layer 0 is automatic**: `RecursicaThemeProvider` applies it for you by default. Only opt out (`initLayer0={false}`) if you need to control exactly where layer 0 starts in the tree, or need `contentsOnly` on the base layer — see [RecursicaThemeProvider usage](../RecursicaThemeProvider/USAGE.md).
> - **Layers 1–3 are manual**: Wrap any content that's visually elevated above the page background (a Card, Modal, Popover, etc.) in its own `<Layer layer={1|2|3}>`. Nesting `Layer`s is how Recursica communicates elevation to descendant components — do **not** pass a `layer` prop directly to other components; wrap them in a `Layer` instead (every other component's `USAGE.md` repeats this rule).
> - **`contentsOnly`**: When `true`, `Layer` renders with `display: contents` and omits `data-recursica-layer` entirely — use this when you need a layer boundary in your component tree without adding an extra DOM box or applying layer styling (e.g. a purely structural wrapper).

---

## 4. Key Integration Features & Constraints

`Layer` has no visual variants of its own — its entire purpose is to bind a subtree to a numbered layer's design tokens. It does not accept `overStyled`; instead, if you find yourself needing to override a layer's surface styling, that's a signal you may want a different layer number rather than an escape hatch.
