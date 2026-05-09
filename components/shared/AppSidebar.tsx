"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Search, Wand2, MessageSquare,
  User, LogOut, Menu, X, Zap, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Skill Analyzer", href: "/analyzer", icon: FileText },
  { label: "Job Matcher", href: "/job-matcher", icon: Search },
  { label: "Resume Optimizer", href: "/resume-optimizer", icon: Wand2 },
  { label: "AI Assistant", href: "/chat", icon: MessageSquare },
  { label: "Profile", href: "/profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const initials = user ? getInitials(user.firstName, user.lastName) : "??";

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-background border border-border rounded-lg shadow-sm"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border flex flex-col z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display text-lg font-semibold tracking-tight">ResuMate</span>
              <Badge variant="secondary" className="ml-2 text-[10px] py-0 h-4">
                {user?.subscriptionTier || "free"}
              </Badge>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-medium dark:bg-violet-950/50 dark:text-violet-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-violet-600" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">{initials}</span>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isUserMenuOpen && (
            <div className="mt-2 space-y-1">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                onClick={() => { setIsOpen(false); setIsUserMenuOpen(false); }}
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
