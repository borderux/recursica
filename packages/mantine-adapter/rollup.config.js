import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";
import svgr from "vite-plugin-svgr";
import postcss from "rollup-plugin-postcss";
import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "@mantine/core",
  "@mantine/dates",
  "@mantine/hooks",
  "tabbable",
  "@floating-ui",
  "@vanilla-extract/css",
];

const plugins = [
  resolve({
    preferBuiltins: false,
    browser: true,
  }),
  commonjs(),
  json(),
  vanillaExtractPlugin({
    identifiers: ({ debugId, hash }) => {
      if (!debugId) {
        return `recursica-${hash}`;
      }
      return `recursica-${debugId?.replaceAll("/", "-")}`;
    },
  }),
  postcss({
    extract: true,
    minimize: true,
    inject: false,
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    use: {
      sass: {},
    },
  }),
  svgr(),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: [
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
    ],
  }),
  typescript({
    tsconfig: "./tsconfig.json",
    sourceMap: true,
    inlineSources: true,
    declaration: false, // We'll generate .d.ts files separately
    noEmit: false,
    exclude: ["**/*.d.ts", "**/*.stories.*", "**/*.test.*"],
  }),
];

export default defineConfig([
  // ESM build
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/mantine-adapter.js",
      format: "es",
      sourcemap: true,
      exports: "auto",
    },
    plugins,
    external,
  },
  // CommonJS build
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/mantine-adapter.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
    plugins,
    external,
  },
  // CSS build - extract CSS from TypeScript imports
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/mantine-adapter.css",
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      svgr(),
      postcss({
        extract: true,
        minimize: true,
        inject: false,
        modules: {
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
        use: {
          sass: {},
        },
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: false,
        inlineSources: false,
        declaration: false,
        noEmit: false,
        exclude: ["**/*.d.ts", "**/*.stories.*", "**/*.test.*"],
      }),
    ],
    external: [
      "react",
      "react-dom",
      "@mantine/core",
      "@mantine/dates",
      "@mantine/hooks",
    ],
  },
  // TypeScript declarations
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.d.ts",
      format: "es",
    },
    plugins: [
      dts({
        tsconfig: "./tsconfig.json",
      }),
      svgr(),
    ],
    external,
  },
]);
