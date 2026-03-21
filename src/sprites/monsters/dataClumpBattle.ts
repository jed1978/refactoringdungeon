import type { SpriteSheet } from '../../utils/types';

// 資料泥團 (Data Clump) — Battle sprite
// Multiple stuck-together data shapes, uncomfortable cluster
// Size: 32×32

const _ = null;
const G = '#888899'; // gray base
const R = '#ff4444'; // stuck-together red line
const B = '#4488ff'; // data bits blue
const W = '#aaaacc'; // highlight gray
const D = '#445566'; // dark outline
const E = '#ffffff'; // hit flash white

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([_, _, D, D, D, _, _, D, D, D, _, _, D, D, D, _]),
  r32([_, D, G, G, G, D, D, G, G, G, D, D, G, G, G, D]),
  r32([D, G, W, G, G, G, R, G, B, G, R, G, W, G, G, D]),
  r32([D, G, G, G, G, G, R, G, G, G, R, G, G, G, G, D]),
  r32([D, G, G, B, G, G, R, G, B, G, R, G, G, B, G, D]),
  r32([_, D, G, G, G, R, R, R, R, R, R, R, G, G, D]),
  r32([_, D, G, G, G, R, R, R, R, R, R, R, G, G, D]),
  r32([D, G, G, B, G, G, R, G, B, G, R, G, G, B, G, D]),
  r32([D, G, G, G, G, G, R, G, G, G, R, G, G, G, G, D]),
  r32([D, G, W, G, G, G, R, G, B, G, R, G, W, G, G, D]),
  r32([_, D, G, G, G, D, D, G, G, G, D, D, G, G, G, D]),
  r32([_, _, D, D, D, _, _, D, D, D, _, _, D, D, D, _]),
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
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
];

// Frame 2: clumps squeezed 1px tighter together
const idleFrame2: (string | null)[][] = [
  r32([_, _, _, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, D, G, G, G, G, G, G, G, G, G, G, G, D]),
  r32([_, D, G, W, G, G, R, G, B, G, R, G, W, G, G, D]),
  r32([D, G, G, G, G, G, R, G, G, G, R, G, G, G, G, D]),
  r32([D, G, G, B, G, G, R, G, B, G, R, G, G, B, G, D]),
  r32([D, R, R, R, R, R, R, R, R, R, R, R, R, R, R, D]),
  r32([D, R, R, R, R, R, R, R, R, R, R, R, R, R, R, D]),
  r32([D, G, G, B, G, G, R, G, B, G, R, G, G, B, G, D]),
  r32([D, G, G, G, G, G, R, G, G, G, R, G, G, G, G, D]),
  r32([_, D, G, W, G, G, R, G, B, G, R, G, W, G, G, D]),
  r32([_, _, D, G, G, G, G, G, G, G, G, G, G, G, D]),
  r32([_, _, _, D, D, D, D, D, D, D, D, D, D, D, _]),
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
    if (px === G) return E;
    if (px === D) return R;
    return px;
  }),
);

export const dataClumpBattleSprite: Record<string, SpriteSheet> = {
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
