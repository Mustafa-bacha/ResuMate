"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

type SkillLevel = "match" | "partial" | "missing";
type Priority = "high" | "medium" | "low";

interface SkillBadgeProps {
  name: string;
  level?: SkillLevel;
  priority?: Priority;
  showIcon?: boolean;
  className?: string;
}

const levelConfig = {
  match: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  },
  partial: {
    icon: MinusCircle,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  },
  missing: {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  },
};

const priorityDots: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

export function SkillBadge({ name, level, priority, showIcon = true, className }: SkillBadgeProps) {
  const config = level ? levelConfig[level] : null;
  const Icon = config?.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config?.className || "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {priority && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", priorityDots[priority])} />
      )}
      {showIcon && Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      {name}
    </span>
  );
}
