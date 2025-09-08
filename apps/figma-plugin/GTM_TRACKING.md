# GTM Tracking for Figma Plugin

This document explains how GTM (Google Tag Manager) tracking is implemented in the Figma plugin to track user navigation and actions.

## Overview

Since the Figma plugin uses a Memory Router (no URL changes), we've implemented custom GTM tracking that sends events to `window.dataLayer` whenever users navigate between pages or perform specific actions.

## Events Tracked

### 1. Page Navigation Events

**Event Name:** `page_view`

- **Triggered:** Every time a user navigates to a different page
- **Data Sent:**
  - `page_path`: The current route (e.g., "/home", "/auth")
  - `page_title`: Human-readable page name
  - `page_location`: Full location with protocol
  - `timestamp`: ISO timestamp

**Event Name:** `figma_plugin_navigation`

- **Triggered:** Every time a user navigates to a different page
- **Data Sent:**
  - `page_path`: The current route
  - `page_title`: Human-readable page name
  - `plugin_version`: Current plugin version
  - `timestamp`: ISO timestamp

### 2. Authentication Events

**Event Name:** `figma_plugin_auth`

- **Triggered:** During authentication flow
- **Data Sent:**
  - `auth_event`: "login", "logout", or "auth_error"
  - `provider`: "github" or "gitlab"
  - `plugin_version`: Current plugin version
  - Additional context data

### 3. Plugin Action Events

**Event Name:** `figma_plugin_action`

- **Triggered:** When users perform specific actions
- **Data Sent:**
  - `action`: Action name (e.g., "provider_selected")
  - `plugin_version`: Current plugin version
  - Additional context data

### 4. Repository Operation Events

**Event Name:** `figma_plugin_repository`

- **Triggered:** During repository operations
- **Data Sent:**
  - `operation`: Operation name
  - `plugin_version`: Current plugin version
  - Additional context data

### 5. Sync Events

**Event Name:** `figma_plugin_sync`

- **Triggered:** During sync operations
- **Data Sent:**
  - `sync_event`: "sync_start", "sync_success", or "sync_error"
  - `plugin_version`: Current plugin version
  - Additional context data

## Usage

### Automatic Tracking

Page navigation is automatically tracked when you use the `useGTMTracking` hook in your components:

```tsx
import { useGTMTracking } from './hooks';

function MyComponent() {
  useGTMTracking(); // Automatically tracks route changes
  // ... rest of component
}
```

### Manual Tracking

For specific user actions, use the provided tracking functions:

```tsx
import {
  trackPluginAction,
  trackAuthEvent,
  trackRepositoryOperation,
  trackSyncEvent,
} from './hooks';

// Track a user action
trackPluginAction('button_clicked', { button_name: 'submit' });

// Track authentication
trackAuthEvent('login', { provider: 'github' });

// Track repository operation
trackRepositoryOperation('sync_variables', { repository_type: 'github' });

// Track sync event
trackSyncEvent('sync_success', { variables_count: 25 });
```

## GTM Configuration

In your GTM container, you can create triggers based on these events:

1. **Page View Trigger:**

   - Event: `page_view`
   - Use for general page view tracking

2. **Navigation Trigger:**

   - Event: `figma_plugin_navigation`
   - Use for custom navigation analytics

3. **Authentication Trigger:**

   - Event: `figma_plugin_auth`
   - Use for authentication funnel analysis

4. **Action Trigger:**
   - Event: `figma_plugin_action`
   - Use for user interaction tracking

## Data Layer Structure

All events are pushed to `window.dataLayer` with this structure:

```javascript
{
  event: 'event_name',
  // ... event-specific data
  plugin_version: '8.0.1',
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

## Example GTM Tags

### Google Analytics 4 Event Tag

- **Event Name:** `figma_plugin_navigation`
- **Parameters:**
  - `page_path`: `{{page_path}}`
  - `page_title`: `{{page_title}}`
  - `plugin_version`: `{{plugin_version}}`

### Custom Event Tag

- **Event Name:** `figma_plugin_action`
- **Parameters:**
  - `action`: `{{action}}`
  - `plugin_version`: `{{plugin_version}}`

## Testing

To test GTM tracking in development:

1. Open browser dev tools
2. Check `window.dataLayer` array
3. Navigate between pages to see events being pushed
4. Verify event data structure matches expectations

## Notes

- All tracking is client-side only
- No personal data is collected
- Events are sent immediately when actions occur
- The plugin version is included in all events for filtering
