# Recursica Figma Plugin

This is a simple plugin for Figma that exports all the local variables in the Recursica design system files to Json in a repository, as well as supporting CSS and project files.

## Development

To develop this plugin, you need to have Node.js and npm installed. Then, you can run the following commands:
[node]: https://nodejs.org/

```bash
# Install dependencies
npm install

# Start the development system and watch
npm run dev
```

This will start file watch that will watch for changes in the `src` directory and automatically build the plugin for Figma.

## Build System

The plugin supports three distinct build types for different use cases:

### 🚀 **Local Development** (`npm run dev`)

- **Purpose**: Local development and debugging
- **Manifest**: `manifest..development.json` (points to `dist-test/`)
- **Output**: `dist-test/` directory
- **Features**: Hot reload, file watching

### 🧪 **Test Build** (`npm run build:test`)

- **Purpose**: Creating test releases for internal testing
- **Manifest**: `manifest.test.json` (points to `dist/`)
- **Output**: `dist/` directory
- **Usage**: `npm run build:test` to create test release package

### 🏭 **Production Build** (`npm run build`)

- **Purpose**: Production releases
- **Manifest**: `manifest.production.json` (points to `dist/`)
- **Output**: `dist/` directory
- **Usage**: `npm run build` to create production release package

### 📋 **Available Scripts**

| Script                    | Purpose                   | Description                                                 |
| ------------------------- | ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | **Local development**     | Runs both UI and plugin code in watch mode                  |
| `npm run dev:ui`          | UI development watcher    | Builds UI in watch mode for development                     |
| `npm run dev:code`        | Plugin code watcher       | Builds plugin code in watch mode for development            |
| `npm run build`           | **Production build**      | Builds both UI and plugin code for production               |
| `npm run build:test`      | **Test build**            | Builds both UI and plugin code for test releases            |
| `npm run build:ui`        | UI production build       | Builds the React UI to `dist/` for production               |
| `npm run build:test:ui`   | UI test build             | Builds the React UI to `dist/` for test releases            |
| `npm run build:code`      | Plugin code production    | Builds the Figma plugin code to `dist/figma-plugin.js`      |
| `npm run build:test:code` | Plugin code test build    | Builds the Figma plugin code to `dist/figma-plugin.js`      |
| `npm run zip:test`        | **Create test zip**       | Creates test release package with test manifest             |
| `npm run zip:production`  | **Create production zip** | Creates production release package with production manifest |

### 🛠️ **Utility Scripts**

| Script                | Purpose         | Description                                          |
| --------------------- | --------------- | ---------------------------------------------------- |
| `npm run lint`        | Code linting    | Runs ESLint on source code                           |
| `npm run check-types` | Type checking   | Runs TypeScript type checking without emitting files |
| `npm run format`      | Code formatting | Formats code with Prettier                           |
| `npm run preview`     | Preview build   | Serves the built application for preview             |

### 🏗️ **Build Architecture**

The plugin uses a dual-build system:

1. **UI Build** (`vite.config.ts`):

   - Builds React UI with `viteSingleFile` plugin
   - Outputs to `dist-test/index.html` (development) or `dist/index.html` (test/production)

2. **Plugin Code Build** (`vite.config.lib.ts`):
   - Builds Figma plugin code as ES module
   - Outputs to `dist-test/figma-plugin.js` (development) or `dist/figma-plugin.js` (test/production)

### 🔧 **Environment Configuration**

The plugin uses environment variables to configure API endpoints and development settings. See the `.env` file for configuration options:

```bash
# The .env file already exists with default development settings
# Edit .env to customize your configuration:

# Environment options:
# - Development: https://dev-api.recursica.com (default)
# - Production: https://api.recursica.com
# - Local: http://localhost:5000

# For local customization, copy to .env.local:
cp .env .env.local
# Then edit .env.local (it's gitignored)
```

#### **Available Environment Variables:**

| Variable                 | Purpose                | Default                         | Options                           |
| ------------------------ | ---------------------- | ------------------------------- | --------------------------------- |
| `VITE_RECURSICA_API_URL` | API endpoint URL       | `https://dev-api.recursica.com` | Development/Production/Local URLs |
| `VITE_RECURSICA_UI_URL`  | UI endpoint URL        | `https://dev-api.recursica.com` | Development/Production/Local URLs |
| `VITE_PLUGIN_PHRASE`     | Plugin security phrase | (empty)                         | Custom security phrase            |
| `VITE_PLUGIN_MODE`       | Selects the mode       | `production`                    | `development` / `test` / `test`   |

### 🏠 **Local Development with Localhost API**

If you need to test against a local API server, follow these steps:

#### 1. **Set Up Local API Server**

```bash
# Start your local API server (usually on port 5000)
# This depends on your local setup - check your API server documentation
```

#### 2. **Configure Plugin for Local API**

```bash
# Copy the environment template
cp .env .env.local

# Edit .env.local and uncomment the local development lines:
# VITE_RECURSICA_API_URL=http://localhost:5000
# VITE_RECURSICA_UI_URL=http://localhost:5000
```

### 🚀 **Installing the Plugin for Development**

#### **Step 1: Start Development**

```bash
npm run dev
```

This starts both UI dev server (port 5175) and plugin code watcher.

#### **Step 2: Install Plugin in Figma**

1. Open Figma Desktop
2. Go to `Plugins` → `Development` → `Import plugin from manifest`
3. Select `dist-dev/manifest.json` (for local development)
4. The plugin will appear as "Recursica - Development"

## Publishing

The plugin supports two types of releases:

### Test Releases

```bash
npm run zip:test
```

Creates a test release package in `dev-releases/recursica-plugin.zip` for internal testing.

### Production Releases

```bash
npm run zip:production
```

Creates a production release package in `dev-releases/recursica-plugin.zip` for production deployment.

Both releases are handled by the CI system and are only available for internal use.

## Structure

The plugin is using [React](https://reactjs.org/) for the UI and [TypeScript](https://www.typescriptlang.org/) for the logic.

To modify the UI, you can edit the file located at `src/App.tsx` directory. To modify the logic, you can edit the files in the `src/plugin` directory.

More details at [Figma Plugin API](https://www.figma.com/plugin-docs/intro/).

## Metadata collection

To be able to run the plugin you will need to create a variable collection in your figma file, to specify the name of the project (eg. recursica-project) and the project type (the current accepted values are: `ui-kit-mantine | theme + tokens | icons`).  
Here's an example of the expected variable collection.

**ID variables**
| name | value |
| ------------ | ---------- |
| project-id | recursica-project |
| project-type | ui-kit-mantine |

> [!Important]
> The name of the collection must be `ID variables`
