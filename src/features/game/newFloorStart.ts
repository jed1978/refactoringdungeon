import type { Position } from "../../utils/types";
import type { DungeonFloor } from "../../utils/types";
import { generateFloor } from "../map/bspGenerator";

export function createNewFloorStart(): {
  floor: DungeonFloor;
  startPos: Position;
} {
  const seed = Date.now();
  const floor = generateFloor(1, seed);
  const startRoom = floor.rooms.find((r) => r.type === "start");
  const startPos: Position = startRoom
    ? {
        x: Math.floor(startRoom.x + startRoom.width / 2),
        y: Math.floor(startRoom.y + startRoom.height / 2),
      }
    : { x: 5, y: 5 };
  return { floor, startPos };
}
