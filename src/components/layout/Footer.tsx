import Image from "next/image";
import Link from "next/link";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-950">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <Image
                  src={logoHelpdesk}
                  alt="Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  Helpdesk TIK
                </p>
                <p className="text-xs text-slate-400">Kota Tangerang</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Layanan teknologi informasi dan komunikasi Dinas Komunikasi dan
              Informatika Pemerintah Kota Tangerang.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Layanan
            </h4>
            <div className="space-y-2">
              {[{ href: "/services", label: "Katalog Layanan" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Kontak
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  diskominfo@tangerangkota.go.id
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  0811-1500-152
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Jl. Satria Sudirman No.1, Kota Tangerang
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Dinas Komunikasi dan Informatika Kota
            Tangerang. All rights reserved.
          </p>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            v3.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
