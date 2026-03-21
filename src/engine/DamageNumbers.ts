const FLOAT_LIFE = 600;
const FLOAT_SPEED = -30; // pixels/s upward

export type DamageNumber = {
  readonly value: number;
  readonly x: number;
  readonly isCrit: boolean;
  readonly isHeal: boolean;
  y: number;
  alpha: number;
  elapsed: number;
};

export function createDamageNumber(
  value: number,
  x: number,
  y: number,
  isCrit: boolean,
  isHeal: boolean,
): DamageNumber {
  return { value, x, y, isCrit, isHeal, alpha: 1, elapsed: 0 };
}

export function updateDamageNumbers(
  numbers: readonly DamageNumber[],
  dt: number,
): DamageNumber[] {
  const dtS = dt / 1000;
  return numbers
    .map(n => ({
      ...n,
      y: n.y + FLOAT_SPEED * dtS,
      alpha: 1 - n.elapsed / FLOAT_LIFE,
      elapsed: n.elapsed + dt,
    }))
    .filter(n => n.elapsed < FLOAT_LIFE);
}

export function renderDamageNumbers(
  ctx: CanvasRenderingContext2D,
  numbers: readonly DamageNumber[],
): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const n of numbers) {
    if (n.alpha <= 0) continue;
    ctx.globalAlpha = Math.max(0, n.alpha);

    if (n.isCrit) {
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.fillStyle = '#ffd700';
      ctx.fillText(`暴擊! ${n.value}`, n.x, n.y);
    } else if (n.isHeal) {
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillStyle = '#44ff88';
      ctx.fillText(`+${n.value}`, n.x, n.y);
    } else {
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillStyle = '#ffffff';
      ctx.fillText(String(n.value), n.x, n.y);
    }
  }

  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}
