"use client";

import { ChatwootWidget } from "./chatwoot-widget";
import type { ChatwootConfig } from "@/hooks/use-chatwoot";

export function ChatwootProvider({
  children,
  ...config
}: ChatwootConfig & { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatwootWidget {...config} />
    </>
  );
}