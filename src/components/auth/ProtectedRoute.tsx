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

  // Tampilkan loading saat check auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Kalau belum login, redirect ke /login
  // Simpan current path di localStorage biar bisa balik kesini setelah login
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectPath', pathname);
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  // Kalau sudah login, tampilkan children
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
