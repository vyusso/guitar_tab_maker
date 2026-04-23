"use client";

import type { CSSProperties } from "react";
import { FRET_INDICES, type SixStrings } from "@/lib/tabTypes";
import type { TuningLabels } from "@/lib/tunings";

type FretboardProps = {
  stringLabels: TuningLabels;
  working: SixStrings;
  /** String row that receives technique symbols from the tab panel. */
  focusedStringIndex: number;
  /** `riffShortcut` is true when Shift is held (single-note column, others open). */
  onFretClick: (stringIndex: number, fret: number, riffShortcut: boolean) => void;
  onToggleMute: (stringIndex: number) => void;
  onFocusString: (stringIndex: number) => void;
};

function isSelected(working: SixStrings, stringIndex: number, fret: number) {
  const v = working[stringIndex];
  return typeof v === "number" && v === fret;
}

/** Wider minimum fret columns so the neck stays tappable when the viewport is narrow (scroll horizontally). */
const FRET_MIN = "2.2rem";
const FRET_GRID_TEMPLATE = `1.95rem 2.1rem repeat(${FRET_INDICES.length}, minmax(${FRET_MIN}, 1fr))`;

export function Fretboard({
  stringLabels,
  working,
  focusedStringIndex,
  onFretClick,
  onToggleMute,
  onFocusString,
}: FretboardProps) {
  return (
    <div
      className="tab-fretboard-shell"
      style={
        {
          "--tab-fret-grid": FRET_GRID_TEMPLATE,
        } as CSSProperties
      }
    >
      <div className="tab-fretboard-header" aria-hidden>
        <span className="tab-fret-label-spacer" />
        <span className="tab-fret-label-spacer" />
        {FRET_INDICES.map((fret) => (
          <span key={fret} className="tab-fret-col-label">
            {fret}
          </span>
        ))}
      </div>
      {stringLabels.map((label, stringIndex) => (
        <div
          key={`${stringIndex}-${label}`}
          className={`tab-fret-row ${focusedStringIndex === stringIndex ? "tab-fret-row-focused" : ""}`}
        >
          <span className="tab-string-name">{label}</span>
          <button
            type="button"
            className={`tab-mute-btn clickable ${
              working[stringIndex] === "x" ? "tab-mute-active" : ""
            }`}
            onClick={() => {
              onFocusString(stringIndex);
              onToggleMute(stringIndex);
            }}
            aria-label={`Mute string ${label}`}
            aria-pressed={working[stringIndex] === "x"}
          >
            {working[stringIndex] === "x" ? "×" : "M"}
          </button>
          {FRET_INDICES.map((fret) => {
            const selected = isSelected(working, stringIndex, fret);
            return (
              <button
                key={fret}
                type="button"
                className={`tab-fret-cell clickable ${selected ? "tab-fret-cell-active" : ""}`}
                onClick={(event) => {
                  onFocusString(stringIndex);
                  onFretClick(stringIndex, fret, event.shiftKey);
                }}
                aria-label={`String ${label} fret ${fret}`}
                aria-pressed={selected}
              >
                {fret === 0 ? "○" : fret}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
