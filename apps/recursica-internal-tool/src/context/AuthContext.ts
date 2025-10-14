import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
}

export interface IAuthContext {
  // Authentication state
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;

  // Authentication actions
  login: (accessToken: string, user: AuthUser) => void;
  logout: () => void;

  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
