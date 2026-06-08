import { Command } from "../common/types.js";
import { description } from "./description.js";
import { explanation } from "./explanation.js";

export const what_is_recursica: Command = {
  name: "what_is_recursica",
  description,
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  handler: async () => {
    return {
      content: [{ type: "text", text: explanation }],
    };
  },
};
