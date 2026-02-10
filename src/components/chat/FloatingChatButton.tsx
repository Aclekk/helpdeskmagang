'use client'

import { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Panel */}
      <div
        className={cn(
          "absolute bottom-20 right-0 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {/* Header dengan gradient */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 dark:from-cyan-500 dark:to-blue-500">
          <div className="flex items-center gap-3">
            {/* Avatar chatbot kecil di header */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Send className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white">Helpdesk Chat</span>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Body */}
        <div className="flex h-80 flex-col bg-card dark:bg-slate-800">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {/* Bot Message dengan avatar robot */}
              <div className="flex gap-3">
                {/* Avatar chatbot */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 dark:from-cyan-500 dark:to-blue-500">
                  <Send className="h-full w-full text-white" />
                </div>

                {/* Message bubble */}
                <div className="max-w-[220px] rounded-2xl rounded-tl-sm bg-muted px-4 py-3 dark:bg-slate-700">
                  <p className="text-sm leading-relaxed text-foreground dark:text-slate-200">
                    Halo! 👋 Selamat datang di Helpdesk TIK. Ada yang bisa kami
                    bantu?
                  </p>
                </div>
              </div>

              {/* Info Message */}
              <div className="mx-auto rounded-lg bg-blue-50 px-4 py-2 text-center dark:bg-cyan-500/10">
                <p className="text-xs font-medium text-blue-700 dark:text-cyan-400">
                  🤖 Chatbot AI Helpdesk
                </p>
                <p className="mt-1 text-xs text-blue-600 dark:text-cyan-300">
                  (Integrasi sedang dalam pengembangan)
                </p>
              </div>
            </div>
          </div>

          {/* Input dengan style lebih modern */}
          <div className="border-t border-border bg-card p-4 dark:bg-slate-800">
            <div className="flex gap-2">
              <Input
                placeholder="Ketik pesan Anda..."
                className="flex-1 rounded-full border-border bg-muted dark:bg-slate-700"
                disabled
              />
              <Button
                size="icon"
                className="shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg transition-all hover:shadow-xl dark:from-cyan-500 dark:to-blue-500"
                disabled
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Floating Button (10x lompat lalu pause 15 detik, ulang) */}
      <button
        className={cn(
          // Base styles
          "relative h-32 w-30 transition-all duration-300",
          // Hover effect
          "hover:scale-110",
          // ✅ INI YANG DIINTEGRASIKAN:
          // 10 hop (±5s) + pause 15s = total 20s per siklus
          "animate-bounce-10-then-pause",
          // Rotation saat open
          isOpen && "rotate-12 scale-95",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-400/10 blur-2xl dark:bg-cyan-400/20" />

        {/* Icon chatbot */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
            <Send className="h-6 w-6 text-white" />
          </div>
          <div className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500",
            "animate-pulse"
          )} />
        </div>
      </button>
    </div>
  );
};

export default FloatingChatButton;
