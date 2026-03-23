import type { MonsterDef } from "../../utils/types";
import {
  FLOOR1_MONSTERS,
  FLOOR2_MONSTERS,
  FLOOR3_MONSTERS,
  FLOOR4_MONSTERS,
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
