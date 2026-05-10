"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowRightCircle, ChevronDown, Download, LayoutGrid, Loader2, LogOut, Menu, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepSidebar from "@/components/form/StepSidebar";
import StepRenderer from "@/components/form/StepRenderer";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/modules/authentication/firebase";
import { cn } from "@/lib/utils";
import { getStoredUser, useAuth } from "@/components/auth/useAuth";
import { generateDiagramExplanation, getDiagramByDocumentId } from "@/lib/diagramApi";
import {
  createDraft,
  deleteDocument,
  exportDocument,
  getDocumentById,
  submitDocument,
  updateDraft,
} from "@/lib/documentationApi";

const STEPS = [
  {
    id: "requirement",
    title: "Requirement Elucidation",
    description: "Document discovery timing and the stakeholder discussion that shaped this feature.",
  },
  {
    id: "feature",
    title: "Feature Details",
    description: "Name the capability and summarize how requirements translate into shipped work.",
  },
  {
    id: "diagram",
    title: "Design Diagram",
    description: "Link the architecture visualization that describes important flows.",
  },
  {
    id: "estimate",
    title: "Feature Estimate",
    description: "Lay out planned user stories before engineering execution begins.",
  },
  {
    id: "tracking",
    title: "Tracking & Release",
    description: "Capture stories, pull requests, build evidence, and release channels.",
  },
  {
    id: "retrospective",
    title: "Retrospective",
    description: "Record lessons learned plus follow-ups for the owning team.",
  },
  {
    id: "creator",
    title: "Who Created It",
    description: "Identify the author responsible for assembling this artifact.",
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Validate every captured section prior to finalized submission.",
  },
];

const STEP_FIELDS = {
  0: ["requirementElicitation.discussion"],
  1: ["feature.featureName", "feature.featureDescription.requirementAnalysis"],
  6: ["whoCreatedIt.name", "whoCreatedIt.empId", "whoCreatedIt.totalTime"],
};

const emptyTrackingItem = {
  userStoryNumber: "",
  userStoryLink: "",
  prLinks: [],
  codeDescription: "",
  pipelineBuildLinks: [],
  environmentDeployLinks: [],
};

const LOCAL_KEY = (id) => `docform_draft_${id}`;
const PROGRESS_KEY = (id) => `docform_progress_${id}`;

const normalizeDate = (value) => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};

const normalizeCompleted = (value) =>
  Array.isArray(value)
    ? value
        .map(Number)
        .filter((step) => Number.isInteger(step) && step >= 0 && step < STEPS.length)
    : [];

