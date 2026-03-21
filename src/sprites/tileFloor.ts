import type { SpriteFrame } from "../utils/types";

// Floor 1: Frontend Swamp theme colors
const F1 = "#4a5944"; // floor primary
const F2 = "#3d4c38"; // floor shadow
const F3 = "#566b4e"; // floor highlight
const W1 = "#2d3328"; // wall primary
const W2 = "#222822"; // wall dark
const W3 = "#3a4234"; // wall top highlight
const V = "#000000"; // void

// Stone floor variant 1
export const floor1A: SpriteFrame = [
  [F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1],
  [F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F2, F1, F1, F3, F1, F1],
  [F1, F1, F1, F2, F1, F1, F3, F1, F1, F1, F2, F1, F1, F1, F1, F1],
  [F2, F2, F2, F2, F1, F1, F1, F1, F1, F1, F2, F2, F2, F2, F2, F2],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F3, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F3, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F3, F1, F1, F1],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F3, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F3, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F3, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F1, F1],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F3, F1, F1, F1, F1, F1, F1, F3, F1, F1, F1, F1],
];

// Stone floor variant 2 (slightly different crack pattern)
export const floor1B: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1],
  [F1, F3, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F3, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F2, F1, F1, F3, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F3, F1, F1, F2, F1, F1, F1, F1, F1, F1, F1, F1, F3, F1],
  [F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1],
  [F1, F1, F1, F3, F1, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F3, F1, F1, F1, F2, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F2, F1, F1, F1],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F1, F1, F1, F1, F1, F3, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
];

// Wall tile (top edge highlighted for depth)
export const wall1: SpriteFrame = [
  [W3, W3, W3, W3, W3, W3, W3, W3, W3, W3, W3, W3, W3, W3, W3, W3],
  [W3, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W3],
  [W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W2, W1, W1, W1, W1, W1, W2, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W2, W1, W1, W1, W1, W1, W2, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W2, W1, W1, W1, W1, W1, W2, W1, W1, W1, W1, W1, W1],
  [W2, W2, W2, W2, W1, W1, W1, W1, W1, W2, W2, W2, W2, W2, W2, W2],
  [W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W1, W1, W1, W2, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W1, W1, W1, W2, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W1, W1, W1, W2, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2],
  [W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1],
  [W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W1, W2],
  [W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2, W2],
];

// Void tile (pure black)
export const voidTile: SpriteFrame = Array.from({ length: 16 }, () =>
  Array.from({ length: 16 }, () => V),
);
