# Recursica Storybook

This app is a simple build and deployment wrapper for the mantine-adapter storybook. It builds the mantine-adapter storybook and deploys it to GitHub Pages.

## What it does

- Builds the mantine-adapter storybook using `npm run build`
- Copies the built storybook to the `dist/` folder
- Deploys the storybook to GitHub Pages via the `publish` script
- Provides a root redirect from the main site to the storybook

## Available Scripts

- **`npm run build`** - Builds the mantine-adapter storybook and copies it to `dist/`
- **`npm run publish`** - Deploys the built storybook to GitHub Pages

## Deployment

The storybook is automatically deployed to GitHub Pages when changes are merged to the `main` branch through the changesets release workflow.

The deployed storybook will be available at:

- **Main site**: `https://[username].github.io/recursica/` (redirects to storybook)
- **Direct access**: `https://[username].github.io/recursica/storybook/`

## License

This project is licensed under the terms specified in the [LICENSE](../../LICENSE) file.
