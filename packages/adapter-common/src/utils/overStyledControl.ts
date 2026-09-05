/* eslint-disable @typescript-eslint/ban-ts-comment */
// Check if environment is development
export const IS_DEV = (() => {
  // 1. Check process.env.NODE_ENV
  try {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV) {
      return process.env.NODE_ENV !== "production";
    }
  } catch {
    // ignore
  }

  // 2. Check import.meta.env (Vite, Storybook, etc.)
  try {
    // @ts-ignore - environment specific globals
    if (import.meta && import.meta.env) {
      // @ts-ignore - environment specific globals
      return import.meta.env.MODE !== "production";
    }
  } catch {
    // ignore
  }

  // 3. Fallback for local browser environments
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local")
    );
  }

  return false;
})();
