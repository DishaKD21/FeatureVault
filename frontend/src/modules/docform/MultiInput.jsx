"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const normalizeIncoming = (v) => {
  if (!Array.isArray(v) || v.length === 0) return [""];
  return v.map((x) => (x == null ? "" : String(x)));
};

const MultiInput = ({ label, value, onChange }) => {
  const [values, setValues] = useState(() => normalizeIncoming(value));

  useEffect(() => {
    if (value === undefined) return;
    const next = normalizeIncoming(value);
    setValues((prev) => (JSON.stringify(next) !== JSON.stringify(prev) ? next : prev));
  }, [value]);

  // Keep parent in sync when `values` changes, but do it in an effect
  // to avoid updating parent state while rendering this component.
  useEffect(() => {
    onChange?.(values);
    // Intentionally only runs when `values` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const addField = useCallback(() => {
    setValues((prev) => [...prev, ""]);
  }, []);

  const removeField = useCallback(
    (index) => {
      setValues((prev) => {
        if (prev.length <= 1) return prev;
        return prev.filter((_, i) => i !== index);
      });
    },
    [],
  );

  const handleChange = useCallback((index, val) => {
    setValues((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  }, []);

  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground">{label}</p>

      {values.map((val, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder="Enter link..."
            className="min-h-9 flex-1 text-foreground"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "shrink-0 border-border text-muted-foreground hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive",
              values.length <= 1 && "pointer-events-none opacity-30",
            )}
            disabled={values.length <= 1}
            title={values.length <= 1 ? "At least one field is required" : "Remove this row"}
            aria-label={values.length <= 1 ? "Cannot remove the only field" : "Remove this link row"}
            onClick={() => removeField(i)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addField} className="text-foreground">
        + Add another
      </Button>
    </div>
  );
};

export default MultiInput;
