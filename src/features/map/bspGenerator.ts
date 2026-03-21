import type { TileMap, Room, Position, FloorState, MonsterState } from '../../utils/types';
import { TileType, RoomType } from '../../utils/types';
import { FLOOR_THEMES } from '../../utils/constants';
import { createRng, randomInt } from '../../utils/random';
import { assignRoomTypes } from './roomAssigner';
import { validateMap } from './mapValidator';
import { populateRooms } from './roomPopulator';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const MIN_LEAF_SIZE = 8;
const MIN_ROOM_W = 5;
const MAX_ROOM_W = 10;
const MIN_ROOM_H = 5;
const MAX_ROOM_H = 8;
const CORRIDOR_WIDTH = 2;

type Leaf = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly left: Leaf | null;
  readonly right: Leaf | null;
  readonly room: { x: number; y: number; w: number; h: number } | null;
};

function createLeaf(x: number, y: number, w: number, h: number): Leaf {
  return { x, y, w, h, left: null, right: null, room: null };
}

function splitLeaf(leaf: Leaf, rng: () => number): Leaf {
  if (leaf.left !== null) return leaf;
  if (leaf.w < MIN_LEAF_SIZE * 2 && leaf.h < MIN_LEAF_SIZE * 2) return leaf;

  const splitH = leaf.w < MIN_LEAF_SIZE * 2
    ? true
    : leaf.h < MIN_LEAF_SIZE * 2
      ? false
      : rng() > 0.5;

  if (splitH) {
    if (leaf.h < MIN_LEAF_SIZE * 2) return leaf;
    const split = randomInt(rng, MIN_LEAF_SIZE, leaf.h - MIN_LEAF_SIZE);
    const left = createLeaf(leaf.x, leaf.y, leaf.w, split);
    const right = createLeaf(leaf.x, leaf.y + split, leaf.w, leaf.h - split);
    return { ...leaf, left: splitLeaf(left, rng), right: splitLeaf(right, rng) };
  } else {
    if (leaf.w < MIN_LEAF_SIZE * 2) return leaf;
    const split = randomInt(rng, MIN_LEAF_SIZE, leaf.w - MIN_LEAF_SIZE);
    const left = createLeaf(leaf.x, leaf.y, split, leaf.h);
    const right = createLeaf(leaf.x + split, leaf.y, leaf.w - split, leaf.h);
    return { ...leaf, left: splitLeaf(left, rng), right: splitLeaf(right, rng) };
  }
}

function carveRoomsInLeaf(
  leaf: Leaf,
  rng: () => number,
): Leaf {
  if (leaf.left && leaf.right) {
    return {
      ...leaf,
      left: carveRoomsInLeaf(leaf.left, rng),
      right: carveRoomsInLeaf(leaf.right, rng),
    };
  }

  const roomW = randomInt(rng, MIN_ROOM_W, Math.min(MAX_ROOM_W, leaf.w - 2));
  const roomH = randomInt(rng, MIN_ROOM_H, Math.min(MAX_ROOM_H, leaf.h - 2));
  const roomX = randomInt(rng, leaf.x + 1, leaf.x + leaf.w - roomW - 1);
  const roomY = randomInt(rng, leaf.y + 1, leaf.y + leaf.h - roomH - 1);

  return { ...leaf, room: { x: roomX, y: roomY, w: roomW, h: roomH } };
}

function collectRooms(leaf: Leaf): { x: number; y: number; w: number; h: number }[] {
  if (leaf.room) return [leaf.room];
  const rooms: { x: number; y: number; w: number; h: number }[] = [];
  if (leaf.left) rooms.push(...collectRooms(leaf.left));
  if (leaf.right) rooms.push(...collectRooms(leaf.right));
  return rooms;
}

function getRoomCenter(room: { x: number; y: number; w: number; h: number }): Position {
  return {
    x: Math.floor(room.x + room.w / 2),
    y: Math.floor(room.y + room.h / 2),
  };
}

function carveRoom(
  grid: TileType[][],
  room: { x: number; y: number; w: number; h: number },
): void {
  for (let y = room.y; y < room.y + room.h; y++) {
    for (let x = room.x; x < room.x + room.w; x++) {
      if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
        grid[y][x] = TileType.Floor;
      }
    }
  }
}

function carveCorridor(
  grid: TileType[][],
  from: Position,
  to: Position,
  rng: () => number,
): Position | null {
  let doorPos: Position | null = null;
  const goHorizontalFirst = rng() > 0.5;

  const carveH = (y: number, x1: number, x2: number) => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    for (let x = minX; x <= maxX; x++) {
      for (let dy = 0; dy < CORRIDOR_WIDTH; dy++) {
        const cy = y + dy;
        if (cy >= 0 && cy < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
          if (grid[cy][x] === TileType.Wall) {
            grid[cy][x] = TileType.Floor;
          }
        }
      }
    }
  };

  const carveV = (x: number, y1: number, y2: number) => {
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    for (let y = minY; y <= maxY; y++) {
      for (let dx = 0; dx < CORRIDOR_WIDTH; dx++) {
        const cx = x + dx;
        if (y >= 0 && y < MAP_HEIGHT && cx >= 0 && cx < MAP_WIDTH) {
          if (grid[y][cx] === TileType.Wall) {
            grid[y][cx] = TileType.Floor;
          }
        }
      }
    }
  };

  if (goHorizontalFirst) {
    carveH(from.y, from.x, to.x);
    carveV(to.x, from.y, to.y);
    doorPos = { x: to.x, y: from.y };
  } else {
    carveV(from.x, from.y, to.y);
    carveH(to.y, from.x, to.x);
    doorPos = { x: from.x, y: to.y };
  }

  return doorPos;
}

