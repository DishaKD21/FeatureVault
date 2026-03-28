"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const { register, setValue, watch } = useForm();

  const startTime = watch("req.startTime");
  const endTime = watch("req.endTime");
  const featureStart = watch("feature.startTime");
  const featureEnd = watch("feature.endTime");

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-10">
      {/*  Requirement Elucidation */}
      <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold">Requirement Elucidation</h2>

        {/* Start + End Time */}
        <div className="grid grid-cols-2 gap-6">
          {/* Start */}
          <div>
            <Label>Start Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-2 justify-start">
                  {startTime instanceof Date
                    ? format(startTime, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={startTime}
                  onSelect={(date) => setValue("req.startTime", date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End */}
          <div>
            <Label>End Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-2 justify-start">
                  {endTime instanceof Date
                    ? format(endTime, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={endTime}
                  onSelect={(date) => setValue("req.endTime", date)}
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
            {...register("req.discussion")}
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
            {...register("feature.name")}
            className="mt-2 rounded-lg"
          />
        </div>

        {/* Feature Description */}
        <div className="border rounded-xl p-5 space-y-6">
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
                    onSelect={(date) => setValue("feature.startTime", date)}
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
                    onSelect={(date) => setValue("feature.endTime", date)}
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
              {...register("feature.analysis")}
              className="mt-2 h-36 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/*  Design Diagram Section */}
      <div className="border rounded-xl p-5 flex items-center justify-between">
        <span className="font-medium">Design Diagram</span>

        <Button variant="secondary">Create your design diagram</Button>
      </div>

      <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold">Feature Estimate</h2>

        <div>
          <p className="font-medium mb-2">User Story Distribution</p>
          <EditableTable />
        </div>
      </div>

      {/*  Tracking & Release Details */}
      <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold">Tracking & Release Details</h2>

        {/* User Story Number */}
        <div>
          <label className="font-medium">User Story Number</label>
          <Input className="mt-2 w-64" />
        </div>

        {/* User Story Link */}
        <div>
          <label className="font-medium">User Story Link</label>
          <Input className="mt-2 w-96" />
        </div>

        {/* PR Links */}
        <MultiInput label="PR Links" />

        {/* Code Description */}
        <div>
          <label className="font-medium">Code Description</label>
          <textarea className="mt-2 w-full h-28 border rounded-xl p-3" />
        </div>

        {/* Pipeline Links */}
        <MultiInput label="Pipeline Build Links" />

        {/* Environment Links */}
        <MultiInput label="Environment Deploy Links" />
      </div>

      {/*  Who Created It */}
      <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold">Who Created It</h2>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-medium">Name</label>
            <Input className="mt-2" />
          </div>

          <div>
            <label className="font-medium">Emp ID</label>
            <Input className="mt-2" />
          </div>

          <div>
            <label className="font-medium">Total Time</label>
            <Input className="mt-2" />
          </div>
        </div>
      </div>
      {/*  Retrospective Section */}
      <div className="border rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold">Retrospection Section</h2>

        <EditableTable />
      </div>
      {/* Submit */}
      <Button className="w-full h-11 text-base">Submit</Button>
    </div>
  );
};

export default DocForm;
