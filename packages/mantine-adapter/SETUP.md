# Installing `@recursica/mantine-adapter`

Follow these instructions to install and configure the Mantine Adapter in your host project.

## 1. Install Dependencies

First, install the Recursica Mantine Adapter package:

```bash
npm install @recursica/mantine-adapter
```

### Peer Dependencies

This library requires the following peer dependencies. Ensure they are installed in your project:

```bash
npm install @mantine/core@>=8.0.0 @mantine/dates@>=8.0.0 @mantine/hooks@>=8.0.0 react@>=16.8.0 react-dom@>=16.8.0
```

---

## 2. Setup and Integration

Before consuming Recursica components, integrate the CSS and design tokens into your application:

1. **Export Theme Files**: Export theme files from [Forge Recursica](https://forge.recursica.com) into your repository to generate `recursica_variables_scoped.css` and its associated JSON files. Its suggested to put it in the root of your project.
2. **Integrate CSS**: Import `recursica_variables_scoped.css` and the Mantine adapter CSS `mantine-adapter.css` into your application entrypoint (e.g., `main.tsx` or `App.tsx`). **It must be loaded after the Mantine CSS imports.**

   ```tsx
   import "@mantine/core/styles.css"; // Mantine core styles
   import "./path/to/recursica_variables_scoped.css"; // Recursica theme variables
   import "@recursica/mantine-adapter/style.css"; // Mantine adapter styles
   ```

3. **Integrate Google Fonts**: Integrating custom fonts depends on how you load fonts in your project and which fonts are specified in your `recursica_variables_scoped.css` (since it is project-dependent). We suggest loading them via Google Fonts, as shown in this example:

   ```css
   @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
   ```

4. **Wrap App in RecursicaThemeProvider**: You must wrap your application in the `<RecursicaThemeProvider>` to correctly cascade design token properties:

   ```tsx
   import { MantineProvider } from "@mantine/core";
   import { RecursicaThemeProvider } from "@recursica/mantine-adapter";

   function App() {
     return (
       <MantineProvider>
         <RecursicaThemeProvider theme="light">
           {/* Your App Components */}
         </RecursicaThemeProvider>
       </MantineProvider>
     );
   }
   ```

5. **Configure PostCSS Plugin (Optional but Recommended)**: It is highly recommended (but optional) to install the `@recursica/recursica-postcss-vars` plugin to verify that Recursica CSS variables are properly connected in case they change.

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
