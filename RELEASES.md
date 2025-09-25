# Releasing Packages

## Overview

This project supports two distinct release modes:

1. **NPM Package Releases**: For libraries and packages intended for public consumption
2. **GitHub Release Assets**: For applications and plugins that need to be distributed as downloadable assets

## Changesets

Versioning and releases are managed by the awesome Changesets package. For more information and details on how this works, check out [Changesets](https://github.com/changesets/changesets)

## Release Modes

### 1. NPM Package Releases

**Purpose**: For libraries and packages that will be consumed by other developers via npm

**Configuration**:

- Set `"private": false` in package.json
- Package will be published to npm registry
- Available for installation via `npm install @recursica/package-name`

**Examples**: `@recursica/ui-kit-mantine`, `@recursica/schemas`, `@recursica/common`

### 2. GitHub Release Assets

**Purpose**: For applications and plugins that need to be distributed as downloadable files

**Configuration**:

- Set `"private": true` in package.json
- Package will NOT be published to npm
- Assets (zip files) will be attached to GitHub releases
- Follows the publishing architecture documented in [PUBLISHING.md](./PUBLISHING.md)

**Examples**: `@recursica/figma-plugin`, `@recursica/figma-plugin-test`

## Package Setup

Follow these guidelines when publishing your package for the first time

1. Make sure you package has a LICENSE file (MIT)
2. Make sure you include a CONTRIBUTING.md
3. Make sure you have an `.npmrc` copied from one of the other packages
4. Modify you package.json with the following
   1. `name`: Should be `@recursica/<package name>`
   2. `description`: Include a description
   3. `private`: Set to `false` for NPM releases, `true` for GitHub asset releases
   4. `homepage`: "https://github.com/borderux/recursica"
   5. `author`: "hi@borderux.com"
   6. `bugs`: "https://github.com/borderux/recursica/issues"
   7. `repository`: { "type": "git","url": "git+https://github.com/borderux/recursica.git" }

**Important**: The `private` field determines the release mode:

- `"private": false` → NPM Package Release
- `"private": true` → GitHub Release Asset

## Creating a new version

From your terminal, run the command `npx @changesets/cli`. This will walk through you the package you want to create a new version for and document your change.

Changesets will run a CI action that creates a new PR called `Version Packages`. This will accumulate all your versions and changes until your ready to release.

## Making a release

To make a release, just merge the `Version Packages` PR into main. The release process will automatically handle both modes:

### For NPM Package Releases (`"private": false`)

- Changesets publishes packages to npm registry
- Packages become available for installation via `npm install`

### For GitHub Release Assets (`"private": true`)

- Changesets creates a GitHub release at [GitHub Releases](https://github.com/borderux/recursica/releases)
- The publishing workflow automatically:
  1. Creates zip files for packages with publish commands
  2. Uploads zip files as assets to the GitHub release
  3. Makes assets available for download

**Note**: Both release modes happen simultaneously when you merge the `Version Packages` PR. The system automatically detects which packages should be published to npm vs. which should have assets uploaded to GitHub releases based on the `private` field in each package's `package.json`.

## Testing the Release Workflow

You can test the GitHub Release Assets workflow locally using the test script:

```bash
# Test the entire workflow (dry run)
node scripts/test-release-workflow.mjs

# Test with specific packages
node scripts/test-release-workflow.mjs --packages @recursica/figma-plugin

# Test with actual uploads (requires GitHub CLI authentication)
node scripts/test-release-workflow.mjs --upload
```

For more detailed information about the publishing architecture, see [PUBLISHING.md](./PUBLISHING.md).

### Additional Issues/Notes

1. You may see an issue in your `Version Packages` PR that the check does not properly run. This was solved by using a Personal Access Token (PAT) as the GITHUB_TOKEN, but you may still see this issue sometimes. To solve it, just close the PR and re-open it and it should work
