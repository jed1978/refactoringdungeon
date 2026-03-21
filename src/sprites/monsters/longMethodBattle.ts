import type { SpriteSheet } from '../../utils/types';

// 長方法獸 (Long Method Beast) — Battle sprite
// Comically tall thin creature, 32×48, scrollbar on its right side
//
// Palette
const _ = null;
const B = '#8899bb'; // gray-blue body
const D = '#445566'; // dark outline
const W = '#ffffff'; // scrollbar white
const S = '#aabbcc'; // scrollbar highlight
const T = '#334455'; // scrollbar track dark
const H = '#bbccdd'; // body highlight

// Each row must be exactly 32 elements wide, 48 rows total.

const idleFrame1: (string | null)[][] = [
  // row 0 — top of head
  [_, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _, _, _, _, _, _, _, _, _, _],
  // row 1
  [_, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, T, _, _, _, _, _, _, _],
  // row 2 — eyes row
  [_, _, _, _, D, B, H, B, D, B, B, B, B, B, B, B, B, B, B, D, B, H, B, D, W, D, _, _, _, _, _, _],
  // row 3
  [_, _, _, _, D, B, B, B, D, B, B, B, B, B, B, B, B, B, B, D, B, B, B, D, S, D, _, _, _, _, _, _],
  // row 4 — eyes (dark pupils)
  [_, _, _, _, D, B, D, B, D, B, B, B, B, B, B, B, B, B, B, D, B, D, B, D, W, D, _, _, _, _, _, _],
  // row 5
  [_, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, D, _, _, _, _, _, _],
  // row 6
  [_, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _, _],
  // row 7 — neck
  [_, _, _, _, _, _, D, D, B, B, B, B, B, B, B, B, B, B, D, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 8 — body top
  [_, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _, _, _],
  // row 9
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 10
  [_, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, D, _, W, D, _, _, _, _, _, _],
  // row 11
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _, _],
  // row 12
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _, _],
  // row 13 — arm left protrudes
  [D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _, _],
  // row 14
  [D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _, _],
  // row 15
  [_, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, W, D, _, _, _, _, _, _],
  // row 16
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _, _, _],
  // row 17
  [_, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 18
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 19
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 20
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 21 — arm right protrudes
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, W, D, _, _, _, _, _, _],
  // row 22
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, D, _, _, _, _, _, _],
  // row 23
  [_, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, D, _, T, D, _, _, _, _, _, _],
  // row 24
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 25
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _, _],
  // row 26
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, S, D, _, _, _, _, _, _],
  // row 27
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _, _, _],
  // row 28 — lower body
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _, _, _],
  // row 29
  [_, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 30 — legs split
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 31
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 32
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 33
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, W, D, _, _, _, _, _, _],
  // row 34
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 35
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 36
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 37
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 38
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 39 — feet
  [_, _, _, _, D, H, B, B, H, D, _, _, _, _, D, H, B, B, H, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 40
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 41 — foot bottom
  [_, _, _, D, B, B, B, B, B, D, _, _, _, D, B, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _, _],
  // row 42
  [_, _, _, D, D, D, D, D, D, D, _, _, _, D, D, D, D, D, D, D, _, _, _, _, D, D, _, _, _, _, _, _],
  // row 43
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 44
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 45
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 46
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 47
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// IDLE frame 2 — body shifts 1px right (scroll indicator moves 2px down)
const idleFrame2: (string | null)[][] = [
  // row 0
  [_, _, _, _, _, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _, _, _, _, _, _, _, _, _],
  // row 1
  [_, _, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, T, _, _, _, _, _, _],
  // row 2
  [_, _, _, _, _, D, B, H, B, D, B, B, B, B, B, B, B, B, B, B, D, B, H, B, D, W, D, _, _, _, _, _],
  // row 3
  [_, _, _, _, _, D, B, B, B, D, B, B, B, B, B, B, B, B, B, B, D, B, B, B, D, T, D, _, _, _, _, _],
  // row 4
  [_, _, _, _, _, D, B, D, B, D, B, B, B, B, B, B, B, B, B, B, D, B, D, B, D, S, D, _, _, _, _, _],
  // row 5
  [_, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, W, D, _, _, _, _, _],
  // row 6
  [_, _, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _],
  // row 7
  [_, _, _, _, _, _, _, D, D, B, B, B, B, B, B, B, B, B, B, D, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 8
  [_, _, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _, _],
  // row 9
  [_, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 10
  [_, _, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, D, _, T, D, _, _, _, _, _],
  // row 11
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, W, D, _, _, _, _, _],
  // row 12
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _],
  // row 13
  [_, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _],
  // row 14
  [_, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _, _],
  // row 15
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 16
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, S, D, _, _, _, _, _],
  // row 17
  [_, _, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, D, _, _, T, D, _, _, _, _, _],
  // row 18
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 19
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, W, D, _, _, _, _, _],
  // row 20
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 21
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, D, _, _, _, _, _],
  // row 22
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, D, _, _, _, _, _],
  // row 23
  [_, _, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, D, _, T, D, _, _, _, _, _],
  // row 24
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 25
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 26
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _, _],
  // row 27
  [_, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, S, D, _, _, _, _, _],
  // row 28
  [_, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _, _],
  // row 29
  [_, _, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 30
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, W, D, _, _, _, _, _],
  // row 31
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 32
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 33
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 34
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 35
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 36
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 37
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 38
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, S, D, _, _, _, _, _],
  // row 39
  [_, _, _, _, _, D, H, B, B, H, D, _, _, _, _, D, H, B, B, H, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 40
  [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 41
  [_, _, _, _, D, B, B, B, B, B, D, _, _, _, D, B, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _, _],
  // row 42
  [_, _, _, _, D, D, D, D, D, D, D, _, _, _, D, D, D, D, D, D, D, _, _, _, _, D, D, _, _, _, _, _],
  // row 43
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 44
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 45
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 46
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 47
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// HIT frame — body squashes/shakes horizontally
const hitFrame: (string | null)[][] = [
  // row 0
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  // row 1 — head appears squashed/wider
  [_, _, _, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D],
  // row 2
  [_, _, D, B, H, B, D, B, B, B, B, B, B, B, B, B, B, B, B, D, B, H, B, D, W, D, _, _, _, _, _, _],
  // row 3
  [_, _, D, B, D, B, D, B, B, B, B, B, B, B, B, B, B, B, B, D, B, D, B, D, S, D, _, _, _, _, _, _],
  // row 4
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, W, D, _, _, _, _, _, _],
  // row 5 — body squashed to fewer rows
  [_, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, D, _, _, _, _, _],
  // row 6
  [_, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, B, D, T, D, _, _, _, _, _],
  // row 7
  [D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, D, _, _, _, _, _],
  // row 8
  [D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, T, D, _, _, _, _],
  // row 9
  [_, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, T, D, _, _, _, _],
  // row 10
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _],
  // rows 11-42: same leg structure but compressed
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, S, D, _, _, _, _],
  [_, _, D, B, H, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, H, B, B, D, _, _, T, D, _, _, _, _],
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, W, D, _, _, _, _],
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _],
  [_, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, T, D, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, D, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, W, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, H, B, B, H, D, _, _, _, _, D, H, B, B, H, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, _, D, B, B, B, B, D, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _, _, S, D, _, _, _, _],
  [_, _, _, D, B, B, B, B, B, D, _, _, _, D, B, B, B, B, B, D, _, _, _, _, _, _, T, D, _, _, _, _],
  [_, _, _, D, D, D, D, D, D, D, _, _, _, D, D, D, D, D, D, D, _, _, _, _, _, _, D, D, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

export const longMethodBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [idleFrame1, idleFrame2],
    frameWidth: 32,
    frameHeight: 48,
    frameDuration: 600,
  },
  hit: {
    frames: [hitFrame],
    frameWidth: 32,
    frameHeight: 48,
    frameDuration: 200,
  },
};
