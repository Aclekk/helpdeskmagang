"use client";

import { useEffect, useState } from "react";
import {
  GitBranch,
  Plus,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";

interface RepositoryListProps {
  onAddNew: () => void;
  onBack?: () => void;
}

interface Permohonan {
  id: number;
  noTiket: string;
  namaAplikasi: string;
  jenisAplikasi: string;
  unitKerjaPengelola: string;
  namaPic: string;
  nomorKontakPic: string;
  subdomain: string;
  bahasaPemrograman: string;
  framework: string;
  database: string;
  webServer: string;
  modulLainnya: string;
  tanggalPermohonan: string;
  tanggalRencanaPublikasi: string;
  namaProyek: string;
  tujuanPembuatan: string;
  namaRepository: string;
  tanggalBerakhir: string;
  jenisDomain: string;
  usulanNamaDomain: string;
  jenisAkses: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  approveNotes: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  persons: Personil[];
}

interface Personil {
  namaPersonil: string;
  usernameGitlab: string;
  jabatanPeran: string;
  keterangan: string;
}

interface PermohonanDetail {
  id: number;
  noTiket: string;
  namaAplikasi: string;
  jenisAplikasi: string;
  unitKerjaPengelola: string;
  namaPic: string;
  nomorKontakPic: string;
  subdomain: string;
  bahasaPemrograman: string;
  framework: string;
  database: string;
  webServer: string;
  modulLainnya: string;
  tanggalPermohonan: string;
  tanggalRencanaPublikasi: string;
  namaProyek: string;
  tujuanPembuatan: string;
  namaRepository: string;
  tanggalBerakhir: string;
  jenisDomain: string;
  usulanNamaDomain: string;
  jenisAkses: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  approveNotes: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  persons: Personil[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  menunggu: {
    label: "Menunggu",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  menunggu_approval: {
    label: "Menunggu Approval",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  disetujui: {
    label: "Disetujui",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  ditolak: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  selesai: {
    label: "Selesai",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

export default function RepositoryGitList({
  onAddNew,
  onBack,
}: RepositoryListProps) {
  const [pengajuanList, setPengajuanList] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PermohonanDetail | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/repository/permohonan");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setPengajuanList(Array.isArray(data) ? data : (data.data ?? []));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = (id: number) => {
    const found = pengajuanList.find((item) => item.id === id);
    if (found) {
      setSelectedDetail(found as unknown as PermohonanDetail);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (status: string) =>
    statusConfig[status?.toLowerCase()] ?? {
      label: status ?? "Tidak diketahui",
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          <Link
            href="/services/repository-git"
            className="group mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Detail Layanan
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Layanan Repository
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Kelola dan ajukan repository untuk proyek pengembangan Anda
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-slate-950/50">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

          {/* Card Header */}
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:from-slate-900/80 dark:to-slate-900/60 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Daftar Pengajuan Repository
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Kelola seluruh pengajuan repository Anda di sini
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="group inline-flex h-12 items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="group inline-flex h-12 items-center gap-2.5 rounded-xl border-2 border-slate-300 bg-white px-6 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">Kembali</span>
                  </button>
                )}
                <button
                  onClick={onAddNew}
                  className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Plus className="relative z-10 h-5 w-5" />
                  <span className="relative z-10 text-sm">
                    Ajukan Repository Baru
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-8 py-8">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-slate-500 dark:text-slate-400">
                  Memuat data permohonan...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <p className="text-red-500 font-medium">
                  Gagal memuat data permohonan
                </p>
                <button
                  onClick={fetchData}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" /> Coba lagi
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && pengajuanList.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="relative mb-8">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 blur-2xl" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-8 dark:from-slate-800 dark:to-slate-900">
                    <GitBranch
                      className="h-24 w-24 text-slate-400 dark:text-slate-600"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-white">
                  Belum Ada Pengajuan Repository
                </h3>
                <p className="mb-8 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  Anda belum memiliki pengajuan repository. Klik tombol di atas
                  untuk mengajukan repository baru.
                </p>
                <button
                  onClick={onAddNew}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 font-medium text-slate-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Buat Pengajuan Pertama</span>
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && pengajuanList.length > 0 && (
              <div className="overflow-hidden rounded-xl border-2 border-slate-200/80 dark:border-slate-700/80">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-b-2 border-slate-200/80 dark:border-slate-700/80">
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          No. Tiket
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          Nama Aplikasi
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          Nama Proyek
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          Unit Kerja
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          Tanggal
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          Status
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {pengajuanList.map((item) => {
                        const status = getStatus(item.status);
                        return (
                          <tr
                            key={item.id}
                            className="bg-white dark:bg-slate-900/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="px-5 py-4 text-sm font-mono font-medium text-blue-600 dark:text-blue-400">
                              {item.noTiket ?? "-"}
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                              {item.namaAplikasi ?? "-"}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {item.namaProyek ?? "-"}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {item.unitKerjaPengelola ?? "-"}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {formatDate(item.tanggalPermohonan)}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => fetchDetail(item.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Detail
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50/50 to-slate-50/50 p-6 dark:border-blue-900/40 dark:from-blue-950/20 dark:to-slate-900/20">
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
                Pengajuan repository akan diproses oleh tim IT dalam waktu
                maksimal 2x24 jam. Pastikan semua informasi yang Anda berikan
                sudah benar dan lengkap.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {(selectedDetail || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-8 py-5 bg-white dark:bg-slate-900">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Detail Permohonan
                </h3>
                {selectedDetail && (
                  <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    {selectedDetail.noTiket}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-6">
              {detailLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : selectedDetail ? (
                <>
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">
                      Status:
                    </span>
                    {(() => {
                      const s = getStatus(selectedDetail.status);
                      return (
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s.className}`}
                        >
                          {s.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Informasi Aplikasi */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                      Informasi Aplikasi
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Nama Aplikasi",
                          value: selectedDetail.namaAplikasi,
                        },
                        {
                          label: "Jenis Aplikasi",
                          value: selectedDetail.jenisAplikasi,
                        },
                        {
                          label: "Unit Kerja",
                          value: selectedDetail.unitKerjaPengelola,
                        },
                        { label: "Subdomain", value: selectedDetail.subdomain },
                        { label: "Nama PIC", value: selectedDetail.namaPic },
                        {
                          label: "Kontak PIC",
                          value: selectedDetail.nomorKontakPic,
                        },
                        {
                          label: "Tanggal Permohonan",
                          value: formatDate(selectedDetail.tanggalPermohonan),
                        },
                        {
                          label: "Rencana Publikasi",
                          value: formatDate(
                            selectedDetail.tanggalRencanaPublikasi,
                          ),
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
                        >
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spesifikasi Teknis */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                      Spesifikasi Teknis
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Bahasa Pemrograman",
                          value: selectedDetail.bahasaPemrograman,
                        },
                        { label: "Framework", value: selectedDetail.framework },
                        { label: "Database", value: selectedDetail.database },
                        {
                          label: "Web Server",
                          value: selectedDetail.webServer,
                        },
                        {
                          label: "Modul Lainnya",
                          value: selectedDetail.modulLainnya,
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
                        >
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Repository */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                      Data Repository
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Nama Proyek",
                          value: selectedDetail.namaProyek,
                        },
                        {
                          label: "Nama Repository",
                          value: selectedDetail.namaRepository,
                        },
                        {
                          label: "Jenis Domain",
                          value: selectedDetail.jenisDomain,
                        },
                        {
                          label: "Usulan Nama Domain",
                          value: `${selectedDetail.usulanNamaDomain}.tangerangkota.go.id`,
                        },
                        {
                          label: "Jenis Akses",
                          value: selectedDetail.jenisAkses,
                        },
                        {
                          label: "Tanggal Berakhir",
                          value: formatDate(selectedDetail.tanggalBerakhir),
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
                        >
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                    {selectedDetail.tujuanPembuatan && (
                      <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Tujuan Pembuatan
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {selectedDetail.tujuanPembuatan}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Daftar Personil */}
                  {selectedDetail.persons?.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                        Daftar Personil
                      </p>
                      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nama
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Username GitLab
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Jabatan/Peran
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Keterangan
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {selectedDetail.persons.map((p, i) => (
                              <tr
                                key={i}
                                className="bg-white dark:bg-slate-900/50"
                              >
                                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                  {p.namaPersonil}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">
                                  {p.usernameGitlab}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                  {p.jabatanPeran}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                  {p.keterangan}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Info Approval */}
                  {(selectedDetail.approvedBy || selectedDetail.rejectedBy) && (
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                        Info Approval
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedDetail.approvedBy && (
                          <>
                            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3">
                              <p className="text-xs text-slate-500 mb-1">
                                Disetujui oleh
                              </p>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {selectedDetail.approvedBy}
                              </p>
                            </div>
                            {selectedDetail.approveNotes && (
                              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3">
                                <p className="text-xs text-slate-500 mb-1">
                                  Catatan
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {selectedDetail.approveNotes}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                        {selectedDetail.rejectedBy && (
                          <>
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3">
                              <p className="text-xs text-slate-500 mb-1">
                                Ditolak oleh
                              </p>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {selectedDetail.rejectedBy}
                              </p>
                            </div>
                            {selectedDetail.rejectReason && (
                              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3">
                                <p className="text-xs text-slate-500 mb-1">
                                  Alasan Penolakan
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {selectedDetail.rejectReason}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
