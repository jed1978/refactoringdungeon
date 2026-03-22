import { useState } from "react";
import { useGameState, useGameDispatch } from "../state/GameContext";
import { AudioSystem } from "../engine/AudioSystem";
import { MusicSystem } from "../engine/MusicSystem";
import { saveToLocalStorage } from "../state/saveLoad";
import { STRINGS } from "../data/strings";

type Props = {
  readonly onClose: () => void;
};

export function PauseMenu({ onClose }: Props) {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [muted, setMuted] = useState(AudioSystem.isMuted());
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [confirmingReturn, setConfirmingReturn] = useState(false);

  const handleSave = () => {
    const ok = saveToLocalStorage(gameState);
    setSaveMsg(ok ? STRINGS.saveSuccess : STRINGS.saveFailed);
    setTimeout(() => setSaveMsg(null), 2000);
  };

  const handleToggleSound = () => {
    const next = !AudioSystem.isMuted();
    AudioSystem.setMuted(next);
    MusicSystem.setMuted(next);
    setMuted(next);
    dispatch({ type: "TOGGLE_MUTE" });
  };

  const handleReturnToTitle = () => {
    saveToLocalStorage(gameState);
    dispatch({ type: "RETURN_TO_TITLE" });
  };

  return (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div
        className="bg-gray-900 border-2 border-yellow-400 rounded p-6 flex flex-col gap-3"
        style={{ minWidth: "200px", maxWidth: "80%" }}
      >
        <div
          className="text-yellow-400 text-center mb-2"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "18px",
          }}
        >
          {STRINGS.pauseMenu}
        </div>

        {confirmingReturn ? (
          <>
            <div
              className="text-gray-300 text-center mb-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "16px",
              }}
            >
              {STRINGS.returnToTitleConfirm}
            </div>
            <button
              onClick={handleReturnToTitle}
              className="w-full border border-red-500 bg-red-900/60 hover:bg-red-800/60 text-red-200 rounded py-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              {STRINGS.confirm}
            </button>
            <button
              onClick={() => setConfirmingReturn(false)}
              className="w-full border border-gray-500 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded py-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              {STRINGS.cancel}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onClose}
              className="w-full border border-green-500 bg-green-900/60 hover:bg-green-800/60 text-green-200 rounded py-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              {STRINGS.resume}
            </button>

            <button
              onClick={handleSave}
              className="w-full border border-gray-500 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded py-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              {saveMsg ?? STRINGS.manualSave}
            </button>

            <button
              onClick={handleToggleSound}
              className="w-full border border-gray-500 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded py-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              {muted ? STRINGS.soundOff : STRINGS.soundOn}
            </button>

            <button
              onClick={() => setConfirmingReturn(true)}
              className="w-full border border-gray-500 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded py-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              回到標題
            </button>
          </>
        )}
      </div>
    </div>
  );
}
