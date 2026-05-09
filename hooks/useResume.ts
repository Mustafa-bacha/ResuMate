"use client";

import { useState, useCallback } from "react";

interface Resume {
  _id: string;
  fileName: string;
  fileType: string;
  isPrimary: boolean;
  parsedAt?: string;
  extractedData: {
    summary?: string;
    experience: unknown[];
    education: unknown[];
    skills: Array<{ name: string; category: string; proficiency: string }>;
    certifications: unknown[];
  };
  createdAt: string;
}

export function useResume(token: string | null) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchResumes = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/resume/list", { headers: authHeaders });
      const data = await res.json();
      if (res.ok) {
        setResumes(data.resumes);
        if (data.resumes.length > 0) {
          const primary = data.resumes.find((r: Resume) => r.isPrimary) || data.resumes[0];
          setCurrentResume(primary);
        }
      }
    } catch (err) {
      setError("Failed to load resumes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const uploadResume = useCallback(async (file: File) => {
    if (!token) return null;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResumes((prev) => [data.resume, ...prev]);
      setCurrentResume(data.resume);
      return data.resume;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const deleteResume = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (res.ok) {
        setResumes((prev) => prev.filter((r) => r._id !== id));
        if (currentResume?._id === id) setCurrentResume(null);
      }
    } catch (err) {
      console.error(err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentResume]);

  const parseResume = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/resume/${id}/parse`, {
        method: "POST",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse resume');
      setResumes((prev) => prev.map((r) => (r._id === id ? data.resume : r)));
      if (currentResume?._id === id) setCurrentResume(data.resume);
      return data.resume;
    } catch (err) {
      console.error(err);
      throw err; // re-throw so callers can show correct toast
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentResume]);

  return {
    resumes,
    currentResume,
    setCurrentResume,
    isLoading,
    isUploading,
    error,
    fetchResumes,
    uploadResume,
    deleteResume,
    parseResume,
  };
}
