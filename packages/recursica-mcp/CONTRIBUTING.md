# Contributing to the Recursica MCP Server

First off, thank you for considering contributing! We welcome all contributions to expand our MCP tool suite.

## 🤖 AI Agent & Developer Guidelines

If you are tasked with adding, refactoring, or modifying commands **inside** the `recursica-mcp` package:

1.  **Strict Modular Architecture**: Every command must live in its own dedicated sub-folder directly under `src/` (e.g. `src/my_new_command/`).
2.  **Isolated Imports**: Always use the `.js` file extension in relative import paths within the `src` folder, matching NodeNext configuration rules.
3.  **Comprehensive Unit Tests**: Every newly created or modified command must have its own unit test file located within its folder (e.g. `src/my_new_command/my_new_command.test.ts`).
4.  **Mock Environment**: Use Vitest's `vi.mock` capabilities to mock filesystem interactions instead of polluting the local project workspace directories.

## Pull Request Process

1.  Make your changes in a new git branch.
2.  Ensure that the project compiles cleanly:
    ```bash
    npm run build
    ```
3.  Run the Vitest unit tests and ensure they all pass:
    ```bash
    npm run test
    ```
4.  If your change affects the user, add a changeset from the root of the project:
    ```bash
    npx changeset
    ```
