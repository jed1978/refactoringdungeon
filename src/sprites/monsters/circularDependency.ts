import type { SpriteSheet } from '../../utils/types';

// 循環依賴蛇 (Circular Dependency Snake)
// Ouroboros snake eating its own tail — map sprite 16×16

const _ = null;      // transparent
const E = '#00cc66'; // emerald green snake body
const D = '#006633'; // dark green outline
const G = '#ffd700'; // gold arrow/eye
const L = '#00ff88'; // light green highlight

const frame1 = [
  [_, _, _, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, D, E, E, E, E, E, E, E, E, D, _, _, _, _],
  [_, D, E, L, E, E, E, E, E, E, E, E, D, _, _, _],
  [D, E, E, E, D, _, _, _, _, _, D, E, E, D, _, _],
  [D, E, E, E, _, _, G, _, _, G, _, E, E, E, D, _],
  [D, E, E, D, _, _, _, _, _, _, _, D, E, E, D, _],
  [_, D, E, _, _, _, G, G, G, _, _, _, E, D, _, _],
  [_, _, D, _, _, _, _, G, _, _, _, _, D, _, _, _],
  [_, _, D, _, _, _, _, _, _, _, _, _, D, _, _, _],
  [_, D, E, _, _, _, G, G, G, _, _, _, E, D, _, _],
  [D, E, E, D, _, _, _, _, _, _, _, D, E, E, D, _],
  [D, E, E, E, _, _, G, _, _, G, _, E, E, E, D, _],
  [D, E, E, E, D, _, _, _, _, _, D, E, E, D, _, _],
  [_, D, E, E, E, E, E, E, E, E, E, E, D, _, _, _],
  [_, _, D, D, D, D, D, D, D, D, D, D, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: snake body shifts 1px clockwise around the ring
const frame2 = [
  [_, _, _, _, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, D, E, E, E, E, E, E, E, D, _, _, _, _],
  [_, _, D, E, L, E, E, E, E, E, E, E, D, _, _, _],
  [_, D, E, E, E, D, _, _, _, _, D, E, E, D, _, _],
  [D, E, E, E, _, _, G, _, _, G, _, E, E, E, D, _],
  [D, E, E, D, _, _, _, _, _, _, _, D, E, E, D, _],
  [_, D, E, _, _, _, G, G, G, _, _, _, E, D, _, _],
  [_, _, D, _, _, _, _, G, _, _, _, _, D, _, _, _],
  [_, _, D, _, _, _, _, _, _, _, _, _, D, _, _, _],
  [_, D, E, _, _, _, G, G, G, _, _, _, E, D, _, _],
  [D, E, E, D, _, _, _, _, _, _, _, D, E, E, D, _],
  [D, E, E, E, _, _, G, _, _, G, _, E, E, E, D, _],
  [D, E, E, E, D, _, _, _, _, D, _, E, E, D, _, _],
  [_, D, E, E, E, E, E, E, E, E, E, E, D, _, _, _],
  [_, _, _, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const circularDependencySprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 500,
};
