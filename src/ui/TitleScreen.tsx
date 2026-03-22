import { useRef, useEffect, useState } from "react";
import { STRINGS } from "../data/strings";
import { playerMapSprite } from "../sprites/player";
import { drawSprite, getAnimationFrame } from "../engine/SpriteRenderer";
import { hasSave, loadFromLocalStorage } from "../state/saveLoad";

type TitleScreenProps = {
  readonly onStart: () => void;
  readonly onContinue: () => void;
  readonly onDemo?: () => void;
};

const KONAMI_SEQ = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

const CODE_TEXTS = ["{}", ";", "//", "TODO", "BUG", "null", "[]", "=>"];

type CodeParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  alpha: number;
};

export function TitleScreen({ onStart, onContinue, onDemo }: TitleScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const konamiBuffer = useRef<string[]>([]);
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const saveExists = hasSave();

  const savedState = loadFromLocalStorage();
  const saveInfo = savedState
    ? `LV.${savedState.player.stats.level} / ${savedState.currentFloor}F`
    : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const next = [...konamiBuffer.current, e.key].slice(-KONAMI_SEQ.length);
      konamiBuffer.current = next;
      if (next.join(",") === KONAMI_SEQ.join(",")) setDemoUnlocked(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    let animId: number;
    let stopped = false;
    const startTime = performance.now();

    const particles: CodeParticle[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.3,
      text: CODE_TEXTS[Math.floor(Math.random() * CODE_TEXTS.length)] ?? "{}",
      alpha: 0.1 + Math.random() * 0.3,
    }));

    function draw(now: number) {
      if (stopped) return;
      const elapsed = now - startTime;

      // Clear with dark background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw code particles
      ctx.font = "10px monospace";
      for (const p of particles) {
        ctx.fillStyle = `rgba(0, 200, 0, ${p.alpha})`;
        ctx.fillText(p.text, p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -20) {
          p.y = canvas!.height + 20;
          p.x = Math.random() * canvas!.width;
        }
        if (p.x < -20) p.x = canvas!.width + 20;
        if (p.x > canvas!.width + 20) p.x = -20;
      }

      // Draw player sprite
      const sheet = playerMapSprite.downIdle;
      const frame = getAnimationFrame(sheet, elapsed);
      drawSprite(ctx, frame, 8, 8, 16, 16);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
    };
  }, []);

  const buttonStyle = {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "12px",
    boxShadow: `
      inset -2px -2px 0 #111827,
      inset 2px 2px 0 #4b5563,
      0 0 0 2px #1f2937
    `,
  };

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <h1
          className="text-green-400 text-2xl tracking-widest"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          {STRINGS.title}
        </h1>
        <p
          className="text-gray-500 text-sm tracking-wider"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          {STRINGS.subtitle}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={32}
        height={32}
        className="w-16 h-16"
        style={{ imageRendering: "pixelated" }}
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={onStart}
          className="px-6 py-3 text-white bg-gray-900 hover:bg-green-900 hover:text-green-300 transition-colors cursor-pointer"
          style={buttonStyle}
        >
          {STRINGS.startGame}
        </button>
        {saveExists && (
          <button
            onClick={onContinue}
            className="px-6 py-3 text-white bg-gray-900 hover:bg-blue-900 hover:text-blue-300 transition-colors cursor-pointer"
            style={buttonStyle}
          >
            {STRINGS.continueGame}
            {saveInfo ? ` (${saveInfo})` : ""}
          </button>
        )}
        {demoUnlocked && onDemo && (
          <button
            onClick={onDemo}
            className="border border-purple-500 text-purple-400 hover:bg-purple-900/20 px-4 py-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "12px",
            }}
          >
            {STRINGS.demoMode}
          </button>
        )}
      </div>

      <p
        className="text-gray-700 text-xs mt-8"
        style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
      >
        WASD / 方向鍵移動 ｜ Space 互動
      </p>
    </div>
  );
}
