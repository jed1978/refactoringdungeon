import type { SpriteSheet } from '../../utils/types';

// 散彈修改鳥 (Shotgun Surgery) — Battle sprite
// Bird with fragmented body, pieces floating apart
// Size: 32×32

const _ = null;
const O = '#ff8833'; // orange body
const D = '#aa5522'; // dark outline
const Y = '#ffcc00'; // scattered fragment yellow
const W = '#ffaa55'; // highlight orange
const E = '#ff4400'; // hit flash red

function r32(row: (string | null)[]): (string | null)[] {
  while (row.length < 32) row.push(_);
  return row.slice(0, 32);
}

const idleFrame1: (string | null)[][] = [
  r32([_, _, _, _, Y, _, _, _, _, Y, _, _]),
  r32([_, _, _, Y, _, _, Y, _, Y, _, Y, _]),
  r32([_, _, _, _, D, D, D, D, D, D, _]),
  r32([_, _, _, D, O, O, O, O, O, O, D]),
  r32([_, _, D, O, W, O, O, O, W, O, O, D]),
  r32([_, D, O, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, Y, O, O, O, O, O, Y, O, O, O, D]),
  r32([D, O, O, O, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, O, D, D, O, O, O, D, D, O, O, D]),
  r32([_, D, O, D, _, _, D, O, D, _, _, D, O, D]),
  r32([_, _, D, _, Y, _, D, O, D, _, Y, D, _, D]),
  r32([_, Y, _, _, _, D, D, O, D, D, _, _, _, Y]),
  r32([_, _, _, _, _, _, D, O, D]),
  r32([_, _, _, _, _, D, O, O, O, D]),
  r32([_, _, _, _, _, D, O, O, O, D]),
  r32([_, _, _, _, D, O, O, O, O, D]),
  r32([_, _, _, D, O, O, O, O, O, D]),
  r32([_, _, D, O, O, O, O, O, O, O, D]),
  r32([_, D, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, O, O, O, O, O, O, O, O, O, D]),
  r32([_, D, D, O, O, O, O, O, O, O, D, D]),
  r32([_, _, _, D, D, D, D, D, D, D, D]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
];

// Frame 2: fragments shifted outward 1-2px
const idleFrame2: (string | null)[][] = [
  r32([_, Y, _, _, _, Y, _, _, _, Y, _, Y]),
  r32([_, _, Y, _, Y, _, _, Y, _, _, Y, _]),
  r32([_, _, _, _, D, D, D, D, D, D, _]),
  r32([_, _, _, D, O, O, O, O, O, O, D]),
  r32([_, _, D, O, W, O, O, O, W, O, O, D]),
  r32([_, D, O, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, O, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, Y, O, O, O, O, O, Y, O, O, O, D]),
  r32([D, O, O, O, D, D, O, O, O, D, D, O, O, D]),
  r32([_, D, O, D, _, _, D, O, D, _, _, D, O, D]),
  r32([_, _, D, _, _, Y, D, O, D, Y, _, D, _, D]),
  r32([_, _, Y, _, _, D, D, O, D, D, _, _, Y, _]),
  r32([_, _, _, _, _, _, D, O, D]),
  r32([_, _, _, _, _, D, O, O, O, D]),
  r32([_, _, _, _, _, D, O, O, O, D]),
  r32([_, _, _, _, D, O, O, O, O, D]),
  r32([_, _, _, D, O, O, O, O, O, D]),
  r32([_, _, D, O, O, O, O, O, O, O, D]),
  r32([_, D, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, O, O, O, O, O, O, O, O, O, D]),
  r32([D, O, O, O, O, O, O, O, O, O, O, O, D]),
  r32([_, D, D, O, O, O, O, O, O, O, D, D]),
  r32([_, _, _, D, D, D, D, D, D, D, D]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
  r32([_]),
];

const hitFrame: (string | null)[][] = idleFrame1.map((row) =>
  row.map((px) => {
    if (px === O) return W;
    if (px === D) return E;
    return px;
  }),
);

export const shotgunSurgeryBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 300,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
