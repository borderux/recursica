# Recursica Internal Tool - Update Scripts (Cross-Platform)

This folder contains scripts to automatically update the internal tool files from the GitHub repository. These scripts work on **Windows**, **macOS**, and **Linux**.

## Available Scripts

### `update-dist.bat` (Windows Batch File)

- **Platform**: Windows (including WSL detection)
- **Usage**: Double-click the file or run from command prompt
- **What it does**: Downloads the latest `recursica-internal-tool.js`, `index.html`, and `vite.svg` files from the GitHub repository and places them in the `dist` folder
- **Requirements**: PowerShell (preferred) or curl

### `update-dist.ps1` (PowerShell Script)

- **Platform**: Windows
- **Usage**: Run with PowerShell or let the batch file call it automatically
- **What it does**: Same as the batch file but with better error handling and colored output
- **Requirements**: PowerShell 5.0 or later

### `update-dist.sh` (Shell Script)

- **Platform**: macOS and Linux
- **Usage**: Run from terminal: `./update-dist.sh` or `bash update-dist.sh`
- **What it does**: Downloads files using curl or wget
- **Requirements**: curl or wget

### `update-dist` (Universal Script)

- **Platform**: All platforms (macOS, Linux, Windows with WSL)
- **Usage**: Run from terminal: `./update-dist` or `bash update-dist`
- **What it does**: Automatically detects OS and uses the best available method
- **Requirements**: curl or wget

## How to Use

### Windows Users

1. **Double-click method**: Simply double-click `update-dist.bat`
2. **Command line method**: Open a command prompt and run:
   ```cmd
   update-dist.bat
   ```

### macOS Users

1. **Terminal method**: Open Terminal and run:
   ```bash
   ./update-dist.sh
   # or
   ./update-dist
   ```
2. **Make executable** (if needed):
   ```bash
   chmod +x update-dist.sh
   chmod +x update-dist
   ```

### Linux Users

1. **Terminal method**: Open terminal and run:
   ```bash
   ./update-dist.sh
   # or
   ./update-dist
   ```
2. **Make executable** (if needed):
   ```bash
   chmod +x update-dist.sh
   chmod +x update-dist
   ```

## What the Scripts Do

All scripts automatically:

- Create a `dist` folder if it doesn't exist
- Download the latest files from https://github.com/borderux/recursica/tree/main/apps/recursica-internal-tool/dist
- Replace any existing files in the `dist` folder

## What Files Are Updated

The scripts download and update these files in the `dist` folder:

- `recursica-internal-tool.js` - The main plugin JavaScript file
- `index.html` - The plugin's HTML interface
- `vite.svg` - The Vite logo asset

## Cross-Platform Compatibility

| Platform | Primary Script    | Fallback            | Requirements       |
| -------- | ----------------- | ------------------- | ------------------ |
| Windows  | `update-dist.bat` | PowerShell → curl   | PowerShell or curl |
| macOS    | `update-dist.sh`  | curl → wget         | curl or wget       |
| Linux    | `update-dist.sh`  | curl → wget         | curl or wget       |
| WSL      | `update-dist`     | Universal detection | curl or wget       |

## Troubleshooting

### Windows

- **PowerShell execution policy error**: The batch file automatically bypasses execution policy restrictions
- **Network issues**: Make sure you have an internet connection to access GitHub
- **Permission errors**: Run the script as administrator if you encounter permission issues

### macOS/Linux

- **Permission denied**: Make the script executable with `chmod +x update-dist.sh`
- **curl/wget not found**: Install with your package manager:
  - macOS: `brew install curl`
  - Ubuntu/Debian: `sudo apt-get install curl`
  - CentOS/RHEL: `sudo yum install curl`

### General

- **Network issues**: Make sure you have an internet connection to access GitHub
- **GitHub rate limiting**: If you hit rate limits, wait a few minutes and try again

## Source Repository

Files are downloaded from: https://github.com/borderux/recursica/tree/main/apps/recursica-internal-tool/dist
