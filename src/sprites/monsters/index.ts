import type { SpriteSheet } from '../../utils/types';
import { duplicateCodeSprite } from './duplicateCode';
import { magicNumberSprite } from './magicNumber';
import { deadCodeSprite } from './deadCode';

export const monsterMapSprites: Record<string, SpriteSheet> = {
  duplicate_code: duplicateCodeSprite,
  magic_number: magicNumberSprite,
  dead_code: deadCodeSprite,
};
