import type { SpriteSheet } from '../../utils/types';

// 越界觸手怪 (Feature Envy) — Battle sprite
// Octopus-like with tentacles crossing a dotted boundary line
// Size: 32×32

const _ = null;
const P = '#9933ff'; // purple body
const D = '#6622cc'; // dark purple outline
const G = '#00ff88'; // tentacle tip green
const W = '#cc88ff'; // highlight purple
const L = '#ffff44'; // boundary line yellow
const E = '#440099'; // deep shadow

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([_, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, _, _, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, _, _, D, P, W, P, P, P, P, P, P, P, P, P, W, P, P, D, _, L, L, L, L, L, L, L, L, L]),
  r32([_, _, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, D, P, P, P, D, D, P, P, P, P, D, D, P, P, P, P, P, D, _, L, L, L, L, L, L, L, L, L]),
  r32([_, _, D, P, P, D, _, _, D, P, P, P, P, D, _, _, D, P, P, P, D]),
  r32([_, _, D, P, P, D, _, _, D, P, P, P, P, D, _, _, D, P, P, P, D, _, L, L, L, L, L, L, L, L, L]),
  r32([_, _, _, D, P, P, D, D, P, P, P, P, P, P, D, D, P, P, P, D]),
  r32([_, _, _, _, D, P, P, P, P, E, P, P, P, E, P, P, P, P, P, D, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_, _, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D, _, L, L, L, L, L, L, L, L, L]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, D, P, D, P, P, P, D, _, D, P, P, P, P, D, _, D, P, P, P, D, _, L, L, L, L, L, L, L, L, L]),
  r32([D, P, D, _, D, P, D, _, _, D, P, P, P, D, _, _, D, P, P, D]),
  r32([D, P, D, _, D, P, D, _, _, D, P, P, P, D, _, _, D, P, P, D, _, _, L, L, L, L, L, L, L, L, L]),
  r32([G, _, _, _, G, P, _, _, _, G, P, P, G, _, _, _, G, P, P, G]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([G, _, _, _, _, _, _, _, _, _, _, _, G, _, _, _, G]),
  r32([_, G, _, _, _, _, _, _, _, _, _, G, _, _, _, _, _, G, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_, _, G, _, _, _, _, _, _, _, _, _, _, G]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L, L, L, L, L, L, L]),
  r32([_]),
  r32([_]),
  r32([_]),
];

// Frame 2: tentacles shift 1px, boundary line shifts
const idleFrame2: (string | null)[][] = [
  r32([_, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, _, _, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, _, _, D, P, W, P, P, P, P, P, P, P, P, P, W, P, P, D, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, D, P, P, P, D, D, P, P, P, P, D, D, P, P, P, P, P, D, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, D, P, P, D, _, _, D, P, P, P, P, D, _, _, D, P, P, P, D]),
  r32([_, _, D, P, P, D, _, _, D, P, P, P, P, D, _, _, D, P, P, P, D, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, _, D, P, P, D, D, P, P, P, P, P, P, D, D, P, P, P, D]),
  r32([_, _, _, _, D, P, P, P, P, E, P, P, P, E, P, P, P, P, P, D, _, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D, _, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, D, P, D, P, P, P, D, _, D, P, P, P, P, D, _, D, P, P, P, D, _, _, _, L, L, L, L, L, L, L, L]),
  r32([D, P, D, _, D, P, D, _, _, D, P, P, P, D, _, _, D, P, P, D]),
  r32([G, _, _, _, D, P, D, _, _, D, P, P, P, D, _, _, D, P, P, D, _, _, _, L, L, L, L, L, L, L, L]),
  r32([_, G, _, _, G, P, _, _, _, G, P, P, G, _, _, _, G, P, P, G]),
  r32([_, _, G, _, _, _, _, _, _, _, _, _, G, _, _, _, G, _, _, _, _, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, G, _, _, _, G]),
  r32([_, _, _, G, _, _, _, _, _, _, _, G, _, _, G, _, _, _, G, _, _, _, _, L, L, L, L, L, L, L, L]),
  r32([_, _, _, _, G]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
];

const hitFrame: (string | null)[][] = idleFrame1.map((row) =>
  row.map((px) => {
    if (px === P) return W;
    if (px === D) return E;
    return px;
  }),
);

export const featureEnvyBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 400,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
