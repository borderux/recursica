# Installing `@recursica/mui-adapter`

Follow these instructions to install and configure the MUI Adapter in your host project.

## 1. Install Dependencies

First, install the Recursica MUI Adapter package:

```bash
npm install @recursica/mui-adapter
```

### Peer Dependencies

This library requires the following peer dependencies. Ensure they are installed in your project:

```bash
npm install @mui/core@>=7.0.0 @mui/dates@>=7.0.0 @mui/hooks@>=7.0.0 react@>=16.8.0 react-dom@>=16.8.0
```

---

## 2. Setup and Integration

Before consuming Recursica components, integrate the design tokens into your application:

1. **Export Theme Files**: Export theme files from [Forge Recursica](https://forge.recursica.com) into your repository to generate `recursica_variables_scoped.css` and its associated JSON files.
2. **Integrate CSS**: Import `recursica_variables_scoped.css` into your application entrypoint (e.g., `main.tsx` or `App.tsx`).

   ```tsx
   import "./path/to/recursica_variables_scoped.css"; // Recursica theme variables
   ```

3. **Integrate Google Fonts**: Ensure standard Recursica Google Fonts are integrated into your project:

   ```css
   @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
   ```
