import React, { useState, useEffect } from "react";
import { AuthContext, type IAuthContext, type AuthUser } from "./AuthContext";
import {
  getLocalStorage,
  saveInStorage,
  clearStorage,
} from "../services/auth/authStorage";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load authentication state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storage = (await getLocalStorage()) as {
          accessToken: string | null;
          platform: string | null;
          selectedProject: string | null;
          agreedPublishChanges: string | null;
        };

        if (storage.accessToken) {
          setAccessToken(storage.accessToken);
          setIsAuthenticated(true);

          // Try to get user info from GitHub API
          try {
            const githubService = new (
              await import("../services/github/githubService")
            ).GitHubService(storage.accessToken);
            const userInfo = await githubService.getUser();
            setUser({
              id: userInfo.id.toString(),
              name: userInfo.name || userInfo.login,
              email: userInfo.email || undefined,
            });
          } catch (apiError) {
            console.warn("Could not fetch user info from GitHub:", apiError);
            // Fallback to placeholder
            setUser({
              id: "user-id",
              name: "User",
            });
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = (token: string, userData: AuthUser) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);

    // Save to storage
    saveInStorage("accessToken", token);
    saveInStorage("platform", "github");
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear storage
    await clearStorage();
  };

  const contextValue: IAuthContext = {
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    loading,
    setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
