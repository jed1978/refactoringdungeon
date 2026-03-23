import type {
  TileMap,
  Position,
  MonsterState,
  Direction,
} from "../../utils/types";
import { TileType } from "../../utils/types";

export type InteractionResult =
  | { readonly kind: "none" }
  | { readonly kind: "chest"; readonly position: Position }
  | {
      readonly kind: "monster";
      readonly monsterIndex: number;
      readonly monster: MonsterState;
    }
  | { readonly kind: "stairs" }
  | {
      readonly kind: "event";
      readonly tileType: TileType;
      readonly position: Position;
    }
  | { readonly kind: "door_locked"; readonly position: Position }
  | { readonly kind: "boss_door"; readonly position: Position }
  | { readonly kind: "shop"; readonly position: Position }
  | { readonly kind: "training"; readonly position: Position };

const WALKABLE_TILES: ReadonlySet<TileType> = new Set([
  TileType.Floor,
  TileType.DoorOpen,
  TileType.StairsDown,
  TileType.ChestOpen,
]);

export function isWalkable(tileMap: TileMap, x: number, y: number): boolean {
  const row = tileMap[y];
  if (!row) return false;
  const tile = row[x];
  return WALKABLE_TILES.has(tile);
}

export function checkTileInteraction(
  tileMap: TileMap,
  monsters: readonly MonsterState[],
  playerPos: Position,
): InteractionResult {
  // Check monster collision
  const monsterIndex = monsters.findIndex(
    (m) => m.position.x === playerPos.x && m.position.y === playerPos.y,
  );
  if (monsterIndex >= 0) {
    return { kind: "monster", monsterIndex, monster: monsters[monsterIndex] };
  }

  const tile = tileMap[playerPos.y]?.[playerPos.x];
  if (tile === undefined) return { kind: "none" };

  switch (tile) {
    case TileType.StairsDown:
      return { kind: "stairs" };
    default:
      return { kind: "none" };
  }
}

export function checkFacingTile(
  tileMap: TileMap,
  playerPos: Position,
  direction: Direction,
): InteractionResult {
  const dirMap: Record<number, Position> = {
    0: { x: 0, y: 1 }, // Down
    1: { x: 0, y: -1 }, // Up
    2: { x: -1, y: 0 }, // Left
    3: { x: 1, y: 0 }, // Right
  };

  const delta = dirMap[direction] ?? { x: 0, y: 0 };
  const facingPos: Position = {
    x: playerPos.x + delta.x,
    y: playerPos.y + delta.y,
  };

  const tile = tileMap[facingPos.y]?.[facingPos.x];
  if (tile === undefined) return { kind: "none" };

  switch (tile) {
    case TileType.ChestClosed:
      return { kind: "chest", position: facingPos };
    case TileType.DoorLocked:
      return { kind: "door_locked", position: facingPos };
    case TileType.Shrine:
    case TileType.Bookshelf:
    case TileType.CoffeeMachine:
    case TileType.DebtCollector:
    case TileType.PairProgrammer:
    case TileType.LegacyDocs:
      return { kind: "event", tileType: tile, position: facingPos };
    case TileType.BossDoor:
      return { kind: "boss_door", position: facingPos };
    case TileType.ShopCounter:
      return { kind: "shop", position: facingPos };
    case TileType.TrainingRoom:
      return { kind: "training", position: facingPos };
    default:
      return { kind: "none" };
  }
}
