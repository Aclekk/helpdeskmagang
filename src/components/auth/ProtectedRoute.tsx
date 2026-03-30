'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Kalau belum login, redirect ke /login
  // Simpan current path di localStorage biar bisa balik kesini setelah login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      localStorage.setItem('redirectPath', pathname || '/');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Tampilkan loading saat check auth
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
          <p className="mt-6 text-lg font-medium text-slate-600 dark:text-slate-400">Memuat...</p>
        </div>
      </div>
    );
  }

  // Kalau sudah login, tampilkan children
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
