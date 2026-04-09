'use client'

import { FormEvent, useMemo, useRef, useState } from "react";
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

type VpnRequestFormProps = {
  isClient?: boolean;
};

function formatDateDDMMYYYY(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function VpnRequestForm({ isClient = false }: VpnRequestFormProps) {
  const requestDate = useMemo(() => formatDateDDMMYYYY(new Date()), []);

  const [jenisPermohonan, setJenisPermohonan] = useState<"baru" | "perpanjangan">("baru");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");

  const [statusPegawai, setStatusPegawai] = useState<"ta" | "tp" | "lainnya">("ta");
  const [tanggalAkhirKontrak, setTanggalAkhirKontrak] = useState("");
  const [kontrakPekerjaan, setKontrakPekerjaan] = useState<File | null>(null);

  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [instansi, setInstansi] = useState<string>(
    isClient ? "" : "Dinas Komunikasi dan Informatika"
  );
  const [tujuan, setTujuan] = useState("");

  const sigRef = useRef<SignatureCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  const instansiOptions = [
    "Dinas Komunikasi dan Informatika",
    "Dinas Pendidikan",
    "Dinas Kesehatan",
    "Kecamatan",
    "Kelurahan",
  ];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signatureData = sigRef.current?.toDataURL();

    const payload = isClient
      ? {
          requestDate,
          jenisPermohonan,
          nama,
          jabatan,
          statusPegawai,
          tanggalAkhirKontrak,
          kontrakPekerjaan: kontrakPekerjaan?.name ?? null,
          email,
          whatsapp,
          instansi,
          tujuan,
          tandaTangan: signatureData,
        }
      : {
          requestDate,
          jenisPermohonan,
          nama,
          jabatan,
          nip,
          email,
          whatsapp,
          instansi,
          tujuan,
          tandaTangan: signatureData,
        };

    console.log("VPN REQUEST:", payload);
    alert("Form VPN tersimpan (frontend) ✅");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        Formulir Permohonan VPN Pemerintah Kota Tangerang
      </h1>

      <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="h-1.5 w-full bg-blue-600" />

        <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Formulir Permohonan VPN
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Jenis Permohonan <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={jenisPermohonan}
                onValueChange={(value) => setJenisPermohonan(value as "baru" | "perpanjangan")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="baru" id="baru" />
                  <Label htmlFor="baru" className="cursor-pointer">
                    Baru
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="perpanjangan" id="perpanjangan" />
                  <Label htmlFor="perpanjangan" className="cursor-pointer">
                    Perpanjangan
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jabatan">
                Jabatan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jabatan"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Masukkan jabatan"
                required
              />
            </div>

            {isClient ? (
              <>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Status Pegawai <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={statusPegawai}
                    onValueChange={(value) =>
                      setStatusPegawai(value as "ta" | "tp" | "lainnya")
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ta" id="ta" />
                      <Label htmlFor="ta" className="cursor-pointer">
                        TA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tp" id="tp" />
                      <Label htmlFor="tp" className="cursor-pointer">
                        TP
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lainnya" id="lainnya" />
                      <Label htmlFor="lainnya" className="cursor-pointer">
                        Lainnya
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggalAkhirKontrak">
                    Tanggal Akhir Kontrak <span className="text-red-500">*</span>
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
                    Upload Kontrak Pekerjaan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kontrakPekerjaan"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setKontrakPekerjaan(e.target.files?.[0] ?? null)}
                    required
                  />
                  <p className="text-xs text-slate-500">Format: PDF, JPG, PNG. Maks: 2MB</p>
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
                  required
                />
              </div>
            )}

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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                Nomor Telp yang terhubung ke WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
              <p className="text-xs text-red-500">
                Harap pastikan nomor tersebut aktif dan terdaftar di WhatsApp. Jika sudah tidak aktif,
                silakan diperbarui.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instansi">
                Instansi <span className="text-red-500">*</span>
              </Label>
              <Select value={instansi} onValueChange={setInstansi}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Instansi" />
                </SelectTrigger>
                <SelectContent>
                  {instansiOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <Label>
                Tanda Tangan <span className="text-red-500">*</span>
              </Label>

              <div className="relative h-[300px] w-full overflow-hidden rounded-md border-2 border-slate-300 bg-white">
                {!isSigned && (
                  <div className="absolute inset-0 flex items-center justify-center">
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
                  canvasProps={{
                    className: "absolute inset-0 h-full w-full",
                  }}
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

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 hover:from-blue-700 hover:to-blue-600"
              >
                Kirim
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
