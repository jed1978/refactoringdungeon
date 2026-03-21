import type { Room, MonsterState, Position } from '../../utils/types';
import { TileType, RoomType } from '../../utils/types';
import { randomInt } from '../../utils/random';
import { getMonsterPool } from './monsterPools';

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

export function populateRooms(
  tileMap: TileType[][],
  rooms: readonly Room[],
  floorLevel: number,
  rng: () => number,
): PopulateResult {
  const monsters: MonsterState[] = [];
  const pool = getMonsterPool(floorLevel);
  const occupied = new Set<string>();

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
        // Place a random event object at center
        const eventTiles = [
          TileType.Shrine,
          TileType.Bookshelf,
          TileType.CoffeeMachine,
        ];
        const tile = eventTiles[randomInt(rng, 0, eventTiles.length - 1)];
        if (tileMap[center.y]?.[center.x] === TileType.Floor) {
          tileMap[center.y][center.x] = tile;
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
        // Place boss monster at center (stairs already placed by generator)
        const bossMonster = pool[pool.length - 1]; // Use last monster as mini-boss
        const bossPos = randomFloorPosition(room, tileMap, rng, occupied);
        if (bossPos) {
          monsters.push({
            def: { ...bossMonster, hp: bossMonster.hp * 3, atk: bossMonster.atk * 2 },
            currentHp: bossMonster.hp * 3,
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
