import type { CameraState, TileMap } from '../utils/types';
import { Direction } from '../utils/types';
import { TILE_SIZE, VIEWPORT } from '../utils/constants';
import { renderTiles } from './TileRenderer';
import { renderLighting } from './LightingSystem';
import { drawSprite, getAnimationFrame } from './SpriteRenderer';
import { playerMapSprite } from '../sprites/player';

export type ExplorationRenderState = {
  readonly tileMap: TileMap;
  readonly playerTileX: number;
  readonly playerTileY: number;
  readonly playerPixelX: number;
  readonly playerPixelY: number;
  readonly playerDirection: Direction;
  readonly playerIsMoving: boolean;
  readonly camera: CameraState;
  readonly elapsedMs: number;
};

function getPlayerSpriteKey(direction: Direction, isMoving: boolean): string {
  const dirName = direction === Direction.Down ? 'down'
    : direction === Direction.Up ? 'up'
    : 'left'; // Left and Right both use 'left' (right is flipped)

  return isMoving ? `${dirName}Walk` : `${dirName}Idle`;
}

export function renderExploration(
  ctx: CanvasRenderingContext2D,
  state: ExplorationRenderState,
): void {
  const { logicalWidth, logicalHeight } = VIEWPORT;

  // Clear
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

  // Fill background with black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Draw tiles
  renderTiles(ctx, state.tileMap, state.camera);

  // Draw player
  const spriteKey = getPlayerSpriteKey(state.playerDirection, state.playerIsMoving);
  const sheet = playerMapSprite[spriteKey];
  if (sheet) {
    const frame = getAnimationFrame(sheet, state.elapsedMs);
    const screenX = state.playerPixelX - state.camera.x;
    const screenY = state.playerPixelY - state.camera.y;
    const flip = state.playerDirection === Direction.Right;
    drawSprite(ctx, frame, screenX, screenY, TILE_SIZE, TILE_SIZE, flip);
  }

  // Draw lighting overlay
  renderLighting(
    ctx,
    state.playerTileX,
    state.playerTileY,
    state.camera,
    state.elapsedMs,
  );
}
