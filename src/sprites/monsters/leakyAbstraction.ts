import type { SpriteSheet } from '../../utils/types';

// 洩漏抽象體 (Leaky Abstraction)
// Blob/container shape with dripping holes
// Map sprite: 16×16

const _ = null;      // transparent
const T = '#008888'; // teal body
const C = '#00ffff'; // drip cyan
const H = '#001111'; // hole dark
const L = '#00aaaa'; // teal light highlight
const D = '#003333'; // dark teal outline

const frame1 = [
  [_, _, D, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, D, T, T, T, T, T, T, T, T, D, _, _, _, _, _],
  [D, T, L, T, H, T, T, H, T, L, T, D, _, _, _, _],
  [D, T, T, T, H, T, T, H, T, T, T, D, _, _, _, _],
  [D, T, T, T, T, T, T, T, T, T, T, D, _, _, _, _],
  [D, T, T, T, T, T, T, T, T, T, T, D, _, _, _, _],
  [D, T, T, T, H, T, T, H, T, T, T, D, _, _, _, _],
  [_, D, T, T, H, T, T, H, T, T, D, _, _, _, _, _],
  [_, _, D, T, C, T, T, C, T, D, _, _, _, _, _, _],
  [_, _, _, D, C, D, D, C, D, _, _, _, _, _, _, _],
  [_, _, _, _, C, _, _, C, _, _, _, _, _, _, _, _],
  [_, _, _, _, C, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: drips move 1px down
const frame2 = [
  [_, _, D, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, D, T, T, T, T, T, T, T, T, D, _, _, _, _, _],
  [D, T, L, T, H, T, T, H, T, L, T, D, _, _, _, _],
  [D, T, T, T, H, T, T, H, T, T, T, D, _, _, _, _],
  [D, T, T, T, T, T, T, T, T, T, T, D, _, _, _, _],
  [D, T, T, T, T, T, T, T, T, T, T, D, _, _, _, _],
  [D, T, T, T, H, T, T, H, T, T, T, D, _, _, _, _],
  [_, D, T, T, H, T, T, H, T, T, D, _, _, _, _, _],
  [_, _, D, T, T, T, T, T, T, D, _, _, _, _, _, _],
  [_, _, _, D, C, D, D, C, D, _, _, _, _, _, _, _],
  [_, _, _, _, C, _, _, C, _, _, _, _, _, _, _, _],
  [_, _, _, _, C, _, _, C, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, C, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const leakyAbstractionSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 450,
};
