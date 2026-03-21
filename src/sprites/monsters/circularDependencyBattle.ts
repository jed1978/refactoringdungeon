import type { SpriteSheet } from '../../utils/types';

// 循環依賴蛇 (Circular Dependency Snake) — BOSS Battle sprite
// Ouroboros snake eating its own tail, arrows showing circular flow
// Size: 48×48

const _ = null;
const E = '#00cc66'; // emerald green snake body
const D = '#006633'; // dark green outline
const G = '#ffd700'; // gold arrow/eye
const L = '#00ff88'; // light green highlight
const S = '#004422'; // deep shadow
const W = '#88ffcc'; // scale highlight

function r48(row: (string | null)[]): (string | null)[] {
  while (row.length < 48) row.push(_);
  return row.slice(0, 48);
}

const idle1: (string | null)[][] = [
  r48([_, _, _, _, _, _, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]),
  r48([_, _, _, _, _, _, _, _, _, _, _, D, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, _, _, _, _, D, E, L, E, E, E, E, E, E, E, E, E, E, E, E, L, E, D]),
  r48([_, _, _, _, _, _, _, _, _, D, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, _, _, D, E, E, E, E, D, S, _, _, _, _, _, _, S, D, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, _, D, E, E, E, D, _, _, _, G, _, _, _, _, G, _, _, D, E, E, E, E, D]),
  r48([_, _, _, _, _, _, D, E, E, E, D, _, _, _, G, G, G, G, G, G, G, _, _, D, E, E, E, D]),
  r48([_, _, _, _, _, D, E, E, E, D, _, _, _, G, G, G, G, G, G, G, G, _, _, D, E, E, E, D]),
  r48([_, _, _, _, D, E, E, E, D, _, _, _, G, E, E, E, E, E, E, E, E, G, _, _, D, E, E, D]),
  r48([_, _, _, D, E, E, E, D, _, _, _, G, E, E, E, E, E, E, E, E, E, E, G, _, D, E, E, D]),
  r48([_, _, D, E, E, E, D, _, _, _, G, E, E, E, W, E, E, W, E, E, E, E, E, G, D, E, E, D]),
  r48([_, D, E, E, E, D, _, _, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, E, D]),
  r48([D, E, E, E, D, _, _, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, E, D]),
  r48([D, E, E, D, _, _, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, _, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, _, _, G, E, E, E, W, E, E, W, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D, E, D]),
  r48([D, E, E, D, G, E, E, W, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, G, D, E, D]),
  r48([D, E, E, D, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, G, _, D, E, D]),
  r48([D, E, E, D, _, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, G, _, _, D, E, D]),
  r48([D, E, E, E, D, _, _, G, E, E, E, E, E, E, E, E, E, E, E, E, E, G, _, _, D, E, E, D]),
  r48([_, D, E, E, E, D, _, _, G, E, E, E, E, E, E, E, E, E, E, E, G, _, _, D, E, E, E, D]),
  r48([_, _, D, E, E, E, D, _, _, _, G, E, E, E, E, E, E, E, E, G, _, _, D, E, E, E, E, D]),
  r48([_, _, _, D, E, E, E, D, _, _, _, _, G, G, G, G, G, G, G, _, _, _, D, E, E, E, E, D]),
  r48([_, _, _, _, D, E, E, E, E, D, _, _, _, G, G, G, G, G, _, _, D, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, D, E, E, E, E, D, S, _, _, _, G, _, _, S, D, E, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, D, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, _, D, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, _, _, D, E, L, E, E, E, E, E, E, E, E, E, E, E, L, E, D]),
  r48([_, _, _, _, _, _, _, _, _, D, E, E, E, E, E, E, E, E, E, E, E, E, E, D]),
  r48([_, _, _, _, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D]),
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

// Frame 2: snake body rotates 1 step clockwise (shift highlights)
const idle2: (string | null)[][] = idle1.map((row, i) => {
  if (i < 34) {
    return row.map((px) => {
      if (px === L) return W;
      if (px === W) return L;
      return px;
    });
  }
  return [...row];
});

const hitFrame: (string | null)[][] = idle1.map((row) =>
  row.map((px) => {
    if (px === E) return L;
    if (px === D) return S;
    return px;
  }),
);

export const circularDependencyBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idle1, idle2],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 500,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 200,
  },
};
