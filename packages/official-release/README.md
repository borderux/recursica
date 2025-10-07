# @recursica/official-release

Official Recursica design system release package containing the complete bundle, JavaScript API, and TypeScript definitions.

## Installation

```bash
npm install @recursica/official-release
```

## Usage

### JavaScript/TypeScript

```typescript
import { recursica } from "@recursica/official-release";

// Use design tokens
const styles = {
  backgroundColor: recursica.tokens["color/primary/500"],
  padding: recursica.uiKit["button/size/padding"],
  color: recursica.themes.light["text/primary"],
};
```

### Bundle Data

```typescript
import bundleData from "@recursica/official-release/recursica-bundle.json";

// Access raw bundle data
console.log(bundleData.tokens);
console.log(bundleData.uiKit);
console.log(bundleData.themes);
```

## Contents

This package includes:

- **`recursica.js`** - Main JavaScript API with type-safe access to design tokens
- **`recursica.d.ts`** - TypeScript definitions for full type safety
- **`recursica-bundle.json`** - Complete design system bundle with all tokens, UI Kit variables, and themes

## Features

- 🎨 Complete design token system
- 🧩 UI Kit component variables
- 🌓 Light and dark theme support
- 📱 Responsive design tokens
- 🔧 TypeScript support
- 📦 Zero dependencies

## Documentation

For complete documentation, visit [recursica.com](https://recursica.com)

## License

MIT © [BorderUX](https://borderux.com)
