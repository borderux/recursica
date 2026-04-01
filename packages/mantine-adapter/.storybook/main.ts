import { createMainConfig } from "@recursica/storybook-template/main";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);

const config = createMainConfig({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  basePath: "/recursica/",
  enableCORS: true,
  enablePostcssVars: true,
  recursicaCSSPath: join(currentDirname, "../recursica_variables_scoped.css"),
  postCSSStrictMode: true,
});

export default config;
