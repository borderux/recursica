# Setting Up Recursica MCP Server

The Recursica MCP server is distributed as the `@recursica/mcp` NPM package. You can configure and run it directly using `npx` without needing to clone the repository or set up a local development environment.

## 1. Add to your MCP Client Configuration

To register the Recursica MCP server, add the following configuration to your client's settings (such as VS Code, Claude Desktop, Gemini, or Antigravity):

### Claude Desktop

Add the following entry to your `claude_desktop_config.json` file (typically located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "recursica-mcp": {
      "command": "npx",
      "args": ["-y", "@recursica/mcp@latest"]
    }
  }
}
```

### Antigravity / Gemini / Other Clients

For other clients, configure the server using:

- **Command**: `npx`
- **Arguments**: `["-y", "@recursica/mcp@latest"]`
