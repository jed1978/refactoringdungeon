import type { SpriteSheet } from '../../utils/types';

// 散彈修改鳥 (Shotgun Surgery Bird)
// Bird with fragmented body, pieces floating apart
// Map sprite: 16×16

const _ = null;      // transparent
const O = '#ff8833'; // orange body
const D = '#aa5522'; // dark outline
const Y = '#ffcc00'; // fragment yellow
const W = '#ffaa55'; // highlight orange

const frame1 = [
  [_, _, _, _, _, _, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, _, _, D, O, O, O, D, _, _, _, _, _, _],
  [_, _, _, _, D, O, W, O, O, O, D, _, _, _, _, _],
  [_, Y, _, _, D, O, O, O, O, O, D, _, _, _, _, _],
  [_, _, _, D, O, O, D, D, O, O, O, D, _, _, _, _],
  [_, _, D, O, O, D, _, _, D, O, O, O, D, _, _, _],
  [_, _, D, O, O, O, O, O, O, O, O, O, D, Y, _, _],
  [_, D, O, O, Y, O, O, O, O, Y, O, O, O, D, _, _],
  [_, D, O, O, O, O, O, O, O, O, O, O, D, _, _, _],
  [_, _, D, O, O, O, D, D, O, O, O, D, _, _, Y, _],
  [_, _, _, D, D, O, O, O, O, O, D, D, _, _, _, _],
  [_, Y, _, _, _, D, D, O, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, D, O, D, _, _, _, Y, _, _, _],
  [_, _, _, _, _, D, O, O, O, D, _, _, _, _, _, _],
  [_, _, _, _, _, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: fragments shifted 1-2px for scatter animation
const frame2 = [
  [_, _, _, _, _, _, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, _, _, D, O, O, O, D, _, _, _, _, _, _],
  [_, Y, _, _, D, O, W, O, O, O, D, _, _, _, _, _],
  [_, _, _, _, D, O, O, O, O, O, D, _, _, _, _, _],
  [_, _, _, D, O, O, D, D, O, O, O, D, _, Y, _, _],
  [_, _, D, O, O, D, _, _, D, O, O, O, D, _, _, _],
  [_, _, D, O, O, O, O, O, O, O, O, O, D, _, _, _],
  [_, D, O, O, Y, O, O, O, O, Y, O, O, O, D, _, _],
  [_, D, O, O, O, O, O, O, O, O, O, O, D, _, _, _],
  [_, _, D, O, O, O, D, D, O, O, O, D, _, _, _, _],
  [_, _, Y, D, D, O, O, O, O, O, D, D, _, _, Y, _],
  [_, _, _, _, _, D, D, O, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, D, O, D, _, _, _, _, _, _, _],
  [_, _, _, Y, _, D, O, O, O, D, _, _, _, _, _, _],
  [_, _, _, _, _, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const shotgunSurgerySprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 300,
};
