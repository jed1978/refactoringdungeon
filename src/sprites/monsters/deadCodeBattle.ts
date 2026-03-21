import type { SpriteSheet } from '../../utils/types';

// 殭屍程式 (Dead Code Zombie) — Battle sprite
// Zombie-fied curly braces { } with dead eyes
// Size: 32×32, facing RIGHT
//
// Palette
const _ = null;      // transparent
const Z = '#556b2f'; // zombie green (main body)
const z = '#4a5e25'; // zombie green shadow
const d = '#3d4f1c'; // zombie dark green
const G = '#808080'; // gray (dead flesh / bracket)
const g = '#666666'; // gray shadow
const R = '#cc0000'; // red eyes bright
const r = '#880000'; // red eye glow
const O = '#1a2010'; // dark outline
const W = '#a8b870'; // lighter zombie green highlight
const X = '#333333'; // very dark gray (bracket inner)

// ---------------------------------------------------------------------------
// IDLE frame 1 — standing, left curly { shape, right curly } shape merged
// Body: two curly brace forms fused together, zombie features visible
// ---------------------------------------------------------------------------
const idleFrame1: (string | null)[][] = [
  // row 0
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 1 — head / top of { brace pair
  [_, _, _, _, _, _, _, O, O, O, O, O, O, _, O, O, O, O, O, O, O, _, _, _, _, _, _, _, _, _, _, _],
  // row 2 — { shape: top curve
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 3 — face row with dead eyes (R pupils)
  [_, _, _, _, _, O, Z, Z, G, Z, G, Z, Z, O, Z, Z, G, Z, G, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 4 — eyes: left = R, right = R
  [_, _, _, _, _, O, Z, Z, R, Z, R, Z, Z, O, Z, Z, R, Z, R, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 5 — under eyes (hollow sockets)
  [_, _, _, _, _, O, Z, Z, r, Z, r, Z, Z, O, Z, Z, r, Z, r, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 6 — mouth / bracket notch area
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, Z, X, O, X, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 7 — bracket center indent (characteristic { notch)
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, Z, O, d, O, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 8 — center of brace, notch
  [_, _, _, _, _, O, Z, Z, z, Z, z, Z, Z, O, Z, Z, z, Z, z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 9 — middle of body
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 10
  [_, _, _, _, _, _, O, Z, W, Z, W, Z, Z, O, Z, Z, W, Z, W, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 11 — lower body / arms
  [_, _, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 12
  [_, _, _, O, Z, z, Z, z, Z, z, Z, z, Z, O, Z, z, Z, z, Z, z, Z, z, Z, O, _, _, _, _, _, _, _, _],
  // row 13 — arms hang loosely (zombie pose)
  [_, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 14
  [_, _, O, G, g, g, G, Z, Z, Z, Z, Z, G, O, G, g, g, G, Z, Z, Z, Z, G, O, _, _, _, _, _, _, _, _],
  // row 15 — bottom of body { curve at bottom
  [_, _, _, O, G, g, G, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, G, g, G, O, _, _, _, _, _, _, _, _],
  // row 16 — legs / hips
  [_, _, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 17
  [_, _, _, _, O, Z, Z, z, Z, z, Z, z, Z, O, Z, z, Z, z, Z, z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 18 — legs split
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 19
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 20
  [_, _, _, _, _, O, Z, z, Z, z, Z, O, _, O, _, O, Z, z, Z, z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 21
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 22
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 23 — foot area
  [_, _, _, _, _, _, O, Z, Z, Z, O, _, _, O, _, _, O, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _, _],
  // row 24 — feet
  [_, _, _, _, _, O, G, G, G, G, O, _, _, O, _, O, G, G, G, G, O, _, _, _, _, _, _, _, _, _, _, _],
  // row 25 — shoe bottom
  [_, _, _, _, O, G, g, g, g, G, G, O, _, O, O, G, G, g, g, g, G, O, _, _, _, _, _, _, _, _, _, _],
  // row 26
  [_, _, _, _, O, G, g, g, g, g, G, O, _, _, O, G, G, g, g, g, g, O, _, _, _, _, _, _, _, _, _, _],
  // row 27
  [_, _, _, _, _, O, O, O, O, O, O, _, _, _, _, O, O, O, O, O, O, O, _, _, _, _, _, _, _, _, _, _],
  // row 28
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 29
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 30
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 31
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// ---------------------------------------------------------------------------
// IDLE frame 2 — shambling wobble: whole body 1px to the right
// ---------------------------------------------------------------------------
const idleFrame2: (string | null)[][] = [
  // row 0
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 1
  [_, _, _, _, _, _, _, _, O, O, O, O, O, O, _, O, O, O, O, O, O, O, _, _, _, _, _, _, _, _, _, _],
  // row 2
  [_, _, _, _, _, _, _, O, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 3
  [_, _, _, _, _, _, O, Z, Z, G, Z, G, Z, Z, O, Z, Z, G, Z, G, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 4
  [_, _, _, _, _, _, O, Z, Z, R, Z, R, Z, Z, O, Z, Z, R, Z, R, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 5
  [_, _, _, _, _, _, O, Z, Z, r, Z, r, Z, Z, O, Z, Z, r, Z, r, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 6
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, Z, X, O, X, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 7
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, Z, O, d, O, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 8
  [_, _, _, _, _, _, O, Z, Z, z, Z, z, Z, Z, O, Z, Z, z, Z, z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 9
  [_, _, _, _, _, _, _, O, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 10
  [_, _, _, _, _, _, _, O, Z, W, Z, W, Z, Z, O, Z, Z, W, Z, W, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 11
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 12
  [_, _, _, _, O, Z, z, Z, z, Z, z, Z, z, Z, O, Z, z, Z, z, Z, z, Z, z, Z, O, _, _, _, _, _, _, _],
  // row 13
  [_, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _],
  // row 14
  [_, _, _, O, G, g, g, G, Z, Z, Z, Z, Z, G, O, G, g, g, G, Z, Z, Z, Z, G, O, _, _, _, _, _, _, _],
  // row 15
  [_, _, _, _, O, G, g, G, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, G, g, G, O, _, _, _, _, _, _, _],
  // row 16
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, O, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 17
  [_, _, _, _, _, O, Z, Z, z, Z, z, Z, z, Z, O, Z, z, Z, z, Z, z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 18
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 19
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 20
  [_, _, _, _, _, _, O, Z, z, Z, z, Z, O, _, O, _, O, Z, z, Z, z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 21
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 22
  [_, _, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 23
  [_, _, _, _, _, _, _, O, Z, Z, Z, O, _, _, O, _, _, O, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 24
  [_, _, _, _, _, _, O, G, G, G, G, O, _, _, O, _, O, G, G, G, G, O, _, _, _, _, _, _, _, _, _, _],
  // row 25
  [_, _, _, _, _, O, G, g, g, g, G, G, O, _, O, O, G, G, g, g, g, G, O, _, _, _, _, _, _, _, _, _],
  // row 26
  [_, _, _, _, _, O, G, g, g, g, g, G, O, _, _, O, G, G, g, g, g, g, O, _, _, _, _, _, _, _, _, _],
  // row 27
  [_, _, _, _, _, _, O, O, O, O, O, O, _, _, _, _, O, O, O, O, O, O, O, _, _, _, _, _, _, _, _, _],
  // row 28
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 29
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 30
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 31
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// ---------------------------------------------------------------------------
// HIT frame — knocked back / distorted, body squashes and pixels scatter
// ---------------------------------------------------------------------------
const hitFrame: (string | null)[][] = [
  // row 0
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 1
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 2 — top braces flatten
  [_, _, _, _, _, O, O, Z, Z, O, _, O, Z, Z, O, O, Z, Z, O, O, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 3 — squashed face, eyes pushed together
  [_, _, _, _, O, Z, G, R, G, Z, O, Z, G, R, G, Z, G, R, G, Z, G, R, G, Z, O, _, _, _, _, _, _, _],
  // row 4
  [_, _, _, _, O, Z, Z, r, Z, Z, O, Z, Z, r, Z, Z, Z, r, Z, Z, Z, r, Z, Z, O, _, _, _, _, _, _, _],
  // row 5 — distorted mouth / notch
  [_, _, _, _, O, Z, Z, Z, Z, Z, X, O, X, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _],
  // row 6
  [_, _, _, _, O, Z, Z, Z, Z, Z, Z, d, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _],
  // row 7 — body squashed (2 rows of body content collapsed)
  [_, _, _, _, O, Z, z, Z, W, Z, W, Z, z, Z, z, Z, W, Z, W, Z, z, Z, z, Z, O, _, _, _, _, _, _, _],
  // row 8
  [_, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _],
  // row 9 — arms knocked sideways
  [_, O, G, g, G, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, G, g, G, O, _, _, _, _, _, _],
  // row 10
  [_, O, G, g, g, G, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, G, g, g, G, Z, O, _, _, _, _, _, _],
  // row 11
  [_, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _],
  // row 12
  [_, _, O, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, O, _, _, _, _, _, _, _],
  // row 13
  [_, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 14 — lower body still
  [_, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _],
  // row 15
  [_, _, _, _, O, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 16
  [_, _, _, _, O, Z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, z, Z, Z, O, _, _, _, _, _, _, _, _, _],
  // row 17
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 18
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 19
  [_, _, _, _, _, O, Z, z, Z, z, Z, O, _, O, _, O, Z, z, Z, z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 20
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 21
  [_, _, _, _, _, O, Z, Z, Z, Z, Z, O, _, O, _, O, Z, Z, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _],
  // row 22
  [_, _, _, _, _, _, O, Z, Z, Z, O, _, _, O, _, _, O, Z, Z, Z, O, _, _, _, _, _, _, _, _, _, _, _],
  // row 23
  [_, _, _, _, _, O, G, G, G, G, O, _, _, O, _, O, G, G, G, G, O, _, _, _, _, _, _, _, _, _, _, _],
  // row 24 — feet splayed further
  [_, _, _, _, O, G, g, g, g, G, G, O, _, O, O, G, G, g, g, g, G, O, _, _, _, _, _, _, _, _, _, _],
  // row 25
  [_, _, _, _, O, G, g, g, g, g, G, O, _, _, O, G, G, g, g, g, g, O, _, _, _, _, _, _, _, _, _, _],
  // row 26
  [_, _, _, _, _, O, O, O, O, O, O, _, _, _, _, O, O, O, O, O, O, O, _, _, _, _, _, _, _, _, _, _],
  // row 27 — fallen pixels
  [_, _, O, _, _, _, O, _, _, _, _, O, _, _, _, _, O, _, _, _, O, _, _, _, _, _, _, _, _, _, _, _],
  // row 28
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 29
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 30
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 31
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const deadCodeBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 500,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 200,
  },
};
