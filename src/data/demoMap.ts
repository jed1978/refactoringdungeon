import { TileType } from "../utils/types";

const W = TileType.Wall;
const F = TileType.Floor;

// 15x15 demo map — outer walls, inner floor, some obstacle walls
export const DEMO_MAP = [
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, W, W, F, F, F, F, F, W, W, F, F, W],
  [W, F, F, W, F, F, F, F, F, F, F, W, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, W, F, F, F, F, F, F, F, W, F, F, W],
  [W, F, F, W, W, F, F, F, F, F, W, W, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, F, F, F, W, W, W, F, F, F, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
] as const;

export const DEMO_PLAYER_START = { x: 7, y: 7 };
