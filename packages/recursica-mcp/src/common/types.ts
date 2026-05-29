export interface AdapterInfo {
  name: string; // e.g. "mantine" or "mui"
  dirName: string; // e.g. "mantine-adapter"
  absPath: string; // e.g. "/Users/mattmassey/work/recursica/packages/mantine-adapter"
}

export interface CommandContext {
  root: string;
  allAdapters: AdapterInfo[];
}

export interface Command {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
  };
  handler: (
    args: any,
    context: CommandContext,
  ) => Promise<{
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
  }>;
}
