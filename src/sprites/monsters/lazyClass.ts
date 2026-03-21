import type { SpriteSheet } from '../../utils/types';

// 懶惰類別 (Lazy Class)
// Cube with Z's floating above, thick shell, tiny stubby limbs
// Map sprite: 16×16

const _ = null;      // transparent
const S = '#667788'; // slate blue body
const D = '#334455'; // dark wall/outline
const Z = '#ffd700'; // zzz gold
const W = '#99aabb'; // highlight
const L = '#445566'; // limbs

const frame1 = [
  [_, _, Z, _, _, Z, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, Z, _, _, Z, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, D, D, D, D, D, D, D, D, D, D, D, _, _, _, _],
  [D, S, S, S, S, S, S, S, S, S, S, S, D, _, _, _],
  [D, S, W, S, S, S, S, S, S, S, W, S, D, _, _, _],
  [D, S, S, S, S, S, S, S, S, S, S, S, D, _, _, _],
  [D, D, S, S, S, S, S, S, S, S, S, D, D, _, _, _],
  [_, _, D, S, S, S, S, S, S, S, D, _, _, _, _, _],
  [D, D, D, S, S, S, S, S, S, S, D, D, D, _, _, _],
  [_, L, D, S, S, S, S, S, S, S, D, L, _, _, _, _],
  [_, L, D, S, S, S, S, S, S, S, D, L, _, _, _, _],
  [_, _, D, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, L, L, _, _, _, _, _, _, _, _, L, L, _, _, _],
  [_, D, D, _, _, _, _, _, _, _, _, D, D, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: Z's drift upward 1px, limbs sag slightly
const frame2 = [
  [Z, _, _, Z, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, Z, _, _, Z, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, Z, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, D, D, D, D, D, D, D, D, D, D, D, _, _, _, _],
  [D, S, S, S, S, S, S, S, S, S, S, S, D, _, _, _],
  [D, S, W, S, S, S, S, S, S, S, W, S, D, _, _, _],
  [D, S, S, S, S, S, S, S, S, S, S, S, D, _, _, _],
  [D, D, S, S, S, S, S, S, S, S, S, D, D, _, _, _],
  [_, _, D, S, S, S, S, S, S, S, D, _, _, _, _, _],
  [D, D, D, S, S, S, S, S, S, S, D, D, D, _, _, _],
  [_, L, D, S, S, S, S, S, S, S, D, L, _, _, _, _],
  [_, _, D, S, S, S, S, S, S, S, D, _, _, _, _, _],
  [_, _, D, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, L, L, _, _, _, _, _, L, L, _, _, _, _, _],
  [_, _, D, D, _, _, _, _, _, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const lazyClassSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 700,
};
