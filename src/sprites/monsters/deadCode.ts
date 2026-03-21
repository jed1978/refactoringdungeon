import type { SpriteSheet } from '../../utils/types';

// 殭屍程式 (Dead Code Zombie)
// Zombie-fied curly brace `{ }` with dead eyes
// Body shaped like curly braces, decomposed zombie feel

const G = '#556b2f'; // zombie green (main body)
const M = '#4a5e25'; // medium green
const K = '#3d4f1c'; // dark green (outline/shadow)
const Y = '#808080'; // gray (bone/teeth)
const A = '#666666'; // dark gray
const R = '#cc0000'; // red eyes
const _ = null;      // transparent

const frame1 = [
  [_, _, _, _, K, K, _, _, _, _, K, K, _, _, _, _],
  [_, _, _, K, G, G, K, _, _, K, G, G, K, _, _, _],
  [_, _, K, G, G, _, K, _, _, K, _, G, G, K, _, _],
  [_, _, K, G, _, _, _, _, _, _, _, _, G, K, _, _],
  [_, _, K, G, _, R, _, _, _, _, R, _, G, K, _, _],
  [_, _, K, G, _, _, _, Y, Y, _, _, _, G, K, _, _],
  [_, _, _, K, G, _, _, A, A, _, _, G, K, _, _, _],
  [_, _, _, _, K, G, _, _, _, _, G, K, _, _, _, _],
  [_, _, _, K, G, _, _, _, _, _, _, G, K, _, _, _],
  [_, _, K, G, _, _, _, Y, Y, _, _, _, G, K, _, _],
  [_, _, K, G, _, _, _, _, _, _, _, _, G, K, _, _],
  [_, _, K, G, M, _, _, _, _, _, _, M, G, K, _, _],
  [_, _, _, K, G, M, _, _, _, _, M, G, K, _, _, _],
  [_, _, _, _, K, G, K, _, _, K, G, K, _, _, _, _],
  [_, _, _, _, _, K, K, _, _, K, K, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: slight wobble/shamble - body shifts 1px right
const frame2 = [
  [_, _, _, _, _, K, K, _, _, _, K, K, _, _, _, _],
  [_, _, _, _, K, G, G, K, _, K, G, G, K, _, _, _],
  [_, _, _, K, G, G, _, K, _, K, _, G, G, K, _, _],
  [_, _, _, K, G, _, _, _, _, _, _, _, G, K, _, _],
  [_, _, _, K, G, _, R, _, _, _, R, _, G, K, _, _],
  [_, _, _, K, G, _, _, Y, Y, _, _, _, G, K, _, _],
  [_, _, _, _, K, G, _, A, A, _, _, G, K, _, _, _],
  [_, _, _, _, _, K, G, _, _, _, G, K, _, _, _, _],
  [_, _, _, _, K, G, _, _, _, _, _, G, K, _, _, _],
  [_, _, _, K, G, _, _, Y, Y, _, _, _, G, K, _, _],
  [_, _, _, K, G, _, _, _, _, _, _, _, G, K, _, _],
  [_, _, _, K, G, M, _, _, _, _, _, M, G, K, _, _],
  [_, _, _, _, K, G, M, _, _, _, M, G, K, _, _, _],
  [_, _, _, _, _, K, G, K, _, K, G, K, _, _, _, _],
  [_, _, _, _, _, _, K, K, _, K, K, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const deadCodeSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 500,
};
