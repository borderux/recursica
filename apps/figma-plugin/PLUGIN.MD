# How to use the plugin

## Requirements

- Have [Figma Desktop](https://www.figma.com/downloads/) installed
- Have Edit Access in the Figma file you want to export the local variables from
- Any unzipping tool (most of the OS have one built-in)

## Download the plugin

1. Go to the [releases](/releases/) page and download the latest version of the plugin.
2. Once downloaded, move the file to the `Documents` folder.
3. Unzip the file in the `Documents` folder.
   1. In case you are using MacOS, double click on the file to extract it.
   2. In case you are using Windows, right click on the file and select `Extract All`.
   3. In case you are using Linux, you can use the `unzip` command in the terminal.
      ```bash
      apt-get install unzip
      unzip recursica-plugin.zip
      ```
   4. If none of the above works, you can use a third-party tool like `7-Zip`, `WinRAR`, `The Unarchiver`, or any other tool you prefer.

## Install the plugin

The plugin is currently only available for local testing, to be able to run in locally follow the next steps:

1. Open Figma Desktop (see [requirements](#requirements) to download it)
2. If you don't have a Figma file open, create a new one or open an existing one, remember that the file should be named correctly (see [Naming conventions](#naming-conventions))

   - Legacy mode

   1. Right click on any part of the canvas, this will open a context menu
   2. Click on `Plugins` -> `Development` -> `Import plugin from manifest`
   3. This will prompt a file picker, go to the `Documents\recursica-plugin` and select the `manifest.json` file.

   - New mode

   1. Locate the `Actions` button in the bottom toolbar (the last icon), click on it. `Ctr + K` (Windows ) or `Cmd + K` (MacOS) is the shortcut.
   2. Click on `Plugins and widgets` -> `Development` -> `Import plugin from manifest`
   3. This will prompt a file picker, go to the `Documents\recursica-plugin` and select the `manifest.json` file.

3. If you don't see any error message, the plugin was successfully installed.

## Run the plugin

1. Before running the plugin, make sure you have a Figma file open with local variables, also make sure your Figma file is named correctly (see [Naming conventions](#naming-conventions))
2. Now that the plugin is installed, you can run it by:
   1. Going to `Actions` (in the bottom toolbar, the last icon) -> `Plugins and widgets` `recursica-plugin`
   2. Right-clicking on any part of the canvas and selecting `Plugins` -> `Development` -> `recursica-plugin`
   3. Or by using the keyboard shortcut `Ctrl + K` (Windows) or `Cmd + K` (MacOS) -> `Plugins and widgets` -> `recursica-plugin`
   4. **(For Mac)** In the App Menus -> `Plugins` -> `Development` -> `recursica-plugin`

# Naming conventions

The plugin will only work if the Figma file is named correctly, the name should be in the following format:

## Valid names for tokens file

- theme
- theme + tokens
- tokens

## Valid names for design system file

- ui kit
- ui-kit
