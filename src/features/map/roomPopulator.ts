import type { Room, MonsterState, Position } from "../../utils/types";
import { TileType, RoomType } from "../../utils/types";
import { randomInt } from "../../utils/random";
import { getMonsterPool } from "./monsterPools";
import {
  FLOOR1_BOSS,
  FLOOR2_BOSS,
  FLOOR3_BOSS,
  FLOOR4_BOSS,
} from "../../data/monsters";
import type { MonsterDef } from "../../utils/types";

type PopulateResult = {
  readonly tileMap: TileType[][];
  readonly monsters: MonsterState[];
};

function roomCenter(room: Room): Position {
  return {
    x: Math.floor(room.x + room.width / 2),
    y: Math.floor(room.y + room.height / 2),
  };
}

function randomFloorPosition(
  room: Room,
  tileMap: readonly (readonly TileType[])[],
  rng: () => number,
  occupied: Set<string>,
): Position | null {
  // Try up to 20 times to find a free floor tile in the room
  for (let i = 0; i < 20; i++) {
    const x = randomInt(rng, room.x + 1, room.x + room.width - 2);
    const y = randomInt(rng, room.y + 1, room.y + room.height - 2);
    const key = `${x},${y}`;

    if (tileMap[y]?.[x] === TileType.Floor && !occupied.has(key)) {
      occupied.add(key);
      return { x, y };
    }
  }
  return null;
}

export function getBossForFloor(floorLevel: number): MonsterDef {
  switch (floorLevel) {
    case 1:
      return FLOOR1_BOSS;
    case 2:
      return FLOOR2_BOSS;
    case 3:
      return FLOOR3_BOSS;
    case 4:
      return FLOOR4_BOSS;
    default:
      return FLOOR4_BOSS;
  }
}

const ALL_EVENT_TILES = [
  TileType.Shrine,
  TileType.Bookshelf,
  TileType.CoffeeMachine,
] as const;

export function populateRooms(
  tileMap: TileType[][],
  rooms: readonly Room[],
  floorLevel: number,
  rng: () => number,
): PopulateResult {
  const monsters: MonsterState[] = [];
  const pool = getMonsterPool(floorLevel);
  const occupied = new Set<string>();
  const usedEvents = new Set<TileType>();

  for (const room of rooms) {
    const center = roomCenter(room);

    switch (room.type) {
      case RoomType.Monster: {
        const count = randomInt(rng, 1, 3);
        for (let i = 0; i < count; i++) {
          const pos = randomFloorPosition(room, tileMap, rng, occupied);
          if (!pos) continue;
          const def = pool[randomInt(rng, 0, pool.length - 1)];
          monsters.push({
            def,
            currentHp: def.hp,
            position: pos,
            buffs: [],
          });
        }
        break;
      }

      case RoomType.Event: {
        const remaining = ALL_EVENT_TILES.filter((t) => !usedEvents.has(t));
        if (remaining.length === 0) break; // all 3 used, leave as empty
        const tile = remaining[randomInt(rng, 0, remaining.length - 1)];
        if (tileMap[center.y]?.[center.x] === TileType.Floor) {
          tileMap[center.y][center.x] = tile;
          usedEvents.add(tile);
        }
        break;
      }

      case RoomType.Treasure: {
        if (tileMap[center.y]?.[center.x] === TileType.Floor) {
          tileMap[center.y][center.x] = TileType.ChestClosed;
        }
        break;
      }

      case RoomType.Shop: {
        if (tileMap[center.y]?.[center.x] === TileType.Floor) {
          tileMap[center.y][center.x] = TileType.ShopCounter;
        }
        break;
      }

      case RoomType.Boss: {
        const boss = getBossForFloor(floorLevel);
        const bossPos = randomFloorPosition(room, tileMap, rng, occupied);
        if (bossPos) {
          monsters.push({
            def: boss,
            currentHp: boss.hp,
            position: bossPos,
            buffs: [],
          });
        }
        break;
      }

      // Start and Empty rooms get nothing
      default:
        break;
    }
  }

  return { tileMap, monsters };
}
