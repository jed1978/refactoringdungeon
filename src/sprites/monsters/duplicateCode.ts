import type { SpriteSheet } from '../../utils/types';

// 複製貼上靈 (Duplicate Code Ghost)
// Twin ghostly clipboard shapes - two overlapping translucent forms
// Palette: ghostly white, pale blue, dark outline

const W = '#e8e8e8'; // white ghost body
const G = '#d0d0d0'; // gray ghost shadow
const B = '#b8c8e0'; // pale blue highlight
const D = '#8899bb'; // darker blue
const O = '#445566'; // dark outline
const _ = null;      // transparent

const frame1 = [
  [_, _, _, _, O, O, O, _, _, O, O, O, _, _, _, _],
  [_, _, _, O, W, W, W, O, O, B, B, B, O, _, _, _],
  [_, _, O, W, W, W, W, O, B, B, B, B, B, O, _, _],
  [_, _, O, W, O, W, O, W, B, O, B, O, B, O, _, _],
  [_, _, O, W, W, W, W, W, B, B, B, B, B, O, _, _],
  [_, _, O, W, G, G, G, W, B, D, D, D, B, O, _, _],
  [_, _, O, W, W, W, W, W, B, B, B, B, B, O, _, _],
  [_, _, O, W, G, W, G, W, B, D, B, D, B, O, _, _],
  [_, _, O, W, W, W, W, W, B, B, B, B, B, O, _, _],
  [_, _, O, W, G, G, G, W, B, D, D, D, B, O, _, _],
  [_, _, O, W, W, W, W, O, B, B, B, B, B, O, _, _],
  [_, _, _, O, W, W, O, _, O, B, B, B, O, _, _, _],
  [_, _, _, O, W, O, _, _, _, O, B, O, _, _, _, _],
  [_, _, O, _, O, _, _, _, _, _, O, _, O, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: bob up 1px (top row gains content, bottom row loses)
const frame2 = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, O, O, O, _, _, O, O, O, _, _, _, _],
  [_, _, _, O, W, W, W, O, O, B, B, B, O, _, _, _],
  [_, _, O, W, W, W, W, O, B, B, B, B, B, O, _, _],
  [_, _, O, W, O, W, O, W, B, O, B, O, B, O, _, _],
  [_, _, O, W, W, W, W, W, B, B, B, B, B, O, _, _],
  [_, _, O, W, G, G, G, W, B, D, D, D, B, O, _, _],
  [_, _, O, W, W, W, W, W, B, B, B, B, B, O, _, _],
  [_, _, O, W, G, W, G, W, B, D, B, D, B, O, _, _],
  [_, _, O, W, W, W, W, W, B, B, B, B, B, O, _, _],
  [_, _, O, W, G, G, G, W, B, D, D, D, B, O, _, _],
  [_, _, O, W, W, W, W, O, B, B, B, B, B, O, _, _],
  [_, _, _, O, W, W, O, _, O, B, B, B, O, _, _, _],
  [_, _, _, O, W, O, _, _, _, O, B, O, _, _, _, _],
  [_, _, O, _, O, _, _, _, _, _, O, _, O, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const duplicateCodeSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 400,
};
