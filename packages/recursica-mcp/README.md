# @recursica/mcp

An adapter-agnostic Model Context Protocol (MCP) server for the Recursica design system.

This MCP server provides a suite of tools for AI assistant agents (like Gemini, Antigravity, or Claude) to dynamically inspect, query, and consume custom UI components in your active adapters.

## Dynamic Tooling Offered

- **`get_general_guidelines`**: Returns setup and styling rules (variables CSS, fonts, and PostCSS).
- **`list_components`**: Lists all available custom components across active adapters (e.g. `mantine-adapter`, `mui-adapter`).
- **`get_component_doc`**: Displays full component notes, API types, and `.tsx` source code signatures.
- **`recommend_component`**: Recommends the ideal component based on your UI layout constraints or keywords.

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
       "/Users/mattmassey/work/recursica/packages/recursica-mcp/dist/index.js"
     ]
   }
   ```

---

## Scoped NPM Publishing & `npx` Usage

Once you publish this package to NPM, you and other developers can consume it **without any local installation**, exactly like MUI's MCP!

### 1. How to Publish (via Changesets)

Recursica uses standard Changesets for monorepo release management. To prepare and publish:

```bash
# 1. Generate a changeset for the new package (follow prompt rules)
npx changeset

# 2. Version the packages
npx changeset version

# 3. Publish to NPM (ensures public scoped publishing)
npm run release
```

Alternatively, to manually publish this package alone:

```bash
npm publish --access public
```

### 2. Registering via `npx`

Once published under the scoped name `@recursica/mcp`, developers can register it globally in their MCP configuration:

```json
"recursica-mcp": {
  "command": "npx",
  "args": [
    "-y",
    "@recursica/mcp@latest"
  ]
}
```

_Note: When run via `npx`, developers can optionally configure the path to their active workspace repository using the `RECURSICA_PATH` environment variable if it's running outside their repository._
