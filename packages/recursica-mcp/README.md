# @recursica/mcp

An adapter-agnostic Model Context Protocol (MCP) server for the Recursica design system.

This MCP server provides a suite of tools for AI assistant agents (like Gemini, Antigravity, or Claude) to dynamically inspect, query, and consume custom UI components in your active adapters.

## Dynamic Tooling Offered

- **`recursica_get_usage`**: Returns architectural design rules, component usage patterns, and styling token guidelines.
- **`recursica_list_components`**: Lists all available custom components across active adapters (e.g. `mantine-adapter`, `mui-adapter`).
- **`recursica_get_component_doc`**: Displays full component notes, API types, and `.tsx` source code signatures.
- **`recursica_recommend_component`**: Recommends the ideal component based on your UI layout constraints or keywords.
- **`recursica_project_setup`**: Serves installation and setup guides for projects integrating Recursica.
- **`what_is_recursica`**: Provides general documentation on what Recursica is, its core philosophy, and setup overview.

## Installation & Usage

For instructions on how to set up and run the Recursica MCP server in your environment using `npx`, see the [SETUP.md](SETUP.md) guide.

---

## Local Development Setup

To use this server locally during development (with instant code-sync and no restart needed):

1. **Build the package:**

   ```bash
   npm run build
   ```

2. **Register the local server** in your MCP config (`~/.gemini/antigravity/mcp_config.json`):
   ```json
    "recursica-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/recursica/packages/recursica-mcp/dist/index.js"
      ]
    }
   ```

---
