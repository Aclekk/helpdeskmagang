"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";

// ✅ Helper: ambil redirect path — prioritas URL query param, fallback localStorage
function getRedirectPath(fromQuery: string | null): string {
  if (fromQuery) return decodeURIComponent(fromQuery);
  if (typeof window !== "undefined") {
    return localStorage.getItem("redirectPath") || "/";
  }
  return "/";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("from"); // ?from=/services/video-conference
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Kalau udah login (refresh/back), redirect ke tujuan
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = getRedirectPath(fromQuery);
      localStorage.removeItem("redirectPath");
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, fromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("NIP dan password wajib diisi");
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.ok) {
      // ✅ Ambil redirect path saat login berhasil
      const redirectTo = getRedirectPath(fromQuery);
      localStorage.removeItem("redirectPath");
      router.replace(redirectTo);
    } else {
      setError(result.message || "NIP atau password salah");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container max-w-md">
        <Card className="border-slate-200/60 shadow-xl dark:border-slate-800/60">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-xl" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <Image
                    src={logoHelpdesk}
                    alt="Helpdesk TIK Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Helpdesk TIK
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  type="text"
                  placeholder="Masukkan NIP"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Gunakan NIP pegawai untuk login
              </p>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ✅ Wrap dengan Suspense karena useSearchParams butuh ini di Next.js
const Login = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }
  >
    <LoginForm />
  </Suspense>
);

export default Login;
