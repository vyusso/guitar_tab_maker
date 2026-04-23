import type { TuningDefinition, TuningLabels } from "@/lib/tunings";

const STORAGE_KEY = "guitartab-custom-tunings";

/** Stable empty list for `useSyncExternalStore` (snapshots must be referentially stable when data unchanged). */
export const EMPTY_CUSTOM_TUNINGS: TuningDefinition[] = [];

let cachedStorageRaw: string | null = null;
let cachedParsedList: TuningDefinition[] = EMPTY_CUSTOM_TUNINGS;

/** Custom string labels only (presets in code may use up to 2 chars for alignment). */
const MAX_LABEL_LEN = 2;
const MAX_NAME_LEN = 64;

function isStringArrayOfSix(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length === 6 &&
    value.every((item) => typeof item === "string")
  );
}

function normalizeLabels(raw: string[]): TuningLabels | null {
  const trimmed = raw.map((s) => s.trim().slice(0, MAX_LABEL_LEN));
  if (trimmed.some((s) => s.length === 0)) {
    return null;
  }
  return trimmed as unknown as TuningLabels;
}

function normalizeEntry(raw: unknown): TuningDefinition | null {
  if (raw === null || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const id = rec.id;
  const name = rec.name;
  const labels = rec.labels;
  if (typeof id !== "string" || !id.startsWith("custom-")) return null;
  if (typeof name !== "string") return null;
  const trimmedName = name.trim();
  if (trimmedName.length === 0 || trimmedName.length > MAX_NAME_LEN) return null;
  if (!isStringArrayOfSix(labels)) return null;
  const tuned = normalizeLabels(labels);
  if (!tuned) return null;
  return { id, name: trimmedName, labels: tuned };
}

export function loadCustomTunings(): TuningDefinition[] {
  if (typeof window === "undefined") return EMPTY_CUSTOM_TUNINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const key = raw ?? "";
    if (key === cachedStorageRaw) return cachedParsedList;

    cachedStorageRaw = key;

    if (key === "") {
      cachedParsedList = EMPTY_CUSTOM_TUNINGS;
      return cachedParsedList;
    }

    const parsed: unknown = JSON.parse(key);
    if (!Array.isArray(parsed)) {
      cachedParsedList = EMPTY_CUSTOM_TUNINGS;
      return cachedParsedList;
    }

    const out: TuningDefinition[] = [];
    for (const item of parsed) {
      const entry = normalizeEntry(item);
      if (entry) out.push(entry);
    }
    cachedParsedList = out.length === 0 ? EMPTY_CUSTOM_TUNINGS : out;
    return cachedParsedList;
  } catch {
    cachedParsedList = EMPTY_CUSTOM_TUNINGS;
    return cachedParsedList;
  }
}

/** Server / hydration snapshot; must not allocate a new array each call. */
export function getServerCustomTuningsSnapshot(): TuningDefinition[] {
  return EMPTY_CUSTOM_TUNINGS;
}

const listeners = new Set<() => void>();

export function subscribeCustomTunings(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function notifyCustomTuningsChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function saveCustomTunings(list: readonly TuningDefinition[]): void {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(list);
    window.localStorage.setItem(STORAGE_KEY, json);
    cachedStorageRaw = json;
    cachedParsedList = list.length === 0 ? EMPTY_CUSTOM_TUNINGS : [...list];
    notifyCustomTuningsChange();
  } catch {
    /* quota or private mode */
  }
}

export function newCustomTuningId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `custom-${crypto.randomUUID()}`;
  }
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
