"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Search, MessageSquare, Wand2, Upload, TrendingUp, Award, Clock, ChevronRight, Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useResume } from "@/hooks/useResume";
import { StatCard } from "@/components/dashboard/StatCard";
import { SkillRadarChart } from "@/components/charts/SkillRadarChart";
import { ResumeUploadForm } from "@/components/resume/ResumeUploadForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeTime } from "@/lib/utils/formatters";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { resumes, currentResume, isUploading, fetchResumes, uploadResume } = useResume(token);
  const [jobMatchCount, setJobMatchCount] = useState(0);
  const [radarData, setRadarData] = useState<Array<{ category: string; count: number; avgProficiency: number }>>([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (token) {
      fetchResumes();
      fetchJobMatchCount();
    }
  }, [token]); // eslint-disable-line

  useEffect(() => {
    if (currentResume?.extractedData?.skills?.length) {
      buildRadarData();
    }
  }, [currentResume]); // eslint-disable-line

  const fetchJobMatchCount = async () => {
    try {
      const res = await fetch("/api/jobs/matches", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setJobMatchCount(data.matches?.length || 0);
    } catch {/* silent */}
  };

  const buildRadarData = () => {
    const skills = currentResume?.extractedData?.skills || [];
    const byCategory: Record<string, { count: number; totalScore: number }> = {};
    const profScore: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

    skills.forEach((s: { category: string; proficiency: string }) => {
      const cat = s.category || "Other";
      if (!byCategory[cat]) byCategory[cat] = { count: 0, totalScore: 0 };
      byCategory[cat].count++;
      byCategory[cat].totalScore += profScore[s.proficiency] || 50;
    });

    setRadarData(
      Object.entries(byCategory).map(([category, data]) => ({
        category,
        count: data.count,
        avgProficiency: Math.round(data.totalScore / data.count),
      }))
    );
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadResume(file);
      setShowUpload(false);
      toast.success("Resume uploaded and analyzed successfully!");
      await fetchResumes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const skillCount = currentResume?.extractedData?.skills?.length || 0;
  const completionScore = Math.min(
    100,
    (resumes.length > 0 ? 25 : 0) +
    (skillCount > 0 ? 25 : 0) +
    (jobMatchCount > 0 ? 25 : 0) +
    (user?.bio ? 15 : 0) +
    (user?.location ? 10 : 0)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your career intelligence overview.
          </p>
        </div>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Resume
        </Button>
      </div>

      {/* Upload Form (toggle) */}
      {showUpload && (
        <div className="bg-background border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-violet-600" />
            Upload Your Resume
          </h2>
          <ResumeUploadForm onUpload={handleUpload} isUploading={isUploading} />
        </div>
      )}

      {/* No resume CTA */}
      {resumes.length === 0 && !showUpload && (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-display font-bold mb-2">Get Started with ResuMate</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upload your resume to unlock AI-powered skill analysis, job matching, and personalized career advice.
          </p>
          <Button onClick={() => setShowUpload(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
            Upload Your Resume
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Profile Completion"
          value={`${completionScore}%`}
          subtitle="Keep improving!"
          icon={<Award className="w-5 h-5" />}
          color="violet"
          trend={{ value: completionScore > 50 ? 12 : 0, label: "vs last month" }}
        />
        <StatCard
          title="Skills Extracted"
          value={skillCount}
          subtitle={currentResume?.fileName ? `From ${currentResume.fileName}` : "Upload a resume"}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Job Matches"
          value={jobMatchCount}
          subtitle="Saved analyses"
          icon={<Search className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Resumes"
          value={resumes.length}
          subtitle={resumes.length > 0 ? `Last updated ${formatRelativeTime(resumes[0]?.createdAt)}` : "None uploaded yet"}
          icon={<FileText className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Radar Chart */}
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              Skill Distribution
            </h2>
            {currentResume && (
              <Badge variant="outline" className="text-xs">
                {currentResume.fileName}
              </Badge>
            )}
          </div>
          <SkillRadarChart data={radarData} />
          {skillCount > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {skillCount} skills across {radarData.length} categories
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/analyzer", icon: FileText, label: "Analyze Skills", desc: "View skill breakdown", color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
                { href: "/job-matcher", icon: Search, label: "Match a Job", desc: "Paste job description", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
                { href: "/chat", icon: MessageSquare, label: "AI Assistant", desc: "Get career advice", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
                { href: "/resume-optimizer", icon: Wand2, label: "Optimize Resume", desc: "AI-powered improvements", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Resume */}
          {resumes.length > 0 && (
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Recent Resumes
              </h2>
              <div className="space-y-2">
                {resumes.slice(0, 3).map((resume) => (
                  <div key={resume._id} className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    <span className="truncate flex-1">{resume.fileName}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(resume.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
