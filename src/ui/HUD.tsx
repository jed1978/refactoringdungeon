import React, { useCallback, useState } from "react";
import { useGameState, useGameDispatch } from "../state/GameContext";
import { FLOOR_THEMES } from "../utils/constants";
import { AudioSystem } from "../engine/AudioSystem";
import { MusicSystem } from "../engine/MusicSystem";

type HUDProps = {
  readonly onMenuClick?: () => void;
};

export const HUD = React.memo(function HUD({ onMenuClick }: HUDProps) {
  const { currentFloor, settings, demoMode } = useGameState();
  const dispatch = useGameDispatch();
  const [localMuted, setLocalMuted] = useState(settings.muted);

  const themeIndex = Math.min(currentFloor - 1, FLOOR_THEMES.length - 1);
  const theme = FLOOR_THEMES[themeIndex];
  const floorName = `${currentFloor}F ${theme.name}`;

  const toggleMute = useCallback(() => {
    const next = !AudioSystem.isMuted();
    AudioSystem.setMuted(next);
    MusicSystem.setMuted(next);
    setLocalMuted(next);
    dispatch({ type: "TOGGLE_MUTE" });
  }, [dispatch]);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 px-3 py-2 flex items-center justify-between">
      <span
        className="text-green-400 text-xs tracking-wider"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "24px" }}
      >
        {floorName}
      </span>
      {demoMode && (
        <span
          className="text-yellow-300 border border-yellow-400 px-2 py-0.5 rounded"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "14px",
          }}
        >
          DEMO
        </span>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleMute}
          className="text-white text-2xl px-2 py-1 hover:opacity-70 transition-opacity"
          title={localMuted ? "取消靜音" : "靜音"}
        >
          {localMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A"}
        </button>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-gray-300 hover:text-white px-2 py-1 hover:opacity-70 transition-opacity"
            style={{ fontSize: "24px", lineHeight: 1 }}
            title="系統選單"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  );
});
