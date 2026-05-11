"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeLogo from "@/components/branding/ThemeLogo";

/**
 * Vertical step navigator — consumes the same STEPS definitions as DocForm (id, title, description).
 */
export default function StepSidebar({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  /** Mobile drawer: closes after navigating */
  onRequestClose,
  className,
}) {
  const isCompleted = (index) => completedSteps.includes(index);
  const canVisit = (index) => index === 0 || steps.slice(0, index).every((_, stepIndex) => isCompleted(stepIndex));

  const stepCount = steps.length || 8;
  const progressPct = Math.min(100, Math.round(((currentStep + 1) / stepCount) * 100));

  const handleJump = (index) => {
    onStepClick(index);
    onRequestClose?.();
  };

  return (
    <aside
      className={cn(
        "rounded-[var(--fv-radius-sidebar)] border border-sidebar-border bg-fv-sidebar-surface p-6 shadow-fv-soft",
        "supports-[backdrop-filter]:backdrop-blur-md dark:border-white/10 dark:bg-fv-panel-dark",
        className,
      )}
    >
      <div className="mb-8">
        <ThemeLogo href="/dashboard" imgClassName="h-9" priority />
      </div>

      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Application progress</p>

      <nav className="fv-scrollbar relative max-h-[min(72vh,calc(100vh-320px))] space-y-0.5 overflow-y-auto pb-10 pr-1">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const completed = isCompleted(index);
          const allowed = canVisit(index);
          const numberLabel = index + 1;

          const description =
            typeof step.description === "string"
              ? step.description
              : "Continue this section to unlock the steps below.";

          return (
            <button
              key={step.id}
              type="button"
              disabled={!allowed}
              onClick={() => handleJump(index)}
              title={allowed ? undefined : "Complete earlier steps"}
              className={cn(
                "group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-[var(--fv-transition-fast)]",
                /* Brand lime wash — visible in light + dark (matches diagram editor #c4f042) */
                active &&
                  "bg-[#c4f042]/18 ring-1 ring-[#c4f042]/35 dark:bg-[#c4f042]/14 dark:ring-[#c4f042]/40",
                !active &&
                  completed &&
                  "border border-transparent hover:bg-[#c4f042]/10 dark:border-white/[0.04] dark:hover:bg-[#c4f042]/08",
                !active && !completed && "opacity-70 hover:bg-muted/80 dark:hover:bg-white/[0.03]",
                !allowed && "cursor-not-allowed opacity-45 grayscale-[0.2]",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-semibold leading-none tracking-tight transition-colors duration-[var(--fv-transition-fast)]",
                  active &&
                    "border-[#c4f042] bg-[#c4f042] text-[#111827] shadow-[0_0_0_1px_rgba(196,240,66,0.45)]",
                  !active &&
                    completed &&
                    "border-primary/45 bg-background text-primary dark:border-primary/55 dark:bg-primary/15 dark:text-primary",
                  !active &&
                    !completed &&
                    "border-border bg-muted/50 text-muted-foreground group-hover:border-border group-hover:bg-muted dark:bg-muted/35",
                )}
              >
                {completed && !active ? <Check strokeWidth={2.5} className="size-5" aria-hidden /> : numberLabel}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "font-semibold leading-snug tracking-[-0.01em]",
                    active ? "text-[#3d5210] dark:text-[#c4f042]" : completed ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
                <span className={cn("mt-1 block text-[13px] leading-relaxed tracking-[-0.01em]", "text-muted-foreground")}>{description}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="-mx-px mt-6 rounded-xl border border-border/80 bg-card/85 p-4 shadow-inner dark:border-white/[0.08] dark:bg-card/40">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {stepCount}
          </span>
          <span className="tabular-nums font-medium text-[#4d6210] dark:text-[#c4f042]">{progressPct}% complete</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/55">
          <div
            className="h-full rounded-full bg-[#c4f042] transition-[width] duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              boxShadow: "0 0 18px rgba(196, 240, 66, 0.45), 0 0 1px rgba(196, 240, 66, 0.5)",
            }}
          />
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">Complete sections in order unless you revisit earlier edits.</p>
      </div>
    </aside>
  );
}
