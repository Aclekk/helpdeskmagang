"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateDDMMYYYY(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function toISODate(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function hitungWaktuSelesai(waktuMulai: string, durasiMenit: number): string {
  if (!waktuMulai) return "";
  const [h, m] = waktuMulai.split(":").map(Number);
  const total = h * 60 + m + durasiMenit;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

// ─── Tipe data yang disimpan ke localStorage ──────────────────────────────────
export interface LocalPermohonan {
  semantikId?: number;
  noTiket?: string;
  requestDate: string;
  tanggalPermohonan: string;
  judulKegiatan: string;
  tanggalPelaksanaan: string;
  waktuMulai: string;
  durasiMenit: number;
  waktuSelesai: string;
  jumlahPeserta: string;
  instansi: string;
  kodeUnor: string;
  namaPemohon: string;
  jabatanPemohon: string;
  email: string;
  nomorTelepon: string;
  lokasiAcara: string;
  perangkatDibutuhkan: string;
  namaHost: string;
  acaraBerulang: boolean;
  pengulangan?: string;
  ulangSetiap?: number;
  hariMingguan?: string[];
  jenisBerakhir?: string;
  tanggalBerakhir?: string;
  jumlahPenyelenggaraan?: number;
  status: "menunggu" | "disetujui" | "ditolak" | "selesai";
  linkZoom?: string;
  lastSync?: string;
}

