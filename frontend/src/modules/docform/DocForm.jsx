"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

const DocForm = () => {
  const { register, setValue, watch, handleSubmit } = useForm();
  const router = useRouter();
  const startTime = watch("requirementElicitation.startTime");
  const endTime = watch("requirementElicitation.endTime");
  const featureStart = watch(
    "feature.featureDescription.startTime",
  );
  const featureEnd = watch("feature.featureDescription.endTime");
  const [mounted, setMounted] = useState(false);
  const [savedDiagram, setSavedDiagram] = useState(null);
  const [diagramId, setDiagramId] = useState(null);
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
  const onSubmit = async (data) => {
    const payload = {
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
        diagramId: data.designDiagram?.diagramId,
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

    console.log("FINAL PAYLOAD:", payload);

    await fetch("http://localhost:5000/api/documentation/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };
  useEffect(() => {
    const id = localStorage.getItem("diagramId");

    if (!id) {
      setMounted(true);
      return;
    }

    fetch(`http://localhost:5000/api/diagram/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSavedDiagram(data.data);
        setDiagramId(data.data._id);

        setValue("designDiagram.diagramId", data.data._id);
      })
      .finally(() => setMounted(true));
  }, []);
     
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
            <span className="font-medium">Design Diagram</span>

            {savedDiagram?.image ? (
              <Button
                variant="outline"
                onClick={() => router.push("/diagram-editor")}
                className="gap-2"
              >
                Edit Diagram
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => router.push("/diagram-editor")}
                className="gap-2"
              >
                Create your design diagram
              </Button>
            )}
          </div>

          {/* Preview */}
          {savedDiagram?.image && (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-2">
              <img
                src={`http://localhost:5000/${savedDiagram.image}`}
                alt="diagram"
                className="w-full h-auto object-contain max-h-80 rounded-md"
              />
            </div>
          )}
        </div>
        <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Feature Estimate</h2>

          <div>
            <p className="font-medium mb-2">User Story Distribution</p>
            <EditableTable onChange={setUserStories} />
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
                onChange={(val) =>
                  handleTrackingChange(index, "pipelineBuildLinks", val)
                }
              />

              {/* Environment Links */}
              <MultiInput
                label="Environment Deploy Links"
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
      <Input
        className="mt-2"
        {...register("whoCreatedIt.name")}
      />
    </div>

    <div>
      <label className="font-medium">Emp ID</label>
      <Input
        className="mt-2"
        {...register("whoCreatedIt.empId")}
      />
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

          <EditableTable onChange={setRetrospective} />
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
