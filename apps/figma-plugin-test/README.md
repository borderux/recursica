# Recursica JSON exporter for Figma

This is a simple plugin for Figma that exports all the local variables in the Recursica design system files to Json in a repository, as well as supporting CSS and project files.

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

## Development

To develop this plugin, you need to have Node.js and npm installed. Then, you can run the following commands:

[node]: https://nodejs.org/

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

This will start a development server that will watch for changes in the `src` directory and automatically build the plugin for Figma.

## Build System

The plugin supports three distinct build types for different use cases:

### 🚀 **Local Development** (`npm run dev`)

- **Purpose**: Local development and debugging
- **Manifest**: `manifest.json` (points to `dist-test/`)
- **Output**: `dist-test/` directory
- **Features**: Hot reload, file watching, development banner

### 🧪 **Test Build** (`npm run build:test`)

- **Purpose**: Creating test releases for internal testing
- **Manifest**: `manifest.test.json` (points to `dist/`)
- **Output**: `dist/` directory
- **Usage**: `npm run zip:test` to create test release package

### 🏭 **Production Build** (`npm run build`)

- **Purpose**: Production releases
- **Manifest**: `manifest.production.json` (points to `dist/`)
- **Output**: `dist/` directory
- **Usage**: `npm run zip:production` to create production release package

### Quick Start

```bash
npm run dev           # Start local development (recommended)
npm run zip:test      # Create test release package
npm run zip:production # Create production release package
```

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

| Variable                 | Purpose                 | Default                         | Options                           |
| ------------------------ | ----------------------- | ------------------------------- | --------------------------------- |
| `VITE_RECURSICA_API_URL` | API endpoint URL        | `https://dev-api.recursica.com` | Development/Production/Local URLs |
| `VITE_RECURSICA_UI_URL`  | UI endpoint URL         | `https://dev-api.recursica.com` | Development/Production/Local URLs |
| `VITE_PLUGIN_PHRASE`     | Plugin security phrase  | (empty)                         | Custom security phrase            |
| `VITE_SHOW_DEV_BANNER`   | Show development banner | `true`                          | `true`/`false`                    |

#### **Development Banner Control:**

The `VITE_SHOW_DEV_BANNER` variable controls when the "TESTING PLUGIN" banner appears:

- **`true`** (default): Always shows the banner
- **`false`**: Only shows banner in development mode builds (`MODE === 'development'`)

This allows you to:

- Hide the banner in production builds even when using development APIs
- Show the banner in production builds for testing purposes
- Control banner visibility independently of build mode

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

#### 3. **Update Manifest for Local Development**

The `manifest.json` already includes localhost in `devAllowedDomains`:

```json
{
  "networkAccess": {
    "devAllowedDomains": [
      "http://localhost:5175",
      "https://dev-api.recursica.com"
    ]
  }
}
```

If your local API runs on a different port, you may need to add it to the manifest.

#### 4. **Start Development**

```bash
# Restart the dev server to pick up environment changes
npm run dev
```

#### 5. **Verify Configuration**

Check the browser console to ensure API calls are going to `http://localhost:5000` instead of the remote servers.

### 🔄 **Switching Between Environments**

| Environment     | API URL                         | When to Use                 |
| --------------- | ------------------------------- | --------------------------- |
| **Development** | `https://dev-api.recursica.com` | Default - shared dev server |
| **Local**       | `http://localhost:5000`         | Testing local API changes   |
| **Production**  | `https://api.recursica.com`     | Testing production behavior |

### ⚠️ **Important Notes**

- **`.env.local` is gitignored** - your local settings won't be committed
- **Restart required** - Changes to `.env.local` require restarting the dev server
- **CORS issues** - Make sure your local API server allows requests from the plugin's origin
- **Port conflicts** - Ensure your local API server port doesn't conflict with the dev server (5175)

### 🚀 **Installing the Plugin for Development**

#### **Step 1: Start Development**

```bash
npm run dev
```

This starts both UI dev server (port 5175) and plugin code watcher.

#### **Step 2: Install Plugin in Figma**

1. Open Figma Desktop
2. Go to `Plugins` → `Development` → `Import plugin from manifest`
3. Select `manifest.json` (for local development)
4. The plugin will appear as "Recursica - Development"

#### **Development Workflow**

| Change Type                         | What Happens     | Action Required        |
| ----------------------------------- | ---------------- | ---------------------- |
| **UI Changes** (React components)   | Auto-rebuilds    | Reload plugin in Figma |
| **Plugin Changes** (auth, file ops) | Auto-rebuilds    | Reload plugin in Figma |
| **Environment Variables**           | Requires restart | Restart `npm run dev`  |

#### **Manifest Files**

| File                       | Purpose               | Plugin Code                 | When to Use         |
| -------------------------- | --------------------- | --------------------------- | ------------------- |
| `manifest.json`            | **Local Development** | `dist-test/figma-plugin.js` | Active development  |
| `manifest.test.json`       | **Test Releases**     | `dist/figma-plugin.js`      | Internal testing    |
| `manifest.production.json` | **Production**        | `dist/figma-plugin.js`      | Production releases |

#### **Troubleshooting**

**Common Issues:**

- **`__html__ is not defined`**: Make sure you're using `manifest.json` for development
- **CORS errors**: Ensure `npm run dev` is running (both UI and code watchers)
- **White screen**: Check browser console and ensure Vite dev server is running on `localhost:5175`
- **WebSocket errors**: The manifest includes `ws://localhost:5175` in `devAllowedDomains` for hot reload

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
