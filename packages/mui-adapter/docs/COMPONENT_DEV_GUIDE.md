<critical_agent_directive>
STOP AND READ THIS FIRST.
If you are an AI agent building components:

1. You are forbidden from modifying native MUI source code or injecting system styles directly (no `style={{}}` for design tokens).
2. All style overrides must be done via `{ComponentName}.module.css` scoped to `.root`.
3. You must use native CSS variables derived from `recursica_variables_scoped.css`.
4. You must document integration and usage details in a `USAGE.md` file, and internal technical layout hooks in a `{COMPONENT}_IMPLEMENTATION_NOTES.md` file.
5. You are strictly FORBIDDEN from using CSS variable fallbacks (e.g. `var(--variable-name, fallback-value)`) in `module.css` files.
   </critical_agent_directive>

# Component Development Guide — MUI Adapter

This document covers what's specific to building components in `mui-adapter`. The full shared rulebook (styling rules, prop layer, folder structure, tokens, testing, checklist) lives in the canonical [`packages/adapter-common/docs/COMPONENT_DEV_GUIDE.md`](../../adapter-common/docs/COMPONENT_DEV_GUIDE.md) — read that first. This document only covers what's different for MUI.

For the core architectural philosophy, read [`docs/PHILOSOPHY.md`](./PHILOSOPHY.md) (which itself links to the canonical philosophy doc).

## Adapter note

Because this package (`@recursica/mui-adapter`) is explicitly built for MUI, we do not need a generic adapter abstraction. The component itself serves as both the public API and the MUI implementation.

## CSS specificity — no `!important` needed

Because we configure our CSS engine (`<StyledEngineProvider injectFirst>`, wired up via `RecursicaThemeProvider`) to inject MUI's own styles _before_ our CSS Modules, our `.root` class (`0,1,0` specificity) naturally beats MUI's baseline (e.g. `.MuiButton-root`) via DOM source order. Do **not** use `!important` flags or chained selectors (`.root.root`) to artificially bump specificity — if you find yourself needing one, something else is wrong (check `injectFirst` is actually in effect, or that you're targeting the right element).

## MUI-specific styling notes

- MUI leaks internal system props and complex objects if you're not careful about which props you forward — always route props through `filterStylingProps` (see the canonical guide's Recursica prop layer section) rather than forwarding `...rest` unfiltered.
- MUI's internal flex layouts can break generic CSS properties like `text-overflow: ellipsis` the same way other libraries' can — use internal wrapper `<span>`s as described in the canonical guide (see `Button.tsx`'s `styles.iconWrapper`/`styles.labelText` for a working example).

## Polymorphic Components (MUI-specific)

Unlike Mantine, **MUI components already support polymorphism natively** — there is no `createPolymorphicComponent`-style wrapper to apply. MUI's own component prop types (e.g. `ButtonProps`) already include an optional `component` prop via MUI's own `OverridableComponent` typing, and it passes straight through untouched as part of the normal prop-forwarding path (`...sanitizedProps`) — no special wrapping, no separate "internal `forwardRef` renamed with an underscore" step, and no third-generic-parameter trick for static sub-components.

```tsx
// Real pattern used by Button.tsx — no polymorphic wrapper needed
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, size, overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MuiButton ref={ref} {...sanitizedProps}>
        {/* ... */}
      </MuiButton>
    );
  },
);
```

Because `component` passes through via `...sanitizedProps`, it is **not** a styling concern and is **not blocked** by `filterStylingProps` — the same orthogonality Mantine's `RecursicaOverStyled` + `createPolymorphicComponent` split achieves, just without a second wrapping mechanism.

### Consumer usage examples

```tsx
// Renders as an <a> tag natively
<Button component="a" href="/dashboard" target="_blank">Navigate</Button>

// Renders using a custom router link
<Button component={Link} to="/home">Home</Button>
```

### Checklist for polymorphic components

- [ ] The underlying MUI component's own props (e.g. `MuiButtonProps`) are included in the Recursica component's public props type — do not `Omit` `component` unless you have a specific reason to.
- [ ] `component` is allowed to flow through `...sanitizedProps` untouched; it is never explicitly destructured, mapped, or blocked.
- [ ] JSDoc on the exported component documents polymorphic usage with `@example` (see `Button.tsx` for the pattern).
