"use client";

import EditableTable from "@/modules/docform/UserStoryTable";

export default function RetrospectiveStep({ retrospective, setRetrospective }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Retrospective</h2>
        <p className="mt-1 text-sm text-gray-500">Capture lessons learned and follow-up observations.</p>
      </div>
      <EditableTable value={retrospective} onChange={setRetrospective} />
    </section>
  );
}
