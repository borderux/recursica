const fs = require("fs");
const path = require("path");
const dir =
  "/Users/mattmassey/work/recursica/packages/mui-adapter/src/components";
const dirs = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const exportsStr = dirs.map((d) => `export * from "./${d}";`).join("\n") + "\n";
fs.writeFileSync(path.join(dir, "index.ts"), exportsStr);
console.log("Fixed components/index.ts");
