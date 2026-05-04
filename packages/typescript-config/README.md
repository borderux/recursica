# @repo/typescript-config

Shared TypeScript configurations for the Recursica monorepo.

## Available Configs

| Config               | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `base.json`          | Base TypeScript configuration extended by all packages |
| `react-library.json` | Preset for React library packages (JSX, DOM types)     |
| `nextjs.json`        | Preset for Next.js applications                        |

## Usage

Extend one of the configs in your package's `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

For React libraries:

```json
{
  "extends": "@repo/typescript-config/react-library.json"
}
```

## License

MIT
