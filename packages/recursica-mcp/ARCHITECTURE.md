# Architecture - Recursica MCP Server

This document outlines the architecture and execution pipeline of the `@recursica/mcp` server.

## Overview

The Recursica MCP server is built using the official `@modelcontextprotocol/sdk` and compiles into a modular Node.js CLI tool. It acts as an adapter-agnostic integration companion that connects host AI agents/developers directly to the design system packages.

## Dependencies

- **`@modelcontextprotocol/sdk`**: Core protocol implementation for handling JSON-RPC requests.
- **`vitest`**: Mock-supported unit testing framework.
- **`typescript`**: Compiles ESM modules.

## Directory Structure

- `src/index.ts`: Server entrypoint. Dynamically registers all tools and delegates call executions.
- `src/common/`: Holds common types and files:
  - `types.ts`: Interfaces for commands, context, and adapter information.
  - `utils.ts`: Shared helper functions (monorepo root walkup, adapter lists, markdown parsing).
- `src/[command_name]/`: Each MCP command resides in its own isolated sub-folder containing:
  - `[command_name].ts`: Main schema and handler execution logic.
  - `index.ts`: Clean module export.
  - `[command_name].test.ts`: Isolated unit test file.

## Key Design Decisions

- **Command Autonomy**: Each command defines its own `name`, `description`, `inputSchema`, and `handler`. This keeps the entrypoint clean and makes adding new tools as simple as dropping in a new folder and registering it in `src/index.ts`.
- **Monorepo Resilience**: All filesystem-reading commands traverse recursively up to the filesystem root, ensuring full monorepo package resolution compatibility under all editor environments.
