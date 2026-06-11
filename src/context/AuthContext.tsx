import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, ApiError, setToken, clearToken, getToken } from "../lib/api";

export interface AdminUser {
  email: string;
  name: string;
  role: "admin" | "editor";
  avatar?: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The server is the authority on whether a stored token is still valid.
  useEffect(() => {
    let cancelled = false;
    const validate = async () => {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const { user } = await api.get<{ user: AdminUser }>("/auth/me");
        if (!cancelled) setUser(user);
      } catch {
        clearToken();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    validate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const { token, user } = await api.post<{ token: string; user: AdminUser }>("/auth/login", { email, password });
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) return { success: false, message: "Too many failed attempts. Please wait a minute and try again." };
        if (err.status === 422) return { success: false, message: "Invalid email or password. Please try again." };
        return { success: false, message: err.message };
      }
      return { success: false, message: "Could not reach the server. Is the backend running?" };
    }
  };

  const logout = () => {
    api.post("/auth/logout").catch(() => {
      /* token may already be expired — local cleanup below still applies */
    });
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
