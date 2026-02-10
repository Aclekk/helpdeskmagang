import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={logoHelpdesk}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              Helpdesk TIK
            </span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dinas Komunikasi dan Informatika Kota
            Tangerang
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">V3.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
