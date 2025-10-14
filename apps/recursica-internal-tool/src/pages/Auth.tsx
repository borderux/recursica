import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { apiService, pluginTokenToCode } from "../services/auth/auth";

const Status = {
  Login: "Login",
  WaitingForAuthorization: "WaitingForAuthorization",
  Error: "Error",
} as const;

type StatusType = (typeof Status)[keyof typeof Status];

interface PairedKeys {
  userId: string;
  readKey: string;
  code: string;
}

export function Auth() {
  const [status, setStatus] = useState<StatusType>(Status.Login);
  const [pairedKeys, setPairedKeys] = useState<PairedKeys | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { login, setLoading } = useAuth();

  const selectedProvider = "github"; // Always use GitHub

  // Get user ID from Figma plugin
  const getUserId = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        const { pluginMessage } = event.data;
        if (pluginMessage?.type === "current-user") {
          window.removeEventListener("message", handleMessage);
          if (pluginMessage.payload) {
            resolve(pluginMessage.payload);
          } else {
            reject(new Error("No user ID received from plugin"));
          }
        }
      };

      window.addEventListener("message", handleMessage);
      parent.postMessage(
        { pluginMessage: { type: "get-current-user" }, pluginId: "*" },
        "*",
      );

      // Timeout after 10 seconds
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Timeout waiting for user ID"));
      }, 10000);
    });
  }, []);

  const pollForToken = useCallback(
    async (userId: string, readKey: string, code: string) => {
      const poll = async () => {
        try {
          console.log("Polling for token...", { userId, readKey, code });
          const data = await apiService.getToken(userId, readKey, code);
          console.log("Token response:", data);

          if (data && data.status === "authenticated") {
            console.log("Authentication successful!");
            // Clear any pending polling timeout
            if (pollingTimeout.current) {
              clearTimeout(pollingTimeout.current);
              pollingTimeout.current = null;
            }

            // Get user info from GitHub API
            try {
              const githubService = new (
                await import("../services/github/githubService")
              ).GitHubService(data.accessToken);
              const userInfo = await githubService.getUser();

              // Login with the access token and user info
              login(data.accessToken, {
                id: userInfo.id.toString(),
                name: userInfo.name || userInfo.login,
                email: userInfo.email || undefined,
              });
            } catch (apiError) {
              console.warn("Could not fetch user info from GitHub:", apiError);
              // Fallback to basic user info
              login(data.accessToken, {
                id: userId,
                name: "User",
              });
            }

            setLoading(false);
            setStatus(Status.Login); // Reset status to prevent further polling
            return; // Stop polling
          } else if (data && data.status === "pending") {
            console.log("Still pending, continuing to poll...");
            // Continue polling
            pollingTimeout.current = setTimeout(poll, 5000); // Poll every 5 seconds
            return;
          } else {
            console.log("Unknown status or data structure:", data);
            // Continue polling for unknown statuses
            pollingTimeout.current = setTimeout(poll, 5000);
            return;
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

          if (
            errorMessage.includes("Authentication failed") ||
            errorMessage.includes("expired")
          ) {
            // Clear polling timeout on error
            if (pollingTimeout.current) {
              clearTimeout(pollingTimeout.current);
              pollingTimeout.current = null;
            }
            setStatus(Status.Error);
            setLoading(false);
            return;
          }

          // For other errors, continue polling
          console.warn("Polling error (will retry):", error);
          pollingTimeout.current = setTimeout(poll, 5000); // Poll every 5 seconds
        }
      };

      // Start polling after a short delay
      pollingTimeout.current = setTimeout(poll, 2000);
    },
    [login, setLoading],
  );

  useEffect(() => {
    if (status === Status.WaitingForAuthorization) {
      setCanRetry(false);
      retryTimeout.current = setTimeout(() => setCanRetry(true), 30000);
    } else {
      setCanRetry(false);
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
      // Also clear polling timeout when status changes away from waiting
      if (pollingTimeout.current) {
        clearTimeout(pollingTimeout.current);
        pollingTimeout.current = null;
      }
    }
    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
      if (pollingTimeout.current) {
        clearTimeout(pollingTimeout.current);
        pollingTimeout.current = null;
      }
    };
  }, [status]);

  // Get user ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error getting user ID:", error);
        setStatus(Status.Error);
      }
    };

    fetchUserId();
  }, [getUserId]);

  useEffect(() => {
    if (pairedKeys) {
      pollForToken(pairedKeys.userId, pairedKeys.readKey, pairedKeys.code);
    }
  }, [pairedKeys, pollForToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
      if (pollingTimeout.current) {
        clearTimeout(pollingTimeout.current);
        pollingTimeout.current = null;
      }
    };
  }, []);

  const handleLogin = async () => {
    if (!userId) {
      setStatus(Status.Error);
      return;
    }

    setStatus(Status.WaitingForAuthorization);
    setLoading(true);

    try {
      // Step 1: Generate keys using secure API service
      const { readKey, writeKey, pluginToken } =
        await apiService.generateKeys(userId);
      setStatus(Status.WaitingForAuthorization);
      const code = pluginTokenToCode(pluginToken);

      // Step 2: Get authorization URL using secure API service
      const { authUrl } = await apiService.authorize(
        userId,
        readKey,
        writeKey,
        code,
        selectedProvider,
      );

      // Step 3: Open the OAuth URL in a new tab
      window.open(authUrl, "_blank", "width=600,height=700");

      setStatus(Status.WaitingForAuthorization);

      // Step 4: Enhanced polling with better error handling
      setPairedKeys({ userId, readKey, code });
    } catch (error) {
      console.error("Error in OAuth flow:", error);
      setStatus(Status.Error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (pairedKeys) {
      setStatus(Status.Login);
      setPairedKeys(null);
    }
    setLoading(false);
  };

  const getFooter = () => {
    switch (status) {
      case Status.Login:
        return {
          label: userId ? "Login with GitHub" : "Loading...",
          disabled: !userId,
          onClick: () => handleLogin(),
        };
      case Status.WaitingForAuthorization:
        return {
          label: "It's taking too long",
          onClick: () => handleReset(),
          disabled: !canRetry,
        };
      case Status.Error:
        return {
          label: "Try again",
          onClick: () => handleReset(),
        };
    }
  };

  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>GitHub</h1>

      {isAuthenticated ? (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e8f5e8",
              borderRadius: "8px",
              border: "1px solid #4caf50",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>🐙</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>
              Connected to GitHub
            </h3>
            <p style={{ margin: "0 0 15px 0", color: "#2e7d32" }}>
              <strong>{user?.name || "User"}</strong>
              {user?.email && (
                <span
                  style={{ display: "block", fontSize: "14px", color: "#666" }}
                >
                  {user.email}
                </span>
              )}
            </p>
            <button
              onClick={logout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Connect your GitHub account to push Figma page exports to your
            repositories.
          </p>

          {status === Status.Login && (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🐙</div>
              {!userId && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Getting user information from Figma...
                </p>
              )}
              <p style={{ fontSize: "14px", color: "#666" }}>
                Don't have a GitHub account?{" "}
                <a
                  href="https://github.com/signup"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#007acc" }}
                >
                  Create one here
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {status === Status.WaitingForAuthorization && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔗</div>
          <h3>Check your browser</h3>
          <p>Go to the authentication page and return here</p>
        </div>
      )}

      {status === Status.Error && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ color: "#c62828" }}>
            Seems like there was an error connecting
          </p>
        </div>
      )}

      <button
        onClick={getFooter().onClick}
        disabled={getFooter().disabled}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: getFooter().disabled ? "#ccc" : "#007acc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: getFooter().disabled ? "not-allowed" : "pointer",
        }}
      >
        {getFooter().label}
      </button>
    </div>
  );
}
