import type { Position, Room } from "../../utils/types";
import { TileType } from "../../utils/types";

function isPassable(tile: TileType, bossDoorPassable: boolean): boolean {
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
    (bossDoorPassable && tile === TileType.BossDoor) ||
    tile === TileType.DebtCollector ||
    tile === TileType.PairProgrammer ||
    tile === TileType.LegacyDocs ||
    tile === TileType.TrainingRoom
  );
}

function bfsReachable(
  tileMap: readonly (readonly TileType[])[],
  start: Position,
  bossDoorPassable: boolean,
): boolean[][] {
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
    for (const d of dirs) {
      const nx = pos.x + d.x;
      const ny = pos.y + d.y;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (visited[ny][nx]) continue;
      if (!isPassable(tileMap[ny][nx], bossDoorPassable)) continue;
      visited[ny][nx] = true;
      queue.push({ x: nx, y: ny });
    }
  }

  return visited;
}

export function validateMap(
  tileMap: readonly (readonly TileType[])[],
  start: Position,
  rooms: readonly Pick<Room, "x" | "y" | "width" | "height">[],
): boolean {
  // Pass 1: BossDoor passable — ensures boss room center is reachable
  const withDoor = bfsReachable(tileMap, start, true);
  for (const room of rooms) {
    const cx = Math.floor(room.x + room.width / 2);
    const cy = Math.floor(room.y + room.height / 2);
    if (!withDoor[cy]?.[cx]) return false;
  }

  return true;
}

/**
 * Extra validation: all given rooms must be reachable WITHOUT passing through
 * BossDoor tiles. Prevents deadlocks where a non-boss monster can only be
 * reached by going through the locked BossDoor.
 */
export function validateMapNoBossDoor(
  tileMap: readonly (readonly TileType[])[],
  start: Position,
  rooms: readonly Pick<Room, "x" | "y" | "width" | "height">[],
): boolean {
  const visited = bfsReachable(tileMap, start, false);
  for (const room of rooms) {
    const cx = Math.floor(room.x + room.width / 2);
    const cy = Math.floor(room.y + room.height / 2);
    if (!visited[cy]?.[cx]) return false;
  }
  return true;
}
