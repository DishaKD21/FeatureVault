"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MultiInput from "./MultiInput";
import EditableTable from "./UserStoryTable";
import { getDiagramByDocumentId } from "@/lib/diagramApi";
import {
  createDraft,
  getDocumentById,
  updateDraft,
} from "@/lib/documentationApi";

const DocForm = () => {
  const { register, setValue, watch, handleSubmit, reset } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const startTime = watch("requirementElicitation.startTime");
  const endTime = watch("requirementElicitation.endTime");
  const featureStart = watch("feature.featureDescription.startTime");
  const featureEnd = watch("feature.featureDescription.endTime");
  const [mounted, setMounted] = useState(false);
  const [savedDiagram, setSavedDiagram] = useState(null);
  const [diagramId, setDiagramId] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isLoadingDiagram, setIsLoadingDiagram] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [retrospective, setRetrospective] = useState([]);
  const [trackingList, setTrackingList] = useState([
    {
      userStoryNumber: "",
      userStoryLink: "",
      prLinks: [],
      codeDescription: "",
      pipelineBuildLinks: [],
      environmentDeployLinks: [],
    },
  ]);
  // Helper to construct the standardized payload from current form state
  const getPayload = (data) => {
    return {
      requirementElicitation: {
        startTime: data.requirementElicitation?.startTime?.toISOString(),
        endTime: data.requirementElicitation?.endTime?.toISOString(),
        discussion: data.requirementElicitation?.discussion,
      },
      feature: {
        featureName: data.feature?.featureName,
        featureDescription: {
          startTime: data.feature?.featureDescription?.startTime?.toISOString(),
          endTime: data.feature?.featureDescription?.endTime?.toISOString(),
          requirementAnalysis:
            data.feature?.featureDescription?.requirementAnalysis,
        },
      },
      designDiagram: {
        diagramId: diagramId || null,
      },
      featureEstimate: {
        userStoryDistribution: userStories,
      },
      trackingAndReleaseDetails: trackingList,
      whoCreatedIt: {
        name: data.whoCreatedIt?.name,
        empId: data.whoCreatedIt?.empId,
        totalTime: Number(data.whoCreatedIt?.totalTime || 0),
      },
      retrospectiveSection: retrospective,
    };
  };

  const onSubmit = async (data) => {
    if (!docId) return;

    const payload = getPayload(data);
    console.log("[DocForm] Submitting final update for docId:", docId, payload);

    try {
      await updateDraft(docId, payload);
      // Optional: Navigate to a success page or dashboard
      console.log("[DocForm] Final save successful");
      router.push("/dashboard");
    } catch (err) {
      console.error("[DocForm] Submit failed:", err);
      alert("Failed to submit: " + err.message);
    }
  };

  /**
   * DRAFT FLOW + URL SYNC: Read documentId from URL on every searchParams change.
   * If no `id` in URL, auto-create a draft and redirect.
   * If `id` exists, set docId state.
   *
   * WHY searchParams dependency: After router.replace(), Next.js App Router does
   * a soft navigation (no re-mount). Without this dependency, docId stays null.
   */
  /**
   * DRAFT FLOW + HYDRATION: Read documentId from URL and load existing data.
   */
  useEffect(() => {
    const initForm = async () => {
      const docIdParam = searchParams.get("id");
      console.log("[DocForm] useEffect triggered — URL id =", docIdParam);

      if (docIdParam) {
        setDocId(docIdParam);

        // HYDRATION: Load existing document data
        console.log("[DocForm] Hydrating form for docId:", docIdParam);
        try {
          const response = await getDocumentById(docIdParam);
          const doc = response.data;

          if (doc) {
            console.log("[DocForm] Document data loaded:", doc);

            reset({
              requirementElicitation: {
                startTime: doc.requirementElicitation?.startTime
                  ? new Date(doc.requirementElicitation.startTime)
                  : null,
                endTime: doc.requirementElicitation?.endTime
                  ? new Date(doc.requirementElicitation.endTime)
                  : null,
                discussion: doc.requirementElicitation?.discussion || "",
              },

              feature: {
                featureName: doc.feature?.featureName || "",
                featureDescription: {
                  startTime: doc.feature?.featureDescription?.startTime
                    ? new Date(doc.feature.featureDescription.startTime)
                    : null,
                  endTime: doc.feature?.featureDescription?.endTime
                    ? new Date(doc.feature.featureDescription.endTime)
                    : null,
                  requirementAnalysis:
                    doc.feature?.featureDescription?.requirementAnalysis || "",
                },
              },

              designDiagram: {
                diagramId: doc.designDiagram?.diagramId || "",
              },

              whoCreatedIt: {
                name: doc.whoCreatedIt?.name || "",
                empId: doc.whoCreatedIt?.empId || "",
                totalTime: doc.whoCreatedIt?.totalTime || 0,
              },
            });

            // These stay as state (correct already)
            setUserStories(doc.featureEstimate?.userStoryDistribution || []);
            setTrackingList(doc.trackingAndReleaseDetails || []);
            setRetrospective(doc.retrospectiveSection || []);

            if (doc.designDiagram?.diagramId) {
              setDiagramId(doc.designDiagram.diagramId);
            }
          }
        } catch (err) {
          console.error("[DocForm] Hydration failed:", err);
        }

        setMounted(true);
        return;
      }

      // No id in URL → create a draft document
      console.log("[DocForm] No id in URL, creating draft...");
      setIsCreatingDraft(true);

      try {
        const response = await createDraft();
        if (response?.data?._id) {
          const newDocId = response.data._id;
          setDocId(newDocId);
          setMounted(true);
          router.replace(`/create-doc?id=${newDocId}`);
        } else {
          setMounted(true);
        }
      } catch (err) {
        console.error("[DocForm] Failed to create draft:", err);
        setMounted(true);
      } finally {
        setIsCreatingDraft(false);
      }
    };

    initForm();
  }, [searchParams, router, reset]);

  /**
   * DIAGRAM LOADING: Once docId is set, load existing diagram for preview
   */
  useEffect(() => {
    if (!docId) return;

    const loadDiagram = async () => {
      setIsLoadingDiagram(true);
      console.log("[DocForm] Loading diagram for docId:", docId);

      try {
        const response = await getDiagramByDocumentId(docId);
        console.log("[DocForm] getDiagramByDocumentId response:", response);

        if (response && response.data) {
          console.log("[DocForm] Found existing diagram:", response.data._id);
          setSavedDiagram(response.data);
          setDiagramId(response.data._id);
          setValue("designDiagram.diagramId", response.data._id);
        } else {
          console.log(
            "[DocForm] No diagram found for this document (normal for new docs)",
          );
        }
      } catch (err) {
        console.log(
          "[DocForm] Error loading diagram (may be 404 for new doc):",
          err.message,
        );
      } finally {
        setIsLoadingDiagram(false);
        console.log("[DocForm] Diagram loading complete");
      }
    };

    loadDiagram();
  }, [docId, setValue]);

  const addTracking = () => {
    setTrackingList((prev) => [
      ...prev,
      {
        userStoryNumber: "",
        userStoryLink: "",
        prLinks: [],
        codeDescription: "",
        pipelineBuildLinks: [],
        environmentDeployLinks: [],
      },
    ]);
  };

  const handleTrackingChange = (index, field, value) => {
    setTrackingList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDiagramNavigation = () => {
    if (docId) {
      const navUrl = `/diagram-editor?docId=${docId}`;
      router.push(navUrl);
    } else {
      router.push(`/diagram-editor`);
    }
  };

  // Show loading while creating draft
  if (isCreatingDraft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
          <p className="text-gray-500">Creating document draft...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-10 max-w-4xl mx-auto space-y-10">
        {/*  Requirement Elucidation */}
        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Requirement Elucidation</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Start */}
            <div>
              <Label>Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 justify-start"
                  >
                    {startTime instanceof Date
                      ? format(startTime, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={startTime}
                    onSelect={(date) =>
                      setValue("requirementElicitation.startTime", date)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End */}
            <div>
              <Label>End Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 justify-start"
                  >
                    {endTime instanceof Date
                      ? format(endTime, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={endTime}
                    onSelect={(date) =>
                      setValue("requirementElicitation.endTime", date)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Discussion */}
          <div>
            <Label>Discussion</Label>
            <Textarea
              placeholder="Start discussion..."
              {...register("requirementElicitation.discussion")}
              className="mt-2 h-32 rounded-xl"
            />
          </div>
        </div>
        {/*  Feature Section */}
        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Feature</h2>

          {/* Feature Name */}
          <div>
            <Label>Feature Name</Label>
            <Input
              placeholder="Enter feature name"
              {...register("feature.featureName")}
              className="mt-2 rounded-lg"
            />
          </div>

          {/* Feature Description */}
          <div className="border rounded-xl p-5 space-y-6 bg-gray-50">
            <h3 className="font-medium">Feature Description</h3>

            {/* Start + End */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-2 justify-start"
                    >
                      {featureStart instanceof Date
                        ? format(featureStart, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={featureStart}
                      onSelect={(date) =>
                        setValue("feature.featureDescription.startTime", date)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-2 justify-start"
                    >
                      {featureEnd instanceof Date
                        ? format(featureEnd, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={featureEnd}
                      onSelect={(date) =>
                        setValue("feature.featureDescription.endTime", date)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Analysis */}
            <div>
              <Label>Requirement Analysis</Label>
              <Textarea
                placeholder="Code-level planning, classes, logic..."
                {...register("feature.featureDescription.requirementAnalysis")}
                className="mt-2 h-36 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Design Diagram</span>
              <p className="text-xs text-gray-400 mt-1">
                DocId: {docId || "N/A"} | Diagram: {diagramId || "None"}
              </p>
            </div>

            {isLoadingDiagram ? (
              <span className="text-sm text-gray-500">Loading diagram...</span>
            ) : savedDiagram?.image ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleDiagramNavigation}
                className="gap-2"
              >
                ✏️ Edit Diagram
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={handleDiagramNavigation}
                className="gap-2"
              >
                ➕ Create Diagram
              </Button>
            )}
          </div>

          {/* Preview */}
          {savedDiagram?.image && !isLoadingDiagram && (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-2">
              <img
                src={`http://localhost:5000/${savedDiagram.image}`}
                alt="diagram preview"
                className="w-full h-auto object-contain max-h-80 rounded-md"
                onError={(e) => {
                  console.warn("[DocForm] Failed to load diagram image");
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Feature Estimate</h2>

          <div>
            <p className="font-medium mb-2">User Story Distribution</p>
            <EditableTable value={userStories} onChange={setUserStories} />
          </div>
        </div>

        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Tracking & Release Details</h2>

          {trackingList.map((item, index) => (
            <div key={index} className="border p-4 rounded-xl space-y-4">
              {/* User Story Number */}
              <div>
                <label className="font-medium">User Story Number</label>
                <Input
                  className="mt-2 w-64"
                  value={item.userStoryNumber}
                  onChange={(e) =>
                    handleTrackingChange(
                      index,
                      "userStoryNumber",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* User Story Link */}
              <div>
                <label className="font-medium">User Story Link</label>
                <Input
                  className="mt-2 w-96"
                  value={item.userStoryLink}
                  onChange={(e) =>
                    handleTrackingChange(index, "userStoryLink", e.target.value)
                  }
                />
              </div>

              {/* PR Links */}
              <MultiInput
                label="PR Links"
                value={item.prLinks}
                onChange={(val) => handleTrackingChange(index, "prLinks", val)}
              />

              {/* Code Description */}
              <div>
                <label className="font-medium">Code Description</label>
                <textarea
                  className="mt-2 w-full h-28 border rounded-xl p-3"
                  value={item.codeDescription}
                  onChange={(e) =>
                    handleTrackingChange(
                      index,
                      "codeDescription",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Pipeline Links */}
              <MultiInput
                label="Pipeline Build Links"
                value={item.pipelineBuildLinks}
                onChange={(val) =>
                  handleTrackingChange(index, "pipelineBuildLinks", val)
                }
              />

              {/* Environment Links */}
              <MultiInput
                label="Environment Deploy Links"
                value={item.environmentDeployLinks}
                onChange={(val) =>
                  handleTrackingChange(index, "environmentDeployLinks", val)
                }
              />
            </div>
          ))}

          {/* ADD BUTTON */}
          <Button type="button" onClick={addTracking}>
            + Add Another User Story
          </Button>
        </div>

        {/*  Who Created It */}
        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Who Created It</h2>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="font-medium">Name</label>
              <Input className="mt-2" {...register("whoCreatedIt.name")} />
            </div>

            <div>
              <label className="font-medium">Emp ID</label>
              <Input className="mt-2" {...register("whoCreatedIt.empId")} />
            </div>

            <div>
              <label className="font-medium">Total Time</label>
              <Input
                type="number"
                className="mt-2"
                {...register("whoCreatedIt.totalTime")}
              />
            </div>
          </div>
        </div>

        {/*  Retrospective Section */}
        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Retrospection Section</h2>

          <EditableTable value={retrospective} onChange={setRetrospective} />
        </div>
        {/* Submit */}
        <Button type="submit" className="w-full h-11 text-base">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default DocForm;
