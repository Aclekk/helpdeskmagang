"use client";

import { useEffect, useState } from "react";

export interface ChatwootSettings {
  hideMessageBubble?: boolean;
  position?: "left" | "right";
  locale?: string;
  useBrowserLanguage?: boolean;
  type?: "standard" | "expanded_bubble";
  darkMode?: "auto" | "light" | "dark";
  launcherTitle?: string;
  showPopoutButton?: boolean;
}

export interface ChatwootConfig {
  websiteToken: string;
  baseUrl: string;
  settings?: ChatwootSettings;
}

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
      toggleBubbleVisibility: (visibility?: "show" | "hide") => void;
      setUser: (
        identifier: string,
        user: {
          name?: string;
          email?: string;
          avatar_url?: string;
          phone_number?: string;
        },
      ) => void;
      setCustomAttributes: (attributes: Record<string, any>) => void;
      deleteCustomAttribute: (attributeName: string) => void;
      setLabel: (label: string) => void;
      removeLabel: (label: string) => void;
      setLocale: (locale: string) => void;
      reset: () => void;
    };
  }
}

export function useChatwoot({
  websiteToken,
  baseUrl,
  settings,
}: ChatwootConfig) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if already loaded
    if (window.chatwootSDK) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;

    // Handle successful load
    script.onload = () => {
      if (window.chatwootSDK) {
        try {
          window.chatwootSDK.run({
            websiteToken,
            baseUrl,
          });

          // Apply settings after SDK is loaded
          if (settings && window.$chatwoot) {
            // Wait a bit for Chatwoot to fully initialize
            setTimeout(() => {
              if (settings.locale && window.$chatwoot) {
                window.$chatwoot.setLocale(settings.locale);
              }
            }, 1000);
          }

          setIsLoaded(true);
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to initialize Chatwoot"),
          );
        }
      }
    };

    // Handle load error
    script.onerror = () => {
      setError(new Error(`Failed to load Chatwoot SDK from ${baseUrl}`));
    };

    // Append script to document
    document.body.appendChild(script);

    // Cleanup
    return () => {
      // Remove script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [websiteToken, baseUrl, settings]);

  return { isLoaded, error };
}

// Helper hooks for Chatwoot API
export function useChatwootAPI() {
  const toggle = (state?: "open" | "close") => {
    if (window.$chatwoot) {
      window.$chatwoot.toggle(state);
    }
  };

  const toggleBubbleVisibility = (visibility?: "show" | "hide") => {
    if (window.$chatwoot) {
      window.$chatwoot.toggleBubbleVisibility(visibility);
    }
  };

  const setUser = (
    identifier: string,
    user: {
      name?: string;
      email?: string;
      avatar_url?: string;
      phone_number?: string;
    },
  ) => {
    if (window.$chatwoot) {
      window.$chatwoot.setUser(identifier, user);
    }
  };

  const setCustomAttributes = (attributes: Record<string, any>) => {
    if (window.$chatwoot) {
      window.$chatwoot.setCustomAttributes(attributes);
    }
  };

  const deleteCustomAttribute = (attributeName: string) => {
    if (window.$chatwoot) {
      window.$chatwoot.deleteCustomAttribute(attributeName);
    }
  };

  const setLabel = (label: string) => {
    if (window.$chatwoot) {
      window.$chatwoot.setLabel(label);
    }
  };

  const removeLabel = (label: string) => {
    if (window.$chatwoot) {
      window.$chatwoot.removeLabel(label);
    }
  };

  const setLocale = (locale: string) => {
    if (window.$chatwoot) {
      window.$chatwoot.setLocale(locale);
    }
  };

  const reset = () => {
    if (window.$chatwoot) {
      window.$chatwoot.reset();
    }
  };

  return {
    toggle,
    toggleBubbleVisibility,
    setUser,
    setCustomAttributes,
    deleteCustomAttribute,
    setLabel,
    removeLabel,
    setLocale,
    reset,
  };
}