"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SignatureCanvas from "react-signature-canvas";
import { useAuth } from "@/contexts/AuthContext";
import { InstansiItem } from "@/lib/semantik";

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
  const [submitMessage, setSubmitMessage] = useState("");

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
    // Email diambil dari data pegawai (lihat fetchPegawai), bukan user.email yang isinya NIP
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

        // Response dari /api/pegawai/ceknip: { status, data: { jabatan, email, kode_unor } }
        const pegawai = data?.data ?? data;
        setJabatan(pegawai?.jabatan || pegawai?.nomenklatur_jabatan || "");

        // Ambil email dari data pegawai (bukan dari user.email yang isinya NIP)
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
      setSubmitStatus("error");
      setSubmitMessage("Tanda tangan wajib diisi.");
      return;
    }

    try {
      setSubmitStatus("loading");
      setSubmitMessage("");

      const fd = new FormData();
      fd.append("tanggalPermohonan", requestDate);
      fd.append("jenisPermohonan", jenisPermohonan);
      fd.append("tujuanPermohonan", tujuan);
      fd.append("namaPemohon", nama);
      // Kirim email dari state (diisi dari fetchPegawai)
      fd.append("email", email);
      fd.append("jabatanPemohon", jabatan);
      fd.append("nomorTelepon", whatsapp);

      // Kirim namaUnor sebagai value instansi ke server Semantik
      const selectedInstansi = instansiList.find((i) => i.idUnor === instansi);
      fd.append("instansi", selectedInstansi?.namaUnor ?? instansi);

      // statusPegawai: server Semantik hanya terima "asn" atau "nonasn" (lowercase)
      fd.append("statusPegawai", isClient ? "nonasn" : "asn");

      if (!isClient && nip) fd.append("nip", nip);
      if (isClient && tanggalAkhirKontrak)
        fd.append("tanggalAkhirKontrak", tanggalAkhirKontrak);

      // Signature sebagai base64 string
      fd.append("signature", sigRef.current!.toDataURL("image/png"));

      const res = await fetch("/api/vpn", {
        method: "POST",
        body: fd,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(result?.message ?? `Error ${res.status}`);

      setSubmitStatus("success");
      setSubmitMessage(
        result?.message ??
          "Permohonan VPN berhasil dikirim! Tim kami akan segera memproses.",
      );
    } catch (err) {
      console.error("[VpnRequestForm] submit:", err);
      setSubmitStatus("error");
      setSubmitMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan, silakan coba lagi.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        Formulir Permohonan VPN Pemerintah Kota Tangerang
      </h1>

      {submitStatus === "success" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          ✅ {submitMessage}
        </div>
      )}

      {submitStatus === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          ❌ {submitMessage}
        </div>
      )}

      <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="h-1.5 w-full bg-blue-600" />
        <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Formulir Permohonan VPN
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Tanggal Permohonan */}
            <div className="space-y-2">
              <Label>Tanggal Permohonan</Label>
              <Input value={requestDateDisplay} disabled />
            </div>

            {/* Jenis Permohonan */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Jenis Permohonan <span className="text-red-500">*</span>
              </Label>
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
                    <Label htmlFor={v} className="cursor-pointer capitalize">
                      {v}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama <span className="text-red-500">*</span>
              </Label>
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
            </div>

            {/* Jabatan */}
            <div className="space-y-2">
              <Label htmlFor="jabatan">
                Jabatan <span className="text-red-500">*</span>
              </Label>
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

            {/* Field kondisional */}
            {isClient ? (
              <>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Status Pegawai <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={statusPegawai}
                    onValueChange={(v) =>
                      setStatusPegawai(v as "ta" | "tp" | "lainnya")
                    }
                    className="flex gap-6"
                  >
                    {(["ta", "tp", "lainnya"] as const).map((s) => (
                      <div key={s} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={s} />
                        <Label htmlFor={s} className="cursor-pointer uppercase">
                          {s}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggalAkhirKontrak">
                    Tanggal Akhir Kontrak{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tanggalAkhirKontrak"
                    type="date"
                    value={tanggalAkhirKontrak}
                    onChange={(e) => setTanggalAkhirKontrak(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kontrakPekerjaan">
                    Upload Kontrak Pekerjaan{" "}
                    <span className="text-red-500">*</span>
                  </Label>
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
                <Label htmlFor="nip">
                  NIP <span className="text-red-500">*</span>
                </Label>
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

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
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

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                Nomor Telp yang terhubung ke WhatsApp{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
              <p className="text-xs text-red-500">
                Harap pastikan nomor tersebut aktif dan terdaftar di WhatsApp.
                Jika sudah tidak aktif, silakan diperbarui.
              </p>
            </div>

            {/* Instansi */}
            <div className="space-y-2">
              <Label htmlFor="instansi">
                Instansi <span className="text-red-500">*</span>
              </Label>
              {instansiError ? (
                <p className="text-sm text-red-500">{instansiError}</p>
              ) : (
                <Select
                  value={instansi}
                  onValueChange={setInstansi}
                  disabled={instansiLoading}
                >
                  <SelectTrigger>
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
              <Label htmlFor="tujuan">
                Tujuan Penggunaan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="tujuan"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Contoh: akses aplikasi internal dari luar jaringan"
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Tanda Tangan */}
            <div className="space-y-2">
              <Label>
                Tanda Tangan <span className="text-red-500">*</span>
              </Label>
              <div className="relative h-[300px] w-full overflow-hidden rounded-md border-2 border-slate-300 bg-white">
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
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={
                  submitStatus === "loading" ||
                  pegawaiLoading ||
                  instansiLoading
                }
                className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 hover:from-blue-700 hover:to-blue-600"
              >
                {submitStatus === "loading" ? "Mengirim…" : "Kirim"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
