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

// ─── localStorage helpers ─────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> =
  {
    menunggu: { label: "Menunggu", className: "bg-amber-400 text-white" },
    disetujui: { label: "Disetujui", className: "bg-emerald-500 text-white" },
    ditolak: { label: "Ditolak", className: "bg-red-500 text-white" },
    selesai: { label: "Selesai", className: "bg-slate-500 text-white" },
  };

function StatusBadge({ status }: { status: StatusType }) {
  const { label, className } = STATUS_CONFIG[status] ?? STATUS_CONFIG.menunggu;
  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold ${className}`}
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
        className={`h-3 w-3 ${active && sortDir === "asc" ? "text-slate-800" : "text-slate-300"}`}
      />
      <ChevronDown
        className={`h-3 w-3 -mt-1 ${active && sortDir === "desc" ? "text-slate-800" : "text-slate-300"}`}
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

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "No. Tiket", value: item.noTiket ?? "-" },
    { label: "ID Semantik", value: item.semantikId ?? "-" },
    { label: "Tgl. Permohonan", value: formatDateTime(item.requestDate) },
    { label: "Judul Kegiatan", value: item.judulKegiatan },
    { label: "Tgl. Pelaksanaan", value: item.tanggalPelaksanaan },
    {
      label: "Waktu",
      value: `${item.waktuMulai} – ${item.waktuSelesai || "-"} (${item.durasiMenit} menit)`,
    },
    { label: "Instansi", value: item.instansi },
    { label: "Kode Unit Org.", value: item.kodeUnor || "-" },
    { label: "Nama Pemohon", value: item.namaPemohon },
    { label: "Jabatan Pemohon", value: item.jabatanPemohon },
    { label: "Jumlah Peserta", value: item.jumlahPeserta || "-" },
    { label: "Lokasi Acara", value: item.lokasiAcara || "-" },
    { label: "Perangkat", value: item.perangkatDibutuhkan || "-" },
    { label: "Nama Host", value: item.namaHost || "-" },
    { label: "Email", value: item.email },
    { label: "No. WhatsApp", value: item.nomorTelepon || "-" },
    { label: "Acara Berulang", value: item.acaraBerulang ? "Ya" : "Tidak" },
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
          <ExternalLink className="h-3 w-3" /> Buka Zoom
        </a>
      ) : (
        "-"
      ),
    },
    {
      label: "Terakhir Sinkron",
      value: item.lastSync ? formatDateTime(item.lastSync) : "-",
    },
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
              <span className="col-span-3 text-sm font-medium text-slate-900 break-words">
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
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("requestDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [detailItem, setDetailItem] = useState<LocalPermohonan | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());

  // Load dari localStorage saat mount (client only)
  useEffect(() => {
    setData(loadFromLocalStorage());
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

      // detail bisa langsung object atau { data: object }
      const d = detail?.data ?? detail;

      const newStatus = normalizeStatus(d?.status ?? "menunggu");
      const linkZoom: string | undefined =
        Array.isArray(d?.jadwal) && d.jadwal.length > 0
          ? d.jadwal[0]?.linkZoom
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
      const toSync = data.filter((x) => x.semantikId && x.status !== "selesai");
      await Promise.all(toSync.map(syncOne));
      if (toSync.length > 0) {
        toast({
          title: "Sinkronisasi Selesai",
          description: `${toSync.length} permohonan diperbarui`,
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

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

      <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="h-1.5 w-full bg-blue-600" />
        <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Daftar Permohonan Anda
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          {/* Sync Button */}
          <div className="flex justify-end">
            <Button
              onClick={syncAll}
              disabled={
                isSyncing || data.filter((x) => x.semantikId).length === 0
              }
              variant="outline"
              className="flex items-center gap-2 text-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Menyinkronkan..." : "Sinkronkan Semua"}
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span>Tampilkan</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px] text-sm">
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
              <span>data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium">Cari:</span>
              <Input
                className="h-8 w-full sm:w-[220px] text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-12">
                    No
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("requestDate")}
                  >
                    <span className="inline-flex items-center">
                      Tgl. Request{" "}
                      <SortIcon
                        field="requestDate"
                        sortField={sortField}
                        sortDir={sortDir}
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                    No. Tiket
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("judulKegiatan")}
                  >
                    <span className="inline-flex items-center">
                      Judul Kegiatan{" "}
                      <SortIcon
                        field="judulKegiatan"
                        sortField={sortField}
                        sortDir={sortDir}
                      />
                    </span>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("instansi")}
                  >
                    <span className="inline-flex items-center">
                      Instansi{" "}
                      <SortIcon
                        field="instansi"
                        sortField={sortField}
                        sortDir={sortDir}
                      />
                    </span>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("tanggalPelaksanaan")}
                  >
                    <span className="inline-flex items-center">
                      Tgl. Pelaksanaan{" "}
                      <SortIcon
                        field="tanggalPelaksanaan"
                        sortField={sortField}
                        sortDir={sortDir}
                      />
                    </span>
                  </th>
                  <th className={thClass} onClick={() => handleSort("status")}>
                    <span className="inline-flex items-center">
                      Status{" "}
                      <SortIcon
                        field="status"
                        sortField={sortField}
                        sortDir={sortDir}
                      />
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      {data.length === 0
                        ? "Belum ada permohonan. Buat permohonan baru!"
                        : "Tidak ada data yang cocok."}
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, idx) => (
                    <tr
                      key={`${item.semantikId}-${idx}`}
                      className="bg-white hover:bg-slate-50/70 dark:bg-transparent dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500 text-center">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDateTime(item.requestDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">
                        {item.noTiket ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-900 max-w-[200px]">
                        <span className="line-clamp-2">
                          {item.judulKegiatan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px]">
                        <span className="line-clamp-2">{item.instansi}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {item.tanggalPelaksanaan}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.linkZoom ? (
                          <a
                            href={item.linkZoom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Buka
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDetailItem(item)}
                            className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" /> Detail
                          </button>
                          {item.semantikId && item.status !== "selesai" && (
                            <button
                              onClick={() => syncOne(item)}
                              disabled={syncingIds.has(item.semantikId!)}
                              className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm disabled:opacity-50"
                            >
                              <RefreshCw
                                className={`h-3.5 w-3.5 ${syncingIds.has(item.semantikId!) ? "animate-spin" : ""}`}
                              />
                              {syncingIds.has(item.semantikId!)
                                ? "Sync..."
                                : "Sync"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`e${i}`} className="px-1 text-slate-400 text-sm">
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

      <DetailDialog
        item={detailItem}
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
      />
    </div>
  );
}
