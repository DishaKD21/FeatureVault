"use client";

import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const displayDate = (value) => {
  if (!value) return "Not set";
  if (value instanceof Date) return value.toLocaleDateString();
  return new Date(value).toLocaleDateString();
};

const tableSummary = (rows) => {
  if (!rows?.length) return "No rows added";
  return `${rows.length} row${rows.length === 1 ? "" : "s"} added`;
};

export default function ReviewStep({ values, userStories, trackingList, retrospective, savedDiagram, onEditStep }) {
  const cards = [
    {
      title: "Requirement",
      step: 0,
      lines: [
        `Start: ${displayDate(values.requirementElicitation?.startTime)}`,
        `End: ${displayDate(values.requirementElicitation?.endTime)}`,
        values.requirementElicitation?.discussion || "No discussion added",
      ],
    },
    {
      title: "Feature",
      step: 1,
      lines: [
        values.feature?.featureName || "Untitled feature",
        `Analysis: ${values.feature?.featureDescription?.requirementAnalysis || "Not added"}`,
      ],
    },
    {
      title: "Diagram",
      step: 2,
      lines: [savedDiagram?.image ? "Diagram attached" : "No diagram attached"],
    },
    {
      title: "Feature Estimate",
      step: 3,
      lines: [tableSummary(userStories)],
    },
    {
      title: "Tracking & Release",
      step: 4,
      lines: [`${trackingList?.length || 0} tracking item${trackingList?.length === 1 ? "" : "s"}`],
    },
    {
      title: "Retrospective",
      step: 5,
      lines: [tableSummary(retrospective)],
    },
    {
      title: "Who Created It",
      step: 6,
      lines: [
        values.whoCreatedIt?.name || "Name not added",
        values.whoCreatedIt?.empId || "Employee ID not added",
        `Total time: ${values.whoCreatedIt?.totalTime || 0}`,
      ],
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">Review & Submit</h2>
        <p className="mt-1 text-sm text-gray-500">Review every section before creating the completed document.</p>
      </div>

      <div className="grid gap-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-950">{card.title}</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => onEditStep(card.step)} className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {card.lines.map((line, index) => (
                <p key={index} className="line-clamp-2">{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
