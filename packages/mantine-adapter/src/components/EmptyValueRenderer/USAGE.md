# EmptyValueRenderer - Usage Guide

This document describes how to integrate and use the `EmptyValueRenderer` component in your projects using `@recursica/mantine-adapter`.

> [!NOTE] > `EmptyValueRenderer` is defined once in `@recursica/adapter-common` and re-exported here so it shares the exact same behavior across every Recursica adapter.

---

## 1. Import Reference

```tsx
import { EmptyValueRenderer } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

`EmptyValueRenderer` renders a fallback (`"N/A"` by default) in place of an empty value, and exposes a static `EmptyValueRenderer.check(value)` helper that flags `null`, `undefined`, `""`, and `[]` as empty:

```tsx
import { EmptyValueRenderer, ReadOnlyField } from "@recursica/mantine-adapter";

function Example({ value }: { value?: string }) {
  return EmptyValueRenderer.check(value) ? (
    <EmptyValueRenderer emptyText="No value set" />
  ) : (
    <ReadOnlyField value={value} />
  );
}
```

---

## 3. Design System Integration

`EmptyValueRenderer` has no visual variants and does not accept `overStyled` — it is a plain text fallback, not a styled component. Use it wherever a read-only or empty-state surface needs a consistent "no value" treatment instead of ad hoc strings.
