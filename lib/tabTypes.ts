/** Plain fret (0–24), muted string, or a phrase with techniques (e.g. 5h7, 7b9r, 5/7). */
export type TabPhrase = { readonly kind: "phrase"; readonly text: string };

export type TabCell = number | "x" | TabPhrase;

/** High e (index 0) through low E (index 5), standard tab order. */
export type SixStrings = [TabCell, TabCell, TabCell, TabCell, TabCell, TabCell];

/** Last fret index shown on the neck (open nut = 0). Typical electrics go to 22–24. */
export const FRET_MAX = 24;

/** Open (nut) through `FRET_MAX`. */
export const FRET_INDICES: readonly number[] = Array.from(
  { length: FRET_MAX + 1 },
  (_, index) => index,
);

export const DEFAULT_WORKING: SixStrings = [0, 0, 0, 0, 0, 0];

export function isPhraseCell(c: TabCell): c is TabPhrase {
  return typeof c === "object" && c !== null && c.kind === "phrase";
}

/** Plain text for one cell in the staff formatter. */
export function tabCellToString(c: TabCell): string {
  if (c === "x") return "x";
  if (isPhraseCell(c)) return c.text;
  return String(c);
}

/**
 * After h, p, /, \, or b, the next fret click extends the phrase instead of replacing it.
 * (Not after r or V — those end or decorate the current figure.)
 */
export function cellAcceptsAppendedFret(c: TabCell): boolean {
  if (!isPhraseCell(c) || c.text.length === 0) return false;
  const last = c.text[c.text.length - 1];
  return last === "h" || last === "p" || last === "/" || last === "\\" || last === "b";
}

/** Append a technique character; plain numbers become the start of a phrase. */
export function appendTechniqueCharToCell(cell: TabCell, ch: string): TabCell {
  if (cell === "x") return cell;
  if (isPhraseCell(cell)) {
    return { kind: "phrase", text: `${cell.text}${ch}` };
  }
  return { kind: "phrase", text: `${cell}${ch}` };
}

function cloneTabCell(c: TabCell): TabCell {
  if (isPhraseCell(c)) {
    return { kind: "phrase", text: c.text };
  }
  return c;
}

export function cloneSixStrings(value: SixStrings): SixStrings {
  return value.map(cloneTabCell) as SixStrings;
}
