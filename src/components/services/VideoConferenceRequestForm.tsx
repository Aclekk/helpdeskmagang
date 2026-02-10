import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatDateDDMMYYYY(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function VideoConferenceRequestForm() {
  // default request date (readonly)
  const requestDate = useMemo(() => formatDateDDMMYYYY(new Date()), []);

  // state
  const [judulKegiatan, setJudulKegiatan] = useState("");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState(""); // yyyy-mm-dd
  const [rapatBerulang, setRapatBerulang] = useState(false);

  const [jumlahPeserta, setJumlahPeserta] = useState<string>("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");

  const [instansi, setInstansi] = useState<string>("");
  const [kodeUnit, setKodeUnit] = useState("");

  const [namaPemohon, setNamaPemohon] = useState("");
  const [jabatanPemohon, setJabatanPemohon] = useState("");

  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [lokasiAcara, setLokasiAcara] = useState("");
  const [perangkatDibutuhkan, setPerangkatDibutuhkan] = useState("");
  const [jenisKegiatan, setJenisKegiatan] = useState<string>("internal");

  const [keterangan, setKeterangan] = useState("");

  // ====== Rapat berulang (recurrence) ======
  type RepeatType = "daily" | "weekly" | "monthly";
  type EndType = "on" | "after";

  const [repeatType, setRepeatType] = useState<RepeatType>("weekly");
  const [repeatEvery, setRepeatEvery] = useState<number>(1);

  const [repeatOnDays, setRepeatOnDays] = useState<string[]>([]);
  const toggleDay = (day: string) => {
    setRepeatOnDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const [endType, setEndType] = useState<EndType>("on");
  const [endOnDate, setEndOnDate] = useState<string>("");
  const [endAfterCount, setEndAfterCount] = useState<number>(7);

  const repeatUnitLabel =
    repeatType === "daily" ? "hari" : repeatType === "weekly" ? "minggu" : "bulan";

  const instansiOptions = useMemo(
    () => [
      "Diskominfo Kota Tangerang",
      "Dinas Pendidikan",
      "Dinas Kesehatan",
      "Kecamatan",
      "Kelurahan",
      "OPD Lainnya",
    ],
    []
  );

  const pesertaOptions = useMemo(
    () => [
      { value: "1-25", label: "1 - 25" },
      { value: "26-50", label: "26 - 50" },
      { value: "51-100", label: "51 - 100" },
      { value: "101-300", label: "101 - 300" },
      { value: "300+", label: "Lebih dari 300" },
    ],
    []
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // frontend dulu: log payload
    const payload = {
      requestDate,
      judulKegiatan,
      tanggalPelaksanaan,
      rapatBerulang,
      jumlahPeserta,
      waktuMulai,
      waktuSelesai,
      instansi,
      kodeUnit,
      namaPemohon,
      jabatanPemohon,
      email,
      whatsapp,
      lokasiAcara,
      perangkatDibutuhkan,
      jenisKegiatan,
      keterangan,
      recurrence: rapatBerulang
        ? {
            repeatType,
            repeatEvery,
            repeatOnDays: repeatType === "weekly" ? repeatOnDays : [],
            endType,
            endOnDate: endType === "on" ? endOnDate : null,
            endAfterCount: endType === "after" ? endAfterCount : null,
          }
        : null,
    };

    console.log("VIDEO CONFERENCE REQUEST:", payload);
    alert("Form Video Conference tersimpan (frontend) ✅");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        Video Conference Zoom
      </h1>

      <Card className="overflow-hidden border-slate-200/60 bg-white shadow-lg dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="h-1.5 w-full bg-yellow-500" />

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

            {/* Tanggal Pelaksanaan + Rapat berulang */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Tanggal Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={tanggalPelaksanaan}
                  onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-6 flex items-end">
                <label className="flex items-center gap-3 text-slate-900 dark:text-slate-50">
                  <Checkbox
                    checked={rapatBerulang}
                    onCheckedChange={(v) => setRapatBerulang(Boolean(v))}
                  />
                  <span className="font-medium">Rapat berulang</span>
                </label>
              </div>
            </div>

            {/* Recurrence Section */}
            {rapatBerulang && (
              <div className="relative rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/90">
                {/* Garis biru kiri */}
                <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-blue-600" />

                <div className="space-y-5 pl-4">
                  {/* Pengulangan */}
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                    <div className="font-medium text-slate-900 dark:text-slate-50 md:col-span-3">
                      Pengulangan
                    </div>
                    <div className="md:col-span-9">
                      <Select
                        value={repeatType}
                        onValueChange={(v) => setRepeatType(v as RepeatType)}
                      >
                        <SelectTrigger className="w-full md:w-[340px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="monthly">Bulanan</SelectItem>
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
                        value={String(repeatEvery)}
                        onValueChange={(v) => setRepeatEvery(Number(v))}
                      >
                        <SelectTrigger className="w-full md:w-[220px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }).map((_, i) => {
                            const val = i + 1;
                            return (
                              <SelectItem key={val} value={String(val)}>
                                {val}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-slate-900 dark:text-slate-50 md:col-span-5">
                      {repeatUnitLabel}
                    </div>
                  </div>

                  {/* Terjadi pada (muncul kalau Mingguan) */}
                  {repeatType === "weekly" && (
                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                      <div className="font-medium text-slate-900 dark:text-slate-50 md:col-span-3">
                        Terjadi pada
                      </div>

                      <div className="flex flex-wrap gap-5 md:col-span-9">
                        {[
                          ["sun", "Minggu"],
                          ["mon", "Senin"],
                          ["tue", "Selasa"],
                          ["wed", "Rabu"],
                          ["thu", "Kamis"],
                          ["fri", "Jumat"],
                          ["sat", "Sabtu"],
                        ].map(([val, label]) => (
                          <label key={val} className="flex items-center gap-2">
                            <Checkbox
                              checked={repeatOnDays.includes(val as string)}
                              onCheckedChange={() => toggleDay(val as string)}
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
                      Tanggal berakhir
                    </div>

                    <div className="space-y-3 md:col-span-9">
                      {/* Pada (tanggal) */}
                      <label className="flex flex-wrap items-center gap-3">
                        <input
                          type="radio"
                          name="endType"
                          checked={endType === "on"}
                          onChange={() => setEndType("on")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-500 dark:focus:ring-blue-600"
                        />
                        <span className="text-slate-900 dark:text-slate-50">
                          Pada
                        </span>
                        <Input
                          type="date"
                          className="w-full sm:w-[220px]"
                          value={endOnDate}
                          onChange={(e) => setEndOnDate(e.target.value)}
                          disabled={endType !== "on"}
                        />
                      </label>

                      {/* Setelah (N penyelenggaraan) */}
                      <label className="flex flex-wrap items-center gap-3">
                        <input
                          type="radio"
                          name="endType"
                          checked={endType === "after"}
                          onChange={() => setEndType("after")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-500 dark:focus:ring-blue-600"
                        />
                        <span className="text-slate-900 dark:text-slate-50">
                          Setelah
                        </span>

                        <Select
                          value={String(endAfterCount)}
                          onValueChange={(v) => setEndAfterCount(Number(v))}
                          disabled={endType !== "after"}
                        >
                          <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 50 }).map((_, i) => {
                              const val = i + 1;
                              return (
                                <SelectItem key={val} value={String(val)}>
                                  {val}
                                </SelectItem>
                              );
                            })}
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

            {/* Waktu Mulai & Selesai */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Waktu Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={waktuMulai}
                  onChange={(e) => setWaktuMulai(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Waktu Selesai
                </label>
                <Input
                  type="time"
                  value={waktuSelesai}
                  onChange={(e) => setWaktuSelesai(e.target.value)}
                />
              </div>
            </div>

            {/* Instansi & Kode unit */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Instansi <span className="text-red-500">*</span>
                </label>
                <Select value={instansi} onValueChange={setInstansi} required>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Pilih Instansi" />
                  </SelectTrigger>
                  <SelectContent>
                    {instansiOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Kode unit organisasi (opsional)
                </label>
                <Input
                  value={kodeUnit}
                  onChange={(e) => setKodeUnit(e.target.value)}
                  placeholder="Kode unit organisasi (opsional)"
                />
              </div>
            </div>

            {/* Nama Pemohon & Jabatan Pemohon */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  Nama Pemohon <span className="text-red-500">*</span>
                </label>
                <Input
                  value={namaPemohon}
                  onChange={(e) => setNamaPemohon(e.target.value)}
                  placeholder="Nama pemohon"
                  required
                />
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

            {/* Email & Whatsapp */}
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

              <div className="md:col-span-6 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-slate-50">
                  No. Whatsapp
                </label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
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

            {/* Perangkat dibutuhkan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Perangkat Yang dibutuhkan
              </label>
              <textarea
                className="min-h-[96px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-50"
                value={perangkatDibutuhkan}
                onChange={(e) => setPerangkatDibutuhkan(e.target.value)}
                placeholder="Tuliskan perangkat yang dibutuhkan (opsional)"
              />
            </div>

            {/* Jenis Kegiatan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Jenis Kegiatan
              </label>
              <Select value={jenisKegiatan} onValueChange={setJenisKegiatan}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-slate-50">
                Keterangan
              </label>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-50"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700"
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
