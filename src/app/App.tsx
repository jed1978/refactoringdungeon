import { useRef, useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { GameProvider, useGameState } from "../state/GameContext";
import { TitleScreen } from "../ui/TitleScreen";
import { GameCanvas } from "../ui/GameCanvas";
import type { GameCanvasHandle } from "../ui/GameCanvas";
import { HUD } from "../ui/HUD";
import { BottomHUD } from "../ui/BottomHUD";
import { Minimap } from "../ui/Minimap";
import { BattleUI } from "../ui/BattleUI";
import { CombatResultOverlay } from "../ui/CombatResultOverlay";
import { InventoryScreen } from "../ui/InventoryScreen";
import { PauseMenu } from "../ui/PauseMenu";
import { ShopScreen } from "../ui/ShopScreen";
import { DialogueBox } from "../ui/DialogueBox";
import { TutorialOverlay } from "../ui/TutorialOverlay";
import { createNewFloorStart } from "../features/game/newFloorStart";
import { loadFromLocalStorage } from "../state/saveLoad";
import { useGameDispatch } from "../state/GameContext";
import { EVENTS } from "../data/events";
import { applyEventReward } from "../features/events/eventHandler";
import type { CombatAction } from "../utils/types";

function AppContent() {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const canvasRef = useRef<GameCanvasHandle>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const mode = gameState.gameMode.mode;
      if (mode !== "exploring") return;
      if (showInventory) {
        setShowInventory(false);
        return;
      }
      setShowPauseMenu((prev) => !prev);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [gameState.gameMode.mode, showInventory]);

  const handleStart = () => {
    const { floor, startPos } = createNewFloorStart();
    dispatch({ type: "START_GAME", floor, startPos });
  };

  const handleContinue = () => {
    const saved = loadFromLocalStorage();
    if (saved) {
      dispatch({ type: "LOAD_SAVE", state: saved });
    }
  };

  const handleDemo = () => {
    const { floor, startPos } = createNewFloorStart();
    dispatch({ type: "START_DEMO", floor, startPos });
  };

  const handleCombatAction = (action: CombatAction) => {
    canvasRef.current?.submitCombatAction(action);
  };

  if (gameState.gameMode.mode === "title") {
    return (
      <TitleScreen
        onStart={handleStart}
        onContinue={handleContinue}
        onDemo={handleDemo}
      />
    );
  }

  const isCombat = gameState.gameMode.mode === "combat";
  const isShop = gameState.gameMode.mode === "shop";
  const isEvent = gameState.gameMode.mode === "event";
  const isOverScreen =
    gameState.gameMode.mode === "game_over" ||
    gameState.gameMode.mode === "victory";
  const isExploring = gameState.gameMode.mode === "exploring";

  const activeEvent =
    isEvent && gameState.gameMode.mode === "event"
      ? EVENTS[gameState.gameMode.eventId]
      : null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-[240/176]">
        <GameCanvas ref={canvasRef} />

        {!isCombat && !isOverScreen && (
          <>
            <HUD
              onMenuClick={() => {
                setShowPauseMenu(true);
                setShowInventory(false);
              }}
            />
            <BottomHUD />
            <Minimap />
          </>
        )}

        {/* Inventory toggle button — only in exploring mode */}
        {isExploring && (
          <button
            className="absolute bottom-16 right-2 z-20 bg-gray-800/80 border-2 border-yellow-600 text-yellow-300 hover:bg-gray-700/80"
            style={{
              fontSize: "36px",
              lineHeight: 1,
              padding: "6px 10px",
            }}
            onClick={() => setShowInventory(true)}
            title="開啟背包"
          >
            🎒
          </button>
        )}

        {isCombat && <BattleUI onAction={handleCombatAction} />}
        {isOverScreen && <CombatResultOverlay />}

        {isExploring && !gameState.flags?.tutorialMove && (
          <TutorialOverlay
            which="move"
            onDismiss={() =>
              dispatch({ type: "DISMISS_TUTORIAL", which: "move" })
            }
          />
        )}
        {isCombat && !gameState.flags?.tutorialCombat && (
          <TutorialOverlay
            which="combat"
            onDismiss={() =>
              dispatch({ type: "DISMISS_TUTORIAL", which: "combat" })
            }
          />
        )}

        {/* Inventory overlay */}
        {showInventory && isExploring && (
          <InventoryScreen onClose={() => setShowInventory(false)} />
        )}

        {/* Pause menu overlay */}
        {showPauseMenu && isExploring && (
          <PauseMenu onClose={() => setShowPauseMenu(false)} />
        )}

        {/* Shop overlay — triggered by facing ShopCounter tile */}
        {isShop && (
          <ShopScreen
            onClose={() =>
              dispatch({
                type: "SET_GAME_MODE",
                gameMode: { mode: "exploring" },
              })
            }
          />
        )}

        {/* Event dialogue — Shrine / Bookshelf / Coffee Machine */}
        {isEvent && activeEvent && (
          <DialogueBox
            portrait={activeEvent.portrait}
            title={activeEvent.title}
            text={activeEvent.text}
            choices={activeEvent.choices.map((c) => ({
              label: c.label,
              onSelect: () => {
                const result = applyEventReward(
                  gameState.player.stats,
                  c.reward,
                );
                dispatch({
                  type: "UPDATE_PLAYER_STATS",
                  stats: result.newStats,
                });
                // Side-effects for special reward kinds
                if (c.reward.kind === "skip_encounters") {
                  const hpCost = Math.floor(gameState.player.stats.maxHp * 0.3);
                  dispatch({
                    type: "UPDATE_PLAYER_STATS",
                    stats: {
                      hp: Math.max(1, gameState.player.stats.hp - hpCost),
                    },
                  });
                  dispatch({ type: "SKIP_ENCOUNTERS", count: c.reward.count });
                } else if (c.reward.kind === "reveal_map") {
                  dispatch({ type: "REVEAL_MAP" });
                } else if (c.reward.kind === "companion") {
                  dispatch({
                    type: "SET_COMPANION",
                    combats: c.reward.combats,
                  });
                }
                dispatch({
                  type: "SET_GAME_MODE",
                  gameMode: { mode: "exploring" },
                });
              },
            }))}
          />
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppContent />
      <Analytics />
    </GameProvider>
  );
}
