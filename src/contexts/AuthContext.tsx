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
  whatsapp?: string;
}

// Type untuk Auth Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    nip: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string }>;
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
    if (typeof window !== "undefined") {
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

  const login = async (
    nip: string,
    password: string,
  ): Promise<{ ok: boolean; message?: string }> => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/opendata-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ uid: nip, pid: password }),
      });
      const data = await res.json().catch(() => ({}));

      // ✅ DEBUG — liat semua field dari response API
      console.log(
        "=== LOGIN RESPONSE (full) ===",
        JSON.stringify(data, null, 2),
      );

      if (!res.ok || data?.status === false) {
        setIsLoading(false);
        return { ok: false, message: data?.error || "NIP atau password salah" };
      }

      // Extract user data from API response
      const apiData = data?.data || data;

      // ✅ DEBUG — liat field spesifik yang ada
      console.log("=== API DATA FIELDS ===", {
        email: apiData?.email,
        email_pegawai: apiData?.email_pegawai,
        mail: apiData?.mail,
        nama_pegawai: apiData?.nama_pegawai,
        nip: apiData?.nip,
        whatsapp: apiData?.whatsapp,
        no_hp: apiData?.no_hp,
      });

      // Ambil email dari API, fallback ke format nip@tangerangkota.go.id
      const emailFromApi =
        apiData?.email ||
        apiData?.email_pegawai ||
        apiData?.mail ||
        apiData?.email_resmi ||
        null;

      const resolvedEmail =
        emailFromApi ?? `${apiData?.nip || nip}@tangerangkota.go.id`;

      const userData: User = {
        email: resolvedEmail,
        name:
          apiData?.nama_pegawai ||
          apiData?.nama_lengkap ||
          apiData?.nama ||
          apiData?.name ||
          nip,
        nip: apiData?.nip || nip,
        avatar:
          apiData?.foto || apiData?.url_foto || apiData?.avatar || undefined,
        whatsapp:
          apiData?.whatsapp ||
          apiData?.no_wa ||
          apiData?.no_hp ||
          apiData?.nomor_hp ||
          apiData?.telp ||
          undefined,
      };

      // ✅ DEBUG — liat user object yang akan disimpan
      console.log("=== USER OBJECT ===", userData);

      if (typeof window !== "undefined") {
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

  const logout = () => {
    if (typeof window !== "undefined") {
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
