'use client'

import { useState } from "react";

type Subjek = "pribadi" | "orang-lain";

type Props = {
  open: boolean;
  onClose: () => void;
  onLanjut: (subjek: Subjek) => void;
};

export default function SubjectSelectionModal({ open, onClose, onLanjut }: Props) {
  const [selected, setSelected] = useState<Subjek>("pribadi");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[min(480px,92vw)] rounded-2xl bg-white shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
          Pilih Subjek Pendaftaran
        </h2>

        {/* Options */}
        <div className="flex gap-4 mb-8">
          {/* Pribadi */}
          <button
            type="button"
            onClick={() => setSelected("pribadi")}
            className={`flex-1 rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
              selected === "pribadi"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="font-bold text-slate-900">Pribadi</p>
            <p className="text-sm text-slate-500 mt-0.5">Untuk diri sendiri</p>
          </button>

          {/* Orang Lain */}
          <button
            type="button"
            onClick={() => setSelected("orang-lain")}
            className={`flex-1 rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
              selected === "orang-lain"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="font-bold text-slate-900">Orang Lain</p>
            <p className="text-sm text-slate-500 mt-0.5">Untuk orang lain</p>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => onLanjut(selected)}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 px-8 py-3 font-bold text-white transition-colors"
          >
            Lanjut
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-500 hover:bg-slate-600 px-8 py-3 font-bold text-white transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
