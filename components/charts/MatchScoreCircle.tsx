"use client";

import { cn } from "@/lib/utils";
import { getMatchLabel } from "@/lib/utils/constants";

interface MatchScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function MatchScoreCircle({ score, size = "md", showLabel = true, className }: MatchScoreCircleProps) {
  const { label, color } = getMatchLabel(score);

  const sizeConfig = {
    sm: { outer: 72, stroke: 6, fontSize: "text-lg", labelSize: "text-[10px]" },
    md: { outer: 120, stroke: 10, fontSize: "text-3xl", labelSize: "text-xs" },
    lg: { outer: 160, stroke: 12, fontSize: "text-5xl", labelSize: "text-sm" },
  };

  const cfg = sizeConfig[size];
  const radius = (cfg.outer - cfg.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  const scoreColors: Record<string, string> = {
    "text-emerald-600": "#10b981",
    "text-blue-600": "#2563eb",
    "text-amber-600": "#d97706",
    "text-red-600": "#dc2626",
  };
  const strokeColor = scoreColors[color] || "#7c3aed";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
        <svg width={cfg.outer} height={cfg.outer} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={cfg.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold font-display", cfg.fontSize, color)}>
            {score}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn("font-medium text-center", cfg.labelSize, color)}>{label}</span>
      )}
    </div>
  );
}
