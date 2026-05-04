"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiInput from "@/modules/docform/MultiInput";

export default function TrackingStep({ trackingList, addTracking, handleTrackingChange, disabled = false }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Tracking & Release</h2>
        <p className="mt-1 text-sm text-gray-500">Attach story, PR, build, and deployment evidence.</p>
      </div>

      {trackingList.map((item, index) => (
        <div key={index} className="space-y-4 rounded-lg border border-gray-200 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-medium">User Story Number</label>
              <Input
                className="mt-2"
                disabled={disabled}
                value={item.userStoryNumber}
                onChange={(e) => handleTrackingChange(index, "userStoryNumber", e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium">User Story Link</label>
              <Input
                className="mt-2"
                disabled={disabled}
                value={item.userStoryLink}
                onChange={(e) => handleTrackingChange(index, "userStoryLink", e.target.value)}
              />
            </div>
          </div>

          <MultiInput label="PR Links" value={item.prLinks} onChange={(val) => handleTrackingChange(index, "prLinks", val)} />

          <div>
            <label className="font-medium">Code Description</label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border p-3"
              disabled={disabled}
              value={item.codeDescription}
              onChange={(e) => handleTrackingChange(index, "codeDescription", e.target.value)}
            />
          </div>

          <MultiInput label="Pipeline Build Links" value={item.pipelineBuildLinks} onChange={(val) => handleTrackingChange(index, "pipelineBuildLinks", val)} />
          <MultiInput label="Environment Deploy Links" value={item.environmentDeployLinks} onChange={(val) => handleTrackingChange(index, "environmentDeployLinks", val)} />
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addTracking} disabled={disabled} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Another User Story
      </Button>
    </section>
  );
}
