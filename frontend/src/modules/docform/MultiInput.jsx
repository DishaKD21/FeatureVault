"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MultiInput = ({ label, value, onChange }) => {
  const [values, setValues] = useState(value || [""]);

  // Sync internal state if prop changes (hydration)
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(values)) {
      setValues(value);
    }
  }, [value]);

  const addField = () => {
    const updated = [...values, ""];
    setValues(updated);
    onChange?.(updated);
  };

  const removeField = (index) => {
    const updated = values.filter((_, i) => i !== index);
    setValues(updated);
    onChange?.(updated);
  };

  const handleChange = (index, val) => {
    const updated = [...values];
    updated[index] = val;
    setValues(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>

      {values.map((val, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder="Enter link..."
          />

          {values.length > 1 && (
            <Button
              variant="destructive"
              onClick={() => removeField(i)}
            >
              ✕
            </Button>
          )}
        </div>
      ))}

      <Button variant="secondary" onClick={addField}>
        + Add
      </Button>
    </div>
  );
};

export default MultiInput;