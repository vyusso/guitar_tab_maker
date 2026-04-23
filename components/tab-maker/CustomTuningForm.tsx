"use client";

import { useState, type FormEvent } from "react";
import type { TuningLabels } from "@/lib/tunings";

const STRING_HINTS = ["Thin (1st)", "2", "3", "4", "5", "Thick (6th)"] as const;

const EMPTY_FIELDS = ["", "", "", "", "", ""] as const;

type CustomTuningFormProps = {
  onSave: (name: string, labels: TuningLabels) => void;
  onCancel: () => void;
};

const MAX_STRING_LABEL_LEN = 2;

function buildLabels(fields: readonly string[]): TuningLabels | null {
  const trimmed = fields.map((s) => s.trim().slice(0, MAX_STRING_LABEL_LEN));
  if (trimmed.some((s) => s.length === 0)) return null;
  return trimmed as unknown as TuningLabels;
}

export function CustomTuningForm({ onSave, onCancel }: CustomTuningFormProps) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState<string[]>([...EMPTY_FIELDS]);

  function updateField(index: number, value: string) {
    setFields((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 64) return;
    const labels = buildLabels(fields);
    if (!labels) return;
    onSave(trimmedName, labels);
  }

  return (
    <form className="tab-custom-tuning-form" onSubmit={handleSubmit}>
      <p className="tab-custom-tuning-intro">
        One label per string (max 2 characters, e.g. e, B, F#), top = thinnest, bottom = thickest.
      </p>
      <label className="tab-custom-tuning-field">
        <span className="tab-custom-tuning-label">Tuning name</span>
        <input
          type="text"
          className="tab-custom-tuning-input search-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My open A"
          maxLength={64}
          autoComplete="off"
          required
        />
      </label>
      <div className="tab-custom-tuning-strings">
        {STRING_HINTS.map((hint, index) => (
          <label key={hint} className="tab-custom-tuning-field">
            <span className="tab-custom-tuning-label">{hint}</span>
            <input
              type="text"
              className="tab-custom-tuning-input search-input"
              value={fields[index]}
              onChange={(e) => updateField(index, e.target.value)}
              placeholder="e"
              maxLength={MAX_STRING_LABEL_LEN}
              required
            />
          </label>
        ))}
      </div>
      <div className="tab-custom-tuning-actions">
        <button type="submit" className="search-button clickable">
          Save tuning
        </button>
        <button type="button" className="tab-control-secondary clickable" onClick={onCancel}>
          Back
        </button>
      </div>
    </form>
  );
}
