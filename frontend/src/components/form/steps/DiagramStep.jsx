"use client";

import { Edit3, Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import API_URL from "@/config";

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
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Design Diagram</h2>
        <p className="mt-1 text-sm text-gray-500">Create or attach the visual design for this feature.</p>
      </div>

      <div className="rounded-lg border border-gray-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-gray-900">Diagram workspace</p>
            <p className="mt-1 text-xs text-gray-500">
              DocId: {docId || "N/A"} | Diagram: {diagramId || "None"}
            </p>
          </div>

          {isLoadingDiagram ? (
            <span className="text-sm text-gray-500">Loading diagram...</span>
          ) : (
            <Button
              type="button"
              variant={savedDiagram?.image ? "outline" : "secondary"}
              disabled={disabled}
              onClick={onDiagramNavigation}
              className="gap-2"
            >
              {savedDiagram?.image ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {savedDiagram?.image ? "Edit Diagram" : "Create Diagram"}
            </Button>
          )}
        </div>

        {savedDiagram?.image && !isLoadingDiagram && (
          <div className="relative mt-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
            <img
              src={`${API_URL}/${savedDiagram.image}`}
              alt="diagram preview"
              className="max-h-80 w-full rounded-md object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {savedDiagram && !isLoadingDiagram && (
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">AI explanation</p>
                <p className="text-xs text-gray-500">Generate a short description for this diagram.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                disabled={disabled || !diagramId || isGeneratingExplanation}
                onClick={onGenerateExplanation}
                className="gap-2"
              >
                {isGeneratingExplanation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGeneratingExplanation ? "Generating..." : "Generate Explanation"}
              </Button>
            </div>

            {diagramExplanationError && (
              <p className="mt-3 text-sm text-red-600">{diagramExplanationError}</p>
            )}

            <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              {savedDiagram?.explanation
                ? savedDiagram.explanation
                : "No explanation generated yet."}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
