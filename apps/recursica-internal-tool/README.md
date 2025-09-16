# Recursica Internal Tool

A Figma plugin for internal Recursica team operations, providing tools for theme management, page operations, and metadata handling.

## Features

- **Theme Settings**: Configure file type and theme name for your Figma projects
- **Page Management**: Export, import, and manage Figma pages
- **Reset Metadata**: Clear plugin metadata from collections
- **Auto-Updater**: Cross-platform update scripts for easy deployment

## Theme Settings

The theme settings feature allows you to:

- Set the file type for your project (themes, ui-kit, tokens, icons, other)
- Configure theme names for theme-based projects
- Store settings in Figma variable collections for persistence

## Update Scripts

Cross-platform update scripts are available in the `scripts/updater/` directory:

- Windows: `update-dist.bat` or `update-dist.ps1`
- macOS/Linux: `update-dist.sh` or `update-dist`
- Universal: `update-dist` (auto-detects platform)

See `scripts/updater/UPDATE-README.md` for detailed usage instructions.

## Development

Built with React + TypeScript + Vite for optimal development experience.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
