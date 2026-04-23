/** One label per string, thin (high pitch) → thick (low pitch), same order as tab notation. */
export type TuningLabels = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
];

export type TuningDefinition = {
  id: string;
  name: string;
  labels: TuningLabels;
};

export const TUNINGS: readonly TuningDefinition[] = [
  {
    id: "standard",
    name: "Standard (EADGBE)",
    labels: ["e", "B", "G", "D", "A", "E"],
  },
  {
    id: "drop-d",
    name: "Drop D",
    labels: ["e", "B", "G", "D", "A", "D"],
  },
  {
    id: "double-drop-d",
    name: "Double drop D",
    labels: ["D", "B", "G", "D", "A", "D"],
  },
  {
    id: "dadgad",
    name: "DADGAD",
    labels: ["d", "A", "G", "D", "A", "d"],
  },
  {
    id: "open-g",
    name: "Open G",
    labels: ["D", "B", "G", "D", "G", "D"],
  },
  {
    id: "open-d",
    name: "Open D",
    labels: ["d", "A", "D", "F#", "A", "d"],
  },
  {
    id: "open-e",
    name: "Open E",
    labels: ["e", "B", "G#", "E", "B", "E"],
  },
  {
    id: "half-step-down",
    name: "Half step down",
    labels: ["eb", "Bb", "gb", "db", "Ab", "eb"],
  },
  {
    id: "drop-c",
    name: "Drop C (CGCFAD)",
    labels: ["D", "A", "F", "C", "G", "C"],
  },
];

export const DEFAULT_TUNING_ID = TUNINGS[0].id;

export function tuningById(id: string): TuningDefinition {
  const found = TUNINGS.find((t) => t.id === id);
  return found ?? TUNINGS[0];
}

/** Preset or custom row from storage; `undefined` if id is unknown. */
export function resolveTuning(
  id: string,
  custom: readonly TuningDefinition[],
): TuningDefinition | undefined {
  const fromCustom = custom.find((t) => t.id === id);
  if (fromCustom) return fromCustom;
  return TUNINGS.find((t) => t.id === id);
}

export function tuningOrFallback(
  id: string,
  custom: readonly TuningDefinition[],
): TuningDefinition {
  return resolveTuning(id, custom) ?? TUNINGS[0];
}
