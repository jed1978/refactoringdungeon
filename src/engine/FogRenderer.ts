import type { CameraState } from '../utils/types';
import { TILE_SIZE, VIEWPORT } from '../utils/constants';

export function renderFog(
  ctx: CanvasRenderingContext2D,
  explored: readonly (readonly boolean[])[],
  visibleSet: ReadonlySet<string>,
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
      if (row < 0 || row >= explored.length) continue;
      if (col < 0 || col >= (explored[0]?.length ?? 0)) continue;

      const screenX = (col - startCol) * TILE_SIZE + offsetX;
      const screenY = (row - startRow) * TILE_SIZE + offsetY;

      const key = `${col},${row}`;
      const isExplored = explored[row]?.[col] ?? false;
      const isCurrentlyVisible = visibleSet.has(key);

      if (!isExplored) {
        // Unexplored: opaque black
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      } else if (!isCurrentlyVisible) {
        // Explored but not visible: dim overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
      // Visible: no overlay (handled by lighting system)
    }
  }
}
