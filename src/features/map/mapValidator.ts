import type { Position } from "../../utils/types";
import { TileType } from "../../utils/types";

function isPassable(tile: TileType): boolean {
  return (
    tile === TileType.Floor ||
    tile === TileType.DoorLocked ||
    tile === TileType.DoorOpen ||
    tile === TileType.StairsDown ||
    tile === TileType.ChestClosed ||
    tile === TileType.ChestOpen ||
    tile === TileType.Shrine ||
    tile === TileType.Bookshelf ||
    tile === TileType.CoffeeMachine ||
    tile === TileType.NpcMarker ||
    tile === TileType.ShopCounter ||
    tile === TileType.BossDoor
  );
}

export function validateMap(
  tileMap: readonly (readonly TileType[])[],
  start: Position,
  boss: Position,
): boolean {
  const height = tileMap.length;
  const width = tileMap[0]?.length ?? 0;

  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false),
  );

  const queue: Position[] = [start];
  visited[start.y][start.x] = true;

  const dirs = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  while (queue.length > 0) {
    const pos = queue.shift()!;

    if (pos.x === boss.x && pos.y === boss.y) return true;

    for (const d of dirs) {
      const nx = pos.x + d.x;
      const ny = pos.y + d.y;

      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (visited[ny][nx]) continue;

      const tile = tileMap[ny][nx];
      if (!isPassable(tile)) continue;

      visited[ny][nx] = true;
      queue.push({ x: nx, y: ny });
    }
  }

  return false;
}
