# @recursica/mcp

An adapter-agnostic Model Context Protocol (MCP) server for the Recursica design system.

This MCP server provides a suite of tools for AI assistant agents (like Claude, Gemini, or Antigravity) to dynamically inspect, query, and consume custom UI components in your active adapters.

## Dynamic Tooling Offered

- **`recursica_get_usage`**: Returns architectural design rules, component usage patterns, and styling token guidelines.
- **`recursica_list_components`**: Lists all available custom components across active adapters (e.g. `mantine-adapter`, `mui-adapter`).
- **`recursica_get_component_doc`**: Displays full component notes, API types, and `.tsx` source code signatures.
- **`recursica_recommend_component`**: Recommends the ideal component based on your UI layout constraints or keywords.
- **`recursica_project_setup`**: Serves installation and setup guides for projects integrating Recursica.
- **`what_is_recursica`**: Provides general documentation on what Recursica is, its core philosophy, and setup overview.

## Installation & Usage

The Recursica MCP server is distributed as the `@recursica/mcp` NPM package. You can configure and run it directly using `npx` without needing to clone the repository or set up a local development environment.

### Add to your MCP Client Configuration

To register the Recursica MCP server, add the following configuration to your client's settings (such as Claude Desktop, VS Code, Gemini, or Antigravity):

#### Claude Desktop

Add the following entry to your `claude_desktop_config.json` file (typically located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "recursica-mcp": {
      "command": "npx",
      "args": ["-y", "@recursica/mcp@latest"],
      "cwd": "/absolute/path/to/your/project-workspace"
    }
  }
}
```

> [!IMPORTANT]
> The `"cwd"` (current working directory) field is required and must be set to the absolute path of your active project workspace. This allows the Recursica MCP server to locate the appropriate configuration files, local adapters, and node modules to inspect.

#### Antigravity / Gemini / Other Clients

For other clients, configure the server using:

- **Command**: `npx`
- **Arguments**: `["-y", "@recursica/mcp@latest"]`
- **Cwd**: `/absolute/path/to/your/project-workspace` (absolute path to the workspace directory)

### Using the Tools

Once registered, ask your AI assistant to use Recursica directly — e.g. "set up Recursica in this project" or "what Recursica components are available?" — and it will call the relevant tool (`recursica_project_setup`, `recursica_list_components`, etc.) automatically. See [Dynamic Tooling Offered](#dynamic-tooling-offered) above for the full list of what each tool does.

---

## Local Development Setup

To test and run this server locally during development:

### 1. Run the Visual MCP Inspector

You can also inspect and visually test the server tools in an interactive playground:

1. Start the development inspector server:
   ```bash
   npm run dev
   ```
2. The inspector will automatically open the playground interface in your browser (usually at `http://localhost:6274`), which hot-reloads on-the-fly as you modify the source files.

### 2. Register the Local Server in your Client

Configure your MCP client (such as VS Code, Gemini, or Antigravity) to run the TypeScript source files directly using `tsx` (which requires no manual compile/build steps to see code changes):

```json
"recursica-mcp": {
  "command": "npx",
  "args": [
    "tsx",
    "/absolute/path/to/recursica/packages/recursica-mcp/src/index.ts"
  ],
  "cwd": "/absolute/path/to/your/project-workspace"
}
```
