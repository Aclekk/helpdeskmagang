"use client";

import { FolderOpen, Plus } from "lucide-react";

interface SubdomainListProps {
  onAddNew: () => void;
}

export default function SubdomainList({ onAddNew }: SubdomainListProps) {
  // TODO: Nanti akan diisi dengan data dari database/API
  const pengajuanList: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Layanan Subdomain
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Kelola dan ajukan subdomain untuk aplikasi Anda
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-slate-950/50">
          {/* Top Accent Border */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-blue-500 to-amber-500" />

          {/* Card Header */}
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:from-slate-900/80 dark:to-slate-900/60 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Daftar Pengajuan Subdomain
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Kelola seluruh pengajuan subdomain Anda di sini
                </p>
              </div>
              <button
                onClick={onAddNew}
                className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/40 active:scale-100 dark:from-blue-600 dark:to-blue-700 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Plus className="relative z-10 h-5 w-5" />
                <span className="relative z-10 text-sm">
                  Tambah Pengajuan Baru
                </span>
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-8 py-20">
            {pengajuanList.length === 0 ? (
              // Enhanced Empty State
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-amber-400/20 to-blue-400/20 blur-2xl" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-8 dark:from-slate-800 dark:to-slate-900">
                    <FolderOpen
                      className="h-24 w-24 text-slate-400 dark:text-slate-600"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-white">
                  Belum Ada Pengajuan
                </h3>
                <p className="mb-8 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  Anda belum memiliki pengajuan subdomain. Klik tombol di atas
                  untuk membuat pengajuan pertama Anda.
                </p>

                <button
                  onClick={onAddNew}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Buat Pengajuan Pertama</span>
                </button>
              </div>
            ) : (
              // TODO: Nanti tampilkan daftar pengajuan di sini
              <div className="space-y-4">
                {/* Table atau list pengajuan akan ditambahkan nanti */}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="rounded-xl border border-slate-200/60 bg-gradient-to-r from-blue-50/50 to-slate-50/50 p-6 dark:border-slate-800/60 dark:from-blue-950/20 dark:to-slate-900/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Informasi
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-400">
                Pengajuan subdomain akan diproses oleh tim IT dalam waktu
                maksimal 2x24 jam. Pastikan semua informasi yang Anda berikan
                sudah benar dan lengkap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
