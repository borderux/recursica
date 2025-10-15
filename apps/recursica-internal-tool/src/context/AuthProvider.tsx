import React, { useCallback, useEffect, useState } from "react";
import { AuthContext, type IAuthContext, type AuthUser } from "./AuthContext";
import { GitHubService } from "../services/github/githubService";
import { usePlugin } from "./usePlugin";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { accessToken, saveAccessToken, deleteAccessToken } = usePlugin();

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
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
