import type { SpriteSheet } from '../../utils/types';

// N+1 查詢蟲 (N+1 Query Bug)
// Bug with "+1" on body, afterimages trailing behind
// Map sprite: 16×16

const _ = null;      // transparent
const C = '#00ffcc'; // cyan body
const D = '#006655'; // dark teal outline
const G = '#88ffee'; // ghost afterimage (lighter)
const W = '#ffffff'; // white "+1" text pixels
const H = '#00ddaa'; // highlight

const frame1 = [
  [_, _, G, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, G, D, G, _, _, _, _, _, _, _, _, _, _, _, _],
  [G, D, G, D, G, _, _, D, D, D, D, _, _, _, _, _],
  [_, G, D, G, _, _, D, C, C, C, C, D, _, _, _, _],
  [_, _, G, _, _, D, C, W, C, W, C, C, D, _, _, _],
  [_, _, _, _, D, C, C, C, C, C, C, C, C, D, _, _],
  [_, _, _, D, C, H, C, C, C, C, C, H, C, C, D, _],
  [_, _, D, C, C, C, C, C, C, C, C, C, C, C, C, D],
  [_, _, D, C, C, C, C, C, C, C, C, C, C, C, C, D],
  [_, _, _, D, C, H, C, C, C, C, C, H, C, C, D, _],
  [_, _, _, _, D, C, C, C, C, C, C, C, C, D, _, _],
  [_, _, _, _, _, D, C, C, C, C, C, C, D, _, _, _],
  [_, _, _, _, _, _, D, D, D, D, D, D, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: afterimages shift 1px to the left
const frame2 = [
  [G, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [D, G, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [G, D, G, _, _, _, D, D, D, D, _, _, _, _, _, _],
  [_, G, D, G, _, D, C, C, C, C, D, _, _, _, _, _],
  [_, _, G, _, D, C, W, C, W, C, C, D, _, _, _, _],
  [_, _, _, D, C, C, C, C, C, C, C, C, D, _, _, _],
  [_, _, D, C, H, C, C, C, C, C, H, C, C, D, _, _],
  [_, D, C, C, C, C, C, C, C, C, C, C, C, C, D, _],
  [_, D, C, C, C, C, C, C, C, C, C, C, C, C, D, _],
  [_, _, D, C, H, C, C, C, C, C, H, C, C, D, _, _],
  [_, _, _, D, C, C, C, C, C, C, C, C, D, _, _, _],
  [_, _, _, _, D, C, C, C, C, C, C, D, _, _, _, _],
  [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const nPlusOneSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 350,
};
