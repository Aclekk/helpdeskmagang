"use client";

import dynamic from "next/dynamic";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const VpnHistory = dynamic(
  () => import("src/components/services/VpnHistory"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Memuat riwayat VPN...</p>
        </div>
      </div>
    ),
  }
);

export default function VpnHistoryPage() {
  return (
    <AppLayout>
      <ProtectedRoute>
        <div className="container py-10">
          <Link
            href="/request/vpn"
            className="group mb-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Permohonan VPN
          </Link>
          <VpnHistory />
        </div>
      </ProtectedRoute>
    </AppLayout>
  );
}
