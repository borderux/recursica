# Contributing to recursica

First off, thank you for considering contributing to recursica! It's people like you that make our community great. We welcome contributions of all kinds, from reporting bugs and suggesting enhancements to submitting pull requests for code changes or documentation improvements.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on our GitHub repository. When you are creating a bug report, please include as many details as possible. The information you provide helps us resolve issues faster.

### Suggesting Enhancements

If you have an idea for a new feature or an enhancement to an existing one, please open an issue on our GitHub repository. Describe your idea in as much detail as possible.

### Your First Code Contribution

Unsure where to begin? You can start by looking for issues tagged as `good first issue` or `help wanted`.

### Pull Request Process

We welcome your pull requests. Please follow these steps:

1.  Fork the repo and create your branch from `main`.
2.  Make your changes in a new git branch.
3.  If you've added code that should be tested, add tests.
4.  Ensure the test suite passes (`npm test`).
5.  Make sure your code lints (`npm run lint`).
6.  If your change affects the user (e.g., adds a feature, fixes a bug), you **must** add a changeset. See the section below.
7.  Issue that pull request!

## Using Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage releases. All pull requests that fix a bug, add a feature, or otherwise impact the user must include a changeset file.

To create a changeset, run the following command in the root of the project:

```sh
npx changeset
```

This will launch an interactive CLI that will guide you through creating a changeset. You will be asked to:

- Select which packages have changed.
- Provide a version type for each package (`patch`, `minor`, or `major`).
- Write a summary of the change.

Commit the generated changeset file along with your other changes. When your pull request is merged, our release workflow will use this information to automatically version, create changelogs, and publish the packages.

## Code of Conduct

This project is governed by a Code of Conduct. By participating, you are expected to uphold this code.
