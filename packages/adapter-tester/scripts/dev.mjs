// Builds adapter-tester, then runs Dev Mode from an adapter
// checkout using that fresh build. adapter-tester has no config or Storybook
// of its own, so it needs an adapter to run against: ADAPTER_DIR, defaulting
// to the sibling recursica-adapter-mui-v7 checkout. Extra args (e.g. --port
// 6020) are forwarded to the CLI. Rerun after source changes to rebuild.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adapterDir = resolve(
  process.env.ADAPTER_DIR ??
    resolve(packageDir, "../../../recursica-adapter-mui-v7"),
);
if (!existsSync(adapterDir)) {
  throw new Error(
    `Adapter checkout not found at ${adapterDir} — set ADAPTER_DIR to one.`,
  );
}

const run = (command, args, cwd) => {
  const { status } = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (status !== 0) process.exit(status ?? 1);
};

run("npm", ["run", "build"], packageDir);
console.log(`\n[adapter-tester dev] Dev Mode against ${adapterDir}\n`);
run(
  "node",
  [resolve(packageDir, "dist/cli.js"), "--serve", ...process.argv.slice(2)],
  adapterDir,
);
