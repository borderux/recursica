# RecursicaThemeProvider - Usage Guide

This document describes how to integrate and use `RecursicaThemeProvider` in your projects using `@recursica/mui-adapter`.

> [!NOTE] > `RecursicaThemeProvider` is defined once in `@recursica/adapter-common` and re-exported here so it shares the exact same behavior across every Recursica adapter.

---

## 1. Import Reference

```tsx
import { RecursicaThemeProvider } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import { StyledEngineProvider } from "@mui/material/styles";
import { RecursicaThemeProvider } from "@recursica/mui-adapter";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <RecursicaThemeProvider theme="light">
        {/* Your App Components */}
      </RecursicaThemeProvider>
    </StyledEngineProvider>
  );
}
```

By default, `RecursicaThemeProvider` also wraps `children` in a base [`Layer`](../Layer/USAGE.md) (`layer={0}`), so surface/border/elevation variables resolve immediately — no separate `Layer` needed for the page background.

If you want to place the base layer yourself (e.g. to use `contentsOnly`, or to control exactly where layer 0 starts in the tree), opt out with `initLayer0={false}`:

```tsx
import { RecursicaThemeProvider, Layer } from "@recursica/mui-adapter";

<RecursicaThemeProvider theme="light" initLayer0={false}>
  <Layer layer={0}>{/* Your App Components */}</Layer>
</RecursicaThemeProvider>;
```

---

## 3. Design System Integration

> [!IMPORTANT]
>
> - **Required for setup**: `RecursicaThemeProvider` must wrap your entire application, once, near the root, inside `<StyledEngineProvider injectFirst>`. See [SETUP.md](../../../SETUP.md) for the full setup sequence.
> - **`initLayer0` (default `true`)**: Automatically wraps `children` in a layer-0 [`Layer`](../Layer/USAGE.md). `RecursicaThemeProvider` itself only sets `data-recursica-theme` (`"light"` or `"dark"`, defaults to `"light"`) on `document.documentElement` — without a `Layer` in the tree (either the automatic one or one you add yourself with `initLayer0={false}`), none of Recursica's surface CSS variables resolve.
> - **Runtime theme switching**: Changing the `theme` prop re-runs the effect and updates `data-recursica-theme` immediately, so you can drive light/dark switching from application state.
