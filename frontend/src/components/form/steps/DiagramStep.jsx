"use client";

import { Edit3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import API_URL from "@/config";

export default function DiagramStep({
  docId,
  diagramId,
  savedDiagram,
  isLoadingDiagram,
  onDiagramNavigation,
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
      </div>
    </section>
  );
}
