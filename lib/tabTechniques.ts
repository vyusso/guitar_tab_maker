/**
 * Symbols appended into a tab cell (standard ASCII-style guitar tab).
 * Backslash is stored as a single "\" in phrase text.
 */
export const TAB_TECHNIQUE_SYMBOLS = [
  { symbol: "h", hint: "Hammer-on (e.g. 5h7)" },
  { symbol: "p", hint: "Pull-off" },
  { symbol: "b", hint: "Bend — then tap target fret (e.g. 7b9)" },
  { symbol: "r", hint: "Release (after a bend)" },
  { symbol: "/", hint: "Slide up" },
  { symbol: "\\", hint: "Slide down" },
  { symbol: "V", hint: "Vibrato" },
] as const;
