/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";

// Declare global recursica property on Window
declare global {
  interface Window {
    recursica?: Record<string, unknown>;
  }
}

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

// Global listeners and state for tracking overStyled highlight state (only used in dev)
const listeners = new Set<() => void>();
let globalOverStyledActive = false;

/**
 * Toggles the global highlight state for overStyled components.
 * When active, components with overStyled=true will render a wrapping div with a cyan box shadow.
 *
 * @param active - Optional boolean to force a state.
 * @returns The new active state.
 */
export function toggleGlobalOverStyled(active?: boolean): boolean {
  if (!IS_DEV) {
    console.warn(
      "[Recursica] overStyled highlight is disabled in production builds.",
    );
    return false;
  }

  globalOverStyledActive =
    active !== undefined ? active : !globalOverStyledActive;

  if (typeof document !== "undefined") {
    const docRoot = document.documentElement;
    const shadowValue = globalOverStyledActive ? "0 0 0 2px cyan" : "none";
    docRoot.style.setProperty("--recursica-over-styled-shadow", shadowValue);
    console.log(
      `[Recursica] Highlight outlines toggled: ${globalOverStyledActive ? "ACTIVE (0 0 0 2px cyan)" : "INACTIVE"}`,
    );
  } else {
    console.warn("[Recursica] document is undefined. Cannot set CSS property.");
  }

  listeners.forEach((l) => l());
  return globalOverStyledActive;
}

/**
 * Returns the current global overStyled active state.
 */
export function isGlobalOverStyledActive(): boolean {
  return IS_DEV && globalOverStyledActive;
}

/**
 * React hook that returns the current global overStyled active state and subscribes to changes.
 */
export function useGlobalOverStyled(): boolean {
  const [active, setActive] = useState(globalOverStyledActive);

  useEffect(() => {
    if (!IS_DEV) return;

    // Self-bootstrap when rendered in development (e.g. inside Storybook or apps)
    injectOverStyledStyles();
    registerOverStyledConsoleCommand();

    const handler = () => setActive(globalOverStyledActive);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return IS_DEV && active;
}

/**
 * Injects the global styles for `.recursica-over-styled` elements into the document.
 */
export function injectOverStyledStyles(): void {
  if (!IS_DEV) return;
  if (typeof document === "undefined") {
    console.warn(
      "[Recursica] document is undefined. Cannot inject overStyled styles.",
    );
    return;
  }
  const styleId = "recursica-over-styled-styles";
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = `
      :root {
        --recursica-over-styled-shadow: none;
      }
      .recursica-over-styled {
        display: contents !important;
      }
      .recursica-over-styled > * {
        box-shadow: var(--recursica-over-styled-shadow) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

/**
 * Registers the global `recursica.toggleOverStyled` command on the window object.
 */
export function registerOverStyledConsoleCommand(): void {
  if (!IS_DEV) return;
  if (typeof window === "undefined") {
    console.warn(
      "[Recursica] window is undefined. Cannot register console command.",
    );
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerOnWindow = (win: any) => {
    try {
      win.recursica = win.recursica || {};
      win.recursica.toggleOverStyled = () => {
        const active = toggleGlobalOverStyled();
        return `[Recursica] Overstyled outline highlight is now: ${active ? "ON (cyan 2px box shadow)" : "OFF"}`;
      };
    } catch {
      // Catch potential cross-origin access exceptions on window.parent
    }
  };

  registerOnWindow(window);

  if (window.parent && window.parent !== window) {
    registerOnWindow(window.parent);
  }
}
