"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <span className={`inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="w-8 h-px bg-foreground/30" />
          Get Started Today
        </span>

        <h2 className={`text-5xl lg:text-8xl font-display tracking-tight mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Your career,
          <br />
          <span className="text-muted-foreground">elevated.</span>
        </h2>

        <p className={`text-xl text-muted-foreground max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Join professionals who use ResuMate to analyze skills, match with jobs, and get AI-powered career guidance — for free.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-10 h-14 text-base rounded-full group">
            <Link href="/register">
              Start for free
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-foreground/20">
            <Link href="/login">Sign in to dashboard</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">No credit card required · Free forever plan available</p>
      </div>
    </section>
  );
}
