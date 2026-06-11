import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

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

// NOTE: This is demo/client-side authentication only. Anything shipped to the
// browser can be inspected and bypassed — a real deployment must authenticate
// against a server (the planned Laravel backend) and never trust the client.
// Credentials are stored as SHA-256("email:password") so plaintext passwords
// do not appear in the bundle.
const DEMO_USERS: { email: string; passwordHash: string; name: string; role: "admin" | "editor" }[] = [
  { email: "admin@de-ebrightmarn.com", passwordHash: "2adb0b910f54486646266c97957edee3d47f6834260a5c5e6bbf59f5dcc10e37", name: "Site Administrator", role: "admin" },
  { email: "editor@de-ebrightmarn.com", passwordHash: "6cc79d159916bb276ec8aa2d57a12ea6f904f9d9009afeb598592e8322db978e", name: "Content Editor", role: "editor" },
];

const SESSION_KEY = "admin_user";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 1000;

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface StoredSession extends AdminUser {
  expiresAt: number;
}

function readStoredSession(): AdminUser | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as Partial<StoredSession>;
    // Only accept sessions that match a known user and have not expired.
    const known = DEMO_USERS.find((u) => u.email === parsed.email && u.role === parsed.role);
    if (!known || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return { email: known.email, name: known.name, role: known.role };
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const attempts = useRef({ count: 0, lockedUntil: 0 });

  useEffect(() => {
    setUser(readStoredSession());
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const now = Date.now();
    if (now < attempts.current.lockedUntil) {
      const wait = Math.ceil((attempts.current.lockedUntil - now) / 1000);
      return { success: false, message: `Too many failed attempts. Try again in ${wait}s.` };
    }

    const hash = await sha256Hex(`${email.trim().toLowerCase()}:${password}`);
    const found = DEMO_USERS.find((u) => u.email === email.trim().toLowerCase() && u.passwordHash === hash);

    if (!found) {
      attempts.current.count += 1;
      if (attempts.current.count >= MAX_ATTEMPTS) {
        attempts.current.lockedUntil = now + LOCKOUT_MS;
        attempts.current.count = 0;
        return { success: false, message: "Too many failed attempts. Account temporarily locked." };
      }
      return { success: false, message: "Invalid email or password. Please try again." };
    }

    attempts.current = { count: 0, lockedUntil: 0 };
    const u: AdminUser = { email: found.email, name: found.name, role: found.role };
    const session: StoredSession = { ...u, expiresAt: now + SESSION_DURATION_MS };
    setUser(u);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable — session lives in memory only */
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
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