function saveToLocalStorage(item: LocalPermohonan) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem("video_conference_requests");
    const list: LocalPermohonan[] = stored ? JSON.parse(stored) : [];
    list.unshift(item);
    localStorage.setItem("video_conference_requests", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoConferenceRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const tanggalRef = useRef<HTMLInputElement>(null);
  const waktuMulaiRef = useRef<HTMLInputElement>(null);

  const requestDate = useMemo(() => formatDateDDMMYYYY(new Date()), []);

  // ─── State UI ───────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPegawai, setIsCheckingPegawai] = useState(false);
  const [pegawaiError, setPegawaiError] = useState<string | null>(null);

  // ─── State Instansi ─────────────────────────────────────────────────────────
  const [instansiList, setInstansiList] = useState<
    { idUnor: string; namaUnor: string; kodeUnor: string }[]
  >([]);
  const [isLoadingInstansi, setIsLoadingInstansi] = useState(false);

  // ─── State Form ─────────────────────────────────────────────────────────────
  const [judulKegiatan, setJudulKegiatan] = useState("");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState("");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [acaraBerulang, setAcaraBerulang] = useState(false);
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [instansi, setInstansi] = useState("");
  const [kodeUnor, setKodeUnor] = useState("");
  const [namaPemohon, setNamaPemohon] = useState("");
  const [jabatanPemohon, setJabatanPemohon] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [lokasiAcara, setLokasiAcara] = useState("");
  const [perangkatDibutuhkan, setPerangkatDibutuhkan] = useState<string[]>([]);
  const [namaHost, setNamaHost] = useState("");
  const [jenisKegiatan, setJenisKegiatan] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // ─── State Recurrence ───────────────────────────────────────────────────────
  type RepeatType = "harian" | "mingguan" 
  type EndType = "date" | "count";
  const [pengulangan, setPengulangan] = useState<RepeatType>("mingguan");
  const [ulangSetiap, setUlangSetiap] = useState(1);
  const [hariMingguan, setHariMingguan] = useState<string[]>([]);
  const [jenisBerakhir, setJenisBerakhir] = useState<EndType>("date");
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");
  const [jumlahPenyelenggaraan, setJumlahPenyelenggaraan] = useState(7);

  const toggleHari = (h: string) =>
    setHariMingguan((prev) =>
      prev.includes(h) ? prev.filter((d) => d !== h) : [...prev, h],
    );

  const togglePerangkat = (p: string) =>
    setPerangkatDibutuhkan((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  // ─── useEffect: Fetch Instansi dari API ─────────────────────────────────────
  useEffect(() => {
    const fetchInstansi = async () => {
      setIsLoadingInstansi(true);
      try {
        const res = await fetch("/api/instansi");
        const data = await res.json();
        if (Array.isArray(data)) {
          setInstansiList(data);
        }
      } catch (err) {
        console.error("Error fetch instansi:", err);
      } finally {
        setIsLoadingInstansi(false);
      }
    };
    fetchInstansi();
  }, []);

  // ─── useEffect: Auto-fill dari checkPegawai ─────────────────────────────────
  useEffect(() => {
    if (!user?.nip) return;

    const fetchPegawai = async () => {
      setIsCheckingPegawai(true);
      setPegawaiError(null);
      try {
        const res = await fetch("/api/pegawai/ceknip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nip: user.nip }),
        });
        const result = await res.json();

        if (result.status && result.data) {
          setNamaPemohon(result.data.nama_pegawai || user.name || "");
          setNomorTelepon(result.data.whatsapp || user.whatsapp || "");
          setEmail(result.data.email || "");
          setJabatanPemohon(result.data.jabatan || "");
          setKodeUnor(result.data.kode_unor || "");
          if (result.data.unit_kerja) {
            setInstansi(result.data.unit_kerja);
          }
        } else {
          setPegawaiError(result.message || "Data pegawai tidak ditemukan");
          setNamaPemohon(user.name || "");
          setNomorTelepon(user.whatsapp || "");
        }
      } catch (err) {
        console.error("Error cek pegawai:", err);
        setPegawaiError("Gagal menghubungkan ke server Semantik");
        setNamaPemohon(user.name || "");
        setNomorTelepon(user.whatsapp || "");
      } finally {
        setIsCheckingPegawai(false);
      }
    };

    fetchPegawai();
  }, [user]);

  const handleFieldClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.showPicker();
  };

  const pesertaOptions = [
    { value: "1-300", label: "1 - 300" },
    { value: "300-1000", label: "300 - 1000" },
  ];

  const durasiOptions = [
    { value: 30, label: "30 menit" },
    { value: 60, label: "1 jam" },
    { value: 90, label: "1 jam 30 menit" },
    { value: 120, label: "2 jam" },
    { value: 180, label: "3 jam" },
    { value: 240, label: "4 jam" },
  ];

  const repeatUnitLabel =
    pengulangan === "harian"
      ? "hari"
      : pengulangan === "mingguan"
        ? "minggu"
        : "bulan";

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi recurrence
    if (acaraBerulang && jenisBerakhir === "date" && !tanggalBerakhir) {
      toast({
        title: "Tanggal berakhir wajib diisi",
        description: "Silakan pilih tanggal berakhir acara berulang",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const todayISO = toISODate(new Date());

    const payload = {
      tanggalPermohonan: todayISO,
      instansi,
      kodeUnor: kodeUnor || undefined,
      namaPemohon,
      jabatanPemohon,
      email,
      nomorTelepon: nomorTelepon || undefined,
      judulKegiatan,
      lokasiAcara: lokasiAcara || undefined,
      tanggalPelaksanaan,
      waktuMulai,
      durasiMenit,
      jumlahPeserta,
      perangkatDibutuhkan:
        perangkatDibutuhkan.length > 0
          ? perangkatDibutuhkan.join(", ")
          : undefined,
      jenisKegiatan: jenisKegiatan || undefined,
      keterangan:
        [
          namaHost ? `Nama host: ${namaHost}` : null,
          perangkatDibutuhkan.length > 0
            ? `Perangkat: ${perangkatDibutuhkan.join(", ")}`
            : null,
        ]
          .filter(Boolean)
          .join(" | ") || "-",
      acaraBerulang,
      ...(acaraBerulang && {
        pengulangan,
        ulangSetiap,
        hariMingguan: pengulangan === "mingguan" ? hariMingguan : undefined,
        jenisBerakhir,
       tanggalBerakhir: jenisBerakhir === "date" && tanggalBerakhir
  ? tanggalBerakhir
  : undefined,
        jumlahPenyelenggaraan:
          jenisBerakhir === "count" ? jumlahPenyelenggaraan : undefined,
      }),
    };

    try {
      const res = await fetch("/api/teleconference/permohonan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengirim permohonan");
      }

      const semantikId: number | undefined = result.id ?? result.data?.id;
      const noTiket: string | undefined =
        result.noTiket ?? result.data?.noTiket;

      const localItem: LocalPermohonan = {
        semantikId,
        noTiket,
        requestDate: new Date().toISOString(),
        tanggalPermohonan: todayISO,
        judulKegiatan,
        tanggalPelaksanaan,
        waktuMulai,
        durasiMenit,
        waktuSelesai: hitungWaktuSelesai(waktuMulai, durasiMenit),
        jumlahPeserta,
        instansi,
        kodeUnor,
        namaPemohon,
        jabatanPemohon,
        email,
        nomorTelepon,
        lokasiAcara,
        perangkatDibutuhkan: perangkatDibutuhkan.join(", "),
        namaHost,
        acaraBerulang,
        ...(acaraBerulang && {
          pengulangan,
          ulangSetiap,
          hariMingguan: pengulangan === "mingguan" ? hariMingguan : [],
          jenisBerakhir,
          tanggalBerakhir:
            jenisBerakhir === "date" ? tanggalBerakhir : undefined,
          jumlahPenyelenggaraan:
            jenisBerakhir === "count" ? jumlahPenyelenggaraan : undefined,
        }),
        status: "menunggu",
        lastSync: new Date().toISOString(),
      };

      saveToLocalStorage(localItem);

      toast({
        title: "Permohonan Berhasil Dikirim! 🎉",
        description: noTiket
          ? `No. Tiket: ${noTiket}. Tunggu konfirmasi dari admin.`
          : "Permohonan kamu sudah masuk ke Semantik.",
      });

      // Reset form
      setJudulKegiatan("");
      setTanggalPelaksanaan("");
      setJumlahPeserta("");
      setWaktuMulai("");
      setDurasiMenit(60);
      setKodeUnor("");
      setJabatanPemohon("");
      setEmail("");
      setNomorTelepon("");
      setLokasiAcara("");
      setPerangkatDibutuhkan([]);
      setNamaHost("");
      setAcaraBerulang(false);
      setJenisKegiatan("");
      setKeterangan("");

      router.push("/request/video-conference/history");
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Permohonan Gagal",
        description:
          error instanceof Error ? error.message : "Gagal menghubungi server",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Video Conference Zoom
        </h1>
        <Link href="/request/video-conference/history">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
          >
            <History className="h-4 w-4" />
            Riwayat Permohonan
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="h-1.5 w-full bg-blue-600" />

        <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Permohonan Video Conference
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Tanggal Permohonan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Tanggal Permohonan
              </label>
              <Input value={requestDate} readOnly />
            </div>

            {/* Judul Kegiatan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Judul Kegiatan <span className="text-red-500">*</span>
              </label>
              <textarea
                className="min-h-[84px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                value={judulKegiatan}
                onChange={(e) => setJudulKegiatan(e.target.value)}
                required
              />
            </div>

            {/* Tanggal Pelaksanaan + Acara Berulang */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Tanggal Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <Input
                  ref={tanggalRef}
                  type="date"
                  value={tanggalPelaksanaan}
                  onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                  onClick={() => handleFieldClick(tanggalRef)}
                  required
                  className="cursor-pointer"
                />
              </div>
              <div className="md:col-span-6 flex items-end">
                <label className="flex items-center gap-3 text-slate-900 dark:text-slate-50">
                  <Checkbox
                    checked={acaraBerulang}
                    onCheckedChange={(v) => setAcaraBerulang(Boolean(v))}
                  />
                  <span className="font-medium">Acara berulang</span>
                </label>
              </div>
            </div>

            {/* Recurrence */}
            {acaraBerulang && (
              <div className="relative rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/90">
                <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-blue-600" />
                <div className="space-y-5 pl-4">
                  {/* Pengulangan */}
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                    <div className="font-medium text-slate-900 dark:text-slate-50 md:col-span-3">
                      Pengulangan
                    </div>
                    <div className="md:col-span-9">
                      <Select
                        value={pengulangan}
                        onValueChange={(v) => setPengulangan(v as RepeatType)}
                      >
                        <SelectTrigger className="w-full md:w-[340px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="harian">Harian</SelectItem>
                          <SelectItem value="mingguan">Mingguan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Ulangi setiap */}
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                    <div className="font-medium text-slate-900 dark:text-slate-50 md:col-span-3">
                      Ulangi setiap
                    </div>
                    <div className="md:col-span-4">
                      <Select
                        value={String(ulangSetiap)}
                        onValueChange={(v) => setUlangSetiap(Number(v))}
                      >
                        <SelectTrigger className="w-full md:w-[220px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(
                            (v) => (
                              <SelectItem key={v} value={String(v)}>
                                {v}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-slate-900 dark:text-slate-50 md:col-span-5">
                      {repeatUnitLabel}
                    </div>
                  </div>

                  {/* Hari (mingguan) - FIXED: nilai pakai bahasa Indonesia */}
                  {pengulangan === "mingguan" && (
                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                      <div className="font-medium text-slate-900 dark:text-slate-50 md:col-span-3">
                        Terjadi pada
                      </div>
                      <div className="flex flex-wrap gap-5 md:col-span-9">
                        {[
                          ["minggu", "Minggu"],
                          ["senin", "Senin"],
                          ["selasa", "Selasa"],
                          ["rabu", "Rabu"],
                          ["kamis", "Kamis"],
                          ["jumat", "Jumat"],
                          ["sabtu", "Sabtu"],
                        ].map(([val, label]) => (
                          <label key={val} className="flex items-center gap-2">
                            <Checkbox
                              checked={hariMingguan.includes(val)}
                              onCheckedChange={() => toggleHari(val)}
                            />
                            <span className="text-slate-700 dark:text-slate-200">
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tanggal berakhir */}
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                    <div className="font-medium text-slate-900 dark:text-slate-50 md:col-span-3">
                      Berakhir
                    </div>
                    <div className="space-y-3 md:col-span-9">
                      <label className="flex flex-wrap items-center gap-3">
                        <input
                          type="radio"
                          name="endType"
                          checked={jenisBerakhir === "date"}
                          onChange={() => setJenisBerakhir("date")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-slate-900 dark:text-slate-50">
                          Pada tanggal
                        </span>
                        <Input
                          type="date"
                          className="w-full sm:w-[220px]"
                          value={tanggalBerakhir}
                          onChange={(e) => setTanggalBerakhir(e.target.value)}
                          disabled={jenisBerakhir !== "date"}
                        />
                      </label>
                      <label className="flex flex-wrap items-center gap-3">
                        <input
                          type="radio"
                          name="endType"
                          checked={jenisBerakhir === "count"}
                          onChange={() => setJenisBerakhir("count")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-slate-900 dark:text-slate-50">
                          Setelah
                        </span>
                        <Select
                          value={String(jumlahPenyelenggaraan)}
                          onValueChange={(v) =>
                            setJumlahPenyelenggaraan(Number(v))
                          }
                          disabled={jenisBerakhir !== "count"}
                        >
                          <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 50 }, (_, i) => i + 1).map(
                              (v) => (
                                <SelectItem key={v} value={String(v)}>
                                  {v}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <span className="text-slate-900 dark:text-slate-50">
                          penyelenggaraan
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jumlah Peserta */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Jumlah Peserta
              </label>
              <Select value={jumlahPeserta} onValueChange={setJumlahPeserta}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Pilih jumlah peserta" />
                </SelectTrigger>
                <SelectContent>
                  {pesertaOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Waktu Mulai & Durasi */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Waktu Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  ref={waktuMulaiRef}
                  type="time"
                  value={waktuMulai}
                  onChange={(e) => setWaktuMulai(e.target.value)}
                  onClick={() => handleFieldClick(waktuMulaiRef)}
                  required
                  className="cursor-pointer"
                />
              </div>
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Durasi <span className="text-red-500">*</span>
                </label>
                <Select
                  value={String(durasiMenit)}
                  onValueChange={(v) => setDurasiMenit(Number(v))}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Pilih durasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {durasiOptions.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {waktuMulai && (
                  <p className="text-xs text-slate-500">
                    Selesai sekitar pukul{" "}
                    {hitungWaktuSelesai(waktuMulai, durasiMenit)}
                  </p>
                )}
              </div>
            </div>

            {/* Instansi & Kode Unor */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Instansi <span className="text-red-500">*</span>
                </label>
                <Select
                  value={instansi}
                  onValueChange={(val) => {
                    setInstansi(val);
                    const selected = instansiList.find(
                      (i) => i.namaUnor === val,
                    );
                    if (selected) setKodeUnor(selected.kodeUnor);
                  }}
                  required
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue
                      placeholder={
                        isLoadingInstansi
                          ? "Memuat instansi..."
                          : "Pilih Instansi"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingInstansi ? (
                      <SelectItem value="_loading" disabled>
                        Memuat data instansi...
                      </SelectItem>
                    ) : instansiList.length > 0 ? (
                      instansiList.map((item) => (
                        <SelectItem key={item.idUnor} value={item.namaUnor}>
                          {item.namaUnor}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_empty" disabled>
                        Tidak ada data instansi
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Kode Unit Organisasi (opsional)
                </label>
                <Input
                  value={kodeUnor}
                  onChange={(e) => setKodeUnor(e.target.value)}
                  placeholder="Kode unit organisasi"
                />
              </div>
            </div>

            {/* Nama Pemohon & Jabatan */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Nama Pemohon <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={namaPemohon}
                    readOnly
                    className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed pr-10"
                  />
                  {isCheckingPegawai && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    </div>
                  )}
                </div>
                {pegawaiError && (
                  <p className="text-xs text-amber-600">{pegawaiError}</p>
                )}
              </div>
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Jabatan Pemohon <span className="text-red-500">*</span>
                </label>
                <Input
                  value={jabatanPemohon}
                  onChange={(e) => setJabatanPemohon(e.target.value)}
                  placeholder="Jabatan pemohon"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* No. Telepon / WhatsApp */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                No. WhatsApp / Telepon
              </label>
              <Input
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                placeholder="Masukkan nomor WhatsApp"
              />
              <p className="text-sm text-red-500">
                Harap pastikan nomor tersebut aktif dan terdaftar di WhatsApp.
              </p>
            </div>

            {/* Lokasi Acara */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Lokasi Acara
              </label>
              <Input
                value={lokasiAcara}
                onChange={(e) => setLokasiAcara(e.target.value)}
              />
            </div>

            {/* Perangkat */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Perangkat Yang Dibutuhkan
              </label>
              <div className="flex flex-wrap gap-6">
                {[
                  "Pendampingan personil",
                  "Alat teleconference",
                  "Hanya akun zoom",
                ].map((p) => (
                  <label key={p} className="flex items-center gap-2">
                    <Checkbox
                      checked={perangkatDibutuhkan.includes(p)}
                      onCheckedChange={() => togglePerangkat(p)}
                    />
                    <span className="text-slate-700 dark:text-slate-200">
                      {p}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nama Host */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Nama Host
              </label>
              <Input
                value={namaHost}
                onChange={(e) => setNamaHost(e.target.value)}
                placeholder="Masukkan nama host"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || isCheckingPegawai}
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}