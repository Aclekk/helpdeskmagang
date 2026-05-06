"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  Search,
  Eye,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  User,
  Building2,
  Phone,
  Mail,
  Hash,
  CalendarDays,
  KeyRound,
  Copy,
  Check,
  ChevronDown,
  RefreshCw,
  FileText,
  Wifi,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "menunggu" | "diproses" | "disetujui" | "ditolak";
type JenisPermohonan = "baru" | "perpanjangan";
type StatusPegawai = "asn" | "nonasn";

interface VpnAccount {
  username: string;
  password: string;
  kadaluarsa: string;
}

interface VpnHistoryEntry {
  id: string;
  nomorTiket: string;
  tanggalPermohonan: string;
  jenisPermohonan: JenisPermohonan;
  tujuanPermohonan: string;
  namaPemohon: string;
  email: string;
  jabatan: string;
  nomorTelepon: string;
  instansi: string;
  statusPegawai: StatusPegawai;
  nip?: string;
  tanggalAkhirKontrak?: string;
  status: Status;
  catatan?: string;
  vpnAccount?: VpnAccount;
  timeline: {
    diajukan?: string;
    verifikasi?: string;
    persetujuan?: string;
    akunSiap?: string;
    ditolak?: string;
  };
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_DATA: VpnHistoryEntry[] = [
  {
    id: "1",
    nomorTiket: "VPN-20240610-001",
    tanggalPermohonan: "2024-06-10",
    jenisPermohonan: "baru",
    tujuanPermohonan: "Akses aplikasi SIMPEG dan SIPD dari rumah saat WFH",
    namaPemohon: "Ahmad Fauzi, S.Kom",
    email: "ahmad.fauzi@tangerangkota.go.id",
    jabatan: "Pranata Komputer Ahli Muda",
    nomorTelepon: "081234567890",
    instansi: "Dinas Komunikasi dan Informatika",
    statusPegawai: "asn",
    nip: "198504152010011002",
    status: "disetujui",
    timeline: {
      diajukan: "2024-06-10 08:30",
      verifikasi: "2024-06-10 14:15",
      persetujuan: "2024-06-11 09:00",
      akunSiap: "2024-06-11 10:30",
    },
    vpnAccount: {
      username: "ahmad.fauzi",
      password: "Fauzi@Vpn2024",
      kadaluarsa: "2025-06-11",
    },
  },
  {
    id: "2",
    nomorTiket: "VPN-20240615-002",
    tanggalPermohonan: "2024-06-15",
    jenisPermohonan: "perpanjangan",
    tujuanPermohonan: "Perpanjangan akses VPN untuk monitoring sistem jaringan",
    namaPemohon: "Siti Rahayu, S.T",
    email: "siti.rahayu@tangerangkota.go.id",
    jabatan: "Analis Sistem Informasi",
    nomorTelepon: "082345678901",
    instansi: "Badan Pengelolaan Keuangan dan Aset Daerah",
    statusPegawai: "asn",
    nip: "199001202015012001",
    status: "diproses",
    timeline: {
      diajukan: "2024-06-15 09:00",
      verifikasi: "2024-06-15 16:00",
    },
  },
  {
    id: "3",
    nomorTiket: "VPN-20240618-003",
    tanggalPermohonan: "2024-06-18",
    jenisPermohonan: "baru",
    tujuanPermohonan: "Akses sistem e-budgeting dari luar kantor",
    namaPemohon: "Budi Santoso",
    email: "budi.santoso@vendor.com",
    jabatan: "Staf IT Vendor",
    nomorTelepon: "083456789012",
    instansi: "Sekretariat Daerah",
    statusPegawai: "nonasn",
    tanggalAkhirKontrak: "2024-12-31",
    status: "menunggu",
    timeline: {
      diajukan: "2024-06-18 11:00",
    },
  },
  {
    id: "4",
    nomorTiket: "VPN-20240520-004",
    tanggalPermohonan: "2024-05-20",
    jenisPermohonan: "baru",
    tujuanPermohonan: "Kebutuhan akses data untuk penyusunan laporan tahunan",
    namaPemohon: "Dewi Anggraini, S.E",
    email: "dewi.anggraini@tangerangkota.go.id",
    jabatan: "Perencana Ahli Pertama",
    nomorTelepon: "084567890123",
    instansi: "Badan Perencanaan Pembangunan Daerah",
    statusPegawai: "asn",
    nip: "199205102018012002",
    status: "ditolak",
    catatan: "Data instansi tidak sesuai. Harap hubungi admin untuk klarifikasi.",
    timeline: {
      diajukan: "2024-05-20 10:00",
      verifikasi: "2024-05-21 09:30",
      ditolak: "2024-05-21 14:00",
    },
  },
  {
    id: "5",
    nomorTiket: "VPN-20240601-005",
    tanggalPermohonan: "2024-06-01",
    jenisPermohonan: "perpanjangan",
    tujuanPermohonan: "Perpanjangan akses untuk pengelolaan aplikasi kepegawaian",
    namaPemohon: "Rizky Permana, S.Kom",
    email: "rizky.permana@tangerangkota.go.id",
    jabatan: "Pranata Komputer Ahli Pertama",
    nomorTelepon: "085678901234",
    instansi: "Badan Kepegawaian dan Pengembangan SDM",
    statusPegawai: "asn",
    nip: "199308152019031003",
    status: "disetujui",
    timeline: {
      diajukan: "2024-06-01 08:00",
      verifikasi: "2024-06-01 13:00",
      persetujuan: "2024-06-02 08:30",
      akunSiap: "2024-06-02 09:00",
    },
    vpnAccount: {
      username: "rizky.permana",
      password: "Rizky@Vpn2024!",
      kadaluarsa: "2025-06-02",
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  menunggu: {
    label: "Menunggu",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  diproses: {
    label: "Diproses",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  disetujui: {
    label: "Disetujui",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  ditolak: {
    label: "Ditolak",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

const TIMELINE_STEPS = [
  { key: "diajukan", label: "Permohonan Diajukan", icon: FileText },
  { key: "verifikasi", label: "Verifikasi Dokumen", icon: AlertCircle },
  { key: "persetujuan", label: "Persetujuan", icon: CheckCircle2 },
  { key: "akunSiap", label: "Akun VPN Siap", icon: Wifi },
] as const;

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const [datePart, timePart] = dateStr.split(" ");
  const [y, m, d] = datePart.split("-");
  return timePart
    ? `${d}/${m}/${y} ${timePart}`
    : `${d}/${m}/${y}`;
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      title="Salin"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  entry,
  onClose,
}: {
  entry: VpnHistoryEntry;
  onClose: () => void;
}) {
  const cfg = STATUS_CONFIG[entry.status];

  // Determine which timeline steps are done / active / upcoming
  const getTimelineStatus = (key: string) => {
    if (entry.status === "ditolak") {
      if (key === "diajukan" && entry.timeline.diajukan) return "done";
      if (key === "verifikasi" && entry.timeline.verifikasi) return "done";
      return "rejected";
    }
    const val = entry.timeline[key as keyof typeof entry.timeline];
    if (val) return "done";
    // find first missing step
    const firstMissing = TIMELINE_STEPS.findIndex(
      (s) => !entry.timeline[s.key as keyof typeof entry.timeline]
    );
    const idx = TIMELINE_STEPS.findIndex((s) => s.key === key);
    if (idx === firstMissing) return "active";
    return "upcoming";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">No. Tiket</p>
              <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-50">
                {entry.nomorTiket}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={entry.status} />
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
          {/* ── Left: Info Pemohon ── */}
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Informasi Pemohon
            </h3>

            <InfoRow icon={<User className="h-4 w-4" />} label="Nama Pemohon" value={entry.namaPemohon} />
            <InfoRow icon={<Hash className="h-4 w-4" />} label="NIP / Status" value={entry.nip ?? `Non-ASN (s/d ${formatDate(entry.tanggalAkhirKontrak ?? "")})`} />
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Jabatan" value={entry.jabatan} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Instansi" value={entry.instansi} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={entry.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="No. Telepon" value={entry.nomorTelepon} />
            <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Tgl. Permohonan" value={formatDate(entry.tanggalPermohonan)} />
            <InfoRow
              icon={<RefreshCw className="h-4 w-4" />}
              label="Jenis Permohonan"
              value={entry.jenisPermohonan === "baru" ? "Permohonan Baru" : "Perpanjangan"}
            />

            <div className="pt-1">
              <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <FileText className="h-4 w-4" /> Tujuan Penggunaan
              </p>
              <p className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {entry.tujuanPermohonan}
              </p>
            </div>

            {/* Catatan penolakan */}
            {entry.status === "ditolak" && entry.catatan && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40 p-3">
                <p className="mb-1 text-xs font-semibold text-red-700 dark:text-red-400">
                  Alasan Penolakan
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{entry.catatan}</p>
              </div>
            )}
          </div>

          {/* ── Right: Timeline + Akun VPN ── */}
          <div className="p-6 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Timeline Proses
            </h3>

            <div className="relative space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const tsStatus = getTimelineStatus(step.key);
                const timeVal = entry.timeline[step.key as keyof typeof entry.timeline];
                const isLast = idx === TIMELINE_STEPS.length - 1;

                // If status is ditolak and this is the "ditolak" moment
                const isRejectionPoint =
                  entry.status === "ditolak" &&
                  step.key === "verifikasi" &&
                  entry.timeline.verifikasi &&
                  !entry.timeline.persetujuan;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Connector line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          tsStatus === "done"
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : tsStatus === "active"
                            ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950"
                            : tsStatus === "rejected"
                            ? "border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600"
                            : "border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600"
                        }`}
                      >
                        <step.icon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 my-1 min-h-[24px] ${
                            tsStatus === "done"
                              ? "bg-emerald-300 dark:bg-emerald-700"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-5 pt-1 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          tsStatus === "done"
                            ? "text-slate-900 dark:text-slate-50"
                            : tsStatus === "active"
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        {step.label}
                      </p>
                      {timeVal ? (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(timeVal)}
                        </p>
                      ) : tsStatus === "active" ? (
                        <p className="mt-0.5 text-xs text-blue-500">Sedang diproses…</p>
                      ) : (
                        <p className="mt-0.5 text-xs text-slate-300 dark:text-slate-600">Menunggu</p>
                      )}

                      {/* Rejection badge after verifikasi */}
                      {isRejectionPoint && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                          <XCircle className="h-3.5 w-3.5" />
                          Ditolak — {formatDate(entry.timeline.ditolak ?? "")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VPN Account Box */}
            {entry.status === "disetujui" && entry.vpnAccount && (
              <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-teal-950/40 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Akun VPN Anda
                  </p>
                </div>

                <VpnField label="Username" value={entry.vpnAccount.username} />
                <VpnField label="Password" value={entry.vpnAccount.password} secret />
                <VpnField label="Berlaku s/d" value={formatDate(entry.vpnAccount.kadaluarsa)} />

                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 pt-1">
                  ⚠️ Jangan bagikan akun VPN ini kepada siapapun.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex-shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-words">{value || "-"}</p>
      </div>
    </div>
  );
}

function VpnField({
  label,
  value,
  secret,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/70 dark:bg-slate-800/70 px-3 py-2">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">
          {secret && !show ? "••••••••••••" : value}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {secret && (
          <button
            onClick={() => setShow(!show)}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
            title={show ? "Sembunyikan" : "Tampilkan"}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        <CopyButton text={value} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VpnHistory() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "semua">("semua");
  const [selectedEntry, setSelectedEntry] = useState<VpnHistoryEntry | null>(null);

  const filtered = useMemo(() => {
    return DUMMY_DATA.filter((entry) => {
      const matchStatus =
        filterStatus === "semua" || entry.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        entry.namaPemohon.toLowerCase().includes(q) ||
        entry.nomorTiket.toLowerCase().includes(q) ||
        entry.instansi.toLowerCase().includes(q) ||
        entry.jenisPermohonan.includes(q);
      return matchStatus && matchSearch;
    });
  }, [search, filterStatus]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Riwayat Permohonan VPN
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pantau status permohonan VPN Anda
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["semua", "menunggu", "diproses", "disetujui", "ditolak"] as const)
          .filter((s) => s !== "semua")
          .map((s) => {
            const count = DUMMY_DATA.filter((e) => e.status === s).length;
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s === filterStatus ? "semua" : s)}
                className={`rounded-xl border p-3 text-left transition-all hover:shadow-md ${
                  filterStatus === s
                    ? `${cfg.bg} ${cfg.border} ring-2 ring-offset-1 ${
                        s === "menunggu"
                          ? "ring-amber-400"
                          : s === "diproses"
                          ? "ring-blue-400"
                          : s === "disetujui"
                          ? "ring-emerald-400"
                          : "ring-red-400"
                      }`
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <p className={`text-2xl font-bold ${cfg.color}`}>{count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                  {cfg.label}
                </p>
              </button>
            );
          })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, no. tiket, instansi…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-600 dark:focus:ring-blue-900"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | "semua")}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-600 dark:focus:ring-blue-900"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="diproses">Diproses</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">No</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">No. Tiket</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Tgl. Permohonan</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Nama Pemohon</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Instansi</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Jenis</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-4 py-3.5 text-center font-semibold text-slate-600 dark:text-slate-300">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Shield className="h-10 w-10 opacity-30" />
                      <p className="text-sm font-medium">Tidak ada data ditemukan</p>
                      <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {entry.nomorTiket}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(entry.tanggalPermohonan)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {entry.namaPemohon}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 hidden md:table-cell max-w-[200px] truncate">
                      {entry.instansi}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          entry.jenisPermohonan === "baru"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                        }`}
                      >
                        {entry.jenisPermohonan === "baru" ? "Baru" : "Perpanjangan"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
            Menampilkan {filtered.length} dari {DUMMY_DATA.length} permohonan
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedEntry && (
        <DetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  );
}