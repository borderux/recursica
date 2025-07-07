import { recursica } from "@recursica/mantine-adapter";

recursica({
  config: {
    rootPath: "packages/ui-kit",
    srcPath: "packages/ui-kit/src",
    project: {
      name: "ui-kit",
      root: "packages/ui-kit",
      adapter: "packages/ui-kit/webworker.js",
    },
  },
  transform: (tokens) => {
    return tokens;
  },
  adapter: (tokens) => {
    return tokens;
  },
});
