"use client";

import { TrendingUp, Clock, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MatchScoreCircle } from "@/components/charts/MatchScoreCircle";
import { SkillBadge } from "@/components/jobs/SkillBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface JobMatchCardProps {
  match: {
    _id: string;
    jobTitle: string;
    createdAt: string;
    analysis: {
      matchScore: number;
      matchedSkills?: Array<{ skill: string; level: "match" | "partial" | "missing"; importance: string }>;
      missingSkills?: Array<{ skill: string; priority: "high" | "medium" | "low" }>;
      keyRecommendations?: string[];
      learningPath?: Array<{ skill: string; estimatedWeeks: number }>;
      summary?: string;
    };
  };
  onDelete?: () => void;
  defaultExpanded?: boolean;
  className?: string;
}

export function JobMatchCard({ match, onDelete, defaultExpanded = false, className }: JobMatchCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { analysis } = match;

  return (
    <div className={cn("border border-border rounded-xl overflow-hidden transition-all duration-300", className)}>
      {/* Header */}
      <div
        className="p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <MatchScoreCircle score={analysis.matchScore} size="sm" showLabel={false} />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{match.jobTitle}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">{formatDate(match.createdAt)}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] h-4",
                analysis.matchScore >= 80 ? "border-emerald-400 text-emerald-600" :
                analysis.matchScore >= 60 ? "border-blue-400 text-blue-600" :
                analysis.matchScore >= 40 ? "border-amber-400 text-amber-600" :
                "border-red-400 text-red-600"
              )}
            >
              {analysis.matchScore}% match
            </Badge>
          </div>
        </div>

        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-5">
          {/* Summary */}
          {analysis.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
          )}

          {/* Matched Skills */}
          {analysis.matchedSkills && analysis.matchedSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Matched Skills ({analysis.matchedSkills.filter(s => s.level === "match").length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.slice(0, 10).map((s) => (
                  <SkillBadge key={s.skill} name={s.skill} level={s.level} />
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {analysis.missingSkills && analysis.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Skills to Develop ({analysis.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.slice(0, 8).map((s) => (
                  <SkillBadge key={s.skill} name={s.skill} level="missing" priority={s.priority} />
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.keyRecommendations && analysis.keyRecommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />Key Recommendations
              </h4>
              <ul className="space-y-1.5">
                {analysis.keyRecommendations.slice(0, 4).map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-violet-500 font-bold flex-shrink-0">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning Path */}
          {analysis.learningPath && analysis.learningPath.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />Learning Path
              </h4>
              <div className="space-y-2">
                {analysis.learningPath.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 text-xs flex items-center justify-center flex-shrink-0 font-semibold">
                      {i + 1}
                    </span>
                    <span>{item.skill}</span>
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{item.estimatedWeeks}w
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onDelete && (
            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                Delete Match
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
