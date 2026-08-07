<critical_agent_directive>
STOP AND READ THIS FIRST.
If you are an AI agent building components:

1. You are forbidden from modifying native Mantine source code or injecting system styles directly (no `style={{}}` for design tokens).
2. All style overrides must be done via `{ComponentName}.module.css` scoped to `.root`.
3. You must use native CSS variables derived from `recursica_variables_scoped.css`.
4. You must document integration and usage details in a `USAGE.md` file, and internal technical layout hooks in a `{COMPONENT}_IMPLEMENTATION_NOTES.md` file.
5. You are strictly FORBIDDEN from using CSS variable fallbacks (e.g. `var(--variable-name, fallback-value)`) in `module.css` files.
   </critical_agent_directive>

# Component Development Guide — Mantine Adapter

This document covers what's specific to building components in `mantine-adapter`. The full shared rulebook (styling rules, prop layer, folder structure, tokens, testing, checklist) lives in the canonical [`packages/adapter-common/docs/COMPONENT_DEV_GUIDE.md`](../../adapter-common/docs/COMPONENT_DEV_GUIDE.md) — read that first. This document only covers what's different for Mantine.

For the core architectural philosophy, read [`docs/PHILOSOPHY.md`](./PHILOSOPHY.md) (which itself links to the canonical philosophy doc).

## Adapter note

Because this package (`@recursica/mantine-adapter`) is explicitly built for Mantine, we do not need a generic adapter abstraction. The component itself serves as both the public API and the Mantine implementation.

## Mantine-specific styling notes

- Many Mantine components apply their own `:hover` styles — disable/override them in your CSS module (see the canonical guide's Hover states section).
- Mantine's internal flex layouts will often break generic CSS properties like `text-overflow: ellipsis`, or allow injected SVGs to ignore UI Kit max bounds — use internal wrapper `<span>`s as described in the canonical guide.
- Mantine components apply generic internal padding/gaps that can break specific layout constraints (e.g. icon-only buttons hitting perfect 48x48 min-widths) — compute layout exceptions and use `data-*` attribute hooks as described in the canonical guide.

## Polymorphic Components (Mantine-specific)

Mantine v8 exposes many components as **polymorphic** — they accept a `component` prop (or `renderRoot`) that changes the rendered DOM element while preserving the component's visual behavior and accessibility. Our Recursica wrappers must preserve this capability so consumers can render buttons as anchors, text as spans, cards as links, etc.

### Which components are polymorphic

The following Mantine components use `PolymorphicFactory` and our wrappers must expose polymorphism:

| Recursica Wrapper | Mantine Base   | Default Element |
| ----------------- | -------------- | --------------- |
| `Button`          | `Button`       | `"button"`      |
| `Text`            | `Text`         | `"p"`           |
| `Badge`           | `Badge`        | `"div"`         |
| `Card`            | `Card` (Paper) | `"div"`         |
| `Flex`            | `Flex`         | `"div"`         |
| `Avatar`          | `Avatar`       | `"div"`         |
| `Menu.Item`       | `Menu.Item`    | `"button"`      |

### The pattern: `createPolymorphicComponent`

Use Mantine's `createPolymorphicComponent` (exported from `@mantine/core`) to wrap the internal `forwardRef` component. This is the **same mechanism Mantine uses internally**:

```tsx
import { forwardRef } from "react";
import {
  SomeComponent as MantineSomeComponent,
  type SomeComponentProps as MantineSomeComponentProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";

// 1. Define Recursica props as usual
export interface RecursicaSomeComponentProps {
  variant?: "primary" | "secondary";
}

// 2. Build the merged props type with RecursicaOverStyled as usual
export type SomeComponentProps = RecursicaOverStyled<
  Omit<MantineSomeComponentProps, "variant"> & RecursicaSomeComponentProps
>;

// 3. Internal forwardRef — prefix with underscore, NOT exported
const _SomeComponent = forwardRef<HTMLDivElement, SomeComponentProps>(
  function SomeComponent(
    { variant = "primary", overStyled = false, ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    // ... map props, render MantineSomeComponent
  },
);
_SomeComponent.displayName = "SomeComponent";

// 4. Export via createPolymorphicComponent with the correct default element
export const SomeComponent = createPolymorphicComponent<
  "div",
  SomeComponentProps
>(_SomeComponent);
```

### How polymorphism and `RecursicaOverStyled` compose

These two concerns are **orthogonal**:

- **`RecursicaOverStyled<T>`** controls which styling props are available (blocks `className`, `style`, Mantine system props unless `overStyled={true}`).
- **`createPolymorphicComponent`** adds the `component` and `renderRoot` props on top, and adjusts HTML attributes based on the element type.

The `component` prop passes through to the underlying Mantine component natively — it is not a styling concern and is **not blocked** by `filterStylingProps`.

### Static components (dot-notation)

For components with static sub-components (e.g., `Card.Section`, `Menu.Item`), pass the static components as the third generic parameter:

```tsx
const PolymorphicCard = createPolymorphicComponent<
  "div",
  CardProps,
  {
    Section: typeof CardSection;
    Header: typeof CardHeader;
  }
>(CardBase);

// Attach statics
(PolymorphicCard as any).Section = CardSection;
(PolymorphicCard as any).Header = CardHeader;

export const Card = PolymorphicCard as typeof PolymorphicCard & {
  Section: typeof CardSection;
  Header: typeof CardHeader;
};
```

### Consumer usage examples

```tsx
// Button as a link
<Button component="a" href="/dashboard">Navigate</Button>

// Button with a router Link
<Button renderRoot={(props) => <Link to="/home" {...props} />}>Home</Button>

// Text as a span
<Text component="span">Inline text</Text>

// Card as a clickable link
<Card component="a" href="/details">...</Card>

// Menu item as a link
<Menu.Item component="a" href="/settings">Settings</Menu.Item>
```

### Checklist for polymorphic components

- [ ] Uses `createPolymorphicComponent` with the correct default element type
- [ ] Internal `forwardRef` is prefixed with `_` and NOT exported directly
- [ ] `RecursicaOverStyled` wrapping is applied to the props type (not to the polymorphic wrapper)
- [ ] JSDoc on the exported component documents polymorphic usage with `@example`
- [ ] Static sub-components (if any) are preserved via the third generic parameter
- [ ] `displayName` is set on the internal `forwardRef` component
