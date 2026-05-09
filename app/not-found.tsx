import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-6">
        <Zap className="w-10 h-10 text-violet-600" />
      </div>

      <h1 className="text-8xl font-display font-bold text-violet-600 mb-4">404</h1>
      <h2 className="text-2xl font-display font-bold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Looks like this page doesn&apos;t exist. It may have been moved or deleted.
        Let&apos;s get you back on track.
      </p>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/"><ArrowLeft className="w-4 h-4" />Go Home</Link>
        </Button>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
