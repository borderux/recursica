# Contributing to Recursica

First off, thank you for considering contributing to Recursica! It's people like you that make our community great. We welcome contributions of all kinds, from reporting bugs and suggesting enhancements to submitting pull requests for code changes or documentation improvements.

## Package & App Specific Guidelines

Recursica is a monorepo containing multiple packages and apps. Many of them have their own `CONTRIBUTING.md` with guidelines specific to that package or app. **Please check for and follow the `CONTRIBUTING.md` in the relevant package or app directory before contributing.**

Current packages and apps with their own contributing guides:

- [`packages/adapter-common`](packages/adapter-common/CONTRIBUTING.md)
- [`packages/common`](packages/common/CONTRIBUTING.md)
- [`packages/mantine-adapter`](packages/mantine-adapter/CONTRIBUTING.md)

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on our [GitHub repository](https://github.com/borderux/recursica/issues). When you are creating a bug report, please include as many details as possible. The information you provide helps us resolve issues faster.

### Suggesting Enhancements

If you have an idea for a new feature or an enhancement to an existing one, please open an issue on our [GitHub repository](https://github.com/borderux/recursica/issues). Describe your idea in as much detail as possible.

### Your First Code Contribution

Unsure where to begin? You can start by looking for issues tagged as `good first issue` or `help wanted`.

## Pull Request Workflow

### 1. Fork the Repository

Fork the [recursica repository](https://github.com/borderux/recursica) to your own GitHub account by clicking the **Fork** button on the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/recursica.git
cd recursica
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create a Branch

Create a new branch from `main` for your changes:

```bash
git checkout -b your-branch-name
```

### 5. Make Your Changes

- If you've added code that should be tested, add tests.
- Follow the contributing guidelines for the specific package or app you're working in.

### 6. Validate Your Changes

A **pre-commit hook** is automatically installed when you run `npm install` (via [Husky](https://typicode.github.io/husky/)). This hook runs linting, type checking, tests, and formatting on your staged files before each commit, so issues are caught early.

If you need to run these checks manually, you can use:

```bash
npm run precommit
```

This runs type checking, linting, tests, and code formatting.

### 7. Commit and Push

```bash
git add .
git commit -m "Your descriptive commit message"
git push origin your-branch-name
```

### 8. Open a Pull Request

Go to the original [recursica repository](https://github.com/borderux/recursica) and open a pull request from your fork's branch into `main`.

In your PR description, please include:

- A summary of the changes
- Any related issue numbers (e.g., `Fixes #123`)
- Whether there are any breaking changes

## Updating Figma UI Kit Variables

To ensure our React components stay 100% in sync with the design system, we enforce an Ultra-Strict token validation pipeline during the build process.

When you receive a new version of the UI Kit (`recursica.json` and `recursica_variables_scoped.css`), you must run the token analyzer to resolve any breaking changes:

1. Copy the new files into your adapter package.
2. Run `npm run analyze-tokens` from within the adapter package directory.
3. The analyzer will generate a `token-analysis.json` report containing two categories:
   - **Broken Variables:** Component references to CSS variables that no longer exist in the UI Kit. You must update your React component's `.module.css` files to match the new variable names.
   - **Unused Variables:** New CSS variables added to the UI Kit that are not yet implemented in the adapter. You must build out these new features or states.
4. **Exemptions:** If a Figma variable is purposely ignored in your integration (e.g., redundant sizing tokens), you can permanently exempt it by adding an inline comment directly inside your component's `.module.css` file:
   ```css
   /* recursica-ignore: --recursica_ui-kit_components_button_some_weird_state */
   ```
5. The `npm run build` pipeline uses a `prebuild` hook to run this analyzer. The build will **fail** if there are _any_ broken variables or _any_ un-exempted unused variables remaining!

## Using Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage releases. All pull requests that fix a bug, add a feature, or otherwise impact the user must include a changeset file.

To create a changeset, run the following command in the root of the project:

```bash
npx changeset
```

This will launch an interactive CLI that will guide you through creating a changeset. You will be asked to:

- Select which packages have changed.
- Provide a version type for each package (`patch`, `minor`, or `major`).
- Write a summary of the change.

Commit the generated changeset file along with your other changes. When your pull request is merged, our release workflow will use this information to automatically version, create changelogs, and publish the packages.

## Code of Conduct

This project is governed by a Code of Conduct. By participating, you are expected to uphold this code.
