"use client";

import { TAB_TECHNIQUE_SYMBOLS } from "@/lib/tabTechniques";

type TechniqueStripProps = {
  activeStringLabel: string;
  /** Fret / phrase on the focused string (updates as you use Tech). */
  workingCellText: string;
  /** After h / p / b / slide — next fret extends the figure. */
  tapNextFret: boolean;
  onAppend: (symbol: string) => void;
};

function displayCell(text: string): string {
  return text === "x" ? "×" : text;
}

export function TechniqueStrip({
  activeStringLabel,
  workingCellText,
  tapNextFret,
  onAppend,
}: TechniqueStripProps) {
  const shown = displayCell(workingCellText);

  return (
    <div
      className="tab-technique-strip"
      role="group"
      aria-label={`Techniques for string ${activeStringLabel}, now ${shown}`}
    >
      <span className="tab-technique-strip-label">
        <span className="tab-technique-strip-word">Tech</span>{" "}
        <span className="tab-technique-strip-string">{activeStringLabel}</span>
        <span className="tab-technique-strip-sep" aria-hidden="true">
          {" · "}
        </span>
        <span className="tab-technique-strip-note" title="Figure on this string right now">
          {shown}
        </span>
      </span>
      {tapNextFret ? (
        <span className="tab-technique-strip-ping" role="status" aria-live="polite">
          Tap next fret
        </span>
      ) : null}
      <div className="tab-technique-strip-buttons">
        {TAB_TECHNIQUE_SYMBOLS.map(({ symbol, hint }) => (
          <button
            key={symbol}
            type="button"
            className="tab-technique-btn clickable"
            title={hint}
            onClick={() => onAppend(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
