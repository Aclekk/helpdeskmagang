"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, RefreshCw, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── PERBAIKAN: Ganti import yang tidak ada dengan fetch langsung atau sesuaikan
// dengan fungsi yang benar-benar ada di @/lib/semantik
// Jika di @/lib/semantik ada getPermohonan, sesuaikan nama di bawah ini.
// Contoh placeholder — sesuaikan dengan export asli di semantik.ts kamu:
// import { getPermohonan, type PermohonanResponse } from "@/lib/semantik";

// Tipe response detail (sesuaikan dengan struktur API kamu)
interface DetailPermohonanResponse {
  status: boolean;
  message?: string;
  data?: {
    status: string;
    jadwal?: { linkZoom?: string }[];
  };
}

// Placeholder fungsi — GANTI dengan import asli dari @/lib/semantik
async function getDetailPermohonan(externalId: string): Promise<DetailPermohonanResponse> {
  // Ganti URL ini dengan endpoint API Semantik yang sebenarnya
  const res = await fetch(`/api/semantik/permohonan/${externalId}`);
  if (!res.ok) {
    return { status: false, message: "Gagal mengambil data" };
  }
  return res.json();
}

// ─── Types ──────────────────────────────────────────────────────────────────
type StatusType = "menunggu" | "disetujui" | "ditolak" | "selesai";
type SortField = "requestDate" | "judulKegiatan" | "instansi" | "tanggalPelaksanaan" | "status";
type SortDir = "asc" | "desc";

interface RiwayatItem {
  id: string;
  external_id: string;
  requestDate: string;
  judulKegiatan: string;
  tanggalPelaksanaan: string;
  waktuMulai: string;
  waktuSelesai: string;
  instansi: string;
  namaPemohon: string;
  jabatanPemohon: string;
  jumlahPeserta: string;
  lokasiAcara: string;
  perangkatDibutuhkan: string[];
  namaHost: string;
  email: string;
  whatsapp: string;
  kodeUnit: string;
  rapatBerulang: boolean;
  status: StatusType;
  linkZoom?: string;
  lastSync?: string;
}

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const getInitialData = (): RiwayatItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("video_conference_requests");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        external_id: item.external_id || item.id,
        linkZoom: item.linkZoom,
        lastSync: item.lastSync,
      }));
    }
  } catch (error) {
    console.error("Error loading stored data:", error);
  }

  return [];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDateTime(iso: string): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  menunggu: { label: "Menunggu", className: "bg-amber-400 text-white" },
  disetujui: { label: "Approved", className: "bg-emerald-500 text-white" },
  ditolak: { label: "Ditolak", className: "bg-red-500 text-white" },
  selesai: { label: "Selesai", className: "bg-slate-500 text-white" },
};

function StatusBadge({ status }: { status: StatusType }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  const active = field === sortField;
  return (
    <span className="ml-1 inline-flex flex-col gap-0">
      <ChevronUp className={`h-3 w-3 ${active && sortDir === "asc" ? "text-slate-800" : "text-slate-300"}`} />
      <ChevronDown className={`h-3 w-3 -mt-1 ${active && sortDir === "desc" ? "text-slate-800" : "text-slate-300"}`} />
    </span>
  );
}

