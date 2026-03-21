import type { SpriteSheet } from '../../utils/types';
import { duplicateCodeBattleSprite } from './duplicateCodeBattle';
import { magicNumberBattleSprite } from './magicNumberBattle';
import { deadCodeBattleSprite } from './deadCodeBattle';
import { spaghettiCodeBattleSprite } from './spaghettiCodeBattle';
import { longMethodBattleSprite } from './longMethodBattle';
import { featureEnvyBattleSprite } from './featureEnvyBattle';
import { shotgunSurgeryBattleSprite } from './shotgunSurgeryBattle';
import { circularDependencyBattleSprite } from './circularDependencyBattle';
import { nPlusOneBattleSprite } from './nPlusOneBattle';
import { prematureOptimizationBattleSprite } from './prematureOptimizationBattle';
import { leakyAbstractionBattleSprite } from './leakyAbstractionBattle';
import { bigBallOfMudBattleSprite } from './bigBallOfMudBattle';
import { dataClumpBattleSprite } from './dataClumpBattle';
import { lazyClassBattleSprite } from './lazyClassBattle';
import { godClassBattleSprite } from './godClassBattle';

export const monsterBattleSprites: Record<string, Record<string, SpriteSheet>> = {
  duplicate_code: duplicateCodeBattleSprite,
  magic_number: magicNumberBattleSprite,
  dead_code: deadCodeBattleSprite,
  spaghetti_code: spaghettiCodeBattleSprite,
  long_method: longMethodBattleSprite,
  feature_envy: featureEnvyBattleSprite,
  shotgun_surgery: shotgunSurgeryBattleSprite,
  circular_dependency: circularDependencyBattleSprite,
  n_plus_one: nPlusOneBattleSprite,
  premature_optimization: prematureOptimizationBattleSprite,
  leaky_abstraction: leakyAbstractionBattleSprite,
  big_ball_of_mud: bigBallOfMudBattleSprite,
  data_clump: dataClumpBattleSprite,
  lazy_class: lazyClassBattleSprite,
  god_class: godClassBattleSprite,
};
