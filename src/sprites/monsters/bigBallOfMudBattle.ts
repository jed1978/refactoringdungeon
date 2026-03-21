import type { SpriteSheet } from '../../utils/types';

// 大泥球 (Big Ball of Mud) — BOSS Battle sprite
// Massive amorphous blob with bits of monsters inside
// Size: 48×48

const _ = null;
const M = '#8b4513'; // brown mud
const D = '#5c2d0a'; // dark mud outline
const R = '#ff4444'; // embedded red bits
const P = '#9933ff'; // embedded purple bits
const Q = '#00ccff'; // embedded cyan bits
const H = '#c47a3a'; // mud highlight
const S = '#3d1505'; // deep shadow
const W = '#e8a060'; // hit highlight

function r48(row: (string | null)[]): (string | null)[] {
  while (row.length < 48) row.push(_);
  return row.slice(0, 48);
}

const idle1: (string | null)[][] = [
  r48([_, _, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r48([_, _, _, _, _, _, _, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, _, _, _, D, M, H, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, H, M, M, D]),
  r48([_, _, _, _, _, D, M, M, M, M, M, M, R, M, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, _, D, M, M, M, M, M, M, M, M, M, P, M, M, M, M, P, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, D, M, M, M, M, M, M, M, M, M, M, M, M, M, Q, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, D, M, M, M, H, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, H, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, P, M, M, M, M, P, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, Q, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, H, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, H, M, M, D]),
  r48([D, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, P, M, M, M, M, M, M, M, P, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, Q, M, M, Q, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, H, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, H, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, P, M, M, M, M, M, M, P, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, M, Q, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, D, M, M, H, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, H, M, M, M, M, D]),
  r48([_, D, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, R, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, D, M, M, M, M, M, M, M, P, M, M, M, M, M, M, P, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, D, M, M, M, M, M, M, M, M, M, Q, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, _, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, _, _, D, M, H, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, H, M, M, D]),
  r48([_, _, _, _, _, _, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, _, _, _, _, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]),
  r48([_, _, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
];

// Frame 2: mud bits shift, blob outline pulses slightly
const idle2: (string | null)[][] = idle1.map((row) =>
  row.map((px) => {
    if (px === H) return W;
    if (px === W) return H;
    return px;
  }),
);

const hitFrame: (string | null)[][] = idle1.map((row) =>
  row.map((px) => {
    if (px === M) return W;
    if (px === D) return S;
    return px;
  }),
);

export const bigBallOfMudBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idle1, idle2],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 600,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 200,
  },
};
