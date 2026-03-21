export type GameLoopCallbacks = {
  update: (dt: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
};

export type GameLoopHandle = {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

export function createGameLoop(
  ctx: CanvasRenderingContext2D,
  callbacks: GameLoopCallbacks,
): GameLoopHandle {
  let animationId: number | null = null;
  let lastTime = 0;
  let paused = false;

  function loop(currentTime: number): void {
    animationId = requestAnimationFrame(loop);

    if (paused) {
      lastTime = currentTime;
      return;
    }

    const dt = lastTime === 0 ? 16 : Math.min(currentTime - lastTime, 50);
    lastTime = currentTime;

    callbacks.update(dt);
    callbacks.render(ctx);
  }

  return {
    start() {
      lastTime = 0;
      animationId = requestAnimationFrame(loop);
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
    },
  };
}
