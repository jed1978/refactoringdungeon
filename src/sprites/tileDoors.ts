import type { SpriteFrame } from "../utils/types";

// Floor 1 theme colors (for floor visible around/under doors)
const F1 = "#4a5944";
const F2 = "#3d4c38";
const W1 = "#2d3328";
const W2 = "#222822";

// Door colors
const WD = "#8B4513"; // wood primary
const WK = "#6B3410"; // wood dark
const IR = "#4a4a4a"; // iron primary
const ID = "#3a3a3a"; // iron dark
const IK = "#2a2a2a"; // iron darkest

// Boss door colors
const BR = "#8B0000"; // dark red
const BL = "#CC0000"; // red
const BG = "#FF4444"; // bright red glow
const GD = "#FFD700"; // gold

// Locked door: wooden door with iron bands, set in wall frame
export const doorLocked: SpriteFrame = [
  [W1, W1, W1, W2, IR, IR, IR, IR, IR, IR, IR, IR, W2, W1, W1, W1],
  [W1, W1, W2, IR, WD, WD, WD, WD, WD, WD, WD, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, ID, ID, ID, ID, ID, ID, ID, ID, ID, ID, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, IR, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, ID, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, IR, WD, WK, WD, WD, WD, WD, WK, WD, IR, W2, W1, W1],
  [W1, W1, W2, ID, ID, ID, ID, ID, ID, ID, ID, ID, ID, W2, W1, W1],
  [W1, W1, W2, IK, WK, WK, WK, WK, WK, WK, WK, WK, IK, W2, W1, W1],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
];

// Open door: reveals dark interior, door pushed aside
export const doorOpen: SpriteFrame = [
  [W1, W1, W1, W2, IK, IK, IK, IK, IK, IK, IK, IK, W2, W1, W1, W1],
  [W1, W1, W2, IK, "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#111111", "#111111", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#0a0a0a", "#111111", "#111111", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#151515", "#151515", "#111111", "#111111", "#111111", "#111111", "#151515", "#151515", IK, W2, W1, W1],
  [W1, W1, W2, IK, "#1a1a1a", "#1a1a1a", "#151515", "#151515", "#151515", "#151515", "#1a1a1a", "#1a1a1a", IK, W2, W1, W1],
  [W1, W1, W2, IK, F2, F2, "#1a1a1a", "#1a1a1a", "#1a1a1a", "#1a1a1a", F2, F2, IK, W2, W1, W1],
  [W1, W1, W2, IK, F1, F1, F2, F2, F2, F2, F1, F1, IK, W2, W1, W1],
  [F2, F2, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F2, F2],
];

// Boss door: ornate door with red glow and gold trim
export const bossDoor: SpriteFrame = [
  [W2, W2, GD, GD, GD, GD, GD, GD, GD, GD, GD, GD, GD, GD, W2, W2],
  [W2, GD, BR, BR, BR, BL, BL, BG, BG, BL, BL, BR, BR, BR, GD, W2],
  [W2, GD, BR, WD, WK, WD, WD, BL, BL, WD, WD, WK, WD, BR, GD, W2],
  [W2, GD, BR, WK, WD, WD, WD, WD, WD, WD, WD, WD, WK, BR, GD, W2],
  [W2, GD, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, GD, W2],
  [W2, GD, BR, WD, WK, WD, GD, BL, BL, GD, WD, WK, WD, BR, GD, W2],
  [W2, GD, BR, WK, WD, WD, GD, BG, BG, GD, WD, WD, WK, BR, GD, W2],
  [W2, GD, BR, WD, WK, WD, GD, BL, BL, GD, WD, WK, WD, BR, GD, W2],
  [W2, GD, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, GD, W2],
  [W2, GD, BR, WD, WK, WD, WD, WD, WD, WD, WD, WK, WD, BR, GD, W2],
  [W2, GD, BR, WK, WD, WD, WD, GD, IR, WD, WD, WD, WK, BR, GD, W2],
  [W2, GD, BR, WD, WK, WD, WD, GD, IK, WD, WD, WK, WD, BR, GD, W2],
  [W2, GD, BR, WK, WD, WD, WD, WD, WD, WD, WD, WD, WK, BR, GD, W2],
  [W2, GD, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, IK, GD, W2],
  [W2, GD, GD, BL, BL, BG, BL, BL, BL, BL, BG, BL, BL, GD, GD, W2],
  [F2, F2, F2, BL, BR, BR, BR, BR, BR, BR, BR, BR, BL, F2, F2, F2],
];
