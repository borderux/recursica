# Recursica Storybook

This app is a centralized build and deployment pipeline for the Recursica multi-adapter storybook ecosystem. It builds documentation for all supported UI Kit adapters (Mantine, MUI, etc.) and seamlessly deploys them to GitHub Pages under a unified navigation structure.

## What it does

- Builds the **Mantine** adapter storybook and outputs it to `dist/mantine-adapter/`
- Builds the **MUI** adapter storybook and outputs it to `dist/mui-adapter/`
- Automatically generates an `index.html` root redirect to point traffic to the default adapter (Mantine)
- Deploys the entire multi-adapter `dist/` bundle to GitHub Pages via the `publish` script

## Available Scripts

- **`npm run build`** - Orchestrates the build of all UI-kit storybooks and stages them in `dist/`
- **`npm run publish`** - Deploys the built storybooks to GitHub Pages

## Deployment

The storybook is automatically deployed to GitHub Pages when changes are merged to the `main` branch through the changesets release workflow.

The deployed storybooks will be available at:

- **Main site**: `https://borderux.github.io/recursica/` (redirects to default storybook)
- **Mantine Adapter (Default)**: `https://borderux.github.io/recursica/storybook/mantine-adapter/`
- **MUI Adapter**: `https://borderux.github.io/recursica/storybook/mui-adapter/`

## License

This project is licensed under the terms specified in the [LICENSE](../../LICENSE) file.