function connectLeaves(
  leaf: Leaf,
  grid: TileType[][],
  rng: () => number,
  doorPositions: Position[],
): void {
  if (!leaf.left || !leaf.right) return;

  connectLeaves(leaf.left, grid, rng, doorPositions);
  connectLeaves(leaf.right, grid, rng, doorPositions);

  const leftRooms = collectRooms(leaf.left);
  const rightRooms = collectRooms(leaf.right);

  if (leftRooms.length === 0 || rightRooms.length === 0) return;

  const leftRoom = leftRooms[randomInt(rng, 0, leftRooms.length - 1)];
  const rightRoom = rightRooms[randomInt(rng, 0, rightRooms.length - 1)];

  const from = getRoomCenter(leftRoom);
  const to = getRoomCenter(rightRoom);

  const doorPos = carveCorridor(grid, from, to, rng);
  if (doorPos) doorPositions.push(doorPos);
}

function placeDoors(
  grid: TileType[][],
  doorPositions: Position[],
  rooms: { x: number; y: number; w: number; h: number }[],
): void {
  for (const pos of doorPositions) {
    // Only place door if it's at a room entrance (adjacent to both room floor and corridor)
    const isAtRoomEdge = rooms.some(room => {
      const inRoom = pos.x >= room.x && pos.x < room.x + room.w
        && pos.y >= room.y && pos.y < room.y + room.h;
      const nearRoom = pos.x >= room.x - 1 && pos.x <= room.x + room.w
        && pos.y >= room.y - 1 && pos.y <= room.y + room.h;
      return !inRoom && nearRoom;
    });

    if (isAtRoomEdge && grid[pos.y]?.[pos.x] === TileType.Floor) {
      grid[pos.y][pos.x] = TileType.DoorLocked;
    }
  }
}

function buildGrid(
  rng: () => number,
): {
  tileMap: TileType[][];
  rooms: { x: number; y: number; w: number; h: number }[];
} {
  // Initialize grid with walls
  const grid: TileType[][] = Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => TileType.Wall),
  );

  // BSP split
  const root = splitLeaf(createLeaf(1, 1, MAP_WIDTH - 2, MAP_HEIGHT - 2), rng);
  const withRooms = carveRoomsInLeaf(root, rng);

  // Carve rooms
  const rawRooms = collectRooms(withRooms);
  for (const room of rawRooms) {
    carveRoom(grid, room);
  }

  // Connect rooms
  const doorPositions: Position[] = [];
  connectLeaves(withRooms, grid, rng, doorPositions);

  // Place doors
  placeDoors(grid, doorPositions, rawRooms);

  return { tileMap: grid, rooms: rawRooms };
}

export function generateFloor(floorLevel: number, seed: number): FloorState {
  const themeIndex = Math.min(floorLevel - 1, FLOOR_THEMES.length - 1);
  const theme = FLOOR_THEMES[themeIndex];

  // Try up to 5 seeds for a valid map
  for (let attempt = 0; attempt < 5; attempt++) {
    const rng = createRng(seed + attempt);
    const { tileMap, rooms: rawRooms } = buildGrid(rng);

    // Assign room types
    const typedRooms = assignRoomTypes(
      rawRooms.map(r => ({
        x: r.x,
        y: r.y,
        width: r.w,
        height: r.h,
        type: RoomType.Empty,
      })),
      rng,
    );

    const startRoom = typedRooms.find(r => r.type === RoomType.Start);
    const bossRoom = typedRooms.find(r => r.type === RoomType.Boss);

    if (!startRoom || !bossRoom) continue;

    const startPos: Position = {
      x: Math.floor(startRoom.x + startRoom.width / 2),
      y: Math.floor(startRoom.y + startRoom.height / 2),
    };
    const bossPos: Position = {
      x: Math.floor(bossRoom.x + bossRoom.width / 2),
      y: Math.floor(bossRoom.y + bossRoom.height / 2),
    };

    if (!validateMap(tileMap, startPos, bossPos)) continue;

    // Place stairs in boss room
    tileMap[bossPos.y][bossPos.x] = TileType.StairsDown;

    // Populate rooms with content
    const populated = populateRooms(tileMap, typedRooms, floorLevel, rng);

    const explored: boolean[][] = Array.from({ length: MAP_HEIGHT }, () =>
      Array.from({ length: MAP_WIDTH }, () => false),
    );

    return {
      level: floorLevel,
      theme,
      tileMap: populated.tileMap.map(row => [...row]),
      rooms: typedRooms,
      monsters: populated.monsters,
      explored: explored.map(row => [...row]),
    };
  }

  // Fallback: should never happen with 5 attempts
  throw new Error(`Failed to generate valid floor ${floorLevel}`);
}
