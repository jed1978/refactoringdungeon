import type { CameraState, TileMap, Position } from '../utils/types';
import { Direction } from '../utils/types';
import { TILE_SIZE, VIEWPORT } from '../utils/constants';
import { renderTiles } from './TileRenderer';
import { renderLighting } from './LightingSystem';
import { renderFog } from './FogRenderer';
import { drawSprite, getAnimationFrame } from './SpriteRenderer';
import { playerMapSprite } from '../sprites/player';
import { monsterMapSprites } from '../sprites/monsters/index';

export type MapMonster = {
  readonly position: Position;
  readonly spriteId: string;
};

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
  readonly mapMonsters: readonly MapMonster[];
  readonly explored: readonly (readonly boolean[])[];
  readonly visibleSet: ReadonlySet<string>;
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

  // Draw monsters (only if visible)
  for (const monster of state.mapMonsters) {
    const key = `${monster.position.x},${monster.position.y}`;
    if (!state.visibleSet.has(key)) continue;

    const sheet = monsterMapSprites[monster.spriteId];
    if (!sheet) continue;

    const frame = getAnimationFrame(sheet, state.elapsedMs);
    const screenX = monster.position.x * TILE_SIZE - state.camera.x;
    const screenY = monster.position.y * TILE_SIZE - state.camera.y;
    drawSprite(ctx, frame, screenX, screenY, TILE_SIZE, TILE_SIZE);
  }

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

  // Draw fog of war (between tiles/sprites and lighting)
  renderFog(ctx, state.explored, state.visibleSet, state.camera);

  // Draw lighting overlay
  renderLighting(
    ctx,
    state.playerTileX,
    state.playerTileY,
    state.camera,
    state.elapsedMs,
  );
}
