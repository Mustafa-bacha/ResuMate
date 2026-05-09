"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

interface SkillRadarChartProps {
  data: Array<{
    category: string;
    count: number;
    avgProficiency?: number;
  }>;
  className?: string;
}

const COLORS = {
  stroke: "#7c3aed",
  fill: "rgba(124, 58, 237, 0.15)",
};

export function SkillRadarChart({ data, className }: SkillRadarChartProps) {
  if (!data?.length) {
    return (
      <div className={`flex items-center justify-center h-64 text-muted-foreground text-sm ${className}`}>
        No skill data available. Upload a resume to see your skill distribution.
      </div>
    );
  }

  // Normalize data for radar chart (0-100 scale)
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartData = data.map((d) => ({
    category: d.category.length > 12 ? d.category.slice(0, 12) + "…" : d.category,
    fullCategory: d.category,
    Skills: Math.round((d.count / maxCount) * 100),
    Proficiency: d.avgProficiency || 50,
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend iconSize={8} />
          <Radar
            name="Skills"
            dataKey="Skills"
            stroke={COLORS.stroke}
            fill={COLORS.fill}
            fillOpacity={0.6}
          />
          <Radar
            name="Proficiency"
            dataKey="Proficiency"
            stroke="#10b981"
            fill="rgba(16, 185, 129, 0.1)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
