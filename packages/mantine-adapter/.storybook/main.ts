import { createMainConfig } from "@recursica/storybook-template/main";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);

import {
  BLOCKED_STYLING_KEYS,
  BlockedStylingKeys,
} from "../src/utils/filterStylingProps.ts";
import type { PropItem } from "react-docgen-typescript";

const config = createMainConfig({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  basePath: "./",
  enableCORS: true,
  enablePostcssVars: true,
  recursicaCSSPath: join(currentDirname, "../recursica_variables_scoped.css"),
});

config.typescript = {
  ...config.typescript,
  reactDocgen: "react-docgen-typescript",
  reactDocgenTypescriptOptions: {
    ...config.typescript?.reactDocgenTypescriptOptions,
    propFilter: (prop: PropItem) => {
      // Exclude blocked native variables universally so they vanish from all docs and controls
      if (
        BLOCKED_STYLING_KEYS.includes(prop.name as BlockedStylingKeys) ||
        ["overStyled", "readOnlyComponent"].includes(prop.name)
      ) {
        return false;
      }

      // Prevent 300+ HTML attributes from node_modules polluting controls, but allowlist core interaction states
      if (prop.parent && /node_modules/.test(prop.parent.fileName)) {
        return [
          "disabled",
          "required",
          "error",
          "checked",
          "defaultChecked",
          "label",
        ].includes(prop.name);
      }
      return true;
    },
  },
};

export default config;
