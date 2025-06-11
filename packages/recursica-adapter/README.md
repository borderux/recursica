# Recursica

This is the Recursica design system. More details can be found at [Recursica](https://recursica.com/).

## What is Recursica

### Variable parser

Recursica parses the variables from the JSON files exported by the design system.
All your files can be at the root of the project, or if you prefer, you can put them in a folder. You just need to specify the path to the files in the `recursica.json` file.

### Icon parser

Recursica parses `recursica-icons.json` file to get the icons names and their respective paths.
The output will be at `src/components/Icons/`

- `svg` folder with the svg icon files
- `icon_exports.ts` parses the svg files and exports them as React components
- `icon_resource_map.ts` maps the icon names to the React components
- `Icon.tsx` is the main component that renders the icon

The `svg` folder, `icon_exports.ts` and `icon_resource_map.ts` are auto-generated. You don't need to do anything with them.
For the `Icon.tsx` file, you can customize the `Icon` component to your needs, here's the default implementation:

```tsx
import type { RecursicaColors } from "../../recursica/RecursicaColorsType";
import { IconResourceMap } from "./icon_resource_map";
import { recursica } from "../../recursica/Recursica";
const DEFAULT_SIZE = 24;

export type IconImport = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

export type IconName = keyof typeof IconResourceMap;
export const IconNames = Object.keys(IconResourceMap);

export interface IconProps {
  name: IconName;
  /** Icon size @default 24 */
  size?: 16 | 20 | 24 | 32 | 40 | 48 | "100%";
  /** The title to apply to the icon.  If not set, it inherits from the parent */
  title?: string;
  /** The color to apply to the icon.  If not set, it inherits from the parent */
  color?: RecursicaColors;
}

export const Icon = (props: IconProps) => {
  const SvgComponent = IconResourceMap[props.name];
  const colorStyles = {
    fill: props.color ? recursica[props.color] : "currentColor",
    color: props.color ? recursica[props.color] : "currentColor",
  };
  return (
    <SvgComponent
      width={props.size ?? DEFAULT_SIZE}
      height={props.size ?? DEFAULT_SIZE}
      title={props.title}
      style={props.color ? colorStyles : undefined}
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
    />
  );
};
```

### Theme generator

Recursica generates a vanilla extract theme based on the variables. Then creates a mantine theme from the vanilla extract theme.
Here's a list of the generated files:

- `RecursicaCymbiotikaTokens.ts` contains the basic tokens for the theme
- `RecursicaCymbiotikaContractTheme.css` contains the contract theme for the vanilla extract theme, these variables will switch automatically based on the selected theme
- `RecursicaColorsType.ts` exposes all the colors available coming from the design system
- `Recursica.ts` is the main file that exports the theme available variables.
- `RecursicaCymbiotikaMantineTheme.ts` is the mantine theme generated from the vanilla extract theme
- `RecursicaCymbiotikaThemes.css.ts` contains all the themes available, also exposes a `Themes` object that can be used to switch between themes

## How to use

Create a recursica.json file in the root of the project.

```
{
  "$schema": "./recursica/schemas/config-schema.json",
  "project": "Cymbiotika"
}
```

[!NOTE]
The `project` field must match the name of the project in the JSON files.

Modify your package.json to include the recursica command.

```
"scripts": {
  "recursica": "tsx recursica/main.ts"
}
```

Run the recursica command.

```
npm run recursica
```

## How to change the adapter

The adapter is the script that converts the JSON files into a theme.  
The current adapter is the Mantine adapter.  
To change the adapter, you need to go to the [adapter folder](recursica/adapter) and modify the adapter to your needs.  
In case you wanna create a new adapter you must export a function named `generateThemeFile` that will receive the following parameters:

```
interface GenerateThemeFileParams {
  srcPath: string;
  baseTokens: ThemeTokens;
  themes: Themes;
  project: string;
}
```
