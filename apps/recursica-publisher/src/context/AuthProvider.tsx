import React, { useCallback, useEffect, useState } from "react";
import { AuthContext, type IAuthContext, type AuthUser } from "./AuthContext";
import {
  GitHubService,
  type GitHubRepo,
} from "../services/github/githubService";
import { callPlugin } from "../utils/callPlugin";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  // Load auth data on mount using callPlugin
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { promise } = callPlugin("loadAuthData", {});
        const response = await promise;
        if (response.success && response.data) {
          const data = response.data as {
            accessToken?: string;
            selectedRepo?: GitHubRepo;
          };
          setAccessToken(data.accessToken || null);
          setSelectedRepo(data.selectedRepo || null);
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      }
    };
    loadAuth();
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

  const saveAccessToken = useCallback(async (accessToken: string) => {
    // Save to storage using callPlugin
    try {
      await callPlugin("storeAuthData", { accessToken }).promise;
      setAccessToken(accessToken);
    } catch (error) {
      console.error("Error saving access token:", error);
      // Still set it locally even if storage fails
      setAccessToken(accessToken);
    }
  }, []);

  const saveSelectedRepo = useCallback(
    async (repo: GitHubRepo) => {
      setSelectedRepo(repo);
      // Save to storage using callPlugin
      try {
        await callPlugin("storeAuthData", {
          accessToken,
          selectedRepo: repo,
        }).promise;
      } catch (error) {
        console.error("Error saving selected repo:", error);
        // Still set it locally even if storage fails
      }
    },
    [accessToken],
  );

  const deleteAccessToken = useCallback(async () => {
    // Clear from storage using callPlugin
    try {
      await callPlugin("clearAuthData", {}).promise;
      setAccessToken(null);
    } catch (error) {
      console.error("Error clearing access token:", error);
      // Still clear it locally even if storage fails
      setAccessToken(null);
    }
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
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
