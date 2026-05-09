"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: "violet" | "emerald" | "amber" | "blue" | "red";
  className?: string;
}

const colorMap = {
  violet: "bg-violet-50 dark:bg-violet-950/30 text-violet-600",
  emerald: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600",
  amber: "bg-amber-50 dark:bg-amber-950/30 text-amber-600",
  blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600",
  red: "bg-red-50 dark:bg-red-950/30 text-red-600",
};

export function StatCard({ title, value, subtitle, icon, trend, color = "violet", className }: StatCardProps) {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  return (
    <div
      className={cn(
        "p-5 rounded-xl border border-border bg-background hover:shadow-sm transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorMap[color])}>
          {icon}
        </div>
        {trend && TrendIcon && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.value > 0
              ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30"
              : trend.value < 0
              ? "text-red-700 bg-red-50 dark:bg-red-950/30"
              : "text-muted-foreground bg-muted"
          )}>
            <TrendIcon className="w-3 h-3" />
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>}
      </div>
    </div>
  );
}
