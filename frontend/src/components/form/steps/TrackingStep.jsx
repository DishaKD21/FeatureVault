"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiInput from "@/modules/docform/MultiInput";

export default function TrackingStep({ trackingList, addTracking, removeTracking, handleTrackingChange, disabled = false }) {
  return (
    <section className="space-y-6">
      {trackingList.map((item, index) => (
        <div key={index} className="fv-doc-panel relative space-y-5 dark:border-white/10">
          <h3 className="fv-doc-subsection-title pr-12 text-base sm:text-lg">User story {index + 1}</h3>
          <div className="absolute right-4 top-4">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => removeTracking?.(index)}
              disabled={disabled || trackingList.length <= 1}
              title={trackingList.length <= 1 ? "At least one user story required" : "Remove this user story"}
              className="opacity-90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="fv-doc-field-label block text-foreground">User Story Number</label>
              <Input
                className="mt-2 rounded-xl border-border/80 bg-background/55 dark:bg-card/35"
                disabled={disabled}
                value={item.userStoryNumber}
                onChange={(e) => handleTrackingChange(index, "userStoryNumber", e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium text-foreground">User Story Link</label>
              <Input
                className="mt-2 rounded-xl border-border/80 bg-background/55 dark:bg-card/35"
                disabled={disabled}
                value={item.userStoryLink}
                onChange={(e) => handleTrackingChange(index, "userStoryLink", e.target.value)}
              />
            </div>
          </div>

          <MultiInput label="PR Links" value={item.prLinks} onChange={(val) => handleTrackingChange(index, "prLinks", val)} />

          <div>
            <label className="fv-doc-field-label block text-foreground">Code Description</label>
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-xl border border-border/80 bg-background/55 p-3 text-foreground shadow-inner outline-none transition-colors focus-visible:border-primary/50 dark:bg-card/35"
              disabled={disabled}
              value={item.codeDescription}
              onChange={(e) => handleTrackingChange(index, "codeDescription", e.target.value)}
            />
          </div>

          <MultiInput label="Pipeline Build Links" value={item.pipelineBuildLinks} onChange={(val) => handleTrackingChange(index, "pipelineBuildLinks", val)} />
          <MultiInput label="Environment Deploy Links" value={item.environmentDeployLinks} onChange={(val) => handleTrackingChange(index, "environmentDeployLinks", val)} />
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addTracking} disabled={disabled} className="gap-2 rounded-xl border-border/80 hover:border-primary/35">
        <Plus className="h-4 w-4" />
        Add Another User Story
      </Button>
    </section>
  );
}
