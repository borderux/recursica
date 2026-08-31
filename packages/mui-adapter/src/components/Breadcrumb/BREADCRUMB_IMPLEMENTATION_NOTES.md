# Breadcrumb Implementation Notes

## Missing Variants and Sizes

The `Breadcrumb` currently does not establish any size (`xs`, `sm`, etc.) or variant variables in the underlying design tokens (`recursica_ui-kit.json`). Only basic structural definitions for `padding` and `item-gap` exist. Because of this, the `size` and `variant` properties have been explicitly omitted from the passed MUI props.

## Gap Styling

MUI renders items/separators inside the `<ol>`, not directly under the `<nav>` root — `gap` lives on `.ol` in `.module.css` so it lands uniformly between item/separator/item, matching mantine-adapter.

## Composition and Separators

MUI natively accepts typical anchor tags as children, wrapping each in its own `<li>` internally — Breadcrumb.tsx doesn't add any structural spans of its own, allowing developers to utilize `Link` wrappers as needed contextually.
The separator character is inherited natively from MUI's default configuration (`/`) unless overridden by passing `separator={<Icon />}` to the component props.

## Current-page Crumb: Best-effort Enforcement, Not a Guarantee

**The last crumb should always be plain, non-interactive text — a `<span>`, not a `Link`.** It
represents the current page; per standard breadcrumb UX and the ARIA breadcrumb pattern, it
shouldn't be clickable. Passing a `Link` (or an anchor) for the last item is a misuse of the
component, even though `Breadcrumb.tsx` tries to correct for it — see below.

Breadcrumb intentionally keeps the flexible MUI `children`-as-anchors interface (unlike BEAM's
`Breadcrumb.Item`, which renders its own `Link` internally and can't accept a caller-supplied
router-aware Link or `onClick`). That flexibility means Breadcrumb.tsx can't fully own what the
last item renders as, so it does what it can via `markCurrentPageItem` (`@recursica/adapter-common`):

- Adds `aria-current="page"` to the last child, always.
- If that child looks interactive (has `href` or `onClick`), strips both and sets `tabIndex={-1}`.
- In dev, warns to the console when it had to strip anything — a signal the caller should switch
  that item to plain text instead of relying on this fallback.

Backed up by a CSS rule targeting `[aria-current="page"]` (Breadcrumb.module.css) that resets
color/text-decoration and sets `pointer-events: none`, and sets `font-family`/`font-size` to Link's own tokens
(per product decision: the current item should typographically match Link, just without Link's
color/decoration/interactivity).

**Why this isn't a real guarantee:** `cloneElement` can only override props an element actually
reads. A custom Link component (e.g. React Router's `<Link to="...">`) that navigates from its own
internal handler, independent of a passed-through `onClick`, will still navigate — stripping
`onClick`/`href` here doesn't touch that internal logic, and `pointer-events: none` only blocks
mouse activation, not keyboard/Enter on a focusable custom element. Treat all of the above as a
safety net for the common case (plain anchors, our own `Link`), not a substitute for callers doing
the right thing and passing plain text for the last crumb.

The story's `items` convenience prop demonstrates the correct pattern: every crumb except the last
is wrapped in `Link`, and the last is a plain `<span>`.

This logic is shared with mantine-adapter — `markCurrentPageItem` lives once in
`@recursica/adapter-common` (`components/Breadcrumb/markCurrentPageItem.ts`) and is unit-tested
there via mantine-adapter's test suite (`markCurrentPageItem.test.ts`), not duplicated here.
