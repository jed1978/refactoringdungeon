export type ScreenFlash = {
  readonly color: string;
  readonly duration: number;
  elapsed: number;
};

export type ScreenShake = {
  readonly intensity: number;
  readonly duration: number;
  elapsed: number;
};

export function createFlash(color: string, duration: number): ScreenFlash {
  return { color, duration, elapsed: 0 };
}

function createShake(intensity: number, duration: number): ScreenShake {
  return { intensity, duration, elapsed: 0 };
}

export function updateFlash(
  flash: ScreenFlash,
  dt: number,
): ScreenFlash | null {
  const elapsed = flash.elapsed + dt;
  if (elapsed >= flash.duration) return null;
  return { ...flash, elapsed };
}

export function updateShake(
  shake: ScreenShake,
  dt: number,
): ScreenShake | null {
  const elapsed = shake.elapsed + dt;
  if (elapsed >= shake.duration) return null;
  return { ...shake, elapsed };
}

function getFlashAlpha(flash: ScreenFlash): number {
  // Fade out over last 50% of duration
  const t = flash.elapsed / flash.duration;
  return t < 0.5 ? 1 : 1 - (t - 0.5) * 2;
}

export function getShakeOffset(shake: ScreenShake): { x: number; y: number } {
  const t = shake.elapsed / shake.duration;
  const decay = 1 - t;
  const intensity = shake.intensity * decay;
  return {
    x: (Math.random() - 0.5) * intensity * 2,
    y: (Math.random() - 0.5) * intensity * 2,
  };
}

export function renderFlash(
  ctx: CanvasRenderingContext2D,
  flash: ScreenFlash,
  width: number,
  height: number,
): void {
  const alpha = getFlashAlpha(flash);
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = flash.color;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
}
