"use client";

import { useEffect, useId, useRef, useState } from "react";

type TabControlsProps = {
  onAddChord: () => void;
  onResetNeck: () => void;
  onRemoveLast: () => void;
  onClearTab: () => void;
  /** Default name when the save dialog opens (includes .txt). */
  suggestedSaveFilename: string;
  onSaveTabAsTxt: (filename: string) => void;
  canRemoveLast: boolean;
  hasColumns: boolean;
  riffInputOn: boolean;
  /** Shift held or riff latched — same orange style as Add chord. */
  riffHighlighted: boolean;
  onToggleRiffInput: () => void;
};

export function TabControls({
  onAddChord,
  onResetNeck,
  onRemoveLast,
  onClearTab,
  suggestedSaveFilename,
  onSaveTabAsTxt,
  canRemoveLast,
  hasColumns,
  riffInputOn,
  riffHighlighted,
  onToggleRiffInput,
}: TabControlsProps) {
  const saveDialogRef = useRef<HTMLDialogElement>(null);
  const saveTitleId = useId();
  const saveDialogDomId = useId();
  const filenameInputId = useId();
  const filenameHintId = useId();
  const [saveFilename, setSaveFilename] = useState(suggestedSaveFilename);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    const el = saveDialogRef.current;
    if (!el) return;
    const onClose = () => setSaveDialogOpen(false);
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    if (!saveDialogOpen) setSaveFilename(suggestedSaveFilename);
  }, [suggestedSaveFilename, saveDialogOpen]);

  function openSaveDialog() {
    setSaveFilename(suggestedSaveFilename);
    saveDialogRef.current?.showModal();
    setSaveDialogOpen(true);
  }

  function closeSaveDialog() {
    saveDialogRef.current?.close();
  }

  function confirmSave() {
    onSaveTabAsTxt(saveFilename);
    saveDialogRef.current?.close();
  }

  return (
    <>
      <div className="tab-controls">
        <button
          type="button"
          className={`clickable tab-control-secondary tab-riff-toggle ${riffHighlighted ? "tab-riff-toggle-lit" : ""}`}
          onClick={onToggleRiffInput}
          aria-pressed={riffInputOn}
          aria-label="Riff input mode"
          title="Click to latch riff mode (orange). Hold Shift for the same without latching. Add chord uses the neck shape when riff is off."
        >
          Riff
        </button>
        <button type="button" className="search-button clickable" onClick={onAddChord}>
          Add chord
        </button>
        <button type="button" className="tab-control-secondary clickable" onClick={onResetNeck}>
          Reset neck
        </button>
        <button
          type="button"
          className="tab-control-secondary clickable"
          onClick={onRemoveLast}
          disabled={!canRemoveLast}
          aria-disabled={!canRemoveLast}
        >
          Delete last
        </button>
        <button
          type="button"
          className="tab-control-danger clickable"
          onClick={onClearTab}
          disabled={!hasColumns}
          aria-disabled={!hasColumns}
        >
          Clear tab
        </button>
        <button
          type="button"
          className="tab-control-secondary clickable"
          onClick={openSaveDialog}
          aria-label="Save tab as a text file"
          title="Choose filename and download .txt"
        >
          Save .txt
        </button>
      </div>

      <dialog
        ref={saveDialogRef}
        id={saveDialogDomId}
        className="tab-help-dialog tab-save-tab-dialog"
        aria-labelledby={saveTitleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeSaveDialog();
          }
        }}
      >
        <div className="tab-help-dialog-inner tab-save-tab-dialog-inner" onClick={(e) => e.stopPropagation()}>
          <header className="tab-help-dialog-header">
            <h3 id={saveTitleId} className="tab-help-dialog-title">
              Save tab
            </h3>
            <button
              type="button"
              className="tab-help-dialog-close clickable"
              onClick={closeSaveDialog}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <p className="tab-save-tab-dialog-lead">
            Edit the file name in the field below, then Download.
            <br />
            <span className="tab-save-tab-dialog-lead-continued">
              The line starts as a suggestion from your tuning; you can clear it and type something new.
            </span>
          </p>

          <div className="tab-save-tab-dialog-body">
            <div className="tab-save-tab-field">
              <label className="tab-save-tab-filename-label" htmlFor={filenameInputId}>
                File name <span className="tab-save-tab-filename-editable">(editable)</span>
              </label>
              <input
                id={filenameInputId}
                className="tab-save-tab-filename-input"
                type="text"
                value={saveFilename}
                onChange={(e) => setSaveFilename(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmSave();
                  }
                }}
                autoComplete="off"
                spellCheck={false}
                autoFocus
                aria-describedby={filenameHintId}
              />
            </div>
            <p id={filenameHintId} className="tab-save-tab-filename-hint">
              If the name doesn’t end in .txt, it will be added.
              <br />
              Slashes, colons, and other illegal file-name characters are removed automatically.
            </p>
          </div>

          <div className="tab-save-tab-dialog-actions">
            <button type="button" className="tab-control-secondary clickable" onClick={closeSaveDialog}>
              Cancel
            </button>
            <button type="button" className="search-button clickable" onClick={confirmSave}>
              Download
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
