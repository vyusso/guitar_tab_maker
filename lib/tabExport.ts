import { formatTabLinesForDisplay } from "@/lib/formatTabLines";
import type { SixStrings } from "@/lib/tabTypes";
import type { TuningLabels } from "@/lib/tunings";

/** Plain-text tab block: tuning line, string names, blank line, then six staff lines. */
export function buildTabExportText(
  columns: SixStrings[],
  stringLabels: TuningLabels,
  tuningName: string,
): string {
  const staff = formatTabLinesForDisplay(columns, stringLabels).join("\n");
  return `${tuningName}\n${stringLabels.join(" ")}\n\n${staff}\n`;
}

/** Safe default filename for a .txt download. */
export function tabExportFilename(tuningName: string): string {
  const base = tuningName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base.length > 0 ? base : "guitar-tab"}.txt`;
}

/**
 * User-chosen name: strips path junk, drops illegal chars, ensures .txt.
 */
export function sanitizeTabDownloadFilename(raw: string): string {
  let name = raw.trim().replace(/[/\\:*?"<>|]/g, "").replace(/\s+/g, "-");
  if (name.length === 0) return "guitar-tab.txt";
  if (!name.toLowerCase().endsWith(".txt")) name = `${name}.txt`;
  return name.slice(0, 120);
}

/** Triggers a plain-text download in the browser. */
export function downloadTabTextFile(content: string, filename: string): void {
  const safe = sanitizeTabDownloadFilename(filename);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safe;
  anchor.click();
  URL.revokeObjectURL(url);
}
