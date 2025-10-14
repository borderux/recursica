// Get all storage data from sandbox
export async function getLocalStorage() {
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (pluginMessage?.type === "auth-data-loaded") {
        window.removeEventListener("message", handleMessage);
        if (pluginMessage.success) {
          resolve({
            accessToken: pluginMessage.accessToken || null,
            platform: pluginMessage.platform || null,
            selectedProject: null, // Not used in this context
            agreedPublishChanges: null, // Not used in this context
          });
        } else {
          reject(new Error(pluginMessage.error || "Failed to load auth data"));
        }
      }
    };

    window.addEventListener("message", handleMessage);
    parent.postMessage(
      { pluginMessage: { type: "load-auth-data" }, pluginId: "*" },
      "*",
    );

    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      reject(new Error("Timeout loading auth data"));
    }, 5000);
  });
}

// Save data to sandbox storage
export async function saveInStorage(key: string, value: string) {
  return new Promise((resolve, reject) => {
    if (key === "accessToken" || key === "platform") {
      const handleMessage = (event: MessageEvent) => {
        const { pluginMessage } = event.data;
        if (pluginMessage?.type === "auth-data-stored") {
          window.removeEventListener("message", handleMessage);
          if (pluginMessage.success) {
            console.log(`${key} updated`);
            resolve(undefined);
          } else {
            reject(
              new Error(pluginMessage.error || "Failed to store auth data"),
            );
          }
        }
      };

      window.addEventListener("message", handleMessage);
      parent.postMessage(
        {
          pluginMessage: {
            type: "store-auth-data",
            accessToken: key === "accessToken" ? value : "",
            platform: key === "platform" ? value : "github",
          },
          pluginId: "*",
        },
        "*",
      );

      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Timeout storing auth data"));
      }, 5000);
    } else {
      // For other keys, just resolve (not used in this context)
      resolve(undefined);
    }
  });
}

// Clear all storage in sandbox
export async function clearStorage() {
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (pluginMessage?.type === "auth-data-cleared") {
        window.removeEventListener("message", handleMessage);
        if (pluginMessage.success) {
          console.log("Storage cleared");
          resolve(undefined);
        } else {
          reject(new Error(pluginMessage.error || "Failed to clear auth data"));
        }
      }
    };

    window.addEventListener("message", handleMessage);
    parent.postMessage(
      { pluginMessage: { type: "clear-auth-data" }, pluginId: "*" },
      "*",
    );

    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      reject(new Error("Timeout clearing auth data"));
    }, 5000);
  });
}
