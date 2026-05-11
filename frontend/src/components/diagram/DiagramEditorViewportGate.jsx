"use client";

import { useEffect, useState } from "react";
import DiagramEditor from "@/modules/diagrameditor/DiagramEditor";
import { mediaMinWide } from "@/lib/viewportBreakpoints";

/**
 * Diagram editor is desktop-first: below 800px width show a frosted overlay and message.
 * Editor is not mounted on narrow viewports (performance + clear UX).
 */
export default function DiagramEditorViewportGate() {
  const [eligible, setEligible] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia(mediaMinWide);
    const sync = () => setEligible(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (eligible === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Preparing editor…</p>
        </div>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
        {/* Layered blur + wash so the whole viewport feels blocked */}
        <div className="pointer-events-none absolute inset-0 bg-background/55 backdrop-blur-xl backdrop-saturate-150" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,color-mix(in_oklch,var(--primary),transparent_82%),transparent_60%)] opacity-80"
          aria-hidden
        />
        <div className="relative z-10 max-w-md rounded-2xl border border-border bg-card/90 p-8 shadow-fv-panel backdrop-blur-md">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Desktop recommended</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Please open the diagram editor on a desktop or wider window (at least 800px) for a better experience.
          </p>
        </div>
      </div>
    );
  }

  return <DiagramEditor />;
}
