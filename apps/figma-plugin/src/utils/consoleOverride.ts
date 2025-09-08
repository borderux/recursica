/**
 * Console.log override utility that sends logs to Google Tag Manager
 * This should be imported early in the application lifecycle
 */

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Keep a copy of the original console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/**
 * Initialize console.log override to send logs to GTM
 * This should be called as early as possible in the application
 */
export function initializeConsoleOverride() {
  // Override console.log
  console.log = function (message: unknown, ...args: unknown[]) {
    // Push the log message to the dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'console_log',
        log_message: typeof message === 'string' ? message : JSON.stringify(message),
        log_args: args,
        log_level: 'log',
        timestamp: new Date().toISOString(),
        plugin_version: '8.0.1',
      });
    }

    // Call the original console.log so the message still appears in the browser console
    originalConsoleLog.apply(console, [message, ...args]);
  };

  // Override console.error
  console.error = function (message: unknown, ...args: unknown[]) {
    // Push the error message to the dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'console_error',
        log_message: typeof message === 'string' ? message : JSON.stringify(message),
        log_args: args,
        log_level: 'error',
        timestamp: new Date().toISOString(),
        plugin_version: '8.0.1',
      });
    }

    // Call the original console.error so the message still appears in the browser console
    originalConsoleError.apply(console, [message, ...args]);
  };

  // Override console.warn
  console.warn = function (message: unknown, ...args: unknown[]) {
    // Push the warning message to the dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'console_warn',
        log_message: typeof message === 'string' ? message : JSON.stringify(message),
        log_args: args,
        log_level: 'warn',
        timestamp: new Date().toISOString(),
        plugin_version: '8.0.1',
      });
    }

    // Call the original console.warn so the message still appears in the browser console
    originalConsoleWarn.apply(console, [message, ...args]);
  };
}

/**
 * Restore original console methods (useful for testing or cleanup)
 */
export function restoreOriginalConsole() {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}
