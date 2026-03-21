import type { SpriteSheet } from '../../utils/types';

// 懶惰類別 (Lazy Class) — Battle sprite
// Cube with Z's floating, thick shell, tiny stubby limbs
// Size: 32×32

const _ = null;
const S = '#667788'; // slate blue body
const D = '#334455'; // dark wall/outline
const Z = '#ffd700'; // zzz gold
const W = '#99aabb'; // highlight
const L = '#445566'; // limbs
const E = '#ffffff'; // hit flash

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([_, _, _, Z, _, _, _, Z, _, _, _, _, _, _, _, _]),
  r32([_, _, _, _, Z, _, _, _, Z, _, _, _, _, _, _, _]),
  r32([_, _, _, _, _, Z, _, _, _, _, _, _, _, _, _, _]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]),
  r32([_, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, S, W, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, W, S, D]),
  r32([D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, D]),
  r32([_, _, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, D, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, D, D]),
  r32([_, L, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, L]),
  r32([_, L, D, S, W, S, S, S, S, S, S, S, S, S, S, S, S, S, W, S, D, L]),
  r32([_, L, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, L]),
  r32([_, _, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, D, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, D, D]),
  r32([_, L, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, L]),
  r32([_, L, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, L]),
  r32([_, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, L, L, L, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L]),
  r32([_, D, D, D, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, D, D, D]),
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

// Frame 2: Z's drift upward 1px
const idleFrame2: (string | null)[][] = [
  r32([_, Z, _, _, Z, _, _, Z, _, _, _, _, _, _, _, _]),
  r32([_, _, Z, _, _, Z, _, _, _, _, _, _, _, _, _, _]),
  r32([_, _, _, Z, _, _, _, _, _, _, _, _, _, _, _, _]),
  r32([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]),
  r32([_, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, S, W, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, W, S, D]),
  r32([D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, D]),
  r32([_, _, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, D, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, D, D]),
  r32([_, L, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, L]),
  r32([_, L, D, S, W, S, S, S, S, S, S, S, S, S, S, S, S, S, W, S, D, L]),
  r32([_, L, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, L]),
  r32([_, _, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([D, D, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D, D, D]),
  r32([_, _, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([_, _, D, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, D]),
  r32([_, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r32([_, _, L, L, L, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L]),
  r32([_, _, D, D, D, _, _, _, _, _, _, _, _, _, _, _, _, D, D, D]),
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
    if (px === S) return E;
    if (px === D) return L;
    return px;
  }),
);

export const lazyClassBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 700,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
