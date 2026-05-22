"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  UserCheck,
  Wrench,
  PartyPopper,
  FileText,
  Phone,
  Mail,
  Building2,
  BadgeInfo,
} from "lucide-react";
import type { VpnListItem } from "@/lib/semantik";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "d MMMM yyyy, HH:mm", { locale: localeId });
  } catch {
    return dateStr;
  }
}

function fmtDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: localeId });
  } catch {
    return dateStr;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; color: string }
> = {
  verifikasi: {
    label: "Verifikasi",
    className: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/20 dark:border-blue-500/30",
    color: "text-blue-700 dark:text-blue-400",
  },
  persetujuan: {
    label: "Persetujuan",
    className: "text-amber-700 bg-amber-50 border-amber-200 dark:text-yellow-400 dark:bg-yellow-500/20 dark:border-yellow-500/30",
    color: "text-amber-700 dark:text-yellow-400",
  },
  pembuatan: {
    label: "Pembuatan",
    className: "text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/20 dark:border-purple-500/30",
    color: "text-purple-700 dark:text-purple-400",
  },
  selesai: {
    label: "Selesai",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-green-400 dark:bg-green-500/20 dark:border-green-500/30",
    color: "text-emerald-700 dark:text-green-400",
  },
  tolak: {
    label: "Ditolak",
    className: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/20 dark:border-red-500/30",
    color: "text-red-700 dark:text-red-400",
  },
};

function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status] ?? {
      label: status,
      className: "text-slate-700 bg-slate-50 border-slate-200 dark:text-gray-400 dark:bg-gray-500/20 dark:border-gray-500/30",
      color: "text-slate-700 dark:text-gray-400",
    }
  );
}

