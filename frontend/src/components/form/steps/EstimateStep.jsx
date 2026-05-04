"use client";

import EditableTable from "@/modules/docform/UserStoryTable";

export default function EstimateStep({ userStories, setUserStories }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Feature Estimate</h2>
        <p className="mt-1 text-sm text-gray-500">Break the work into user-story distribution rows.</p>
      </div>
      <EditableTable value={userStories} onChange={setUserStories} />
    </section>
  );
}
