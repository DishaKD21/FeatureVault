"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FeatureStep({ register, setValue, watch, disabled = false }) {
  const featureStart = watch("feature.featureDescription.startTime");
  const featureEnd = watch("feature.featureDescription.endTime");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Feature Details</h2>
        <p className="mt-1 text-sm text-gray-500">Define the feature and implementation analysis.</p>
      </div>

      <div>
        <Label>Feature Name</Label>
        <Input
          placeholder="Enter feature name"
          disabled={disabled}
          {...register("feature.featureName", { required: "Feature name is required" })}
          className="mt-2 rounded-lg"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h3 className="font-medium text-gray-900">Feature Description</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Start Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className="mt-2 w-full justify-start">
                  {featureStart instanceof Date ? format(featureStart, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={featureStart}
                  onSelect={(date) => setValue("feature.featureDescription.startTime", date, { shouldValidate: true, shouldDirty: true })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className="mt-2 w-full justify-start">
                  {featureEnd instanceof Date ? format(featureEnd, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={featureEnd}
                  onSelect={(date) => setValue("feature.featureDescription.endTime", date, { shouldValidate: true, shouldDirty: true })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-5">
          <Label>Requirement Analysis</Label>
          <Textarea
            placeholder="Code-level planning, classes, logic..."
            disabled={disabled}
            {...register("feature.featureDescription.requirementAnalysis", { required: "Requirement analysis is required" })}
            className="mt-2 min-h-40 rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
