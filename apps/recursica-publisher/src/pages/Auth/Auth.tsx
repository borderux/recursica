import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";
import { apiService, pluginTokenToCode } from "../../services/auth/auth";
import { callPlugin } from "../../utils/callPlugin";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Stack } from "../../components/Stack";
import classes from "./Auth.module.css";

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
            navigate("/");
          } else if (data.status === "pending") {
            console.log("Still pending, continuing to poll...");
            setTimeout(poll, 5000);
          }
        } catch (error) {
          setStatus(Status.Error);
          console.warn("Polling error (will retry):", error);
          setTimeout(poll, 5000);
        }
      };

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
      const { readKey, writeKey, pluginToken } =
        await apiService.generateKeys(userId);
      setStatus(Status.WaitingForAuthorization);
      const code = pluginTokenToCode(pluginToken);

      const { authUrl } = await apiService.authorize(
        userId,
        readKey,
        writeKey,
        code,
      );

      window.open(authUrl, "_blank", "width=600,height=700");

      setStatus(Status.WaitingForAuthorization);

      pollForToken(userId, readKey, code);
    } catch (error) {
      console.error("Error in OAuth flow:", error);
      setStatus(Status.Error);
    }
  };

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={classes.root}>
      <Title order={1}>Login to GitHub</Title>
      {status === Status.WaitingForAuthorization && (
        <Stack gap={20} align="center">
          <div style={{ fontSize: "32px" }}>🔗</div>
          <Title order={3}>Check your browser</Title>
          <Text variant="body">
            Go to the authentication page and return here
          </Text>
        </Stack>
      )}

      {status === Status.Error && (
        <Text variant="body" color="error" className={classes.errorText}>
          Seems like there was an error connecting
        </Text>
      )}

      {!isAuthenticated && (
        <Button
          variant="outline"
          color="red"
          onClick={handleLogin}
          className={classes.button}
        >
          Login to GitHub
        </Button>
      )}
    </div>
  );
}
