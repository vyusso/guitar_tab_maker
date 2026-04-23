"use client";

import { useEffect, useState } from "react";

/** True while either Shift key is held (window blur clears it if keyup is missed). */
export function useShiftHeld() {
  const [shiftHeld, setShiftHeld] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Shift") setShiftHeld(true);
    }
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "Shift") setShiftHeld(false);
    }
    function onBlur() {
      setShiftHeld(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return shiftHeld;
}
