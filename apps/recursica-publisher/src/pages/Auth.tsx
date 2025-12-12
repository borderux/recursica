import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import { apiService, pluginTokenToCode } from "../services/auth/auth";
import { callPlugin } from "../utils/callPlugin";

const Status = {
  Login: "Login",
  WaitingForAuthorization: "WaitingForAuthorization",
  Error: "Error",
} as const;

type StatusType = (typeof Status)[keyof typeof Status];

export function Auth() {
  const [status, setStatus] = useState<StatusType>(Status.Login);
  const [userId, setUserId] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const pollForToken = useCallback(
    async (userId: string, readKey: string, code: string) => {
      const poll = async () => {
        try {
          const data = await apiService.getToken(userId, readKey, code);

          if (data.status === "authenticated") {
            console.log("Authentication successful!");
            login(data.accessToken);
            // Navigate to Home page after successful authentication
            navigate("/");
          } else if (data.status === "pending") {
            console.log("Still pending, continuing to poll...");
            setTimeout(poll, 5000); // Poll every 5 seconds
          }
        } catch (error) {
          setStatus(Status.Error);

          console.warn("Polling error (will retry):", error);
          setTimeout(poll, 5000); // Poll every 5 seconds
        }
      };

      // Start polling after a short delay
      setTimeout(poll, 2000);
    },
    [login, navigate],
  );

  const handleLogin = async () => {
    if (!userId) {
      setStatus(Status.Error);
      return;
    }

    setStatus(Status.WaitingForAuthorization);

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
      );

      // Step 3: Open the OAuth URL in a new tab
      window.open(authUrl, "_blank", "width=600,height=700");

      setStatus(Status.WaitingForAuthorization);

      // Step 4: Enhanced polling with better error handling
      pollForToken(userId, readKey, code);
    } catch (error) {
      console.error("Error in OAuth flow:", error);
      setStatus(Status.Error);
    }
  };

  // Get user ID from plugin using callPlugin
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { promise } = callPlugin("getCurrentUser", {});
        const response = await promise;
        if (response.success && response.data) {
          const data = response.data as { userId: string | null };
          setUserId(data.userId || null);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  // If already authenticated, redirect to Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login to GitHub</h1>
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

      {!isAuthenticated && (
        <button
          onClick={handleLogin}
          disabled={false}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "transparent",
            color: "#d40d0d",
            border: "2px solid #d40d0d",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#d40d0d";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#d40d0d";
          }}
        >
          Login to GitHub
        </button>
      )}
    </div>
  );
}
