import type { SpriteSheet } from '../../utils/types';

// 洩漏抽象體 (Leaky Abstraction) — Battle sprite
// Blob/container shape with dripping holes through walls
// Size: 32×32

const _ = null;
const T = '#008888'; // teal body
const C = '#00ffff'; // drip cyan
const H = '#001111'; // hole dark
const L = '#00aaaa'; // teal light highlight
const D = '#003333'; // dark outline
const W = '#88ffff'; // hit highlight

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([_, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, _, _, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, _, _, D, T, L, T, T, T, T, T, T, T, T, T, T, T, T, L, T, D]),
  r32([_, _, D, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, D]),
  r32([_, D, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([D, T, L, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, L, T, D]),
  r32([D, T, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, T, D]),
  r32([_, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, _, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, _, D, T, L, T, T, H, T, T, T, T, T, T, H, T, T, L, T, D]),
  r32([_, _, _, D, T, T, T, H, T, T, T, T, T, T, H, T, T, T, D]),
  r32([_, _, _, _, D, D, T, C, D, D, D, D, D, D, C, T, D, D]),
  r32([_, _, _, _, _, _, D, C, D, _, _, _, _, D, C, D]),
  r32([_, _, _, _, _, _, _, C, _, _, _, _, _, C]),
  r32([_, _, _, _, _, _, _, C, _, _, _, _, _, _, C]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, C]),
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

// Frame 2: drips extend 1px further down
const idleFrame2: (string | null)[][] = [
  r32([_, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, _, _, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, _, _, D, T, L, T, T, T, T, T, T, T, T, T, T, T, T, L, T, D]),
  r32([_, _, D, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, D]),
  r32([_, D, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([D, T, L, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, L, T, D]),
  r32([D, T, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, T, D]),
  r32([D, T, T, T, T, T, T, H, T, T, T, T, T, T, H, T, T, T, T, T, T, D]),
  r32([_, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, _, D, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, D]),
  r32([_, _, D, T, L, T, T, H, T, T, T, T, T, T, H, T, T, L, T, D]),
  r32([_, _, _, D, T, T, T, H, T, T, T, T, T, T, H, T, T, T, D]),
  r32([_, _, _, _, D, D, T, C, D, D, D, D, D, D, C, T, D, D]),
  r32([_, _, _, _, _, _, D, C, D, _, _, _, _, D, C, D]),
  r32([_, _, _, _, _, _, _, C, _, _, _, _, _, C]),
  r32([_, _, _, _, _, _, _, C, _, _, _, _, _, C]),
  r32([_, _, _, _, _, _, _, C, _, _, _, _, _, _, C]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, C]),
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
    if (px === T) return W;
    if (px === D) return H;
    return px;
  }),
);

export const leakyAbstractionBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 450,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
