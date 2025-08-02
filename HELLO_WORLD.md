# Hello World! Welcome to Recursica 👋

## What is Recursica?

Recursica is a powerful bridge between design and development that transforms design decisions into production-ready code. Think of it as an automated translator that speaks both "designer" and "developer" fluently!

### The Problem We Solve

Ever experienced these frustrations?
- 😤 **Designers**: "Why doesn't the website look exactly like my Figma design?"
- 😩 **Developers**: "I have to manually update 50 color values because the brand colors changed?"
- 🤯 **Teams**: "Our app uses 7 different shades of blue when we only defined 3!"

Recursica eliminates these pain points by creating a single source of truth for your design system.

## How It Works (In Plain English)

Imagine you're building a house:
1. **Architect** (Designer) creates blueprints in Figma
2. **Translator** (Recursica) converts blueprints to construction plans
3. **Builder** (Developer) uses the plans to build exactly what was designed

Here's the actual workflow:

```
Figma Design → Recursica Plugin → JSON Tokens → Recursica Adapter → Ready-to-Use Code
```

## Real-World Example

Let's say your designer creates a new color palette in Figma:

### Step 1: Designer Creates in Figma
```
Primary Blue: #0066CC
Secondary Green: #00AA44
Error Red: #DD0000
```

### Step 2: Export with Recursica Plugin
The designer clicks "Export" in the Recursica Figma plugin, generating a JSON file.

### Step 3: Run Recursica Adapter
```bash
npx @recursica/mantine-adapter
```

### Step 4: Use in Your Code
```jsx
// The colors are now available in your React app!
<Button color="primary-500">Click me!</Button>
<Alert color="error-600">Something went wrong!</Alert>
```

**Magic!** 🪄 When the designer updates the blue color in Figma, developers just re-run the adapter, and the entire app updates automatically!

## Quick Start

### For Designers 🎨

1. **Install the Recursica Figma Plugin**
   - Open your Figma file
   - Go to Plugins → Browse plugins in Community
   - Search for "Recursica" (Note: Currently internal only)

2. **Set Up Your Design Tokens**
   - Create color variables
   - Define typography styles
   - Set spacing values
   - Add any custom tokens

3. **Export Your Tokens**
   - Run the Recursica plugin
   - Click "Export to JSON"
   - Share the file with your development team

### For Developers 💻

1. **Install Recursica**
   ```bash
   npm install @recursica/mantine-adapter
   ```

2. **Configure Your Project**
   Create a `recursica.json` file:
   ```json
   {
     "project": "YourProjectName",
     "bundledJson": "./design-tokens.json",
     "srcPath": "./src"
   }
   ```

3. **Generate Your Theme**
   ```bash
   npx @recursica/mantine-adapter
   ```

4. **Use Your Design System**
   ```jsx
   import { ThemeProvider } from './recursica/ThemeProvider';
   import { Button } from './components/Button';

   function App() {
     return (
       <ThemeProvider>
         <Button>Perfectly styled!</Button>
       </ThemeProvider>
     );
   }
   ```

## What You Get

Running Recursica generates:
- ✅ **Type-safe theme objects** - No more guessing color names!
- ✅ **React components** - Pre-styled with your design system
- ✅ **Icon libraries** - All your Figma icons as React components
- ✅ **CSS-in-JS themes** - Modern styling with Vanilla Extract
- ✅ **TypeScript definitions** - Full IntelliSense support

## Key Benefits

### For Designers
- 🎯 Your designs are implemented pixel-perfect
- 🔄 Changes propagate instantly to code
- 📐 Maintain complete control over the design system

### For Developers
- ⚡ No manual token management
- 🛡️ Type-safe design tokens
- 🚀 Faster development with pre-built components
- 🔧 Easy theme switching (light/dark modes)

### For Teams
- 🤝 Single source of truth
- 📉 Fewer bugs from design inconsistencies
- 💰 Save hours of manual updates
- 📚 Self-documenting design system

## Common Use Cases

1. **Brand Refresh**: Update all colors across your entire application in minutes
2. **Multi-Brand Apps**: Switch between different brand themes dynamically
3. **Dark Mode**: Implement with proper design tokens, not CSS hacks
4. **Design System Documentation**: Auto-generate docs from your Figma files
5. **Component Libraries**: Build consistent, reusable components

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Figma     │ --> │  Recursica   │ --> │    Your      │
│  Designs    │     │   Plugin     │     │    Code      │
└─────────────┘     └──────────────┘     └──────────────┘
       ↓                    ↓                     ↑
  Design Tokens        JSON File          Theme Files
                                         Components
                                         Type Definitions
```

## Getting Help

- 📖 **Detailed Documentation**: See our [README.md](./README.md)
- 🔌 **Figma Plugin Guide**: Check [PLUGIN.MD](./apps/figma-plugin/PLUGIN.MD)
- 📦 **Mantine Adapter**: Read [packages/mantine-adapter/README.md](./packages/mantine-adapter/README.md)
- 🐛 **Issues**: Report on [GitHub](https://github.com/borderux/recursica/issues)

## Why "Recursica"?

The name combines "Recursive" (representing the iterative design-to-code cycle) with a feminine ending, symbolizing the creative and generative nature of design systems. Just as recursive functions build upon themselves, Recursica helps your design system grow and evolve systematically.

---

**Ready to bridge the gap between design and code?** Start with Recursica today and experience the magic of automated design tokens! ✨

*P.S. - Hello, World! Now you know what Recursica is all about. Welcome to a world where designers and developers work in perfect harmony!* 🎉