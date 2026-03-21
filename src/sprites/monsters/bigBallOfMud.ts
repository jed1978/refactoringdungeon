import type { SpriteSheet } from '../../utils/types';

// 大泥球 (Big Ball of Mud) — Floor 3 Boss
// Massive amorphous blob with bits of other monsters visible inside
// Map sprite: 16×16 (compressed)

const _ = null;      // transparent
const M = '#8b4513'; // brown mud
const D = '#5c2d0a'; // dark mud outline
const R = '#ff4444'; // embedded red bits
const P = '#9933ff'; // embedded purple bits
const Q = '#00ccff'; // embedded cyan bits
const H = '#c47a3a'; // mud highlight

const frame1 = [
  [_, _, D, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, D, M, M, M, M, M, M, M, M, M, D, _, _, _, _],
  [D, M, H, M, R, M, M, P, M, M, H, M, D, _, _, _],
  [D, M, M, M, M, M, M, M, M, M, M, M, D, _, _, _],
  [D, M, R, M, M, M, M, M, M, R, M, M, D, _, _, _],
  [D, M, M, M, P, M, M, M, P, M, M, M, D, _, _, _],
  [D, M, M, M, M, M, Q, M, M, M, M, M, D, _, _, _],
  [_, D, M, M, M, M, M, M, M, M, M, D, _, _, _, _],
  [_, D, M, H, M, M, M, M, M, H, M, D, _, _, _, _],
  [_, D, M, M, M, R, M, M, R, M, M, D, _, _, _, _],
  [D, M, M, M, M, M, M, M, M, M, M, M, D, _, _, _],
  [D, M, M, M, Q, M, M, M, Q, M, M, M, D, _, _, _],
  [D, M, H, M, M, M, M, M, M, M, H, M, D, _, _, _],
  [_, D, M, M, M, M, M, M, M, M, M, D, _, _, _, _],
  [_, _, D, D, D, D, D, D, D, D, D, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: mud bits shift slightly, blob pulses 1px
const frame2 = [
  [_, _, _, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, D, M, M, M, M, M, M, M, D, _, _, _, _, _],
  [_, D, M, H, M, R, M, P, M, H, M, D, _, _, _, _],
  [D, M, M, M, M, M, M, M, M, M, M, M, D, _, _, _],
  [D, M, R, M, M, M, M, M, M, R, M, M, D, _, _, _],
  [D, M, M, M, P, M, M, M, P, M, M, M, D, _, _, _],
  [D, M, M, M, M, M, Q, M, M, M, M, M, D, _, _, _],
  [D, M, M, M, M, M, M, M, M, M, M, M, D, _, _, _],
  [D, M, H, M, M, M, M, M, M, H, M, M, D, _, _, _],
  [D, M, M, M, R, M, M, R, M, M, M, M, D, _, _, _],
  [D, M, M, M, M, M, M, M, M, M, M, M, D, _, _, _],
  [_, D, M, M, Q, M, M, M, Q, M, M, D, _, _, _, _],
  [_, D, M, H, M, M, M, M, M, H, M, D, _, _, _, _],
  [_, _, D, M, M, M, M, M, M, M, D, _, _, _, _, _],
  [_, _, _, D, D, D, D, D, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const bigBallOfMudSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 600,
};
