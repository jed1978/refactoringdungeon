import { useEffect, useRef } from "react";
import { useGameState, useGameDispatch } from "../state/GameContext";
import { clearSave } from "../state/saveLoad";
import { generateFloor } from "../features/map/bspGenerator";
import { STRINGS, EPITAPHS } from "../data/strings";
import type { RunStats, PlayerState } from "../utils/types";

type OverlayProps = {
  readonly player: PlayerState;
  readonly runStats: RunStats;
};

function GameOverScreen({ player, runStats }: OverlayProps) {
  const dispatch = useGameDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    clearSave();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    };
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 40,
      y: h / 2 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 2 - 0.5,
      color: `hsl(${Math.random() * 60}, 80%, 50%)`,
      alpha: 1,
    }));

    let overlay = 0;
    let animId: number;
    let stopped = false;

    function draw() {
      if (stopped) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (p.alpha <= 0) continue;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.alpha -= 0.008;
      }

      overlay = Math.min(overlay + 0.005, 0.7);
      ctx.globalAlpha = overlay;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
    };
  }, []);

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

  const epitaph = EPITAPHS[Math.floor(Math.random() * EPITAPHS.length)].replace(
    "{0}",
    String(player.stats.level),
  );

  const minutes = runStats.startTime
    ? Math.floor((Date.now() - runStats.startTime) / 60000)
    : 0;

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        width={240}
        height={176}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
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
            className="mb-3"
            style={{
              fontSize: "16px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#9ca3af",
              lineHeight: 1.8,
            }}
          >
            {epitaph}
          </div>
          <div
            className="mb-4 flex flex-col gap-1"
            style={{
              fontSize: "14px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#6b7280",
            }}
          >
            <span>LV.{player.stats.level}</span>
            <span>
              {STRINGS.statsKills}: {runStats.monstersKilled}
            </span>
            <span>
              {STRINGS.statsFloors}: {runStats.floorsCleared}
            </span>
            <span>
              {STRINGS.statsTime}: {minutes} 分鐘
            </span>
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
    </div>
  );
}

function VictoryScreen({ player, runStats }: OverlayProps) {
  const dispatch = useGameDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    clearSave();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;

    const COLORS = [
      "#ffd700",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#ffeaa7",
    ];
    type Confetti = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    };
    const confetti: Confetti[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: -Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 1 + Math.random() * 2,
    }));

    let animId: number;
    let stopped = false;

    function draw() {
      if (stopped) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      for (const c of confetti) {
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, c.size, c.size);
        c.x += c.vx;
        c.y += c.vy;
        if (c.y > h + 10) {
          c.y = -5;
          c.x = Math.random() * w;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
    };
  }, []);

  const minutes = runStats.startTime
    ? Math.floor((Date.now() - runStats.startTime) / 60000)
    : 0;

  const shareContent = STRINGS.shareText
    .replace("{0}", String(player.stats.level))
    .replace("{1}", String(minutes));

  const handleSelectAll = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    (e.target as HTMLTextAreaElement).select();
  };

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        width={240}
        height={176}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
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
            className="mb-3"
            style={{
              fontSize: "18px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#d1fae5",
              lineHeight: 1.6,
            }}
          >
            重構成功！🎉
          </div>
          <div
            className="mb-3 flex flex-col gap-1"
            style={{
              fontSize: "14px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#a3e635",
            }}
          >
            <span>LV.{player.stats.level}</span>
            <span>
              {STRINGS.statsKills}: {runStats.monstersKilled}
            </span>
            <span>
              {STRINGS.statsFloors}: {runStats.floorsCleared}
            </span>
            <span>
              {STRINGS.statsTime}: {minutes} 分鐘
            </span>
          </div>
          <textarea
            readOnly
            value={shareContent}
            onClick={handleSelectAll}
            rows={2}
            className="w-full mb-3 bg-gray-900 border border-gray-600 text-gray-300 rounded p-2 text-center resize-none"
            style={{
              fontSize: "12px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          />
          <button
            onClick={() => dispatch({ type: "RETURN_TO_TITLE" })}
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
    </div>
  );
}

export function CombatResultOverlay() {
  const gs = useGameState();
  if (gs.gameMode.mode === "game_over") {
    return <GameOverScreen player={gs.player} runStats={gs.runStats} />;
  }
  if (gs.gameMode.mode === "victory") {
    return <VictoryScreen player={gs.player} runStats={gs.runStats} />;
  }
  return null;
}
