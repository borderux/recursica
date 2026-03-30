import React, { useState, useCallback, useEffect } from "react";
import {
  PluginPromptContext,
  type PluginPromptData,
} from "./PluginPromptContext";

export function PluginPromptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prompt, setPrompt] = useState<PluginPromptData | null>(null);

  const clear = useCallback(() => {
    setPrompt(null);
  }, []);

  const okPrompt = useCallback(() => {
    if (!prompt) return;

    // Send ok response back to plugin
    parent.postMessage(
      {
        pluginMessage: {
          type: "pluginPromptResponse",
          data: {
            requestId: prompt.requestId,
            action: "ok",
          },
        },
      },
      "*",
    );

    // Clear the prompt after responding
    setPrompt(null);
  }, [prompt]);

  const cancelPrompt = useCallback(() => {
    if (!prompt) return;

    // Send cancel response back to plugin
    parent.postMessage(
      {
        pluginMessage: {
          type: "pluginPromptResponse",
          data: {
            requestId: prompt.requestId,
            action: "cancel",
          },
        },
      },
      "*",
    );

    // Clear the prompt after responding
    setPrompt(null);
  }, [prompt]);

  // Listen for PluginPrompt and PluginPromptClear messages from the plugin
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;

      if (pluginMessage.type === "PluginPrompt") {
        const { payload } = pluginMessage;
        if (payload && payload.message && payload.requestId) {
          // Replace any existing prompt with the new one
          setPrompt({
            message: payload.message,
            requestId: payload.requestId,
            okLabel: payload.okLabel ?? "OK",
            cancelLabel: payload.cancelLabel ?? "Cancel",
          });
        }
      } else if (pluginMessage.type === "PluginPromptClear") {
        setPrompt(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <PluginPromptContext.Provider
      value={{
        prompt,
        clear,
        ok: okPrompt,
        cancel: cancelPrompt,
      }}
    >
      {children}
    </PluginPromptContext.Provider>
  );
}
