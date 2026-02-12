"use client";

import { useChatwoot, type ChatwootConfig } from "@/hooks/use-chatwoot";

export function ChatwootWidget({
  websiteToken,
  baseUrl,
  settings,
}: ChatwootConfig) {
  const { isLoaded, error } = useChatwoot({ websiteToken, baseUrl, settings });

  // Debug logs
  console.log("Chatwoot Widget - isLoaded:", isLoaded);
  console.log("Chatwoot Widget - baseUrl:", baseUrl);
  console.log("Chatwoot Widget - websiteToken:", websiteToken);

  // Log errors in development
  if (error) {
    console.error("Chatwoot Error:", error);
  }

  // Check if Chatwoot is available in window
  if (typeof window !== 'undefined') {
    console.log("Window chatwootSDK:", window.chatwootSDK);
    console.log("Window $chatwoot:", window.$chatwoot);
  }

  // Widget is rendered by Chatwoot SDK, we just load it
  return null;
}