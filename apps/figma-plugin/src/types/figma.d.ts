/// <reference types="@figma/plugin-typings" />

// This file ensures Figma plugin types are available throughout the project
declare global {
  // Re-export figma global if needed
  const figma: PluginAPI;
}
