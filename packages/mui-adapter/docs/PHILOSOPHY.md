# Recursica MUI Adapter: Core Philosophy

Recursica’s component architecture isn't just a wrapper; it's a strict enforcing layer over MUI’s massive API surface. Our primary goal is to ensure consistency, eliminate “design system rot,” and provide clear boundaries for application developers using the UI Kit.

This document serves as the governing framework for why the `mui-adapter` components are built the way they are.

## 1. Strict Separation of Props (The Unified Recursica Prop Layer)

Recursica has a **single universal API surface** internally regardless of whether we use MUI or another underlying UI library.

- We decouple our visual properties natively. Instead of mapping perfectly to MUI’s native variants `(contained, outlined, text)`, we intentionally use Recursica's semantic and behavioral structures (e.g., `<Badge variant="alert" />`).
- We intentionally omit and strip complex underlying parameters if they collide with or circumvent our UI tokens (like stripping `--size` or raw MUI size properties when Recursica enforces a universal scale).

## 2. Component Wrappers (Leaving MUI Alone)

We actively avoid mutating or patching MUI source code or deeply hooking into the MUI `createTheme` Theme object to apply our token system.

- We rely on standard DOM `module.css` bridging with strictly targeted `className`/`classes` overrides whenever possible, instead of heavy Emotion/CSS-in-JS logic.
- This creates total decoupled isolation: updating MUI natively will not fracture our styles, and we avoid dealing with deep CSS-in-JS theme clashing logic.

## 3. The `overStyled` Property

MUI encourages deep styling access by injecting the `sx` prop, system props like `bgcolor`, `color`, `typography`, or nested `classes` directly into component tags.

- By default, **Recursica components block all arbitrary styling vectors**. `sx` maps, `classes` overrides, system styles, and inline logic are proactively stripped before they hit MUI using central utility functions.
- **Why?** To prevent the design system from deteriorating over time as developers write one-off hotfixes into their TSX rendering blocks.
- **The Caveat:** We allow _external DOM layout positioning props_ (e.g., margin `m`, `mt`, `p`, `px`, etc.) to pass through and natively intercept Recursica Spacing Tokens (`rec-sm`, `rec-default`) so developers can structure components organically within their parent layouts.

### Escape Hatches

If a developer _strictly must_ heavily alter a component, they are required to explicitly declare `<Component overStyled={true} />`. This immediately raises a visible red flag during code reviews.

## 4. Expectations for External Developers (Modifying Recursica)

If a developer finds that a component does not fit their needs and styling must be modified, their path of execution should follow these principles sequentially:

1. **Leverage Native MUI First:** If a Recursica component lacks the functionality or styling variant needed for a highly custom edge case (e.g., a massive marketing hero button), do not try to forcibly hack the Recursica component. Instead, import the raw underlying `Button` component directly from `@mui/material` and style it manually. Use Recursica for standard systematic needs, and native libraries for isolated custom one-offs.
2. **Accept `overStyled` as Technical Debt:** If you must override the Recursica component immediately but intend to roll it back, use `overStyled={true}`. The expectation is that `overStyled` uses will eventually be replaced once the actual Recursica Figma variants are natively updated to accommodate your usecase, at which point `overStyled={true}` can be safely removed.
3. **Contribute to the Kit:** Avoid building private custom wrappers around Recursica components. If the system is missing a variant, that is a shared project deficit—raise a concern and have the variant integrated directly into the universal token libraries!
