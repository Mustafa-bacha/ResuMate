"use client";

import { FileText, Clock, CheckCircle2, Trash2, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface ResumeCardProps {
  resume: {
    _id: string;
    fileName: string;
    fileType: string;
    isPrimary: boolean;
    parsedAt?: string;
    extractedData?: {
      skills?: unknown[];
      experience?: unknown[];
    };
    createdAt: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ResumeCard({ resume, isSelected, onSelect, onDelete, className }: ResumeCardProps) {
  const skillCount = resume.extractedData?.skills?.length || 0;
  const expCount = resume.extractedData?.experience?.length || 0;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative p-4 rounded-xl border cursor-pointer transition-all duration-200",
        isSelected
          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-sm"
          : "border-border hover:border-violet-300 hover:bg-muted/50",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          isSelected ? "bg-violet-100 dark:bg-violet-900" : "bg-muted"
        )}>
          <FileText className={cn("w-5 h-5", isSelected ? "text-violet-600" : "text-muted-foreground")} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm truncate">{resume.fileName}</p>
            {resume.isPrimary && (
              <Badge variant="secondary" className="text-[10px] py-0 h-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Star className="w-2.5 h-2.5 mr-1" />Primary
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground uppercase font-mono">{resume.fileType}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(resume.createdAt)}
            </span>
          </div>
        </div>

        <ChevronRight className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isSelected && "rotate-90 text-violet-600"
        )} />
      </div>

      {/* Stats */}
      {(skillCount > 0 || expCount > 0) && (
        <div className="mt-3 flex items-center gap-3">
          {resume.parsedAt && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />Analyzed
            </span>
          )}
          {skillCount > 0 && (
            <span className="text-xs text-muted-foreground">{skillCount} skills</span>
          )}
          {expCount > 0 && (
            <span className="text-xs text-muted-foreground">{expCount} positions</span>
          )}
        </div>
      )}

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Delete resume"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export { Button };
