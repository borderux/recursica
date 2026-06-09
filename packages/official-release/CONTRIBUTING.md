# Contributing to `@recursica/official-release`

All design tokens, CSS variables, and JSON metadata files in this package are generated programmatically by [Forge Recursica](https://forge.recursica.com).

**DO NOT edit the CSS or JSON files in this package manually.** Any manual changes will be lost the next time a new theme is exported from Forge.

---

## Modification Workflow

To update design tokens or CSS variables:

### 1. Update Tokens in Forge

1. Log into your account on [Forge Recursica](https://forge.recursica.com).
2. Open the Recursica design system workspace/project.
3. Make your token additions, deletions, or edits (e.g. typography sizes, brand color variables, component style cascading layers).

### 2. Export and Replace Files

1. Export the compiled theme variables and JSON files from Forge.
2. Replace the following files in this package (`packages/official-release/`) with the newly exported files:
   - `recursica_variables_scoped.css`
   - `recursica_brand.json`
   - `recursica_tokens.json`
   - `recursica_ui-kit.json`
   - `recursica.json`

### 3. Run Build & Tests

Verify that all packages build and lint cleanly with the updated token definitions:

```bash
# From the monorepo root
npm run build
npm run test
```

### 4. Create a Changeset

To prepare the update for release, generate a changeset tracking the version bump:

1. Run changesets at the monorepo root:
   ```bash
   npx changeset
   ```
2. Select `@recursica/official-release` (and any affected adapter packages that need a minor/patch bump to consume it).
3. Specify the version bump type (usually `patch` or `minor` depending on whether breaking token changes were made).
4. Provide a brief summary of the token updates.

### 5. Submit Pull Request

Commit the new files and the generated changeset MD file, then push and open a Pull Request.
