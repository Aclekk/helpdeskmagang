import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
// import FloatingChatButton from "../chat/FloatingChatButton"; // ← COMMENT/HAPUS ini

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* <FloatingChatButton /> */} {/* ← COMMENT/HAPUS ini */}
      {/* Chatwoot widget akan muncul otomatis dari ChatwootProvider di layout.tsx */}
    </div>
  );
};

export default AppLayout;
