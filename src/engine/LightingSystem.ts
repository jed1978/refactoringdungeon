import type { CameraState } from '../utils/types';
import { TILE_SIZE, LIGHT_RADIUS_BRIGHT, LIGHT_RADIUS_DIM, LIGHT_FLICKER_AMPLITUDE } from '../utils/constants';
import { VIEWPORT } from '../utils/constants';

// Simple noise for torch flicker
function flickerNoise(time: number): number {
  return Math.sin(time * 3.7) * 0.5
    + Math.sin(time * 5.3) * 0.3
    + Math.sin(time * 11.1) * 0.2;
}

export function renderLighting(
  ctx: CanvasRenderingContext2D,
  playerTileX: number,
  playerTileY: number,
  camera: CameraState,
  elapsedMs: number,
): void {
  const { logicalWidth, logicalHeight } = VIEWPORT;

  // Player screen position (center of tile)
  const playerScreenX = playerTileX * TILE_SIZE - camera.x + TILE_SIZE / 2;
  const playerScreenY = playerTileY * TILE_SIZE - camera.y + TILE_SIZE / 2;

  // Flicker
  const flicker = flickerNoise(elapsedMs / 1000) * LIGHT_FLICKER_AMPLITUDE;
  const brightRadius = (LIGHT_RADIUS_BRIGHT + flicker) * TILE_SIZE;
  const totalRadius = (LIGHT_RADIUS_BRIGHT + LIGHT_RADIUS_DIM + flicker) * TILE_SIZE;

  // Create lighting overlay on an offscreen canvas
  const lightCanvas = new OffscreenCanvas(logicalWidth, logicalHeight);
  const lctx = lightCanvas.getContext('2d')!;

  // Fill with darkness
  lctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  lctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Cut out light area using 'destination-out'
  lctx.globalCompositeOperation = 'destination-out';

  const gradient = lctx.createRadialGradient(
    playerScreenX, playerScreenY, 0,
    playerScreenX, playerScreenY, totalRadius,
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
  gradient.addColorStop(brightRadius / totalRadius, 'rgba(0, 0, 0, 0.8)');
  gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  lctx.fillStyle = gradient;
  lctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Draw overlay onto main canvas
  lctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(lightCanvas, 0, 0);
}
