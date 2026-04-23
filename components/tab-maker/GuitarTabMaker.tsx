"use client";

import { useCallback, useState } from "react";
import { useShiftHeld } from "@/hooks/useShiftHeld";
import { useTabEditor } from "@/hooks/useTabEditor";
import { useGuitarTuning } from "@/hooks/useGuitarTuning";
import { Fretboard } from "@/components/tab-maker/Fretboard";
import { TabControls } from "@/components/tab-maker/TabControls";
import { NeckHelpPopover } from "@/components/tab-maker/NeckHelpPopover";
import { TabStaff } from "@/components/tab-maker/TabStaff";
import { TechniqueStrip } from "@/components/tab-maker/TechniqueStrip";
import { TuningPicker } from "@/components/tab-maker/TuningPicker";
import { buildTabExportText, downloadTabTextFile, tabExportFilename } from "@/lib/tabExport";
import { DEFAULT_TUNING_ID } from "@/lib/tunings";
import { cellAcceptsAppendedFret, tabCellToString } from "@/lib/tabTypes";

export function GuitarTabMaker() {
  const {
    tuningId,
    setTuningId,
    tuning,
    customTunings,
    addCustomTuning,
    removeCustomTuning,
  } = useGuitarTuning();

  const pickerHighlightsId =
    tuningId.startsWith("custom-") && !customTunings.some((t) => t.id === tuningId)
      ? DEFAULT_TUNING_ID
      : tuningId;

  const {
    columns,
    working,
    setFret,
    toggleMute,
    resetWorking,
    addChord,
    addRiffNote,
    removeLastColumn,
    clearTab,
    appendTechniqueChar,
  } = useTabEditor();

  const [neckFocusString, setNeckFocusString] = useState(0);
  const [riffInputOn, setRiffInputOn] = useState(false);
  const shiftHeld = useShiftHeld();
  const riffHighlighted = riffInputOn || shiftHeld;

  const focusedLabel = tuning.labels[neckFocusString] ?? tuning.labels[0];
  const focusedCellText = tabCellToString(working[neckFocusString]);
  const tapNextFret = cellAcceptsAppendedFret(working[neckFocusString]);

  const handleSaveTabAsTxt = useCallback(
    (filename: string) => {
      downloadTabTextFile(
        buildTabExportText(columns, tuning.labels, tuning.name),
        filename,
      );
    },
    [columns, tuning.labels, tuning.name],
  );

  const handleFretClick = useCallback(
    (stringIndex: number, fret: number, riffShortcut: boolean) => {
      if (riffShortcut || riffInputOn) {
        addRiffNote(stringIndex, fret);
        return;
      }
      setFret(stringIndex, fret);
    },
    [addRiffNote, riffInputOn, setFret],
  );

  return (
    <div className="terminal-root tab-maker-page">
      <div className="terminal-frame expanded tab-maker-frame">
        <header className="terminal-header">
          <div className="terminal-header-left">
            <span className="terminal-status-dot" aria-hidden />
            <span className="terminal-header-label">Guitar tab</span>
          </div>
          <div className="terminal-header-right">
            <span className="terminal-status-text">input</span>
          </div>
        </header>

        <div className="terminal-content tab-maker-content">
          <section className="panel tab-fretboard-panel" aria-label="Fretboard">
            <div className="tab-panel-title-row">
              <h2 className="panel-title">Neck</h2>
              <div className="tab-neck-actions">
                <TuningPicker
                  tuningId={pickerHighlightsId}
                  activeTuning={tuning}
                  onTuningChange={setTuningId}
                  customTunings={customTunings}
                  onAddCustomTuning={addCustomTuning}
                  onRemoveCustomTuning={removeCustomTuning}
                />
                <NeckHelpPopover />
              </div>
            </div>
            <div className="mainimage-container tab-fretboard-viewport">
              <div className="tab-fretboard-center-wrap">
                <Fretboard
                  stringLabels={tuning.labels}
                  working={working}
                  focusedStringIndex={neckFocusString}
                  onFretClick={handleFretClick}
                  onToggleMute={toggleMute}
                  onFocusString={setNeckFocusString}
                />
              </div>
            </div>
          </section>

          <section className="panel tab-staff-panel" aria-label="Tab output">
            <h2 className="panel-title">Tab</h2>
            <TabStaff columns={columns} stringLabels={tuning.labels} />
            <TechniqueStrip
              activeStringLabel={focusedLabel}
              workingCellText={focusedCellText}
              tapNextFret={tapNextFret}
              onAppend={(symbol) => appendTechniqueChar(neckFocusString, symbol)}
            />
            <TabControls
              onAddChord={addChord}
              onResetNeck={resetWorking}
              onRemoveLast={removeLastColumn}
              onClearTab={clearTab}
              suggestedSaveFilename={tabExportFilename(tuning.name)}
              onSaveTabAsTxt={handleSaveTabAsTxt}
              canRemoveLast={columns.length > 0}
              hasColumns={columns.length > 0}
              riffInputOn={riffInputOn}
              riffHighlighted={riffHighlighted}
              onToggleRiffInput={() => setRiffInputOn((v) => !v)}
            />
          </section>
        </div>

        <footer className="terminal-footer">
          {tuning.name} · {tuning.labels.join(" ")} · neck 0–24
        </footer>
      </div>
    </div>
  );
}
