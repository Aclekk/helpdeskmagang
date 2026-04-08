'use client'

import { useState } from "react";
import { User, Users } from "lucide-react";

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
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-[min(460px,92vw)] rounded-[20px] bg-white dark:bg-slate-900 shadow-2xl p-9">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
            Pilih Subjek Pendaftaran
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pilih untuk siapa permohonan VPN ini ditujukan
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Pribadi */}
          <button
            type="button"
            onClick={() => setSelected("pribadi")}
            className={`relative rounded-[14px] border-2 p-4 text-left transition-all duration-200 ${
              selected === "pribadi"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300"
            }`}
          >
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-2.5 ${
              selected === "pribadi"
                ? "bg-blue-200 dark:bg-blue-800"
                : "bg-slate-100 dark:bg-slate-700"
            }`}>
              <User className={`w-4 h-4 ${
                selected === "pribadi"
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-slate-500 dark:text-slate-400"
              }`} />
            </div>
            <p className={`text-sm font-semibold mb-0.5 ${
              selected === "pribadi"
                ? "text-blue-800 dark:text-blue-200"
                : "text-slate-800 dark:text-slate-200"
            }`}>Pribadi</p>
            <p className={`text-xs ${
              selected === "pribadi"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-500"
            }`}>Untuk diri sendiri</p>

            {/* Radio dot */}
            <div className="absolute bottom-4 right-4">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selected === "pribadi"
                  ? "border-blue-500 bg-blue-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}>
                {selected === "pribadi" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>

          {/* Orang Lain */}
          <button
            type="button"
            onClick={() => setSelected("orang-lain")}
            className={`relative rounded-[14px] border-2 p-4 text-left transition-all duration-200 ${
              selected === "orang-lain"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300"
            }`}
          >
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-2.5 ${
              selected === "orang-lain"
                ? "bg-blue-200 dark:bg-blue-800"
                : "bg-slate-100 dark:bg-slate-700"
            }`}>
              <Users className={`w-4 h-4 ${
                selected === "orang-lain"
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-slate-500 dark:text-slate-400"
              }`} />
            </div>
            <p className={`text-sm font-semibold mb-0.5 ${
              selected === "orang-lain"
                ? "text-blue-800 dark:text-blue-200"
                : "text-slate-800 dark:text-slate-200"
            }`}>Orang Lain</p>
            <p className={`text-xs ${
              selected === "orang-lain"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-500"
            }`}>Untuk orang lain</p>

            <div className="absolute bottom-4 right-4">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selected === "orang-lain"
                  ? "border-blue-500 bg-blue-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}>
                {selected === "orang-lain" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => onLanjut(selected)}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            Lanjut
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white text-sm font-semibold transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
