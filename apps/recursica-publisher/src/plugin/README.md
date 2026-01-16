# Plugin Code Layout

This folder contains the Figma plugin sandbox code (not the UI). It is organized around services, types, and shared utilities.

## Structure

```text
src/plugin/
├── main.ts                 # Orchestrator + message router
├── services/               # Business logic services
├── types/                  # Message + service name types
├── utils/                  # Shared stateless helpers
└── README.md               # This file
```

## How Services Work

The plugin uses message-based communication between the UI and sandbox:

- **UI → Plugin**: `figma.ui.postMessage(message)`
- **Plugin → UI**: `figma.ui.postMessage(response)`

Services are registered in `services/index.ts` and invoked by name via `main.ts`.

## Creating a New Service

1. **Create the service** in `services/` (exported function).
2. **Add the service name** to `types/ServiceName.ts`.
3. **Define message types** in `types/messages.ts`.
4. **Export the service** in `services/index.ts`.
5. **Update the UI** to call the new service.

This repository does **not** use a switch statement in `main.ts`; it routes dynamically using the services map from `services/index.ts`.

## Utils Guidelines (Important)

Utils in `src/plugin/utils/` must be **stateless** shared helpers:

- No module-level state
- No side effects
- Prefer pure functions
- Keep them reusable across services

If a function needs state, it belongs in a service or a dedicated module in `services/`.

## Import/Export Services (Read Before Editing)

**Before modifying** `pageExportNew.ts` or `pageImportNew.ts`, you **must read**:

- `services/import-export/README.md`

Those services have a complex pipeline (including Stage 9.5 and Stage 10.5 sub-stages), deferred instance handling, and non-obvious design decisions. The documentation explains why those choices exist and how changes should be made safely.

## Architecture Principles

- **Separation of concerns**: orchestration in `main.ts`, logic in `services/`
- **Message-based communication**: typed request/response messages
- **Service pattern**: one service per operation
