"use client";

import { formatTabLinesForDisplay } from "@/lib/formatTabLines";
import type { SixStrings } from "@/lib/tabTypes";
import type { TuningLabels } from "@/lib/tunings";

type TabStaffProps = {
  columns: SixStrings[];
  stringLabels: TuningLabels;
};

export function TabStaff({ columns, stringLabels }: TabStaffProps) {
  const lines = formatTabLinesForDisplay(columns, stringLabels);

  return (
    <div className="tab-staff-shell">
      <pre
        className="tab-staff-pre"
        role="region"
        aria-label="Guitar tab notation"
      >
        {lines.join("\n")}
      </pre>
    </div>
  );
}
