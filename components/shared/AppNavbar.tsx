"use client";

import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppNavbarProps {
  title?: string;
  subtitle?: string;
}

export function AppNavbar({ title, subtitle }: AppNavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Page Title (desktop) */}
      <div className="hidden md:flex flex-col justify-center">
        {title && <h1 className="text-sm font-semibold">{title}</h1>}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden lg:flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 w-56 h-8 text-sm bg-muted border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="h-8 w-8"
        aria-label="Toggle theme"
      >
        <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="h-8 w-8 relative" aria-label="Notifications">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
      </Button>
    </header>
  );
}
