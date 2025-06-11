import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default defineConfig([
  // Main package entry point
  {
    input: "./index.ts",
    output: {
      file: "./dist/index.js",
      exports: "auto",
    },
    plugins: [
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
        declaration: true,
        declarationDir: "./dist",
        rootDir: ".",
      }),
    ],
    external: [
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
    ],
  },
  // CLI entry point
  {
    input: "./main.ts",
    output: {
      file: "./dist/main.js",
      format: "cjs",
      exports: "auto",
      banner: "#!/usr/bin/env node",
    },
    plugins: [
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
    ],
    external: [
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
    ],
  },
]);
