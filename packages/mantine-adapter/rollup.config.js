import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const external = [
  "fs",
  "path",
  "process",
  "util",
  "os",
  "crypto",
  "stream",
  "events",
  "buffer",
  "url",
  "querystring",
  "http",
  "https",
  "net",
  "tls",
  "child_process",
  "cluster",
  "dgram",
  "dns",
  "readline",
  "repl",
  "tty",
  "vm",
  "zlib",
  "@recursica/common",
  "@recursica/schemas",
];

const plugins = [
  resolve({
    preferBuiltins: true,
    exportConditions: ["node"],
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: "./tsconfig.json",
    sourceMap: true,
    inlineSources: true,
  }),
];
export default defineConfig([
  // Main package entry point
  {
    input: "./index.ts",
    output: {
      file: "./dist/index.js",
      sourcemap: true,
      exports: "auto",
    },
    plugins,
    external,
  },
  // CLI entry point - ES Module
  {
    input: "./main.ts",
    output: {
      file: "./dist/main.js",
      format: "es",
      sourcemap: true,
      exports: "auto",
      banner: "#!/usr/bin/env node",
    },
    plugins,
    external,
  },
  // CLI entry point - CommonJS
  {
    input: "./main.ts",
    output: {
      file: "./dist/main.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
      banner: "#!/usr/bin/env node",
    },
    plugins,
    external,
  },
  {
    input: "./webworker.ts",
    output: {
      file: "./dist/webworker.js",
      format: "es",
      sourcemap: false,
      exports: "auto",
    },
    plugins,
  },
]);
