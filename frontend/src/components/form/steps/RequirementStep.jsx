"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function RequirementStep({ register, setValue, watch, disabled = false }) {
  const startTime = watch("requirementElicitation.startTime");
  const endTime = watch("requirementElicitation.endTime");

  return (
    <section className="space-y-8">
      <div className="fv-doc-panel">
        <h3 className="fv-doc-block-title text-base sm:text-lg">Requirement elicitation</h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label className="fv-doc-field-label text-foreground">Start Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "mt-2.5 h-11 w-full justify-between rounded-xl border-border/80 bg-background/60 font-normal text-foreground shadow-inner",
                  "hover:border-primary/40 hover:bg-accent/50 dark:bg-card/40",
                )}
              >
                <span className={startTime instanceof Date ? "" : "text-muted-foreground"}>
                  {startTime instanceof Date ? format(startTime, "PPP") : "Select date"}
                </span>
                <CalendarIcon className="size-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={startTime}
                onSelect={(date) => setValue("requirementElicitation.startTime", date, { shouldValidate: true, shouldDirty: true })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="fv-doc-field-label text-foreground">End Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "mt-2.5 h-11 w-full justify-between rounded-xl border-border/80 bg-background/60 font-normal text-foreground shadow-inner",
                  "hover:border-primary/40 hover:bg-accent/50 dark:bg-card/40",
                )}
              >
                <span className={endTime instanceof Date ? "" : "text-muted-foreground"}>
                  {endTime instanceof Date ? format(endTime, "PPP") : "Select date"}
                </span>
                <CalendarIcon className="size-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={endTime}
                onSelect={(date) => setValue("requirementElicitation.endTime", date, { shouldValidate: true, shouldDirty: true })}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label className="fv-doc-field-label text-foreground">Discussion</Label>
        <Textarea
          placeholder="Start discussion..."
          disabled={disabled}
          {...register("requirementElicitation.discussion", { required: "Discussion is required" })}
          className="mt-2.5 min-h-40 resize-y rounded-xl border-border/80 bg-background/55 text-foreground shadow-inner transition-[border-color] focus-visible:border-primary/50 dark:bg-card/35"
        />
      </div>
    </section>
  );
}
