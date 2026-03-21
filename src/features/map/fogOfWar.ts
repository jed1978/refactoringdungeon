import type { Position } from '../../utils/types';
import { LIGHT_RADIUS_BRIGHT, LIGHT_RADIUS_DIM } from '../../utils/constants';

const VISIBILITY_RADIUS = LIGHT_RADIUS_BRIGHT + LIGHT_RADIUS_DIM;

export function getVisibleTiles(
  playerX: number,
  playerY: number,
): Position[] {
  const tiles: Position[] = [];
  const r = VISIBILITY_RADIUS;

  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        tiles.push({ x: playerX + dx, y: playerY + dy });
      }
    }
  }

  return tiles;
}

export function updateExplored(
  explored: readonly (readonly boolean[])[],
  visibleTiles: readonly Position[],
  mapWidth: number,
  mapHeight: number,
): readonly (readonly boolean[])[] {
  let changed = false;

  for (const tile of visibleTiles) {
    if (tile.x < 0 || tile.x >= mapWidth || tile.y < 0 || tile.y >= mapHeight) continue;
    if (!explored[tile.y][tile.x]) {
      changed = true;
      break;
    }
  }

  if (!changed) return explored;

  return explored.map((row, y) =>
    row.map((val, x) => {
      if (val) return true;
      return visibleTiles.some(t => t.x === x && t.y === y);
    }),
  );
}

export function isVisible(
  visibleSet: ReadonlySet<string>,
  x: number,
  y: number,
): boolean {
  return visibleSet.has(`${x},${y}`);
}

export function buildVisibleSet(visibleTiles: readonly Position[]): Set<string> {
  const set = new Set<string>();
  for (const t of visibleTiles) {
    set.add(`${t.x},${t.y}`);
  }
  return set;
}
