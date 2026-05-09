"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <PageLoader label="Loading ResuMate…" />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <AppNavbar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
