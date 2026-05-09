"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Skill Analyzer", href: "/analyzer" },
    { label: "Job Matcher", href: "/job-matcher" },
    { label: "Resume Optimizer", href: "/resume-optimizer" },
    { label: "AI Assistant", href: "/chat" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function FooterSection() {
  return (
    <footer className="border-t border-foreground/10 py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl">ResuMate</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered career & skill intelligence platform. Resume Elevated.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Powered by Groq · Llama 3 · MongoDB
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ResuMate. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js · Tailwind CSS · shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
