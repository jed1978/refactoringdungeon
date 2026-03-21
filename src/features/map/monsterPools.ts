import type { MonsterDef } from '../../utils/types';
import { FLOOR1_MONSTERS } from '../../data/monsters';

export function getMonsterPool(floorLevel: number): readonly MonsterDef[] {
  switch (floorLevel) {
    case 1:
      return FLOOR1_MONSTERS;
    // Future floors will add more monster pools
    default:
      return FLOOR1_MONSTERS;
  }
}
