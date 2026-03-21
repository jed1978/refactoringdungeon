import type { MonsterDef } from "../../utils/types";
import {
  FLOOR1_MONSTERS,
  FLOOR2_MONSTERS,
  FLOOR3_MONSTERS,
  FLOOR4_MONSTERS,
  FLOOR1_BOSS,
  FLOOR2_BOSS,
  FLOOR3_BOSS,
  FLOOR4_BOSS,
} from "../../data/monsters";

export function getMonsterPool(floorLevel: number): readonly MonsterDef[] {
  switch (floorLevel) {
    case 1:
      return FLOOR1_MONSTERS;
    case 2:
      return FLOOR2_MONSTERS;
    case 3:
      return FLOOR3_MONSTERS;
    case 4:
      return FLOOR4_MONSTERS;
    default:
      return FLOOR4_MONSTERS;
  }
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
      return FLOOR1_BOSS;
  }
}
