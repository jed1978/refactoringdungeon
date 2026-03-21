export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;     // total life in ms
  elapsed: number;  // elapsed ms
  gravity: number;  // pixels/s^2
  size: number;     // pixels
};

export type ParticleSystem = {
  readonly particles: readonly Particle[];
};

export function createParticleSystem(): ParticleSystem {
  return { particles: [] };
}

export function addParticles(
  system: ParticleSystem,
  particles: readonly Particle[],
): ParticleSystem {
  return { particles: [...system.particles, ...particles] };
}

export function updateParticles(
  system: ParticleSystem,
  dt: number,
): ParticleSystem {
  const dtS = dt / 1000;
  const alive: Particle[] = [];

  for (const p of system.particles) {
    const elapsed = p.elapsed + dt;
    if (elapsed >= p.life) continue;

    const t = elapsed / p.life;
    alive.push({
      ...p,
      x: p.x + p.vx * dtS,
      y: p.y + p.vy * dtS,
      vy: p.vy + p.gravity * dtS,
      alpha: 1 - t,
      elapsed,
    });
  }

  return { particles: alive };
}

export function renderParticles(
  ctx: CanvasRenderingContext2D,
  system: ParticleSystem,
): void {
  for (const p of system.particles) {
    if (p.alpha <= 0) continue;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;
}
