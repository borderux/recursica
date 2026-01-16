# Recursica Publisher Architecture

This document describes the high-level architecture of Recursica Publisher. Detailed plugin services and import/export logic are documented in focused files.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Data Flow](#data-flow)
4. [GitHub Integration](#github-integration)
5. [References](#references)

## Architecture Overview

Recursica Publisher uses a Figma plugin architecture with two primary layers:

- **UI Layer**: React UI for publishing/importing and user workflows.
- **Plugin Sandbox**: Figma plugin services invoked via message passing.

Plugin services and import/export details live in:

- `src/plugin/README.md`
- `src/plugin/services/import-export/README.md`

## Core Components

### UI Layer (`src/`)

#### Application Structure

- **`App.tsx`**: Main React application with routing.
- **`main.tsx`**: UI entry point.

#### Pages (`src/pages/`)

- **`Home.tsx`**: Entry point with Import/Publish actions.
- **`Publish.tsx`**, **`PublishingWizard.tsx`**, **`PublishingComplete.tsx`**: Publish flow.
- **`Import.tsx`**, **`ImportWizard.tsx`**, **`Importing.tsx`**: Import flow.

#### Context Providers (`src/context/`)

- **`AuthContext.tsx`**: GitHub authentication state.
- **`ImportDataContext.tsx`**: Import data and progress.
- **`DebugConsoleContext.tsx`**: Debug logging.
- **`PluginPromptContext.tsx`**: Plugin prompt handling.

#### UI Services (`src/services/`)

- **`github/githubService.ts`**: GitHub API integration.
- **`repository/repositoryService.ts`**: Repository operations.

### Plugin Layer (`src/plugin/`)

Plugin services, message routing, and developer guidelines:

- `src/plugin/README.md`

Import/export architecture and design decisions:

- `src/plugin/services/import-export/README.md`

## Data Flow

### Publish Flow (High-Level)

1. UI starts the publish flow and requests export.
2. Plugin services export the page and return JSON.
3. UI uses GitHub service to create a branch, commit, and PR.

### Import Flow (High-Level)

1. UI selects import source and validates files.
2. Plugin services import the JSON into Figma.
3. UI surfaces results and any deferred instance resolution needs.

For full import/export stages and decisions, see `src/plugin/services/import-export/README.md`.

## GitHub Integration

### Authentication

- GitHub OAuth via personal access tokens.
- Tokens are stored in plugin data, not in code.

### Publishing

- Create branch, commit JSON, update `index.json`, open PR.

### Importing

- Fetch JSON from repository and pass to plugin import services.

## References

- `src/plugin/README.md` for plugin services and structure
- `src/plugin/services/import-export/README.md` for import/export architecture and decisions
