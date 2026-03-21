import type { SpriteSheet } from '../../utils/types';

// 越界觸手怪 (Feature Envy)
// Octopus-like with tentacles crossing a dotted boundary line
// Map sprite: 16×16

const _ = null;      // transparent
const P = '#9933ff'; // purple body
const D = '#6622cc'; // dark purple outline
const G = '#00ff88'; // tentacle tip green
const W = '#cc88ff'; // highlight purple
const L = '#ffff44'; // dotted boundary line yellow

const frame1 = [
  [_, _, _, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, D, P, P, P, P, P, P, P, D, _, _, _, _, _],
  [_, D, P, W, P, P, P, P, P, W, P, D, _, _, _, _],
  [D, P, P, P, P, P, P, P, P, P, P, P, D, _, _, _],
  [D, P, P, P, P, P, P, P, P, P, P, P, D, L, L, L],
  [D, P, P, D, D, P, P, P, D, D, P, P, D, _, _, _],
  [_, D, P, D, P, D, P, P, D, P, D, P, D, L, L, L],
  [_, _, D, D, _, D, P, P, D, _, D, D, _, _, _, _],
  [_, _, _, D, D, D, P, P, D, D, D, _, _, L, L, L],
  [_, _, G, _, D, P, P, P, P, D, _, G, _, _, _, _],
  [_, G, _, _, D, P, P, P, D, _, _, _, G, L, L, L],
  [G, _, _, _, D, P, P, D, _, _, _, _, _, _, _, _],
  [_, _, _, _, D, D, P, D, D, _, _, _, _, L, L, L],
  [_, _, _, _, _, D, D, D, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, L, L, L],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: tentacles shift slightly
const frame2 = [
  [_, _, _, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, D, P, P, P, P, P, P, P, D, _, _, _, _, _],
  [_, D, P, W, P, P, P, P, P, W, P, D, _, _, _, _],
  [D, P, P, P, P, P, P, P, P, P, P, P, D, _, _, _],
  [D, P, P, P, P, P, P, P, P, P, P, P, D, L, L, L],
  [D, P, P, D, D, P, P, P, D, D, P, P, D, _, _, _],
  [_, D, P, D, P, D, P, P, D, P, D, P, D, L, L, L],
  [_, _, D, D, _, D, P, P, D, _, D, D, _, _, _, _],
  [_, _, _, D, D, D, P, P, D, D, D, _, _, L, L, _],
  [_, _, G, _, D, P, P, P, P, D, G, _, _, _, _, _],
  [_, G, _, _, D, P, P, P, D, _, _, G, _, L, L, _],
  [G, _, _, _, D, P, P, D, _, _, _, _, G, _, _, _],
  [_, _, _, _, D, D, P, D, D, _, _, _, _, L, L, _],
  [_, _, _, _, _, D, D, D, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, L, L, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const featureEnvySprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 400,
};
