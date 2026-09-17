export interface AdapterInfo {
  name: string; // e.g. "mantine" or "mui"
  dirName: string; // e.g. "adapter-mantine-v8" (the `@recursica/<dirName>` package suffix)
  absPath: string; // e.g. resolved path to the installed @recursica/adapter-mantine-v8 package
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
