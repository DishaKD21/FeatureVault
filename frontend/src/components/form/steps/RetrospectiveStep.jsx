"use client";

import EditableTable from "@/modules/docform/UserStoryTable";

export default function RetrospectiveStep({ retrospective, setRetrospective }) {
  return (
    <section>
      <EditableTable value={retrospective} onChange={setRetrospective} />
    </section>
  );
}
