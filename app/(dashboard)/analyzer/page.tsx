"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useResume } from "@/hooks/useResume";
import { SkillRadarChart } from "@/components/charts/SkillRadarChart";
import { SkillBarChart } from "@/components/charts/SkillBarChart";
import { ResumeUploadForm } from "@/components/resume/ResumeUploadForm";
import { ResumeCard } from "@/components/resume/ResumeCard";
import { SkillBadge } from "@/components/jobs/SkillBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, RefreshCw, Briefcase, GraduationCap, Award, TrendingUp, FileText } from "lucide-react";
import { generateColor } from "@/lib/utils/formatters";
import { toast } from "sonner";

export default function AnalyzerPage() {
  const { token } = useAuth();
  const { resumes, currentResume, isLoading, isUploading, fetchResumes, uploadResume, deleteResume, parseResume, setCurrentResume } = useResume(token);
  const [isParsing, setIsParsing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => { if (token) fetchResumes(); }, [token]); // eslint-disable-line

  const radarData = (() => {
    const skills = currentResume?.extractedData?.skills || [];
    const byCategory: Record<string, { count: number; totalScore: number }> = {};
    const profScore: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
    skills.forEach((s: { category: string; proficiency: string }) => {
      const cat = s.category || "Other";
      if (!byCategory[cat]) byCategory[cat] = { count: 0, totalScore: 0 };
      byCategory[cat].count++;
      byCategory[cat].totalScore += profScore[s.proficiency] || 50;
    });
    return Object.entries(byCategory).map(([category, data]) => ({
      category,
      count: data.count,
      avgProficiency: Math.round(data.totalScore / data.count),
    }));
  })();

  const topSkillsData = (currentResume?.extractedData?.skills || [])
    .slice(0, 8)
    .map((s: { name: string; proficiency: string }) => ({
      name: s.name,
      value: { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 }[s.proficiency] || 50,
      color: generateColor(s.name),
    }));

  const handleUpload = async (file: File) => {
    try {
      await uploadResume(file);
      setShowUpload(false);
      toast.success("Resume uploaded!");
      await fetchResumes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleParse = async () => {
    if (!currentResume) return;
    setIsParsing(true);
    try {
      const updated = await parseResume(currentResume._id);
      const skillCount = updated?.extractedData?.skills?.length || 0;
      toast.success(`Resume re-analyzed! Found ${skillCount} skills.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to re-analyze resume';
      toast.error(msg);
    } finally {
      setIsParsing(false);
    }
  };

  if (isLoading) return <PageLoader label="Loading your skills…" />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Skill Analyzer</h1>
          <p className="text-muted-foreground mt-1">Understand your skills and identify growth areas</p>
        </div>
        <div className="flex gap-2">
          {currentResume && (
            <Button variant="outline" size="sm" onClick={handleParse} disabled={isParsing} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isParsing ? "animate-spin" : ""}`} />
              Re-analyze
            </Button>
          )}
          <Button size="sm" onClick={() => setShowUpload(!showUpload)} className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Upload className="w-4 h-4" />Upload Resume
          </Button>
        </div>
      </div>

      {/* Upload */}
      {showUpload && (
        <div className="bg-background border border-border rounded-xl p-6">
          <ResumeUploadForm onUpload={handleUpload} isUploading={isUploading} />
        </div>
      )}

      {/* Resume Selector */}
      {resumes.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              isSelected={currentResume?._id === resume._id}
              onSelect={() => setCurrentResume(resume)}
              onDelete={() => { deleteResume(resume._id); toast.success("Resume deleted"); }}
            />
          ))}
        </div>
      )}

      {!currentResume ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-semibold mb-2">No Resume Uploaded</h2>
          <p className="text-sm text-muted-foreground mb-4">Upload a resume to see your skill analysis</p>
          <Button onClick={() => setShowUpload(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
            Upload Resume
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certifications">Certs</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-600" />Skill Distribution
                </h3>
                <SkillRadarChart data={radarData} />
              </div>

              {/* Bar Chart */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Top Skills by Proficiency</h3>
                <SkillBarChart data={topSkillsData} height={250} />
              </div>
            </div>

            {/* All Skills */}
            <div className="mt-6 bg-background border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">
                All Skills
                <Badge variant="secondary" className="ml-2">{currentResume.extractedData?.skills?.length || 0}</Badge>
              </h3>
              {radarData.map((category) => (
                <div key={category.category} className="mb-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {category.category} ({category.count})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(currentResume.extractedData?.skills || [])
                      .filter((s: { category: string }) => s.category === category.category)
                      .map((s: { name: string; proficiency: string }) => (
                        <SkillBadge key={s.name} name={s.name} showIcon={false} className="font-mono text-xs" />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <div className="space-y-4">
              {(currentResume.extractedData?.experience || []).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No experience data extracted</p>
              ) : (
                (currentResume.extractedData?.experience as Array<{jobTitle: string; company: string; startDate?: string; endDate?: string; duration?: string; description?: string; responsibilities?: string[]}>).map((exp, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{exp.jobTitle}</h3>
                        <p className="text-sm text-violet-600">{exp.company}</p>
                        {(exp.startDate || exp.duration) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ""} {exp.duration ? `(${exp.duration})` : ""}
                          </p>
                        )}
                        {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.responsibilities.slice(0, 4).map((r: string, j: number) => (
                              <li key={j} className="text-sm text-muted-foreground flex gap-2">
                                <span className="text-violet-500 font-bold flex-shrink-0">·</span>{r}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <div className="space-y-4">
              {(currentResume.extractedData?.education as Array<{institution: string; degree: string; field?: string; graduationDate?: string; gpa?: string}>)?.map((edu, i) => (
                <div key={i} className="bg-background border border-border rounded-xl p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-sm text-blue-600">{edu.institution}</p>
                    {edu.graduationDate && <p className="text-xs text-muted-foreground mt-0.5">{edu.graduationDate}</p>}
                    {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <div className="space-y-4">
              {(currentResume.extractedData as {certifications?: Array<{name: string; issuingOrganization?: string; issueDate?: string}>})?.certifications?.map((cert, i) => (
                <div key={i} className="bg-background border border-border rounded-xl p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    {cert.issuingOrganization && <p className="text-sm text-amber-600">{cert.issuingOrganization}</p>}
                    {cert.issueDate && <p className="text-xs text-muted-foreground">{cert.issueDate}</p>}
                  </div>
                </div>
              ))}
              {!(currentResume.extractedData as {certifications?: Array<unknown>})?.certifications?.length && (
                <p className="text-muted-foreground text-center py-8">No certifications found in resume</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
