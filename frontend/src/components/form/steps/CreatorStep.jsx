"use client";

import { Input } from "@/components/ui/input";

export default function CreatorStep({ register, disabled = false }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Who Created It</h2>
        <p className="mt-1 text-sm text-gray-500">Record the document owner and total feature time.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="font-medium">Name</label>
          <Input className="mt-2" disabled={disabled} {...register("whoCreatedIt.name", { required: "Creator name is required" })} />
        </div>
        <div>
          <label className="font-medium">Emp ID</label>
          <Input className="mt-2" disabled={disabled} {...register("whoCreatedIt.empId", { required: "Employee ID is required" })} />
        </div>
        <div>
          <label className="font-medium">Total Time</label>
          <Input type="number" className="mt-2" disabled={disabled} {...register("whoCreatedIt.totalTime", { min: 0 })} />
        </div>
      </div>
    </section>
  );
}
