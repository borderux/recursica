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
npm install @mui/material@>=7.0.0 @emotion/react@>=11.14.0 @emotion/styled@>=11.14.0 react@>=16.8.0 react-dom@>=16.8.0
```

---

## 2. Setup and Integration

Before consuming Recursica components, integrate the CSS and design tokens into your application:

1. **Integrate CSS**: Import `recursica_variables_scoped.css` and the MUI adapter CSS `style.css` into your application entrypoint (e.g., `main.tsx` or `App.tsx`).

   ```tsx
   import "./path/to/recursica_variables_scoped.css"; // Recursica theme variables
   import "@recursica/mui-adapter/style.css"; // MUI adapter styles
   ```

2. **Configure MUI's CSS Injection & Theme Provider**: Because the Recursica UI components use native CSS modules, they must be given a higher priority than MUI's default engine styles. You **must** wrap your application root in `<StyledEngineProvider injectFirst>` and `<RecursicaThemeProvider theme="light">` to correctly cascade design token properties. By default `RecursicaThemeProvider` also wraps its children in a `<Layer layer={0}>` (via the `initLayer0` prop, which defaults to `true`), so the base page surface/border/elevation variables resolve automatically with no extra setup:

   ```tsx
   import { StyledEngineProvider } from "@mui/material/styles";
   import { RecursicaThemeProvider } from "@recursica/mui-adapter";

   function App() {
     return (
       <StyledEngineProvider injectFirst>
         <RecursicaThemeProvider theme="light">
           {/* Your App Components */}
         </RecursicaThemeProvider>
       </StyledEngineProvider>
     );
   }
   ```

3. **Integrate Google Fonts**: Integrating custom fonts depends on how you load fonts in your project and which fonts are specified in your `recursica_variables_scoped.css` (since it is project-dependent). We suggest loading them via Google Fonts, as shown in this example:

   ```css
   @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
   ```

4. **Configure PostCSS Plugin (Optional but Recommended)**: It is highly recommended (but optional) to install the `@recursica/recursica-postcss-vars` plugin to verify that Recursica CSS variables are properly connected in case they change.

   Install the plugin as a dev dependency:

   ```bash
   npm install @recursica/recursica-postcss-vars --save-dev
   ```

   Then, configure it in your `postcss.config.js`:

   ```javascript
   export default {
     plugins: {
       "@recursica/recursica-postcss-vars": {
         cssPath: "./path/to/recursica_variables_scoped.css",
         strict: process.env.NODE_ENV === "production",
       },
     },
   };
   ```

5. **Configure ESLint Plugin (Optional but Recommended)**: It is highly recommended (but optional) to install `eslint-plugin-recursica`, which flags use of the `overStyled` escape-hatch prop so it stays easy to audit.

   Install the plugin as a dev dependency:

   ```bash
   npm install eslint-plugin-recursica --save-dev
   ```

   Then, add it to your `eslint.config.js`:

   ```javascript
   import recursica from "eslint-plugin-recursica";

   export default [recursica.configs.recommended];
   ```
