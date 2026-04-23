"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import {
  getServerCustomTuningsSnapshot,
  loadCustomTunings,
  newCustomTuningId,
  saveCustomTunings,
  subscribeCustomTunings,
} from "@/lib/customTuningsStorage";
import {
  DEFAULT_TUNING_ID,
  type TuningDefinition,
  type TuningLabels,
  tuningOrFallback,
} from "@/lib/tunings";

export function useGuitarTuning() {
  const [tuningId, setTuningId] = useState(DEFAULT_TUNING_ID);

  const customTunings = useSyncExternalStore(
    subscribeCustomTunings,
    loadCustomTunings,
    getServerCustomTuningsSnapshot,
  );

  const addCustomTuning = useCallback(
    (name: string, labels: TuningLabels) => {
      const entry: TuningDefinition = {
        id: newCustomTuningId(),
        name: name.trim(),
        labels,
      };
      const next = [...customTunings, entry];
      saveCustomTunings(next);
      setTuningId(entry.id);
    },
    [customTunings],
  );

  const removeCustomTuning = useCallback(
    (id: string) => {
      const next = customTunings.filter((t) => t.id !== id);
      saveCustomTunings(next);
      setTuningId((current) => (current === id ? DEFAULT_TUNING_ID : current));
    },
    [customTunings],
  );

  const tuning = tuningOrFallback(tuningId, customTunings);

  return {
    tuningId,
    setTuningId,
    tuning,
    customTunings,
    addCustomTuning,
    removeCustomTuning,
  };
}
