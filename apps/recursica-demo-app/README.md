# Recursica Demo App

This is a demo React application that showcases the `@recursica/ui-kit-test` package with real `recursica.js` data.

## Architecture

This app demonstrates the proper separation of concerns:

- **ui-kit-test package**: Contains reusable UI components that expect recursica data to be provided externally
- **recursica-demo-app**: Provides the actual `recursica.js` data and consumes the ui-kit-test components

## Features

- ✅ Uses real `recursica.js` data from the design system
- ✅ Demonstrates the factory pattern for global design system management
- ✅ Shows Button components with salmon/600 background color
- ✅ Interactive examples with click counting
- ✅ Design token information display
- ✅ Factory system status monitoring

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How It Works

1. **Design Tokens**: The app loads `recursica-tokens.css` which contains all the CSS custom properties
2. **JavaScript Data**: The app imports `recursica.js` which contains the design token values
3. **Factory Initialization**: The ui-kit-test package is initialized with the real recursica data
4. **Component Usage**: Button components use the design tokens for styling

## File Structure

```
recursica-demo-app/
├── public/
│   ├── recursica.js           # Design system data
│   └── recursica-tokens.css   # CSS custom properties
├── src/
│   ├── App.tsx               # Main app component
│   ├── App.css               # App styles using design tokens
│   └── main.tsx              # App entry point
└── package.json              # Dependencies including ui-kit-test
```

## Key Concepts

### Factory Pattern

The ui-kit-test package uses a factory pattern to manage the design system globally:

```tsx
import { setRecursica, getRecursica } from "@recursica/ui-kit-test";
import recursicaData from "./recursica.js";

// Set recursica data globally
setRecursica(recursicaData);

// Access tokens anywhere
const color = getRecursica().tokens["color/salmon/600"];
```

### Design Token Integration

Components automatically use the design tokens:

```tsx
<Button onClick={handleClick}>Click me!</Button>
```

The Button component uses CSS custom properties that are defined in `recursica-tokens.css` and can be overridden at runtime.

## Testing

Open the app in your browser and:

1. **Visual Test**: Verify buttons have salmon/600 background color
2. **Interactive Test**: Click buttons to see hover effects and click counting
3. **Console Test**: Check browser console for factory initialization messages
4. **Token Test**: Verify design token values are displayed correctly

## Development

This app serves as a reference implementation for how to properly integrate the ui-kit-test package into a real application. The key is providing the recursica data externally rather than bundling it with the UI components.
