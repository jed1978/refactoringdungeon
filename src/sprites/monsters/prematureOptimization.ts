import type { SpriteSheet } from '../../utils/types';

// 過早優化魔 (Premature Optimization Wizard)
// Fancy robes but cracking, magnifying glass
// Map sprite: 16×16

const _ = null;      // transparent
const G = '#ffd700'; // gold robes
const D = '#8b4513'; // crack dark brown
const P = '#9933cc'; // robe purple
const W = '#ffffff'; // magnifying glass
const S = '#cc9900'; // gold shadow
const C = '#ffeeaa'; // robe highlight

const frame1 = [
  [_, _, _, D, D, D, D, D, _, _, _, _, _, _, _, _],
  [_, _, D, G, G, G, G, G, D, _, _, _, _, _, _, _],
  [_, D, G, C, G, G, G, C, G, D, _, _, _, _, _, _],
  [_, D, G, G, D, G, G, D, G, D, _, _, _, _, _, _],
  [_, D, G, G, G, G, G, G, G, D, _, W, W, _, _, _],
  [_, _, D, G, G, G, G, G, D, _, _, W, D, W, _, _],
  [_, D, P, P, P, P, P, P, P, D, _, _, W, W, _, _],
  [D, P, P, S, P, P, P, S, P, P, D, _, _, D, _, _],
  [D, P, P, P, P, P, P, P, P, P, D, _, _, _, _, _],
  [D, P, P, D, P, P, P, D, P, P, D, _, _, _, _, _],
  [D, P, P, P, P, P, P, P, P, P, D, _, _, _, _, _],
  [D, P, P, P, D, P, P, D, P, P, D, _, _, _, _, _],
  [_, D, P, P, P, P, P, P, P, D, _, _, _, _, _, _],
  [_, _, D, P, D, P, P, D, P, D, _, _, _, _, _, _],
  [_, _, _, D, D, D, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: cracks shift, wizard sways 1px right
const frame2 = [
  [_, _, _, _, D, D, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, D, G, G, G, G, G, D, _, _, _, _, _, _],
  [_, _, D, G, C, G, G, G, C, G, D, _, _, _, _, _],
  [_, _, D, G, G, D, G, G, D, G, D, _, _, _, _, _],
  [_, _, D, G, G, G, G, G, G, G, D, W, W, _, _, _],
  [_, _, _, D, G, G, G, G, G, D, _, W, D, W, _, _],
  [_, _, D, P, P, P, P, P, P, P, D, _, W, W, _, _],
  [_, D, P, P, S, P, P, P, S, P, P, D, _, D, _, _],
  [_, D, P, P, P, P, P, P, P, P, P, D, _, _, _, _],
  [_, D, P, P, D, P, P, P, D, P, P, D, _, _, _, _],
  [_, D, P, P, P, P, P, P, P, P, P, D, _, _, _, _],
  [_, D, P, P, P, D, P, P, D, P, P, D, _, _, _, _],
  [_, _, D, P, P, P, P, P, P, P, D, _, _, _, _, _],
  [_, _, _, D, P, D, P, P, D, P, D, _, _, _, _, _],
  [_, _, _, _, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const prematureOptimizationSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 500,
};
