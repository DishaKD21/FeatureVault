"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CreatorStep({ register, disabled = false }) {
  return (
    <section className="grid gap-7 sm:grid-cols-3">
      <div>
        <Label className="text-foreground">Name</Label>
        <Input
          className="mt-2.5 rounded-xl border-border/80 bg-background/55 dark:bg-card/35"
          disabled={disabled}
          {...register("whoCreatedIt.name", { required: "Creator name is required" })}
        />
      </div>
      <div>
        <Label className="text-foreground">Emp ID</Label>
        <Input
          className="mt-2.5 rounded-xl border-border/80 bg-background/55 dark:bg-card/35"
          disabled={disabled}
          {...register("whoCreatedIt.empId", { required: "Employee ID is required" })}
        />
      </div>
      <div>
        <Label className="text-foreground">Total Time</Label>
        <Input type="number" className="mt-2.5 rounded-xl border-border/80 bg-background/55 dark:bg-card/35" disabled={disabled} {...register("whoCreatedIt.totalTime", { min: 0 })} />
      </div>
    </section>
  );
}
