import type { SpriteSheet } from '../../utils/types';

// 資料泥團 (Data Clump)
// Multiple small data shapes stuck together uncomfortably
// Map sprite: 16×16

const _ = null;      // transparent
const G = '#888899'; // gray base
const R = '#ff4444'; // stuck-together red line
const B = '#4488ff'; // data bits blue
const W = '#aaaacc'; // highlight gray
const D = '#445566'; // dark outline

const frame1 = [
  [_, D, D, D, _, D, D, D, _, D, D, _, _, _, _, _],
  [D, G, G, G, D, G, G, G, D, G, G, D, _, _, _, _],
  [D, G, W, G, R, G, B, G, R, G, W, G, D, _, _, _],
  [D, G, G, G, D, G, G, G, D, G, G, D, _, _, _, _],
  [_, D, R, R, R, R, R, R, R, R, D, _, _, _, _, _],
  [D, G, G, G, D, G, G, G, D, G, G, D, _, _, _, _],
  [D, G, B, G, R, G, W, G, R, G, B, G, D, _, _, _],
  [D, G, G, G, D, G, G, G, D, G, G, D, _, _, _, _],
  [_, D, D, D, _, D, D, D, _, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: clumps shift 1px together — red lines pull inward
const frame2 = [
  [_, _, D, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, D, G, G, G, G, G, G, G, G, D, _, _, _, _, _],
  [D, G, W, G, R, G, B, G, R, G, W, D, _, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [D, R, R, R, R, R, R, R, R, R, R, D, _, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [D, G, B, G, R, G, W, G, R, G, B, D, _, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [_, D, D, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const dataClumpSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 400,
};
