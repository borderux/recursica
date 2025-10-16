import React, { useCallback, useEffect, useState } from "react";
import { AuthContext, type IAuthContext, type AuthUser } from "./AuthContext";
import {
  GitHubService,
  type GitHubRepo,
} from "../services/github/githubService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;
      switch (pluginMessage.type) {
        case "auth-data-loaded":
          if (pluginMessage.success) {
            setAccessToken(pluginMessage.accessToken || null);
            setSelectedRepo(pluginMessage.selectedRepo || null);
          }
          break;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getUser = useCallback(
    async (token?: string) => {
      const usedToken = token ?? accessToken;
      if (usedToken) {
        const githubService = new GitHubService(usedToken);
        const user = await githubService.getUser();
        setUser({
          id: user.id.toString(),
          name: user.name || "",
          email: user.email || "",
          avatar_url: user.avatar_url || "",
        });
        setIsAuthenticated(true);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    if (accessToken) {
      getUser();
    }
  }, [accessToken, getUser]);

  const saveAccessToken = useCallback((accessToken: string) => {
    // Save to storage
    parent.postMessage(
      {
        pluginMessage: {
          type: "store-auth-data",
          accessToken,
        },
        pluginId: "*",
      },
      "*",
    );
    setAccessToken(accessToken);
  }, []);

  const saveSelectedRepo = useCallback(
    (repo: GitHubRepo) => {
      setSelectedRepo(repo);
      parent.postMessage(
        {
          pluginMessage: {
            type: "store-auth-data",
            selectedRepo: repo,
            accessToken,
          },
        },
        "*",
      );
    },
    [accessToken],
  );

  const deleteAccessToken = useCallback(() => {
    parent.postMessage({ pluginMessage: { type: "clear-auth-data" } }, "*");
    setAccessToken(null);
  }, []);

  const login = async (token: string) => {
    saveAccessToken(token);
    getUser();
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    deleteAccessToken();
  };

  const contextValue: IAuthContext = {
    isAuthenticated,
    user,
    accessToken,
    selectedRepo,
    saveAccessToken,
    saveSelectedRepo,
    deleteAccessToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
