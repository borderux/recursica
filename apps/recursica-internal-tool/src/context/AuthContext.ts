import { createContext } from "react";
import type { GitHubRepo } from "../services/github/githubService";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
}

export interface IAuthContext {
  // Authentication state
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  selectedRepo: GitHubRepo | null;
  saveAccessToken: (accessToken: string) => void;
  saveSelectedRepo: (repo: GitHubRepo) => void;
  deleteAccessToken: () => void;
  // Authentication actions
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
