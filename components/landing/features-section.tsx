"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Resume Upload & Parsing",
    description: "Drag-and-drop PDF or DOCX files. Our AI instantly extracts skills, experience, education, and certifications with over 95% accuracy.",
    visual: "deploy",
  },
  {
    number: "02",
    title: "AI Skill Gap Detection",
    description: "Visualize your skill distribution with interactive radar charts. Identify gaps, get proficiency assessments, and discover trending industry skills.",
    visual: "ai",
  },
  {
    number: "03",
    title: "Intelligent Job Matching",
    description: "Paste any job description and instantly get a match score, skill analysis, and personalized recommendations to improve your candidacy.",
    visual: "collab",
  },
  {
    number: "04",
    title: "AI Career Assistant",
    description: "Chat with a Llama 3-powered career coach that knows your resume. Get personalized interview prep, salary advice, and career strategy.",
    visual: "security",
  },
];

function ResumeVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="30" y="10" width="140" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="45" y={25 + i * 18} width={i === 0 ? 80 : 110 - i * 8} height="10" rx="2" fill="currentColor" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
          <animate attributeName="width" values={`${i === 0 ? 80 : 110 - i * 8};${i === 0 ? 110 : 110};${i === 0 ? 80 : 110 - i * 8}`} dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <circle cx="170" cy="20" r="8" fill="currentColor" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// Pre-compute node positions to fixed precision to avoid SSR/client float mismatch
const AI_NODES = [0, 1, 2, 3, 4, 5].map((i) => {
  const angle = i * 60 * (Math.PI / 180);
  const radius = 50;
  return {
    x2: parseFloat((100 + Math.cos(angle) * radius).toFixed(4)),
    y2: parseFloat((80 + Math.sin(angle) * radius).toFixed(4)),
    delay: `${i * 0.3}s`,
  };
});

function AIVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <circle cx="100" cy="80" r="12" fill="currentColor">
        <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
      </circle>
      {AI_NODES.map((node, i) => (
        <g key={i}>
          <line x1="100" y1="80" x2={node.x2} y2={node.y2} stroke="currentColor" strokeWidth="1" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin={node.delay} repeatCount="indefinite" />
          </line>
          <circle cx={node.x2} cy={node.y2} r="6" fill="none" stroke="currentColor" strokeWidth="2">
            <animate attributeName="r" values="6;8;6" dur="2s" begin={node.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <circle cx="100" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
        <animate attributeName="r" values="20;60" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function MatchVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <circle cx="100" cy="80" r="50" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <circle cx="100" cy="80" r="50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="314" strokeDashoffset="78">
        <animate attributeName="stroke-dashoffset" values="314;78;314" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="100" y="76" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">75%</text>
      <text x="100" y="94" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">MATCH SCORE</text>
    </svg>
  );
}

function ChatVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="20" y="20" width="120" height="40" rx="20" fill="currentColor" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2s" repeatCount="indefinite" />
      </rect>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30 + i * 20} y="34" width="12" height="12" rx="6" fill="currentColor" opacity="0.5">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <rect x="60" y="75" width="120" height="40" rx="20" fill="currentColor" opacity="0.3" />
      <rect x="70" y="88" width="90" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="70" y="100" width="60" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="20" y="125" width="100" height="25" rx="12" fill="currentColor" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="1.5s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  switch (type) {
    case "deploy": return <ResumeVisual />;
    case "ai": return <AIVisual />;
    case "collab": return <MatchVisual />;
    case "security": return <ChatVisual />;
    default: return <ResumeVisual />;
  }
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} className={`group relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-foreground/10">
        <div className="shrink-0">
          <span className="font-mono text-sm text-muted-foreground">{feature.number}</span>
        </div>
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">{feature.title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-48 h-40 text-foreground">
              <AnimatedVisual type={feature.visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Core Features
          </span>
          <h2 className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Everything you need.
            <br />
            <span className="text-muted-foreground">To land your dream job.</span>
          </h2>
        </div>
        <div>
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
