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
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogIn, LogOut, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 px-3 sm:px-4"
                  aria-label="User menu"
                >
                  <User className="h-4 w-4" />
                  {/* Nama user hanya muncul di sm ke atas */}
                  <span className="hidden max-w-[140px] truncate sm:inline">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
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
