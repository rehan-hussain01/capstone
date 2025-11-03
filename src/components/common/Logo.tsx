import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-semibold", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <BookOpen className="h-5 w-5" />
      </div>
      <span className="font-headline font-bold text-foreground">LearnVerse</span>
    </Link>
  );
}
