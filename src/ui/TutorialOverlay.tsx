import { useEffect, useCallback } from "react";
import { STRINGS } from "../data/strings";
import { FONT_UI } from "./styles";

type Props = {
  readonly which: "move" | "combat";
  readonly onDismiss: () => void;
};

export function TutorialOverlay({ which, onDismiss }: Props) {
  const handleKey = useCallback(() => onDismiss(), [onDismiss]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey, { once: true });
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      className="absolute inset-0 flex items-end justify-center z-40 pb-32"
      onClick={onDismiss}
    >
      <div
        className="bg-black/75 border border-gray-600 px-6 py-3 text-center pointer-events-none"
        style={{
          fontFamily: FONT_UI,
          fontSize: "16px",
          color: "#e5e7eb",
        }}
      >
        <div>
          {which === "move" ? STRINGS.tutorialMove : STRINGS.tutorialCombat}
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          {STRINGS.tapToDismiss}
        </div>
      </div>
    </div>
  );
}
