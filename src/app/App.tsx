import { useRef } from "react";
import { GameProvider, useGameState } from "../state/GameContext";
import { TitleScreen } from "../ui/TitleScreen";
import { GameCanvas } from "../ui/GameCanvas";
import type { GameCanvasHandle } from "../ui/GameCanvas";
import { HUD } from "../ui/HUD";
import { BottomHUD } from "../ui/BottomHUD";
import { Minimap } from "../ui/Minimap";
import { BattleUI } from "../ui/BattleUI";
import { CombatResultOverlay } from "../ui/CombatResultOverlay";
import { generateFloor } from "../features/map/bspGenerator";
import { loadFromLocalStorage } from "../state/saveLoad";
import { useGameDispatch } from "../state/GameContext";
import type { CombatAction } from "../utils/types";

function AppContent() {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const canvasRef = useRef<GameCanvasHandle>(null);

  const handleStart = () => {
    const seed = Date.now();
    const floor = generateFloor(1, seed);
    const startRoom = floor.rooms.find((r) => r.type === "start");
    const startPos = startRoom
      ? {
          x: Math.floor(startRoom.x + startRoom.width / 2),
          y: Math.floor(startRoom.y + startRoom.height / 2),
        }
      : { x: 5, y: 5 };
    dispatch({ type: "START_GAME", floor, startPos });
  };

  const handleContinue = () => {
    const saved = loadFromLocalStorage();
    if (saved) {
      dispatch({ type: "LOAD_SAVE", state: saved });
    }
  };

  const handleCombatAction = (action: CombatAction) => {
    canvasRef.current?.submitCombatAction(action);
  };

  if (gameState.gameMode.mode === "title") {
    return <TitleScreen onStart={handleStart} onContinue={handleContinue} />;
  }

  const isCombat = gameState.gameMode.mode === "combat";
  const isOverScreen =
    gameState.gameMode.mode === "game_over" ||
    gameState.gameMode.mode === "victory";

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-[240/176]">
        <GameCanvas ref={canvasRef} />

        {!isCombat && !isOverScreen && (
          <>
            <HUD />
            <BottomHUD />
            <Minimap />
          </>
        )}

        {isCombat && <BattleUI onAction={handleCombatAction} />}
        {isOverScreen && <CombatResultOverlay />}
      </div>
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