// ─── Edit Dialog ──────────────────────────────────────────────────────────────
function EditDialog({
  item,
  open,
  onClose,
  onSave,
}: {
  item: RiwayatItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: RiwayatItem) => void;
}) {
  const [form, setForm] = useState<RiwayatItem | null>(item);

  useMemo(() => { setForm(item ? { ...item } : null); }, [item]);

  if (!form) return null;

  const set = (key: keyof RiwayatItem, value: string | boolean | string[]) =>
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Edit Permohonan — {form.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {[
            { label: "Judul Kegiatan", key: "judulKegiatan" as const },
            { label: "Instansi", key: "instansi" as const },
            { label: "Nama Pemohon", key: "namaPemohon" as const },
            { label: "Jabatan Pemohon", key: "jabatanPemohon" as const },
            { label: "Lokasi Acara", key: "lokasiAcara" as const },
            { label: "Nama Host", key: "namaHost" as const },
            { label: "Email", key: "email" as const },
            { label: "No. WhatsApp", key: "whatsapp" as const },
          ].map(({ label, key }) => (
            <div key={key} className="grid grid-cols-5 items-center gap-3">
              <label className="col-span-2 text-sm text-slate-500">{label}</label>
              <Input
                className="col-span-3 h-8 text-sm"
                value={form[key] as string}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
          <div className="grid grid-cols-5 items-center gap-3">
            <label className="col-span-2 text-sm text-slate-500">Tgl. Pelaksanaan</label>
            <Input
              type="datetime-local"
              className="col-span-3 h-8 text-sm"
              value={form.tanggalPelaksanaan}
              onChange={(e) => set("tanggalPelaksanaan", e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Batal</Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => { onSave(form); onClose(); }}
            >
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────
function DetailDialog({
  item,
  open,
  onClose,
}: {
  item: RiwayatItem | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!item) return null;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "ID Permohonan", value: item.id },
    { label: "Tanggal Permohonan", value: formatDateTime(item.requestDate) },
    { label: "Judul Kegiatan", value: item.judulKegiatan },
    { label: "Tanggal Pelaksanaan", value: formatDateTime(item.tanggalPelaksanaan) },
    { label: "Waktu", value: `${item.waktuMulai} – ${item.waktuSelesai || "-"}` },
    { label: "Instansi", value: item.instansi },
    { label: "Kode Unit Organisasi", value: item.kodeUnit || "-" },
    { label: "Nama Pemohon", value: item.namaPemohon },
    { label: "Jabatan Pemohon", value: item.jabatanPemohon },
    { label: "Jumlah Peserta", value: item.jumlahPeserta || "-" },
    { label: "Lokasi Acara", value: item.lokasiAcara || "-" },
    { label: "Perangkat Dibutuhkan", value: item.perangkatDibutuhkan.length > 0 ? item.perangkatDibutuhkan.join(", ") : "-" },
    { label: "Nama Host", value: item.namaHost || "-" },
    { label: "Email", value: item.email },
    { label: "No. WhatsApp", value: item.whatsapp || "-" },
    { label: "Rapat Berulang", value: item.rapatBerulang ? "Ya" : "Tidak" },
    { label: "Status", value: <StatusBadge status={item.status} /> },
    {
      label: "Link Zoom",
      value: item.linkZoom ? (
        <a
          href={item.linkZoom}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Buka Zoom
        </a>
      ) : "-",
    },
    { label: "Terakhir Sinkron", value: item.lastSync ? formatDateTime(item.lastSync) : "-" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Detail Permohonan
          </DialogTitle>
        </DialogHeader>
        <div className="divide-y divide-slate-100 mt-2">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-5 gap-3 py-2.5">
              <span className="col-span-2 text-sm text-slate-500">{label}</span>
              <span className="col-span-3 text-sm font-medium text-slate-900 break-words">{value}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VideoConferenceHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<RiwayatItem[]>(getInitialData());
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("requestDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [detailItem, setDetailItem] = useState<RiwayatItem | null>(null);
  const [editItem, setEditItem] = useState<RiwayatItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter((item) =>
        q === "" ||
        item.judulKegiatan.toLowerCase().includes(q) ||
        item.instansi.toLowerCase().includes(q) ||
        item.namaPemohon.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const va: string = a[sortField] as string;
        const vb: string = b[sortField] as string;
        const cmp = va.localeCompare(vb, "id");
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [data, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSave = (updated: RiwayatItem) => {
    setData((prev) => {
      const next = prev.map((item) => (item.id === updated.id ? updated : item));
      try {
        localStorage.setItem("video_conference_requests", JSON.stringify(next));
      } catch (error) {
        console.error("Error saving data:", error);
      }
      return next;
    });
  };

  const syncStatus = async (externalId: string) => {
    if (!user?.nip) return;

    setSyncingIds((prev) => new Set(prev).add(externalId));

    try {
      const result = await getDetailPermohonan(externalId);

      if (result.status && result.data) {
        const apiData = result.data;

        let localStatus: StatusType = "menunggu";
        if (apiData.status === "approved") localStatus = "disetujui";
        else if (apiData.status === "rejected") localStatus = "ditolak";
        else if (apiData.status === "completed") localStatus = "selesai";

        const linkZoom = apiData.jadwal && apiData.jadwal.length > 0
          ? apiData.jadwal[0].linkZoom
          : undefined;

        setData((prev) => {
          const updated = prev.map((item) => {
            if (item.external_id === externalId) {
              return { ...item, status: localStatus, linkZoom, lastSync: new Date().toISOString() };
            }
            return item;
          });
          try {
            localStorage.setItem("video_conference_requests", JSON.stringify(updated));
          } catch (error) {
            console.error("Error saving data:", error);
          }
          return updated;
        });

        toast({
          title: "Sinkronisasi Berhasil",
          description: `Status permohonan ${externalId} telah diperbarui`,
        });
      } else {
        toast({
          title: "Sinkronisasi Gagal",
          description: result.message || "Gagal mengambil data dari server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error syncing status:", error);
      toast({
        title: "Sinkronisasi Gagal",
        description: "Terjadi kesalahan saat menghubungi server",
        variant: "destructive",
      });
    } finally {
      setSyncingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(externalId);
        return newSet;
      });
    }
  };

  const syncAllStatus = async () => {
    if (!user?.nip) return;
    setIsSyncing(true);
    try {
      const promises = data
        .filter((item) => item.external_id && item.status !== "selesai")
        .map((item) => syncStatus(item.external_id));
      await Promise.all(promises);
      toast({ title: "Sinkronisasi Selesai", description: "Semua status telah diperbarui" });
    } catch (error) {
      console.error("Error syncing all:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setData(getInitialData());
  }, []);

  const thClass =
    "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:bg-slate-100 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Riwayat Permohonan Zoom
        </h1>
        <Link href="/request/video-conference">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
          >
            <Plus className="h-4 w-4" />
            Buat Permohonan
          </Button>
        </Link>
      </div>

      {/* Card */}
      <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="h-1.5 w-full bg-blue-600" />

        <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Daftar Permohonan Anda
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          {/* Sync button */}
          <div className="flex justify-end">
            <Button
              onClick={syncAllStatus}
              disabled={isSyncing || data.length === 0}
              variant="outline"
              className="flex items-center gap-2 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Menyinkronkan..." : "Sinkronkan Status"}
            </Button>
          </div>

          {/* Top bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span>Tampilkan</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
              >
                <SelectTrigger className="h-8 w-[70px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>data</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium">Cari:</span>
              <Input
                className="h-8 w-full sm:w-[220px] text-sm"
                placeholder=""
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              {/* ── PERBAIKAN: thead yang lengkap dan benar ── */}
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-12">
                    No
                  </th>
                  <th className={thClass} onClick={() => handleSort("requestDate")}>
                    <span className="inline-flex items-center">
                      Tanggal Request
                      <SortIcon field="requestDate" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thClass} onClick={() => handleSort("judulKegiatan")}>
                    <span className="inline-flex items-center">
                      Judul Kegiatan
                      <SortIcon field="judulKegiatan" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thClass} onClick={() => handleSort("instansi")}>
                    <span className="inline-flex items-center">
                      Instansi
                      <SortIcon field="instansi" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thClass} onClick={() => handleSort("tanggalPelaksanaan")}>
                    <span className="inline-flex items-center">
                      Tgl. Pelaksanaan
                      <SortIcon field="tanggalPelaksanaan" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thClass} onClick={() => handleSort("status")}>
                    <span className="inline-flex items-center">
                      Status
                      <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                    Link Zoom
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* ── PERBAIKAN: tbody tunggal yang benar ── */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-slate-50/70 dark:bg-transparent dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* No */}
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-center">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      {/* Tanggal Request */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDateTime(item.requestDate)}
                      </td>
                      {/* Judul Kegiatan */}
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-50 max-w-[200px]">
                        <span className="line-clamp-2">{item.judulKegiatan}</span>
                      </td>
                      {/* Instansi */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[180px]">
                        <span className="line-clamp-2">{item.instansi}</span>
                      </td>
                      {/* Tanggal Pelaksanaan */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDateTime(item.tanggalPelaksanaan)}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      {/* Link Zoom */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.linkZoom ? (
                          <a
                            href={item.linkZoom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Buka
                          </a>
                        ) : "-"}
                      </td>
                      {/* Aksi */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDetailItem(item)}
                            className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </button>
                          {item.external_id && item.status !== "selesai" && (
                            <button
                              onClick={() => syncStatus(item.external_id)}
                              disabled={syncingIds.has(item.external_id)}
                              className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm disabled:opacity-50"
                              title="Sinkronkan status dengan server"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${syncingIds.has(item.external_id) ? "animate-spin" : ""}`} />
                              {syncingIds.has(item.external_id) ? "Sync..." : "Sync"}
                            </button>
                          )}
                          <button
                            onClick={() => setEditItem(item)}
                            className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold bg-slate-400 hover:bg-slate-500 text-white transition-colors shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Menampilkan{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">{filtered.length}</span>{" "}
              data
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                title="Halaman pertama"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                title="Sebelumnya"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded border text-sm font-medium transition-colors ${
                        p === page
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                title="Berikutnya"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                title="Halaman terakhir"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DetailDialog
        item={detailItem}
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
      />

      <EditDialog
        item={editItem}
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSave={handleSave}
      />
    </div>
  );
}