"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileStack, GitBranch, Download, Loader2 } from "lucide-react";
import { isAuthenticated, saveRedirectPath } from "@/components/auth/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const blocks = [
  {
    title: "Create structured documentation",
    body: "Quickly generate structured feature documentation by filling simple details like feature name, description, inputs, outputs, and workflow.",
    icon: FileStack,
  },
  {
    title: "Create design diagrams",
    body: "Use the built-in diagram editor to design system workflows and feature flows. Drag and connect elements easily.",
    icon: GitBranch,
  },
  {
    title: "Export & share documentation",
    body: "Export your documentation as PDF or DOC files and share it with your team or stakeholders instantly.",
    icon: Download,
  },
];

const Feature = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const handleStartCreating = () => {
    setRedirecting(true);
    if (!isAuthenticated()) {
      saveRedirectPath("/create-doc");
      router.push("/login");
      return;
    }
    router.push("/create-doc");
  };

  return (
    <section id="features" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">Features</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance text-center text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          What you can do here
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground sm:text-base">
          FeatureVault helps developers create structured documentation and system diagrams in a simple, organized way.
        </p>

        <div className="mt-16 space-y-16 md:space-y-24">
          {blocks.map((item, i) => {
            const Icon = item.icon;
            const flip = i % 2 === 1;
            return (
              <div key={item.title} className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
                <div className={cn("w-full max-w-lg text-left", flip && "md:order-2")}>
                  <div className="mb-4 inline-flex rounded-xl border border-border bg-card/80 p-3 text-primary shadow-fv-soft transition hover:border-primary/25">
                    <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.body}</p>
                </div>

                <div
                  className={cn(
                    "relative flex aspect-[4/3] w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/25 shadow-inner transition hover:border-primary/20 dark:bg-card/40",
                    flip && "md:order-1",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-25"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 60% at 50% 80%, color-mix(in oklch, var(--primary), transparent 82%), transparent 70%)",
                    }}
                    aria-hidden
                  />
                  <Icon className="relative size-20 text-primary/35 sm:size-24" strokeWidth={1} aria-hidden />
                </div>
              </div>
            );
          })}
        </div>

        <div className="fv-home-section-muted mt-24 rounded-2xl border border-border px-6 py-12 text-center shadow-fv-soft sm:mt-28 sm:px-10 sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Build better feature documentation</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            FeatureVault helps developers create structured documentation and system diagrams in a simple and organized way.
          </p>
          <Button
            type="button"
            size="lg"
            disabled={redirecting}
            onClick={handleStartCreating}
            className="mt-8 h-11 min-w-[240px] rounded-xl px-8 text-sm font-medium shadow-fv-soft"
          >
            {redirecting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Start creating documentation"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Feature;
