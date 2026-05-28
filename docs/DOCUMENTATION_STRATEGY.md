# Documentation Strategy (Human & AI)

Recursica is designed to be easily navigable and understandable by both human developers and Artificial Intelligence (AI) agents. This document outlines our philosophy and strategy for maintaining documentation across the monorepo.

## 1. Human Documentation

The traditional documentation stack provides high-level architecture, contribution guidelines, and detailed usage instructions for developers.

- **`README.md`**: The primary entry point for a package. Provides an overview, installation instructions, and basic usage.
- **`USAGE.md`**: Detailed instructions, code snippets, and API references for consuming a package.
- **`ARCHITECTURE.md`**: Details project architecture, dependencies, and core philosophy of a specific library or application.
- **`CONTRIBUTING.md`**: Guidelines for human developers on how to fork, test, and submit pull requests.

## 2. AI Documentation

With the rise of AI-assisted coding, we maintain specific files that act as maps and constraint-setters for AI agents. We strictly separate internal monorepo development from external package consumption.

### `AGENT.md` (Internal Development)

**Target Audience**: AI agents operating _inside_ the Recursica monorepo (e.g., an agent helping a Recursica maintainer build or refactor the codebase).

- **Purpose**: Provides instructions on monorepo architecture, testing commands, linting rules, and strict coding constraints (e.g., "Do not swallow exceptions", "Run turbo build").
- **Location**: Found at the monorepo root, and inside every package/app directory.
- **Navigation**: The root `AGENT.md` acts as a central hub, routing the AI to package-specific `AGENT.md` files depending on the context of the task.

### `llms.txt` (External Consumption)

**Target Audience**: AI agents operating in a _consumer's_ repository (e.g., an agent helping an external developer use `@recursica/mantine-adapter` in their own project).

- **Purpose**: Based on the [llmstxt.org](https://llmstxt.org/) standard, it provides LLMs with context on how to consume the library's API.
- **Location**: Found at the monorepo root (for high-level repository exploration), and inside every public package.
- **Navigation**: Instead of duplicating documentation, `llms.txt` serves as a router. It points the AI directly to `USAGE.md`, `ARCHITECTURE.md`, and `README.md`.

## 3. NPM Bundling Strategy

To ensure that AI agents have immediate, local access to our documentation without relying on fragile network requests, we bundle key documentation directly into our published NPM packages.

For every public package (e.g., `@recursica/mantine-adapter` or `@recursica/mui-adapter`), the `package.json` `"files"` array explicitly includes:

- `"llms.txt"`
- `"USAGE.md"`
- `"ARCHITECTURE.md"` (if applicable)

**Why this matters:** When a user installs our package, their AI agent can easily discover `node_modules/@recursica/mantine-adapter/llms.txt`. Because `USAGE.md` is also bundled in that same directory, the relative links within `llms.txt` (e.g., `[USAGE](USAGE.md)`) resolve perfectly on the user's local file system. This creates a fast, offline-capable context gathering loop for the agent.
