# Over Styling (`overStyled`)

By default, all Recursica components are strictly sandboxed. This means they are protected against arbitrary styling configurations (like passing generic React `style` objects, custom `classNames` injections, or using deep Mantine layout hooks like `bg` and `c`). This strict compile-time and run-time enforcement guarantees that your design system tokens remain true across your application.

However, there may be edge cases where a developer absolutely must modify a component beyond what the design tokens natively allow. For this, we provide the **escape hatch** property: `overStyled={true}`.

```tsx
<Button overStyled={true} bg="pink" c="black" radius="xl">
  Unsafe Pink Marketing Button
</Button>
```

## The Core Philosophy

**You should not over-style components.** Using `overStyled` explicitly signifies that you are breaking design system rules.

1. **Technical Debt:** If over-styling is required, it should be treated as a short-term workaround. Ideally, the component will be refactored once the required layouts or variants are officially integrated into the core Recursica component library.
2. **Auditing & Searching:** Because this pattern creates technical debt, we enforce the explicit `overStyled` boolean. This provides a highly auditable, easily searchable string. Product managers and engineers can quickly grep the codebase for `overStyled` (or the `RecursicaOverStyled` typings) to hunt down components that don't match standard patterns.
3. **Highly Custom Components:** If your application genuinely requires massive custom layouts that the UI kit cannot support, **do not hack the Recursica component**. Instead, it is highly encouraged that you import the underlying primitive component directly from `@mantine/core` and construct your independent feature there. While you can utilize raw Recursica CSS variables on these custom components, note that they are not guaranteed to be accurately maintained as Recursica evolves. Keep strict components strict!

## Permitted Layout Properties

Unlike deep styling bounds (colors, typography, padding, dimensions), external **layout spacing properties** like margins (`m`, `mt`, `mb`, `mx`) are safely **permitted by default**. This allows integrators to structurally compose components alongside siblings without breaching internal token boundaries.

When using layout properties, you have the flexibility to use either ecosystem seamlessly:

1. **Mantine Core Values:** Passing standard Mantine sizes (like `mt="md"`) passes straight through to Mantine natively, allowing you to interface completely normally with a parent application's existing Mantine Theme setup that might fall outside Recursica's scope.
2. **Recursica Strict Tokens:** Passing our custom prefixed tokens (like `mt="rec-md"`) signals our internal layout interceptor to securely translate the value directly to our native `recursica_brand_dimensions` CSS variables. This ensures strict design token measurements while sharing the exact same prop interface!

Available Recursica layout tokens:

- `rec-none` (0px limit)
- `rec-sm` (0.5x scaling)
- `rec-default` (1.0x scaling)
- `rec-md` (1.5x scaling)
- `rec-lg` (2.0x scaling)
- `rec-xl` (3.0x scaling)
- `rec-2xl` (4.0x scaling)

## Primitive Layout Components Exemption

Unlike complex UI components (Buttons, Tabs, Inputs) which are strictly protected, **Primitive Layout Components** (`Flex`, `Stack`, `Group`, `Container`) are entirely exempt from the `RecursicaOverStyled` gatekeeper.

Because the entire functional purpose of these components is structural layout composition, developers are free to pass any standard Mantine width, height, padding, margin, gap, and alignment property directly to them without needing to flag `overStyled={true}`. The internal custom token mapper (such as converting `gap="rec-md"`) is still active natively on these wrappers.

## Visual Auditing & Highlights (Development Only)

To make it easy to spot technical debt and design system violations, Recursica automatically tracks any component that uses the `overStyled={true}` prop.

In **development builds**, you can highlight all over-styled components on the page. Open your browser's developer console and run:

```js
recursica.toggleOverStyled();
```

This toggles a **cyan 2px box shadow** outline around the children of all over-styled components. The wrapping elements use `display: contents` under the hood to ensure they occupy zero DOM space and do not affect flex, grid, or absolute positioning flow. In production builds, this debugging helper is completely disabled and stripped with zero performance overhead.
