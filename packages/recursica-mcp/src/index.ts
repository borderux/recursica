#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getRecursicaRoot, getActiveAdapters } from "./common/utils.js";
import { get_general_guidelines } from "./get_general_guidelines/index.js";
import { list_components } from "./list_components/index.js";
import { get_component_doc } from "./get_component_doc/index.js";
import { recommend_component } from "./recommend_component/index.js";
import { recommend_adapter } from "./recommend_adapter/index.js";
import { get_adapter_setup } from "./get_adapter_setup/index.js";

const commands = [
  get_general_guidelines,
  list_components,
  get_component_doc,
  recommend_component,
  recommend_adapter,
  get_adapter_setup,
];

// Initialize the MCP Server
const server = new Server(
  {
    name: "recursica-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// 1. Declare Tools List
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: commands.map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      inputSchema: cmd.inputSchema,
    })),
  };
});

// 2. Define Tool Execution Request Handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const cmd = commands.find((c) => c.name === name);

  if (!cmd) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Unknown tool name: ${name}`,
        },
      ],
      isError: true,
    };
  }

  const root = getRecursicaRoot();
  const allAdapters = getActiveAdapters(root);

  if (allAdapters.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `⚠️ No Recursica adapters (e.g. '*-adapter') were found in the packages directory of the workspace at: ${root}. Please ensure your RECURSICA_PATH is configured correctly.`,
        },
      ],
      isError: true,
    };
  }

  try {
    return await cmd.handler(args, { root, allAdapters });
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `💥 Error executing tool "${name}": ${error?.message || error}`,
        },
      ],
      isError: true,
    };
  }
});

// 3. Connect to Stdio Server Transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // eslint-disable-next-line no-console
  console.error("🚀 Recursica Agnostic MCP Server started successfully!");
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error starting Recursica MCP Server:", error);
  process.exit(1);
});
