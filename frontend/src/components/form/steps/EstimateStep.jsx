"use client";

import EditableTable from "@/modules/docform/UserStoryTable";

export default function EstimateStep({ userStories, setUserStories }) {
  return (
    <section>
      <EditableTable value={userStories} onChange={setUserStories} />
    </section>
  );
}
