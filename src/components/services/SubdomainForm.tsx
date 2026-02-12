"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SubdomainFormProps {
  onBack: () => void;
}

interface FormData {
  namaAplikasi: string;
  jenisAplikasi: string;
  unitOrganisasi: string;
  emailPemohon: string;
  namaSubdomain: string;
  bahasaPemrograman: string;
  framework: string;
  webserver: string;
  tanggalRencana: string;
  keteranganTambahan: string;
}

export default function SubdomainForm({ onBack }: SubdomainFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    namaAplikasi: "",
    jenisAplikasi: "",
    unitOrganisasi: "",
    emailPemohon: "",
    namaSubdomain: "",
    bahasaPemrograman: "",
    framework: "",
    webserver: "",
    tanggalRencana: "",
    keteranganTambahan: "",
  });

  // Auto-fill email dari user yang login
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        emailPemohon: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      namaAplikasi: "",
      jenisAplikasi: "",
      unitOrganisasi: "",
      emailPemohon: "",
      namaSubdomain: "",
      bahasaPemrograman: "",
      framework: "",
      webserver: "",
      tanggalRencana: "",
      keteranganTambahan: "",
    });
    toast({
      title: "Form direset",
      description: "Semua field telah dikosongkan",
    });
  };

  const handleCancel = () => {
    const hasData = Object.values(formData).some((value) => value !== "");
    if (hasData) {
      const confirmed = confirm(
        "Data yang sudah diisi akan hilang. Yakin ingin membatalkan?",
      );
      if (confirmed) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field required
    const requiredFields = [
      "namaAplikasi",
      "jenisAplikasi",
      "unitOrganisasi",
      "namaSubdomain",
      "bahasaPemrograman",
      "framework",
      "webserver",
      "tanggalRencana",
    ];

    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData],
    );

    if (emptyFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Form belum lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
      });
      return;
    }

    // TODO: Kirim data ke backend/API
    console.log("Form submitted:", formData);

    toast({
      title: "Pengajuan berhasil disimpan!",
      description: "Pengajuan subdomain Anda sedang diproses",
    });

    // Kembali ke list
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          {/* Back Button - Style seperti ServiceDetail */}
          <button
            onClick={onBack}
            className="group mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Detail Layanan
          </button>
          
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Form Pengajuan Subdomain
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Lengkapi formulir di bawah untuk mengajukan subdomain baru
          </p>
        </div>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-slate-950/50">
          {/* Top Accent Border */}
          <div className="h-1 w-full bg-blue-600" />

          {/* Card Header */}
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:from-slate-900/80 dark:to-slate-900/60 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Permohonan Subdomain
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Isi semua field yang bertanda bintang merah (*)
                </p>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="group inline-flex h-12 items-center gap-2.5 rounded-xl border-2 border-slate-300 bg-white px-6 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:scale-98 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700/80"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm">Kembali ke Detail Layanan</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grid 2 Kolom */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                {/* Nama Aplikasi */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Nama Aplikasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaAplikasi"
                    value={formData.namaAplikasi}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama aplikasi"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Jenis Aplikasi */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Jenis Aplikasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenisAplikasi"
                    value={formData.jenisAplikasi}
                    onChange={handleInputChange}
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  >
                    <option value="">-- Pilih Jenis --</option>
                    <option value="web">Manajemen Pemerintahan</option>
                    <option value="mobile">Layanan Publik</option>
                    <option value="desktop">Aplikasi Baru</option>
                    <option value="api">Penambahan Fitur Atau Modul</option>
                  </select>
                </div>

                {/* Unit Organisasi */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Unit Organisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unitOrganisasi"
                    value={formData.unitOrganisasi}
                    onChange={handleInputChange}
                    placeholder="Masukkan Unit Organisasi"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Email Pemohon */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Email Pemohon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailPemohon"
                    value={formData.emailPemohon}
                    readOnly
                    placeholder="ajat@tangerangkota.go.id"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <svg
                      className="h-3.5 w-3.5"
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
                    Email otomatis terisi sesuai akun yang login
                  </p>
                </div>

                {/* Nama Subdomain */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Nama Subdomain <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaSubdomain"
                    value={formData.namaSubdomain}
                    onChange={handleInputChange}
                    placeholder="contoh: helpdesk.tangerangkota.go.id"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Bahasa Pemrograman */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Bahasa Pemrograman <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bahasaPemrograman"
                    value={formData.bahasaPemrograman}
                    onChange={handleInputChange}
                    placeholder="PHP, Java, Python, dll"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Framework */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Framework <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="framework"
                    value={formData.framework}
                    onChange={handleInputChange}
                    placeholder="Laravel, CodeIgniter, Spring, dll"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Webserver */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Webserver <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="webserver"
                    value={formData.webserver}
                    onChange={handleInputChange}
                    placeholder="Apache, Nginx, IIS, dll"
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Tanggal Rencana */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Tanggal Rencana <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalRencana"
                    value={formData.tanggalRencana}
                    onChange={handleInputChange}
                    className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>
              </div>

              {/* Keterangan Tambahan - Full Width */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Keterangan Tambahan
                </label>
                <textarea
                  name="keteranganTambahan"
                  value={formData.keteranganTambahan}
                  onChange={handleInputChange}
                  placeholder="Keterangan tambahan (opsional)"
                  rows={4}
                  className="block min-h-[120px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 border-t border-slate-200/60 pt-8 dark:border-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
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
                  className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/40 active:scale-100 dark:from-blue-600 dark:to-blue-700 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Save className="relative z-10 h-4 w-4" />
                  <span className="relative z-10 text-sm">
                    Simpan Pengajuan
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Banner */}
        <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-yellow-50/50 p-6 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-yellow-950/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Penting!
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-400">
                Pastikan semua informasi yang Anda masukkan sudah benar. Data
                yang sudah disubmit tidak dapat diubah dan akan langsung
                diproses oleh tim IT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
