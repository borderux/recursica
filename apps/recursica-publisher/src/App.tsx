import { MemoryRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Import from "./pages/Import";
import Publish from "./pages/Publish";
import Publishing from "./pages/Publishing";
import PageManagement from "./pages/PageManagement";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./context/AuthProvider";
import { DebugConsoleProvider } from "./context/DebugConsoleProvider";
import { PluginPromptProvider } from "./context/PluginPromptProvider";

/**
 * Generates a proper UUID v4 using Web Crypto API
 * Uses crypto.getRandomValues() for cryptographically secure random numbers
 * @returns A UUID v4 string
 */
function generateUUID(): string {
  // Check if Web Crypto API is available
  if (
    typeof crypto === "undefined" ||
    typeof crypto.getRandomValues !== "function"
  ) {
    throw new Error(
      "Web Crypto API not available. Cannot generate secure UUID.",
    );
  }

  // Generate 16 random bytes
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version (4) and variant bits according to RFC 4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

  // Convert to UUID string format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function App() {
  // Handle GUID generation requests from the plugin
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage || pluginMessage.type !== "GenerateGuidRequest") {
        return;
      }

      try {
        // Generate GUID using proper UUID v4 generator
        // Try crypto.randomUUID() first if available (best option)
        // Otherwise use our implementation with crypto.getRandomValues()
        let guid: string;
        if (
          typeof crypto !== "undefined" &&
          typeof crypto.randomUUID === "function"
        ) {
          guid = crypto.randomUUID();
        } else {
          // Use Web Crypto API's getRandomValues for proper UUID generation
          guid = generateUUID();
        }

        // Send the GUID back to the plugin
        parent.postMessage(
          {
            pluginMessage: {
              type: "GenerateGuidResponse",
              requestId: pluginMessage.requestId,
              guid,
            },
          },
          "*",
        );
      } catch (error) {
        // If crypto.randomUUID() fails, send error response
        parent.postMessage(
          {
            pluginMessage: {
              type: "GenerateGuidResponse",
              requestId: pluginMessage.requestId,
              error: true,
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to generate GUID",
            },
          },
          "*",
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      }}
    >
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #root {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        `}
      </style>
      <AuthProvider>
        <DebugConsoleProvider>
          <PluginPromptProvider>
            <MemoryRouter initialEntries={["/"]}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/import" element={<Import />} />
                <Route path="/publish" element={<Publish />} />
                <Route path="/publishing" element={<Publishing />} />
                <Route element={<Layout />}>
                  <Route path="auth" element={<Auth />} />
                  <Route path="page-management" element={<PageManagement />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </PluginPromptProvider>
        </DebugConsoleProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
