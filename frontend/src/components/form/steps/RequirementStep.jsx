"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RequirementStep({ register, setValue, watch, disabled = false }) {
  const startTime = watch("requirementElicitation.startTime");
  const endTime = watch("requirementElicitation.endTime");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Requirement Elucidation</h2>
        <p className="mt-1 text-sm text-gray-500">Capture the discovery window and discussion notes.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label>Start Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" disabled={disabled} className="mt-2 w-full justify-start">
                {startTime instanceof Date ? format(startTime, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={startTime}
                onSelect={(date) => setValue("requirementElicitation.startTime", date, { shouldValidate: true, shouldDirty: true })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>End Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" disabled={disabled} className="mt-2 w-full justify-start">
                {endTime instanceof Date ? format(endTime, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
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
        <Label>Discussion</Label>
        <Textarea
          placeholder="Start discussion..."
          disabled={disabled}
          {...register("requirementElicitation.discussion", { required: "Discussion is required" })}
          className="mt-2 min-h-36 rounded-lg"
        />
      </div>
    </section>
  );
}
