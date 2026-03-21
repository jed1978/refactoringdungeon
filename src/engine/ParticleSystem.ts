// Placeholder for Phase 3 — pixel dissolve, sparkles, damage numbers
export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
};

export type ParticleSystem = {
  readonly particles: readonly Particle[];
};

export function createParticleSystem(): ParticleSystem {
  return { particles: [] };
}
