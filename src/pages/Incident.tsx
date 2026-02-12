"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IncidentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    namaPelapor: "",
    instansi: "",
    judulInsiden: "",
    tanggalKejadian: "",
    kategoriInsiden: "",
    mediaPelaporan: "",
    deskripsiInsiden: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi field required
    if (
      !formData.namaPelapor ||
      !formData.judulInsiden ||
      !formData.tanggalKejadian
    ) {
      toast({
        variant: "destructive",
        title: "Form belum lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
      });
      setIsLoading(false);
      return;
    }

    // Simulate submission delay
    setTimeout(() => {
      // Generate incident ticket ID
      const ticketId = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

      toast({
        title: "Laporan Terkirim!",
        description: `Nomor tiket: ${ticketId}. Tim akan segera menindaklanjuti.`,
      });

      setIsLoading(false);

      // Redirect to home page after 1.5s
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }, 1000);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button - Style seperti halaman lain */}
        <button
          onClick={handleBack}
          className="group mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Beranda
        </button>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Laporan Insiden
          </h1>

          {/* Alert Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                Laporkan Insiden TIK
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gunakan formulir ini untuk melaporkan gangguan atau insiden pada
                sistem TIK. Tim kami akan segera menindaklanjuti.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
            {/* Border biru di atas */}
            <div className="h-1.5 w-full bg-blue-600" />

            {/* Header Card */}
            <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm dark:border-slate-800/60 dark:from-slate-900/80 dark:to-slate-900/60 px-8 py-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Form Laporan Insiden
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Berikan informasi selengkap mungkin agar kami dapat menangani
                dengan cepat
              </p>
            </div>

            {/* Content */}
            <div className="pt-6 px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama Pelapor */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Nama Pelapor
                  </label>
                  <input
                    type="text"
                    name="namaPelapor"
                    value={formData.namaPelapor}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Instansi */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Instansi
                  </label>
                  <select
                    name="instansi"
                    value={formData.instansi}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  >
                    <option value="">Pilih Instansi</option>
                    <option value="diskominfo">
                      Diskominfo Kota Tangerang
                    </option>
                    <option value="dinas-pendidikan">Dinas Pendidikan</option>
                    <option value="dinas-kesehatan">Dinas Kesehatan</option>
                    <option value="kecamatan">Kecamatan</option>
                    <option value="kelurahan">Kelurahan</option>
                    <option value="opd-lainnya">OPD Lainnya</option>
                  </select>
                </div>

                {/* Judul Insiden */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Judul Insiden
                  </label>
                  <input
                    type="text"
                    name="judulInsiden"
                    value={formData.judulInsiden}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Tanggal Kejadian */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Tanggal Kejadian
                  </label>
                  <input
                    type="date"
                    name="tanggalKejadian"
                    value={formData.tanggalKejadian}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    required
                  />
                </div>

                {/* Kategori Insiden */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Kategori Insiden
                  </label>
                  <select
                    name="kategoriInsiden"
                    value={formData.kategoriInsiden}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="jaringan">Gangguan Jaringan</option>
                    <option value="hardware">Hardware/Perangkat</option>
                    <option value="software">Software/Aplikasi</option>
                    <option value="keamanan">Keamanan Sistem</option>
                    <option value="email">Email</option>
                    <option value="website">Website</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Media Pelaporan */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Media pelaporan*
                  </label>
                  <select
                    name="mediaPelaporan"
                    value={formData.mediaPelaporan}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  >
                    <option value="">Pilih media pelaporan</option>
                    <option value="telepon">Telepon</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="langsung">Langsung/Tatap Muka</option>
                    <option value="website">Website/Portal</option>
                  </select>
                </div>

                {/* Deskripsi Insiden */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50">
                    Deskripsi Insiden
                  </label>
                  <textarea
                    name="deskripsiInsiden"
                    value={formData.deskripsiInsiden}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Jelaskan detail insiden yang terjadi..."
                    className="min-h-[150px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  />
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Laporan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
