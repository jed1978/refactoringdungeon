import { Direction } from '../../utils/types';

export function computeTouchDirection(
  tapX: number,
  tapY: number,
  playerScreenX: number,
  playerScreenY: number,
): Direction | null {
  const dx = tapX - playerScreenX;
  const dy = tapY - playerScreenY;

  // Dead zone: ignore taps too close to player
  if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return null;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Direction.Right : Direction.Left;
  } else {
    return dy > 0 ? Direction.Down : Direction.Up;
  }
}
