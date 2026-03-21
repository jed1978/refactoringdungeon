import type { SpriteFrame } from '../utils/types';
import type { Particle } from './ParticleSystem';

const DISSOLVE_LIFE = 800;
const GRAVITY = 120;

export function createDissolveParticles(
  frame: SpriteFrame,
  width: number,
  height: number,
  worldX: number,
  worldY: number,
): Particle[] {
  const particles: Particle[] = [];

  for (let py = 0; py < height; py++) {
    const row = frame[py];
    if (!row) continue;
    for (let px = 0; px < width; px++) {
      const color = row[px];
      if (!color) continue;

      // Random velocity: mostly upward, some sideways
      const vx = (Math.random() - 0.5) * 80;
      const vy = -Math.random() * 80 - 20;

      particles.push({
        x: worldX + px,
        y: worldY + py,
        vx,
        vy,
        color,
        alpha: 1,
        life: DISSOLVE_LIFE,
        elapsed: 0,
        gravity: GRAVITY,
        size: 1,
      });
    }
  }

  return particles;
}
