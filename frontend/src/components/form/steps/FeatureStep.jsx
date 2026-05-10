"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function FeatureStep({ register, setValue, watch, disabled = false }) {
  const featureStart = watch("feature.featureDescription.startTime");
  const featureEnd = watch("feature.featureDescription.endTime");

  const dateTriggerClass = cn(
    "mt-2.5 h-11 w-full justify-between rounded-xl border-border/80 bg-background/60 font-normal text-foreground shadow-inner",
    "hover:border-primary/40 hover:bg-accent/50 dark:bg-card/40",
  );

  return (
    <section className="space-y-8">
      <div>
        <Label className="text-foreground">Feature Name</Label>
        <Input
          placeholder="Enter feature name"
          disabled={disabled}
          {...register("feature.featureName", { required: "Feature name is required" })}
          className="mt-2.5 h-11 rounded-xl border-border/80 bg-background/55 shadow-inner dark:bg-card/35"
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-inner dark:border-white/10 dark:bg-card/30">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">Feature Description</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <Label className="text-foreground">Start Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className={dateTriggerClass}>
                  <span className={featureStart instanceof Date ? "" : "text-muted-foreground"}>
                    {featureStart instanceof Date ? format(featureStart, "PPP") : "Select date"}
                  </span>
                  <CalendarIcon className="size-4 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar
                  mode="single"
                  selected={featureStart}
                  onSelect={(date) => setValue("feature.featureDescription.startTime", date, { shouldValidate: true, shouldDirty: true })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-foreground">End Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className={dateTriggerClass}>
                  <span className={featureEnd instanceof Date ? "" : "text-muted-foreground"}>
                    {featureEnd instanceof Date ? format(featureEnd, "PPP") : "Select date"}
                  </span>
                  <CalendarIcon className="size-4 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar
                  mode="single"
                  selected={featureEnd}
                  onSelect={(date) => setValue("feature.featureDescription.endTime", date, { shouldValidate: true, shouldDirty: true })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-foreground">Requirement Analysis</Label>
          <Textarea
            placeholder="Code-level planning, classes, logic..."
            disabled={disabled}
            {...register("feature.featureDescription.requirementAnalysis", { required: "Requirement analysis is required" })}
            className="mt-2.5 min-h-40 resize-y rounded-xl border-border/80 bg-background/55 shadow-inner dark:bg-card/35"
          />
        </div>
      </div>
    </section>
  );
}
