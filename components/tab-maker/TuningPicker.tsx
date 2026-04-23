"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CustomTuningForm } from "@/components/tab-maker/CustomTuningForm";
import { TUNINGS, type TuningDefinition, type TuningLabels } from "@/lib/tunings";

type PickerMode = "list" | "add";

type TuningPickerProps = {
  tuningId: string;
  activeTuning: TuningDefinition;
  onTuningChange: (id: string) => void;
  customTunings: TuningDefinition[];
  onAddCustomTuning: (name: string, labels: TuningLabels) => void;
  onRemoveCustomTuning: (id: string) => void;
};

export function TuningPicker({
  tuningId,
  activeTuning,
  onTuningChange,
  customTunings,
  onAddCustomTuning,
  onRemoveCustomTuning,
}: TuningPickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PickerMode>("list");

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClose = () => {
      setIsOpen(false);
      setMode("list");
    };
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function selectTuning(definition: TuningDefinition) {
    onTuningChange(definition.id);
    closeDialog();
  }

  function handleSaveCustom(name: string, labels: TuningLabels) {
    onAddCustomTuning(name, labels);
    setMode("list");
    closeDialog();
  }

  function renderTuningOption(definition: TuningDefinition, isCustom: boolean) {
    const selected = definition.id === tuningId;
    return (
      <li key={definition.id} className="tab-tuning-list-item" role="none">
        <div className="tab-tuning-option-row">
          <button
            type="button"
            className={`tab-tuning-option tab-tuning-option-grow clickable ${selected ? "tab-tuning-option-active" : ""}`}
            onClick={() => selectTuning(definition)}
            role="option"
            aria-selected={selected}
          >
            <span className="tab-tuning-option-name">{definition.name}</span>
            <span className="tab-tuning-option-labels">{definition.labels.join(" ")}</span>
          </button>
          {isCustom ? (
            <button
              type="button"
              className="tab-tuning-delete clickable"
              aria-label={`Remove ${definition.name}`}
              onClick={(event) => {
                event.stopPropagation();
                onRemoveCustomTuning(definition.id);
              }}
            >
              ×
            </button>
          ) : null}
        </div>
      </li>
    );
  }

  return (
    <>
      <button
        type="button"
        className="tab-tuning-btn clickable"
        onClick={openDialog}
        aria-label="Change tuning"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        title={activeTuning.name}
      >
        TUNE
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className="tab-help-dialog tab-tuning-dialog"
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
      >
        <div className="tab-help-dialog-inner" onClick={(e) => e.stopPropagation()}>
          <header className="tab-help-dialog-header">
            <h3 id={titleId} className="tab-help-dialog-title">
              {mode === "add" ? "Custom tuning" : "Tuning"}
            </h3>
            <button
              type="button"
              className="tab-help-dialog-close clickable"
              onClick={closeDialog}
              aria-label="Close tuning"
            >
              ×
            </button>
          </header>

          {mode === "add" ? (
            <CustomTuningForm onSave={handleSaveCustom} onCancel={() => setMode("list")} />
          ) : (
            <>
              <p className="tab-tuning-dialog-note">
                Names follow the tab lines (thin string at the top). Fret numbers stay the same. Custom
                tunings use at most 2 characters per string name and are stored on this device only.
              </p>
              <h4 className="tab-tuning-section-label">Presets</h4>
              <ul className="tab-tuning-list" role="listbox" aria-label="Preset tunings">
                {TUNINGS.map((definition) => renderTuningOption(definition, false))}
              </ul>
              <h4 className="tab-tuning-section-label">Saved on this device</h4>
              {customTunings.length === 0 ? (
                <p className="tab-tuning-empty-custom">None yet — add one below.</p>
              ) : (
                <ul className="tab-tuning-list" role="listbox" aria-label="Custom tunings">
                  {customTunings.map((definition) => renderTuningOption(definition, true))}
                </ul>
              )}
              <button
                type="button"
                className="tab-control-secondary clickable tab-tuning-add-custom"
                onClick={() => setMode("add")}
              >
                Add custom tuning
              </button>
              <button type="button" className="search-button clickable tab-help-dialog-done" onClick={closeDialog}>
                Close
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
