'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogIn, LogOut, User, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";
import { useState } from "react";

const Header = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Logo & Brand */}
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-10 sm:w-10">
            <Image
              src={logoHelpdesk}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Text brand: dibuat min-w-0 + truncate biar gak nabrak kanan */}
          <div className="min-w-0">
            <span className="block truncate text-sm font-bold text-foreground sm:text-lg">
              Helpdesk TIK
            </span>

            {/* Subtitle hide di mobile */}
            <span className="hidden text-xs text-muted-foreground sm:block">
              Kota Tangerang
            </span>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Theme Toggle */}
          <DropdownMenu onOpenChange={setIsThemeDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isThemeDropdownOpen ? "rotate-180" : ""}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("auto")}>
                <Monitor className="mr-2 h-4 w-4" />
                Auto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-muted">
                  {/* Avatar */}
                  <div className="h-9 w-9 overflow-hidden rounded-full border shadow-sm">
                    <Image
                      src={user?.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Nama */}
                  <span className="hidden text-sm font-medium sm:block">
                    {user?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 overflow-hidden rounded-xl p-0 shadow-xl"
              >
                {/* Header Biru */}
                <div className="relative bg-blue-600 px-6 pb-10 pt-6 text-center text-white">
                  <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src={user?.avatar || "/placeholder.svg"} // kalau belum ada avatar pakai default
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="text-sm font-semibold tracking-wide">
                    {user?.name}
                  </p>
                </div>

                {/* Body */}
                <div className="flex items-center justify-between bg-background px-6 py-4">
                  <button
                    onClick={() => router.push("/profile")}
                    className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted transition"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted transition"
                  >
                    Sign out
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="gap-2 px-3 sm:px-4">
              <Link href="/login" aria-label="Login">
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
