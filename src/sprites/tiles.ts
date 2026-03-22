import type { SpriteFrame } from "../utils/types";
import { TileType } from "../utils/types";
import { floor1A, floor1B, wall1, voidTile } from "./tileFloor";
import { doorLocked, doorOpen, bossDoor } from "./tileDoors";
import {
  stairsDown,
  chestClosed,
  chestOpen,
  shrine,
  bookshelf,
  coffeeMachine,
  npcMarker,
  shopCounter,
  debtCollector,
  pairProgrammer,
  legacyDocs,
} from "./tileObjects";

export { floor1A, floor1B, wall1, voidTile } from "./tileFloor";
export { doorLocked, doorOpen, bossDoor } from "./tileDoors";
export {
  stairsDown,
  chestClosed,
  chestOpen,
  shrine,
  bookshelf,
  coffeeMachine,
  npcMarker,
  shopCounter,
  debtCollector,
  pairProgrammer,
  legacyDocs,
} from "./tileObjects";

// Map tile type to sprite frame(s)
export const tileSprites: Record<number, SpriteFrame[]> = {
  [TileType.Void]: [voidTile],
  [TileType.Floor]: [floor1A, floor1B],
  [TileType.Wall]: [wall1],
  [TileType.DoorLocked]: [doorLocked],
  [TileType.DoorOpen]: [doorOpen],
  [TileType.StairsDown]: [stairsDown],
  [TileType.ChestClosed]: [chestClosed],
  [TileType.ChestOpen]: [chestOpen],
  [TileType.ShopCounter]: [shopCounter],
  [TileType.Shrine]: [shrine],
  [TileType.Bookshelf]: [bookshelf],
  [TileType.CoffeeMachine]: [coffeeMachine],
  [TileType.NpcMarker]: [npcMarker],
  [TileType.BossDoor]: [bossDoor],
  [TileType.DebtCollector]: [debtCollector],
  [TileType.PairProgrammer]: [pairProgrammer],
  [TileType.LegacyDocs]: [legacyDocs],
};
