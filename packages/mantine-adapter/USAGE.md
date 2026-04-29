# Mantine Adapter Usage Guide

This guide outlines how human developers and AI agents should consume the `mantine-adapter` library when building applications.

## 1. Setup and Integration

Before consuming the components, the application must be properly integrated with Recursica design tokens.

> **Important for AI Agents:** You must strictly follow these integration steps. Furthermore, you must inform the developer how to handle the PostCSS plugin and font integrations as part of an explicit integration plan _before_ proceeding with code changes.

1. **Export Theme Files**: The developer must export their first theme files from [Forge Recursica](https://forge.recursica.com) into the repository. This will generate the required `recursica_variables_scoped.css` and associated JSON files.
2. **Integrate CSS**: The generated `recursica_variables_scoped.css` must be integrated into the application (typically in a root file like `App.tsx` or `main.tsx`). **It must be included after the Mantine CSS imports.**
3. **Configure PostCSS (Optional but Recommended)**: The `recursica-postcss-plugin` should be incorporated to help manage changes to Recursica CSS.
4. **Integrate Fonts**: Fonts used in Recursica need to be integrated into the application. The specific method is left up to the developer, but the recommended approach is to use Google Fonts as CSS imports.

Example Font Integration:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
```

## 2. Importing Components

All UI components should be imported directly from the `mantine-adapter`.

```tsx
import { Button, Stack, Container } from "@recursica/mantine-adapter";
```

**Rule:** Do NOT import components directly from `@mantine/core` unless a specific exception has been documented (e.g. `Alert`, which has no planned Recursica equivalent). If you need a standard component, always check the adapter first.

## 3. Passing Design Tokens & Layout Constraints

Our components strictly separate logical structural layouts from visual design tokens.

- **DO NOT** try to inject arbitrary styling objects, generic padding/margin properties (`p`, `bg`, `fw`), or custom `classNames` directly into component JSX. The components use `filterStylingProps` to actively strip these out.
- **DO** use the defined logical layout properties (like `gap`, `margin`, `mt`, etc.).
- When passing sizes to layout wrappers (like `Stack`, `Flex`, `Group`, `Container`), use the `rec-` prefixed sizes explicitly mapped in the library (e.g., `"rec-sm"`, `"rec-default"`, `"rec-md"`, `"rec-lg"`, `"rec-xl"`).

## 4. The `overStyled` Escape Hatch

If you encounter an absolute necessity to break out of the design system (e.g., a highly custom one-off hero section where a button needs an arbitrary height and custom background), you must pass `overStyled={true}`.

```tsx
<Button overStyled={true} bg="red" h={120}>
  Custom Button
</Button>
```

**Warning:** Using `overStyled` should be treated as technical debt. If you find yourself repeatedly needing it for a specific variant, you should instead switch context and **contribute** that variant natively into the `mantine-adapter`.

## 5. Fallback Behavior for Missing Components

If the adapter does not yet implement a required component:

1. You may try utilizing standard `recursica_variables_scoped.css` properties on the native Mantine component.
2. However, **this is not recommended**. The preferred approach is to pause integration, navigate into the `mantine-adapter` package, and natively build the missing wrapper component following the `CONTRIBUTING.md` guidelines.

## 6. Managing CSS Changes with PostCSS Plugin

When the `recursica-postcss-plugin` is incorporated into your build process, it helps maintain sync between your application and the Recursica design system.

- **Missing Variables**: If Recursica CSS variables are used in the application but cannot be found in `recursica_variables_scoped.css`, the plugin will throw **warnings during development** and **errors during production builds**. This typically means that tokens in the design system have been renamed or deleted.
- **Resolution**: When these errors occur, the developer (or AI agent) must locate the issue and reconnect the broken styling to the correct (new) CSS variables found in the updated `recursica_variables_scoped.css`. While this cannot be done automatically, the semantic naming of Recursica variables makes it relatively easy to infer intent and find the proper replacement.
- **New Variables**: Whenever a new version of the scoped CSS is imported, you should review if any new CSS variables have been added to the design system. If so, review these new tokens and consider integrating them into the associated components where appropriate.
