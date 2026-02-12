import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ChatwootProvider } from "@/components/chatwoot-provider";

export const metadata: Metadata = {
  title: "Helpdesk TIK Kota Tangerang",
  description: "Platform layanan IT untuk magang dan kebutuhan teknologi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <ChatwootProvider
            websiteToken="3qRxPcpGYULgohjbWdZYp7wM"
            baseUrl="http://172.16.10.134:8000"
            settings={{
              position: "right",
              locale: "id",
              type: "standard",
            }}
          >
            {children}
          </ChatwootProvider>
        </Providers>
      </body>
    </html>
  );
}