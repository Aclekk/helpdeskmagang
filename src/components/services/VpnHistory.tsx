"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Eye, Shield, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VpnListItem } from "@/lib/semantik";

// ─── Helper: label & warna status ────────────────────────────────────────────

function getStatusLabel(status: string): string {
  switch (status) {
    case "verifikasi":  return "Verifikasi";
    case "persetujuan": return "Persetujuan";
    case "pembuatan":   return "Pembuatan";
    case "selesai":     return "Selesai";
    case "tolak":       return "Ditolak";
    default:            return status;
  }
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  verifikasi: { label: "Verifikasi", className: "bg-blue-500 text-white" },
  persetujuan: { label: "Persetujuan", className: "bg-amber-400 text-white" },
  pembuatan: { label: "Pembuatan", className: "bg-purple-500 text-white" },
  selesai: { label: "Selesai", className: "bg-emerald-500 text-white" },
  tolak: { label: "Ditolak", className: "bg-red-500 text-white" },
};

function getStatusColor(status: string): string {
  return STATUS_CONFIG[status]?.className || STATUS_CONFIG.verifikasi.className;
}

/** Sesuai arahan supervisor */
function getApprovalLabel(item: VpnListItem): string {
  if (item.status === "pembuatan" || item.status === "selesai") return "Approved";
  if (item.status === "persetujuan") return "Pending approval";
  if (item.status === "tolak") return "Ditolak";
  return "";
}

function formatTanggal(dateStr: string): string {
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: localeId });
  } catch {
    return dateStr;
  }
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

export default function VpnHistory() {
  const router = useRouter();
  const [data, setData] = useState<VpnListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/vpn`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        // Beberapa API bungkus dalam { data: [] }, handle keduanya
        setData(Array.isArray(json) ? json : (json?.data ?? []));
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (item) =>
        q === "" ||
        item.namaPemohon?.toLowerCase().includes(q) ||
        item.instansi?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const thClass =
    "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Riwayat VPN
        </h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Memuat data riwayat dari server...
            </p>
          </div>
        </div>
      )}

      {!loading && (
        <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
          <div className="h-1.5 w-full bg-blue-600" />
          <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Daftar Permohonan VPN Anda
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
              {/* Page size selector */}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Tampilkan
                </span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  data per halaman
                </span>
              </div>

              {/* Search input */}
              <div className="relative flex items-center w-full sm:w-auto">
                <svg
                  className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <Input
                  placeholder="Cari nama atau instansi..."
                  className="pl-9 pr-4 h-9 w-full sm:w-[320px] text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus-visible:ring-blue-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Hapus pencarian"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                    <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-12 border-r border-slate-200 dark:border-slate-700">
                      No
                    </th>
                    <th className={thClass}>Tanggal</th>
                    <th className={thClass}>Nama Pemohon</th>
                    <th className={thClass}>Instansi</th>
                    <th className={thClass}>Jenis</th>
                    <th className={thClass}>Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {error && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                        Gagal memuat data: {error}
                      </td>
                    </tr>
                  )}
                  {!error && paginated.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                        {data.length === 0
                          ? "Belum ada permohonan VPN."
                          : "Tidak ada data yang cocok."}
                      </td>
                    </tr>
                  )}
                  {!error &&
                    paginated.map((item, idx) => {
                      const approvalLabel = getApprovalLabel(item);
                      return (
                        <tr
                          key={item.id}
                          className="group bg-white hover:bg-slate-50/70 dark:bg-transparent dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 px-4 py-3 text-slate-500 text-center border-r border-slate-200 dark:border-slate-700 group-hover:bg-slate-50/70">
                            {(page - 1) * pageSize + idx + 1}
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {formatTanggal(item.tanggalPermohonan)}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-white/40 uppercase">
                              Permohonan
                            </p>
                          </td>
                          <td className="px-4 py-3 text-slate-900 max-w-[200px]">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                {item.namaPemohon
                                  ?.split(" ")
                                  .slice(0, 2)
                                  .map((w) => w[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {item.namaPemohon}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-white/40 uppercase">
                                  {item.jabatanPemohon}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-[180px]">
                            <span className="line-clamp-2">{item.instansi}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 capitalize border border-slate-200 dark:border-white/5">
                              {item.jenisPermohonan}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}
                            >
                              {getStatusLabel(item.status)}
                            </span>
                            <p className="mt-1 text-xs text-slate-500 dark:text-white/40 italic">
                              {item.statusDetail ?? approvalLabel}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => router.push(`/request/vpn/history/${item.id}`)}
                                className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm"
                              >
                                <Eye className="h-3.5 w-3.5" /> Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
              <p className="text-sm text-slate-500">
                Menampilkan{" "}
                <span className="font-medium text-slate-700">
                  {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, filtered.length)}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-slate-700">
                  {filtered.length}
                </span>{" "}
                data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`e${i}`}
                        className="px-1 text-slate-400 text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded border text-sm font-medium transition-colors ${p === page ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}