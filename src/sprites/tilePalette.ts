import type { SpriteFrame, PixelColor } from "../utils/types";
import { TileType } from "../utils/types";
import { FLOOR_THEMES } from "../utils/constants";
import { floor1A, floor1B, wall1 } from "./tileFloor";
import { tileSprites } from "./tiles";

// Floor 1 base colors (from tileFloor.ts)
const FLOOR1_FLOOR_COLORS: readonly string[] = [
  "#4a5944",
  "#3d4c38",
  "#566b4e",
];
const FLOOR1_WALL_COLORS: readonly string[] = ["#2d3328", "#222822", "#3a4234"];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

// Compute brightness (perceived luminance) of an RGB color
function brightness(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * For each palette color in the source array, derive a matching color based on
 * the target theme color. Uses proportional brightness mapping so that
 * shadow/highlight relationships are preserved.
 */
function derivePalette(
  sourceColors: readonly string[],
  themeHex: string,
): ReadonlyMap<string, string> {
  const map = new Map<string, string>();
  const [tr, tg, tb] = hexToRgb(themeHex);
  const themeBrightness = brightness(tr, tg, tb);

  for (const srcHex of sourceColors) {
    const [sr, sg, sb] = hexToRgb(srcHex);
    const srcBrightness = brightness(sr, sg, sb);

    // Slight saturation boost: blend toward theme color at same brightness
    const targetB = themeBrightness > 0 ? srcBrightness / themeBrightness : 1;
    const finalR = tr * targetB;
    const finalG = tg * targetB;
    const finalB = tb * targetB;

    map.set(srcHex, rgbToHex(finalR, finalG, finalB));
  }

  return map;
}

function swapPalette(
  frame: SpriteFrame,
  colorMap: ReadonlyMap<string, string>,
): SpriteFrame {
  return frame.map((row) =>
    row.map((pixel: PixelColor) => {
      if (pixel === null) return null;
      return colorMap.get(pixel) ?? pixel;
    }),
  );
}

// Cache: floorLevel → themed tile sprites record
const cache = new Map<number, Record<number, SpriteFrame[]>>();

/**
 * Returns the tile sprite set for the given floor level (1-4).
 * Floor 1 returns the original sprites. Floors 2-4 use palette-swapped versions.
 */
export function getTileSpritesForFloor(
  floorLevel: number,
): Record<number, SpriteFrame[]> {
  const cached = cache.get(floorLevel);
  if (cached) return cached;

  if (floorLevel <= 1) {
    cache.set(1, tileSprites);
    return tileSprites;
  }

  const themeIndex = Math.min(floorLevel - 1, 3);
  const theme = FLOOR_THEMES[themeIndex];

  const floorColorMap = derivePalette(FLOOR1_FLOOR_COLORS, theme.floorColor);
  const wallColorMap = derivePalette(FLOOR1_WALL_COLORS, theme.wallColor);

  const result: Record<number, SpriteFrame[]> = {
    ...tileSprites,
    [TileType.Floor]: [
      swapPalette(floor1A, floorColorMap),
      swapPalette(floor1B, floorColorMap),
    ],
    [TileType.Wall]: [swapPalette(wall1, wallColorMap)],
  };

  cache.set(floorLevel, result);
  return result;
}
