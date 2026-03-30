'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";

const Login = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ambil redirect path dari localStorage (dari ProtectedRoute)
  const from = typeof window !== 'undefined' ? localStorage.getItem('redirectPath') || "/" : "/";

  // Kalau udah login, redirect
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem('redirectPath');
      router.push(from);
    }
  }, [isAuthenticated, router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi input
    if (!email || !password) {
      setError("NIP dan password wajib diisi");
      setIsLoading(false);
      return;
    }

    // Coba login
    const result = await login(email, password);

    if (result.ok) {
      // Login berhasil - redirect ke halaman sebelumnya atau home
      localStorage.removeItem('redirectPath');
      router.push(from);
    } else {
      // Login gagal
      setError(result.message || "NIP atau password salah");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container max-w-md">
        <Card className="border-slate-200/60 shadow-xl dark:border-slate-800/60">
          <CardHeader className="space-y-4 text-center">
            {/* Logo */}
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

            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Helpdesk TIK
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* NIP Field */}
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

              {/* Password Field with Show/Hide Toggle */}
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
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
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

              {/* Info Text */}
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">Gunakan NIP pegawai untuk login</p>

              {/* Back to Home */}
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
};

export default Login;
