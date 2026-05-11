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
    <section className="space-y-5">
      <div className="grid gap-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-border/80 bg-card/85 p-5 shadow-inner transition-colors hover:border-primary/25 dark:border-white/10 dark:bg-card/40">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold tracking-tight text-foreground">{card.title}</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => onEditStep(card.step)} className="gap-2 rounded-xl text-primary hover:text-primary">
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {card.lines.map((line, index) => (
                <p key={index} className="line-clamp-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
