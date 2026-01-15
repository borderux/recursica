import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { apiService, pluginTokenToCode } from "../services/auth/auth";
import { useNavigate } from "react-router";
import { GitHubService } from "../services/github/githubService";
import { callPlugin } from "../utils/callPlugin";
import { PageLayout } from "../components/PageLayout";

const Status = {
  Login: "Login",
  WaitingForAuthorization: "WaitingForAuthorization",
  CheckingAccess: "CheckingAccess",
  Error: "Error",
} as const;

type StatusType = (typeof Status)[keyof typeof Status];

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

export function PublishAuth() {
  const [status, setStatus] = useState<StatusType>(Status.Login);
  const [userId, setUserId] = useState<string | null>(null);
  const { login, isAuthenticated, accessToken } = useAuth();
  const navigate = useNavigate();

  const checkRepositoryAccess = useCallback(
    async (token: string): Promise<boolean> => {
      try {
        setStatus(Status.CheckingAccess);
        // Use the authenticated user's token to check access
        const githubService = new GitHubService(token);

        // Verify we're checking access for the currently authenticated user
        const user = await githubService.getUser();
        console.log(
          `[PublishAuth] Checking repository access for authenticated user: ${user.login}`,
        );
        // Check if this user has write access to the recursica-figma repository
        const hasAccess = await githubService.checkRepositoryAccess(
          RECURSICA_FIGMA_OWNER,
          RECURSICA_FIGMA_REPO,
        );

        console.log(
          `[PublishAuth] User ${user.login} has ${hasAccess ? "write" : "no write"} access to ${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}`,
        );

        return hasAccess;
      } catch (error) {
        console.error("Error checking repository access:", error);
        // Re-throw the error so it can be caught and handled properly
        if (error instanceof Error && error.message.includes("write access")) {
          throw error;
        }
        return false;
      }
    },
    [],
  );

  const pollForToken = useCallback(
    async (userId: string, readKey: string, code: string) => {
      const poll = async () => {
        try {
          const data = await apiService.getToken(userId, readKey, code);

          if (data.status === "authenticated") {
            console.log("Authentication successful!");
            // Login first to save the token
            login(data.accessToken);

            // Check repository access with the new token
            try {
              const hasAccess = await checkRepositoryAccess(data.accessToken);

              if (hasAccess) {
                navigate("/publish");
              } else {
                navigate("/publish/unauthorized");
              }
            } catch (error) {
              // If access check throws an error about write access, show unauthorized page
              if (
                error instanceof Error &&
                error.message.includes("write access")
              ) {
                console.error("[PublishAuth] Access denied:", error.message);
                navigate("/publish/unauthorized");
              } else {
                // For other errors, show error state
                console.error("[PublishAuth] Error checking access:", error);
                setStatus(Status.Error);
              }
            }
          } else if (data.status === "pending") {
            console.log("Still pending, continuing to poll...");
            setTimeout(poll, 5000); // Poll every 5 seconds
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

          if (
            errorMessage.includes("Authentication failed") ||
            errorMessage.includes("expired")
          ) {
            console.error("[PublishAuth] Authentication failed:", errorMessage);
            setStatus(Status.Error);
            return;
          }

          // For other errors, continue polling
          console.warn("[PublishAuth] Polling error (will retry):", error);
          setTimeout(poll, 5000); // Poll every 5 seconds
        }
      };

      // Start polling after a short delay
      setTimeout(poll, 2000);
    },
    [login, checkRepositoryAccess, navigate],
  );

  const handleLogin = async () => {
    if (!userId) {
      console.error("[PublishAuth] User ID is required but not available");
      setStatus(Status.Error);
      return;
    }

    setStatus(Status.WaitingForAuthorization);

    try {
      // Step 1: Generate keys using secure API service
      console.log("[PublishAuth] Generating keys for userId:", userId);
      const { readKey, writeKey, pluginToken } =
        await apiService.generateKeys(userId);
      setStatus(Status.WaitingForAuthorization);
      const code = pluginTokenToCode(pluginToken);

      // Step 2: Get authorization URL using secure API service
      console.log("[PublishAuth] Getting authorization URL");
      const { authUrl } = await apiService.authorize(
        userId,
        readKey,
        writeKey,
        code,
      );

      if (!authUrl) {
        throw new Error("No authorization URL returned");
      }

      // Step 3: Open the OAuth URL in a new tab
      console.log("[PublishAuth] Opening auth URL:", authUrl);
      window.open(authUrl, "_blank", "width=600,height=700");

      setStatus(Status.WaitingForAuthorization);

      // Step 4: Enhanced polling with better error handling
      pollForToken(userId, readKey, code);
    } catch (error) {
      console.error("[PublishAuth] Error in OAuth flow:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("[PublishAuth] Error details:", errorMessage);
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

  // If already authenticated, check access
  useLayoutEffect(() => {
    if (isAuthenticated && accessToken) {
      checkRepositoryAccess(accessToken)
        .then((hasAccess) => {
          if (hasAccess) {
            navigate("/publish");
          } else {
            navigate("/publish/unauthorized");
          }
        })
        .catch((error) => {
          // If access check throws an error about write access, show unauthorized page
          if (
            error instanceof Error &&
            error.message.includes("write access")
          ) {
            console.error("[PublishAuth] Access denied:", error.message);
            navigate("/publish/unauthorized");
          } else {
            // For other errors, show error state
            console.error("[PublishAuth] Error checking access:", error);
            setStatus(Status.Error);
          }
        });
    }
  }, [isAuthenticated, accessToken, checkRepositoryAccess, navigate]);

  return (
    <PageLayout showBackButton={false}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Publish Authentication</h1>
        <p style={{ marginBottom: "20px", textAlign: "center" }}>
          To publish to the recursica Figma component library, you need to
          authenticate with GitHub and have write access to the repository.
        </p>
        {status === Status.WaitingForAuthorization && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔗</div>
            <h3>Check your browser</h3>
            <p>Go to the authentication page and return here</p>
          </div>
        )}

        {status === Status.CheckingAccess && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>⏳</div>
            <h3>Checking access...</h3>
            <p>Verifying your permissions to publish</p>
          </div>
        )}

        {status === Status.Error && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p style={{ color: "#c62828", marginBottom: "10px" }}>
              Seems like there was an error connecting
            </p>
            <p
              style={{
                color: "#666",
                fontSize: "12px",
                marginTop: "10px",
              }}
            >
              Check the browser console for more details. If you see an error
              about VITE_RECURSICA_API_URL, please ensure the environment
              variable is set.
            </p>
          </div>
        )}

        {!isAuthenticated && status === Status.Login && (
          <button
            onClick={handleLogin}
            disabled={false}
            style={{
              width: "200px",
              padding: "20px",
              fontSize: "18px",
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
            Login with GitHub
          </button>
        )}
      </div>
    </PageLayout>
  );
}