const DocForm = () => {
  const { register, setValue, watch, handleSubmit, reset, getValues, trigger } = useForm({
    mode: "onTouched",
    defaultValues: {
      requirementElicitation: { startTime: null, endTime: null, discussion: "" },
      feature: {
        featureName: "",
        featureDescription: { startTime: null, endTime: null, requirementAnalysis: "" },
      },
      designDiagram: { diagramId: "" },
      whoCreatedIt: { name: "", empId: "", totalTime: 0 },
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const watchedValues = watch();
  const didHydrateRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [savedDiagram, setSavedDiagram] = useState(null);
  const [diagramId, setDiagramId] = useState(null);
  const [docId, setDocId] = useState(null);
  const [doc, setDoc] = useState(null);
  const [isLoadingDiagram, setIsLoadingDiagram] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [diagramExplanationError, setDiagramExplanationError] = useState("");
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [formError, setFormError] = useState("");
  const [userStories, setUserStories] = useState([]);
  const [retrospective, setRetrospective] = useState([]);
  const [trackingList, setTrackingList] = useState([{ ...emptyTrackingItem }]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userLabel, setUserLabel] = useState("");
  const { logout } = useAuth();

  const isLocked = doc?.status === "completed";
  const isReviewStep = currentStep === STEPS.length - 1;

  const getPayload = (data = getValues()) => {
    const safeStr = (v) => (typeof v === "string" && v.length > 0 ? v : undefined);
    const safeDate = (v) => {
      if (v instanceof Date) return v.toISOString();
      if (typeof v === "string" && v.length > 0) return v;
      return undefined;
    };

    const payload = {
      requirementElicitation: {
        startTime: safeDate(data.requirementElicitation?.startTime),
        endTime: safeDate(data.requirementElicitation?.endTime),
        discussion: safeStr(data.requirementElicitation?.discussion),
      },
      feature: {
        featureName: safeStr(data.feature?.featureName),
        featureDescription: {
          startTime: safeDate(data.feature?.featureDescription?.startTime),
          endTime: safeDate(data.feature?.featureDescription?.endTime),
          requirementAnalysis: safeStr(data.feature?.featureDescription?.requirementAnalysis),
        },
      },
      featureEstimate: {
        userStoryDistribution: userStories,
      },
      trackingAndReleaseDetails: trackingList,
      whoCreatedIt: {
        name: safeStr(data.whoCreatedIt?.name),
        empId: safeStr(data.whoCreatedIt?.empId),
        totalTime: Number(data.whoCreatedIt?.totalTime || 0),
      },
      retrospectiveSection: retrospective,
    };

    if (diagramId) {
      payload.designDiagram = { diagramId };
    }

    return payload;
  };

  const saveToLocal = (id) => {
    try {
      const data = getValues();
      const snapshot = {
        formValues: {
          requirementElicitation: {
            startTime: data.requirementElicitation?.startTime instanceof Date
              ? data.requirementElicitation.startTime.toISOString()
              : data.requirementElicitation?.startTime || "",
            endTime: data.requirementElicitation?.endTime instanceof Date
              ? data.requirementElicitation.endTime.toISOString()
              : data.requirementElicitation?.endTime || "",
            discussion: data.requirementElicitation?.discussion || "",
          },
          feature: {
            featureName: data.feature?.featureName || "",
            featureDescription: {
              startTime: data.feature?.featureDescription?.startTime instanceof Date
                ? data.feature.featureDescription.startTime.toISOString()
                : data.feature?.featureDescription?.startTime || "",
              endTime: data.feature?.featureDescription?.endTime instanceof Date
                ? data.feature.featureDescription.endTime.toISOString()
                : data.feature?.featureDescription?.endTime || "",
              requirementAnalysis: data.feature?.featureDescription?.requirementAnalysis || "",
            },
          },
          whoCreatedIt: {
            name: data.whoCreatedIt?.name || "",
            empId: data.whoCreatedIt?.empId || "",
            totalTime: Number(data.whoCreatedIt?.totalTime || 0),
          },
        },
        diagramId: diagramId || "",
        userStories,
        trackingList,
        retrospective,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_KEY(id), JSON.stringify(snapshot));
    } catch (error) {
      console.error("[DocForm] localStorage save failed:", error);
    }
  };

  const restoreFromLocal = (id) => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY(id));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const clearLocal = (id) => {
    try {
      localStorage.removeItem(LOCAL_KEY(id));
      localStorage.removeItem(PROGRESS_KEY(id));
    } catch {}
  };

  const persistProgress = (id, step = currentStep, completed = completedSteps) => {
    try {
      localStorage.setItem(PROGRESS_KEY(id), JSON.stringify({ currentStep: step, completedSteps: completed }));
    } catch {}
  };

  const restoreProgress = (id) => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY(id));
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const completed = normalizeCompleted(parsed.completedSteps);
      const step = Number(parsed.currentStep);
      setCompletedSteps(completed);
      if (Number.isInteger(step) && step >= 0 && step < STEPS.length) {
        const canResume = step === 0 || STEPS.slice(0, step).every((_, index) => completed.includes(index));
        setCurrentStep(canResume ? step : completed.length);
      }
    } catch {}
  };

  const hydrateForm = (source) => {
    reset({
      requirementElicitation: {
        startTime: normalizeDate(source.requirementElicitation?.startTime),
        endTime: normalizeDate(source.requirementElicitation?.endTime),
        discussion: source.requirementElicitation?.discussion || "",
      },
      feature: {
        featureName: source.feature?.featureName || "",
        featureDescription: {
          startTime: normalizeDate(source.feature?.featureDescription?.startTime),
          endTime: normalizeDate(source.feature?.featureDescription?.endTime),
          requirementAnalysis: source.feature?.featureDescription?.requirementAnalysis || "",
        },
      },
      designDiagram: { diagramId: source.designDiagram?.diagramId || "" },
      whoCreatedIt: {
        name: source.whoCreatedIt?.name || "",
        empId: source.whoCreatedIt?.empId || "",
        totalTime: source.whoCreatedIt?.totalTime || 0,
      },
    });

    setUserStories(source.featureEstimate?.userStoryDistribution || []);
    setTrackingList(source.trackingAndReleaseDetails?.length ? source.trackingAndReleaseDetails : [{ ...emptyTrackingItem }]);
    setRetrospective(source.retrospectiveSection || []);
    if (source.designDiagram?.diagramId) setDiagramId(source.designDiagram.diagramId);
  };

  const canVisitStep = (stepIndex) => stepIndex === 0 || STEPS.slice(0, stepIndex).every((_, index) => completedSteps.includes(index));

  const validateCurrentStep = async () => {
    setFormError("");
    const fields = STEP_FIELDS[currentStep];
    if (!fields?.length) return true;

    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) setFormError("Please complete the required fields before continuing.");
    return valid;
  };

  const saveDraft = async ({ silent = false } = {}) => {
    if (!docId || isLocked) return false;

    if (!silent) setIsSaving(true);
    try {
      const payload = getPayload();
      await updateDraft(docId, payload);
      saveToLocal(docId);
      if (silent) {
        setAutoSaveStatus("Progress auto-saved ✓");
      }
      return true;
    } catch (error) {
      console.error("[DocForm] Draft save failed:", error);
      if (!silent) setFormError("Failed to save draft: " + error.message);
      return false;
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    const saved = await saveDraft();
    if (!saved) return;

    const nextStep = Math.min(currentStep + 1, STEPS.length - 1);
    const nextCompleted = Array.from(new Set([...completedSteps, currentStep])).sort((a, b) => a - b);
    setCompletedSteps(nextCompleted);
    setCurrentStep(nextStep);
    persistProgress(docId, nextStep, nextCompleted);
  };

  const handleStepClick = (stepIndex) => {
    if (isLocked || canVisitStep(stepIndex)) {
      setCurrentStep(stepIndex);
      if (docId) persistProgress(docId, stepIndex, completedSteps);
    }
  };

  const addTracking = () => {
    setTrackingList((prev) => [...prev, { ...emptyTrackingItem }]);
  };

  const handleTrackingChange = (index, field, value) => {
    setTrackingList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDiagramNavigation = async () => {
    if (docId) {
      saveToLocal(docId);
      await saveDraft({ silent: true });
      router.push(`/diagram-editor?docId=${docId}`);
      return;
    }
    router.push("/diagram-editor");
  };

  const refreshDiagram = React.useCallback(async (documentId = docId) => {
    if (!documentId) return null;

    const response = await getDiagramByDocumentId(documentId);
    if (response?.data) {
      setSavedDiagram(response.data);
      setDiagramId(response.data._id);
      setValue("designDiagram.diagramId", response.data._id);
      setDiagramExplanationError("");
      return response.data;
    }

    return null;
  }, [docId, setValue]);

  const handleGenerateExplanation = async () => {
    const targetDocId = docId;
    const targetDiagramId = diagramId || savedDiagram?._id;

    if (!targetDocId || !targetDiagramId) {
      setDiagramExplanationError("Please create and save a diagram first.");
      return;
    }

    setIsGeneratingExplanation(true);
    setDiagramExplanationError("");

    try {
      await generateDiagramExplanation({
        documentId: targetDocId,
        diagramId: targetDiagramId,
      });

      await refreshDiagram(targetDocId);
    } catch (error) {
      console.error("[DocForm] Explanation generation failed:", error);
      setDiagramExplanationError(`Failed to generate explanation: ${error.message}`);
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!docId || isLocked) return;

    setFormError("");
    setIsSubmitting(true);
    try {
      await submitDocument(docId, getPayload());
      clearLocal(docId);
      router.push("/dashboard");
    } catch (error) {
      console.error("[DocForm] Submit failed:", error);
      setFormError("Failed to submit: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!docId) return;
    await exportDocument(docId, doc?.feature?.featureName || "document");
  };

  const handleDelete = async () => {
    if (!docId || !confirm("Are you sure you want to delete this document?")) return;

    setIsDeleting(true);
    try {
      await deleteDocument(docId);
      clearLocal(docId);
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to delete document: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const initForm = async () => {
      const docIdParam = searchParams.get("id");

      if (docIdParam) {
        setDocId(docIdParam);
        restoreProgress(docIdParam);

        let hydratedFromApi = false;
        try {
          const response = await getDocumentById(docIdParam);
          const apiDoc = response.data;
          if (apiDoc) {
            if (apiDoc.status === "completed") {
              clearLocal(docIdParam);
              router.replace("/dashboard");
              return;
            }

            setDoc(apiDoc);
            hydrateForm(apiDoc);
            hydratedFromApi = true;
          }
        } catch (error) {
          console.error("[DocForm] API hydration failed:", error);
        }

        if (!hydratedFromApi) {
          const local = restoreFromLocal(docIdParam);
          if (local?.formValues) {
            hydrateForm({
              ...local.formValues,
              designDiagram: { diagramId: local.diagramId || "" },
              featureEstimate: { userStoryDistribution: local.userStories || [] },
              trackingAndReleaseDetails: local.trackingList || [],
              retrospectiveSection: local.retrospective || [],
            });
          }
        }

        didHydrateRef.current = true;
        return;
      }

      setIsCreatingDraft(true);
      try {
        const response = await createDraft();
        if (response?.data?._id) {
          const newDocId = response.data._id;
          setDocId(newDocId);
          setDoc(response.data);
          router.replace(`/create-doc?id=${newDocId}`);
        }
      } catch (error) {
        console.error("[DocForm] Failed to create draft:", error);
        setFormError("Failed to create draft: " + error.message);
      } finally {
        didHydrateRef.current = true;
        setIsCreatingDraft(false);
      }
    };

    initForm();
  }, [searchParams, router, reset]);

  useEffect(() => {
    if (!docId) return;

    const loadDiagram = async () => {
      setIsLoadingDiagram(true);
      try {
        await refreshDiagram(docId);
      } catch (error) {
        console.log("[DocForm] No diagram found for this document:", error.message);
      } finally {
        setIsLoadingDiagram(false);
      }
    };

    loadDiagram();
  }, [docId, refreshDiagram]);

  useEffect(() => {
    if (!docId) return;
    persistProgress(docId, currentStep, completedSteps);
  }, [docId, currentStep, completedSteps]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        const stored = getStoredUser();
        setUserLabel(stored?.name || stored?.email?.split("@")[0] || "");
        return;
      }
      setUserLabel(currentUser.displayName || currentUser.email?.split("@")[0] || "");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!docId || isLocked || !didHydrateRef.current) return;

    setAutoSaveStatus("");
    const timer = setTimeout(() => {
      saveDraft({ silent: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [docId, isLocked, watchedValues, userStories, trackingList, retrospective, diagramId]);

  const formProps = useMemo(
    () => ({ register, setValue, watch }),
    [register, setValue, watch],
  );

  const stepProps = {
    docId,
    diagramId,
    savedDiagram,
    isLoadingDiagram,
    isLocked,
    onDiagramNavigation: handleDiagramNavigation,
    onGenerateExplanation: handleGenerateExplanation,
    isGeneratingExplanation,
    diagramExplanationError,
    userStories,
    setUserStories,
    trackingList,
    addTracking,
    handleTrackingChange,
    retrospective,
    setRetrospective,
    values: getValues(),
    onEditStep: handleStepClick,
  };

  const goDashboard = () => router.push("/dashboard");
  const accountInitial =
    userLabel
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "•";

  const sidebarProps = {
    steps: STEPS,
    currentStep,
    completedSteps,
    onStepClick: handleStepClick,
  };

  if (isCreatingDraft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Creating document draft...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-fv-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Completed document</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{doc?.feature?.featureName || "Untitled Document"}</h1>
          <p className="mt-3 text-muted-foreground">This document is locked because it has already been completed.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFinalSubmit)} className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/70 shadow-fv-soft backdrop-blur-[var(--fv-header-blur)] supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-accent lg:hidden"
            aria-label="Open progress"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <Button type="button" variant="ghost" size="sm" className="gap-2 px-2 text-muted-foreground hover:text-foreground" onClick={goDashboard}>
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex max-w-[14rem] items-center gap-2 rounded-full border border-border bg-card/80 py-1 pl-1 pr-2.5 text-left text-sm shadow-fv-soft transition hover:border-primary/35 hover:bg-accent/60"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/90 to-primary text-[11px] font-semibold text-primary-foreground shadow-inner">
                    {accountInitial}
                  </span>
                  <span className="hidden min-w-0 flex-1 flex-col leading-tight sm:flex">
                    <span className="truncate font-medium text-foreground">{userLabel || "Account"}</span>
                    <span className="text-[11px] text-muted-foreground">Workspace</span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2">
                <div className="flex flex-col gap-1">
                  <Button type="button" variant="ghost" className="justify-start gap-2" onClick={goDashboard}>
                    <LayoutGrid className="size-4" />
                    Dashboard
                  </Button>
                  <Button type="button" variant="ghost" className="justify-start gap-2 text-destructive hover:bg-destructive/10" onClick={logout}>
                    <LogOut className="size-4" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileSidebarOpen}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <div className="relative mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-8 lg:py-10">
        <div
          className={cn(
            "fv-scrollbar fixed left-0 top-0 z-[70] h-full max-w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto border-r border-border bg-background p-4 shadow-fv-panel transition-transform duration-300 ease-out lg:hidden",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-end pb-2">
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent"
              onClick={() => setMobileSidebarOpen(false)}
            >
              Close
            </button>
          </div>
          <StepSidebar {...sidebarProps} onRequestClose={() => setMobileSidebarOpen(false)} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[5.5rem]">
            <StepSidebar {...sidebarProps} />
          </div>
        </aside>

        <main className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-fv-panel dark:border-white/10">
          <div className="border-b border-border bg-fv-form-step-header px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Step {currentStep + 1} of {STEPS.length}</p>
                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-[1.75rem]">{STEPS[currentStep].title}</h1>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{STEPS[currentStep].description}</p>
              </div>
              <div className="min-h-5 text-xs font-medium text-muted-foreground sm:text-right sm:text-sm">{autoSaveStatus}</div>
            </div>
          </div>

          <div className="px-5 py-6 transition-opacity duration-300 sm:px-8 sm:py-8">
            <StepRenderer currentStep={currentStep} formProps={formProps} stepProps={stepProps} />
            {formError && (
              <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive dark:border-destructive/40 dark:bg-destructive/15">
                {formError}
              </p>
            )}
          </div>

          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-fv-panel backdrop-blur-md lg:pointer-events-auto lg:static lg:z-0 lg:border-t-0 lg:bg-transparent lg:p-0 lg:pb-0 lg:shadow-none">
            <div className="pointer-events-auto mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-border/80 bg-transparent px-0 pt-4 sm:flex-row sm:items-center sm:justify-between lg:rounded-b-2xl lg:border-border/80 lg:bg-muted/15 lg:px-8 lg:py-7 dark:lg:bg-card/20">
              <Button
                type="button"
                variant="outline"
                disabled={currentStep === 0 || isSaving || isSubmitting}
                onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
                className="w-full border-border/80 bg-background/80 transition hover:border-primary/45 hover:bg-accent/60 sm:w-auto"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>

              {isReviewStep ? (
                <Button type="submit" disabled={isSubmitting || isSaving} className="w-full gap-2 shadow-fv-soft sm:w-auto">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Document
                  <ArrowRightCircle className="size-4 opacity-90" />
                </Button>
              ) : (
                <Button type="button" disabled={isSaving || isSubmitting} onClick={handleSaveAndContinue} className="w-full gap-2 shadow-fv-soft sm:w-auto">
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save & Continue
                  <ArrowRight className="size-4 opacity-90" />
                </Button>
              )}
            </div>
          </div>

          <div className="h-24 shrink-0 lg:hidden" aria-hidden />
        </main>
      </div>
    </form>
  );
};

export default DocForm;
