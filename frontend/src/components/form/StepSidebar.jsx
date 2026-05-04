"use client";

import { CheckCircle2, Circle, CircleDot } from "lucide-react";

export default function StepSidebar({ steps, currentStep, completedSteps, onStepClick }) {
  const isCompleted = (index) => completedSteps.includes(index);
  const canVisit = (index) => index === 0 || steps.slice(0, index).every((_, stepIndex) => isCompleted(stepIndex));

  return (
    <aside className="sticky top-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Application progress</p>
      <nav className="space-y-1">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const completed = isCompleted(index);
          const allowed = canVisit(index);

          return (
            <button
              key={step.id}
              type="button"
              disabled={!allowed}
              onClick={() => onStepClick(index)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition ${
                active
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : completed
                    ? "text-gray-900 hover:bg-gray-50"
                    : "text-gray-400"
              } ${!allowed ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : active ? (
                <CircleDot className="h-5 w-5 text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
              <span className="leading-snug">{step.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
