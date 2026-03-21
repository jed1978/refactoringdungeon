import type { SpriteSheet } from '../../utils/types';

// 神類 (God Class) — FINAL BOSS
// Imposing figure with crown, body shows all monster types
// Map sprite: 16×16

const _ = null;      // transparent
const G = '#ffd700'; // gold robes/crown
const D = '#1a1a2e'; // obsidian dark
const S = '#e2e8f0'; // silver crown
const R = '#cc0000'; // red accents
const W = '#ffffff'; // white glint

const frame1 = [
  [_, _, _, S, S, G, S, S, G, S, S, _, _, _, _, _],
  [_, _, S, G, G, G, G, G, G, G, S, _, _, _, _, _],
  [_, _, D, G, W, G, G, G, W, G, D, _, _, _, _, _],
  [_, _, D, G, G, G, G, G, G, G, D, _, _, _, _, _],
  [_, D, G, G, R, G, G, G, R, G, G, D, _, _, _, _],
  [_, D, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [D, G, R, G, G, G, G, G, G, G, R, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [_, D, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [_, D, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [_, _, D, D, G, G, G, G, G, D, D, _, _, _, _, _],
  [_, _, _, D, G, G, G, G, D, _, _, _, _, _, _, _],
  [_, _, _, D, D, D, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// Frame 2: crown glints shift, aura pulses outward
const frame2 = [
  [_, _, S, G, S, G, S, G, S, G, _, _, _, _, _, _],
  [_, S, G, G, G, G, G, G, G, G, S, _, _, _, _, _],
  [_, D, G, W, G, G, G, G, G, W, G, D, _, _, _, _],
  [_, D, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [D, G, G, G, R, G, G, G, R, G, G, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [D, G, R, G, G, G, G, G, G, G, R, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [D, G, G, G, G, G, G, G, G, G, G, G, D, _, _, _],
  [_, D, G, G, G, G, G, G, G, G, G, D, _, _, _, _],
  [_, _, D, D, G, G, G, G, G, D, D, _, _, _, _, _],
  [_, _, _, D, G, G, G, G, D, _, _, _, _, _, _, _],
  [_, _, _, D, D, D, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const godClassSprite: SpriteSheet = {
  frames: [frame1, frame2],
  frameWidth: 16,
  frameHeight: 16,
  frameDuration: 400,
};
