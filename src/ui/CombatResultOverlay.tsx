import { useGameState, useGameDispatch } from "../state/GameContext";
import { STRINGS } from "../data/strings";
import { generateFloor } from "../features/map/bspGenerator";

export function CombatResultOverlay() {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  if (gameState.gameMode.mode === "game_over") {
    const handleRestart = () => {
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

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-85">
        <div className="text-center px-4">
          <div
            className="mb-3"
            style={{
              fontSize: "30px",
              fontFamily: "'Press Start 2P', monospace",
              color: "#ef4444",
            }}
          >
            GAME OVER
          </div>
          <div
            className="mb-4"
            style={{
              fontSize: "21px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#9ca3af",
              lineHeight: 1.6,
            }}
          >
            {STRINGS.gameOverEpitaph}
          </div>
          <div
            className="mb-2"
            style={{
              fontSize: "18px",
              fontFamily: "'Press Start 2P', monospace",
              color: "#6b7280",
            }}
          >
            LV.{gameState.player.stats.level} 重構學徒
          </div>
          <button
            onClick={handleRestart}
            className="border border-gray-500 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded"
            style={{
              padding: "8px 16px",
              fontSize: "21px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          >
            {STRINGS.newGame}
          </button>
        </div>
      </div>
    );
  }

  if (gameState.gameMode.mode === "victory") {
    const handleRestart = () => {
      dispatch({ type: "RETURN_TO_TITLE" });
    };

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-85">
        <div className="text-center px-4">
          <div
            className="mb-3"
            style={{
              fontSize: "24px",
              fontFamily: "'Press Start 2P', monospace",
              color: "#ffd700",
            }}
          >
            VICTORY
          </div>
          <div
            className="mb-4"
            style={{
              fontSize: "21px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#d1fae5",
              lineHeight: 1.6,
            }}
          >
            成功重構 legacy codebase！
            <br />
            技術債終於還清了。
          </div>
          <button
            onClick={handleRestart}
            className="border border-yellow-500 bg-yellow-900 hover:bg-yellow-800 text-yellow-200 rounded"
            style={{
              padding: "8px 16px",
              fontSize: "21px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          >
            回到選單
          </button>
        </div>
      </div>
    );
  }

  return null;
}
