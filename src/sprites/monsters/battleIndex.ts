import type { SpriteSheet } from '../../utils/types';
import { duplicateCodeBattleSprite } from './duplicateCodeBattle';
import { magicNumberBattleSprite } from './magicNumberBattle';
import { deadCodeBattleSprite } from './deadCodeBattle';
import { spaghettiCodeBattleSprite } from './spaghettiCodeBattle';

export const monsterBattleSprites: Record<string, Record<string, SpriteSheet>> = {
  duplicate_code: duplicateCodeBattleSprite,
  magic_number: magicNumberBattleSprite,
  dead_code: deadCodeBattleSprite,
  spaghetti_code: spaghettiCodeBattleSprite,
};
