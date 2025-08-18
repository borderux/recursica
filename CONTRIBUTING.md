# Contributing to recursica

First off, thank you for considering contributing to recursica! It's people like you that make our community great. We welcome contributions of all kinds, from reporting bugs and suggesting enhancements to submitting pull requests for code changes or documentation improvements.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on our GitHub repository. When you are creating a bug report, please include as many details as possible. The information you provide helps us resolve issues faster.

### Suggesting Enhancements

If you have an idea for a new feature or an enhancement to an existing one, please open an issue on our GitHub repository. Describe your idea in as much detail as possible.

### Your First Code Contribution

Unsure where to begin? You can start by looking for issues tagged as `good first issue` or `help wanted`.

## Pull Request Workflow

Recursica uses an AI-powered pull request workflow that eliminates merge conflicts and ensures consistent code quality. Instead of manually updating shared files, the AI agent analyzes your changes and creates pull requests directly using GitHub CLI.

### Prerequisites

1. **GitHub CLI**: Required for pull request creation

   ```bash
   # macOS
   brew install gh

   # Or download from https://cli.github.com/
   gh auth login
   ```

2. **Cursor AI**: The AI agent that performs code analysis and PR creation

### How It Works

#### 1. AI Agent Analysis

The AI agent (Cursor) analyzes your code changes and:

- Reviews code documentation and style
- Checks for testing and validation
- Updates project documentation as needed
- Generates appropriate PR title and description

#### 2. Automated PR Creation

The AI agent creates pull requests using our automated scripts:

- `npm run pr` - Creates a regular PR
- `npm run pr:commit` - Commits the PR check work

**Note**: If you want to create a draft PR, you can set it to draft directly in GitHub after the PR is created.

#### 3. Pre-Push Validation

Our pre-push hook ensures the AI agent has completed the PR check before allowing pushes.

### Workflow Steps

#### For Developers

1. **Make your changes** and commit them:

   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin your-branch
   ```

2. **Open Cursor chat** and run the PR check:

   ```
   Follow the instructions found in PULL-REQUEST-CHECK.txt
   ```

3. **The AI agent will**:

   - Analyze your code changes
   - Generate a PR title and description
   - Create the pull request
   - Commit the work with a proper message

4. **Push your changes**:

   ```bash
   git push origin your-branch
   ```

#### For AI Agents

1. **Review the code** according to `PULL-REQUEST-CHECK.txt`
2. **Create the PR**:

   ```bash
   npm run pr -- --title="Your Generated Title" --description="Your generated description"
   ```

3. **Commit the work**:

   ```bash
   npm run pr:commit -- --title="Your Generated Title"
   ```

### Scripts Reference

#### `npm run pr`

Creates a pull request with the provided title and description.

**Usage:**

```bash
npm run pr -- --title="Your PR Title" --description="Your PR description"
```

**What it does:**

- Validates title and description parameters
- Analyzes git changes and commit messages
- Creates a comprehensive PR description
- Uses GitHub CLI to create the pull request
- Cleans up temporary files

#### `npm run pr:commit`

Commits the PR check work with a message that the pre-push hook can detect.

**Usage:**

```bash
npm run pr:commit -- --title="Your PR Title"
```

### Generated PR Description Template

The script generates a comprehensive PR description with:

- **Summary**: AI-generated title and description
- **Changes Made**: List of commits and files changed
- **Technical Details**: Overview of changes
- **Testing & Validation**: Checklist for pre-PR checks and manual testing
- **Breaking Changes**: Section for noting any breaking changes
- **Review Focus Areas**: Guidelines for reviewers
- **Related Issues**: Section for linking GitHub issues

### Pre-Push Hook

Our pre-push hook validates that the AI agent has performed the PR check by:

1. **Checking commit messages** for AI agent activity keywords
2. **Looking for PR creation indicators** like "pr created", "ai analysis", etc.
3. **Preventing pushes** if the AI agent hasn't completed the check

#### Hook Detection Keywords

**PR Creation:**

- "pr created", "pull request", "npm run pr", "gh pr create"

**AI Analysis:**

- "ai analysis", "pr check", "code review", "pr details"

### Git Hooks and Code Quality

This project uses git hooks to ensure code quality and maintain consistent documentation:

#### Pre-commit Hook

A pre-commit hook is installed automatically when you run `npm install`. This hook runs:

- Type checking
- Linting
- Tests
- Code formatting

If the pre-commit hook is not running automatically, you should manually run:

```sh
npm run precommit
```

#### Pre-push Hook

A pre-push hook ensures the AI agent has completed the PR check before allowing pushes. If the pre-push hook fails, you must:

1. Open Cursor (or another AI agent)
2. Follow the instructions in `PULL-REQUEST-CHECK.txt`, which includes:
   - Reviewing code documentation
   - Checking coding style and complexity
   - Verifying test coverage
   - Updating project documentation
   - Creating the pull request using our automated scripts

### Pull Request Process

We welcome your pull requests. Please follow these steps:

1. Fork the repo and create your branch from `main`.
2. Make your changes in a new git branch.
3. If you've added code that should be tested, add tests.
4. Ensure all checks pass by running `npm run precommit`.
5. Follow the AI-powered PR workflow described above.
6. If your change affects the user (e.g., adds a feature, fixes a bug), you **must** add a changeset. See the section below.
7. Issue that pull request!

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

## Benefits of the New Workflow

- ✅ **No Merge Conflicts**: Each PR is created independently
- ✅ **AI-Driven Intelligence**: AI agent provides context-aware analysis
- ✅ **Consistent Quality**: Standardized PR format and validation
- ✅ **Better Integration**: Direct GitHub CLI integration
- ✅ **Automated Validation**: Pre-push hooks ensure compliance

## Troubleshooting

### "gh: command not found"

Install GitHub CLI from https://cli.github.com/

### "Authentication required"

Run `gh auth login` to authenticate with GitHub

### "AI agent PR check has not been performed"

The pre-push hook detected that the AI agent hasn't completed the PR check. Run the PR check in Cursor chat.

### "Error: --description parameter is required"

Make sure to provide both --title and --description parameters to the PR creation script.

### "No staged changes to commit"

The commit script is meant to be run after the AI agent has completed its PR check and created the pull request.

## Code of Conduct

This project is governed by a Code of Conduct. By participating, you are expected to uphold this code.
