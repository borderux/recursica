# @recursica/mantine-adapter

A modern React component library built with TypeScript and **Mantine 8**. This package serves as the core UI kit for Recursica applications, providing reusable UI components, centralized theme configurations, and a comprehensive Storybook environment for development.

## Installation

```bash
npm install @recursica/mantine-adapter
# or
yarn add @recursica/mantine-adapter
# or
pnpm add @recursica/mantine-adapter
```

## Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```bash
npm install @mantine/core@>=8.0.0 @mantine/dates@>=8.0.0 @mantine/hooks@>=8.0.0 react@>=16.8.0 react-dom@>=16.8.0
```

**Important**: Make sure you have these exact versions or higher installed, as the components rely on Mantine 8+ features and React 16.8+ hooks.

## Quick Start

To use `@recursica/mantine-adapter` in your project, you **must** import its required CSS files in a specific order at the root of your application (e.g., in `App.tsx` or `main.tsx`). This ensures that Mantine styles load first, followed by the Recursica design tokens, and finally the adapter overrides.

```tsx
import "@mantine/core/styles.css";
import "../path/to/recursica_variables_scoped.css"; // Import your Recursica CSS variables
import "@recursica/mantine-adapter/style.css";

import React from "react";
import { Button } from "@recursica/mantine-adapter";

function App() {
  return <Button variant="solid">Click Me</Button>;
}
```

## Philosophy

The `@recursica/mantine-adapter` is designed to provide curated, strictly-typed UI components tailored specifically following the Recursica styling and behavior guidelines.

- **Override, Don't Corrupt**: Recursica components are built as wrappers around Mantine components to seamlessly override their default appearance with Recursica stylings. We deliberately **leave the base Mantine global styles and theme alone** so that it does not negatively impact the overall project or third-party libraries depending on standard Mantine.
- **Strictly Curated Props**: We expose a complete set of Mantine props via our Recursica components, but **not all props are fully supported**. We restrict certain props if they do not fit the established UI definition, styles, or behaviors of the Recursica design system.
- **Avoid Overstyling**: Developers are encouraged to use Recursica components precisely as they are provided. You should **not overstyle them** (e.g., injecting custom styles or class names that conflict with the adapter) as this risks breaking the carefully constructed styling connections and visual consistency.
- **Need Something Different?**: If you need to build a UI element with completely different styling that deviates from the design system, you are encouraged to import the base component directly from `@mantine/core` and style it yourself to achieve your goal.

## Development and Architecture

This project is built using:

- **Vite (Library Mode)**: For fast builds, producing optimized ES and CJS modules.
- **Mantine 8**: Base components, hooks, and native standard styling architecture.
- **Storybook**: Used heavily for interactive component development, documentation, and prototyping.

> **Note:** We relying completely on Mantine's built-in CSS styling and Vite's native CSS/CSS Modules capabilities. No complex CSS-in-JS overhead!

## Storybook Documentation

This library includes Storybook for all components. You can:

- **View live examples** of components.
- **Test component interactions** and accessibility.
- **Explore UI tokens** and layout utilities.

### Accessing Storybook Locally

If you're contributing or developing locally, clone the repository and run:

```bash
npm run storybook
```

This will spin up a local server (typically at `http://localhost:6006`) with a hot-reloading environment for component prototyping.

## TypeScript Support

All newly built components will include full TypeScript support with comprehensive prop types exported.

## Contributing

For development and contribution guidelines, see the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
