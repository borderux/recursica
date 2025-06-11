# Recursica JSON exporter for Figma

This is a simple plugin for Figma that exports all the local variables in a Figma file to a JSON file. This is useful for exporting design tokens to be used in code.

## Metadata collection

To be able to run the plugin you will need to create a variable collection in your figma file, to specify the name of the project (eg. cymbiotika) and the project type (the current accepted values are: `ui-kit | theme + tokens | icons`).  
Here's an example of the expected variable collection.

**ID variables**
| name | value |
| ------------ | ---------- |
| project-id | cymbiotika |
| project-type | ui-kit |

> [!Important]
> The name of the collection must be `ID variables`

## Development

To develop this plugin, you need to have Node.js and PNPM installed. Then, you can run the following commands:

[node]: https://nodejs.org/
[pnpm]: https://pnpm.io/

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm watch
```

This will start a development server that will watch for changes in the `src` directory and automatically build the plugin for Figma.

### Debug the plugin in Figma

To install the plugin locally read this [guide](/PLUGIN.MD/).

## Publishing

To distribute the plugin internally all you need to do is run the following command:

```bash
pnpm version vX.X.X
```

This will update the version in the `package.json` file and create a new version tag in the repository. By doing this, a zip file will be created in the `releases` directory with the plugin files. The releases directory only includes the latest version of the plugin, so make sure to keep the version updated.
Note that the plugin is not published to the Figma community, it is only available for internal use.

## Structure

The plugin is using [React](https://reactjs.org/) for the UI and [TypeScript](https://www.typescriptlang.org/) for the logic.

To modify the UI, you can edit the file located at `src/App.tsx` directory. To modify the logic, you can edit the files in the `src/plugin` directory.

More details at [Figma Plugin API](https://www.figma.com/plugin-docs/intro/).
