import { useRef, useEffect, memo } from "react";
import { useGameState } from "../state/GameContext";
import { TileType, RoomType } from "../utils/types";

const SCALE = 3; // 3px per tile
const COLORS: Record<string, string> = {
  floor: "#4a5944",
  wall: "#2d3328",
  player: "#22c55e",
  monster: "#ef4444",
  boss: "#dc2626",
  stairs: "#60a5fa",
  chest: "#fbbf24",
  event: "#818cf8",
  unexplored: "#000000",
};

function MinimapComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameState();

  const { tileMap, explored, rooms, monsters } = gameState.floor;
  const playerPos = gameState.player.position;

  const mapWidth = tileMap[0]?.length ?? 0;
  const mapHeight = tileMap.length;
  const canvasWidth = mapWidth * SCALE;
  const canvasHeight = mapHeight * SCALE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let animId: number;
    let stopped = false;

    function draw() {
      if (stopped) return;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw explored tiles
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
          if (!explored[y]?.[x]) continue;

          const tile = tileMap[y]?.[x];
          if (tile === undefined || tile === TileType.Void) continue;

          ctx.fillStyle =
            tile === TileType.Wall
              ? COLORS.wall
              : tile === TileType.StairsDown
                ? COLORS.stairs
                : tile === TileType.ChestClosed
                  ? COLORS.chest
                  : tile === TileType.Shrine ||
                      tile === TileType.Bookshelf ||
                      tile === TileType.CoffeeMachine
                    ? COLORS.event
                    : COLORS.floor;

          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }

      // Draw boss room indicator
      const bossRoom = rooms.find((r) => r.type === RoomType.Boss);
      if (bossRoom) {
        const bossExplored = explored[bossRoom.y]?.[bossRoom.x];
        if (bossExplored) {
          ctx.fillStyle = COLORS.boss;
          ctx.globalAlpha = 0.4;
          ctx.fillRect(
            bossRoom.x * SCALE,
            bossRoom.y * SCALE,
            bossRoom.width * SCALE,
            bossRoom.height * SCALE,
          );
          ctx.globalAlpha = 1;
        }
      }

      // Draw monsters
      for (const m of monsters) {
        if (!explored[m.position.y]?.[m.position.x]) continue;
        ctx.fillStyle = COLORS.monster;
        ctx.fillRect(m.position.x * SCALE, m.position.y * SCALE, SCALE, SCALE);
      }

      // Draw player (blink)
      const blink = Math.floor(performance.now() / 400) % 2 === 0;
      if (blink) {
        ctx.fillStyle = COLORS.player;
        ctx.fillRect(playerPos.x * SCALE, playerPos.y * SCALE, SCALE, SCALE);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
    };
  }, [
    tileMap,
    explored,
    rooms,
    monsters,
    playerPos,
    mapWidth,
    mapHeight,
    canvasWidth,
    canvasHeight,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="absolute top-8 left-1 z-20 opacity-80"
      style={{
        imageRendering: "pixelated",
        border: "1px solid rgba(255,255,255,0.2)",
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    />
  );
}

export const Minimap = memo(MinimapComponent);
