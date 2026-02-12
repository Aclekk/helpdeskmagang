'use client'

import { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* ================= CHAT PANEL ================= */}
      <div
        className={cn(
          "absolute bottom-24 right-0 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 ease-out",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
            : "pointer-events-none translate-y-4 opacity-0 scale-95",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Helpdesk TIK</p>
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

        {/* Body */}
        <div className="flex h-80 flex-col bg-card">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>

              <div className="max-w-[220px] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                <p className="text-sm leading-relaxed">
                  Halo 👋 Selamat datang di Helpdesk TIK. Ada yang bisa kami bantu hari ini?
                </p>
              </div>
            </div>

            <div className="mx-auto rounded-lg bg-blue-50 px-4 py-2 text-center">
              <p className="text-xs font-medium text-blue-700">
                Chatbot AI (Coming Soon)
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tulis pesan..."
                className="flex-1 rounded-full bg-muted"
                disabled
              />
              <Button
                size="icon"
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-md hover:scale-105 transition"
                disabled
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FLOATING BUTTON ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat Helpdesk"
        className={cn(
          "group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white shadow-xl transition-all duration-300",
          "hover:scale-105 hover:shadow-2xl",
          isOpen && "scale-95"
        )}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden md:inline text-sm font-medium">
          Chat Helpdesk
        </span>
      </button>
    </div>
  );
};

export default FloatingChatButton;
