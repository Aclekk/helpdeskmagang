"use client";

import dynamic from "next/dynamic";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const VideoConferenceHistory = dynamic(
  () => import("@/components/services/VideoConferenceHistory"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data riwayat...</p>
        </div>
      </div>
    ),
  },
);

export default function VideoConferenceHistoryPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear error on mount
    setError(null);
  }, []);

  if (error) {
    return (
      <AppLayout>
        <ProtectedRoute>
          <div className="container py-10">
            <div className="text-center p-8">
              <div className="text-red-600 mb-4">
                Terjadi kesalahan: {error}
              </div>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </ProtectedRoute>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ProtectedRoute>
        <div className="container py-10">
          <Link
            href="/request/video-conference"
            className="group mb-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Permohonan Zoom
          </Link>
          <div className="error-boundary">
            <VideoConferenceHistory />
          </div>
        </div>
      </ProtectedRoute>
    </AppLayout>
  );
}
