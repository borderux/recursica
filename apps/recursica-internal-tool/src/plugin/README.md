# Plugin Architecture

This directory contains the Figma plugin code organized in a clean, modular structure.

## Structure

```
src/plugin/
├── main.ts                 # Plugin orchestrator - handles UI setup and message routing
├── services/               # Business logic services
│   └── resetMetadata.ts    # Service for resetting variable metadata
├── types/                  # TypeScript type definitions
│   └── messages.ts         # Message and response type definitions
└── README.md              # This file
```

## Architecture Principles

### 1. Separation of Concerns

- **main.ts**: Acts as an orchestrator, handling UI setup and message routing
- **services/**: Contains business logic for specific operations
- **types/**: Centralized type definitions for better maintainability

### 2. Message-Based Communication

The plugin uses a message-based system for communication between the UI and plugin sandbox:

- **PluginMessage**: Messages sent from UI to plugin
- **PluginResponse**: Responses sent from plugin to UI

### 3. Service Pattern

Each major operation is encapsulated in its own service:

- `resetMetadata.ts`: Handles all metadata reset operations
- Future services can be added for other operations

## Adding New Features

To add a new feature:

1. **Create a service** in `services/` directory
2. **Define message types** in `types/messages.ts`
3. **Add message handler** in `main.ts` switch statement
4. **Update UI** to send the new message type

## Example: Adding a New Service

```typescript
// services/newFeature.ts
import type { NewFeatureResponse } from '../types/messages';

export async function performNewFeature(): Promise<NewFeatureResponse> {
  // Implementation here
}

// types/messages.ts
export interface NewFeatureMessage extends BaseMessage {
  type: 'new-feature';
}

export interface NewFeatureResponse extends BaseMessage {
  type: 'new-feature-response';
  success: boolean;
  data?: any;
  error?: string;
}

// main.ts
case 'new-feature':
  const response = await performNewFeature();
  figma.ui.postMessage(response);
  break;
```
