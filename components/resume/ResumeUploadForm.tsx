"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploadFormProps {
  onUpload: (file: File) => Promise<unknown>;
  isUploading?: boolean;
  className?: string;
}

export function ResumeUploadForm({ onUpload, isUploading, className }: ResumeUploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, []); // eslint-disable-line

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  }, []); // eslint-disable-line

  const validateAndSet = (file: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(file.type)) {
      setErrorMessage("Only PDF, DOCX, and TXT files are allowed");
      setUploadStatus("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be under 5MB");
      setUploadStatus("error");
      return;
    }
    setSelectedFile(file);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setUploadStatus("success");
      setSelectedFile(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setErrorMessage(message);
      setUploadStatus("error");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20 scale-[1.02]"
            : "border-border hover:border-violet-400 hover:bg-muted/50",
          uploadStatus === "success" && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
          uploadStatus === "error" && "border-red-400 bg-red-50 dark:bg-red-950/20"
        )}
        onClick={() => document.getElementById("resume-file-input")?.click()}
      >
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {uploadStatus === "success" ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="w-12 h-12 text-red-500" />
          ) : (
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300",
              isDragging ? "bg-violet-100 dark:bg-violet-900/50 scale-110" : "bg-muted"
            )}>
              <Upload className={cn("w-7 h-7", isDragging ? "text-violet-600" : "text-muted-foreground")} />
            </div>
          )}

          {uploadStatus === "success" ? (
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Upload successful!</p>
              <p className="text-sm text-muted-foreground">Your resume is being analyzed</p>
            </div>
          ) : uploadStatus === "error" ? (
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">Upload failed</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          ) : selectedFile ? (
            <div>
              <p className="font-semibold">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB · Ready to upload
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold">Drop your resume here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">PDF, DOCX, or TXT · max 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* File info & Actions */}
      {selectedFile && uploadStatus !== "success" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 p-3 bg-muted rounded-lg">
            <FileText className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span className="text-sm truncate">{selectedFile.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setUploadStatus("idle"); }}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isUploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</>
            ) : "Upload & Analyze"}
          </Button>
        </div>
      )}
    </div>
  );
}
