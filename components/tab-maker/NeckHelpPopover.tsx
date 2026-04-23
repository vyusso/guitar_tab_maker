"use client";

import { useEffect, useId, useRef, useState } from "react";

type HelpSection = {
  title: string;
  items: readonly string[];
};

const NECK_HELP_SECTIONS: readonly HelpSection[] = [
  {
    title: "Fret grid",
    items: [
      "Frets are numbered 0 (open at the nut) through 24.",
      "If the neck is wider than the screen, scroll it sideways.",
    ],
  },
  {
    title: "Chord mode",
    items: [
      "Tap frets to set each string; tap the same fret again to return to open.",
      "Use M to mute a string (shows × in the tab).",
      "When the shape is ready, press Add chord to append it to the tab.",
    ],
  },
  {
    title: "Riff mode (single notes)",
    items: [
      "Hold Shift and click a fret, or turn on the Riff button — each click adds one note with the other strings open (0).",
    ],
  },
  {
    title: "Techniques (h p b r / \\ V)",
    items: [
      "Orange bar on the neck = string that gets Tech symbols. “Tap next fret” appears when a hammer, pull, bend, or slide needs a second fret.",
      "Example: 5, h, 7 → 5h7. After b, the next fret is the bend target (e.g. 7b9).",
    ],
  },
  {
    title: "Tuning",
    items: [
      "TUNE changes the string names on the neck and tab; your saved frets stay the same.",
      "Custom tunings (max 2 letters per string) are stored in this browser only.",
    ],
  },
];

export function NeckHelpPopover() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClose = () => setIsOpen(false);
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

  return (
    <>
      <button
        type="button"
        className="tab-neck-help-btn clickable"
        onClick={openDialog}
        aria-label="Neck help"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
      >
        ?
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className="tab-help-dialog tab-help-dialog-wide"
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
              Neck
            </h3>
            <button
              type="button"
              className="tab-help-dialog-close clickable"
              onClick={closeDialog}
              aria-label="Close help"
            >
              ×
            </button>
          </header>

          <div className="tab-help-dialog-body">
            {NECK_HELP_SECTIONS.map((section) => (
              <section key={section.title} className="tab-help-dialog-section">
                <h4 className="tab-help-dialog-section-title">{section.title}</h4>
                <ol className="tab-help-dialog-steps" aria-label={section.title}>
                  {section.items.map((item) => (
                    <li key={item} className="tab-help-dialog-step">
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <button type="button" className="search-button clickable tab-help-dialog-done" onClick={closeDialog}>
            OK
          </button>
        </div>
      </dialog>
    </>
  );
}
