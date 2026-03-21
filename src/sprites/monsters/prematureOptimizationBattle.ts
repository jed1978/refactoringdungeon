import type { SpriteSheet } from '../../utils/types';

// 過早優化魔 (Premature Optimization Wizard) — Battle sprite
// Fancy golden robes but cracking, magnifying glass weapon
// Size: 32×32

const _ = null;
const G = '#ffd700'; // gold robes
const D = '#8b4513'; // crack dark brown
const P = '#9933cc'; // robe purple
const W = '#ffffff'; // magnifying glass / white
const S = '#cc9900'; // gold shadow
const C = '#ffeeaa'; // robe highlight
const E = '#ffaa00'; // hit flash

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([_, _, _, _, _, _, _, _, D, D, D, D, D, D, _]),
  r32([_, _, _, _, _, _, _, D, G, G, G, G, G, G, D]),
  r32([_, _, _, _, _, _, D, G, C, G, G, G, C, G, D]),
  r32([_, _, _, _, _, D, G, G, D, G, G, D, G, G, D]),
  r32([_, _, _, _, _, D, G, G, G, G, G, G, G, G, D, _, W, W, W, _]),
  r32([_, _, _, _, D, G, G, G, G, G, G, G, G, G, D, _, W, D, W, _]),
  r32([_, _, _, _, D, G, G, G, G, G, G, G, G, G, D, _, _, W, W, _]),
  r32([_, _, _, D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, D, _]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, D, P, P, S, P, P, P, S, P, P, P, S, P, P, D]),
  r32([_, D, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([D, P, P, P, P, D, P, P, P, P, D, P, P, P, P, P, D]),
  r32([D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([D, P, P, D, P, P, P, P, P, P, P, P, P, D, P, P, D]),
  r32([_, D, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, D, P, P, P, D, P, P, P, P, P, D, P, P, P, D]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, D, D, P, P, P, D, D, P, P, D, D, _]),
  r32([_, _, _, _, _, D, P, D, _, _, D, P, D]),
  r32([_, _, _, _, _, D, D, D, _, _, D, D, D]),
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

// Frame 2: magnifying glass moves slightly, cracks shift
const idleFrame2: (string | null)[][] = [
  r32([_, _, _, _, _, _, _, _, D, D, D, D, D, D, _]),
  r32([_, _, _, _, _, _, _, D, G, G, G, G, G, G, D]),
  r32([_, _, _, _, _, _, D, G, C, G, G, G, C, G, D]),
  r32([_, _, _, _, _, D, G, G, G, G, G, D, G, G, D]),
  r32([_, _, _, _, _, D, G, G, G, G, G, G, G, G, D, _, _, W, W, W]),
  r32([_, _, _, _, D, G, G, G, G, G, G, G, G, G, D, _, _, W, D, W]),
  r32([_, _, _, _, D, G, G, G, G, G, G, G, G, G, D, _, _, _, W, W]),
  r32([_, _, _, D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _, D]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, D, P, P, S, P, P, P, S, P, P, P, S, P, P, D]),
  r32([_, D, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([D, P, P, P, D, P, P, P, P, P, D, P, P, P, P, P, D]),
  r32([D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([D, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, D, P, P, D, P, P, P, P, P, P, P, D, P, P, D]),
  r32([_, D, P, P, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, D, P, P, P, P, P, P, P, P, P, P, P, D]),
  r32([_, _, _, D, D, P, P, P, D, D, P, P, D, D, _]),
  r32([_, _, _, _, _, D, P, D, _, _, D, P, D]),
  r32([_, _, _, _, _, D, D, D, _, _, D, D, D]),
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
    if (px === G) return C;
    if (px === P) return E;
    if (px === D) return S;
    return px;
  }),
);

export const prematureOptimizationBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 500,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
