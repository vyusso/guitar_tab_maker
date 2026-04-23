import { tabCellToString, type SixStrings } from "@/lib/tabTypes";
import type { TuningLabels } from "@/lib/tunings";

/** How many chord columns fit on one staff row before a blank line and the next block (screen + .txt export). */
export const TAB_STAFF_COLUMNS_PER_LINE = 12;

function chunkArray<T>(items: readonly T[], size: number): T[][] {
  const n = Math.max(1, Math.floor(size));
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += n) {
    out.push(items.slice(i, i + n) as T[]);
  }
  return out;
}

function columnWidths(columns: SixStrings[]): number[] {
  return columns.map((col) => {
    let max = 1;
    for (let s = 0; s < 6; s += 1) {
      max = Math.max(max, tabCellToString(col[s]).length);
    }
    return max;
  });
}

function padCell(text: string, width: number): string {
  if (text.length >= width) return text;
  return `${"-".repeat(width - text.length)}${text}`;
}

function labelColumnPadded(labels: TuningLabels): string[] {
  const width = Math.max(1, ...labels.map((l) => l.length));
  return labels.map((label) =>
    label.length >= width
      ? label
      : `${label}${" ".repeat(width - label.length)}`,
  );
}

/** Builds six classic tab lines (thin string first). Empty columns still show tuning + staff rails. */
export function formatTabLines(
  columns: SixStrings[],
  stringLabels: TuningLabels,
): string[] {
  const paddedNames = labelColumnPadded(stringLabels);

  if (columns.length === 0) {
    return paddedNames.map((name) => `${name} ||`);
  }

  const widths = columnWidths(columns);
  const lines: string[] = [];

  for (let s = 0; s < 6; s += 1) {
    const chunks: string[] = [];
    for (let c = 0; c < columns.length; c += 1) {
      const raw = tabCellToString(columns[c][s]);
      const padded = padCell(raw, widths[c]);
      chunks.push(`-${padded}-`);
    }
    /* Space before | so multi-char note names don’t touch the staff. */
    lines.push(`${paddedNames[s]} |${chunks.join("")}|`);
  }

  return lines;
}

/**
 * Same notation as `formatTabLines`, but splits long tabs into several six-line blocks
 * separated by a blank line so rows don’t run off the screen or the saved file.
 */
export function formatTabLinesForDisplay(
  columns: SixStrings[],
  stringLabels: TuningLabels,
  columnsPerLine: number = TAB_STAFF_COLUMNS_PER_LINE,
): string[] {
  const chunkSize = Math.max(1, Math.floor(columnsPerLine));
  if (columns.length === 0) {
    return formatTabLines([], stringLabels);
  }
  const chunks = chunkArray(columns, chunkSize);
  const lines: string[] = [];
  for (let i = 0; i < chunks.length; i += 1) {
    if (i > 0) lines.push("");
    lines.push(...formatTabLines(chunks[i], stringLabels));
  }
  return lines;
}
