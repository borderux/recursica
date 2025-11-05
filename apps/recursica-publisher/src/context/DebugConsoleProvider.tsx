import React, { useState, useCallback, useEffect } from "react";
import {
  DebugConsoleContext,
  type DebugConsoleMessage,
} from "./DebugConsoleContext";

export function DebugConsoleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<DebugConsoleMessage[]>([]);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  const getFormattedLog = useCallback(() => {
    return messages
      .map((msg) => {
        const prefix =
          msg.type === "error"
            ? "[ERROR]"
            : msg.type === "warning"
              ? "[WARN]"
              : "[LOG]";
        return `${prefix} ${msg.message}`;
      })
      .join("\n");
  }, [messages]);

  // Listen for DebugConsole messages from the plugin
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage || pluginMessage.type !== "DebugConsole") return;

      const { payload } = pluginMessage;
      const messageType: "error" | "warning" | "log" =
        payload.type === "error"
          ? "error"
          : payload.type === "warning"
            ? "warning"
            : "log";

      setMessages((prev) => [
        ...prev,
        {
          type: messageType,
          message: payload.message,
        },
      ]);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <DebugConsoleContext.Provider
      value={{
        messages,
        clear,
        getFormattedLog,
      }}
    >
      {children}
    </DebugConsoleContext.Provider>
  );
}
