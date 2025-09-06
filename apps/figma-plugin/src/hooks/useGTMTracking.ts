import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Hook to track page navigation in GTM
 * Sends events to window.dataLayer when the route changes
 */
export function useGTMTracking() {
  const location = useLocation();

  useEffect(() => {
    // Ensure dataLayer exists
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];

      // Send page view event to GTM
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname,
        page_title: getPageTitle(location.pathname),
        page_location: `figma-plugin://${location.pathname}`,
        timestamp: new Date().toISOString(),
      });

      // Send custom navigation event
      window.dataLayer.push({
        event: 'figma_plugin_navigation',
        page_path: location.pathname,
        page_title: getPageTitle(location.pathname),
        plugin_version: '8.0.1',
        timestamp: new Date().toISOString(),
      });
    }
  }, [location.pathname]);
}

/**
 * Get a human-readable page title based on the route
 */
function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/home': 'Home',
    '/auth': 'Authentication',
    '/file-synced': 'File Synced',
    '/publish': 'Publish Changes',
    '/error': 'Error',
  };

  return titleMap[pathname] || 'Unknown Page';
}

/**
 * Utility function to manually send custom events to GTM
 */
export function sendGTMEvent(eventName: string, eventData: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track specific user actions in the Figma plugin
 */
export function trackPluginAction(action: string, details: Record<string, unknown> = {}) {
  sendGTMEvent('figma_plugin_action', {
    action,
    plugin_version: '8.0.1',
    ...details,
  });
}

/**
 * Track authentication events
 */
export function trackAuthEvent(
  eventType: 'login' | 'logout' | 'auth_error',
  details: Record<string, unknown> = {}
) {
  sendGTMEvent('figma_plugin_auth', {
    auth_event: eventType,
    plugin_version: '8.0.1',
    ...details,
  });
}

/**
 * Track repository operations
 */
export function trackRepositoryOperation(operation: string, details: Record<string, unknown> = {}) {
  sendGTMEvent('figma_plugin_repository', {
    operation,
    plugin_version: '8.0.1',
    ...details,
  });
}

/**
 * Track sync operations
 */
export function trackSyncEvent(
  eventType: 'sync_start' | 'sync_success' | 'sync_error',
  details: Record<string, unknown> = {}
) {
  sendGTMEvent('figma_plugin_sync', {
    sync_event: eventType,
    plugin_version: '8.0.1',
    ...details,
  });
}
