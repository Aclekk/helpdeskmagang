"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, RotateCcw, Send, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfilAplikasiSPBEFormProps {
  onBack: () => void;
}

type JenisAplikasi = "manajemen" | "layanan" | "baru" | "fitur";
type JenisAkses = "lokal" | "publik" | "";
type JenisDomain = "baru" | "perubahan" | "";

interface SpesifikasiTeknis {
  bahasaPemrograman: string;
  framework: string;
  database: string;
  webServer: string;
  modulLainnya: string;
}

interface PersonilRow {
  nama: string;
  usernameGitlab: string;
  jabatanPeran: string;
  keterangan: string;
}

interface FormData {
  // Section A
  namaAplikasi: string;
  jenisAplikasi: JenisAplikasi | "";
  unitKerjaPengelola: string;
  unitKerjaPengelolaId: string;
  picNama: string;
  picNomorKontak: string;
  subdomain: string;
  spesifikasiTeknis: SpesifikasiTeknis;
  tanggalPermohonan: string;
  tanggalRencanaPublikasi: string;
  // Section I
  namaProyek: string;
  tujuanPembuatan: string;
  namaRepositori: string;
  tanggalBerakhir: string;
  jenisDomain: JenisDomain;
  usulanNamaDomain: string;
  jenisAkses: JenisAkses;
  // Section III
  personil: PersonilRow[];
  // Section IV
  rincianSpesifikasi: string;
}

interface Instansi {
  idUnor: string;
  namaUnor: string;
  namaUnorAlias: string;
}

const today = new Date().toISOString().split("T")[0];

const emptyPersonil = (): PersonilRow => ({
  nama: "",
  usernameGitlab: "",
  jabatanPeran: "",
  keterangan: "",
});

const initialForm: FormData = {
  namaAplikasi: "",
  jenisAplikasi: "",
  unitKerjaPengelola: "",
  unitKerjaPengelolaId: "",
  picNama: "",
  picNomorKontak: "",
  subdomain: "",
  spesifikasiTeknis: {
    bahasaPemrograman: "",
    framework: "",
    database: "",
    webServer: "",
    modulLainnya: "",
  },
  tanggalPermohonan: today,
  tanggalRencanaPublikasi: "",
  namaProyek: "",
  tujuanPembuatan: "",
  namaRepositori: "",
  tanggalBerakhir: "",
  jenisDomain: "",
  usulanNamaDomain: "",
  jenisAkses: "",
  personil: [emptyPersonil(), emptyPersonil(), emptyPersonil(), emptyPersonil()],
  rincianSpesifikasi: "",
};

const jenisOptions: { value: JenisAplikasi; label: string }[] = [
  { value: "manajemen", label: "Manajemen Pemerintahan" },
  { value: "layanan", label: "Layanan Publik" },
  { value: "baru", label: "Aplikasi Baru" },
  { value: "fitur", label: "Penambahan Fitur / Modul" },
];

const inputClass =
  "block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30";

const labelClass = "block text-sm font-semibold text-slate-900 dark:text-white";

const textareaClass =
  "block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30";

const tableInputClass =
  "block w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30";

function SectionHeader({ label, subtitle }: { label: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 border-t-2 border-slate-200/80 dark:border-slate-700/80" />
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-1 border-t-2 border-slate-200/80 dark:border-slate-700/80" />
    </div>
  );
}

