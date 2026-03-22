import type { Room } from "../../utils/types";
import { RoomType } from "../../utils/types";

function roomArea(room: Room): number {
  return room.width * room.height;
}

function roomDistance(a: Room, b: Room): number {
  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function assignRoomTypes(
  rooms: readonly Room[],
  rng: () => number,
): Room[] {
  if (rooms.length < 2) {
    return rooms.map((r) => ({ ...r, type: RoomType.Start }));
  }

  // Boss room: largest area
  const sortedByArea = [...rooms].sort((a, b) => roomArea(b) - roomArea(a));
  const bossRoom = sortedByArea[0];

  // Start room: smallest area, farthest from boss
  const candidates = sortedByArea.slice(Math.floor(sortedByArea.length / 2));
  const startRoom = candidates.reduce((best, room) =>
    roomDistance(room, bossRoom) > roomDistance(best, bossRoom) ? room : best,
  );

  // Assign remaining rooms
  const result: Room[] = rooms.map((room) => {
    if (room === bossRoom) return { ...room, type: RoomType.Boss };
    if (room === startRoom) return { ...room, type: RoomType.Start };

    const roll = rng();
    if (roll < 0.5) return { ...room, type: RoomType.Monster };
    if (roll < 0.65) return { ...room, type: RoomType.Event };
    if (roll < 0.75) return { ...room, type: RoomType.Treasure };
    if (roll < 0.8) return { ...room, type: RoomType.Shop };
    return { ...room, type: RoomType.Empty };
  });

  // Guarantee at least 1 Event and 1 Shop room
  const PROTECTED = new Set([RoomType.Start, RoomType.Boss, RoomType.Treasure]);
  const convertable = (type: RoomType) => !PROTECTED.has(type);

  function ensureRoomType(
    rooms: Room[],
    target: RoomType,
    rng: () => number,
  ): Room[] {
    if (rooms.some((r) => r.type === target)) return rooms;
    // Prefer Empty → Monster
    const emptyIdx = rooms.findIndex(
      (r) => r.type === RoomType.Empty && convertable(r.type),
    );
    const idx =
      emptyIdx >= 0
        ? emptyIdx
        : rooms.findIndex(
            (r) => r.type === RoomType.Monster && convertable(r.type),
          );
    if (idx < 0) return rooms;
    // Pick a random room among same-type candidates
    const candidates = rooms
      .map((r, i) => ({ r, i }))
      .filter(({ r }) =>
        emptyIdx >= 0 ? r.type === RoomType.Empty : r.type === RoomType.Monster,
      );
    const pick = candidates[Math.floor(rng() * candidates.length)];
    return rooms.map((r, i) => (i === pick.i ? { ...r, type: target } : r));
  }

  const withEvent = ensureRoomType(result, RoomType.Event, rng);
  const withShop = ensureRoomType(withEvent, RoomType.Shop, rng);
  return withShop;
}
