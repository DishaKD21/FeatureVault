"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, FileText, Share2, Workflow } from "lucide-react";
import { isAuthenticated, saveRedirectPath } from "@/components/auth/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Hero = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const handleCreateDocumentation = () => {
    setRedirecting(true);

    if (!isAuthenticated()) {
      saveRedirectPath("/create-doc");
      router.push("/login");
      return;
    }

    router.push("/create-doc");
  };

  return (
    <section className="fv-home-hero-wrap border-b border-border/80 bg-background px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16 md:pt-20">
      <div className="fv-home-hero-inner mx-auto flex max-w-4xl flex-col items-center text-center">
        <p
          className={cn(
            "mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/80 px-4 py-1.5 text-xs font-medium text-primary shadow-fv-soft",
            "backdrop-blur-sm supports-[backdrop-filter]:bg-card/60",
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Structured docs &amp; diagrams — one workspace
        </p>

        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl md:text-5xl md:leading-[1.1]">
          Create <span className="text-primary">smooth, fast</span> feature documentation
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Quickly build structured feature documentation, create system diagrams with our built-in design editor, and
          organize technical details in one place. Export ready-to-use documentation instantly.
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button
            type="button"
            size="lg"
            disabled={redirecting}
            onClick={handleCreateDocumentation}
            className="h-11 min-w-[200px] rounded-xl px-8 text-sm font-medium shadow-fv-soft transition hover:shadow-fv-panel"
          >
            {redirecting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Create documentation"
            )}
          </Button>
          <Button type="button" variant="outline" size="lg" className="h-11 rounded-xl border-border/80 bg-card/50" asChild>
            <Link href="/#features">Explore features</Link>
          </Button>
        </div>

        <div className="relative mt-14 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card/90 p-8 shadow-fv-panel backdrop-blur-sm dark:bg-card/70 sm:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-40 blur-3xl"
            style={{ background: "color-mix(in oklch, var(--primary), transparent 75%)" }}
            aria-hidden
          />
          <div className="relative flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-primary/90 sm:gap-12">
              <FileText className="size-10 sm:size-12" strokeWidth={1.25} aria-hidden />
              <Workflow className="size-10 sm:size-12" strokeWidth={1.25} aria-hidden />
              <Share2 className="size-10 sm:size-12" strokeWidth={1.25} aria-hidden />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Documentation, diagrams, and exports — connected in a single flow so your team stays aligned from discovery
              to release.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
