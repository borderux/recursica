import { createContext } from "react";

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

  // Authentication actions
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
