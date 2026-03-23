import type { SpriteSheet } from '../../utils/types';

// 義大利麵蟲 (Spaghetti Code) — 16×16 map sprite
// Tangled noodle worm with red/orange marinara accents

const R = '#cc4422'; // marinara red
const O = '#ee7744'; // orange noodle
const Y = '#ddaa55'; // yellow noodle
const W = '#f5ddb0'; // pale noodle
const D = '#883311'; // dark outline
const _ = null;      // transparent

// prettier-ignore
const frame1: (string | null)[][] = [
  [_, _, _, D, D, D, _, _, _, D, D, _, _, _, _, _],
  [_, _, D, O, O, O, D, _, D, Y, Y, D, _, _, _, _],
  [_, D, O, W, O, R, O, D, Y, W, Y, Y, D, _, _, _],
  [_, D, O, R, O, O, O, Y, W, Y, Y, W, D, _, _, _],
  [D, O, O, O, W, O, Y, Y, W, W, Y, D, _, _, _, _],
  [D, O, R, O, O, O, W, Y, Y, W, D, _, _, _, _, _],
  [D, O, O, W, O, R, O, Y, W, D, _, D, D, _, _, _],
  [_, D, O, O, O, O, O, W, D, _, D, O, O, D, _, _],
  [_, _, D, R, O, W, O, D, _, D, O, W, O, R, D, _],
  [_, _, D, O, O, O, D, D, D, O, O, O, O, O, D, _],
  [_, _, _, D, O, O, O, O, O, W, O, R, O, D, _, _],
  [_, _, _, _, D, O, W, O, O, O, O, O, D, _, _, _],
  [_, _, _, _, _, D, O, O, R, O, W, D, _, _, _, _],
  [_, _, _, _, _, D, R, O, O, O, D, _, _, _, _, _],
  [_, _, _, _, _, _, D, D, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: slight wriggle (shift some noodle pixels)
// prettier-ignore
const frame2: (string | null)[][] = [
  [_, _, _, _, D, D, D, _, _, D, D, _, _, _, _, _],
  [_, _, _, D, O, O, O, D, D, Y, Y, D, _, _, _, _],
  [_, _, D, O, W, O, R, O, Y, W, Y, Y, D, _, _, _],
  [_, D, O, R, O, O, O, Y, W, Y, Y, W, D, _, _, _],
  [_, D, O, O, W, O, Y, Y, W, W, Y, D, _, _, _, _],
  [D, O, R, O, O, O, W, Y, Y, W, D, _, _, _, _, _],
  [D, O, O, W, O, R, O, Y, W, D, _, D, D, _, _, _],
  [D, O, O, O, O, O, O, W, D, _, D, O, O, D, _, _],
  [_, D, O, R, O, W, O, D, _, D, O, W, O, R, D, _],
  [_, _, D, O, O, O, D, D, D, O, O, O, O, O, D, _],
  [_, _, _, D, O, O, O, O, O, W, O, R, O, D, _, _],
  [_, _, _, _, D, O, W, O, O, O, O, O, D, _, _, _],
  [_, _, _, _, D, O, O, R, O, W, O, D, _, _, _, _],
  [_, _, _, _, _, D, R, O, O, O, D, _, _, _, _, _],
  [_, _, _, _, _, _, D, D, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const spaghettiCodeSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 350,
};
