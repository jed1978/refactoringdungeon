import type { CameraState } from '../utils/types';
import { CAMERA_LERP_SPEED, TILE_SIZE, VIEWPORT } from '../utils/constants';

export function createCamera(x: number, y: number): CameraState {
  return { x, y, targetX: x, targetY: y };
}

export function setCameraTarget(
  camera: CameraState,
  targetTileX: number,
  targetTileY: number,
): CameraState {
  // Center the camera on the target tile
  const targetX = targetTileX * TILE_SIZE - (VIEWPORT.logicalWidth / 2) + (TILE_SIZE / 2);
  const targetY = targetTileY * TILE_SIZE - (VIEWPORT.logicalHeight / 2) + (TILE_SIZE / 2);
  return { ...camera, targetX, targetY };
}

export function updateCamera(
  camera: CameraState,
  dt: number,
  mapWidthTiles: number,
  mapHeightTiles: number,
): CameraState {
  const lerpFactor = 1 - Math.pow(1 - CAMERA_LERP_SPEED, dt * 60 / 1000);

  let newX = camera.x + (camera.targetX - camera.x) * lerpFactor;
  let newY = camera.y + (camera.targetY - camera.y) * lerpFactor;

  // Clamp to map bounds
  const maxX = mapWidthTiles * TILE_SIZE - VIEWPORT.logicalWidth;
  const maxY = mapHeightTiles * TILE_SIZE - VIEWPORT.logicalHeight;
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  return { ...camera, x: newX, y: newY };
}
