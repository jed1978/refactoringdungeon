import type { SpriteSheet } from '../../utils/types';

// 長方法獸 (Long Method Beast)
// Comically tall thin creature, gray-blue body, scrollbar on its side
// Map sprite: 16×16 (compressed version of tall body)

const _ = null;      // transparent
const B = '#8899bb'; // gray-blue body
const D = '#445566'; // dark outline
const W = '#ffffff'; // scrollbar white
const S = '#aabbcc'; // scrollbar highlight
const T = '#334455'; // scrollbar track dark

const frame1 = [
  [_, _, _, _, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, W, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, S, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, W, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, W, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, S, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, _, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: scrollbar indicator moves down 2px
const frame2 = [
  [_, _, _, _, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, W, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, S, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, W, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, W, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, T, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, B, D, T, _, _, _, _],
  [_, _, _, _, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const longMethodSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 600,
};
