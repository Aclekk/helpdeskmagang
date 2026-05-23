"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  LogIn,
  Monitor,
  ChevronDown,
  LayoutGrid,
  Home,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function UserAvatar({
  src,
  name,
  size = 36,
}: {
  src?: string;
  name?: string;
  size?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 font-bold text-white"
      style={{ fontSize: size * 0.35 }}
    >
      {getInitials(name)}
    </div>
  );
}

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/services", label: "Layanan", icon: LayoutGrid },
];

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [themeOpen, setThemeOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/95">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* ── Brand ── */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Image
              src={logoHelpdesk}
              alt="Logo"
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none text-slate-900 dark:text-slate-50">
              Helpdesk TIK
            </p>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              Kota Tangerang
            </p>
          </div>
        </Link>

        {/* ── Nav links (center) ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Theme toggle */}
          <DropdownMenu onOpenChange={setThemeOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-500 dark:text-slate-400"
              >
                {resolvedTheme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="gap-2"
              >
                <Sun className="h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="gap-2"
              >
                <Moon className="h-4 w-4" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("auto")}
                className="gap-2"
              >
                <Monitor className="h-4 w-4" /> Auto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                  <div className="h-7 w-7 overflow-hidden rounded-full">
                    <UserAvatar
                      src={user?.avatar}
                      name={user?.name}
                      size={28}
                    />
                  </div>
                  <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 overflow-hidden rounded-xl p-0 shadow-xl"
              >
                {/* Header biru */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pb-8 pt-5 text-center">
                  <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full border-2 border-white/30 shadow-lg">
                    <UserAvatar
                      src={user?.avatar}
                      name={user?.name}
                      size={64}
                    />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {user?.name}
                  </p>
                  <p className="mt-0.5 text-xs text-blue-200/70">
                    {user?.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 bg-white p-3 dark:bg-slate-900">
                  <button
                    onClick={() => router.push("/profile")}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    Keluar
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Masuk</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
