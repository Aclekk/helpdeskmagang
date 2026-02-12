"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepositoryGitFormProps {
  onBack: () => void;
}

interface PersonilRow {
  id: string;
  namaPersonil: string;
  usernameGitlab: string;
  keterangan: string;
}

interface FormData {
  namaPekerjaan: string;
  namaRepository: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  rincianPekerjaan: string;
  perusahaan: string;
  alamat: string;
  penanggungJawab: string;
  personilList: PersonilRow[];
}

export default function RepositoryGitForm({ onBack }: RepositoryGitFormProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    namaPekerjaan: "",
    namaRepository: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    rincianPekerjaan: "",
    perusahaan: "Konsultan Perorangan/PT",
    alamat: "",
    penanggungJawab: "",
    personilList: [
      { id: "1", namaPersonil: "", usernameGitlab: "", keterangan: "" },
      { id: "2", namaPersonil: "", usernameGitlab: "", keterangan: "" },
      { id: "3", namaPersonil: "", usernameGitlab: "", keterangan: "" },
      { id: "4", namaPersonil: "", usernameGitlab: "", keterangan: "" },
      { id: "5", namaPersonil: "", usernameGitlab: "", keterangan: "" },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonilChange = (
    id: string,
    field: keyof PersonilRow,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      personilList: prev.personilList.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const handleAddRow = () => {
    const newId = String(formData.personilList.length + 1);
    setFormData((prev) => ({
      ...prev,
      personilList: [
        ...prev.personilList,
        { id: newId, namaPersonil: "", usernameGitlab: "", keterangan: "" },
      ],
    }));
  };

  const handleRemoveRow = () => {
    if (formData.personilList.length > 1) {
      setFormData((prev) => ({
        ...prev,
        personilList: prev.personilList.slice(0, -1),
      }));
    } else {
      toast({
        variant: "destructive",
        title: "Tidak bisa menghapus",
        description: "Minimal harus ada 1 baris personil",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      namaPekerjaan: "",
      namaRepository: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      rincianPekerjaan: "",
      perusahaan: "Konsultan Perorangan/PT",
      alamat: "",
      penanggungJawab: "",
      personilList: [
        { id: "1", namaPersonil: "", usernameGitlab: "", keterangan: "" },
        { id: "2", namaPersonil: "", usernameGitlab: "", keterangan: "" },
        { id: "3", namaPersonil: "", usernameGitlab: "", keterangan: "" },
        { id: "4", namaPersonil: "", usernameGitlab: "", keterangan: "" },
        { id: "5", namaPersonil: "", usernameGitlab: "", keterangan: "" },
      ],
    });
    toast({
      title: "Form direset",
      description: "Semua field telah dikosongkan",
    });
  };

  const handleCancel = () => {
    const hasData =
      formData.namaPekerjaan !== "" ||
      formData.namaRepository !== "" ||
      formData.personilList.some(
        (p) => p.namaPersonil || p.usernameGitlab || p.keterangan,
      );

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
    if (!formData.namaPekerjaan || !formData.namaRepository) {
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
      description: "Pengajuan repository Anda sedang diproses",
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
          {/* Back Button - Style seperti SubdomainForm */}
          <button
            onClick={onBack}
            className="group mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Layanan
          </button>
          
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Form Pengajuan Repository
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Lengkapi formulir untuk mengajukan akses repository baru
          </p>
        </div>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-slate-950/50">
          {/* Top Accent Border - Blue */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

          {/* Card Header */}
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:from-slate-900/80 dark:to-slate-900/60 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Form Pengajuan Repository
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Isi semua informasi yang diperlukan dengan lengkap
                </p>
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

          {/* Form Content */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Info Text */}
              <div className="rounded-xl border-2 border-blue-200/80 bg-gradient-to-r from-blue-50/80 to-blue-100/40 p-5 dark:border-blue-900/50 dark:from-blue-950/40 dark:to-blue-900/20">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  Berdasarkan keperluan penggunaan hak akses logikal ke
                  repository / server milik DISKOMINFO Pemerintah Kota Tangerang
                  untuk pekerjaan sebagai berikut:
                </p>
              </div>

              {/* Nama Pekerjaan */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Nama Pekerjaan:
                </label>
                <input
                  type="text"
                  name="namaPekerjaan"
                  value={formData.namaPekerjaan}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  required
                />
              </div>

              {/* Nama Repository */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Nama Repository:
                </label>
                <input
                  type="text"
                  name="namaRepository"
                  value={formData.namaRepository}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  required
                />
              </div>

              {/* Periode Bekerja */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Periode Bekerja:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Tanggal Mulai:
                    </label>
                    <input
                      type="date"
                      name="tanggalMulai"
                      value={formData.tanggalMulai}
                      onChange={handleInputChange}
                      className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Tanggal Selesai:
                    </label>
                    <input
                      type="date"
                      name="tanggalSelesai"
                      value={formData.tanggalSelesai}
                      onChange={handleInputChange}
                      className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    />
                  </div>
                </div>
              </div>

              {/* Rincian Pekerjaan */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Rincian Pekerjaan:
                </label>
                <textarea
                  name="rincianPekerjaan"
                  value={formData.rincianPekerjaan}
                  onChange={handleInputChange}
                  rows={3}
                  className="block min-h-[96px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
              </div>

              {/* Divider */}
              <div className="border-t-2 border-slate-200/80 dark:border-slate-800/80 pt-8">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-6">
                  Maka dimohon untuk memberikan hak akses logikal kepada:
                </p>
              </div>

              {/* Perusahaan */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Perusahaan:
                </label>
                <input
                  type="text"
                  name="perusahaan"
                  value={formData.perusahaan}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Alamat:
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
              </div>

              {/* Penanggung Jawab */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Penanggung jawab:
                </label>
                <input
                  type="text"
                  name="penanggungJawab"
                  value={formData.penanggungJawab}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
              </div>

              {/* Divider */}
              <div className="border-t-2 border-slate-200/80 dark:border-slate-800/80 pt-8">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-6">
                  Adapun nama Personil yang akan mengakses repository / server
                  milik DISKOMINFO Pemerintah Kota Tangerang adalah sebagai
                  berikut:
                </p>
              </div>

              {/* Tabel Personil */}
              <div className="overflow-hidden rounded-xl border-2 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-b-2 border-slate-200/80 dark:border-slate-700/80">
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white w-20">
                          No.
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                          Nama Personil
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                          Username Gitlab
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {formData.personilList.map((row, index) => (
                        <tr
                          key={row.id}
                          className="bg-white dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                            {index + 1}
                          </td>
                          <td className="px-5 py-4">
                            <input
                              type="text"
                              value={row.namaPersonil}
                              onChange={(e) =>
                                handlePersonilChange(
                                  row.id,
                                  "namaPersonil",
                                  e.target.value,
                                )
                              }
                              className="block w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                            />
                          </td>
                          <td className="px-5 py-4">
                            <input
                              type="text"
                              value={row.usernameGitlab}
                              onChange={(e) =>
                                handlePersonilChange(
                                  row.id,
                                  "usernameGitlab",
                                  e.target.value,
                                )
                              }
                              className="block w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                            />
                          </td>
                          <td className="px-5 py-4">
                            <input
                              type="text"
                              value={row.keterangan}
                              onChange={(e) =>
                                handlePersonilChange(
                                  row.id,
                                  "keterangan",
                                  e.target.value,
                                )
                              }
                              className="block w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:hover:border-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Buttons Tambah/Hapus Baris */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-blue-300 bg-white px-5 font-medium text-blue-600 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-98 dark:border-blue-800 dark:bg-slate-800/80 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-950/40"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Tambah Baris</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveRow}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-red-300 bg-white px-5 font-medium text-red-600 shadow-sm transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:shadow-md active:scale-98 dark:border-red-800 dark:bg-slate-800/80 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Hapus Baris</span>
                </button>
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
