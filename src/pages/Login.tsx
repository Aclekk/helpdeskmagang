'use client'

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
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";

const Login = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError("Email dan password wajib diisi");
      setIsLoading(false);
      return;
    }

    // Coba login
    const success = await login(email, password);

    if (success) {
      // Login berhasil - redirect ke halaman sebelumnya atau home
      localStorage.removeItem('redirectPath');
      router.push(from);
    } else {
      // Login gagal
      setError(
        "Email atau password salah. Pastikan menggunakan email @tangerangkota.go.id",
      );
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

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@tangerangkota.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
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
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Hanya pegawai dengan email resmi @tangerangkota.go.id yang dapat
                mengakses layanan ini
              </p>

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

        {/* Demo Credentials Info - Hapus saat production */}
        <Card className="mt-4 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="pt-4">
            <p className="text-center text-xs text-blue-700 dark:text-blue-300">
              <strong>Demo:</strong> Gunakan email @tangerangkota.go.id dan
              password minimal 6 karakter
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
