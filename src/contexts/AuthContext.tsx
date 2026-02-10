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
}

// Type untuk Auth Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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

  // Login function - SIMPLE VERSION
  // Nanti bisa diganti dengan API call ke backend
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // TODO: Replace dengan actual API call
      // Untuk sekarang, simulasi delay + validasi simple
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Validasi email domain
      if (!email.endsWith("@tangerangkota.go.id")) {
        setIsLoading(false);
        return false;
      }

      // Simple password check (minimal 6 karakter)
      if (password.length < 6) {
        setIsLoading(false);
        return false;
      }

      // Create user object
      const userData: User = {
        email: email,
        name: email.split("@")[0], // Ambil nama dari email
        nip: undefined, // Bisa diisi dari API nanti
      };

      // Save to localStorage (hanya di client-side)
      if (typeof window !== 'undefined') {
        localStorage.setItem("helpdesk_user", JSON.stringify(userData));
      }
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
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
