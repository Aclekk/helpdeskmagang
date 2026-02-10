'use client'

import { useMemo, useState, useRef } from "react";
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

function formatDateDDMMYYYY(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function VpnRequestForm() {
  // default request date (readonly)
  const requestDate = useMemo(() => formatDateDDMMYYYY(new Date()), []);

  // state
  const [jenisPermohonan, setJenisPermohonan] = useState<"baru" | "perpanjangan">("baru");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [statusPegawai, setStatusPegawai] = useState<"asn" | "ta">("asn");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instansi, setInstansi] = useState<string>("");
  const [tujuan, setTujuan] = useState("");
  const [tandaTangan, setTandaTangan] = useState("");
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  const instansiOptions = [
    "Pilih Instansi",
    "Diskominfo Kota Tangerang",
    "Dinas Pendidikan",
    "Dinas Kesehatan",
    "Kecamatan",
    "Kelurahan",
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const signatureData = sigRef.current?.toDataURL();

    const payload = {
      requestDate,
      jenisPermohonan,
      nama,
      jabatan,
      statusPegawai,
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

            {/* Jenis Permohonan */}
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

            {/* Nama */}
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

            {/* Jabatan */}
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

            {/* Status Pegawai */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Status Pegawai <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={statusPegawai}
                onValueChange={(value) => setStatusPegawai(value as "asn" | "ta")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asn" id="asn" />
                  <Label htmlFor="asn" className="cursor-pointer">
                    ASN
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ta" id="ta" />
                  <Label htmlFor="ta" className="cursor-pointer">
                    TA
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* NIP */}
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
                required
              />
            </div>

            {/* Nomor Telp/WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                Nomor Telp yang terhubung ke Whatsapp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>

            {/* Instansi */}
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

            {/* Tujuan */}
            <div className="space-y-2">
              <Label htmlFor="tujuan">
                Tujuan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="tujuan"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Jelaskan tujuan penggunaan VPN"
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
                {/* SVG Placeholder */}
                {!isSigned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 600 250"
                      className="text-slate-300"
                    >
                      {/* Text */}
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

                      {/* Wave line */}
                      <path
                        d="M40 170 C120 150, 180 190, 260 170 S400 150, 560 170"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Small icon (pen) */}
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

                {/* Signature Canvas */}
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

            {/* Submit Button */}
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