/** Sesuai arahan supervisor */
function getApprovalLabel(status: string): string {
  if (status === "pembuatan" || status === "selesai") return "Approved";
  if (status === "persetujuan") return "Pending approval";
  if (status === "tolak") return "Ditolak";
  if (status === "verifikasi") return "Menunggu verifikasi";
  return "-";
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

const STATUS_ORDER = ["verifikasi", "persetujuan", "pembuatan", "selesai"];

type StepState = "done" | "active" | "waiting" | "rejected";

interface TimelineStep {
  key: string;
  label: string;
  icon: React.ReactNode;
  subtitle?: string;
  date?: string;
  notes?: string;
  person?: string;
  state: StepState;
}

function buildTimeline(item: VpnListItem): TimelineStep[] {
  const currentIdx =
    item.status === "tolak"
      ? -1
      : STATUS_ORDER.indexOf(item.status);

  const isTolak = item.status === "tolak";

  function stepState(stepKey: string, stepIdx: number): StepState {
    if (isTolak && stepIdx >= currentIdx) return "rejected";
    if (stepIdx < currentIdx) return "done";
    if (stepIdx === currentIdx) return "active";
    return "waiting";
  }

  return [
    {
      key: "diajukan",
      label: "Diajukan",
      icon: <FileText size={16} />,
      subtitle: `ID: #${item.id}`,
      date: fmtDate(item.tanggalPermohonan),
      state: "done",
    },
    {
      key: "verifikasi",
      label: "Verifikasi",
      icon: <ShieldCheck size={16} />,
      subtitle:
        stepState("verifikasi", 0) === "active"
          ? (item as any).statusDetail ?? "Menunggu verifikasi"
          : stepState("verifikasi", 0) === "done"
          ? "Verifikasi selesai"
          : "Menunggu proses sebelumnya",
      date: item.tanggalVerifikasi ? fmtDate(item.tanggalVerifikasi) : undefined,
      notes: item.verifikasiNotes,
      state: stepState("verifikasi", 0),
    },
    {
      key: "persetujuan",
      label: "Persetujuan",
      icon: <UserCheck size={16} />,
      subtitle:
        stepState("persetujuan", 1) === "active"
          ? "Menunggu persetujuan"
          : stepState("persetujuan", 1) === "done"
          ? item.persetujuanName
            ? `Disetujui oleh ${item.persetujuanName}`
            : "Disetujui"
          : "Menunggu verifikasi selesai",
      date: item.tanggalPersetujuan ? fmtDate(item.tanggalPersetujuan) : undefined,
      notes: item.persetujuanNotes,
      person: item.persetujuanName,
      state: stepState("persetujuan", 1),
    },
    {
      key: "pembuatan",
      label: "Akun VPN",
      icon: <Wrench size={16} />,
      subtitle:
        stepState("pembuatan", 2) === "active"
          ? "Sedang dibuat oleh tim teknis"
          : stepState("pembuatan", 2) === "done"
          ? "Akun VPN telah dibuat"
          : "Menunggu persetujuan",
      state: stepState("pembuatan", 2),
    },
    {
      key: "selesai",
      label: "Selesai",
      icon: <PartyPopper size={16} />,
      subtitle:
        stepState("selesai", 3) === "done" || stepState("selesai", 3) === "active"
          ? "Permohonan telah selesai diproses"
          : "Menunggu proses sebelumnya",
      state: stepState("selesai", 3),
    },
  ];
}

function StepIcon({
  state,
  icon,
}: {
  state: StepState;
  icon: React.ReactNode;
}) {
  if (state === "done")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 ring-2 ring-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:ring-green-500/40 animate-none">
        <CheckCircle2 size={18} />
      </div>
    );
  if (state === "active")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-2 ring-amber-500/30 dark:bg-yellow-500/20 dark:text-yellow-400 dark:ring-yellow-500/40 animate-pulse">
        <Clock size={18} />
      </div>
    );
  if (state === "rejected")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 ring-2 ring-red-500/30 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-500/40">
        <XCircle size={18} />
      </div>
    );
  // waiting
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-2 ring-slate-200 dark:bg-white/5 dark:text-white/30 dark:ring-white/10">
      {icon}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500 dark:text-white/40">{label}</p>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        {icon && <span className="text-slate-400 dark:text-white/50">{icon}</span>}
        {value ?? "-"}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VpnDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [data, setData] = useState<VpnListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetch_() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/vpn/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-white/40">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 dark:border-white/20 border-t-blue-500" />
            <p className="text-sm">Memuat detail permohonan...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Error ──
  if (error || !data) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <XCircle className="text-red-500 dark:text-red-400" size={40} />
          <p className="text-slate-600 dark:text-white/60">Gagal memuat data: {error ?? "Data tidak ditemukan"}</p>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-slate-100 dark:bg-white/10 px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            Kembali
          </button>
        </div>
      </AppLayout>
    );
  }

  const statusCfg = getStatusConfig(data.status);
  const approvalLabel = getApprovalLabel(data.status);
  const timeline = buildTimeline(data);
  const isTolak = data.status === "tolak";

  return (
    <AppLayout>
      <ProtectedRoute>
        <div className="container py-10">
          <div className="mx-auto max-w-6xl space-y-6">

            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="group mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Kembali ke Riwayat VPN
            </button>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* ── Kolom Kiri (2/3) ── */}
              <div className="space-y-6 lg:col-span-2">

                {/* Header Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-sm">
                      {getInitials(data.namaPemohon ?? "?")}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                          {data.namaPemohon}
                        </h1>
                        <span
                          className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                        {/* Approval label supervisor */}
                        <span className="rounded-full bg-slate-100 dark:bg-white/10 px-3 py-0.5 text-xs font-medium text-slate-600 dark:text-white/60">
                          {approvalLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {data.jabatanPemohon}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/50">
                        <Building2 size={13} />
                        {data.instansi}
                      </p>
                    </div>
                  </div>

                  {/* Penolakan info */}
                  {isTolak && (data as any).alasanPenolakan && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                        Alasan Penolakan
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-red-300">
                        {data.alasanPenolakan}
                      </p>
                      {data.tanggalPenolakan && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-red-400/60">
                          {fmt(data.tanggalPenolakan)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

          {/* Informasi Kontak & Kepegawaian */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              <BadgeInfo size={15} />
              Informasi Kontak &amp; Kepegawaian
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow
                label="Status Pegawai"
                value={data.statusPegawai?.toUpperCase()}
              />
              <InfoRow label="NIP" value={data.nip ?? "-"} />
              <InfoRow
                label="Email"
                value={data.email}
                icon={<Mail size={13} />}
              />
              <InfoRow
                label="No. Telepon"
                value={data.nomorTelepon}
                icon={<Phone size={13} />}
              />
              {data.tanggalAkhirKontrak && (
                <InfoRow
                  label="Tanggal Akhir Kontrak"
                  value={fmtDate(data.tanggalAkhirKontrak)}
                />
              )}
              <InfoRow
                label="Tanggal Permohonan"
                value={fmtDate(data.tanggalPermohonan)}
              />
            </div>

            {/* Tujuan */}
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="mb-1 text-xs uppercase tracking-wider text-slate-500 dark:text-white/40">
                Tujuan Permohonan
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {data.tujuanPermohonan ?? "-"}
              </p>
            </div>
          </div>

          {/* Dokumen & Tanda Tangan */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              <FileText size={15} />
              Dokumen &amp; Tanda Tangan
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow
                label="Nomor Rekaman"
                value={data.nomorRekaman ?? "-"}
              />
              <InfoRow
                label="Jenis Permohonan"
                value={
                  data.jenisPermohonan
                    ? data.jenisPermohonan.charAt(0).toUpperCase() +
                      data.jenisPermohonan.slice(1)
                    : "-"
                }
              />
            </div>

            {/* Tanda Tangan */}
            <div className="mt-3">
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500 dark:text-white/40">
                Tanda Tangan Pemohon
              </p>
              {data.signature ? (
                <div className="flex h-36 w-64 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-white/20 dark:bg-white/5">
                  <img
                    src={data.signature}
                    alt="Tanda tangan pemohon"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-white/20 dark:bg-white/5">
                  <p className="text-xs text-slate-400 dark:text-white/30">Tidak ada tanda tangan</p>
                </div>
              )}
            </div>

            {/* Link VPN — hanya tampil jika sudah approved (pembuatan/selesai) */}
            {data.linkVpn && (data.status === "pembuatan" || data.status === "selesai") && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                  Link VPN
                </p>

                <a
                  href={data.linkVpn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-green-600 hover:text-green-700 dark:text-green-300 dark:hover:text-green-200 underline"
                >
                  {data.linkVpn}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Kolom Kanan (1/3) — Timeline ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />
              Timeline Proses
            </div>

            <div className="relative space-y-0">
              {timeline.map((step, idx) => {
                const isLast = idx === timeline.length - 1;
                const lineColor =
                  step.state === "done"
                    ? "bg-green-500/40"
                    : step.state === "rejected"
                    ? "bg-red-500/40"
                    : "bg-slate-200 dark:bg-white/10";

                return (
                  <div key={step.key} className="relative flex gap-4">
                    {/* Vertical line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[17px] top-9 bottom-0 w-0.5 ${lineColor}`}
                      />
                    )}

                    {/* Icon */}
                    <div className="shrink-0">
                      <StepIcon state={step.state} icon={step.icon} />
                    </div>

                    {/* Content */}
                    <div className="pb-7 pt-1.5 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          step.state === "done"
                            ? "text-slate-900 dark:text-white"
                            : step.state === "active"
                            ? "text-amber-600 dark:text-yellow-300"
                            : step.state === "rejected"
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-400 dark:text-white/30"
                        }`}
                      >
                        {step.label}
                      </p>

                      {step.date && (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-white/40">
                          {step.date}
                        </p>
                      )}

                      {step.subtitle && (
                        <p
                          className={`mt-0.5 text-xs ${
                            step.state === "active"
                              ? "text-amber-600 dark:text-yellow-400"
                              : step.state === "rejected"
                              ? "text-red-600 dark:text-red-400"
                              : "text-slate-500 dark:text-white/40"
                          }`}
                        >
                          {step.subtitle}
                        </p>
                      )}

                      {step.notes && (
                        <p className="mt-1 text-xs italic text-slate-500 dark:text-white/30">
                          "{step.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary box */}
            <div
              className={`mt-2 rounded-xl border p-3 ${statusCfg.className}`}
            >
              <p className={`text-xs font-semibold ${statusCfg.color}`}>
                Status Saat Ini
              </p>
              <p className={`mt-0.5 text-sm font-bold ${statusCfg.color}`}>
                {approvalLabel}
              </p>
              {data.statusDetail && (
                <p className="mt-1 text-xs text-slate-500 dark:text-white/40 italic">
                  {data.statusDetail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</ProtectedRoute>
</AppLayout>
  );
}
