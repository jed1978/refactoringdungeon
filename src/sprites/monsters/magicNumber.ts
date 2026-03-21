import type { SpriteSheet } from '../../utils/types';

// 魔數精靈 (Magic Number Sprite)
// Floating number entity with glitchy aura
// Body made of jumbled digit shapes, flickering edge pixels

const P = '#9933ff'; // glitch purple (main body)
const D = '#6622cc'; // dark purple
const C = '#00ffff'; // bright cyan (glitch accents)
const T = '#00cccc'; // teal
const W = '#ffffff'; // white (digit highlights)
const K = '#220044'; // near-black outline
const _ = null;      // transparent

const frame1 = [
  [_, _, _, _, C, _, _, _, _, _, _, C, _, _, _, _],
  [_, _, _, K, K, K, _, _, _, K, K, K, _, _, _, _],
  [_, _, K, P, P, P, K, _, K, P, P, P, K, _, _, _],
  [_, K, P, W, P, W, P, K, D, W, D, W, D, K, _, _],
  [_, K, P, P, W, P, P, K, D, D, W, D, D, K, _, _],
  [_, K, P, W, W, W, P, K, D, W, W, W, D, K, _, _],
  [_, _, K, P, P, P, K, K, K, D, D, D, K, _, _, _],
  [_, _, _, K, K, K, P, P, P, K, K, K, _, _, _, _],
  [_, _, K, P, W, P, P, K, P, P, W, P, K, _, _, _],
  [_, K, P, P, P, W, P, K, P, W, P, P, P, K, _, _],
  [_, K, P, W, P, P, P, K, P, P, P, W, P, K, _, _],
  [_, _, K, P, P, P, K, _, K, P, P, P, K, _, _, _],
  [_, _, _, K, K, K, _, _, _, K, K, K, _, _, _, _],
  [_, _, _, _, T, _, _, _, _, _, T, _, _, _, _, _],
  [_, _, C, _, _, _, _, _, _, _, _, _, C, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: glitch effect - some edge pixels shift, cyan accents move
const frame2 = [
  [_, _, _, _, _, _, _, C, _, _, _, _, _, _, _, _],
  [_, _, _, K, K, K, _, _, _, K, K, K, _, _, _, _],
  [_, _, K, P, P, P, K, _, K, P, P, P, K, _, _, _],
  [_, K, P, W, P, W, P, K, D, W, D, W, D, K, _, _],
  [_, K, P, P, W, P, P, K, D, D, W, D, D, K, C, _],
  [_, K, P, W, W, W, P, K, D, W, W, W, D, K, _, _],
  [_, _, K, P, P, P, K, K, K, D, D, D, K, _, _, _],
  [_, _, _, K, K, K, P, P, P, K, K, K, _, _, _, _],
  [_, _, K, P, W, P, P, K, P, P, W, P, K, _, _, _],
  [_, K, P, P, P, W, P, K, P, W, P, P, P, K, _, _],
  [C, K, P, W, P, P, P, K, P, P, P, W, P, K, _, _],
  [_, _, K, P, P, P, K, _, K, P, P, P, K, _, _, _],
  [_, _, _, K, K, K, _, _, _, K, K, K, _, _, _, _],
  [_, _, _, _, _, _, T, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, C, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const magicNumberSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 300,
};
