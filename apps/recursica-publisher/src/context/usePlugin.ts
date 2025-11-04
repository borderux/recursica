import { useContext } from "react";
import { PluginContext } from "./PluginContext";

export function usePlugin() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error("usePlugin must be used within a PluginProvider");
  }
  return context;
}