// Reusable checkbox button
function CheckboxButton({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 rounded-xl border-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
        checked
          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 dark:shadow-none"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-500"
            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

export default function ProfilAplikasiSPBEForm({ onBack }: ProfilAplikasiSPBEFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);

  const [instansiList, setInstansiList] = useState<Instansi[]>([]);
  const [instansiLoading, setInstansiLoading] = useState(false);
  const [instansiError, setInstansiError] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const fetchInstansi = async () => {
      setInstansiLoading(true);
      setInstansiError(false);
      try {
        const res = await fetch("/api/instansi");
        if (!res.ok) throw new Error("Gagal mengambil data instansi");
        const data: Instansi[] = await res.json();
        setInstansiList(data);
      } catch {
        setInstansiError(true);
        toast({
          variant: "destructive",
          title: "Gagal memuat data instansi",
          description: "Silakan refresh halaman dan coba lagi",
        });
      } finally {
        setInstansiLoading(false);
      }
    };
    fetchInstansi();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => { isDrawing.current = false; };

  const clearSignature = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpesifikasiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      spesifikasiTeknis: { ...prev.spesifikasiTeknis, [name]: value },
    }));
  };

  const handleSelectInstansi = (namaUnor: string) => {
    const selected = instansiList.find((i) => i.namaUnor === namaUnor);
    setFormData((prev) => ({
      ...prev,
      unitKerjaPengelola: namaUnor,
      unitKerjaPengelolaId: selected?.idUnor ?? "",
    }));
  };

  const handlePersonilChange = (index: number, field: keyof PersonilRow, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.personil];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, personil: updated };
    });
  };

  const handleReset = () => {
    setFormData(initialForm);
    clearSignature();
    toast({ title: "Form direset", description: "Semua field telah dikosongkan" });
  };

  const handleCancel = () => {
    const hasData = formData.namaAplikasi !== "" || formData.jenisAplikasi !== "" || formData.unitKerjaPengelola !== "";
    if (hasData) {
      const confirmed = confirm("Data yang sudah diisi akan hilang. Yakin ingin membatalkan?");
      if (confirmed) onBack();
    } else {
      onBack();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaAplikasi || !formData.jenisAplikasi) {
      toast({ variant: "destructive", title: "Form belum lengkap", description: "Mohon lengkapi semua field yang wajib diisi" });
      return;
    }
    if (!hasSignature) {
      toast({ variant: "destructive", title: "Tanda tangan belum diisi", description: "Mohon bubuhkan tanda tangan Anda terlebih dahulu" });
      return;
    }
    setLoading(true);
    const signatureDataUrl = canvasRef.current?.toDataURL("image/png");
    await new Promise((res) => setTimeout(res, 1000));
    console.log("Form submitted:", { ...formData, signature: signatureDataUrl });
    toast({ title: "Data telah terkirim!", description: "Permohonan profil aplikasi SPBE Anda sedang diproses." });
    setLoading(false);
    setTimeout(() => onBack(), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="space-y-3">
          <button
            onClick={onBack}
            className="group mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Layanan
          </button>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Form Pengajuan Profil Aplikasi SPBE
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Lengkapi formulir profil aplikasi untuk keperluan pendaftaran SPBE
          </p>
        </div>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-slate-950/50">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

          {/* Card Header */}
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:from-slate-900/80 dark:to-slate-900/60 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  A. Profil Aplikasi
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">Diisi oleh Pemohon</p>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="group inline-flex h-12 items-center gap-2.5 rounded-xl border-2 border-slate-300 bg-white px-6 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:scale-98 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700/80"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm">Kembali ke Daftar</span>
              </button>
            </div>
          </div>

          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ═══════════════════════════════════════
                  A. PROFIL APLIKASI SPBE
              ═══════════════════════════════════════ */}
              <SectionHeader
                label="Profil Aplikasi"
                subtitle="Informasi umum mengenai aplikasi yang diajukan"
              />

              {/* Nama Aplikasi */}
              <div className="space-y-2.5">
                <label className={labelClass}>
                  Nama Aplikasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaAplikasi"
                  value={formData.namaAplikasi}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama aplikasi"
                  className={inputClass}
                  required
                />
              </div>

              {/* Jenis Aplikasi */}
              <div className="space-y-3">
                <label className={labelClass}>
                  Jenis Aplikasi <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pilih salah satu jenis aplikasi</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jenisOptions.map((opt) => {
                    const selected = formData.jenisAplikasi === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, jenisAplikasi: opt.value }))}
                        className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-medium text-left transition-all duration-200 ${
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 dark:shadow-none"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            selected
                              ? "border-blue-500 bg-white dark:border-blue-400"
                              : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                          }`}
                        >
                          {selected && <span className="h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-400" />}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unit Kerja Pengelola */}
              <div className="space-y-2.5">
                <label className={labelClass}>Unit Kerja Pengelola</label>
                <Select
                  value={formData.unitKerjaPengelola}
                  onValueChange={handleSelectInstansi}
                  disabled={instansiLoading || instansiError}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <SelectValue
                      placeholder={
                        instansiLoading ? "Memuat instansi..." : instansiError ? "Gagal memuat data instansi" : "Pilih unit kerja pengelola"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {instansiLoading ? (
                      <SelectItem value="_loading" disabled>Memuat data instansi...</SelectItem>
                    ) : instansiList.length > 0 ? (
                      instansiList.map((item) => (
                        <SelectItem key={item.idUnor} value={item.namaUnor}>{item.namaUnor}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_empty" disabled>Tidak ada data instansi</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* PIC / Pengelola Teknis */}
              <div className="space-y-2.5">
                <label className={labelClass}>PIC / Pengelola Teknis Aplikasi SPBE</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Nama PIC:</label>
                    <input
                      type="text"
                      name="picNama"
                      value={formData.picNama}
                      onChange={handleInputChange}
                      placeholder="Nama pengelola teknis"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Nomor Kontak:</label>
                    <input
                      type="text"
                      name="picNomorKontak"
                      value={formData.picNomorKontak}
                      onChange={handleInputChange}
                      placeholder="Nomor kontak"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Subdomain */}
              <div className="space-y-2.5">
                <label className={labelClass}>Subdomain</label>
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  placeholder="contoh: aplikasi.tangerangkota.go.id"
                  className={inputClass}
                />
              </div>

              {/* Spesifikasi Teknis */}
              <div className="space-y-4">
                <label className={labelClass}>Spesifikasi Teknis Aplikasi SPBE</label>
                <div className="overflow-hidden rounded-xl border-2 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-b-2 border-slate-200/80 dark:border-slate-700/80">
                          <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white w-1/3">Komponen</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                        {[
                          { label: "a. Bahasa Pemrograman", name: "bahasaPemrograman", placeholder: "contoh: PHP, Python, JavaScript" },
                          { label: "b. Framework", name: "framework", placeholder: "contoh: Laravel, Django, Next.js" },
                          { label: "c. Database", name: "database", placeholder: "contoh: MySQL, PostgreSQL" },
                          { label: "d. Web Server", name: "webServer", placeholder: "contoh: Apache, Nginx" },
                          { label: "e. Modul lainnya", name: "modulLainnya", placeholder: "Modul atau teknologi tambahan lainnya" },
                        ].map((row) => (
                          <tr key={row.name} className="bg-white dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 italic">{row.label}</td>
                            <td className="px-5 py-4">
                              <input
                                type="text"
                                name={row.name}
                                value={formData.spesifikasiTeknis[row.name as keyof SpesifikasiTeknis]}
                                onChange={handleSpesifikasiChange}
                                placeholder={row.placeholder}
                                className={tableInputClass}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label className={labelClass}>Tanggal Permohonan</label>
                  <input
                    type="date"
                    name="tanggalPermohonan"
                    value={formData.tanggalPermohonan}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-70 bg-slate-50 dark:bg-slate-800/40`}
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    Otomatis diset ke hari ini
                  </p>
                </div>
                <div className="space-y-2.5">
                  <label className={labelClass}>Tanggal Rencana Dipublikasikan</label>
                  <input
                    type="date"
                    name="tanggalRencanaPublikasi"
                    value={formData.tanggalRencanaPublikasi}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* ═══════════════════════════════════════
                  I. DATA REPOSITORY
              ═══════════════════════════════════════ */}
              <div className="pt-4">
                <SectionHeader
                  label="Data Repository"
                  subtitle="Informasi mengenai repositori dan domain aplikasi"
                />
              </div>

              {/* Nama Proyek */}
              <div className="space-y-2.5">
                <label className={labelClass}>Nama Proyek / Aplikasi</label>
                <input
                  type="text"
                  name="namaProyek"
                  value={formData.namaProyek}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama proyek atau aplikasi"
                  className={inputClass}
                />
              </div>

              {/* Tujuan Pembuatan */}
              <div className="space-y-2.5">
                <label className={labelClass}>Tujuan Pembuatan Aplikasi</label>
                <textarea
                  name="tujuanPembuatan"
                  value={formData.tujuanPembuatan}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Jelaskan tujuan pembuatan aplikasi ini"
                  className={textareaClass}
                />
              </div>

              {/* Nama Repositori */}
              <div className="space-y-2.5">
                <label className={labelClass}>Nama Repositori yang Diajukan</label>
                <input
                  type="text"
                  name="namaRepositori"
                  value={formData.namaRepositori}
                  onChange={handleInputChange}
                  placeholder="contoh: nama-repositori-gitlab"
                  className={inputClass}
                />
              </div>

              {/* Tanggal Berakhir */}
              <div className="space-y-2.5">
                <label className={labelClass}>Tanggal Berakhir / Ditutup</label>
                <input
                  type="date"
                  name="tanggalBerakhir"
                  value={formData.tanggalBerakhir}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              {/* Nama Domain — checkbox Baru / Perubahan */}
              <div className="space-y-3">
                <label className={labelClass}>Nama Domain</label>
                <div className="flex flex-wrap gap-3">
                  <CheckboxButton
                    checked={formData.jenisDomain === "baru"}
                    onToggle={() =>
                      setFormData((prev) => ({
                        ...prev,
                        jenisDomain: prev.jenisDomain === "baru" ? "" : "baru",
                      }))
                    }
                    label="Baru"
                  />
                  <CheckboxButton
                    checked={formData.jenisDomain === "perubahan"}
                    onToggle={() =>
                      setFormData((prev) => ({
                        ...prev,
                        jenisDomain: prev.jenisDomain === "perubahan" ? "" : "perubahan",
                      }))
                    }
                    label="Perubahan"
                  />
                </div>
              </div>

              {/* Usulan Nama Domain */}
              <div className="space-y-2.5">
                <label className={labelClass}>Usulan Nama Domain</label>
                <div className="flex items-center gap-0">
                  <input
                    type="text"
                    name="usulanNamaDomain"
                    value={formData.usulanNamaDomain}
                    onChange={handleInputChange}
                    placeholder="nama-subdomain"
                    className="block w-full h-12 rounded-l-xl border-2 border-r-0 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  />
                  <span className="inline-flex h-12 items-center rounded-r-xl border-2 border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 whitespace-nowrap">
                    .tangerangkota.go.id
                  </span>
                </div>
              </div>

              {/* Jenis Akses */}
              <div className="space-y-3">
                <label className={labelClass}>Jenis Akses</label>
                <div className="flex flex-wrap gap-3">
                  <CheckboxButton
                    checked={formData.jenisAkses === "lokal"}
                    onToggle={() =>
                      setFormData((prev) => ({
                        ...prev,
                        jenisAkses: prev.jenisAkses === "lokal" ? "" : "lokal",
                      }))
                    }
                    label="Lokal"
                  />
                  <CheckboxButton
                    checked={formData.jenisAkses === "publik"}
                    onToggle={() =>
                      setFormData((prev) => ({
                        ...prev,
                        jenisAkses: prev.jenisAkses === "publik" ? "" : "publik",
                      }))
                    }
                    label="Publik"
                  />
                </div>
              </div>

              {/* ═══════════════════════════════════════
                  III. DAFTAR PERSONIL
              ═══════════════════════════════════════ */}
              <div className="pt-4">
                <SectionHeader
                  label="Daftar Personil yang Mengajukan Akses"
                  subtitle="Data personil yang terlibat dalam pengelolaan aplikasi"
                />
              </div>

              <div className="overflow-hidden rounded-xl border-2 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-b-2 border-slate-200/80 dark:border-slate-700/80">
                        <th className="px-4 py-4 text-center text-xs font-semibold text-slate-900 dark:text-white w-12">No.</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">Nama Personil</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white italic">Username Gitlab</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">Jabatan/Peran</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 dark:text-white">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {formData.personil.map((row, index) => (
                        <tr key={index} className="bg-white dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">{index + 1}</td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={row.nama}
                              onChange={(e) => handlePersonilChange(index, "nama", e.target.value)}
                              placeholder="Nama lengkap"
                              className={tableInputClass}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={row.usernameGitlab}
                              onChange={(e) => handlePersonilChange(index, "usernameGitlab", e.target.value)}
                              placeholder="username.gitlab"
                              className={tableInputClass}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={row.jabatanPeran}
                              onChange={(e) => handlePersonilChange(index, "jabatanPeran", e.target.value)}
                              placeholder="contoh: Developer"
                              className={tableInputClass}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={row.keterangan}
                              onChange={(e) => handlePersonilChange(index, "keterangan", e.target.value)}
                              placeholder="Keterangan"
                              className={tableInputClass}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

     
            

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 border-t-2 border-slate-200/60 pt-8 dark:border-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="group inline-flex h-12 items-center gap-2.5 rounded-xl border-2 border-slate-300 bg-white px-6 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:scale-98 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700/80"
                  >
                    <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    <span className="text-sm">Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex h-12 items-center rounded-xl border-2 border-red-300 bg-white px-6 font-semibold text-red-600 shadow-sm transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:shadow-md active:scale-98 dark:border-red-800/80 dark:bg-slate-800/80 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950/50"
                  >
                    <span className="text-sm">Batal</span>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/40 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 dark:from-blue-600 dark:to-blue-700 dark:shadow-blue-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {loading ? (
                    <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="relative z-10 h-4 w-4" />
                  )}
                  <span className="relative z-10 text-sm">{loading ? "Mengirim..." : "Kirim Permohonan"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Info Banner */}
        <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-yellow-50/50 p-6 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-yellow-950/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">Penting!</h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-400">
                Pastikan semua informasi yang Anda masukkan sudah benar dan sesuai. Data yang sudah disubmit akan langsung diproses oleh tim pengelola SPBE.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}