"use client";

import { Edit3, Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import API_URL from "@/config";
import { cn } from "@/lib/utils";

export default function DiagramStep({
  docId,
  diagramId,
  savedDiagram,
  isLoadingDiagram,
  onDiagramNavigation,
  onGenerateExplanation,
  isGeneratingExplanation,
  diagramExplanationError,
  disabled = false,
}) {
  return (
    <section className="space-y-8">
      <div className="fv-doc-panel space-y-4 shadow-inner dark:border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="fv-doc-subsection-title text-base sm:text-lg">Diagram workspace</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              DocId: {docId || "N/A"} | Diagram: {diagramId || "None"}
            </p>
          </div>

          {isLoadingDiagram ? (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading diagram...
            </span>
          ) : (
            <Button
              type="button"
              variant={savedDiagram?.image ? "outline" : "secondary"}
              disabled={disabled}
              onClick={onDiagramNavigation}
              className="gap-2 rounded-xl shadow-fv-soft"
            >
              {savedDiagram?.image ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {savedDiagram?.image ? "Edit Diagram" : "Create Diagram"}
            </Button>
          )}
        </div>

        {savedDiagram?.image && !isLoadingDiagram && (
          <div className="relative mt-6 overflow-hidden rounded-xl border border-border/80 bg-muted/40 p-2 dark:border-white/10">
            <img
              src={`${API_URL}/${savedDiagram.image}`}
              alt="diagram preview"
              className="max-h-80 w-full rounded-lg object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {savedDiagram && !isLoadingDiagram && (
          <div className="mt-6 rounded-2xl border border-border/80 bg-card/80 p-5 dark:border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="fv-doc-subsection-title text-sm sm:text-base">AI explanation</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Generate a short description for this diagram.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                disabled={disabled || !diagramId || isGeneratingExplanation}
                onClick={onGenerateExplanation}
                className="gap-2 rounded-xl"
              >
                {isGeneratingExplanation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGeneratingExplanation ? "Generating..." : "Generate Explanation"}
              </Button>
            </div>

            {diagramExplanationError && <p className="mt-4 text-sm text-destructive">{diagramExplanationError}</p>}

            <div
              className={cn(
                "mt-4 rounded-xl border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-foreground",
                "dark:border-white/10 dark:bg-background/40",
              )}
            >
              {savedDiagram?.explanation ? savedDiagram.explanation : "No explanation generated yet."}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
