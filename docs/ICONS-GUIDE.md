# Icons Guide

## Overview

Recursica provides a comprehensive icon system that allows you to export only the icons you need from Figma to your codebase. This selective export approach prevents unnecessary files from being created and keeps your project clean and efficient.

## How Icon Export Works

### Selective Export Process

The Recursica plugin does **not** automatically export all icons to the codebase. Instead, it uses a selective export process:

1. **Configure Icons**: Specify which icons you need in your `recursica.json` configuration
2. **Run Plugin**: When you run the Figma plugin, it exports only the specified icons
3. **Use in Code**: Import and use the exported icons with the Icon component

### Why Selective Export?

- **Performance**: Only export icons that are actually used in your project
- **Bundle Size**: Prevents bloating your codebase with unused icon files
- **Maintenance**: Easier to manage a smaller set of icon files
- **Customization**: Choose specific icon variants (outline, filled, duotone) as needed

## Configuration

### Setting Up Icon Export

Configure icon export in your `recursica.json` file:

```json
{
  "icons": {
    "output": "src/components/Icons",
    "include": {
      "names": ["home", "user", "settings", "search", "menu"],
      "variants": ["outline", "filled"]
    }
  }
}
```

### Configuration Options

- **`output`**: Directory where SVG icon files will be exported
- **`names`**: Array of icon names to export (must match Figma icon names)
- **`variants`**: Array of icon variants to export (outline, filled, duotone, etc.)

### Finding Icon Names

To find the correct icon names in Figma:

1. **Open Your Figma File**: Navigate to the page containing your icons
2. **Select an Icon**: Click on the icon you want to export
3. **Check the Name**: Look at the layer name in the layers panel
4. **Note the Variant**: Check if the icon has variants (outline, filled, etc.)

## Export Process

### Step 1: Update Configuration

1. **Edit `recursica.json`**: Add or modify the `icons` section
2. **Specify Icons**: List the icon names and variants you need
3. **Set Output Path**: Choose where to export the SVG files

### Step 2: Run the Plugin

1. **Open Figma**: Navigate to your icons file
2. **Run Recursica Plugin**: Execute the plugin to export icons
3. **Check Output**: Verify that SVG files are created in the specified directory

### Step 3: Use in Code

```tsx
import { Icon } from "@recursica/ui-kit-mantine";

// Use the exported icon
<Icon name="home" size="md" variant="outline" />
<Icon name="user" size="lg" variant="filled" />
```
