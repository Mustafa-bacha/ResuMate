"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { JobMatchCard } from "@/components/jobs/JobMatchCard";
import { MatchScoreCircle } from "@/components/charts/MatchScoreCircle";
import { SkillBadge } from "@/components/jobs/SkillBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, History, Trash2, AlertCircle, Zap } from "lucide-react";
import { toast } from "sonner";

interface JobMatch {
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
}

export default function JobMatcherPage() {
  const { token } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<JobMatch | null>(null);
  const [savedMatches, setSavedMatches] = useState<JobMatch[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) fetchSavedMatches();
  }, [token]); // eslint-disable-line

  const fetchSavedMatches = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/jobs/matches", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setSavedMatches(data.matches);
    } catch { /* silent */ }
    finally { setIsLoadingHistory(false); }
  };

  const handleAnalyze = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError("Please enter both job title and description");
      return;
    }
    setError("");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/jobs/match", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobTitle, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setCurrentMatch(data.jobMatch);
      setSavedMatches((prev) => [data.jobMatch, ...prev]);
      toast.success("Job analysis complete!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/jobs/matches/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setSavedMatches((prev) => prev.filter((m) => m._id !== id));
      if (currentMatch?._id === id) setCurrentMatch(null);
      toast.success("Match deleted");
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">Job Matcher</h1>
        <p className="text-muted-foreground mt-1">Analyze how well your resume matches any job description</p>
      </div>

      <Tabs defaultValue="analyze">
        <TabsList>
          <TabsTrigger value="analyze" className="gap-2">
            <Search className="w-4 h-4" />Analyze New Job
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />Saved Matches ({savedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-5">
              <div className="bg-background border border-border rounded-xl p-6 space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600" />
                  Job Details
                </h2>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    placeholder="e.g. Senior React Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="job-desc">Job Description</Label>
                  <Textarea
                    id="job-desc"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {jobDescription.length} characters · Paste the complete job posting for best results
                  </p>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jobTitle.trim() || !jobDescription.trim()}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing with AI…</>
                  ) : (
                    <><Search className="w-4 h-4 mr-2" />Analyze Match</>
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            <div>
              {currentMatch ? (
                <div className="space-y-4">
                  {/* Score */}
                  <div className="bg-background border border-border rounded-xl p-6 text-center">
                    <h2 className="font-semibold mb-4">{currentMatch.jobTitle}</h2>
                    <MatchScoreCircle score={currentMatch.analysis.matchScore} size="lg" />
                  </div>
                  <JobMatchCard match={currentMatch} defaultExpanded onDelete={() => handleDelete(currentMatch._id)} />
                </div>
              ) : (
                <div className="bg-background border border-dashed border-border rounded-xl p-16 text-center h-full flex flex-col items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Enter a job title and paste a job description to see how well your resume matches.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {isLoadingHistory ? (
            <PageLoader label="Loading matches…" />
          ) : savedMatches.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No saved matches yet. Analyze a job to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">{savedMatches.length} saved analyses</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 gap-1.5"
                  onClick={async () => {
                    // Delete all one by one (or implement bulk delete)
                    for (const m of savedMatches) await handleDelete(m._id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />Clear All
                </Button>
              </div>
              {savedMatches.map((match) => (
                <JobMatchCard key={match._id} match={match} onDelete={() => handleDelete(match._id)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Skill summary from current match */}
      {currentMatch && currentMatch.analysis.matchedSkills && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm text-emerald-600 mb-3">
              ✓ Matched Skills ({currentMatch.analysis.matchedSkills.filter(s => s.level === "match").length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentMatch.analysis.matchedSkills.filter(s => s.level === "match").map((s) => (
                <SkillBadge key={s.skill} name={s.skill} level="match" />
              ))}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm text-red-600 mb-3">
              ✗ Missing Skills ({currentMatch.analysis.missingSkills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentMatch.analysis.missingSkills?.map((s) => (
                <SkillBadge key={s.skill} name={s.skill} level="missing" priority={s.priority} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
