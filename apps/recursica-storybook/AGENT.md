# AGENT.md — recursica-storybook

This app is a build-and-deploy wrapper for the `mantine-adapter` Storybook. It does not contain its own stories or components.

## What This App Does

- Builds the `mantine-adapter` Storybook via `npm run build`
- Copies the output to `dist/`
- Deploys to GitHub Pages via the `publish` script

## Scripts

- `npm run build` — Build the mantine-adapter Storybook and copy to `dist/`
- `npm run publish` — Deploy to GitHub Pages

## Deployment

- Deployed automatically when changes merge to `main` through the changesets release workflow
- Main site: `https://borderux.github.io/recursica/` (redirects to storybook)
- Direct access: `https://borderux.github.io/recursica/storybook/`

## Dependencies

This app depends on `@recursica/mantine-adapter` for the actual Storybook stories and components. If you need to modify stories or components, work in `packages/mantine-adapter/` instead.
