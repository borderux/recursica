# Recursica Publisher

A Figma plugin for publishing and importing Figma pages and components to/from GitHub repositories. Recursica Publisher enables version-controlled component management, allowing designers to export components with full fidelity and import them back into Figma with automatic dependency resolution.

## Overview

Recursica Publisher bridges the gap between Figma design work and version control. It allows you to:

- **Publish** Figma components to GitHub with versioning and automated pull request creation
- **Import** previously exported components from GitHub back into Figma
- Manage component dependencies automatically
- Handle variable collections and design tokens
- Track component versions and revision history

## Features

### Publish to GitHub

- Export Figma pages/components with full structure preservation
- Automatic version management and incrementing
- Create GitHub branches and pull requests automatically
- Support for component dependencies (export referenced components)
- Revision history tracking with change messages
- GitHub OAuth authentication for secure repository access

### Import from GitHub

- Import components from GitHub repositories
- Multi-stage import pipeline with intelligent matching
- Automatic dependency resolution for component instances
- Variable collection matching (by GUID or name)
- Deferred instance resolution for circular dependencies
- Import wizard for handling conflicts and user decisions

### Component Management

- Full fidelity export/import (preserves all node properties, styles, and relationships)
- Component instance deduplication for efficient storage
- Variable collection handling with mode mapping
- Support for component sets and variants
- Remote component handling (Team Library icons)

### Developer Experience

- TypeScript support throughout
- Debug console for troubleshooting
- Cancellation support for long-running operations
- Comprehensive error handling and validation

## Installation

### For Users

1. Install the plugin from the Figma Community or via the Recursica team
2. Open a Figma file
3. Run the plugin from the Plugins menu
4. Authenticate with GitHub when prompted

### For Developers

```bash
# Install dependencies
npm install

# Development mode (watches for changes)
npm run dev

# Build for production
npm run build

# Create plugin zip file
npm run zip
```

## Usage

### Publishing a Component

1. Open the component page in Figma
2. Run the Recursica Publisher plugin
3. Click "Publish" from the home screen
4. Review component metadata and version
5. Enter a change message describing your updates
6. Select which referenced components to publish (if any)
7. The plugin will:
   - Export the component(s) to JSON
   - Create a GitHub branch
   - Commit files to the branch
   - Create a pull request

### Importing a Component

1. Run the Recursica Publisher plugin
2. Click "Import" from the home screen
3. Choose import source:
   - **From Files**: Select exported JSON files
   - **From Repository**: Browse and select from GitHub repository
4. Follow the import wizard to:
   - Resolve variable collection conflicts
   - Handle component dependencies
   - Review import summary
5. Complete the import process

## Architecture

For detailed information about the plugin's architecture, design patterns, and technical implementation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development

### Project Structure

```
apps/recursica-publisher/
├── src/
│   ├── App.tsx                 # Main React application
│   ├── pages/                  # UI pages (Home, Publish, Import, etc.)
│   ├── components/             # Reusable UI components
│   ├── context/                # React context providers
│   ├── services/               # UI services (GitHub, repository)
│   └── plugin/                 # Plugin sandbox code
│       ├── main.ts             # Message router
│       ├── services/           # Business logic services
│       ├── parsers/            # Type-specific node parsers
│       └── types/              # TypeScript definitions
├── manifest.json               # Figma plugin manifest
└── package.json
```

### Key Technologies

- **React 19** with TypeScript
- **React Router** for navigation
- **Mantine** for UI components
- **Vite** for building
- **Figma Plugin API** for Figma integration
- **GitHub API** for repository operations

### Building

The project uses two build configurations:

- **UI Build**: React application bundled for plugin UI (`vite.config.ts`)
- **Plugin Build**: Plugin sandbox code (`vite.config.lib.ts`)

Both are built concurrently during development and production builds.

### Scripts

- `npm run dev` - Start development mode (watches both UI and plugin)
- `npm run build` - Build for production
- `npm run zip` - Build and create plugin zip file
- `npm run lint` - Run ESLint

## Configuration

The plugin connects to the Recursica GitHub repository (`borderux/recursica-figma`) by default. Authentication is handled via GitHub OAuth tokens stored securely in the plugin.

## Troubleshooting

### Import/Export Issues

- Check the debug console (available in the plugin UI) for detailed error messages
- Ensure you have proper GitHub authentication and repository access
- Verify that exported JSON files are valid and complete
- Check that variable collections exist and are accessible

### Authentication Issues

- Ensure you have a valid GitHub personal access token
- Verify the token has appropriate repository permissions (read/write)
- Check that you have access to the target repository

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [PLAN.md](./PLAN.md) - Export format version history and design decisions
- [IMPORT_SUMMARY.md](./IMPORT_SUMMARY.md) - Import pipeline details
- [src/plugin/README.md](./src/plugin/README.md) - Plugin architecture overview

## License

Part of the Recursica project. See the main project LICENSE file for details.
