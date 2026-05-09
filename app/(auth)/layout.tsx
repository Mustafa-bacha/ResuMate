"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Concentric circle background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 40}px`,
                height: `${(i + 1) * 40}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <Link href="/" className="flex items-center gap-3 z-10 relative">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl text-white">ResuMate</span>
        </Link>

        <div className="z-10 relative space-y-6">
          <h1 className="text-4xl font-display text-white leading-tight">
            AI-Powered Career Intelligence
          </h1>
          <p className="text-violet-200 text-lg leading-relaxed">
            Upload your resume, discover skill gaps, match with jobs, and get personalized AI career advice — all in one platform.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { value: "95%", label: "Parse accuracy" },
              { value: "<3s", label: "Analysis speed" },
              { value: "10k+", label: "Professionals" },
              { value: "Free", label: "Get started" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                <p className="text-violet-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-violet-300 text-sm z-10 relative">
          &copy; {new Date().getFullYear()} ResuMate. Resume Elevated.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-background">
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl">ResuMate</span>
        </div>
        {children}
      </div>
    </div>
  );
}
