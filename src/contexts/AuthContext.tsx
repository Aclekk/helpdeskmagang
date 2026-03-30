import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Type untuk user data
interface User {
  email: string;
  name: string;
  nip?: string;
  avatar?: string;
}

// Type untuk Auth Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (nip: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage saat pertama load
  useEffect(() => {
    // Hanya akses localStorage di client-side
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("helpdesk_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("helpdesk_user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/opendata-login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ uid: email, pid: password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.status === false) {
        setIsLoading(false);
        return { ok: false, message: data?.error || "NIP atau password salah" };
      }

      // Create user object
      const userData: User = {
        email: email,
        name: email,
        nip: email,
        avatar: undefined,
      };

      // Save to localStorage (hanya di client-side)
      if (typeof window !== 'undefined') {
        localStorage.setItem("helpdesk_user", JSON.stringify(userData));
        if (data?.token) {
          localStorage.setItem("helpdesk_token", String(data.token));
        }
      }
      setUser(userData);
      setIsLoading(false);
      return { ok: true };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { ok: false, message: "Gagal menghubungkan ke server" };
    }
  };

  // Logout function
  const logout = () => {
    // Hanya akses localStorage di client-side
    if (typeof window !== 'undefined') {
      localStorage.removeItem("helpdesk_user");
    }
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk pakai auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
