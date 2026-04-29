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

## Philosophy

Please read [PHILOSOPHY.md](./docs/PHILOSOPHY.md) to understand the core principles of the adapter.

## Developer & AI Guidelines

This repository provides dedicated routing documents for both human developers and AI Agents to ensure strict adherence to our design system constraints.

- **For Human Developers:** This `README.md` acts as your primary routing document. If you are integrating this library into an application, please read [USAGE.md](./USAGE.md). If you are building or modifying components inside this library, please read [CONTRIBUTING.md](./CONTRIBUTING.md).
- **For AI Agents:** All AI Agents operating in this repository must start by reading [AGENT.md](./AGENT.md), which serves as the primary routing document for AI workflows.

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

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
