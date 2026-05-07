"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Video,
  CheckCircle2,
  Inbox,
} from "lucide-react";
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
import type { LocalPermohonan } from "@/components/services/VideoConferenceRequestForm";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "menunggu" | "disetujui" | "ditolak" | "selesai";
type SortField =
  | "requestDate"
  | "judulKegiatan"
  | "instansi"
  | "tanggalPelaksanaan"
  | "status";
type SortDir = "asc" | "desc";

// ─── localStorage helpers (fallback cache) ───────────────────────────────────

function loadFromLocalStorage(): LocalPermohonan[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("video_conference_requests");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistToLocalStorage(list: LocalPermohonan[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("video_conference_requests", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving localStorage:", e);
  }
}

// ─── Map from Semantik API response to LocalPermohonan ───────────────────────

interface SemantikPermohonan {
  id: number;
  noTiket: string;
  tanggalPermohonan: string;
  instansi: string;
  kodeUnor?: string;
  namaPemohon: string;
  jabatanPemohon: string;
  email: string;
  nomorTelepon?: string;
  judulKegiatan: string;
  lokasiAcara?: string;
  tanggalMulai: string;
  waktuMulai: string;
  durasiMenit: number;
  jumlahPeserta: string;
  perangkatDibutuhkan?: string;
  jenisKegiatan?: string;
  keterangan?: string;
  status: string;
  isRecurring: boolean;
  recurrenceFreq?: string;
  recurrenceInterval?: number;
  recurrenceDays?: string;
  recurrenceEndType?: string;
  recurrenceEndDate?: string;
  recurrenceCount?: number;
  createdAt: string;
  updatedAt: string;
  jadwal?: { linkZoom?: string }[];
}

function mapSemantikToPermohonan(item: SemantikPermohonan): LocalPermohonan {
  return {
    semantikId: item.id,
    noTiket: item.noTiket,
    requestDate: item.createdAt,
    tanggalPermohonan: item.tanggalPermohonan,
    judulKegiatan: item.judulKegiatan,
    tanggalPelaksanaan: item.tanggalMulai,
    waktuMulai: item.waktuMulai,
    durasiMenit: item.durasiMenit,
    waktuSelesai: hitungWaktuSelesai(item.waktuMulai, item.durasiMenit),
    jumlahPeserta: item.jumlahPeserta,
    instansi: item.instansi,
    kodeUnor: item.kodeUnor || "",
    namaPemohon: item.namaPemohon,
    jabatanPemohon: item.jabatanPemohon,
    email: item.email,
    nomorTelepon: item.nomorTelepon || "",
    lokasiAcara: item.lokasiAcara || "",
    perangkatDibutuhkan: item.perangkatDibutuhkan || "",
    namaHost: "",
    acaraBerulang: item.isRecurring,
    pengulangan: item.recurrenceFreq as
      | "harian"
      | "mingguan"
      | "bulanan"
      | undefined,
    ulangSetiap: item.recurrenceInterval,
    hariMingguan: item.recurrenceDays
      ? item.recurrenceDays.split(",")
      : undefined,
    jenisBerakhir: item.recurrenceEndType as "date" | "count" | undefined,
    tanggalBerakhir: item.recurrenceEndDate,
    jumlahPenyelenggaraan: item.recurrenceCount,
    status: normalizeStatus(item.status),
    linkZoom: item.jadwal?.[0]?.linkZoom,
    lastSync: item.updatedAt,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hitungWaktuSelesai(waktuMulai: string, durasiMenit: number): string {
  if (!waktuMulai) return "";
  const [h, m] = waktuMulai.split(":").map(Number);
  const total = h * 60 + m + durasiMenit;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

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

function formatDateOnly(iso: string): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(raw: string): StatusType {
  const map: Record<string, StatusType> = {
    menunggu: "menunggu",
    pending: "menunggu",
    disetujui: "disetujui",
    approved: "disetujui",
    ditolak: "ditolak",
    rejected: "ditolak",
    selesai: "selesai",
    completed: "selesai",
    done: "selesai",
  };
  return map[raw?.toLowerCase()] ?? "menunggu";
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  menunggu: {
    label: "Menunggu",
    className: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
  },
  disetujui: {
    label: "Disetujui",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
  },
  ditolak: {
    label: "Ditolak",
    className: "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
  },
  selesai: {
    label: "Selesai",
    className: "bg-slate-100 text-slate-600 border border-slate-200 ring-1 ring-slate-100",
  },
};

function StatusBadge({ status }: { status: StatusType }) {
  const { label, className } = STATUS_CONFIG[status] ?? STATUS_CONFIG.menunggu;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  const active = field === sortField;
  return (
    <span className="ml-1 inline-flex flex-col gap-0">
      <ChevronUp
        className={`h-3 w-3 ${active && sortDir === "asc" ? "text-blue-600" : "text-slate-300"}`}
      />
      <ChevronDown
        className={`h-3 w-3 -mt-1 ${active && sortDir === "desc" ? "text-blue-600" : "text-slate-300"}`}
      />
    </span>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────

function DetailDialog({
  item,
  open,
  onClose,
}: {
  item: LocalPermohonan | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!item) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (item.linkZoom) {
      navigator.clipboard.writeText(item.linkZoom);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rows: { label: string; value: React.ReactNode; highlight?: boolean }[] = [
    {
      label: "No Tiket",
      value: (
        <span className="font-mono text-sm font-semibold text-blue-600">
          {item.noTiket ?? "-"}
        </span>
      ),
      highlight: true,
    },
    {
      label: "Status",
      value: <StatusBadge status={item.status} />,
    },
    {
      label: "Link Zoom",
      highlight: !!item.linkZoom,
      value: item.linkZoom ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={item.linkZoom}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Video className="h-3.5 w-3.5" />
              Join Zoom
            </a>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 break-all font-mono">
            {item.linkZoom}
          </div>
        </div>
      ) : (
        <span className="text-slate-400 italic text-sm">Belum tersedia</span>
      ),
    },
    { label: "Judul Kegiatan", value: item.judulKegiatan },
    { label: "Instansi", value: item.instansi },
    { label: "Nama Pemohon", value: item.namaPemohon },
    {
      label: "Tanggal Pelaksanaan",
      value: item.tanggalPelaksanaan
        ? new Date(item.tanggalPelaksanaan).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-",
    },
    { label: "Waktu Mulai", value: item.waktuMulai || "-" },
    { label: "Lokasi Acara", value: item.lokasiAcara || "-" },
    { label: "Jumlah Peserta", value: item.jumlahPeserta ? `${item.jumlahPeserta} orang` : "-" },
    {
      label: "Keterangan",
      value:
        item.perangkatDibutuhkan
          ? `${item.namaHost ? `Nama host: ${item.namaHost}` : ""}${item.namaHost && item.perangkatDibutuhkan ? " | " : ""}${item.perangkatDibutuhkan ? `Perangkat: ${item.perangkatDibutuhkan}` : ""}`.trim() || "-"
          : "-",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0">
        {/* Modal Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Video className="h-4 w-4 text-blue-600" />
            </div>
            Detail Permohonan
          </DialogTitle>
        </DialogHeader>

        {/* Modal Body */}
        <div className="divide-y divide-slate-100">
          {rows.map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`grid grid-cols-5 gap-3 px-6 py-3 ${highlight ? "bg-slate-50/70" : ""}`}
            >
              <span className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide pt-0.5">
                {label}
              </span>
              <span className="col-span-3 text-sm text-slate-900 break-words">
                {value}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VideoConferenceHistory() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [data, setData] = useState<LocalPermohonan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("requestDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [detailItem, setDetailItem] = useState<LocalPermohonan | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());

  // Fetch data dari Semantik API saat mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/teleconference/permohonan");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        console.log("RESULT SEMANTIK:", result);

        const list = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.items)
              ? result.items
              : [];

        const mapped = list.map(mapSemantikToPermohonan);

        const enriched = await Promise.all(
          mapped.map(async (item) => {
            if (item.status === "disetujui" && item.semantikId) {
              try {
                const res2 = await fetch(
                  `/api/teleconference/permohonan/${item.semantikId}`,
                );
                if (!res2.ok) return item;
                const detail = await res2.json();

                console.log("DETAIL LOKAL:", JSON.stringify(detail, null, 2));

                return {
                  ...item,
                  linkZoom: detail?.jadwal?.[0]?.linkZoom ?? item.linkZoom,
                  lastSync: new Date().toISOString(),
                };
              } catch {
                return item;
              }
            }
            return item;
          }),
        );

        setData(enriched);
        persistToLocalStorage(enriched);
      } catch (err) {
        console.error("Fetch error:", err);
        const cached = loadFromLocalStorage();
        setData(cached);
        toast({
          title: "Gagal memuat data dari server",
          description: "Menampilkan data dari cache lokal",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortDir((d) =>
      sortField === field ? (d === "asc" ? "desc" : "asc") : "asc",
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter(
        (item) =>
          q === "" ||
          item.judulKegiatan?.toLowerCase().includes(q) ||
          item.instansi?.toLowerCase().includes(q) ||
          item.namaPemohon?.toLowerCase().includes(q) ||
          item.noTiket?.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const va = String(a[sortField as keyof LocalPermohonan] ?? "");
        const vb = String(b[sortField as keyof LocalPermohonan] ?? "");
        return sortDir === "asc"
          ? va.localeCompare(vb, "id")
          : vb.localeCompare(va, "id");
      });
  }, [data, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ─── Sync satu item ──────────────────────────────────────────────────────────

  const syncOne = async (item: LocalPermohonan) => {
    const id = item.semantikId;
    if (!id) return;

    setSyncingIds((prev) => new Set(prev).add(id));

    try {
      const res = await fetch(`/api/teleconference/permohonan/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const detail = await res.json();

      const newStatus = normalizeStatus(detail?.status ?? "menunggu");
      const linkZoom: string | undefined =
        Array.isArray(detail?.jadwal) && detail.jadwal.length > 0
          ? detail.jadwal[0]?.linkZoom
          : undefined;

      setData((prev) => {
        const updated = prev.map((x) =>
          x.semantikId === id
            ? {
                ...x,
                status: newStatus,
                linkZoom,
                lastSync: new Date().toISOString(),
              }
            : x,
        );
        persistToLocalStorage(updated);
        return updated;
      });

      toast({
        title: "Sinkronisasi Berhasil",
        description: `Status permohonan ${item.noTiket ?? id} diperbarui`,
      });
    } catch (err) {
      console.error("Sync error:", err);
      toast({
        title: "Sinkronisasi Gagal",
        description: "Gagal menghubungi server Semantik",
        variant: "destructive",
      });
    } finally {
      setSyncingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  // ─── Sync semua ──────────────────────────────────────────────────────────────

  const syncAll = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/teleconference/permohonan");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.items)
            ? result.items
            : [];

      const mapped = list.map(mapSemantikToPermohonan);
      setData(mapped);
      persistToLocalStorage(mapped);

      toast({
        title: "Sinkronisasi Selesai",
        description: "Data permohonan telah diperbarui dari server",
      });
    } catch (err) {
      console.error("Sync all error:", err);
      toast({
        title: "Sinkronisasi Gagal",
        description: "Gagal memperbarui data dari server",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // ─── Table header class ───────────────────────────────────────────────────────

  const thBase =
    "px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap";
  const thSortable =
    `${thBase} cursor-pointer select-none hover:text-slate-800 hover:bg-slate-100 transition-colors`;

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Riwayat Permohonan{" "}
            <span className="text-blue-600">Video Conference</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pantau dan kelola status permohonan Zoom Anda
          </p>
        </div>
        <Link href="/request/video-conference">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg">
            <Plus className="h-4 w-4" />
            Buat Permohonan
          </Button>
        </Link>
      </div>

      {/* ── Loading State ────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Memuat data dari server…</p>
          </div>
        </div>
      )}

      {/* ── Main Card ────────────────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Blue accent stripe */}
          <div className="h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />

          {/* Card Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                <Video className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Daftar Permohonan Anda
              </span>
            </div>
            <Button
              onClick={syncAll}
              disabled={isSyncing || data.filter((x) => x.semantikId).length === 0}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs text-slate-600 border-slate-200 hover:border-slate-300 rounded-lg"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Menyinkronkan…" : "Sinkronkan Semua"}
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Tampilkan</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
              >
                <SelectTrigger className="h-8 w-[68px] text-xs border-slate-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-xs">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Cari:</span>
              <Input
                className="h-8 w-full sm:w-[220px] text-xs border-slate-200 rounded-lg"
                placeholder="Judul, instansi, no tiket…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700">
                  <th className={`${thBase} w-10 text-center`}>No</th>
                  <th className={thSortable} onClick={() => handleSort("requestDate")}>
                    <span className="inline-flex items-center gap-0.5">
                      Tgl. Request
                      <SortIcon field="requestDate" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thBase}>No. Tiket</th>
                  <th className={thSortable} onClick={() => handleSort("judulKegiatan")}>
                    <span className="inline-flex items-center gap-0.5">
                      Judul Kegiatan
                      <SortIcon field="judulKegiatan" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thSortable} onClick={() => handleSort("instansi")}>
                    <span className="inline-flex items-center gap-0.5">
                      Instansi
                      <SortIcon field="instansi" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thSortable} onClick={() => handleSort("tanggalPelaksanaan")}>
                    <span className="inline-flex items-center gap-0.5">
                      Tgl. Pelaksanaan
                      <SortIcon field="tanggalPelaksanaan" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thSortable} onClick={() => handleSort("status")}>
                    <span className="inline-flex items-center gap-0.5">
                      Status
                      <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thBase}>Link Zoom</th>
                  <th className={`${thBase} text-center`}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Inbox className="h-10 w-10 opacity-40" />
                        <p className="text-sm">
                          {data.length === 0
                            ? "Belum ada permohonan. Buat permohonan baru!"
                            : "Tidak ada data yang cocok."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, idx) => (
                    <tr
                      key={`${item.semantikId}-${idx}`}
                      className="group bg-white hover:bg-blue-50/30 dark:bg-transparent dark:hover:bg-slate-800/40 transition-colors duration-100"
                    >
                      {/* No */}
                      <td className="px-4 py-3 text-center text-xs text-slate-400">
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      {/* Tgl Request */}
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {formatDateTime(item.requestDate)}
                      </td>

                      {/* No Tiket */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.noTiket ?? "-"}
                        </span>
                      </td>

                      {/* Judul */}
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 max-w-[200px]">
                        <span className="line-clamp-2 text-xs leading-relaxed">
                          {item.judulKegiatan}
                        </span>
                      </td>

                      {/* Instansi */}
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px]">
                        <span className="line-clamp-2">{item.instansi}</span>
                      </td>

                      {/* Tgl Pelaksanaan */}
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {formatDateOnly(item.tanggalPelaksanaan)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Link Zoom */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.linkZoom ? (
                          <a
                            href={item.linkZoom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Buka
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setDetailItem(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors shadow-sm"
                          >
                            <Eye className="h-3 w-3" />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination Footer ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filtered.length)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filtered.length}
              </span>{" "}
              data
            </p>

            <div className="flex items-center gap-1">
              {/* First */}
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>

              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`e${i}`} className="px-1 text-slate-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                        p === page
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              {/* Last */}
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Dialog ─────────────────────────────────────────────────────── */}
      <DetailDialog
        item={detailItem}
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
      />
    </div>
  );
}