# Mantine Adapter Usage Guide

This guide outlines how human developers and AI agents should consume the `mantine-adapter` library when building applications.

## 1. Setup and Integration

Before consuming the components, the application must be properly integrated with Recursica design tokens. Please refer to [SETUP.md](SETUP.md) for full installation and integration instructions.

> [!IMPORTANT]
> If you are an AI agent, you must verify that all setup and integration steps described in [SETUP.md](SETUP.md) are fully followed before attempting to use or customize Recursica components in the application.

## 2. Importing Components

All UI components should be imported directly from the `mantine-adapter`.

```tsx
import { Button, Stack, Container } from "@recursica/mantine-adapter";
```

**Rule:** Do NOT import components directly from `@mantine/core` unless a specific exception has been documented (e.g. `Alert`, which has no planned Recursica equivalent). If you need a standard component, always check the adapter first.
**Rule** Try to use only Recursica components as much as possible.

## 3. Passing Design Tokens & Layout Constraints

Our components strictly separate logical structural layouts from visual design tokens.

- **DO NOT** try to inject arbitrary styling objects, generic padding/margin properties (`p`, `bg`, `fw`), or custom `classNames` directly into component JSX. The components use `filterStylingProps` to actively strip these out.
- **DO** use the defined logical layout properties (like `gap`, `margin`, `mt`, etc.).
- When passing sizes to layout wrappers (like `Stack`, `Flex`, `Group`, `Container`), use the `rec-` prefixed sizes explicitly mapped in the library (e.g., `"rec-sm"`, `"rec-default"`, `"rec-md"`, `"rec-lg"`, `"rec-xl"`).
- **DO NOT** try to pass in styling prop names like styled or className. No external styling should be applied unless absolutely necessary. You must use the `overStyled` prop in order to apply external stylings
- **DO NOT** directly access Recursica CSS styles, CSS variables, or JSON token definitions to use in your own styling. These are not considered stable and will change between releases.

## 4. The `overStyled` Escape Hatch

If you encounter an absolute necessity to break out of the design system (e.g., a highly custom one-off hero section where a button needs an arbitrary height and custom background), you must pass `overStyled={true}`.

```tsx
<Button overStyled={true} bg="red" h={120}>
  Custom Button
</Button>
```

**Warning:** Using `overStyled` should be treated as technical debt. If you find yourself repeatedly needing it for a specific variant, you should instead switch context and **contribute** that variant natively into the `mantine-adapter`.

See [OVERSTYLING.md](OVERSTYLING.md) for the full philosophy behind this escape hatch, which layout properties are permitted by default, and how to visually audit over-styled components in development builds.

## 5. Fallback Behavior for Missing Components

If the adapter does not yet implement a required component, the preferred approach is to pause integration, navigate into the `mantine-adapter` package, and natively build the missing wrapper component following the `CONTRIBUTING.md` guidelines. If this is not possible, then utilize the underlying Mantine components directly using the project's preferred styling approach (check setup instructions for details in the project).

## 6. Managing CSS Changes with PostCSS Plugin

When the `recursica-postcss-plugin` is incorporated into your build process, it helps maintain sync between your application and the Recursica design system.

- **Missing Variables**: If Recursica CSS variables are used in the application but cannot be found in `recursica_variables_scoped.css`, the plugin will throw **warnings during development** and **errors during production builds**. This typically means that tokens in the design system have been renamed or deleted.
- **Resolution**: When these errors occur, the developer (or AI agent) must locate the issue and reconnect the broken styling to the correct (new) CSS variables found in the updated `recursica_variables_scoped.css`. While this cannot be done automatically, the semantic naming of Recursica variables makes it relatively easy to infer intent and find the proper replacement.
- **New Variables**: Whenever a new version of the scoped CSS is imported, you should review if any new CSS variables have been added to the design system. If so, review these new tokens and consider integrating them into the associated components where appropriate.
