"use client";

import { useCallback, useState } from "react";
import {
  appendTechniqueCharToCell,
  cellAcceptsAppendedFret,
  cloneSixStrings,
  DEFAULT_WORKING,
  isPhraseCell,
  type SixStrings,
} from "@/lib/tabTypes";

export function useTabEditor() {
  const [columns, setColumns] = useState<SixStrings[]>([]);
  const [working, setWorking] = useState<SixStrings>(DEFAULT_WORKING);

  const setFret = useCallback((stringIndex: number, fret: number) => {
    setWorking((prev) => {
      const next = cloneSixStrings(prev);
      const current = next[stringIndex];
      if (cellAcceptsAppendedFret(current) && isPhraseCell(current)) {
        next[stringIndex] = {
          kind: "phrase",
          text: `${current.text}${fret}`,
        };
        return next;
      }
      if (typeof current === "number" && current === fret) {
        next[stringIndex] = 0;
        return next;
      }
      next[stringIndex] = fret;
      return next;
    });
  }, []);

  const toggleMute = useCallback((stringIndex: number) => {
    setWorking((prev) => {
      const next = cloneSixStrings(prev);
      next[stringIndex] = prev[stringIndex] === "x" ? 0 : "x";
      return next;
    });
  }, []);

  const resetWorking = useCallback(() => {
    setWorking(cloneSixStrings(DEFAULT_WORKING));
  }, []);

  const appendTechniqueChar = useCallback((stringIndex: number, ch: string) => {
    setWorking((prev) => {
      const next = cloneSixStrings(prev);
      next[stringIndex] = appendTechniqueCharToCell(next[stringIndex], ch);
      return next;
    });
  }, []);

  const addChord = useCallback(() => {
    setColumns((prev) => [...prev, cloneSixStrings(working)]);
  }, [working]);

  /** One sounded string, all others open — for melodies / riffs. */
  const addRiffNote = useCallback((stringIndex: number, fret: number) => {
    const column = cloneSixStrings(DEFAULT_WORKING);
    column[stringIndex] = fret;
    setColumns((prev) => [...prev, column]);
  }, []);

  const removeLastColumn = useCallback(() => {
    setColumns((prev) => (prev.length === 0 ? prev : prev.slice(0, -1)));
  }, []);

  const clearTab = useCallback(() => {
    setColumns([]);
  }, []);

  return {
    columns,
    working,
    setFret,
    toggleMute,
    resetWorking,
    appendTechniqueChar,
    addChord,
    addRiffNote,
    removeLastColumn,
    clearTab,
  };
}
