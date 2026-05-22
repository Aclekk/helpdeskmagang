"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SignatureCanvas from "react-signature-canvas";
import { useAuth } from "@/contexts/AuthContext";
import { InstansiItem } from "@/lib/semantik";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

type VpnRequestFormProps = {
  isClient?: boolean;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

function formatDateYYYYMMDD(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function formatDateDDMMYYYY(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function VpnRequestForm({
  isClient = false,
}: VpnRequestFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const requestDate = useMemo(() => formatDateYYYYMMDD(new Date()), []);
  const requestDateDisplay = useMemo(() => formatDateDDMMYYYY(new Date()), []);

  const [jenisPermohonan, setJenisPermohonan] = useState<
    "baru" | "perpanjangan"
  >("baru");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instansi, setInstansi] = useState("");
  const [tujuan, setTujuan] = useState("");

  const [statusPegawai, setStatusPegawai] = useState<"ta" | "tp" | "lainnya">(
    "ta",
  );
  const [tanggalAkhirKontrak, setTanggalAkhirKontrak] = useState("");
  const [kontrakPekerjaan, setKontrakPekerjaan] = useState<File | null>(null);

  const [instansiList, setInstansiList] = useState<InstansiItem[]>([]);
  const [instansiLoading, setInstansiLoading] = useState(true);
  const [instansiError, setInstansiError] = useState<string | null>(null);

  const [pegawaiLoading, setPegawaiLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const sigRef = useRef<SignatureCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  // 1. Fetch instansi dari /api/instansi
  useEffect(() => {
    const fetchInstansi = async () => {
      try {
        setInstansiLoading(true);
        setInstansiError(null);
        const res = await fetch("/api/instansi");
        if (!res.ok) throw new Error(`Gagal fetch instansi: ${res.status}`);
        const data: InstansiItem[] = await res.json();
        setInstansiList(data);
      } catch (err) {
        console.error("[VpnRequestForm] fetch instansi:", err);
        setInstansiError(
          err instanceof Error ? err.message : "Gagal memuat daftar instansi",
        );
      } finally {
        setInstansiLoading(false);
      }
    };
    fetchInstansi();
  }, []);

  // 2. Auto-fill untuk mode PRIBADI (ASN)
  useEffect(() => {
    if (isClient || !user) return;

    setNama(user.name ?? "");
    setNip(user.nip ?? "");
    setWhatsapp(user.whatsapp ?? "");

    if (!user.nip) return;

    const fetchPegawai = async () => {
      try {
        setPegawaiLoading(true);
        const res = await fetch("/api/pegawai/ceknip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nip: user.nip }),
        });
        if (!res.ok) throw new Error(`Gagal fetch pegawai: ${res.status}`);
        const data = await res.json();

        const pegawai = data?.data ?? data;
        setJabatan(pegawai?.jabatan || pegawai?.nomenklatur_jabatan || "");

        const emailPegawai = pegawai?.email || "";
        if (emailPegawai) setEmail(emailPegawai);

        const kodeUnor = pegawai?.kode_unor || "";
        if (kodeUnor && instansiList.length > 0) {
          const match = instansiList.find((i) => i.kodeUnor === kodeUnor);
          if (match) setInstansi(match.idUnor);
        }
      } catch (err) {
        console.error("[VpnRequestForm] fetch pegawai:", err);
      } finally {
        setPegawaiLoading(false);
      }
    };

    fetchPegawai();
  }, [user, isClient, instansiList]);

  // 3. Submit ke /api/vpn → forward ke server Semantik
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSigned || sigRef.current?.isEmpty()) {
      toast({
        title: "Tanda Tangan Wajib",
        description: "Tanda tangan wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitStatus("loading");

      const fd = new FormData();
      fd.append("tanggalPermohonan", requestDate);
      fd.append("jenisPermohonan", jenisPermohonan);
      fd.append("tujuanPermohonan", tujuan);
      fd.append("namaPemohon", nama);
      fd.append("email", email);
      fd.append("jabatanPemohon", jabatan);
      fd.append("nomorTelepon", whatsapp);

      const selectedInstansi = instansiList.find((i) => i.idUnor === instansi);
      fd.append("instansi", selectedInstansi?.namaUnor ?? instansi);

      fd.append("statusPegawai", isClient ? "nonasn" : "asn");

      if (!isClient && nip) fd.append("nip", nip);
      if (isClient && tanggalAkhirKontrak)
        fd.append("tanggalAkhirKontrak", tanggalAkhirKontrak);

      fd.append("signature", sigRef.current!.toDataURL("image/png"));

      const res = await fetch("/api/vpn", {
        method: "POST",
        body: fd,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(result?.message ?? `Error ${res.status}`);

      const noTiket = result?.noTiket ?? result?.data?.noTiket;

      toast({
        title: "Permohonan Berhasil Dikirim! 🎉",
        description: noTiket
          ? `No. Tiket: ${noTiket}. Tunggu konfirmasi dari admin.`
          : "Permohonan kamu sudah masuk ke Semantik.",
      });

      setSubmitStatus("success");

      // Reset form
      setJenisPermohonan("baru");
      setNama(isClient ? "" : (user?.name ?? ""));
      setJabatan("");
      setNip(isClient ? "" : (user?.nip ?? ""));
      setEmail("");
      setWhatsapp("");
      setInstansi("");
      setTujuan("");
      setStatusPegawai("ta");
      setTanggalAkhirKontrak("");
      setKontrakPekerjaan(null);
      sigRef.current?.clear();
      setIsSigned(false);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Redirect to history page
      router.push("/request/vpn/history");
    } catch (err) {
      console.error("[VpnRequestForm] submit:", err);
      setSubmitStatus("error");
      toast({
        title: "Permohonan Gagal",
        description:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan, silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Formulir Permohonan VPN
          </h1>
        </div>
        <Link href="/request/vpn/history">
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
            Permohonan VPN - {isClient ? "Orang Lain" : "Pribadi"}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Tanggal Permohonan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Tanggal Permohonan
              </label>
              <Input value={requestDateDisplay} readOnly />
            </div>

            {/* Jenis Permohonan */}
            <div className="space-y-3">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Jenis Permohonan <span className="text-red-500">*</span>
              </label>
              <RadioGroup
                value={jenisPermohonan}
                onValueChange={(v) =>
                  setJenisPermohonan(v as "baru" | "perpanjangan")
                }
                className="flex gap-6"
              >
                {(["baru", "perpanjangan"] as const).map((v) => (
                  <div key={v} className="flex items-center space-x-2">
                    <RadioGroupItem value={v} id={v} />
                    <label htmlFor={v} className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer capitalize select-none">
                      {v}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Nama & Jabatan */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="nama">
                  Nama <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder={
                      pegawaiLoading ? "Memuat data…" : "Masukkan nama lengkap"
                    }
                    disabled={!isClient && !!user?.name}
                    required
                  />
                  {pegawaiLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="jabatan">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <Input
                  id="jabatan"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder={
                    pegawaiLoading ? "Memuat data…" : "Masukkan jabatan"
                  }
                  disabled={!isClient && pegawaiLoading}
                  required
                />
              </div>
            </div>

            {/* Field kondisional */}
            {isClient ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="font-semibold text-slate-900 dark:text-slate-50">
                      Status Pegawai <span className="text-red-500">*</span>
                    </label>
                    <RadioGroup
                      value={statusPegawai}
                      onValueChange={(v) =>
                        setStatusPegawai(v as "ta" | "tp" | "lainnya")
                      }
                      className="flex gap-6 h-10 items-center"
                    >
                      {(["ta", "tp", "lainnya"] as const).map((s) => (
                        <div key={s} className="flex items-center space-x-2">
                          <RadioGroupItem value={s} id={s} />
                          <label htmlFor={s} className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer uppercase select-none">
                            {s}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="tanggalAkhirKontrak">
                      Tanggal Akhir Kontrak <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="tanggalAkhirKontrak"
                      type="date"
                      value={tanggalAkhirKontrak}
                      onChange={(e) => setTanggalAkhirKontrak(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="kontrakPekerjaan">
                    Upload Kontrak Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="kontrakPekerjaan"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setKontrakPekerjaan(e.target.files?.[0] ?? null)
                    }
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Format: PDF, JPG, PNG. Maks: 2MB
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="nip">
                  NIP <span className="text-red-500">*</span>
                </label>
                <Input
                  id="nip"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Masukkan NIP"
                  disabled={!!user?.nip}
                  required
                />
              </div>
            )}

            {/* Email & No. WhatsApp */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@contoh.com"
                  disabled={!isClient && !!email}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="whatsapp">
                  Nomor Telp yang terhubung ke WhatsApp <span className="text-red-500">*</span>
                </label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                />
                <p className="text-xs text-red-500">
                  Harap pastikan nomor tersebut aktif dan terdaftar di WhatsApp.
                </p>
              </div>
            </div>

            {/* Instansi */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="instansi">
                Instansi <span className="text-red-500">*</span>
              </label>
              {instansiError ? (
                <p className="text-sm text-red-500">{instansiError}</p>
              ) : (
                <Select
                  value={instansi}
                  onValueChange={setInstansi}
                  disabled={instansiLoading}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue
                      placeholder={
                        instansiLoading ? "Memuat instansi…" : "Pilih Instansi"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {instansiList.length === 0 && !instansiLoading ? (
                      <SelectItem value="-" disabled>
                        Tidak ada data instansi
                      </SelectItem>
                    ) : (
                      instansiList.map((item) => (
                        <SelectItem key={item.idUnor} value={item.idUnor}>
                          {item.namaUnor}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Tujuan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50" htmlFor="tujuan">
                Tujuan Penggunaan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tujuan"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Contoh: akses aplikasi internal dari luar jaringan"
                className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                required
              />
            </div>

            {/* Tanda Tangan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Tanda Tangan <span className="text-red-500">*</span>
              </label>
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl border-2 border-slate-300 bg-white dark:border-slate-700 dark:bg-white">
                {!isSigned && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 600 250"
                      className="text-slate-300"
                    >
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        fontSize="20"
                        fill="currentColor"
                        fontWeight="500"
                      >
                        Sign Here
                      </text>
                      <path
                        d="M40 170 C120 150, 180 190, 260 170 S400 150, 560 170"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <rect
                        x="500"
                        y="145"
                        width="18"
                        height="18"
                        rx="3"
                        transform="rotate(-20 500 145)"
                        fill="currentColor"
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                )}
                <SignatureCanvas
                  ref={sigRef}
                  penColor="#0f172a"
                  onBegin={() => setIsSigned(true)}
                  canvasProps={{ className: "absolute inset-0 h-full w-full" }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                  onClick={() => {
                    sigRef.current?.clear();
                    setIsSigned(false);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={
                  submitStatus === "loading" ||
                  pegawaiLoading ||
                  instansiLoading
                }
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitStatus === "loading" ? "Mengirim..." : "Kirim Permohonan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
