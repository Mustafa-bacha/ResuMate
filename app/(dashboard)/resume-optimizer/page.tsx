"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useResume } from "@/hooks/useResume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Wand2, Loader2, CheckCircle2, Copy, Check, FileText, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OptimizationResult {
  optimizedSummary: string;
  skillsToHighlight: string[];
  keywordsToAdd: string[];
  formattingTips: string[];
  overallScore: number;
  improvements: string[];
  experienceOptimizations: Array<{ originalTitle: string; suggestions: string[] }>;
}

export default function ResumeOptimizerPage() {
  const { token } = useAuth();
  const { currentResume, fetchResumes } = useResume(token);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => { if (token) fetchResumes(); }, [token]); // eslint-disable-line

  const handleOptimize = async () => {
    if (!currentResume) { toast.error("Please upload a resume first"); return; }
    if (!jobDescription.trim()) { setError("Please enter a job description"); return; }
    setError("");
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/jobs/match", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          jobTitle: jobTitle || "Target Position",
          jobDescription,
          resumeId: currentResume._id,
        }),
      });
      const matchData = await res.json();
      if (!res.ok) throw new Error(matchData.error || "Analysis failed");

      // Now call optimize
      const optRes = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: `Generate specific resume optimization suggestions for this job: "${jobTitle || 'Target Position'}". 
          Focus on: ATS keywords, summary rewrite, skills to highlight, and formatting improvements.
          Job description: ${jobDescription.slice(0, 1000)}`,
          resumeId: currentResume._id,
        }),
      });

      // Build a structured result from the job match data
      const match = matchData.jobMatch;
      setResult({
        optimizedSummary: `Experienced professional with proven expertise in ${match.analysis.matchedSkills?.slice(0, 3).map((s: {skill: string}) => s.skill).join(", ") || "relevant skills"}. Demonstrated ability to deliver results in fast-paced environments, with a track record of ${match.analysis.matchedSkills?.length || 0} matching skill areas for this ${jobTitle || "role"}.`,
        skillsToHighlight: match.analysis.matchedSkills?.filter((s: {level: string}) => s.level === "match").map((s: {skill: string}) => s.skill).slice(0, 8) || [],
        keywordsToAdd: match.analysis.missingSkills?.map((s: {skill: string}) => s.skill).slice(0, 6) || [],
        formattingTips: match.analysis.resumeOptimizations || [
          "Use bullet points for each role",
          "Start bullets with action verbs",
          "Quantify achievements with numbers",
          "Keep to 1-2 pages",
        ],
        overallScore: match.analysis.matchScore,
        improvements: match.analysis.keyRecommendations || [],
        experienceOptimizations: [],
      });
      toast.success("Resume optimization complete!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Optimization failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">Resume Optimizer</h1>
        <p className="text-muted-foreground mt-1">AI-powered resume improvements tailored for your target job</p>
      </div>

      {!currentResume && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Please upload a resume in the <a href="/analyzer" className="text-violet-600 underline">Skill Analyzer</a> first.</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-violet-600" />
              Target Job
            </h2>

            {/* Current resume indicator */}
            {currentResume && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="w-4 h-4 text-violet-600" />
                <span className="text-sm truncate">{currentResume.fileName}</span>
                <Badge variant="secondary" className="text-[10px] ml-auto">Active</Badge>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <Input
                placeholder="e.g. Senior Full Stack Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Job Description</Label>
              <Textarea
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="resize-none text-sm"
              />
            </div>

            <Button
              onClick={handleOptimize}
              disabled={isOptimizing || !currentResume}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11"
            >
              {isOptimizing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Optimizing with AI…</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Optimize Resume</>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Score */}
              <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Match Score</p>
                  <p className="text-3xl font-bold font-display text-violet-600">{result.overallScore}%</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>

              {/* Optimized Summary */}
              <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Optimized Summary</h3>
                  <button onClick={() => handleCopy(result.optimizedSummary, "summary")} className="text-muted-foreground hover:text-foreground">
                    {copiedSection === "summary" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.optimizedSummary}</p>
              </div>

              {/* Keywords to Add */}
              {result.keywordsToAdd.length > 0 && (
                <div className="bg-background border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />ATS Keywords to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordsToAdd.map((k) => (
                      <Badge key={k} variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/20">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to Highlight */}
              {result.skillsToHighlight.length > 0 && (
                <div className="bg-background border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3 text-emerald-600">Skills to Emphasize</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skillsToHighlight.map((s) => (
                      <Badge key={s} variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {result.improvements.length > 0 && (
                <div className="bg-background border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Key Improvements</h3>
                  <ul className="space-y-2">
                    {result.improvements.map((imp, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-violet-500 font-bold flex-shrink-0">→</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatting Tips */}
              {result.formattingTips.length > 0 && (
                <div className="bg-background border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Formatting Tips</h3>
                  <ul className="space-y-1.5">
                    {result.formattingTips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-background border border-dashed border-border rounded-xl p-16 text-center h-full flex flex-col items-center justify-center">
              <Wand2 className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">AI Optimization Ready</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Enter a job description and let AI optimize your resume with ATS keywords, improved summaries, and formatting tips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
