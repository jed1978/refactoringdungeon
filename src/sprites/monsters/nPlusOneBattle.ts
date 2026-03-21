import type { SpriteSheet } from '../../utils/types';

// N+1 查詢蟲 (N+1 Query Bug) — Battle sprite
// Bug with "+1" on body, afterimage trails
// Size: 32×32

const _ = null;
const C = '#00ffcc'; // cyan body
const D = '#006655'; // dark teal outline
const G = '#88ffee'; // ghost afterimage
const W = '#ffffff'; // white "+1" text
const H = '#00ddaa'; // highlight
const S = '#004433'; // deep shadow

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([G, _, G, _, _, _, _, _, _, _, _, _]),
  r32([_, G, _, G, _, _, _, _, _, _, _, _]),
  r32([_, _, G, _, _, _, _, _, _, _, _, _]),
  r32([_, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, _, _, _, D, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([_, _, _, _, D, C, H, C, C, C, C, C, C, C, C, C, H, C, D]),
  r32([_, _, _, D, C, C, C, C, W, C, C, W, C, C, C, C, C, C, D]),
  r32([_, _, _, D, C, C, C, C, W, C, C, C, C, C, C, C, C, C, D]),
  r32([_, _, D, C, C, C, C, C, W, C, W, W, W, C, C, C, C, C, C, D]),
  r32([_, _, D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([_, D, C, C, H, C, C, C, C, C, C, C, C, C, C, C, C, H, C, D]),
  r32([_, D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([D, C, C, C, C, C, D, D, C, C, C, C, D, D, C, C, C, C, C, C, D]),
  r32([_, D, C, C, D, _, _, D, C, C, C, D, _, _, D, C, C, C, C, D]),
  r32([_, _, D, D, _, _, _, D, C, C, D, _, _, _, D, C, C, C, D]),
  r32([_, _, _, _, _, _, D, C, C, C, C, D, _, _, D, C, C, D]),
  r32([_, _, _, _, _, D, C, C, C, C, C, D, _, D, C, C, C, D]),
  r32([_, _, _, _, _, _, D, D, D, D, D, D, _, D, D, D, D, D]),
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

// Frame 2: afterimages shift 1px left
const idleFrame2: (string | null)[][] = [
  r32([_, G, _, G, _, _, _, _, _, _, _, _]),
  r32([G, _, G, _, _, _, _, _, _, _, _, _]),
  r32([_, G, _, _, _, _, _, _, _, _, _, _]),
  r32([_, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, _, _, _, D, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([_, _, _, _, D, C, H, C, C, C, C, C, C, C, C, C, H, C, D]),
  r32([_, _, _, D, C, C, C, C, W, C, C, W, C, C, C, C, C, C, D]),
  r32([_, _, _, D, C, C, C, C, C, C, W, C, C, C, C, C, C, C, D]),
  r32([_, _, D, C, C, C, C, C, W, W, W, C, C, C, C, C, C, C, C, D]),
  r32([_, _, D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([_, D, C, C, H, C, C, C, C, C, C, C, C, C, C, C, C, H, C, D]),
  r32([_, D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, D]),
  r32([D, C, C, C, C, C, D, D, C, C, C, C, D, D, C, C, C, C, C, C, D]),
  r32([_, D, C, C, D, _, _, D, C, C, C, D, _, _, D, C, C, C, C, D]),
  r32([_, _, D, D, _, _, _, D, C, C, D, _, _, _, D, C, C, C, D]),
  r32([_, _, _, _, _, _, D, C, C, C, C, D, _, _, D, C, C, D]),
  r32([_, _, _, _, _, D, C, C, C, C, C, D, _, D, C, C, C, D]),
  r32([_, _, _, _, _, _, D, D, D, D, D, D, _, D, D, D, D, D]),
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
    if (px === C) return W;
    if (px === D) return S;
    return px;
  }),
);

export const nPlusOneBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 350,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
