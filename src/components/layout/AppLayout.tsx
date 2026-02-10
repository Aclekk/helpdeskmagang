import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingChatButton from "../chat/FloatingChatButton";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default AppLayout;
