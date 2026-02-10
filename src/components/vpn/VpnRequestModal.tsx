import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type JenisPermohonan = "baru" | "perpanjangan";
type StatusPegawai = "asn" | "ta";

export default function VpnRequestModal({ open, onClose }: Props) {
  const instansiOptions = useMemo(
    () => [
      "Pilih Instansi",
      "Diskominfo Kota Tangerang",
      "Dinas Pendidikan",
      "Dinas Kesehatan",
      "Kecamatan",
      "Kelurahan",
    ],
    []
  );

  const [jenisPermohonan, setJenisPermohonan] = useState<JenisPermohonan>("baru");
  const [statusPegawai, setStatusPegawai] = useState<StatusPegawai>("asn");

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instansi, setInstansi] = useState(instansiOptions[0]);
  const [tujuan, setTujuan] = useState("");

  // signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [open]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
    canvas.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = getPoint(e);
    const last = lastPointRef.current;

    if (last) {
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      setHasSignature(true);
    }
    lastPointRef.current = p;
  };

  const endDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const signatureDataUrl = canvasRef.current?.toDataURL("image/png") ?? "";

    // frontend dulu: sementara log
    console.log({
      jenisPermohonan,
      nama,
      jabatan,
      statusPegawai,
      nip,
      email,
      whatsapp,
      instansi,
      tujuan,
      signatureDataUrl,
    });

    alert("Form terkirim (frontend) ✅ backend nanti");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-[min(980px,92vw)] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        {/* header */}
        <div className="border-b px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Formulir Permohonan VPN Pemerintah Kota Tangerang
            </h2>
            <p className="text-sm text-slate-500">Isi data berikut sesuai kebutuhan.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="p-6">
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="h-1.5 w-full rounded-t-xl bg-blue-600" />
            <form onSubmit={onSubmit} className="p-6 space-y-5">
              {/* Jenis Permohonan */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Jenis Permohonan <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="jenisPermohonan"
                      checked={jenisPermohonan === "baru"}
                      onChange={() => setJenisPermohonan("baru")}
                    />
                    Baru
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="jenisPermohonan"
                      checked={jenisPermohonan === "perpanjangan"}
                      onChange={() => setJenisPermohonan("perpanjangan")}
                    />
                    Perpanjangan
                  </label>
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              {/* Jabatan */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  required
                />
              </div>

              {/* Status Pegawai */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Status Pegawai <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusPegawai"
                      checked={statusPegawai === "asn"}
                      onChange={() => setStatusPegawai("asn")}
                    />
                    ASN
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusPegawai"
                      checked={statusPegawai === "ta"}
                      onChange={() => setStatusPegawai("ta")}
                    />
                    TA
                  </label>
                </div>
              </div>

              {/* NIP */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  NIP <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="contoh@contoh.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Whatsapp */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Nomor Telp yang terhubung ke Whatsapp <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </div>

              {/* Instansi */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Instansi <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white"
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  required
                >
                  {instansiOptions.map((opt) => (
                    <option key={opt} value={opt} disabled={opt === "Pilih Instansi"}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tujuan */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Tujuan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  required
                />
              </div>

              {/* Signature */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Tanda Tangan <span className="text-red-500">*</span>
                </label>

                <div className="relative h-[220px] rounded-xl border border-slate-300 overflow-hidden bg-white">
                  {!hasSignature && (
                    <div className="absolute inset-0 grid place-items-center text-slate-400 font-bold text-2xl pointer-events-none">
                      Sign Here
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full block"
                    style={{ touchAction: "none", cursor: "crosshair" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrawing}
                    onPointerCancel={endDrawing}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-xl border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50"
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
