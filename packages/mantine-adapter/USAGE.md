# UI Kit Usage Guide

This guide outlines how human developers and AI agents should consume the `mantine-adapter` library when building applications (e.g., the `figma-plugin`).

## 1. Importing Components

All UI components should be imported directly from the `mantine-adapter`.

```tsx
import { Button, Stack, Container } from "@recursica/mantine-adapter";
```

**Rule:** Do NOT import components directly from `@mantine/core` unless a specific exception has been documented (e.g. `Alert`, which has no planned Recursica equivalent). If you need a standard component, always check the adapter first.

## 2. Passing Design Tokens & Layout Constraints

Our components strictly separate logical structural layouts from visual design tokens.

- **DO NOT** try to inject arbitrary styling objects, generic padding/margin properties (`p`, `bg`, `fw`), or custom `classNames` directly into component JSX. The components use `filterStylingProps` to actively strip these out.
- **DO** use the defined logical layout properties (like `gap`, `margin`, `mt`, etc.).
- When passing sizes to layout wrappers (like `Stack`, `Flex`, `Group`, `Container`), use the `rec-` prefixed sizes explicitly mapped in the library (e.g., `"rec-sm"`, `"rec-default"`, `"rec-md"`, `"rec-lg"`, `"rec-xl"`).

## 3. The `overStyled` Escape Hatch

If you encounter an absolute necessity to break out of the design system (e.g., a highly custom one-off hero section where a button needs an arbitrary height and custom background), you must pass `overStyled={true}`.

```tsx
<Button overStyled={true} bg="red" h={120}>
  Custom Button
</Button>
```

**Warning:** Using `overStyled` should be treated as technical debt. If you find yourself repeatedly needing it for a specific variant, you should instead switch context and **contribute** that variant natively into the `mantine-adapter`.

## 4. Fallback Behavior for Missing Components

If the adapter does not yet implement a required component:

1. You may try utilizing standard `recursica_variables_scoped.css` properties on the native Mantine component.
2. However, **this is not recommended**. The preferred approach is to pause integration, navigate into the `mantine-adapter` package, and natively build the missing wrapper component following the `CONTRIBUTING.md` guidelines.
