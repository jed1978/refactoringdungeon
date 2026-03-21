import type { CameraState, TileMap } from '../utils/types';
import { TileType } from '../utils/types';
import { TILE_SIZE, VIEWPORT } from '../utils/constants';
import { tileSprites } from '../sprites/tiles';
import { drawSprite } from './SpriteRenderer';

// Deterministic variant selection based on position
function getTileVariant(tileType: TileType, x: number, y: number): number {
  const sprites = tileSprites[tileType];
  if (!sprites || sprites.length <= 1) return 0;
  // Simple hash for deterministic variation
  return ((x * 7 + y * 13) & 0x7fffffff) % sprites.length;
}

export function renderTiles(
  ctx: CanvasRenderingContext2D,
  tileMap: TileMap,
  camera: CameraState,
): void {
  const startCol = Math.floor(camera.x / TILE_SIZE);
  const startRow = Math.floor(camera.y / TILE_SIZE);
  const endCol = startCol + VIEWPORT.widthTiles + 1;
  const endRow = startRow + VIEWPORT.heightTiles + 1;

  const offsetX = -(camera.x % TILE_SIZE);
  const offsetY = -(camera.y % TILE_SIZE);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const tileRow = tileMap[row];
      if (!tileRow) continue;
      const tile = tileRow[col];
      if (tile === undefined) continue;

      const sprites = tileSprites[tile];
      if (!sprites) continue;

      const variant = getTileVariant(tile, col, row);
      const frame = sprites[variant];

      const screenX = (col - startCol) * TILE_SIZE + offsetX;
      const screenY = (row - startRow) * TILE_SIZE + offsetY;

      drawSprite(ctx, frame, screenX, screenY, TILE_SIZE, TILE_SIZE);
    }
  }
}
